/**
 * The Cloudflare bindings the functions use, typed just enough. The real
 * types live in @cloudflare/workers-types; these keep the repo free of that
 * dependency and match the Pages Functions runtime where they overlap.
 */

export interface D1Result<T = Record<string, unknown>> {
  results?: T[];
  success: boolean;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

export interface D1Database {
  prepare(sql: string): D1PreparedStatement;
}

export interface KVNamespace {
  get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>;
  getWithMetadata<M = Record<string, unknown>>(key: string, options: { type: 'arrayBuffer' }): Promise<{ value: ArrayBuffer | null; metadata: M | null }>;
  put(key: string, value: ArrayBuffer | Uint8Array | string, options?: { metadata?: Record<string, unknown> }): Promise<void>;
}

export interface R2Object {
  body: ReadableStream;
  httpMetadata?: { contentType?: string };
}

export interface R2Bucket {
  get(key: string): Promise<R2Object | null>;
  put(key: string, value: ArrayBuffer | Uint8Array | string, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
}

/**
 * Variables, secrets and bindings, as the Pages project provides them. All
 * optional: each part of the dashboard says plainly when its piece is not
 * set up yet.
 */
export interface Env {
  // The quote form (functions/api/submit-contact-form.ts)
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  BUSINESS_EMAIL?: string;
  FROM_EMAIL?: string;
  // The dashboard (functions/admin-api)
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  ALLOWED_LOGINS?: string;
  ADMIN_ORIGIN?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
  CF_API_TOKEN?: string;
  CF_ACCOUNT_ID?: string;
  CF_ZONE_ID?: string;
  CF_PAGES_PROJECT?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  // Bindings
  DB?: D1Database;
  FILES?: R2Bucket;
  FILES_KV?: KVNamespace;
}

export interface PagesContext<E = Env> {
  request: Request;
  env: E;
  params: Record<string, string | string[]>;
  waitUntil(promise: Promise<unknown>): void;
}
