// @vitest-environment node
/** The site images manifest: every picture it names must be in public/, and every project well-formed. */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { HERO_SLOTS, PROJECT_TYPES, allProjects, projectAlt, siteImages } from './siteImages';

const onDisk = (src: string) => existsSync(resolve(__dirname, '../../public', src.replace(/^\//, '')));

describe('site-images.json', () => {
  it('names only pictures that exist', () => {
    const missing = new Set<string>();
    for (const h of HERO_SLOTS) if (!onDisk(siteImages[h.id].src)) missing.add(siteImages[h.id].src);
    for (const a of siteImages.about) if (!onDisk(a.src)) missing.add(a.src);
    for (const p of allProjects()) for (const photo of p.project.photos) if (!onDisk(photo)) missing.add(photo);
    expect([...missing]).toEqual([]);
  });

  it('has three About pictures and a title and cover on every project', () => {
    expect(siteImages.about).toHaveLength(3);
    for (const t of PROJECT_TYPES) expect(Array.isArray(siteImages.projects[t.id])).toBe(true);
    const projects = allProjects();
    expect(projects.length).toBeGreaterThan(20);
    for (const p of projects) {
      expect(p.project.title.trim()).not.toBe('');
      expect(p.project.photos[0]).toMatch(/^\/images\/site\//);
      expect(new Set(p.project.photos).size).toBe(p.project.photos.length);
      expect(projectAlt(p.project)).not.toBe('');
    }
  });
});
