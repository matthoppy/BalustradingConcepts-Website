/**
 * Small pieces every dashboard page uses: the page header, status badges,
 * stat tiles, filter chips, and empty, loading and error states.
 */

import type { ReactNode } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import type { EnquiryKind, EnquiryStatus } from './api/types';

export function PageHeader({ title, blurb, actions }: { title: string; blurb?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {blurb && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{blurb}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/** The stages an enquiry goes through, as the CRM plans them: enquiry → survey → quote → accepted. */
export const ENQUIRY_STATUS_LABEL: Record<EnquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  survey: 'Site survey',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
  closed: 'Closed',
};

export const ENQUIRY_KIND_LABEL: Record<EnquiryKind, string> = {
  balustrade: 'Balustrade & fencing',
  heatpump: 'Heat pump cover',
};

const STATUS_TONE: Record<string, string> = {
  new: 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary-foreground',
  contacted: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  survey: 'bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-200',
  quoted: 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200',
  won: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200',
  done: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200',
  lost: 'bg-muted text-muted-foreground',
  closed: 'bg-muted text-muted-foreground',
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded px-2 py-0.5 text-xs font-semibold ${STATUS_TONE[status] || 'bg-muted text-muted-foreground'}`}>
      {label || ENQUIRY_STATUS_LABEL[status as EnquiryStatus] || status}
    </span>
  );
}

export function KindBadge({ kind }: { kind: EnquiryKind }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded border px-1.5 py-0.5 text-[11px] font-medium ${kind === 'heatpump' ? 'border-teal-300 text-teal-900 dark:border-teal-800 dark:text-teal-200' : 'text-muted-foreground'}`}>
      {ENQUIRY_KIND_LABEL[kind]}
    </span>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function FilterChip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 ${
        active ? 'border-foreground bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'
      }`}
    >
      {label}
      {typeof count === 'number' && <span className={`ml-1 ${active ? 'opacity-70' : 'opacity-60'}`}>{count}</span>}
    </button>
  );
}

export function Loading({ what = 'Loading' }: { what?: string }) {
  return (
    <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground" role="status">
      <Loader2 className="h-4 w-4 animate-spin" />
      {what}…
    </div>
  );
}

export function ErrorNote({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="flex gap-3 rounded-lg border border-red-300 bg-red-50 p-4 text-sm dark:border-red-800 dark:bg-red-950/40">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
      <div className="space-y-2">
        <p className="text-red-900 dark:text-red-200">{message}</p>
        {retry && (
          <button type="button" className="text-xs font-medium underline underline-offset-2" onClick={retry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export function Empty({ title, blurb, action }: { title: string; blurb?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <div className="text-sm font-semibold">{title}</div>
      {blurb && <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{blurb}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** "3 Nov 2026, 10:14" in New Zealand time. */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Pacific/Auckland' });
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Pacific/Auckland' });
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(ms / 60000);
  if (minutes < 2) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return days === 1 ? 'yesterday' : `${days} days ago`;
  return formatDate(iso);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-NZ');
}
