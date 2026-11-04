/**
 * The file store for enquiry photos: an R2 bucket when one is bound, else a
 * KV namespace (values up to 25MB, plenty for a phone photo).
 */

import type { Env } from './bindings';

export interface StoredFile {
  body: ReadableStream | ArrayBuffer;
  contentType: string;
}

export interface FileStore {
  kind: 'r2' | 'kv';
  get(key: string): Promise<StoredFile | null>;
  put(key: string, bytes: Uint8Array, contentType: string): Promise<void>;
}

export function fileStore(env: Env): FileStore | null {
  if (env.FILES) {
    const bucket = env.FILES;
    return {
      kind: 'r2',
      async get(key) {
        const obj = await bucket.get(key);
        if (!obj) return null;
        return { body: obj.body, contentType: obj.httpMetadata?.contentType || 'application/octet-stream' };
      },
      async put(key, bytes, contentType) {
        await bucket.put(key, bytes, { httpMetadata: { contentType } });
      },
    };
  }
  if (env.FILES_KV) {
    const kv = env.FILES_KV;
    return {
      kind: 'kv',
      async get(key) {
        const { value, metadata } = await kv.getWithMetadata<{ contentType?: string }>(key, { type: 'arrayBuffer' });
        if (!value) return null;
        return { body: value, contentType: metadata?.contentType || 'application/octet-stream' };
      },
      async put(key, bytes, contentType) {
        await kv.put(key, bytes, { metadata: { contentType } });
      },
    };
  }
  return null;
}
