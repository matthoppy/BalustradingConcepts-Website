/**
 * Small helpers shared by the functions: responses, signed OAuth state,
 * path matching, cookies, and reading settings.
 */

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });
}

export function redirect(url: string, headers: Record<string, string> = {}): Response {
  return new Response(null, { status: 302, headers: { Location: url, 'Cache-Control': 'no-store', ...headers } });
}

const enc = new TextEncoder();

export function base64url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromBase64url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function randomId(bytes = 32): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return base64url(buf);
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export const STATE_MAX_AGE_MS = 10 * 60 * 1000;

/**
 * A signed, short-lived state for the OAuth round trips: nothing to store,
 * nothing a caller can forge. Keyed on the client secret the function already
 * holds.
 */
export async function signState(secret: string, payload: Record<string, unknown>): Promise<string> {
  const body = base64url(enc.encode(JSON.stringify({ ...payload, t: Date.now() })));
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(body)));
  return `${body}.${base64url(sig)}`;
}

export async function verifyState<T = Record<string, unknown>>(secret: string, state: string, maxAgeMs = STATE_MAX_AGE_MS): Promise<(T & { t: number }) | null> {
  if (!state || !state.includes('.')) return null;
  const [body, sig] = state.split('.');
  try {
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(secret), fromBase64url(sig), enc.encode(body));
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64url(body)));
    if (typeof payload.t !== 'number' || Date.now() - payload.t > maxAgeMs) return null;
    return payload;
  } catch {
    return null;
  }
}

/** "/enquiries/:id/files/:name" against a path. Params decoded. */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean);
  const s = path.split('/').filter(Boolean);
  if (p.length !== s.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}

export function isAllowedLogin(login: string | null | undefined, allowed: string): boolean {
  const list = String(allowed || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return !!login && list.includes(String(login).toLowerCase());
}

export function setting(env: Record<string, unknown>, key: string, fallback: string): string {
  const v = env[key];
  return typeof v === 'string' && v.trim() ? v.trim() : fallback;
}

/** A safe return path inside the dashboard, never an open redirect. */
export function safeReturnPath(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/admin')) return '/admin';
  if (value.startsWith('//') || value.includes('://')) return '/admin';
  return value.slice(0, 200);
}

export function parseJson<T>(text: string | null | undefined, fallback: T): T {
  try {
    return text ? (JSON.parse(text) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export class HttpError extends Error {
  status: number;
  conflict: boolean;
  constructor(message: string, status = 500, conflict = false) {
    super(message);
    this.status = status;
    this.conflict = conflict;
  }
}
