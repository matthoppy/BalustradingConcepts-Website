/**
 * The pieces behind the Projects pages that are not screens: the chips that
 * build a name, shrinking a photo before it goes up, previews of photos that
 * are committed but not yet deployed, and the same change-applying logic the
 * API runs, so the sample-data mode behaves like the real thing.
 */

import { PROJECT_TYPES, type ProjectTypeId, type SiteImage, type SiteImages, type SiteProject } from '@/content/siteImages';
import type { PhotoChange } from './api/types';

/** Longest side of an uploaded photo, in pixels; and the JPEG quality. */
export const MAX_EDGE_PX = 2000;
export const JPEG_QUALITY = 0.82;
export const MAX_TITLE_LENGTH = 80;
export const MAX_STYLE_LENGTH = 80;

/** What a project of each type usually is: tap one and the name writes itself. */
export const WHAT: Record<ProjectTypeId, string[]> = {
  balustrade: ['Glass Balustrade', 'Aluminium Balustrade', 'Framed Glass Balustrade', 'Deck Balustrade', 'Stairway Handrail', 'Privacy Screen', 'Juliet Balcony'],
  commercial: ['Commercial Balustrade', 'Commercial Handrail', 'Commercial Fencing', 'Apartments', 'School Project', 'Retirement Village', 'Accessibility Walkway'],
  poolfence: ['Pool Fence', 'Frameless Pool Fence', 'Pool Fence with Deck', 'Pool Gate'],
};

/** The systems installed, as the gallery labels them. The style can always be typed instead. */
export const STYLES: Record<ProjectTypeId, string[]> = {
  balustrade: ['Finline', 'Spectra', 'Panorama', 'Standoff', 'Mini Post', 'Siena', 'Avon', 'Windsor', 'Safa Slat', 'Etchlite', 'Ascot'],
  commercial: ['Ascot with Handrail', 'Finline', 'Windsor', 'Hampton', 'Extreme Ascot', 'Standoff', 'Assure Panels', 'Handrail'],
  poolfence: ['Mini Posts', 'Finline', 'Ascot', 'Spectra', 'Panorama', 'Standoff'],
};

/** Where jobs tend to be. The name can always be typed instead. */
export const AREAS = ['Parnell', 'Remuera', 'Grey Lynn', 'Ponsonby', 'Titirangi', 'Avondale', 'Birkenhead', 'Takapuna', 'Millwater', 'Albany', 'Howick', 'Pukekohe', 'Helensville', 'Glen Eden', 'Auckland'];

/** "Titirangi Glass Balustrade" */
export function composeTitle(where: string | null, what: string | null): string {
  if (where && what) return `${where} ${what}`;
  if (what) return what;
  if (where) return `${where} Project`;
  return '';
}

export function photoWord(n: number): string {
  return n === 1 ? '1 photo' : `${n} photos`;
}

export function typeName(id: string | null): string {
  return PROJECT_TYPES.find((t) => t.id === id)?.name || '';
}

// ── Previews ─────────────────────────────────────────────────────────────────

/**
 * A photo published a moment ago is in the repository but not yet on the
 * site, so until the deployment finishes its path would show nothing. The
 * preview made when it was picked stands in, for the rest of this visit.
 */
const localPreviews = new Map<string, string>();

export function rememberPreview(path: string, url: string) {
  localPreviews.set(path, url);
}

export function photoSrc(path: string, siteOrigin: string): string {
  return localPreviews.get(path) || `${siteOrigin}${path}`;
}

// ── Shrinking ────────────────────────────────────────────────────────────────

export interface ShrunkPhoto {
  blob: Blob;
  /** An object URL of the shrunk photo, for showing it. */
  url: string;
  bytes: number;
}

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      // Phones store the rotation in EXIF; this bakes it in.
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // fall through to the <img> route below
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That photo could not be read. Try a JPEG or PNG.'));
    };
    img.src = url;
  });
}

/** The photo at most MAX_EDGE_PX on its longest side, as a JPEG on a white background. */
export async function shrink(file: File): Promise<ShrunkPhoto> {
  const img = await decode(file);
  const scale = Math.min(1, MAX_EDGE_PX / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('That photo could not be read.');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  if ('close' in img) img.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('That photo could not be saved as a JPEG.'))), 'image/jpeg', JPEG_QUALITY);
  });
  return { blob, url: URL.createObjectURL(blob), bytes: blob.size };
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(new Error('That photo could not be read.'));
    reader.readAsDataURL(blob);
  });
}

export function isImageFile(file: File): boolean {
  return /^image\//.test(file.type) || /\.(jpe?g|png|heic|heif|webp)$/i.test(file.name);
}

// ── Applying a change (the API's logic, for the sample-data mode) ────────────

export function normaliseManifest(raw: SiteImages): SiteImages {
  const out: SiteImages = { ...raw, version: 1, projects: {} };
  for (const t of PROJECT_TYPES) {
    out.projects[t.id] = (raw.projects?.[t.id] || []).map((j) => {
      const p: SiteProject = { title: j.title, style: j.style || '', photos: [...j.photos] };
      if (j.alt) p.alt = j.alt;
      return p;
    });
  }
  out.about = raw.about.map((a) => ({ ...a }));
  out.hero = { ...raw.hero };
  out.poolHero = { ...raw.poolHero };
  out.heatPumpHero = { ...raw.heatPumpHero };
  return out;
}

function conflict(message: string): Error & { conflict: true } {
  return Object.assign(new Error(message), { conflict: true as const });
}

/** As the API: the change on a copy of the manifest, and the photos nothing uses any more. */
export function applyPhotoChange(current: SiteImages, change: PhotoChange, newPaths: string[] = []): { manifest: SiteImages; removed: string[] } {
  const manifest = normaliseManifest(current);
  const resolve = (p: string) => (/^new:\d+$/.test(p) ? newPaths[Number(p.slice(4))] : p);
  const dropped: string[] = [];
  const unused = () => {
    const still = JSON.stringify(manifest);
    return [...new Set(dropped)].filter((p) => p.startsWith('/images/site/') && !still.includes(`"${p}"`));
  };

  if (change.kind === 'slot') {
    const old: SiteImage | undefined = change.slot === 'about' ? manifest.about[change.index ?? 0] : manifest[change.slot];
    if (!old) throw conflict('That page picture is not on the site any more.');
    const src = change.photo ? resolve(change.photo) : old.src;
    const next = { src, alt: change.alt, v: src === old.src ? old.v : 1 };
    if (change.slot === 'about') manifest.about[change.index ?? 0] = next;
    else manifest[change.slot] = next;
    if (src !== old.src) dropped.push(old.src);
    return { manifest, removed: unused() };
  }

  const finalPhotos = change.mode === 'delete' ? [] : change.photos.map(resolve);
  if (change.mode === 'add') {
    (manifest.projects[change.type] = manifest.projects[change.type] || []).unshift({ title: change.title.trim(), style: change.style.trim(), photos: finalPhotos });
    return { manifest, removed: [] };
  }
  const list: SiteProject[] = manifest.projects[change.origType] || [];
  let idx = -1;
  if (list[change.origIndex] && JSON.stringify(list[change.origIndex]) === change.origJson) idx = change.origIndex;
  else idx = list.findIndex((j) => JSON.stringify(j) === change.origJson);
  if (idx === -1) throw conflict('This project was changed somewhere else while you were editing. Go back to Projects to see the latest version.');
  const [old] = list.splice(idx, 1);
  for (const p of old.photos) if (change.mode === 'delete' || !finalPhotos.includes(p)) dropped.push(p);
  if (change.mode === 'delete') return { manifest, removed: unused() };
  const updated: SiteProject = { title: change.title.trim(), style: change.style.trim(), photos: finalPhotos };
  if (change.type === change.origType) list.splice(idx, 0, updated);
  else (manifest.projects[change.type] = manifest.projects[change.type] || []).unshift(updated);
  return { manifest, removed: unused() };
}
