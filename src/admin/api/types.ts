/**
 * What the admin API answers with. The dashboard and its mock speak this
 * shape; the Pages Function (functions/_lib/admin.ts) produces it.
 */

import type { HeroSlot, ProjectTypeId, SiteImages } from '@/content/siteImages';

export type EnquiryStatus = 'new' | 'contacted' | 'survey' | 'quoted' | 'won' | 'lost' | 'closed';
export const ENQUIRY_STATUSES: EnquiryStatus[] = ['new', 'contacted', 'survey', 'quoted', 'won', 'lost', 'closed'];

export type EnquiryKind = 'balustrade' | 'heatpump';
export const ENQUIRY_KINDS: EnquiryKind[] = ['balustrade', 'heatpump'];

export interface EnquiryPhoto {
  filename: string;
  key: string;
  bytes: number;
  type: string;
}

export interface Enquiry {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  kind: EnquiryKind;
  source: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  siteAddress: string | null;
  suburb: string | null;
  postcode: string | null;
  /** Every other form field by name: buildingType, protectingFall, style, unitWidth… */
  fields: Record<string, string>;
  message: string | null;
  photo: EnquiryPhoto | null;
  status: EnquiryStatus;
  notes: string | null;
  emailed: boolean;
}

export interface EnquiryEvent {
  id: number;
  at: string;
  actor: string | null;
  kind: 'received' | 'status' | 'note' | string;
  detail: string | null;
}

export interface EnquiryDetail extends Enquiry {
  events: EnquiryEvent[];
}

export interface EnquiriesList {
  enquiries: Enquiry[];
  counts: Partial<Record<EnquiryStatus, number>>;
  kinds: Partial<Record<EnquiryKind, number>>;
}

export interface Me {
  login: string;
  name: string | null;
  avatarUrl: string | null;
  repo: string;
  branch: string;
  siteOrigin: string;
  capabilities: {
    files: 'r2' | 'kv' | null;
    cloudflare: boolean;
    google: 'unconfigured' | 'disconnected' | 'connected';
  };
  version: string;
}

export interface SitePhotosState {
  manifest: SiteImages;
  repo: string;
  branch: string;
  siteOrigin: string;
  /** Whether the signed-in GitHub account may push to the repository. */
  canPublish: boolean;
}

/**
 * One change to the website photos: a gallery project added, updated or
 * deleted, or one of the page pictures replaced or re-described. Photos are
 * paths already on the site, or "new:<n>" for the nth blob uploaded just
 * before. A project being updated or deleted is identified by what it looked
 * like when the editor opened it, so one someone else changed meanwhile is
 * refused.
 */
export type PhotoChange =
  | { kind: 'project'; mode: 'add'; type: ProjectTypeId; title: string; style: string; photos: string[] }
  | { kind: 'project'; mode: 'update'; type: ProjectTypeId; title: string; style: string; photos: string[]; origType: ProjectTypeId; origIndex: number; origJson: string }
  | { kind: 'project'; mode: 'delete'; origType: ProjectTypeId; origIndex: number; origJson: string }
  | { kind: 'slot'; slot: HeroSlot | 'about'; index?: number; alt: string; photo: string | null };

export interface PublishPhotosRequest {
  change: PhotoChange;
  blobs: { sha: string }[];
  message?: string;
}

export interface PublishResult {
  /** Null when the change turned out to change nothing. */
  sha: string | null;
  url: string | null;
  unchanged?: boolean;
  manifest: SiteImages;
  /** The site paths the uploaded photos were given, in upload order. */
  newPaths: string[];
}

export interface TrafficDay {
  date: string;
  requests: number;
  pageViews: number;
  visitors: number;
  threats: number;
  bytes: number;
}

export interface Deployment {
  id: string;
  createdAt: string;
  environment: 'production' | 'preview' | string;
  branch: string | null;
  commit: string | null;
  message: string | null;
  stage: string | null;
  status: string | null;
  url: string;
}

export interface CloudflareSummary {
  configured: { token: boolean; zone: boolean; account: boolean };
  days: TrafficDay[];
  totals: Omit<TrafficDay, 'date'> | null;
  workers: { name: string; requests: number; errors: number }[];
  deployments: Deployment[];
  errors: Record<string, string>;
}

export interface GoogleLocation {
  account: string;
  name: string;
  title: string;
  address: string | null;
  mapsUri: string | null;
  newReviewUri: string | null;
}

export interface GoogleStatus {
  configured: boolean;
  connected: boolean;
  location: GoogleLocation | null;
  redirectUri?: string;
}

export interface GoogleReview {
  id: string;
  name: string;
  photo: string | null;
  rating: number | null;
  comment: string;
  at: string;
  replied: boolean;
}

export interface GoogleSummary {
  configured: boolean;
  connected: boolean;
  location?: GoogleLocation;
  metrics?: {
    days: number;
    totals: { impressions: number; calls: number; websiteClicks: number; directions: number; messages: number };
    daily: { date: string; impressions: number; calls: number; websiteClicks: number; directions: number }[];
  } | null;
  reviews?: { averageRating: number | null; total: number; items: GoogleReview[] } | null;
  errors?: Record<string, string>;
}

export interface AdminApi {
  /** Where the sign-in button sends the browser. */
  loginUrl(returnPath: string): string;
  me(): Promise<Me>;
  logout(): Promise<void>;
  listEnquiries(params?: { status?: EnquiryStatus | null; kind?: EnquiryKind | null; q?: string }): Promise<EnquiriesList>;
  getEnquiry(id: string): Promise<EnquiryDetail>;
  updateEnquiry(id: string, patch: { status?: EnquiryStatus; notes?: string }): Promise<EnquiryDetail>;
  enquiryFileUrl(id: string, filename: string): string;
  sitePhotos(): Promise<SitePhotosState>;
  /** One shrunk JPEG, as base64, becomes a blob in the repository. */
  uploadPhoto(contentBase64: string): Promise<{ sha: string; bytes: number }>;
  publishPhotos(request: PublishPhotosRequest): Promise<PublishResult>;
  cloudflare(days: number): Promise<CloudflareSummary>;
  googleStatus(): Promise<GoogleStatus>;
  googleConnectUrl(): Promise<string>;
  googleSummary(days: number): Promise<GoogleSummary>;
  googleDisconnect(): Promise<void>;
}
