/**
 * Quote enquiries: what the website forms send, how they are kept for the
 * dashboard, and the emails that go out. Used by the quote form function
 * (functions/api/submit-contact-form.ts) and the admin API.
 */

import type { D1Database, Env } from './bindings';
import { fileStore } from './files';
import { base64ToBytes, esc, parseJson } from './util';

export const ENQUIRY_STATUSES = ['new', 'contacted', 'survey', 'quoted', 'won', 'lost', 'closed'] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_KINDS = ['balustrade', 'heatpump'] as const;
export type EnquiryKind = (typeof ENQUIRY_KINDS)[number];

/** 5MB, matching what the forms allow before uploading. */
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_FIELD_LENGTH = 2000;
const MAX_FIELDS = 40;

/** The extra form fields, in the order they read best, with their labels. */
export const FIELD_LABELS: Record<string, string> = {
  companyName: 'Company',
  siteAddress: 'Site address',
  siteSuburb: 'Suburb',
  sitePostcode: 'Postcode',
  buildingType: 'Building type',
  location: 'Location',
  protectingFall: 'Protecting a fall',
  balustradeHeight: 'Balustrade height',
  totalLinealMetres: 'Lineal metres',
  requiredDate: 'Needed by',
  style: 'Cover style',
  colour: 'Powdercoat colour',
  requirement: 'Requirement',
  quantity: 'Quantity',
  unitWidth: 'Unit width (mm)',
  unitDepth: 'Unit depth (mm)',
  unitHeight: 'Unit height (mm)',
  knownSize: 'Cover size',
  otherNotes: 'Notes',
};

export interface EnquiryPhotoInput {
  name: string;
  type: string;
  data: string;
  tooBig?: boolean;
}

export interface EnquiryInput {
  kind: EnquiryKind;
  source: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  siteAddress: string;
  suburb: string;
  postcode: string;
  fields: Record<string, string>;
  message: string;
  captchaToken: string;
  photo: EnquiryPhotoInput | null;
}

export interface EnquiryPhoto {
  filename: string;
  key: string;
  bytes: number;
  type: string;
}

export interface Enquiry {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  kind: EnquiryKind;
  source: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  siteAddress: string | null;
  suburb: string | null;
  postcode: string | null;
  fields: Record<string, string>;
  message: string | null;
  photo: EnquiryPhoto | null;
  status: EnquiryStatus;
  notes: string | null;
  emailed: boolean;
}

export interface EnquiryEvent {
  id: number;
  at: string;
  actor: string | null;
  kind: string;
  detail: string | null;
}

/** A readable enquiry number, BC-YYYYMMDD-XXXX, as the dashboard and the email show it. */
export function newEnquiryId(now = new Date()): string {
  const day = now.toISOString().slice(0, 10).replace(/-/g, '');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let tail = '';
  for (const b of bytes) tail += alphabet[b % alphabet.length];
  return `BC-${day}-${tail}`;
}

/**
 * The fields the forms send, tidied. The forms send the contact details and
 * a plain-text `message` (as they always have), plus `kind`, `source` and a
 * `fields` object with everything else by name, which is what the dashboard
 * shows field by field.
 */
export function readEnquiry(body: unknown): EnquiryInput {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const text = (v: unknown, max = MAX_FIELD_LENGTH) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const fields: Record<string, string> = {};
  const raw = b.fields && typeof b.fields === 'object' ? (b.fields as Record<string, unknown>) : {};
  for (const [k, v] of Object.entries(raw).slice(0, MAX_FIELDS)) {
    const key = k.replace(/[^\w]/g, '').slice(0, 40);
    const value = text(v);
    if (key && value) fields[key] = value;
  }
  const p = b.photo && typeof b.photo === 'object' ? (b.photo as Record<string, unknown>) : null;
  const photo: EnquiryPhotoInput | null =
    p && typeof p.content === 'string' && p.content
      ? { name: text(p.filename, 120) || 'photo', type: text(p.type, 80) || 'application/octet-stream', data: p.content }
      : null;
  if (photo && Math.ceil((photo.data.length * 3) / 4) > MAX_PHOTO_BYTES) photo.tooBig = true;
  const kind: EnquiryKind = b.kind === 'heatpump' ? 'heatpump' : 'balustrade';
  return {
    kind,
    source: text(b.source, 40) || (kind === 'heatpump' ? 'heatpump-form' : 'quote-form'),
    name: text(b.name, 200),
    email: text(b.email, 200),
    phone: text(b.phone, 60),
    company: fields.companyName || '',
    siteAddress: fields.siteAddress || '',
    suburb: fields.siteSuburb || '',
    postcode: fields.sitePostcode || '',
    fields,
    message: text(b.message, 8000),
    captchaToken: text(b.captchaToken, 4000),
    photo,
  };
}

function enquiryRow(r: Record<string, unknown>): Enquiry {
  return {
    id: String(r.id),
    createdAt: String(r.created_at),
    updatedAt: (r.updated_at as string) || null,
    kind: r.kind === 'heatpump' ? 'heatpump' : 'balustrade',
    source: (r.source as string) || null,
    name: (r.name as string) || null,
    email: (r.email as string) || null,
    phone: (r.phone as string) || null,
    company: (r.company as string) || null,
    siteAddress: (r.site_address as string) || null,
    suburb: (r.suburb as string) || null,
    postcode: (r.postcode as string) || null,
    fields: parseJson<Record<string, string>>(r.fields_json as string, {}),
    message: (r.message as string) || null,
    photo: parseJson<EnquiryPhoto | null>(r.photo_json as string, null),
    status: (ENQUIRY_STATUSES as readonly string[]).includes(String(r.status)) ? (r.status as EnquiryStatus) : 'new',
    notes: (r.notes as string) || null,
    emailed: !!r.emailed,
  };
}

/** Keep the enquiry for the dashboard. Never throws; null when there is no database. */
export async function persistEnquiry(env: Env, q: EnquiryInput): Promise<string | null> {
  if (!env.DB) return null;
  const id = newEnquiryId();
  const now = new Date().toISOString();
  try {
    let photoRecord: EnquiryPhoto | null = null;
    const store = fileStore(env);
    if (q.photo && !q.photo.tooBig && store) {
      const safeName = q.photo.name.replace(/[^\w.-]+/g, '_').slice(0, 80) || 'photo';
      const key = `enquiries/${id}/${safeName}`;
      const bytes = base64ToBytes(q.photo.data);
      await store.put(key, bytes, q.photo.type);
      photoRecord = { filename: safeName, key, bytes: bytes.length, type: q.photo.type };
    }
    await env.DB.prepare(
      `INSERT INTO enquiries (id, created_at, kind, source, name, email, phone, company, site_address, suburb, postcode, fields_json, message, photo_json, status, emailed)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, 'new', 0)`
    )
      .bind(
        id,
        now,
        q.kind,
        q.source,
        q.name || null,
        q.email || null,
        q.phone || null,
        q.company || null,
        q.siteAddress || null,
        q.suburb || null,
        q.postcode || null,
        JSON.stringify(q.fields),
        q.message || null,
        photoRecord ? JSON.stringify(photoRecord) : null
      )
      .run();
    await env.DB.prepare("INSERT INTO enquiry_events (enquiry_id, at, actor, kind, detail) VALUES (?1, ?2, 'customer', 'received', ?3)")
      .bind(id, now, `Sent from the website (${q.source})`)
      .run();
    return id;
  } catch (err) {
    console.error('Could not keep the enquiry for the dashboard', String(err));
    return null;
  }
}

export async function markEmailed(env: Env, id: string): Promise<void> {
  if (!env.DB) return;
  try {
    await env.DB.prepare('UPDATE enquiries SET emailed = 1 WHERE id = ?1').bind(id).run();
  } catch (err) {
    console.error('Could not mark the enquiry as emailed', String(err));
  }
}

export interface EnquiriesList {
  enquiries: Enquiry[];
  counts: Partial<Record<EnquiryStatus, number>>;
  kinds: Partial<Record<EnquiryKind, number>>;
}

export async function listEnquiries(db: D1Database, url: URL): Promise<EnquiriesList> {
  const status = url.searchParams.get('status');
  const kind = url.searchParams.get('kind');
  const q = (url.searchParams.get('q') || '').trim();
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get('limit')) || 100));
  const where: string[] = [];
  const binds: unknown[] = [];
  if (status && (ENQUIRY_STATUSES as readonly string[]).includes(status)) {
    where.push(`status = ?${binds.length + 1}`);
    binds.push(status);
  }
  if (kind && (ENQUIRY_KINDS as readonly string[]).includes(kind)) {
    where.push(`kind = ?${binds.length + 1}`);
    binds.push(kind);
  }
  if (q) {
    const like = `%${q}%`;
    const n = binds.length;
    where.push(
      `(id LIKE ?${n + 1} OR name LIKE ?${n + 2} OR email LIKE ?${n + 3} OR phone LIKE ?${n + 4} OR company LIKE ?${n + 5} OR site_address LIKE ?${n + 6} OR suburb LIKE ?${n + 7} OR message LIKE ?${n + 8})`
    );
    binds.push(like, like, like, like, like, like, like, like);
  }
  const sql = `SELECT * FROM enquiries${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC LIMIT ${limit}`;
  const rows = (await db.prepare(sql).bind(...binds).all()).results || [];
  const counts = (await db.prepare('SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status').all<{ status: string; n: number }>()).results || [];
  const kinds = (await db.prepare('SELECT kind, COUNT(*) AS n FROM enquiries GROUP BY kind').all<{ kind: string; n: number }>()).results || [];
  return {
    enquiries: rows.map(enquiryRow),
    counts: Object.fromEntries(counts.map((c) => [c.status, c.n])),
    kinds: Object.fromEntries(kinds.map((c) => [c.kind, c.n])),
  };
}

export async function getEnquiry(db: D1Database, id: string): Promise<(Enquiry & { events: EnquiryEvent[] }) | null> {
  const row = await db.prepare('SELECT * FROM enquiries WHERE id = ?1').bind(id).first();
  if (!row) return null;
  const events = (await db.prepare('SELECT id, at, actor, kind, detail FROM enquiry_events WHERE enquiry_id = ?1 ORDER BY at ASC, id ASC').bind(id).all<EnquiryEvent>()).results || [];
  return { ...enquiryRow(row), events };
}

export async function patchEnquiry(db: D1Database, id: string, body: { status?: unknown; notes?: unknown }, actor: string) {
  const current = await db.prepare('SELECT status, notes FROM enquiries WHERE id = ?1').bind(id).first<{ status: string; notes: string | null }>();
  if (!current) return null;
  const now = new Date().toISOString();
  const sets: string[] = [];
  const binds: unknown[] = [];
  if (typeof body.status === 'string' && (ENQUIRY_STATUSES as readonly string[]).includes(body.status) && body.status !== current.status) {
    sets.push(`status = ?${binds.length + 1}`);
    binds.push(body.status);
    await db.prepare("INSERT INTO enquiry_events (enquiry_id, at, actor, kind, detail) VALUES (?1, ?2, ?3, 'status', ?4)")
      .bind(id, now, actor, `${current.status} → ${body.status}`)
      .run();
  }
  if (typeof body.notes === 'string' && body.notes !== (current.notes || '')) {
    sets.push(`notes = ?${binds.length + 1}`);
    binds.push(body.notes.slice(0, 8000));
    await db.prepare("INSERT INTO enquiry_events (enquiry_id, at, actor, kind, detail) VALUES (?1, ?2, ?3, 'note', ?4)")
      .bind(id, now, actor, body.notes.slice(0, 2000))
      .run();
  }
  if (sets.length) {
    sets.push(`updated_at = ?${binds.length + 1}`);
    binds.push(now);
    await db.prepare(`UPDATE enquiries SET ${sets.join(', ')} WHERE id = ?${binds.length + 1}`).bind(...binds, id).run();
  }
  return getEnquiry(db, id);
}

// ── Emails ───────────────────────────────────────────────────────────────────

const KIND_TITLE: Record<EnquiryKind, string> = { balustrade: 'quote request', heatpump: 'heat pump cover enquiry' };

export function businessHtml(q: EnquiryInput, id: string | null, dashboardUrl: string | null): string {
  const rows: [string, string][] = [
    ['Name', q.name],
    ['Phone', q.phone],
    ['Email', q.email],
  ];
  for (const [key, label] of Object.entries(FIELD_LABELS)) if (q.fields[key] && key !== 'otherNotes') rows.push([label, q.fields[key]]);
  for (const [key, value] of Object.entries(q.fields)) if (!(key in FIELD_LABELS)) rows.push([key, value]);
  const tr = ([k, v]: [string, string]) =>
    `<tr><td style="padding:6px 8px;vertical-align:top;white-space:nowrap;"><strong>${esc(k)}</strong></td><td style="padding:6px 8px;">${esc(v)}</td></tr>`;
  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#333;">
      <h2 style="margin:0 0 4px;">New ${esc(KIND_TITLE[q.kind])}</h2>
      <p style="margin:0 0 16px;color:#666;">From the website.${id ? ` Enquiry <strong>${esc(id)}</strong>` : ''}${
        id && dashboardUrl ? ` — <a href="${esc(dashboardUrl)}">open it in the dashboard</a>` : ''
      }</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">${rows.map(tr).join('')}</table>
      ${q.fields.otherNotes ? `<h3 style="margin:20px 0 6px;">Notes</h3><p style="font-size:14px;white-space:pre-wrap;">${esc(q.fields.otherNotes)}</p>` : ''}
      ${
        q.photo
          ? `<p style="font-size:13px;color:#666;">${q.photo.tooBig ? 'A photo was sent but was over 5MB and was not kept.' : `Photo attached: ${esc(q.photo.name)}`}</p>`
          : ''
      }
      <hr style="border:0;border-top:1px solid #ddd;margin:20px 0;">
      <p style="color:#666;font-size:12px;">Sent from the form at balustrading.co.nz. Reply to this email to reply to the customer.</p>
    </div>`;
}

export function customerHtml(q: EnquiryInput, businessEmail: string): string {
  const first = q.name.split(' ')[0] || q.name;
  const what = q.kind === 'heatpump' ? 'heat pump cover enquiry' : 'quote request';
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background:#1d4ed8;color:white;padding:28px;text-align:center;">
        <h1 style="margin:0;font-size:22px;">Thanks, ${esc(first)} — we have your ${esc(what)}</h1>
      </div>
      <div style="padding:28px;">
        <p>We'll be in touch within one business day to talk it through${q.kind === 'balustrade' ? ' and arrange a site measure if needed' : ''}.</p>
        ${q.siteAddress ? `<p style="color:#555;">Site: ${esc([q.siteAddress, q.suburb, q.postcode].filter(Boolean).join(', '))}</p>` : ''}
        <p>Need us sooner? Call <a href="tel:+6498288858" style="color:#1d4ed8;">09 828 8858</a> or email <a href="mailto:${esc(businessEmail)}" style="color:#1d4ed8;">${esc(businessEmail)}</a>.</p>
        <p style="margin-top:28px;">Balustrading Concepts NZ<br><span style="color:#777;">661a Rosebank Road, Avondale, Auckland</span></p>
      </div>
    </div>`;
}

export async function sendEmail(env: Env, payload: Record<string, unknown>): Promise<boolean> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.RESEND_API_KEY}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error('Resend rejected the message', res.status, await res.text().catch(() => ''));
    return false;
  }
  return true;
}
