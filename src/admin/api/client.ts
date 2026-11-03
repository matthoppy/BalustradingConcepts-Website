/**
 * Talking to the admin API, which lives on the same host as the site at
 * /admin-api. The session is an HttpOnly cookie the browser sends by itself,
 * so nothing here holds a token: images and downloads just work as URLs.
 */

import type { AdminApi, CloudflareSummary, EnquiriesList, EnquiryDetail, GoogleStatus, GoogleSummary, Me, PublishPhotosRequest, PublishResult, SitePhotosState } from './types';

export const MOCK_KEY = 'admin:mock';

/** The API's base path. Overridable at build time; same-origin by default. */
export const ADMIN_API_URL: string = (import.meta.env.VITE_ADMIN_API_URL as string | undefined) || '/admin-api';

export class ApiError extends Error {
  status: number;
  /** The publish found the project changed elsewhere since the editor opened it. */
  conflict: boolean;
  constructor(message: string, status: number, conflict = false) {
    super(message);
    this.status = status;
    this.conflict = conflict;
  }
}

export function createApi(baseUrl: string = ADMIN_API_URL): AdminApi {
  const call = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      credentials: 'include',
      headers: { ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...(init.headers || {}) },
    });
    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    if (!res.ok) {
      const message = (data && typeof data === 'object' && 'error' in data && String((data as { error: unknown }).error)) || `The dashboard server answered ${res.status}.`;
      const conflict = !!(data && typeof data === 'object' && 'conflict' in data && (data as { conflict: unknown }).conflict);
      throw new ApiError(message, res.status, conflict);
    }
    return data as T;
  };
  const query = (params: Record<string, string | number | null | undefined>) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
    const s = q.toString();
    return s ? `?${s}` : '';
  };

  return {
    loginUrl: (returnPath) => `${baseUrl}/auth/github/start?return=${encodeURIComponent(returnPath)}`,
    me: () => call<Me>('/me'),
    logout: async () => {
      await call('/auth/logout', { method: 'POST' }).catch(() => undefined);
    },
    listEnquiries: (params = {}) => call<EnquiriesList>(`/enquiries${query({ status: params.status, kind: params.kind, q: params.q })}`),
    getEnquiry: (id) => call<EnquiryDetail>(`/enquiries/${encodeURIComponent(id)}`),
    updateEnquiry: (id, patch) => call<EnquiryDetail>(`/enquiries/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(patch) }),
    enquiryFileUrl: (id, filename) => `${baseUrl}/enquiries/${encodeURIComponent(id)}/files/${encodeURIComponent(filename)}`,
    sitePhotos: () => call<SitePhotosState>('/site/photos'),
    uploadPhoto: (contentBase64) => call<{ sha: string; bytes: number }>('/site/photos/upload', { method: 'POST', body: JSON.stringify({ contentBase64 }) }),
    publishPhotos: (request: PublishPhotosRequest) => call<PublishResult>('/site/photos/publish', { method: 'POST', body: JSON.stringify(request) }),
    cloudflare: (days) => call<CloudflareSummary>(`/cloudflare/summary${query({ days })}`),
    googleStatus: () => call<GoogleStatus>('/google/status'),
    googleConnectUrl: async () => (await call<{ url: string }>('/auth/google/start')).url,
    googleSummary: (days) => call<GoogleSummary>(`/google/summary${query({ days })}`),
    googleDisconnect: async () => {
      await call('/google/disconnect', { method: 'POST' });
    },
  };
}
