// @vitest-environment node
/** The quote form handler: Turnstile, the dashboard copy, and the emails. */
import { afterEach, describe, expect, it } from 'vitest';
import { handleSubmit } from '../api/submit-contact-form';
import type { D1Database, Env } from './bindings';
import { readEnquiry } from './enquiries';

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function post(body: unknown) {
  return new Request('https://www.balustrading.co.nz/api/submit-contact-form', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

const GOOD = {
  name: 'Daniel Reeves',
  phone: '021 123 4567',
  email: 'daniel@example.com',
  message: 'Company Name: N/A\nName: Daniel Reeves',
  captchaToken: 'tok',
  kind: 'balustrade',
  source: 'quote-form',
  fields: { siteAddress: '14 Kauri Road', siteSuburb: 'Titirangi', sitePostcode: '0604', buildingType: 'Residential', protectingFall: 'Yes, balustrading IS preventing a fall', otherNotes: 'New deck' },
};

function fakeDb() {
  const writes: { sql: string; args: unknown[] }[] = [];
  const statement = (sql: string, args: unknown[]) => ({
    bind: (...more: unknown[]) => statement(sql, [...args, ...more]),
    first: async () => null,
    all: async () => ({ results: [], success: true }),
    run: async () => {
      writes.push({ sql, args });
      return { success: true };
    },
  });
  return { db: { prepare: (sql: string) => statement(sql, []) } as unknown as D1Database, writes };
}

function mockFetch(reply: (url: string, init: RequestInit) => { status?: number; body?: unknown }) {
  const calls: { url: string; body: unknown }[] = [];
  globalThis.fetch = (async (url: string | URL | Request, init: RequestInit = {}) => {
    const u = String(url);
    const body = init.body ? (typeof init.body === 'string' && init.body.startsWith('{') ? JSON.parse(init.body) : String(init.body)) : null;
    calls.push({ url: u, body });
    const r = reply(u, init);
    return new Response(JSON.stringify(r.body ?? {}), { status: r.status || 200, headers: { 'Content-Type': 'application/json' } });
  }) as typeof fetch;
  return calls;
}

describe('readEnquiry', () => {
  it('tidies the fields and lifts the site address out', () => {
    const q = readEnquiry({ ...GOOD, fields: { ...GOOD.fields, companyName: '  Lee Build ', 'bad key!': 'x', empty: '' } });
    expect(q.kind).toBe('balustrade');
    expect(q.company).toBe('Lee Build');
    expect(q.siteAddress).toBe('14 Kauri Road');
    expect(q.suburb).toBe('Titirangi');
    expect(q.fields.badkey).toBe('x');
    expect('empty' in q.fields).toBe(false);
    expect(q.photo).toBeNull();
  });

  it('defaults the kind and source, and flags an oversized photo', () => {
    const q = readEnquiry({ name: 'A', email: 'a@b.c', phone: '1', message: 'm', captchaToken: 't', photo: { content: 'A'.repeat(7 * 1024 * 1024), filename: 'big.jpg', type: 'image/jpeg' } });
    expect(q.kind).toBe('balustrade');
    expect(q.source).toBe('quote-form');
    expect(q.photo?.tooBig).toBe(true);
    expect(readEnquiry({ kind: 'heatpump' }).source).toBe('heatpump-form');
  });
});

describe('handleSubmit', () => {
  it('needs the contact details, a message and the captcha token', async () => {
    const res = await handleSubmit(post({ ...GOOD, phone: '' }), {});
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Missing required fields');
    expect((await handleSubmit(new Request('https://x/api', { method: 'POST', body: 'nope' }), {})).status).toBe(400);
  });

  it('refuses a failed Turnstile check before touching anything', async () => {
    const { db, writes } = fakeDb();
    const calls = mockFetch((u) => (/turnstile/.test(u) ? { body: { success: false } } : { body: {} }));
    const res = await handleSubmit(post(GOOD), { TURNSTILE_SECRET_KEY: 's', RESEND_API_KEY: 'r', DB: db });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('CAPTCHA verification failed');
    expect(calls).toHaveLength(1);
    expect(writes).toHaveLength(0);
  });

  it('keeps the enquiry, emails the office with the number, and emails the customer', async () => {
    const { db, writes } = fakeDb();
    const put: string[] = [];
    const env: Env = { TURNSTILE_SECRET_KEY: 's', RESEND_API_KEY: 'r', DB: db, FILES_KV: { put: async (key: string) => { put.push(key); } } as never };
    const calls = mockFetch((u) => (/turnstile/.test(u) ? { body: { success: true } } : { body: { id: 'email' } }));
    const res = await handleSubmit(post({ ...GOOD, photo: { content: btoa('jpegbytes'), filename: 'deck photo.jpg', type: 'image/jpeg' } }), env);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.enquiryId).toMatch(/^BC-\d{8}-[A-Z2-9]{4}$/);

    const insert = writes.find((w) => /INSERT INTO enquiries/.test(w.sql))!;
    expect(insert.args[0]).toBe(data.enquiryId);
    expect(insert.args[2]).toBe('balustrade');
    expect(insert.args[8]).toBe('14 Kauri Road');
    expect(JSON.parse(insert.args[11] as string).buildingType).toBe('Residential');
    expect(JSON.parse(insert.args[13] as string)).toMatchObject({ filename: 'deck_photo.jpg', bytes: 9, type: 'image/jpeg' });
    expect(put[0]).toBe(`enquiries/${data.enquiryId}/deck_photo.jpg`);
    expect(writes.some((w) => /UPDATE enquiries SET emailed = 1/.test(w.sql))).toBe(true);

    const emails = calls.filter((c) => /resend/.test(c.url)).map((c) => c.body as Record<string, unknown>);
    expect(emails).toHaveLength(2);
    expect(emails[0].to).toEqual(['admin@balustrading.co.nz']);
    expect(emails[0].reply_to).toBe('daniel@example.com');
    expect(emails[0].subject).toBe(`New Quote Request from Daniel Reeves (${data.enquiryId})`);
    expect(String(emails[0].html)).toContain('Protecting a fall');
    expect(String(emails[0].html)).toContain(`/admin/enquiries?open=${data.enquiryId}`);
    expect((emails[0].attachments as { filename: string }[])[0].filename).toBe('deck photo.jpg');
    expect(emails[1].to).toEqual(['daniel@example.com']);
    expect(String(emails[1].html)).toContain('Thanks, Daniel');
  });

  it('still answers success when there is no database, as long as the email went', async () => {
    mockFetch((u) => (/turnstile/.test(u) ? { body: { success: true } } : { body: { id: 'email' } }));
    const res = await handleSubmit(post(GOOD), { TURNSTILE_SECRET_KEY: 's', RESEND_API_KEY: 'r' });
    expect(res.status).toBe(200);
    expect((await res.json()).enquiryId).toBeNull();
  });

  it('tells the customer when neither the email nor the copy worked', async () => {
    mockFetch((u) => (/turnstile/.test(u) ? { body: { success: true } } : { status: 500, body: { message: 'nope' } }));
    const res = await handleSubmit(post(GOOD), { TURNSTILE_SECRET_KEY: 's', RESEND_API_KEY: 'r' });
    expect(res.status).toBe(502);
  });
});
