/**
 * Reading an enquiry: the labels for its fields, the lines the list shows,
 * and the links that act on it (call, email, open the site on a map).
 */

import type { Enquiry } from './api/types';

/** The extra form fields, in the order they read best, with their labels. */
export const FIELD_LABELS: Record<string, string> = {
  companyName: 'Company',
  buildingType: 'Building type',
  location: 'Location',
  protectingFall: 'Protecting a fall',
  balustradeHeight: 'Balustrade height',
  totalLinealMetres: 'Lineal metres',
  requiredDate: 'Needed by',
  style: 'Cover style',
  colour: 'Powdercoat colour',
  requirement: 'Requirement',
  quantity: 'Quantity',
  unitWidth: 'Unit width',
  unitDepth: 'Unit depth',
  unitHeight: 'Unit height',
  knownSize: 'Cover size',
};

/** Fields shown elsewhere on the card, not in the field list. */
const SHOWN_ELSEWHERE = new Set(['companyName', 'siteAddress', 'siteSuburb', 'sitePostcode', 'otherNotes']);

export function fieldRows(e: Enquiry): [string, string][] {
  const rows: [string, string][] = [];
  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    if (SHOWN_ELSEWHERE.has(key) || !e.fields[key]) continue;
    let value = e.fields[key];
    if (/^unit(Width|Depth|Height)$/.test(key) && /^\d+(\.\d+)?$/.test(value)) value = `${value} mm`;
    rows.push([label, value]);
  }
  for (const [key, value] of Object.entries(e.fields)) if (!(key in FIELD_LABELS) && !SHOWN_ELSEWHERE.has(key) && value) rows.push([key, value]);
  return rows;
}

/** The customer's own notes, from whichever field the form used. */
export function customerNotes(e: Enquiry): string {
  return e.fields.otherNotes || '';
}

/** "12 Example Street, Avondale 1026" */
export function siteLine(e: Enquiry): string {
  const town = [e.suburb, e.postcode].filter(Boolean).join(' ');
  return [e.siteAddress, town].filter(Boolean).join(', ');
}

export function mapsUrl(e: Enquiry): string | null {
  const line = siteLine(e);
  if (!line) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${line}, Auckland, New Zealand`)}`;
}

/** The one-line summary under the name in the list. */
export function headline(e: Enquiry): string {
  if (e.kind === 'heatpump') {
    const parts = [e.fields.style && e.fields.style !== 'Not sure' ? `${e.fields.style} cover` : 'Heat pump cover'];
    if (e.fields.quantity && e.fields.quantity !== '1') parts.push(`× ${e.fields.quantity}`);
    if (e.fields.knownSize) parts.push(e.fields.knownSize);
    return parts.join(' ');
  }
  const parts: string[] = [];
  if (e.fields.buildingType) parts.push(e.fields.buildingType);
  if (e.fields.location) parts.push(e.fields.location.toLowerCase());
  if (e.fields.totalLinealMetres) parts.push(e.fields.totalLinealMetres.replace(/\s*m$/i, '') + ' m');
  if (e.fields.balustradeHeight) parts.push(`${e.fields.balustradeHeight} high`);
  return parts.join(' · ') || 'Balustrade enquiry';
}

/** True when the customer said the balustrade stops a fall: it then has to meet the Building Code (F4). */
export function protectsFall(e: Enquiry): boolean {
  return /^yes/i.test(e.fields.protectingFall || '');
}

export function mailto(e: Enquiry): string {
  if (!e.email) return '#';
  const subject = e.kind === 'heatpump' ? `Your heat pump cover enquiry ${e.id}` : `Your balustrade quote ${e.id}`;
  return `mailto:${e.email}?subject=${encodeURIComponent(subject)}`;
}

export function tel(e: Enquiry): string {
  return e.phone ? `tel:${e.phone.replace(/[^\d+]/g, '')}` : '#';
}

/** A short word for where it came from. */
export function sourceName(source: string | null): string {
  switch (source) {
    case 'quote-form':
      return 'home page form';
    case 'quote-modal':
      return '"Request a quote" button';
    case 'heatpump-form':
      return 'heat pump covers page';
    default:
      return source || 'the website';
  }
}
