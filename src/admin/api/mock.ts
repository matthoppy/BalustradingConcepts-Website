/**
 * A stand-in for the admin API, for working on the dashboard without a
 * server. Switched on with ?mock=1 (remembered for the tab).
 */

import { siteImages, type SiteImages } from '@/content/siteImages';
import { applyPhotoChange, normaliseManifest } from '../photos';
import type { AdminApi, CloudflareSummary, EnquiryDetail, EnquiryEvent, GoogleSummary, SitePhotosState } from './types';

const ME = { login: 'matthoppy', name: 'Matt Hopkinson' };

function enquiry(
  id: string,
  createdAt: string,
  base: Omit<EnquiryDetail, 'id' | 'createdAt' | 'updatedAt' | 'events' | 'emailed' | 'notes' | 'status'> & { status?: EnquiryDetail['status']; notes?: string },
  events: EnquiryEvent[] = []
): EnquiryDetail {
  return {
    id,
    createdAt,
    updatedAt: null,
    emailed: true,
    notes: base.notes || '',
    ...base,
    status: base.status || 'new',
    events: [{ id: 1, at: createdAt, actor: 'customer', kind: 'received', detail: `Sent from the website (${base.source})` }, ...events],
  };
}

function buildEnquiries(): EnquiryDetail[] {
  const now = Date.now();
  const at = (d: number) => new Date(now - d * 86400000).toISOString();
  return [
    enquiry('BC-20261103-H2JK', at(0.15), {
      kind: 'balustrade',
      source: 'quote-form',
      name: 'Daniel Reeves',
      email: 'daniel.reeves@example.com',
      phone: '021 123 4567',
      company: null,
      siteAddress: '14 Kauri Road',
      suburb: 'Titirangi',
      postcode: '0604',
      fields: {
        siteAddress: '14 Kauri Road',
        siteSuburb: 'Titirangi',
        sitePostcode: '0604',
        balustradeHeight: '1.1m',
        buildingType: 'Residential',
        location: 'Exterior',
        protectingFall: 'Yes, balustrading IS preventing a fall',
        totalLinealMetres: '14m',
        requiredDate: 'February 2027',
        otherNotes: 'New deck off the lounge, about 1.8m above the lawn. Thinking frameless glass so we keep the bush view. Can someone come out to measure?',
      },
      message: 'Company Name: N/A\nName: Daniel Reeves\n…',
      photo: { filename: 'deck.jpg', key: 'enquiries/BC-20261103-H2JK/deck.jpg', bytes: 310000, type: 'image/jpeg' },
    }),
    enquiry('BC-20261102-F8RT', at(1.3), {
      kind: 'heatpump',
      source: 'heatpump-form',
      name: 'Helen Marsh',
      email: 'helen.marsh@example.com',
      phone: '027 555 0199',
      company: null,
      siteAddress: '3 Orchard Close',
      suburb: 'Remuera',
      postcode: '1050',
      fields: {
        style: 'Chatham',
        colour: 'Dulux Lignite',
        requirement: 'Standard size cover',
        quantity: '2',
        unitWidth: '880',
        unitDepth: '320',
        unitHeight: '640',
        knownSize: 'Medium — 1100 × 420 × 700 mm',
        siteAddress: '3 Orchard Close',
        siteSuburb: 'Remuera',
        sitePostcode: '1050',
        otherNotes: 'Two units side by side on the north wall.',
      },
      message: 'HEAT PUMP COVER ENQUIRY\n…',
      photo: null,
      status: 'contacted',
      notes: 'Rang Helen, she will send a photo of the wall.',
    }, [
      { id: 2, at: at(1.0), actor: ME.login, kind: 'status', detail: 'new → contacted' },
      { id: 3, at: at(1.0), actor: ME.login, kind: 'note', detail: 'Rang Helen, she will send a photo of the wall.' },
    ]),
    enquiry('BC-20261030-B6NW', at(4), {
      kind: 'balustrade',
      source: 'quote-modal',
      name: 'Marcus Lee',
      email: 'marcus@leebuild.example.com',
      phone: '09 555 0133',
      company: 'Lee Build Ltd',
      siteAddress: '88 Great North Road',
      suburb: 'Grey Lynn',
      postcode: '1021',
      fields: {
        companyName: 'Lee Build Ltd',
        siteAddress: '88 Great North Road',
        siteSuburb: 'Grey Lynn',
        sitePostcode: '1021',
        balustradeHeight: '1.2m',
        buildingType: 'Commercial',
        location: 'Exterior',
        protectingFall: 'Yes, balustrading IS preventing a fall',
        totalLinealMetres: '46m',
        requiredDate: 'April 2027',
        otherNotes: 'Six-unit townhouse development, balconies on level 1 and 2. Ascot or Finline, powdercoated black. Need PS1.',
      },
      message: '…',
      photo: null,
      status: 'survey',
      notes: 'Site measure booked Thursday 10am with the site manager (Ravi).',
    }, [
      { id: 2, at: at(3.5), actor: ME.login, kind: 'status', detail: 'new → contacted' },
      { id: 3, at: at(2), actor: ME.login, kind: 'status', detail: 'contacted → survey' },
      { id: 4, at: at(2), actor: ME.login, kind: 'note', detail: 'Site measure booked Thursday 10am with the site manager (Ravi).' },
    ]),
    enquiry('BC-20261024-R2VB', at(10), {
      kind: 'balustrade',
      source: 'quote-form',
      name: 'Priya Nair',
      email: 'priya@example.com',
      phone: '022 555 0177',
      company: null,
      siteAddress: '27 Beach Haven Road',
      suburb: 'Birkenhead',
      postcode: '0626',
      fields: {
        siteAddress: '27 Beach Haven Road',
        siteSuburb: 'Birkenhead',
        sitePostcode: '0626',
        buildingType: 'Pool Fence',
        location: 'Exterior',
        protectingFall: 'No, balustrading is NOT preventing a fall',
        totalLinealMetres: '22m',
        requiredDate: 'Before Christmas',
        otherNotes: 'Pool fence with a gate, council inspection booked for December.',
      },
      message: '…',
      photo: null,
      status: 'quoted',
      notes: 'Quoted Mini Posts, $X. Chasing Friday.',
    }, [
      { id: 2, at: at(9), actor: ME.login, kind: 'status', detail: 'new → survey' },
      { id: 3, at: at(6), actor: ME.login, kind: 'status', detail: 'survey → quoted' },
    ]),
    enquiry('BC-20261012-K7PQ', at(22), {
      kind: 'balustrade',
      source: 'quote-form',
      name: 'Sarah Whitfield',
      email: 'sarah.w@example.com',
      phone: '021 555 0101',
      company: null,
      siteAddress: '5 Seaview Terrace',
      suburb: 'Takapuna',
      postcode: '0622',
      fields: {
        siteAddress: '5 Seaview Terrace',
        siteSuburb: 'Takapuna',
        sitePostcode: '0622',
        balustradeHeight: '1m',
        buildingType: 'Residential',
        location: 'Internal',
        protectingFall: 'Yes, balustrading IS preventing a fall',
        totalLinealMetres: '6m',
        otherNotes: 'Stair and landing balustrade, glass with a timber handrail if possible.',
      },
      message: '…',
      photo: null,
      status: 'won',
    }),
  ];
}

function buildCloudflare(days: number): CloudflareSummary {
  const out: CloudflareSummary['days'] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const base = weekend ? 60 : 110;
    const wobble = Math.round(25 * Math.sin(i / 2.3) + 15 * Math.cos(i / 5.1));
    const visitors = Math.max(20, base + wobble);
    out.push({ date: d.toISOString().slice(0, 10), visitors, pageViews: Math.round(visitors * 2.4), requests: Math.round(visitors * 28), threats: i % 5 === 0 ? 1 : 0, bytes: visitors * 2_100_000 });
  }
  const totals = out.reduce(
    (t, d) => ({ requests: t.requests + d.requests, pageViews: t.pageViews + d.pageViews, visitors: t.visitors + d.visitors, threats: t.threats + d.threats, bytes: t.bytes + d.bytes }),
    { requests: 0, pageViews: 0, visitors: 0, threats: 0, bytes: 0 }
  );
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
  return {
    configured: { token: true, zone: true, account: true },
    days: out,
    totals,
    workers: [{ name: 'pages-worker--balustradingconcepts-website-production', requests: 1480, errors: 0 }],
    deployments: [
      { id: 'dep-1', createdAt: hoursAgo(2), environment: 'production', branch: 'main', commit: 'a1b2c3d', message: 'Add gallery project: Titirangi Glass Balustrade (Residential balustrades)', stage: 'deploy', status: 'success', url: 'https://www.balustrading.co.nz' },
      { id: 'dep-2', createdAt: hoursAgo(28), environment: 'production', branch: 'main', commit: '528d81c', message: 'Fix tel: links to use E.164 format (+6498288858) (#23)', stage: 'deploy', status: 'success', url: 'https://www.balustrading.co.nz' },
      { id: 'dep-3', createdAt: hoursAgo(50), environment: 'preview', branch: 'claude/balustrading-admin-dashboard', commit: '3a1f0c2', message: 'Admin dashboard at /admin', stage: 'deploy', status: 'success', url: 'https://claude-balustrading-admin.balustradingconcepts-website.pages.dev' },
    ],
    errors: {},
  };
}

function buildGoogle(days: number): GoogleSummary {
  const now = new Date(Date.now() - 2 * 86400000);
  const daily: NonNullable<GoogleSummary['metrics']>['daily'] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const impressions = Math.max(15, Math.round(70 + 22 * Math.sin(i / 3) + 12 * Math.cos(i / 7)));
    daily.push({ date: d.toISOString().slice(0, 10), impressions, calls: i % 3 === 0 ? 1 : 0, websiteClicks: Math.round(impressions / 10), directions: i % 5 === 0 ? 1 : 0 });
  }
  const totals = daily.reduce(
    (t, d) => ({ impressions: t.impressions + d.impressions, calls: t.calls + d.calls, websiteClicks: t.websiteClicks + d.websiteClicks, directions: t.directions + d.directions, messages: 1 }),
    { impressions: 0, calls: 0, websiteClicks: 0, directions: 0, messages: 0 }
  );
  const ago = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
  return {
    configured: true,
    connected: true,
    location: { account: 'accounts/1', name: 'locations/1', title: 'Balustrading Concepts NZ', address: '661a Rosebank Road, Avondale, Auckland', mapsUri: 'https://maps.google.com/?cid=1', newReviewUri: 'https://g.page/r/example/review' },
    metrics: { days, totals, daily },
    reviews: {
      averageRating: 4.8,
      total: 41,
      items: [
        { id: 'r1', name: 'Amelia R.', photo: null, rating: 5, comment: 'Frameless glass on our deck looks stunning. The team measured, quoted and installed within three weeks.', at: ago(4), replied: true },
        { id: 'r2', name: 'James K.', photo: null, rating: 5, comment: 'Pool fence passed council inspection first time. Tidy work and good communication.', at: ago(12), replied: false },
        { id: 'r3', name: 'Nadia P.', photo: null, rating: 4, comment: 'Great balustrade, slightly later than quoted because of the powdercoater.', at: ago(25), replied: true },
        { id: 'r4', name: 'Oliver T.', photo: null, rating: 5, comment: 'Heat pump cover matches the house colour perfectly. Easy to deal with.', at: ago(44), replied: true },
      ],
    },
    errors: {},
  };
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function createMockApi(): AdminApi {
  const enquiries = buildEnquiries();
  let manifest: SiteImages = normaliseManifest(siteImages);
  let nextEvent = 100;
  let uploads = 0;
  const summary = ({ events, ...rest }: EnquiryDetail) => ({ ...rest });
  return {
    loginUrl: (returnPath) => `${returnPath}?mock=1`,
    me: async () => ({
      login: ME.login,
      name: ME.name,
      avatarUrl: null,
      repo: 'matthoppy/BalustradingConcepts-Website',
      branch: 'main',
      siteOrigin: window.location.origin,
      capabilities: { files: 'kv', cloudflare: true, google: 'connected' },
      version: 'mock',
    }),
    logout: async () => undefined,
    listEnquiries: async ({ status, kind, q } = {}) => {
      await wait(100);
      const needle = (q || '').toLowerCase();
      const rows = enquiries.filter(
        (e) =>
          (!status || e.status === status) &&
          (!kind || e.kind === kind) &&
          (!needle || [e.id, e.name, e.email, e.phone, e.company, e.siteAddress, e.suburb, e.message].some((v) => (v || '').toLowerCase().includes(needle)))
      );
      const counts: Record<string, number> = {};
      const kinds: Record<string, number> = {};
      for (const e of enquiries) {
        counts[e.status] = (counts[e.status] || 0) + 1;
        kinds[e.kind] = (kinds[e.kind] || 0) + 1;
      }
      return { enquiries: rows.map(summary), counts, kinds };
    },
    getEnquiry: async (id) => {
      await wait(100);
      const e = enquiries.find((x) => x.id === id);
      if (!e) throw new Error('No such enquiry.');
      return structuredClone(e);
    },
    updateEnquiry: async (id, patch) => {
      await wait(120);
      const e = enquiries.find((x) => x.id === id);
      if (!e) throw new Error('No such enquiry.');
      const at = new Date().toISOString();
      if (patch.status && patch.status !== e.status) {
        e.events.push({ id: nextEvent++, at, actor: ME.login, kind: 'status', detail: `${e.status} → ${patch.status}` });
        e.status = patch.status;
      }
      if (typeof patch.notes === 'string' && patch.notes !== (e.notes || '')) {
        e.notes = patch.notes;
        e.events.push({ id: nextEvent++, at, actor: ME.login, kind: 'note', detail: patch.notes });
      }
      e.updatedAt = at;
      return structuredClone(e);
    },
    enquiryFileUrl: () => '/images/site/gallery-6.jpg',
    sitePhotos: async (): Promise<SitePhotosState> => {
      await wait(150);
      return { manifest: structuredClone(manifest), repo: 'matthoppy/BalustradingConcepts-Website', branch: 'main', siteOrigin: window.location.origin, canPublish: true };
    },
    uploadPhoto: async (contentBase64) => {
      await wait(250 + Math.min(600, contentBase64.length / 4000));
      return { sha: (++uploads).toString(16).padStart(40, '0'), bytes: Math.floor((contentBase64.length * 3) / 4) };
    },
    publishPhotos: async ({ change, blobs }) => {
      await wait(700);
      const stamp = Date.now().toString(36);
      const newPaths = blobs.map((_, i) => `/images/site/sample-${stamp}-${i + 1}.jpg`);
      const { manifest: next } = applyPhotoChange(manifest, change, newPaths);
      manifest = next;
      return { sha: 'mock' + Math.random().toString(16).slice(2, 9), url: 'https://github.com/matthoppy/BalustradingConcepts-Website/commits/main', manifest: structuredClone(manifest), newPaths };
    },
    cloudflare: async (days) => {
      await wait(200);
      return buildCloudflare(days);
    },
    googleStatus: async () => ({ configured: true, connected: true, location: buildGoogle(7).location!, redirectUri: `${window.location.origin}/admin-api/auth/google/callback` }),
    googleConnectUrl: async () => '#',
    googleSummary: async (days) => {
      await wait(200);
      return buildGoogle(days);
    },
    googleDisconnect: async () => undefined,
  };
}
