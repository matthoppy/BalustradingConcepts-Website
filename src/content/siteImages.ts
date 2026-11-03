/**
 * The site's pictures, as one manifest.
 *
 * Two kinds of picture live here. The page pictures have fixed slots: the
 * hero behind the home page headline (also used on the Balustrades page), the
 * Pool Fencing and Heat Pump Covers heroes, and the three beside the About
 * text. The gallery is a set of projects, each a finished installation with
 * one or more photos, filed under a type of work; the first photo is the
 * cover the grid shows, and the viewer walks through the rest.
 *
 * The admin dashboard changes all of this by committing the files (under
 * public/images/site/) and this manifest to the repository, after which
 * Cloudflare Pages redeploys. Nothing is fetched at runtime, so the site
 * needs no server to show its own pictures.
 *
 * `v` on a page picture is bumped when a slot is replaced at the same path
 * and appended to the URL, because the site caches images. New photos always
 * get a new file name, so they never need it.
 */

import manifest from './site-images.json';

export interface SiteImage {
  src: string;
  alt: string;
  v: number;
}

/** One finished installation in the gallery. The first photo is the cover. */
export interface SiteProject {
  title: string;
  /** The system installed, e.g. "Finline" or "Ascot with Handrail". */
  style: string;
  photos: string[];
  /** Words for search engines and screen readers; derived from the title and style when absent. */
  alt?: string;
}

export type ProjectTypeId = 'balustrade' | 'commercial' | 'poolfence';

/** The parts of the gallery, in the order the dashboard shows them. */
export const PROJECT_TYPES: { id: ProjectTypeId; name: string; short: string }[] = [
  { id: 'balustrade', name: 'Residential balustrades', short: 'Residential' },
  { id: 'commercial', name: 'Commercial projects', short: 'Commercial' },
  { id: 'poolfence', name: 'Pool fencing', short: 'Pool fencing' },
];

/** The fixed page pictures a single picture fills. */
export type HeroSlot = 'hero' | 'poolHero' | 'heatPumpHero';
export const HERO_SLOTS: { id: HeroSlot; name: string; where: string }[] = [
  { id: 'hero', name: 'Home hero', where: 'Behind the headline on the home page and the Balustrades page' },
  { id: 'poolHero', name: 'Pool fencing hero', where: 'At the top of the Pool Fencing page' },
  { id: 'heatPumpHero', name: 'Heat pump hero', where: 'At the top of the Heat Pump Covers page' },
];

export interface SiteImages {
  version: number;
  hero: SiteImage;
  poolHero: SiteImage;
  heatPumpHero: SiteImage;
  about: SiteImage[];
  projects: Partial<Record<ProjectTypeId, SiteProject[]>>;
}

export const siteImages: SiteImages = manifest as SiteImages;

/** The URL to load a page picture from, with its version for cache busting. */
export function imageUrl(image: SiteImage): string {
  return image.v > 1 ? `${image.src}?v=${image.v}` : image.src;
}

export function projectTypeName(id: string): string {
  return PROJECT_TYPES.find((t) => t.id === id)?.name || id;
}

/** What a screen reader says for a project's cover. */
export function projectAlt(project: SiteProject): string {
  if (project.alt) return project.alt;
  return project.style ? `${project.style} ${project.title}` : project.title;
}

export interface PlacedProject {
  type: ProjectTypeId;
  index: number;
  project: SiteProject;
}

/** Every project with at least one photo, type by type in dashboard order. */
export function allProjects(images: SiteImages = siteImages): PlacedProject[] {
  const out: PlacedProject[] = [];
  for (const t of PROJECT_TYPES) {
    (images.projects[t.id] || []).forEach((project, index) => {
      if (project && Array.isArray(project.photos) && project.photos.length) out.push({ type: t.id, index, project });
    });
  }
  return out;
}
