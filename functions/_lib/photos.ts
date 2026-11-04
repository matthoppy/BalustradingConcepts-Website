/**
 * The website photos: the manifest the site reads (src/content/site-images.json),
 * what the dashboard may change, and the commit that publishes a change to the
 * repository as the signed-in user, which makes Cloudflare Pages redeploy.
 */

import { HttpError, fromBase64url } from './util';

/** The repository paths the Projects page may touch. */
export const UPLOAD_DIR = 'public/images/site/';
export const SITE_PREFIX = '/images/site/';
export const MANIFEST_PATH = 'src/content/site-images.json';
export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
export const MAX_PHOTOS_PER_PUBLISH = 30;
export const MAX_TITLE_LENGTH = 80;
export const MAX_STYLE_LENGTH = 80;

/** The parts of the gallery, as src/content/siteImages.ts lists them. */
export const PROJECT_TYPES = ['balustrade', 'commercial', 'poolfence'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];
export const PROJECT_TYPE_NAMES: Record<ProjectType, string> = {
  balustrade: 'Residential balustrades',
  commercial: 'Commercial projects',
  poolfence: 'Pool fencing',
};
export const HERO_SLOTS = ['hero', 'poolHero', 'heatPumpHero'] as const;
export type HeroSlot = (typeof HERO_SLOTS)[number];
const SLOT_NAMES: Record<HeroSlot, string> = { hero: 'the home hero', poolHero: 'the pool fencing hero', heatPumpHero: 'the heat pump hero' };

export interface Picture {
  src: string;
  alt: string;
  v: number;
}

export interface Project {
  title: string;
  style: string;
  photos: string[];
  alt?: string;
}

export interface Manifest {
  version: number;
  hero: Picture;
  poolHero: Picture;
  heatPumpHero: Picture;
  about: Picture[];
  projects: Record<string, Project[]>;
  [key: string]: unknown;
}

export type Change =
  | { kind: 'project'; mode: 'add'; type: ProjectType; title: string; style: string; photos: string[] }
  | { kind: 'project'; mode: 'update'; type: ProjectType; title: string; style: string; photos: string[]; origType: ProjectType; origIndex: number; origJson: string }
  | { kind: 'project'; mode: 'delete'; origType: ProjectType; origIndex: number; origJson: string }
  | { kind: 'slot'; slot: HeroSlot | 'about'; index?: number; alt: string; photo: string | null };

/**
 * The manifest with every type of work present and only well-formed entries.
 * Anything else in the file is kept as it was.
 */
export function normaliseManifest(raw: unknown): Manifest {
  const m = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const picture = (x: unknown): Picture | null => {
    const p = x as Record<string, unknown> | null;
    return p && typeof p === 'object' && typeof p.src === 'string'
      ? { src: p.src, alt: typeof p.alt === 'string' ? p.alt : '', v: Number(p.v) || 1 }
      : null;
  };
  const empty = { src: '', alt: '', v: 1 };
  const out: Manifest = {
    version: 1,
    hero: picture(m.hero) || empty,
    poolHero: picture(m.poolHero) || empty,
    heatPumpHero: picture(m.heatPumpHero) || empty,
    about: Array.isArray(m.about) ? (m.about.map(picture).filter(Boolean) as Picture[]) : [],
    projects: {},
  };
  const projects = (m.projects && typeof m.projects === 'object' ? m.projects : {}) as Record<string, unknown>;
  for (const type of PROJECT_TYPES) {
    out.projects[type] = (Array.isArray(projects[type]) ? projects[type] : [])
      .filter((j: unknown) => j && typeof j === 'object')
      .map((j: Record<string, unknown>) => {
        const project: Project = {
          title: String(j.title || ''),
          style: typeof j.style === 'string' ? j.style : '',
          photos: Array.isArray(j.photos) ? j.photos.filter((p: unknown): p is string => typeof p === 'string' && !!p) : [],
        };
        if (typeof j.alt === 'string' && j.alt) project.alt = j.alt;
        return project;
      });
  }
  for (const k of Object.keys(projects)) if (!(k in out.projects)) out.projects[k] = projects[k] as Project[];
  for (const k of Object.keys(m)) if (!(k in out)) out[k] = m[k];
  return out;
}

const isSitePath = (p: unknown): p is string => typeof p === 'string' && p.startsWith('/images/') && !p.includes('..') && !/[\s"'<>\\]/.test(p);
const isNewPhoto = (p: unknown, count: number): p is string => typeof p === 'string' && /^new:\d+$/.test(p) && Number(p.slice(4)) < count;

export interface ValidatedChange {
  ok: boolean;
  errors: string[];
  change: Change;
  blobs: { sha: string }[];
  message: string;
}

/**
 * What the Projects page may publish, checked before GitHub is touched. A
 * change is one project (added, updated or deleted) or one page picture; the
 * photos it names are either paths already on the site or "new:<n>", the nth
 * blob uploaded just before.
 */
export function validateChange(body: unknown): ValidatedChange {
  const errors: string[] = [];
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const change = (b.change && typeof b.change === 'object' ? b.change : null) as Record<string, unknown> | null;
  const blobs = (Array.isArray(b.blobs) ? b.blobs : []) as { sha: string }[];
  if (blobs.length > MAX_PHOTOS_PER_PUBLISH) errors.push(`too many photos at once (${blobs.length})`);
  for (const x of blobs) if (!x || !/^[0-9a-f]{40}$/.test(String(x.sha || ''))) errors.push('an uploaded photo has no blob id');
  if (!change) errors.push('no change given');
  else if (change.kind === 'project') {
    const mode = change.mode;
    if (!['add', 'update', 'delete'].includes(String(mode))) errors.push('unknown project change');
    if (mode === 'add' || mode === 'update') {
      if (!(PROJECT_TYPES as readonly string[]).includes(String(change.type))) errors.push('unknown type of work');
      const title = typeof change.title === 'string' ? change.title.trim() : '';
      if (!title) errors.push('the project needs a name');
      if (title.length > MAX_TITLE_LENGTH) errors.push('the name is too long');
      if (change.style != null && (typeof change.style !== 'string' || change.style.length > MAX_STYLE_LENGTH)) errors.push('the style is too long');
      const photos = Array.isArray(change.photos) ? change.photos : [];
      if (!photos.length) errors.push('the project needs at least one photo');
      for (const p of photos) if (!isSitePath(p) && !isNewPhoto(p, blobs.length)) errors.push(`not a photo of the site: ${p}`);
    }
    if (mode === 'update' || mode === 'delete') {
      if (!(PROJECT_TYPES as readonly string[]).includes(String(change.origType))) errors.push("the project's current type is unknown");
      if (!Number.isInteger(change.origIndex) || (change.origIndex as number) < 0) errors.push("the project's position is unknown");
      if (typeof change.origJson !== 'string' || !change.origJson) errors.push('the project as it was is missing');
    }
  } else if (change.kind === 'slot') {
    const slot = String(change.slot);
    if (!(HERO_SLOTS as readonly string[]).includes(slot) && slot !== 'about') errors.push('unknown page picture');
    if (slot === 'about' && !(Number.isInteger(change.index) && (change.index as number) >= 0)) errors.push('which About picture?');
    if (typeof change.alt !== 'string' || change.alt.length > 200) errors.push('the description is missing or too long');
    if (change.photo != null && !isSitePath(change.photo) && !isNewPhoto(change.photo, blobs.length)) errors.push('not a photo of the site');
  } else errors.push('unknown change');
  return {
    ok: errors.length === 0,
    errors,
    change: change as unknown as Change,
    blobs,
    message: typeof b.message === 'string' ? b.message.slice(0, 200) : '',
  };
}

function conflict(message: string): HttpError {
  return new HttpError(message, 409, true);
}

/** Of the paths dropped, those under the photos folder that nothing on the site still shows. */
function unused(manifest: Manifest, dropped: string[]): string[] {
  const still = JSON.stringify(manifest);
  return [...new Set(dropped)].filter((p) => p.startsWith(SITE_PREFIX) && !still.includes(`"${p}"`));
}

/**
 * The change applied to a fresh copy of the manifest. A project is found by
 * what it looked like when the editor opened it, so two people publishing at
 * once cannot overwrite each other: if it has moved it is still found, and if
 * it has changed the publish is refused. `newPaths` are the site paths of the
 * uploaded photos, in blob order. Returns the next manifest and the photo
 * files nothing uses any more.
 */
export function applyChange(current: unknown, change: Change, newPaths: string[] = []): { manifest: Manifest; removed: string[] } {
  const manifest = normaliseManifest(current);
  const resolve = (p: string) => (/^new:\d+$/.test(p) ? newPaths[Number(p.slice(4))] : p);
  const dropped: string[] = [];

  if (change.kind === 'slot') {
    const old = change.slot === 'about' ? manifest.about[change.index ?? 0] : manifest[change.slot];
    if (!old || !old.src) throw conflict('That page picture is not on the site any more.');
    const src = change.photo ? resolve(change.photo) : old.src;
    const next = { src, alt: change.alt, v: src === old.src ? old.v : 1 };
    if (change.slot === 'about') manifest.about[change.index ?? 0] = next;
    else manifest[change.slot] = next;
    if (src !== old.src) dropped.push(old.src);
    return { manifest, removed: unused(manifest, dropped) };
  }

  const finalPhotos = change.mode === 'delete' ? [] : change.photos.map(resolve);
  if (change.mode === 'add') {
    (manifest.projects[change.type] = manifest.projects[change.type] || []).unshift({ title: change.title.trim(), style: (change.style || '').trim(), photos: finalPhotos });
    return { manifest, removed: [] };
  }

  const list = manifest.projects[change.origType] || [];
  let idx = -1;
  if (list[change.origIndex] && JSON.stringify(list[change.origIndex]) === change.origJson) idx = change.origIndex;
  else idx = list.findIndex((j) => JSON.stringify(j) === change.origJson);
  if (idx === -1) throw conflict('This project was changed somewhere else while you were editing. Go back to Projects to see the latest version.');
  const [old] = list.splice(idx, 1);
  for (const p of old.photos) if (change.mode === 'delete' || !finalPhotos.includes(p)) dropped.push(p);
  if (change.mode === 'delete') return { manifest, removed: unused(manifest, dropped) };
  const updated: Project = { title: change.title.trim(), style: (change.style || '').trim(), photos: finalPhotos };
  if (change.type === change.origType) list.splice(idx, 0, updated);
  else (manifest.projects[change.type] = manifest.projects[change.type] || []).unshift(updated);
  return { manifest, removed: unused(manifest, dropped) };
}

export function slugify(s: string): string {
  return (
    String(s || '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'photo'
  );
}

function stamp(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}-${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`;
}

export function describeChange(change: Change): string {
  if (change.kind === 'slot') return change.slot === 'about' ? `Update About picture ${(change.index || 0) + 1}` : `Replace ${SLOT_NAMES[change.slot]} picture`;
  const type = PROJECT_TYPE_NAMES[change.mode === 'delete' ? change.origType : change.type] || '';
  if (change.mode === 'delete') {
    let title = '';
    try {
      title = JSON.parse(change.origJson).title || '';
    } catch {
      title = '';
    }
    return `Remove gallery project: ${title || 'untitled'} (${type})`;
  }
  return `${change.mode === 'add' ? 'Add' : 'Update'} gallery project: ${change.title.trim()} (${type})`;
}

// ── GitHub ───────────────────────────────────────────────────────────────────

export async function github<T = Record<string, unknown>>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'balustrading-admin',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data: Record<string, unknown> | null = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) throw new HttpError(`GitHub ${method} ${path} returned ${res.status}: ${data?.message || text.slice(0, 200)}`, res.status);
  return data as T;
}

export function decodeContent(file: { content?: string }): string {
  const bytes = fromBase64url(String(file.content || '').replace(/\n/g, '').replace(/\+/g, '-').replace(/\//g, '_'));
  return new TextDecoder().decode(bytes);
}

export interface PublishResult {
  sha: string | null;
  url: string | null;
  unchanged?: boolean;
  manifest: Manifest;
  newPaths: string[];
}

/**
 * One commit on the branch: the uploaded photos under public/images/site/,
 * the manifest, and the removal of photos nothing uses any more. If someone
 * else committed between reading the manifest and moving the branch, GitHub
 * refuses the fast-forward and the whole thing is done once more from the
 * new head, with the blobs already uploaded.
 */
export async function publishChange(token: string, repo: string, branch: string, { change, blobs, message }: ValidatedChange, actor: string): Promise<PublishResult> {
  const label = change.kind === 'slot' ? (change.slot === 'about' ? `about-${(change.index || 0) + 1}` : change.slot) : change.mode === 'delete' ? 'project' : change.title;
  const base = `${slugify(label)}-${stamp()}`;
  const repoPaths = blobs.map((_, i) => `${UPLOAD_DIR}${base}${blobs.length > 1 ? `-${i + 1}` : ''}.jpg`);
  const sitePaths = repoPaths.map((p) => `/${p.slice('public/'.length)}`);

  const attempt = async (retried: boolean): Promise<PublishResult> => {
    const ref = await github<{ object: { sha: string } }>(token, 'GET', `/repos/${repo}/git/ref/heads/${branch}`);
    const headSha = ref.object.sha;
    const file = await github<{ content: string }>(token, 'GET', `/repos/${repo}/contents/${MANIFEST_PATH}?ref=${headSha}`);
    const current = normaliseManifest(JSON.parse(decodeContent(file)));
    const { manifest, removed } = applyChange(current, change, sitePaths);
    if (!blobs.length && JSON.stringify(manifest) === JSON.stringify(current)) {
      return { sha: null, url: null, unchanged: true, manifest, newPaths: [] };
    }
    const tree: Record<string, unknown>[] = repoPaths.map((path, i) => ({ path, mode: '100644', type: 'blob', sha: blobs[i].sha }));
    tree.push({ path: MANIFEST_PATH, mode: '100644', type: 'blob', content: JSON.stringify(manifest, null, 2) + '\n' });
    for (const p of removed) tree.push({ path: `public${p}`, mode: '100644', type: 'blob', sha: null });
    try {
      const head = await github<{ tree: { sha: string } }>(token, 'GET', `/repos/${repo}/git/commits/${headSha}`);
      const newTree = await github<{ sha: string }>(token, 'POST', `/repos/${repo}/git/trees`, { base_tree: head.tree.sha, tree });
      const commit = await github<{ sha: string }>(token, 'POST', `/repos/${repo}/git/commits`, {
        message: `${describeChange(change)}\n\nVia the website Projects page by ${actor}${message ? `\n\n${message}` : ''}`,
        tree: newTree.sha,
        parents: [headSha],
      });
      await github(token, 'PATCH', `/repos/${repo}/git/refs/heads/${branch}`, { sha: commit.sha, force: false });
      return { sha: commit.sha, url: `https://github.com/${repo}/commit/${commit.sha}`, manifest, newPaths: sitePaths };
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 0;
      if (!retried && (status === 409 || status === 422)) return attempt(true);
      throw err;
    }
  };
  return attempt(false);
}
