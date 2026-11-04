// @vitest-environment node
/**
 * The admin API: sign-in, sessions, enquiries, and the photo publish.
 * Network and bindings are faked.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COOKIE, handleAdmin, isSameSite } from './admin';
import type { D1Database, Env } from './bindings';
import { applyChange, normaliseManifest, validateChange } from './photos';
import { isAllowedLogin, matchPath, safeReturnPath, signState, verifyState } from './util';

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

const ORIGIN = 'https://www.balustrading.co.nz';
const SESSION = { id: 'sess-1', login: 'matthoppy', name: 'Matt', avatar_url: null, gh_token: 'gho_test', created_at: '2026-11-03T00:00:00Z', expires_at: '2099-01-01T00:00:00Z' };

interface Handler {
  match: RegExp;
  first?: (args: unknown[]) => unknown;
  all?: (args: unknown[]) => unknown[];
  run?: (args: unknown[]) => void;
}

/** A D1 stand-in: canned answers by SQL pattern, every call recorded. */
function fakeDb(handlers: Handler[] = []) {
  const calls: { sql: string; args: unknown[] }[] = [];
  const statement = (sql: string, args: unknown[]) => {
    const h = handlers.find((x) => x.match.test(sql));
    return {
      bind: (...more: unknown[]) => statement(sql, [...args, ...more]),
      first: async () => {
        calls.push({ sql, args });
        return h?.first ? h.first(args) : null;
      },
      all: async () => {
        calls.push({ sql, args });
        return { results: h?.all ? h.all(args) : [], success: true };
      },
      run: async () => {
        calls.push({ sql, args });
        if (h?.run) h.run(args);
        return { success: true };
      },
    };
  };
  const db = { prepare: (sql: string) => statement(sql, []) } as unknown as D1Database;
  return { db, calls };
}

const withSession: Handler = { match: /FROM sessions/, first: (args) => (args[0] === SESSION.id ? SESSION : null) };

function env(extra: Partial<Env> = {}, handlers: Handler[] = [withSession]) {
  const { db, calls } = fakeDb(handlers);
  return { env: { GITHUB_CLIENT_ID: 'cid', GITHUB_CLIENT_SECRET: 'csecret', DB: db, ...extra } as Env, calls };
}

function req(path: string, { method = 'GET', cookie = SESSION.id, body, headers: extra = {} }: { method?: string; cookie?: string | null; body?: unknown; headers?: Record<string, string> } = {}) {
  const headers: Record<string, string> = { 'Sec-Fetch-Site': 'same-origin', ...extra };
  if (cookie) headers.Cookie = `${COOKIE}=${cookie}`;
  if (body) headers['Content-Type'] = 'application/json';
  return new Request(`${ORIGIN}/admin-api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
}

type Reply = { status?: number; body?: unknown } | Record<string, unknown>;
function mockFetch(routes: [RegExp, Reply | ((url: string, init: RequestInit) => Reply)][]) {
  const calls: { url: string; method: string; body: unknown }[] = [];
  globalThis.fetch = (async (url: string | URL | Request, init: RequestInit = {}) => {
    const u = String(url);
    calls.push({ url: u, method: init.method || 'GET', body: init.body ? JSON.parse(String(init.body)) : null });
    for (const [pattern, reply] of routes) {
      if (pattern.test(u)) {
        const r = (typeof reply === 'function' ? reply(u, init) : reply) as { status?: number; body?: unknown };
        return new Response(JSON.stringify(r.body ?? r), { status: r.status || 200, headers: { 'Content-Type': 'application/json' } });
      }
    }
    return new Response('{}', { status: 404 });
  }) as typeof fetch;
  return calls;
}

describe('helpers', () => {
  it('matches paths and decodes params', () => {
    expect(matchPath('/enquiries/:id/files/:name', '/enquiries/BC-1/files/deck%20photo.jpg')).toEqual({ id: 'BC-1', name: 'deck photo.jpg' });
    expect(matchPath('/enquiries/:id', '/enquiries/BC-1/files/x')).toBeNull();
    expect(matchPath('/me', '/enquiries')).toBeNull();
  });

  it('allows only listed logins, case-insensitively', () => {
    expect(isAllowedLogin('MattHoppy', 'matthoppy, someone')).toBe(true);
    expect(isAllowedLogin('stranger', 'matthoppy')).toBe(false);
    expect(isAllowedLogin('', 'matthoppy')).toBe(false);
  });

  it('keeps return paths inside the dashboard', () => {
    expect(safeReturnPath('/admin/enquiries?open=BC-1')).toBe('/admin/enquiries?open=BC-1');
    expect(safeReturnPath('https://evil.example/admin')).toBe('/admin');
    expect(safeReturnPath('//evil.example')).toBe('/admin');
    expect(safeReturnPath('/elsewhere')).toBe('/admin');
  });

  it('signs state that only the same secret verifies, and that expires', async () => {
    const state = await signState('s', { r: '/admin/projects' });
    expect((await verifyState('s', state))?.r).toBe('/admin/projects');
    expect(await verifyState('other', state)).toBeNull();
    expect(await verifyState('s', state, -1)).toBeNull();
    expect(await verifyState('s', 'garbage')).toBeNull();
  });

  it('knows a same-site request from a cross-site one', () => {
    const url = new URL(`${ORIGIN}/admin-api/x`);
    expect(isSameSite(new Request(url, { headers: { 'Sec-Fetch-Site': 'same-origin' } }), url)).toBe(true);
    expect(isSameSite(new Request(url, { headers: { 'Sec-Fetch-Site': 'cross-site' } }), url)).toBe(false);
    expect(isSameSite(new Request(url, { headers: { Origin: 'https://evil.example' } }), url)).toBe(false);
    expect(isSameSite(new Request(url, { headers: { Origin: ORIGIN } }), url)).toBe(true);
  });
});

describe('sign-in', () => {
  it('says what the API is at its root', async () => {
    const { env: e } = env();
    const res = await handleAdmin(new Request(`${ORIGIN}/admin-api/`), e);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('balustrading-admin');
  });

  it('refuses everything else without a session cookie', async () => {
    const { env: e } = env();
    const res = await handleAdmin(req('/me', { cookie: null }), e);
    expect(res.status).toBe(401);
  });

  it('sends the browser to GitHub with the callback on the dashboard host', async () => {
    const { env: e } = env();
    const res = await handleAdmin(req('/auth/github/start?return=%2Fadmin%2Fprojects', { cookie: null }), e);
    expect(res.status).toBe(302);
    const to = new URL(res.headers.get('Location')!);
    expect(to.origin).toBe('https://github.com');
    expect(to.searchParams.get('redirect_uri')).toBe(`${ORIGIN}/admin-api/auth/github/callback`);
    expect(to.searchParams.get('scope')).toBe('read:user repo');
    expect((await verifyState('csecret', to.searchParams.get('state')!))?.r).toBe('/admin/projects');
  });

  it('finishes a sign-in with a cookie and a hop back to the page wanted', async () => {
    const inserts: unknown[][] = [];
    const { env: e } = env({}, [withSession, { match: /INSERT INTO sessions/, run: (args) => inserts.push(args) }]);
    mockFetch([
      [/github\.com\/login\/oauth\/access_token/, { access_token: 'gho_new' }],
      [/api\.github\.com\/user/, { login: 'matthoppy', name: 'Matt', avatar_url: null }],
    ]);
    const state = await signState('csecret', { r: '/admin/enquiries' });
    const res = await handleAdmin(req(`/auth/github/callback?code=abc&state=${encodeURIComponent(state)}`, { cookie: null }), e);
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe(`${ORIGIN}/admin/auth#ok=1&return=%2Fadmin%2Fenquiries`);
    const cookie = res.headers.get('Set-Cookie')!;
    expect(cookie).toMatch(/^bc_admin=.+; Path=\/admin-api; HttpOnly; SameSite=Lax; Secure; Max-Age=/);
    expect(inserts[0][1]).toBe('matthoppy');
    expect(inserts[0][4]).toBe('gho_new');
  });

  it('turns away a GitHub account that is not on the list', async () => {
    const { env: e, calls } = env({ ALLOWED_LOGINS: 'matthoppy' });
    mockFetch([
      [/access_token/, { access_token: 'gho_x' }],
      [/api\.github\.com\/user/, { login: 'stranger' }],
    ]);
    const state = await signState('csecret', { r: '/admin' });
    const res = await handleAdmin(req(`/auth/github/callback?code=abc&state=${encodeURIComponent(state)}`, { cookie: null }), e);
    expect(res.headers.get('Location')).toBe(`${ORIGIN}/admin/auth#error=not-allowed&login=stranger`);
    expect(res.headers.get('Set-Cookie')).toBeNull();
    expect(calls.some((c) => /INSERT INTO sessions/.test(c.sql))).toBe(false);
  });

  it('rejects a forged or stale state', async () => {
    const { env: e } = env();
    const res = await handleAdmin(req('/auth/github/callback?code=abc&state=nope', { cookie: null }), e);
    expect(res.headers.get('Location')).toBe(`${ORIGIN}/admin/auth#error=bad-state`);
  });

  it('describes the signed-in person and what is set up', async () => {
    const { env: e } = env({ CF_API_TOKEN: 't', FILES_KV: {} as never });
    const res = await handleAdmin(req('/me'), e);
    const me = await res.json();
    expect(me.login).toBe('matthoppy');
    expect(me.capabilities).toEqual({ files: 'kv', cloudflare: true, google: 'unconfigured' });
    expect(me.repo).toBe('matthoppy/BalustradingConcepts-Website');
  });

  it('signs out by deleting the session and clearing the cookie', async () => {
    const { env: e, calls } = env();
    const res = await handleAdmin(req('/auth/logout', { method: 'POST' }), e);
    expect(res.status).toBe(200);
    expect(res.headers.get('Set-Cookie')).toContain('Max-Age=0');
    expect(calls.some((c) => /DELETE FROM sessions WHERE id/.test(c.sql) && c.args[0] === SESSION.id)).toBe(true);
  });

  it('refuses a change that did not come from the dashboard', async () => {
    const { env: e } = env();
    const res = await handleAdmin(req('/auth/logout', { method: 'POST', headers: { 'Sec-Fetch-Site': 'cross-site' } }), e);
    expect(res.status).toBe(403);
  });
});

const ROW = {
  id: 'BC-20261103-ABCD',
  created_at: '2026-11-03T01:00:00Z',
  updated_at: null,
  kind: 'balustrade',
  source: 'quote-form',
  name: 'Daniel',
  email: 'd@example.com',
  phone: '021 123',
  company: null,
  site_address: '14 Kauri Road',
  suburb: 'Titirangi',
  postcode: '0604',
  fields_json: JSON.stringify({ buildingType: 'Residential', protectingFall: 'Yes, balustrading IS preventing a fall' }),
  message: 'hello',
  photo_json: JSON.stringify({ filename: 'deck.jpg', key: 'enquiries/BC-20261103-ABCD/deck.jpg', bytes: 10, type: 'image/jpeg' }),
  status: 'new',
  notes: null,
  emailed: 1,
};

describe('enquiries', () => {
  it('lists enquiries with counts, filtered and searched', async () => {
    const seen: string[] = [];
    const { env: e } = env({}, [
      withSession,
      { match: /SELECT \* FROM enquiries/, all: (args) => { seen.push(String(args)); return [ROW]; } },
      { match: /GROUP BY status/, all: () => [{ status: 'new', n: 3 }, { status: 'won', n: 1 }] },
      { match: /GROUP BY kind/, all: () => [{ kind: 'balustrade', n: 4 }] },
    ]);
    const res = await handleAdmin(req('/enquiries?status=new&kind=balustrade&q=kauri'), e);
    const data = await res.json();
    expect(data.counts).toEqual({ new: 3, won: 1 });
    expect(data.kinds).toEqual({ balustrade: 4 });
    expect(data.enquiries[0]).toMatchObject({ id: ROW.id, kind: 'balustrade', suburb: 'Titirangi', emailed: true, fields: { buildingType: 'Residential' } });
    expect(data.enquiries[0].photo.filename).toBe('deck.jpg');
    expect(seen[0]).toContain('new,balustrade,%kauri%');
  });

  it('changes a status and keeps a note, writing the history', async () => {
    const events: unknown[][] = [];
    const updates: unknown[][] = [];
    const { env: e } = env({}, [
      withSession,
      { match: /SELECT status, notes FROM enquiries/, first: () => ({ status: 'new', notes: null }) },
      { match: /INSERT INTO enquiry_events/, run: (args) => events.push(args) },
      { match: /UPDATE enquiries SET/, run: (args) => updates.push(args) },
      { match: /SELECT \* FROM enquiries WHERE id/, first: () => ({ ...ROW, status: 'contacted', notes: 'Rang him' }) },
      { match: /FROM enquiry_events/, all: () => [{ id: 1, at: ROW.created_at, actor: 'customer', kind: 'received', detail: null }] },
    ]);
    const res = await handleAdmin(req(`/enquiries/${ROW.id}`, { method: 'PATCH', body: { status: 'contacted', notes: 'Rang him', ignored: 1 } }), e);
    const data = await res.json();
    expect(data.status).toBe('contacted');
    expect(data.events).toHaveLength(1);
    expect(events.map((a) => a[3])).toEqual(['new → contacted', 'Rang him']);
    expect(updates[0][0]).toBe('contacted');
    expect(updates[0][1]).toBe('Rang him');
  });

  it('ignores an unknown status', async () => {
    const updates: unknown[][] = [];
    const { env: e } = env({}, [
      withSession,
      { match: /SELECT status, notes FROM enquiries/, first: () => ({ status: 'new', notes: null }) },
      { match: /UPDATE enquiries SET/, run: (args) => updates.push(args) },
      { match: /SELECT \* FROM enquiries WHERE id/, first: () => ROW },
    ]);
    await handleAdmin(req(`/enquiries/${ROW.id}`, { method: 'PATCH', body: { status: 'bogus' } }), e);
    expect(updates).toHaveLength(0);
  });

  it('serves the customer photo from the file store with the cookie alone', async () => {
    const { env: e } = env(
      { FILES_KV: { getWithMetadata: async () => ({ value: new Uint8Array([1, 2, 3]).buffer, metadata: { contentType: 'image/jpeg' } }) } as never },
      [withSession, { match: /SELECT photo_json FROM enquiries/, first: () => ({ photo_json: ROW.photo_json }) }]
    );
    const res = await handleAdmin(req(`/enquiries/${ROW.id}/files/deck.jpg`), e);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/jpeg');
    expect((await res.arrayBuffer()).byteLength).toBe(3);
    expect((await handleAdmin(req(`/enquiries/${ROW.id}/files/other.jpg`), e)).status).toBe(404);
  });
});

const MANIFEST = {
  version: 1,
  hero: { src: '/images/site/hero.jpg', alt: 'Hero', v: 1 },
  poolHero: { src: '/images/site/pool.jpg', alt: 'Pool', v: 1 },
  heatPumpHero: { src: '/images/site/hp.jpg', alt: 'HP', v: 1 },
  about: [{ src: '/images/site/about-1.jpg', alt: 'A1', v: 1 }],
  projects: {
    balustrade: [
      { title: 'Parnell Project', style: 'Finline', photos: ['/images/site/gallery-1.jpg', '/images/site/gallery-2.jpg'] },
      { title: 'Birkenhead', style: 'Finline', photos: ['/images/site/gallery-10.jpg'] },
    ],
    commercial: [],
    poolfence: [{ title: 'Millwater Pool Fence', style: 'Mini Posts', photos: ['/images/site/pool-fence-8.jpg'] }],
  },
};

describe('photos', () => {
  it('normalises a manifest, keeping unknown keys and dropping junk', () => {
    const m = normaliseManifest({ ...MANIFEST, extra: 1, projects: { ...MANIFEST.projects, balustrade: [...MANIFEST.projects.balustrade, null, { title: 'x', photos: [1, '', '/p.jpg'] }] } });
    expect(m.projects.balustrade).toHaveLength(3);
    expect(m.projects.balustrade[2]).toEqual({ title: 'x', style: '', photos: ['/p.jpg'] });
    expect(m.projects.commercial).toEqual([]);
    expect(m.extra).toBe(1);
    expect(m.poolHero.src).toBe('/images/site/pool.jpg');
  });

  it('validates what may be published', () => {
    const sha = 'a'.repeat(40);
    expect(validateChange({ change: { kind: 'project', mode: 'add', type: 'balustrade', title: 'T', style: 'Finline', photos: ['new:0'] }, blobs: [{ sha }] }).ok).toBe(true);
    expect(validateChange({ change: { kind: 'project', mode: 'add', type: 'balustrade', title: 'T', photos: ['new:1'] }, blobs: [{ sha }] }).errors).toContain('not a photo of the site: new:1');
    expect(validateChange({ change: { kind: 'project', mode: 'add', type: 'garden', title: 'T', photos: ['/images/site/x.jpg'] }, blobs: [] }).errors).toContain('unknown type of work');
    expect(validateChange({ change: { kind: 'project', mode: 'add', type: 'balustrade', title: '', photos: ['/images/site/x.jpg'] }, blobs: [] }).errors).toContain('the project needs a name');
    expect(validateChange({ change: { kind: 'project', mode: 'update', type: 'balustrade', title: 'T', photos: ['/images/site/x.jpg'], origType: 'balustrade', origIndex: 0 }, blobs: [] }).errors).toContain('the project as it was is missing');
    expect(validateChange({ change: { kind: 'slot', slot: 'poolHero', alt: 'x', photo: 'new:0' }, blobs: [{ sha }] }).ok).toBe(true);
    expect(validateChange({ change: { kind: 'slot', slot: 'about', alt: 'x', photo: null }, blobs: [] }).errors).toContain('which About picture?');
    expect(validateChange({ change: { kind: 'slot', slot: 'hero', alt: 'x', photo: '../etc' }, blobs: [] }).errors).toContain('not a photo of the site');
    expect(validateChange({ change: { kind: 'project', mode: 'add', type: 'balustrade', title: 'T', photos: ['new:0'] }, blobs: [{ sha: 'short' }] }).errors).toContain('an uploaded photo has no blob id');
  });

  it('adds a project at the top of its type', () => {
    const { manifest, removed } = applyChange(MANIFEST, { kind: 'project', mode: 'add', type: 'commercial', title: ' Oranga School ', style: 'Extreme Ascot', photos: ['new:0', 'new:1'] }, ['/images/site/a.jpg', '/images/site/b.jpg']);
    expect(manifest.projects.commercial[0]).toEqual({ title: 'Oranga School', style: 'Extreme Ascot', photos: ['/images/site/a.jpg', '/images/site/b.jpg'] });
    expect(removed).toEqual([]);
  });

  it('updates a project in place, dropping photos nothing uses', () => {
    const orig = MANIFEST.projects.balustrade[0];
    const { manifest, removed } = applyChange(
      MANIFEST,
      { kind: 'project', mode: 'update', type: 'balustrade', title: 'Parnell Deck', style: 'Finline', photos: ['/images/site/gallery-2.jpg', 'new:0'], origType: 'balustrade', origIndex: 0, origJson: JSON.stringify(orig) },
      ['/images/site/new.jpg']
    );
    expect(manifest.projects.balustrade[0]).toEqual({ title: 'Parnell Deck', style: 'Finline', photos: ['/images/site/gallery-2.jpg', '/images/site/new.jpg'] });
    expect(manifest.projects.balustrade[1].title).toBe('Birkenhead');
    expect(removed).toEqual(['/images/site/gallery-1.jpg']);
  });

  it('moves a project to another type, and finds it even if it has moved down the list', () => {
    const orig = MANIFEST.projects.balustrade[1];
    const { manifest } = applyChange(MANIFEST, { kind: 'project', mode: 'update', type: 'commercial', title: 'Birkenhead', style: 'Finline', photos: orig.photos, origType: 'balustrade', origIndex: 0, origJson: JSON.stringify(orig) });
    expect(manifest.projects.balustrade.map((p) => p.title)).toEqual(['Parnell Project']);
    expect(manifest.projects.commercial[0].title).toBe('Birkenhead');
  });

  it('refuses to touch a project that changed elsewhere', () => {
    expect(() => applyChange(MANIFEST, { kind: 'project', mode: 'delete', origType: 'balustrade', origIndex: 0, origJson: JSON.stringify({ title: 'Gone', style: '', photos: [] }) })).toThrow(/changed somewhere else/);
  });

  it('deletes a project and its photos, keeping one still shared', () => {
    const shared = { ...MANIFEST, projects: { ...MANIFEST.projects, commercial: [{ title: 'Same photo', style: '', photos: ['/images/site/gallery-1.jpg'] }] } };
    const orig = MANIFEST.projects.balustrade[0];
    const { manifest, removed } = applyChange(shared, { kind: 'project', mode: 'delete', origType: 'balustrade', origIndex: 0, origJson: JSON.stringify(orig) });
    expect(manifest.projects.balustrade.map((p) => p.title)).toEqual(['Birkenhead']);
    expect(removed).toEqual(['/images/site/gallery-2.jpg']);
  });

  it('replaces a page picture, bumping the version only when the file stays', () => {
    const a = applyChange(MANIFEST, { kind: 'slot', slot: 'poolHero', alt: 'New pool', photo: 'new:0' }, ['/images/site/pool-2.jpg']);
    expect(a.manifest.poolHero).toEqual({ src: '/images/site/pool-2.jpg', alt: 'New pool', v: 1 });
    expect(a.removed).toEqual(['/images/site/pool.jpg']);
    const b = applyChange(MANIFEST, { kind: 'slot', slot: 'about', index: 0, alt: 'Reworded', photo: null });
    expect(b.manifest.about[0]).toEqual({ src: '/images/site/about-1.jpg', alt: 'Reworded', v: 1 });
    expect(b.removed).toEqual([]);
    expect(() => applyChange(MANIFEST, { kind: 'slot', slot: 'about', index: 5, alt: 'x', photo: null })).toThrow(/not on the site/);
  });

  it('publishes one commit with the photos, the manifest and the removals, as the signed-in person', async () => {
    const { env: e } = env();
    const encoded = btoa(JSON.stringify(MANIFEST));
    const calls = mockFetch([
      [/git\/ref\/heads\/main/, { object: { sha: 'head1' } }],
      [/contents\/src\/content\/site-images\.json/, { content: encoded }],
      [/git\/commits\/head1/, { tree: { sha: 'tree0' } }],
      [/git\/trees$/, { sha: 'tree1' }],
      [/git\/commits$/, { sha: 'commit1' }],
      [/git\/refs\/heads\/main/, { ok: true }],
    ]);
    const orig = MANIFEST.projects.balustrade[0];
    const res = await handleAdmin(
      req('/site/photos/publish', {
        method: 'POST',
        body: { change: { kind: 'project', mode: 'update', type: 'balustrade', title: 'Parnell Deck', style: 'Finline', photos: ['new:0'], origType: 'balustrade', origIndex: 0, origJson: JSON.stringify(orig) }, blobs: [{ sha: 'b'.repeat(40) }] },
      }),
      e
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.sha).toBe('commit1');
    expect(data.newPaths).toHaveLength(1);
    expect(data.newPaths[0]).toMatch(/^\/images\/site\/parnell-deck-\d{8}-\d{6}\.jpg$/);
    const tree = calls.find((c) => /git\/trees$/.test(c.url))!.body as { tree: { path: string; sha?: string | null; content?: string }[] };
    const paths = tree.tree.map((t) => t.path);
    expect(paths).toContain(`public${data.newPaths[0]}`);
    expect(paths).toContain('src/content/site-images.json');
    expect(tree.tree.filter((t) => t.sha === null).map((t) => t.path).sort()).toEqual(['public/images/site/gallery-1.jpg', 'public/images/site/gallery-2.jpg']);
    const commit = calls.find((c) => /git\/commits$/.test(c.url))!.body as { message: string };
    expect(commit.message).toContain('Update gallery project: Parnell Deck (Residential balustrades)');
    expect(commit.message).toContain('by matthoppy');
    expect(calls.every((c) => !/access_token/.test(c.url))).toBe(true);
  });

  it('answers 409 when the project changed elsewhere', async () => {
    const { env: e } = env();
    mockFetch([
      [/git\/ref\/heads\/main/, { object: { sha: 'head1' } }],
      [/contents\/src\/content\/site-images\.json/, { content: btoa(JSON.stringify(MANIFEST)) }],
    ]);
    const res = await handleAdmin(req('/site/photos/publish', { method: 'POST', body: { change: { kind: 'project', mode: 'delete', origType: 'balustrade', origIndex: 0, origJson: '{"title":"Gone","style":"","photos":[]}' }, blobs: [] } }), e);
    expect(res.status).toBe(409);
    expect((await res.json()).conflict).toBe(true);
  });

  it('only takes JPEGs under the size limit as uploads', async () => {
    const { env: e } = env();
    expect((await handleAdmin(req('/site/photos/upload', { method: 'POST', body: { contentBase64: 'iVBORw0KGgo=' } }), e)).status).toBe(400);
    mockFetch([[/git\/blobs/, { sha: 'c'.repeat(40) }]]);
    const res = await handleAdmin(req('/site/photos/upload', { method: 'POST', body: { contentBase64: '/9j/4AAQSkZJRg==' } }), e);
    expect((await res.json()).sha).toBe('c'.repeat(40));
  });
});
