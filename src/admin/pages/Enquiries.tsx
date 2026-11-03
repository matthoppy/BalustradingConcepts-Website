/**
 * The enquiries: every quote request from the home page form, the "Request
 * a quote" button and the heat pump cover form, with every field the
 * customer filled in, the photo they attached, and where the job is up to.
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAdmin } from '../auth';
import { ENQUIRY_KINDS, ENQUIRY_STATUSES, type EnquiriesList, type Enquiry, type EnquiryDetail, type EnquiryKind, type EnquiryStatus } from '../api/types';
import { customerNotes, fieldRows, headline, mailto, mapsUrl, protectsFall, siteLine, sourceName, tel } from '../enquiries';
import { ENQUIRY_KIND_LABEL, ENQUIRY_STATUS_LABEL, Empty, ErrorNote, FilterChip, KindBadge, Loading, PageHeader, StatusBadge, formatBytes, formatDateTime, timeAgo } from '../ui';

export function Enquiries() {
  const { api } = useAdmin();
  const [params, setParams] = useSearchParams();
  const status = (params.get('status') as EnquiryStatus | null) || null;
  const kind = (params.get('kind') as EnquiryKind | null) || null;
  const [q, setQ] = useState(params.get('q') || '');
  const [list, setList] = useState<EnquiriesList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(params.get('open'));

  useEffect(() => {
    let live = true;
    const t = setTimeout(() => {
      api
        .listEnquiries({ status, kind, q })
        .then((r) => live && setList(r))
        .catch((e: Error) => live && setError(e.message));
    }, 150);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [api, status, kind, q]);

  const setFilter = (key: 'status' | 'kind', value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('open');
    setParams(next, { replace: true });
  };

  const replace = (e: Enquiry) => setList((l) => (l ? { ...l, enquiries: l.enquiries.map((x) => (x.id === e.id ? { ...x, ...e } : x)) } : l));
  const total = list ? Object.values(list.counts).reduce((a, b) => a + (b || 0), 0) : 0;

  return (
    <div>
      <PageHeader title="Enquiries" blurb="Quote requests from the website: the home page form, the “Request a quote” button and the heat pump covers page. Tap one to see everything the customer sent." />
      <div className="mb-4 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1">
            <FilterChip active={status === null} onClick={() => setFilter('status', null)} label="All" count={total} />
            {ENQUIRY_STATUSES.map((s) => (
              <FilterChip key={s} active={status === s} onClick={() => setFilter('status', s)} label={ENQUIRY_STATUS_LABEL[s]} count={list?.counts[s] || 0} />
            ))}
          </div>
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone, address, company" className="ml-auto h-9 w-full sm:w-80" aria-label="Search enquiries" />
        </div>
        <div className="flex flex-wrap gap-1">
          <FilterChip active={kind === null} onClick={() => setFilter('kind', null)} label="All kinds" />
          {ENQUIRY_KINDS.map((k) => (
            <FilterChip key={k} active={kind === k} onClick={() => setFilter('kind', k)} label={ENQUIRY_KIND_LABEL[k]} count={list?.kinds[k] || 0} />
          ))}
        </div>
      </div>

      {error ? (
        <ErrorNote message={error} />
      ) : !list ? (
        <Loading what="Loading enquiries" />
      ) : list.enquiries.length === 0 ? (
        <Empty
          title={q || status || kind ? 'No enquiries match' : 'No enquiries yet'}
          blurb={q || status || kind ? 'Try another status, kind or search.' : 'Enquiries appear here once the site’s database is bound. Until then they still arrive by email as before.'}
        />
      ) : (
        <ul className="divide-y rounded-lg border">
          {list.enquiries.map((e) => (
            <EnquiryRow key={e.id} enquiry={e} open={open === e.id} onToggle={() => setOpen(open === e.id ? null : e.id)} onChange={replace} />
          ))}
        </ul>
      )}
    </div>
  );
}

function EnquiryRow({ enquiry, open, onToggle, onChange }: { enquiry: Enquiry; open: boolean; onToggle: () => void; onChange: (e: Enquiry) => void }) {
  const fall = protectsFall(enquiry);
  return (
    <li id={enquiry.id}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="grid w-full gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/50 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_auto] sm:items-center sm:gap-4"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-medium">{enquiry.name || 'Unnamed'}</span>
            <StatusBadge status={enquiry.status} />
            {enquiry.kind === 'heatpump' && <KindBadge kind={enquiry.kind} />}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {enquiry.company ? `${enquiry.company} · ` : ''}
            {enquiry.suburb || enquiry.siteAddress || 'No site address'}
          </div>
        </div>
        <div className="min-w-0 text-sm text-muted-foreground">
          <span className="truncate">{headline(enquiry)}</span>
          {fall && (
            <span className="ml-2 rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              fall protection
            </span>
          )}
          {enquiry.fields.requiredDate && <span className="ml-2 text-xs">needed {enquiry.fields.requiredDate}</span>}
        </div>
        <div className="text-xs text-muted-foreground sm:text-right" title={formatDateTime(enquiry.createdAt)}>
          {timeAgo(enquiry.createdAt)}
        </div>
      </button>
      {open && <EnquiryCard enquiry={enquiry} onChange={onChange} />}
    </li>
  );
}

function EnquiryCard({ enquiry, onChange }: { enquiry: Enquiry; onChange: (e: Enquiry) => void }) {
  const { api } = useAdmin();
  const [detail, setDetail] = useState<EnquiryDetail | null>(null);
  const [notes, setNotes] = useState(enquiry.notes || '');
  const [saving, setSaving] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    api
      .getEnquiry(enquiry.id)
      .then((d) => live && setDetail(d))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [api, enquiry.id]);

  const update = async (patch: { status?: EnquiryStatus; notes?: string }) => {
    setSaving(true);
    setProblem(null);
    try {
      const next = await api.updateEnquiry(enquiry.id, patch);
      setDetail(next);
      onChange(next);
    } catch (e) {
      setProblem((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const rows = fieldRows(enquiry);
  const notesFromCustomer = customerNotes(enquiry);
  const site = siteLine(enquiry);
  const map = mapsUrl(enquiry);
  const fall = protectsFall(enquiry);

  return (
    <div className="grid gap-5 border-t bg-muted/20 px-4 py-4 md:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap gap-2">
          {enquiry.phone && (
            <a href={tel(enquiry)} className="inline-flex h-9 items-center gap-1.5 rounded border bg-background px-3 text-sm font-medium hover:bg-muted">
              <Phone className="h-3.5 w-3.5" /> {enquiry.phone}
            </a>
          )}
          {enquiry.email && (
            <a href={mailto(enquiry)} className="inline-flex h-9 items-center gap-1.5 rounded border bg-background px-3 text-sm font-medium hover:bg-muted">
              <Mail className="h-3.5 w-3.5" /> Email
            </a>
          )}
          {map && (
            <a href={map} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded border bg-background px-3 text-sm font-medium hover:bg-muted">
              <MapPin className="h-3.5 w-3.5" /> Map
            </a>
          )}
        </div>

        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5">
          {enquiry.email && (
            <>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="break-all">{enquiry.email}</dd>
            </>
          )}
          {enquiry.company && (
            <>
              <dt className="text-xs text-muted-foreground">Company</dt>
              <dd>{enquiry.company}</dd>
            </>
          )}
          {site && (
            <>
              <dt className="text-xs text-muted-foreground">Site</dt>
              <dd>{site}</dd>
            </>
          )}
          {rows.map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))}
        </dl>

        {fall && (
          <p className="flex gap-2 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            The customer says this balustrade prevents a fall, so it must meet NZ Building Code F4: 1 m minimum height (1.1 m on some decks) and barrier loading. Check the height they gave.
          </p>
        )}

        {notesFromCustomer && (
          <div>
            <div className="text-xs text-muted-foreground">From the customer</div>
            <p className="mt-0.5 whitespace-pre-wrap">{notesFromCustomer}</p>
          </div>
        )}

        {enquiry.photo && (
          <div>
            <a href={api.enquiryFileUrl(enquiry.id, enquiry.photo.filename)} target="_blank" rel="noreferrer" className="block w-fit overflow-hidden rounded border">
              <img src={api.enquiryFileUrl(enquiry.id, enquiry.photo.filename)} alt="Attached by the customer" className="max-h-56 object-cover" loading="lazy" />
            </a>
            <a href={api.enquiryFileUrl(enquiry.id, enquiry.photo.filename)} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs underline-offset-2 hover:underline">
              <ExternalLink className="h-3 w-3" /> {enquiry.photo.filename} ({formatBytes(enquiry.photo.bytes)})
            </a>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {enquiry.id} · {formatDateTime(enquiry.createdAt)} · from the {sourceName(enquiry.source)} · {enquiry.emailed ? 'emailed to the office' : 'not emailed'}
        </p>

        {detail && detail.events.length > 1 && (
          <div>
            <div className="text-xs text-muted-foreground">History</div>
            <ul className="mt-1 space-y-1 text-xs">
              {detail.events
                .slice()
                .reverse()
                .map((ev) => (
                  <li key={ev.id} className="flex gap-2">
                    <span className="shrink-0 text-muted-foreground" title={formatDateTime(ev.at)}>
                      {timeAgo(ev.at)}
                    </span>
                    <span className="min-w-0">
                      {ev.kind === 'status' && ev.detail ? (
                        <>
                          {ev.actor || 'someone'} moved it {ev.detail.replace(/\b(\w+)\b/g, (w) => ENQUIRY_STATUS_LABEL[w as EnquiryStatus]?.toLowerCase() || w)}
                        </>
                      ) : ev.kind === 'note' ? (
                        <>
                          {ev.actor || 'someone'} wrote: <span className="text-muted-foreground">{ev.detail}</span>
                        </>
                      ) : (
                        ev.detail
                      )}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-xs">
          <span className="text-muted-foreground">Status</span>
          <select value={enquiry.status} disabled={saving} onChange={(e) => update({ status: e.target.value as EnquiryStatus })} className="mt-1 h-9 w-full rounded border bg-background px-2 text-sm">
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ENQUIRY_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="text-muted-foreground">Office notes</span>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== (enquiry.notes || '') && update({ notes })} rows={4} className="mt-1 text-sm" placeholder="Who you spoke to, what was agreed, when to chase…" />
          <span className="mt-1 block text-[11px] text-muted-foreground">Saved when you tap away.</span>
        </label>
        {problem && <ErrorNote message={problem} />}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words">{value}</dd>
    </>
  );
}
