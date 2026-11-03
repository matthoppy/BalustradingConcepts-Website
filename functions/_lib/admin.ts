/**
 * The admin dashboard's API, served at /admin-api on the same host as the
 * site (functions/admin-api/[[path]].ts hands every request here).
 *
 *   - signing in with GitHub, restricted to an allow-list of logins; the
 *     session is an HttpOnly cookie, so the browser never holds a token
 *   - the enquiries the quote forms kept, with their photos
 *   - the website photos: gallery projects and the page pictures, committed
 *     to the repository as the signed-in user (their own GitHub token), which
 *     redeploys the site
 *   - Cloudflare data: zone traffic, request counts, the latest deployments
 *   - Google Business Profile: performance and reviews
 *
 * Variables and secrets (Pages project → Settings → Variables and Secrets):
 *   GITHUB_CLIENT_ID       required — the GitHub OAuth App
 *   GITHUB_CLIENT_SECRET   required
 *   ALLOWED_LOGINS         optional — comma-separated GitHub logins, default matthoppy
 *   ADMIN_ORIGIN           optional — where the dashboard lives, default https://www.balustrading.co.nz
 *   GITHUB_REPO            optional — default matthoppy/BalustradingConcepts-Website
 *   GITHUB_BRANCH          optional — default main
 *   CF_API_TOKEN           optional — Analytics:Read on the zone, Workers Scripts:Read and Pages:Read on the account
 *   CF_ACCOUNT_ID          optional — with the token: request counts and Pages deployments
 *   CF_ZONE_ID             optional — with the token: traffic for balustrading.co.nz
 *   CF_PAGES_PROJECT       optional — default balustradingconcepts-website
 *   GOOGLE_CLIENT_ID       optional — Google OAuth client for Business Profile
 *   GOOGLE_CLIENT_SECRET   optional
 *
 * Bindings (wrangler.toml, or the project's Settings → Bindings):
 *   DB         D1 database  "balustrading"        — required
 *   FILES      R2 bucket    "balustrading-files"  — enquiry photos, or
 *   FILES_KV   KV namespace "balustrading-files"  — the same, where R2 is off
 */

import type { D1Database, Env } from './bindings';
import { cloudflareSummary } from './cloudflare';
import { getEnquiry, listEnquiries, patchEnquiry } from './enquiries';
import { fileStore } from './files';
import { GOOGLE_SCOPE, getSetting, googleLocation, googleSummary, putSetting } from './google';
import { MANIFEST_PATH, MAX_IMAGE_BYTES, decodeContent, github, normaliseManifest, publishChange, validateChange } from './photos';
import { HttpError, isAllowedLogin, json, matchPath, parseJson, randomId, readCookie, redirect, safeReturnPath, setting, signState, verifyState } from './util';

export const API_VERSION = 'v1';
export const API_PREFIX = '/admin-api';
export const COOKIE = 'bc_admin';

export const DEFAULTS = {
  allowedLogins: 'matthoppy',
  adminOrigin: 'https://www.balustrading.co.nz',
  repo: 'matthoppy/BalustradingConcepts-Website',
  branch: 'main',
};

const SESSION_DAYS = 30;

interface Session {
  id: string;
  login: string;
  name: string | null;
  avatar_url: string | null;
  gh_token: string;
  expires_at: string;
}

function cookieHeader(id: string | null, secure: boolean): string {
  const base = `${COOKIE}=${id ? encodeURIComponent(id) : ''}; Path=${API_PREFIX}; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
  return id ? `${base}; Max-Age=${SESSION_DAYS * 24 * 3600}` : `${base}; Max-Age=0`;
}

async function sessionFromRequest(request: Request, db: D1Database): Promise<Session | null> {
  const id = readCookie(request, COOKIE);
  if (!id) return null;
  const row = await db.prepare('SELECT * FROM sessions WHERE id = ?1 AND expires_at > ?2').bind(id, new Date().toISOString()).first<Session>();
  return row || null;
}

async function createSession(db: D1Database, user: { login: string; name?: string | null; avatar_url?: string | null }, ghToken: string): Promise<string> {
  const id = randomId();
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 24 * 3600 * 1000);
  await db
    .prepare('INSERT INTO sessions (id, login, name, avatar_url, gh_token, created_at, expires_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)')
    .bind(id, user.login, user.name || null, user.avatar_url || null, ghToken, now.toISOString(), expires.toISOString())
    .run();
  // Keep the table tidy: expired sessions go when a new one is made.
  await db.prepare('DELETE FROM sessions WHERE expires_at <= ?1').bind(now.toISOString()).run();
  return id;
}

/**
 * A request that changes something must come from the dashboard's own
 * pages. The cookie is SameSite=Lax, and this checks what the browser says
 * about where the request came from as well.
 */
export function isSameSite(request: Request, url: URL): boolean {
  const fetchSite = request.headers.get('Sec-Fetch-Site');
  if (fetchSite) return fetchSite === 'same-origin' || fetchSite === 'none';
  const origin = request.headers.get('Origin');
  if (origin) return origin === url.origin;
  const referer = request.headers.get('Referer');
  if (referer) {
    try {
      return new URL(referer).origin === url.origin;
    } catch {
      return false;
    }
  }
  return true;
}

function noStore(res: Response): Response {
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export async function handleAdmin(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = (url.pathname.startsWith(API_PREFIX) ? url.pathname.slice(API_PREFIX.length) : url.pathname).replace(/\/+$/, '') || '/';
  const method = request.method;
  const adminOrigin = setting(env as Record<string, unknown>, 'ADMIN_ORIGIN', DEFAULTS.adminOrigin);
  const apiOrigin = `${adminOrigin}${API_PREFIX}`;
  const secure = url.protocol === 'https:';
  const repo = setting(env as Record<string, unknown>, 'GITHUB_REPO', DEFAULTS.repo);
  const branch = setting(env as Record<string, unknown>, 'GITHUB_BRANCH', DEFAULTS.branch);
  const db = env.DB;

  try {
    if (path === '/' && method === 'GET') {
      return new Response(`balustrading-admin ${API_VERSION} — the dashboard's API. Sign in at ${adminOrigin}/admin.`, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }
    if (!db) return json({ error: 'The dashboard has no database yet. Bind the D1 database "balustrading" as DB (see docs/ADMIN_DASHBOARD.md).' }, 503);

    // ── GitHub sign-in ──
    if (path === '/auth/github/start' && method === 'GET') {
      if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) return redirect(`${adminOrigin}/admin/auth#error=github-not-configured`);
      const state = await signState(env.GITHUB_CLIENT_SECRET, { r: safeReturnPath(url.searchParams.get('return')) });
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: `${apiOrigin}/auth/github/callback`,
        scope: 'read:user repo',
        state,
        allow_signup: 'false',
      });
      return redirect(`https://github.com/login/oauth/authorize?${params}`);
    }

    if (path === '/auth/github/callback' && method === 'GET') {
      const state = await verifyState<{ r?: string }>(env.GITHUB_CLIENT_SECRET || '', url.searchParams.get('state') || '');
      const code = url.searchParams.get('code');
      if (!state || !code) return redirect(`${adminOrigin}/admin/auth#error=bad-state`);
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'balustrading-admin' },
        body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${apiOrigin}/auth/github/callback` }),
      });
      const tokenData = (await tokenRes.json().catch(() => ({}))) as { access_token?: string };
      if (!tokenData.access_token) {
        console.error('GitHub token exchange failed', tokenData);
        return redirect(`${adminOrigin}/admin/auth#error=token-exchange`);
      }
      const user = await github<{ login: string; name?: string | null; avatar_url?: string | null }>(tokenData.access_token, 'GET', '/user');
      if (!isAllowedLogin(user.login, setting(env as Record<string, unknown>, 'ALLOWED_LOGINS', DEFAULTS.allowedLogins))) {
        console.warn('Sign-in refused', user.login);
        return redirect(`${adminOrigin}/admin/auth#error=not-allowed&login=${encodeURIComponent(user.login)}`);
      }
      const sid = await createSession(db, user, tokenData.access_token);
      return redirect(`${adminOrigin}/admin/auth#ok=1&return=${encodeURIComponent(state.r || '/admin')}`, { 'Set-Cookie': cookieHeader(sid, secure) });
    }

    if (path === '/auth/google/callback' && method === 'GET') {
      const state = await verifyState<{ sid?: string }>(env.GOOGLE_CLIENT_SECRET || '', url.searchParams.get('state') || '');
      const code = url.searchParams.get('code');
      if (!state || !code || !state.sid) return redirect(`${adminOrigin}/admin/google#error=bad-state`);
      const owner = await db.prepare('SELECT id FROM sessions WHERE id = ?1 AND expires_at > ?2').bind(state.sid, new Date().toISOString()).first();
      if (!owner) return redirect(`${adminOrigin}/admin/google#error=signed-out`);
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: env.GOOGLE_CLIENT_ID || '',
          client_secret: env.GOOGLE_CLIENT_SECRET || '',
          redirect_uri: `${apiOrigin}/auth/google/callback`,
          grant_type: 'authorization_code',
        }),
      });
      const tokenData = (await tokenRes.json().catch(() => ({}))) as { refresh_token?: string; access_token?: string; error?: string };
      if (!tokenData.refresh_token) {
        console.error('Google token exchange gave no refresh token', tokenData.error || '');
        return redirect(`${adminOrigin}/admin/google#error=no-refresh-token`);
      }
      await putSetting(db, 'google.refresh_token', tokenData.refresh_token);
      await db.prepare("DELETE FROM settings WHERE key = 'google.location'").run();
      try {
        await googleLocation(db, tokenData.access_token || '');
      } catch (err) {
        console.warn('Google connected, but no location found yet', String(err));
      }
      return redirect(`${adminOrigin}/admin/google#connected=1`);
    }

    // ── Everything else needs a session ──
    const session = await sessionFromRequest(request, db);
    if (!session) return json({ error: 'Not signed in.' }, 401);
    if (method !== 'GET' && method !== 'HEAD' && !isSameSite(request, url)) return json({ error: 'Refused: this request did not come from the dashboard.' }, 403);

    if (path === '/auth/logout' && method === 'POST') {
      await db.prepare('DELETE FROM sessions WHERE id = ?1').bind(session.id).run();
      return json({ ok: true }, 200, { 'Set-Cookie': cookieHeader(null, secure) });
    }

    if (path === '/me' && method === 'GET') {
      const googleConfigured = !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
      const googleConnected = googleConfigured && !!(await getSetting(db, 'google.refresh_token'));
      return json({
        login: session.login,
        name: session.name,
        avatarUrl: session.avatar_url,
        repo,
        branch,
        siteOrigin: adminOrigin,
        capabilities: {
          files: fileStore(env)?.kind || null,
          cloudflare: !!env.CF_API_TOKEN,
          google: googleConfigured ? (googleConnected ? 'connected' : 'disconnected') : 'unconfigured',
        },
        version: API_VERSION,
      });
    }

    // ── Enquiries ──
    let m: Record<string, string> | null;
    if (path === '/enquiries' && method === 'GET') return json(await listEnquiries(db, url));
    if ((m = matchPath('/enquiries/:id', path)) && method === 'GET') {
      const e = await getEnquiry(db, m.id);
      return e ? json(e) : json({ error: 'No such enquiry.' }, 404);
    }
    if ((m = matchPath('/enquiries/:id', path)) && method === 'PATCH') {
      const body = (await request.json().catch(() => ({}))) as { status?: unknown; notes?: unknown };
      const e = await patchEnquiry(db, m.id, body, session.login);
      return e ? json(e) : json({ error: 'No such enquiry.' }, 404);
    }
    if ((m = matchPath('/enquiries/:id/files/:name', path)) && method === 'GET') {
      const row = await db.prepare('SELECT photo_json FROM enquiries WHERE id = ?1').bind(m.id).first<{ photo_json: string | null }>();
      const photo = row ? parseJson<{ filename: string; key: string } | null>(row.photo_json, null) : null;
      if (!photo || photo.filename !== m.name) return json({ error: 'File not found.' }, 404);
      const store = fileStore(env);
      if (!store) return json({ error: 'No file store is bound to this project.' }, 404);
      const file = await store.get(photo.key);
      if (!file) return json({ error: 'File not found.' }, 404);
      return new Response(file.body, {
        headers: { 'Content-Type': file.contentType, 'Cache-Control': 'private, max-age=3600', 'Content-Disposition': `inline; filename="${photo.filename}"` },
      });
    }

    // ── Website photos ──
    if (path === '/site/photos' && method === 'GET') {
      const file = await github<{ content: string }>(session.gh_token, 'GET', `/repos/${repo}/contents/${MANIFEST_PATH}?ref=${branch}`);
      const manifest = normaliseManifest(JSON.parse(decodeContent(file)));
      let canPublish = false;
      try {
        const about = await github<{ permissions?: { push?: boolean } }>(session.gh_token, 'GET', `/repos/${repo}`);
        canPublish = !!about.permissions?.push;
      } catch (err) {
        const status = err instanceof HttpError ? err.status : 0;
        if (status !== 403 && status !== 404) throw err;
      }
      return json({ manifest, repo, branch, siteOrigin: adminOrigin, canPublish });
    }
    if (path === '/site/photos/upload' && method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as { contentBase64?: unknown };
      const content = typeof body.contentBase64 === 'string' ? body.contentBase64.replace(/\s/g, '') : '';
      const bytes = Math.floor((content.length * 3) / 4);
      if (!content) return json({ error: 'No photo was sent.' }, 400);
      if (!content.startsWith('/9j/')) return json({ error: 'Photos must be JPEGs; the page makes them so before sending.' }, 400);
      if (bytes > MAX_IMAGE_BYTES) return json({ error: 'That photo is over 6MB even after shrinking.' }, 413);
      const blob = await github<{ sha: string }>(session.gh_token, 'POST', `/repos/${repo}/git/blobs`, { content, encoding: 'base64' });
      return json({ sha: blob.sha, bytes });
    }
    if (path === '/site/photos/publish' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const check = validateChange(body);
      if (!check.ok) return json({ error: check.errors.join('; ') }, 400);
      try {
        return json(await publishChange(session.gh_token, repo, branch, check, session.login));
      } catch (err) {
        if (err instanceof HttpError && err.conflict) return json({ error: err.message, conflict: true }, 409);
        throw err;
      }
    }

    // ── Cloudflare ──
    if (path === '/cloudflare/summary' && method === 'GET') {
      const days = Math.min(90, Math.max(1, Number(url.searchParams.get('days')) || 30));
      return json(await cloudflareSummary(env, days));
    }

    // ── Google Business Profile ──
    if (path === '/google/status' && method === 'GET') {
      const configured = !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
      const connected = configured && !!(await getSetting(db, 'google.refresh_token'));
      const location = connected ? parseJson(await getSetting(db, 'google.location'), null) : null;
      return json({ configured, connected, location, redirectUri: `${apiOrigin}/auth/google/callback` });
    }
    if (path === '/auth/google/start' && method === 'GET') {
      if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return json({ error: 'Google is not configured on this project.' }, 400);
      const state = await signState(env.GOOGLE_CLIENT_SECRET, { sid: session.id });
      const params = new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: `${apiOrigin}/auth/google/callback`,
        response_type: 'code',
        scope: GOOGLE_SCOPE,
        access_type: 'offline',
        prompt: 'consent',
        state,
      });
      return json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
    }
    if (path === '/google/summary' && method === 'GET') {
      if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return json({ connected: false, configured: false });
      const days = Math.min(90, Math.max(7, Number(url.searchParams.get('days')) || 28));
      return json({ configured: true, ...(await googleSummary(env, db, days)) });
    }
    if (path === '/google/disconnect' && method === 'POST') {
      await db.prepare("DELETE FROM settings WHERE key LIKE 'google.%'").run();
      return json({ ok: true });
    }

    return json({ error: 'Not found.' }, 404);
  } catch (err) {
    console.error('admin-api error', String(err));
    return noStore(json({ error: String((err as Error).message || err) }, 500));
  }
}
