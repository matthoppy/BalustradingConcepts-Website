/**
 * Cloudflare data for the Site page: zone traffic, the Pages Functions and
 * workers' request counts, and the latest Pages deployments.
 */

import type { Env } from './bindings';
import { isoDate, setting } from './util';

export const DEFAULT_PAGES_PROJECT = 'balustradingconcepts-website';

export interface TrafficDay {
  date: string;
  requests: number;
  pageViews: number;
  visitors: number;
  threats: number;
  bytes: number;
}

export interface CloudflareSummary {
  configured: { token: boolean; zone: boolean; account: boolean };
  days: TrafficDay[];
  totals: Omit<TrafficDay, 'date'> | null;
  workers: { name: string; requests: number; errors: number }[];
  deployments: {
    id: string;
    createdAt: string;
    environment: string;
    branch: string | null;
    commit: string | null;
    message: string | null;
    stage: string | null;
    status: string | null;
    url: string;
  }[];
  errors: Record<string, string>;
}

async function cfRest<T>(env: Env, path: string): Promise<T> {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, { headers: { Authorization: `Bearer ${env.CF_API_TOKEN}` } });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; result?: T; errors?: { message: string }[] };
  if (!res.ok || data.success === false) throw new Error(data?.errors?.[0]?.message || `Cloudflare returned ${res.status}`);
  return data.result as T;
}

async function cfGraphql<T>(env: Env, query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.CF_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const data = (await res.json().catch(() => ({}))) as { data?: T; errors?: { message: string }[] };
  if (data.errors?.length) throw new Error(data.errors[0].message);
  return data.data as T;
}

export async function cloudflareSummary(env: Env, days: number): Promise<CloudflareSummary> {
  const configured = { token: !!env.CF_API_TOKEN, zone: !!env.CF_ZONE_ID, account: !!env.CF_ACCOUNT_ID };
  const out: CloudflareSummary = { configured, days: [], totals: null, workers: [], deployments: [], errors: {} };
  if (!configured.token) return out;
  const until = new Date();
  const since = new Date(until.getTime() - (days - 1) * 24 * 3600 * 1000);

  if (configured.zone) {
    try {
      type Zones = { viewer?: { zones?: { httpRequests1dGroups?: { dimensions: { date: string }; sum: { requests: number; pageViews: number; threats: number; bytes: number }; uniq: { uniques: number } }[] }[] } };
      const data = await cfGraphql<Zones>(
        env,
        `query($zone: String!, $since: Date!, $until: Date!) {
          viewer { zones(filter: { zoneTag: $zone }) {
            httpRequests1dGroups(limit: 100, filter: { date_geq: $since, date_leq: $until }, orderBy: [date_ASC]) {
              dimensions { date }
              sum { requests pageViews threats bytes }
              uniq { uniques }
            }
          } }
        }`,
        { zone: env.CF_ZONE_ID, since: isoDate(since), until: isoDate(until) }
      );
      const groups = data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];
      out.days = groups.map((g) => ({
        date: g.dimensions.date,
        requests: g.sum.requests,
        pageViews: g.sum.pageViews,
        visitors: g.uniq.uniques,
        threats: g.sum.threats,
        bytes: g.sum.bytes,
      }));
      out.totals = out.days.reduce(
        (t, d) => ({ requests: t.requests + d.requests, pageViews: t.pageViews + d.pageViews, visitors: t.visitors + d.visitors, threats: t.threats + d.threats, bytes: t.bytes + d.bytes }),
        { requests: 0, pageViews: 0, visitors: 0, threats: 0, bytes: 0 }
      );
    } catch (err) {
      out.errors.analytics = String((err as Error).message || err);
    }
  }

  if (configured.account) {
    try {
      type Accounts = { viewer?: { accounts?: { workersInvocationsAdaptive?: { dimensions: { scriptName: string }; sum: { requests: number; errors: number } }[] }[] } };
      const data = await cfGraphql<Accounts>(
        env,
        `query($account: String!, $since: Time!, $until: Time!) {
          viewer { accounts(filter: { accountTag: $account }) {
            workersInvocationsAdaptive(limit: 100, filter: { datetime_geq: $since, datetime_leq: $until }) {
              dimensions { scriptName }
              sum { requests errors subrequests }
            }
          } }
        }`,
        { account: env.CF_ACCOUNT_ID, since: since.toISOString(), until: until.toISOString() }
      );
      const rows = data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive || [];
      const byName = new Map<string, { name: string; requests: number; errors: number }>();
      for (const r of rows) {
        const cur = byName.get(r.dimensions.scriptName) || { name: r.dimensions.scriptName, requests: 0, errors: 0 };
        cur.requests += r.sum.requests;
        cur.errors += r.sum.errors;
        byName.set(cur.name, cur);
      }
      out.workers = [...byName.values()].sort((a, b) => b.requests - a.requests);
    } catch (err) {
      out.errors.workers = String((err as Error).message || err);
    }
    try {
      const project = setting(env as Record<string, unknown>, 'CF_PAGES_PROJECT', DEFAULT_PAGES_PROJECT);
      type Deployment = {
        id: string;
        created_on: string;
        environment: string;
        deployment_trigger?: { metadata?: { branch?: string; commit_hash?: string; commit_message?: string } };
        latest_stage?: { name?: string; status?: string };
        url: string;
      };
      const list = await cfRest<Deployment[]>(env, `/accounts/${env.CF_ACCOUNT_ID}/pages/projects/${project}/deployments?per_page=8`);
      out.deployments = (list || []).map((d) => ({
        id: d.id,
        createdAt: d.created_on,
        environment: d.environment,
        branch: d.deployment_trigger?.metadata?.branch || null,
        commit: d.deployment_trigger?.metadata?.commit_hash?.slice(0, 7) || null,
        message: d.deployment_trigger?.metadata?.commit_message || null,
        stage: d.latest_stage?.name || null,
        status: d.latest_stage?.status || null,
        url: d.url,
      }));
    } catch (err) {
      out.errors.deployments = String((err as Error).message || err);
    }
  }
  return out;
}
