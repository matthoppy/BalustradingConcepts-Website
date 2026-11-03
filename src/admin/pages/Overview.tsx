/**
 * The first screen: what has come in, what needs a reply, and whether the
 * site is healthy. Everything links through to the page that deals with it.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { useAdmin } from '../auth';
import type { CloudflareSummary, EnquiriesList, GoogleSummary } from '../api/types';
import { headline, tel } from '../enquiries';
import { ErrorNote, KindBadge, Loading, PageHeader, Stat, StatusBadge, formatNumber, timeAgo } from '../ui';

const DAY_MS = 24 * 3600 * 1000;

export function Overview() {
  const { api, user } = useAdmin();
  const [list, setList] = useState<EnquiriesList | null>(null);
  const [cf, setCf] = useState<CloudflareSummary | null>(null);
  const [google, setGoogle] = useState<GoogleSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    api
      .listEnquiries()
      .then((r) => live && setList(r))
      .catch((e: Error) => live && setError(e.message));
    if (user?.capabilities.cloudflare) api.cloudflare(7).then((r) => live && setCf(r)).catch(() => undefined);
    if (user?.capabilities.google === 'connected') api.googleSummary(28).then((r) => live && setGoogle(r)).catch(() => undefined);
    return () => {
      live = false;
    };
  }, [api, user]);

  if (error) return <ErrorNote message={error} />;
  if (!list) return <Loading what="Loading the overview" />;

  const inHand = (list.counts.contacted || 0) + (list.counts.survey || 0) + (list.counts.quoted || 0);
  const waiting = list.enquiries.filter((e) => e.status === 'new');
  const overdue = waiting.filter((e) => Date.now() - new Date(e.createdAt).getTime() > DAY_MS);
  const latestDeploy = cf?.deployments.find((d) => d.environment === 'production');

  return (
    <div>
      <PageHeader title="Overview" blurb="What has come in, what is in hand, and how the site is doing." />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Waiting for a reply" value={waiting.length} hint={overdue.length ? `${overdue.length} older than a day` : 'New enquiries, not yet contacted'} />
        <Stat label="In hand" value={inHand} hint="Contacted, site survey or quoted" />
        <Stat label="Won this list" value={list.counts.won || 0} hint={`${list.kinds.heatpump || 0} heat pump cover enquiries in all`} />
        {cf?.totals ? (
          <Stat label="Visitors, last 7 days" value={formatNumber(cf.totals.visitors)} hint={`${formatNumber(cf.totals.pageViews)} page views`} />
        ) : google?.reviews ? (
          <Stat label="Google rating" value={google.reviews.averageRating ?? '–'} hint={`${google.reviews.total} reviews`} />
        ) : (
          <Stat label="Site traffic" value="–" hint={<Link to="/admin/site" className="underline underline-offset-2">Connect Cloudflare</Link>} />
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold">Waiting for a reply</h2>
            <Link to="/admin/enquiries?status=new" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              All new <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {waiting.length === 0 ? (
            <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">Nothing waiting. Every enquiry has been contacted.</p>
          ) : (
            <ul className="divide-y rounded-lg border">
              {waiting.slice(0, 6).map((e) => {
                const old = Date.now() - new Date(e.createdAt).getTime() > DAY_MS;
                return (
                  <li key={e.id} className="flex items-center gap-2 px-4 py-3 transition-colors hover:bg-muted/50">
                    <Link to={`/admin/enquiries?open=${e.id}`} className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{e.name || 'Unnamed'}</span>
                        <KindBadge kind={e.kind} />
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {headline(e)}
                        {e.suburb ? ` · ${e.suburb}` : ''}
                      </div>
                    </Link>
                    <span className={`shrink-0 text-xs ${old ? 'font-semibold text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}`}>{timeAgo(e.createdAt)}</span>
                    {e.phone && (
                      <a href={tel(e)} aria-label={`Call ${e.name || 'the customer'}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold">Latest enquiries</h2>
            <Link to="/admin/enquiries" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              All enquiries <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {list.enquiries.length === 0 ? (
            <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              Nothing yet. Enquiries from the quote forms and the heat pump cover form appear here once the site's database is bound (see docs/ADMIN_DASHBOARD.md).
            </p>
          ) : (
            <ul className="divide-y rounded-lg border">
              {list.enquiries.slice(0, 6).map((e) => (
                <li key={e.id}>
                  <Link to={`/admin/enquiries?open=${e.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{e.name || 'Unnamed'}</span>
                        <StatusBadge status={e.status} />
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {headline(e)}
                        {e.suburb ? ` · ${e.suburb}` : ''}
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(e.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {(latestDeploy || google?.reviews) && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {latestDeploy && (
            <section className="rounded-lg border p-4">
              <h2 className="text-sm font-semibold">Site</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Last production deploy {timeAgo(latestDeploy.createdAt)}: {latestDeploy.message || latestDeploy.commit}
              </p>
              <p className="mt-1 text-xs">
                <StatusBadge status={latestDeploy.status === 'success' ? 'done' : latestDeploy.status === 'failure' ? 'lost' : 'contacted'} label={latestDeploy.status || 'unknown'} />
                <Link to="/admin/site" className="ml-3 underline underline-offset-2">
                  Traffic and deployments
                </Link>
              </p>
            </section>
          )}
          {google?.reviews && (
            <section className="rounded-lg border p-4">
              <h2 className="text-sm font-semibold">Google profile</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {google.reviews.averageRating} stars over {google.reviews.total} reviews
                {google.metrics ? `; ${formatNumber(google.metrics.totals.impressions)} views in ${google.metrics.days} days` : ''}.
              </p>
              <p className="mt-1 text-xs">
                <Link to="/admin/google" className="underline underline-offset-2">
                  Reviews and performance
                </Link>
              </p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
