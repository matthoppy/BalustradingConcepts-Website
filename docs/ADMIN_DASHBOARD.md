# Admin dashboard

The dashboard lives at **www.balustrading.co.nz/admin**, behind a GitHub
sign-in. It shows every quote enquiry from the website (the home page form,
the "Request a quote" button and the heat pump cover form) with every field
the customer filled in and the photo they attached, lets you move each one
through contacted → site survey → quoted → won, lets you add and change the
projects in the "Our Projects" gallery and the page pictures from a phone, and
shows Cloudflare traffic and deployments and the Google Business Profile.

Written 4 November 2026. It is the Custom Showers dashboard, done the
Balustrading way; the main differences are at the end.

## How it fits together

| Piece | Where | Deployed how |
|---|---|---|
| The dashboard pages | `src/admin/` in the website build, route `/admin` | With the site, by Cloudflare Pages on every push to `main` |
| Its API | `functions/_lib/admin.ts`, served at `/admin-api/*` by `functions/admin-api/[[path]].ts` | With the site: a Pages Function, nothing to paste |
| The quote forms' handler | `functions/api/submit-contact-form.ts` (now also keeps the enquiry) | With the site |
| The database | Cloudflare D1 `balustrading` (id `27bce962-f358-48f6-8638-32a855e8f29d`), created 3 Nov 2026 in Oceania with the tables from `db/schema.sql` | Already exists; bound as `DB` in `wrangler.toml` |
| Enquiry photos | KV namespace `balustrading-files` (id `99263713aabf47249821b001a611ef7f`) | Already exists; bound as `FILES_KV` in `wrangler.toml`; swap for R2 when R2 is enabled (below) |
| Website photos | `src/content/site-images.json` and `public/images/site/` | Committed to the repo by the dashboard as you; Pages redeploys |

Everything the dashboard needs a server for is a Pages Function in this
repository, so it ships with the site and the bindings come from
`wrangler.toml`. There is no separate worker to paste into the Cloudflare
dashboard. The only things set by hand are the secrets below.

## Set-up, in order

### 1. Merge, and check the bindings took

Merge to `main`. Cloudflare Pages reads `wrangler.toml` on the build and binds
`DB` and `FILES_KV` to the Production deployment. Check: Workers & Pages →
`balustradingconcepts-website` → Settings → Bindings should list both.

If they are not there (older projects can ignore the file), add them by hand
on that page: D1 database, variable name `DB`, database `balustrading`; KV
namespace, variable name `FILES_KV`, namespace `balustrading-files`. Then
Deployments → latest → Retry deployment.

Opening `https://www.balustrading.co.nz/admin-api/` in a browser should show
`balustrading-admin v1 — the dashboard's API`.

From then on every enquiry sent from the website is kept and appears under
Enquiries within seconds. The email still goes as it always has, now with the
enquiry number in the subject and a link to the enquiry; and the customer gets
an acknowledgement. If the database is ever unavailable the email is
unaffected.

### 2. Create the GitHub OAuth app

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
2. Application name `Balustrading Concepts admin`, homepage
   `https://www.balustrading.co.nz/admin`, authorization callback URL
   **`https://www.balustrading.co.nz/admin-api/auth/github/callback`**.
3. Generate a client secret.
4. Pages project → Settings → Variables and Secrets (Production):

| Name | Value |
|---|---|
| `GITHUB_CLIENT_ID` | from the OAuth app |
| `GITHUB_CLIENT_SECRET` | from the OAuth app (secret) |
| `ALLOWED_LOGINS` | GitHub logins allowed in, comma-separated. Defaults to `matthoppy`. |
| `ADMIN_ORIGIN` | optional, defaults to `https://www.balustrading.co.nz` |
| `GITHUB_REPO` | optional, defaults to `matthoppy/BalustradingConcepts-Website` |
| `GITHUB_BRANCH` | optional, defaults to `main` |

Then Retry deployment (variables only apply to new deployments).

Signing in asks GitHub for `read:user` and `repo`. The `repo` scope is what
lets the Projects page commit to the repository as you; the token is kept in
the dashboard's own D1 sessions table, never in the browser. The session is an
HttpOnly cookie, so nothing is stored on the phone either. Sessions last 30
days; Sign out deletes one.

Then open www.balustrading.co.nz/admin and sign in. An account not on the list
is told so and refused. An account that is on the list but cannot push to the
repository can look at everything and is told, on Projects, that it cannot
publish.

### 3. Cloudflare data (Site page)

1. Cloudflare dashboard → My Profile → API Tokens → Create Token → Custom.
   Permissions: **Account · Workers Scripts · Read**, **Account · Cloudflare
   Pages · Read**, **Account · Account Analytics · Read**, **Zone · Analytics ·
   Read** (zone balustrading.co.nz).
2. On the Pages project set:

| Name | Value |
|---|---|
| `CF_API_TOKEN` | the token (secret) |
| `CF_ACCOUNT_ID` | Workers & Pages → overview, right-hand side |
| `CF_ZONE_ID` | the balustrading.co.nz zone overview, right-hand side |
| `CF_PAGES_PROJECT` | optional, defaults to `balustradingconcepts-website` |

### 4. Google Business Profile

This one is the slowest, because Google gates the API.

1. Google Cloud console → a project → APIs & Services → enable **My Business
   Account Management API**, **My Business Business Information API**,
   **Business Profile Performance API** and **Google My Business API**.
2. Google requires a one-off access request for the Business Profile APIs
   (the form linked from the API's overview page); until approved, the
   project's quota is zero and the Google page shows the error Google returns.
3. APIs & Services → Credentials → Create OAuth client ID → Web application.
   Authorised redirect URI:
   `https://www.balustrading.co.nz/admin-api/auth/google/callback`.
   Configure the consent screen with the Google account that manages the
   listing as a test user if the app stays in testing.
4. On the Pages project set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
5. In the dashboard, Google profile → Connect Google, and sign in with the
   account that manages the listing. The refresh token is kept in the
   dashboard's settings table; Disconnect removes it.

The page shows listing views, website clicks, calls and direction requests
for the period (Google lags about two days), and the latest ten reviews with
the average. The first account and location on the Google login are used.

### 5. Projects (website photos)

Nothing to set up beyond the GitHub sign-in. The page works the same way from
a phone:

- The gallery is a list of **projects**, each a finished job with one or more
  photos and the **system** installed (Finline, Ascot, Spectra…), filed under
  a **type of work**: Residential balustrades and Commercial projects (both on
  the Balustrades page) and Pool fencing (on its own page). The home page
  shows all three. The tabs at the top filter by type and carry counts.
- **Add a project**: pick photos (camera or library), tap the type, tap a
  system chip or type one, tap a "Where?" chip and a "What was it?" chip to
  write the name (or type one), then **Publish to website**. The first photo
  is the cover the grid shows; tap another to make it the cover. New projects
  go to the top of their type.
- Tap a project to change its photos, type, system or name (**Publish
  changes**), or **Delete this project**.
- **Page pictures** below the list are the home hero (also used on the
  Balustrades page), the Pool Fencing and Heat Pump Covers heroes, and the
  three pictures beside the About text: replace the picture and its
  description one at a time.

Photos are shrunk in the browser to at most 2000px JPEG, uploaded one by one
(the progress sheet counts them), and committed under `public/images/site/`
together with the manifest `src/content/site-images.json` in one commit, as
you. The site rebuilds and the change is live in a minute or two; until then
the dashboard shows the new photo from its own copy. A photo under
`public/images/site/` that nothing uses any more is removed in the same
commit. If someone else published between you opening a project and
publishing it, the publish is refused with "changed somewhere else" rather
than overwriting their change; go back to Projects and open it again.

The public gallery reads the same manifest, so a project published from the
dashboard is exactly what customers see. The 32 projects and 141 photos that
were hard-coded in `Gallery.tsx` were moved into the manifest unchanged.

## Enquiries

Each enquiry carries everything the form had: contact details, company, the
site address (with a Map button for the survey), building type, location,
whether the balustrade is protecting a fall (flagged, because it then has to
meet Building Code F4), height, lineal metres, when it is needed, the
customer's notes and their photo; or for heat pump covers the style, colour,
quantity, the unit's dimensions and the cover size they picked.

The status follows the CRM's planned job flow: **New → Contacted → Site survey
→ Quoted → Won**, with Lost and Closed. Office notes save when you tap away,
and every status change and note is kept in the enquiry's history with who
made it. The Overview shows what is waiting for a reply and flags anything
not contacted within a day.

The email to admin@balustrading.co.nz now carries the enquiry number in its
subject and a link straight to the enquiry in the dashboard, and the
customer receives an acknowledgement with the office number.

## Switching the file store to R2

R2 is not enabled on the account yet, so enquiry photos go into the KV
namespace. KV is fine for this (values up to 25MB, the form caps photos at
5MB). When R2 is enabled:

1. R2 → Create bucket `balustrading-files`.
2. In `wrangler.toml`, uncomment the `[[r2_buckets]]` block (binding `FILES`).
   The functions prefer `FILES` when both are bound. Old photos stay readable
   from KV until you remove that binding.

## Working on the dashboard without a server

Open `/admin?mock=1` on a local `npm run dev` (or the deployed site). The
dashboard then runs against sample data: five enquiries across the stages,
the real project manifest, traffic, deployments and a connected Google
profile. The badge "Sample data" shows while it is on; `?mock=0` turns it off.

To run the real API locally, `npm run build` then
`npx wrangler pages dev dist` serves the site with its functions and the
bindings from `wrangler.toml` (against local copies of D1 and KV; add
`--remote` for the real ones). Set `ADMIN_ORIGIN=http://localhost:8788` in a
`.dev.vars` file so the sign-in comes back to the local site, and register
that callback URL on a second GitHub OAuth app.

## What is kept, and where

- `enquiries`: one row per enquiry, with the contact and site details, every
  other field as JSON, the plain-text message the email carried, the photo's
  location, status, notes.
- `enquiry_events`: who changed what and when.
- `sessions`: dashboard sign-ins, with the GitHub token for commits.
- `settings`: the Google refresh token and the chosen location.
- Files in the store under `enquiries/<id>/<name>`.

## Checking it works

- `/admin-api/` in a browser → version string.
- `/admin` → sign in with GitHub → Overview.
- Send a test enquiry from the home page form → it appears under Enquiries
  with every field; open it; change its status; write a note.
- Send a heat pump cover enquiry → it appears with the "Heat pump cover" tag.
- Projects → Add a project → two photos, a type, a system, a name → Publish to
  website → the commit appears on GitHub and, a minute later, the Site page
  lists the deployment as success and the home page gallery shows the project.

## Tests and checks

`npm run check` runs everything CI runs: type-check of the site and the
functions, lint of the dashboard and functions, the unit tests (the API's
sign-in, sessions, enquiries and photo publish with faked GitHub and D1; the
quote form handler; the manifest) and the production build.

## How it differs from the Custom Showers dashboard

- **No worker to paste.** The API is a Pages Function in this repository and
  deploys with the site; the bindings live in `wrangler.toml`.
- **Cookie sessions.** Same origin, so the session is an HttpOnly cookie
  rather than a token in the browser; photo URLs need no token.
- **Enquiries instead of jobs and quote forms.** There is no online designer;
  the website's forms are richer, so every field is kept and shown by name,
  with the fall-protection flag and the needed-by date, and heat pump cover
  enquiries sit alongside with their own fields.
- **Projects carry a system.** The gallery shows the style under the name, so
  the editor has a System step with chips for the Unex systems in the gallery.
- **Six page pictures** rather than three: three heroes and three About
  pictures.
