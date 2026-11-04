-- The dashboard's database: Cloudflare D1 "balustrading" (binding DB).
-- Run once from the Cloudflare dashboard → Storage & Databases → D1 → the
-- database → Console, or with: npx wrangler d1 execute balustrading --remote --file db/schema.sql
-- Every statement is safe to run again.

-- One row per website enquiry, from the quote form (home page and the
-- "Request a quote" modal) and the heat pump cover form.
CREATE TABLE IF NOT EXISTS enquiries (
  id           TEXT PRIMARY KEY,            -- BC-YYYYMMDD-XXXX, also in the email subject
  created_at   TEXT NOT NULL,
  updated_at   TEXT,
  kind         TEXT NOT NULL DEFAULT 'balustrade',  -- balustrade | heatpump
  source       TEXT,                        -- quote-form | quote-modal | heatpump-form
  name         TEXT,
  email        TEXT,
  phone        TEXT,
  company      TEXT,
  site_address TEXT,
  suburb       TEXT,
  postcode     TEXT,
  fields_json  TEXT,                        -- every other form field, by name
  message      TEXT,                        -- the plain-text summary the email carries
  photo_json   TEXT,                        -- {filename, key, bytes, type} in the file store
  status       TEXT NOT NULL DEFAULT 'new', -- new | contacted | survey | quoted | won | lost | closed
  notes        TEXT,
  emailed      INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS enquiries_created ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_status ON enquiries (status);

-- Who changed what and when on an enquiry.
CREATE TABLE IF NOT EXISTS enquiry_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  enquiry_id TEXT NOT NULL,
  at         TEXT NOT NULL,
  actor      TEXT,
  kind       TEXT NOT NULL,                 -- received | status | note
  detail     TEXT
);
CREATE INDEX IF NOT EXISTS enquiry_events_enquiry ON enquiry_events (enquiry_id);

-- Dashboard sign-ins. The GitHub token is what lets the Projects page commit
-- photos to the repository as that person; it never reaches the browser.
CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  login      TEXT NOT NULL,
  name       TEXT,
  avatar_url TEXT,
  gh_token   TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

-- The Google refresh token and the chosen Business Profile location.
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TEXT
);
