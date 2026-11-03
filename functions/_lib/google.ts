/**
 * Google Business Profile: performance and reviews for the listing, through
 * a Google sign-in whose refresh token is kept in the settings table.
 */

import type { D1Database, Env } from './bindings';

export const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/business.manage';
const STAR: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const GBP_METRICS = [
  'BUSINESS_IMPRESSIONS_DESKTOP_MAPS',
  'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH',
  'BUSINESS_IMPRESSIONS_MOBILE_MAPS',
  'BUSINESS_IMPRESSIONS_MOBILE_SEARCH',
  'CALL_CLICKS',
  'WEBSITE_CLICKS',
  'BUSINESS_DIRECTION_REQUESTS',
  'BUSINESS_CONVERSATIONS',
];

export interface GoogleLocation {
  account: string;
  name: string;
  title: string;
  address: string | null;
  mapsUri: string | null;
  newReviewUri: string | null;
}

export async function getSetting(db: D1Database, key: string): Promise<string | null> {
  const row = await db.prepare('SELECT value FROM settings WHERE key = ?1').bind(key).first<{ value: string }>();
  return row ? row.value : null;
}

export async function putSetting(db: D1Database, key: string, value: string): Promise<void> {
  await db
    .prepare('INSERT INTO settings (key, value, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at')
    .bind(key, value, new Date().toISOString())
    .run();
}

async function googleAccessToken(env: Env, db: D1Database): Promise<string | null> {
  const refresh = await getSetting(db, 'google.refresh_token');
  if (!refresh) return null;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID || '', client_secret: env.GOOGLE_CLIENT_SECRET || '', refresh_token: refresh, grant_type: 'refresh_token' }),
  });
  const data = (await res.json().catch(() => ({}))) as { access_token?: string; error?: string; error_description?: string };
  if (!res.ok || !data.access_token) throw new Error(data.error_description || data.error || 'Google token refresh failed');
  return data.access_token;
}

async function googleGet<T>(token: string, url: string): Promise<T> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = (await res.json().catch(() => ({}))) as T & { error?: { message?: string } };
  if (!res.ok) throw new Error(data?.error?.message || `Google returned ${res.status}`);
  return data;
}

/** The first account and location, remembered once found. */
export async function googleLocation(db: D1Database, token: string): Promise<GoogleLocation> {
  const stored = await getSetting(db, 'google.location');
  if (stored) return JSON.parse(stored);
  const accounts = await googleGet<{ accounts?: { name: string }[] }>(token, 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts');
  const account = accounts.accounts?.[0];
  if (!account) throw new Error('No Business Profile account on this Google login');
  type Loc = { name: string; title: string; storefrontAddress?: { addressLines?: string[] }; metadata?: { mapsUri?: string; newReviewUri?: string } };
  const locations = await googleGet<{ locations?: Loc[] }>(token, `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storefrontAddress,metadata&pageSize=10`);
  const location = locations.locations?.[0];
  if (!location) throw new Error('No location on the Business Profile account');
  const record: GoogleLocation = {
    account: account.name,
    name: location.name,
    title: location.title,
    address: location.storefrontAddress?.addressLines?.join(', ') || null,
    mapsUri: location.metadata?.mapsUri || null,
    newReviewUri: location.metadata?.newReviewUri || null,
  };
  await putSetting(db, 'google.location', JSON.stringify(record));
  return record;
}

function datePart(d: Date) {
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

export interface GoogleSummary {
  configured?: boolean;
  connected: boolean;
  location?: GoogleLocation;
  metrics?: {
    days: number;
    totals: { impressions: number; calls: number; websiteClicks: number; directions: number; messages: number };
    daily: { date: string; impressions: number; calls: number; websiteClicks: number; directions: number }[];
  } | null;
  reviews?: { averageRating: number | null; total: number; items: { id: string; name: string; photo: string | null; rating: number | null; comment: string; at: string; replied: boolean }[] } | null;
  errors?: Record<string, string>;
}

export async function googleSummary(env: Env, db: D1Database, days: number): Promise<GoogleSummary> {
  const token = await googleAccessToken(env, db);
  if (!token) return { connected: false };
  const location = await googleLocation(db, token);
  const out: GoogleSummary = { connected: true, location, metrics: null, reviews: null, errors: {} };

  try {
    const until = new Date(Date.now() - 2 * 24 * 3600 * 1000); // Google lags about two days.
    const since = new Date(until.getTime() - (days - 1) * 24 * 3600 * 1000);
    const s = datePart(since);
    const u = datePart(until);
    const params = new URLSearchParams();
    for (const m of GBP_METRICS) params.append('dailyMetrics', m);
    params.set('dailyRange.startDate.year', String(s.year));
    params.set('dailyRange.startDate.month', String(s.month));
    params.set('dailyRange.startDate.day', String(s.day));
    params.set('dailyRange.endDate.year', String(u.year));
    params.set('dailyRange.endDate.month', String(u.month));
    params.set('dailyRange.endDate.day', String(u.day));
    type Series = { multiDailyMetricTimeSeries?: { dailyMetricTimeSeries?: { dailyMetric: string; timeSeries?: { datedValues?: { date: { year: number; month: number; day: number }; value?: string }[] } }[] }[] };
    const data = await googleGet<Series>(token, `https://businessprofileperformance.googleapis.com/v1/${location.name}:fetchMultiDailyMetricsTimeSeries?${params}`);
    const byDate = new Map<string, Record<string, number | string>>();
    const totals: Record<string, number> = {};
    for (const block of data.multiDailyMetricTimeSeries || []) {
      for (const series of block.dailyMetricTimeSeries || []) {
        const metric = series.dailyMetric;
        totals[metric] = 0;
        for (const dv of series.timeSeries?.datedValues || []) {
          const d = dv.date;
          const key = `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
          const value = Number(dv.value || 0);
          totals[metric] += value;
          const row = byDate.get(key) || { date: key };
          row[metric] = value;
          byDate.set(key, row);
        }
      }
    }
    const daily = [...byDate.values()].sort((a, b) => String(a.date).localeCompare(String(b.date)));
    const n = (r: Record<string, number | string>, k: string) => Number(r[k] || 0);
    const impressions = (r: Record<string, number | string>) =>
      n(r, 'BUSINESS_IMPRESSIONS_DESKTOP_MAPS') + n(r, 'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH') + n(r, 'BUSINESS_IMPRESSIONS_MOBILE_MAPS') + n(r, 'BUSINESS_IMPRESSIONS_MOBILE_SEARCH');
    out.metrics = {
      days,
      totals: {
        impressions: impressions(totals),
        calls: totals.CALL_CLICKS || 0,
        websiteClicks: totals.WEBSITE_CLICKS || 0,
        directions: totals.BUSINESS_DIRECTION_REQUESTS || 0,
        messages: totals.BUSINESS_CONVERSATIONS || 0,
      },
      daily: daily.map((r) => ({ date: String(r.date), impressions: impressions(r), calls: n(r, 'CALL_CLICKS'), websiteClicks: n(r, 'WEBSITE_CLICKS'), directions: n(r, 'BUSINESS_DIRECTION_REQUESTS') })),
    };
  } catch (err) {
    out.errors!.metrics = String((err as Error).message || err);
  }

  try {
    type Reviews = { averageRating?: number; totalReviewCount?: number; reviews?: { reviewId: string; reviewer?: { displayName?: string; profilePhotoUrl?: string }; starRating?: string; comment?: string; createTime: string; reviewReply?: unknown }[] };
    const data = await googleGet<Reviews>(token, `https://mybusiness.googleapis.com/v4/${location.account}/${location.name}/reviews?pageSize=10`);
    out.reviews = {
      averageRating: data.averageRating ?? null,
      total: data.totalReviewCount ?? 0,
      items: (data.reviews || []).map((r) => ({
        id: r.reviewId,
        name: r.reviewer?.displayName || 'Anonymous',
        photo: r.reviewer?.profilePhotoUrl || null,
        rating: STAR[r.starRating || ''] || null,
        comment: r.comment || '',
        at: r.createTime,
        replied: !!r.reviewReply,
      })),
    };
  } catch (err) {
    out.errors!.reviews = String((err as Error).message || err);
  }
  return out;
}
