# ClearSite Digital — Business Brief (working draft)

An NZ-based SEO agency and website builder for glaziers and related construction trades.

> Status: concept / pre-launch. This folder is a planning + prototype workspace and is
> not part of the Balustrading Concepts production site build.

## 1. The idea in one sentence

Websites and local SEO done-for-you, exclusively for glaziers, balustrading installers,
aluminium joinery, window/door companies and adjacent construction trades in New Zealand.

## 2. Why this niche works

- **You have insider credibility.** You already run/operate in a glazing-adjacent trade
  (Balustrading Concepts) with a live, modern site (Vite + React + Cloudflare Pages +
  Turnstile + Resend). That stack and the lessons learned are directly reusable as the
  agency's productised offering — and the site itself is case study #1.
- **Trade businesses are underserved.** Most glazier/joinery sites in NZ are outdated
  template sites or Facebook-only. Generalist agencies don't understand the trade
  vocabulary (frameless vs semi-frameless, retrofit double glazing, H1 compliance,
  balustrade code requirements) — you do. That shows up in copy and rankings.
- **High job value = SEO pays for itself.** A single balustrade or reglazing job is
  often $3k–$30k+. One extra lead a month can justify a $500+/mo retainer.
- **Search intent is local and commercial.** "glazier auckland", "glass balustrade cost
  nz", "retrofit double glazing wellington" — winnable local terms, clear buyer intent.

## 3. Target customers (beachhead → expansion)

1. **Beachhead:** glaziers, glass balustrading, shower/mirror installers, splashbacks.
2. **Adjacent:** aluminium joinery, window & door installers, retrofit double glazing.
3. **Expansion:** fencing, decking, roofing, painters, small GC builders.

Roughly hundreds of glazing-related firms across NZ; most are 1–15 staff, owner-led,
time-poor, and get work via word of mouth — exactly the profile that buys done-for-you.

## 4. Naming & domain (DNS spot-check 2026-07-21)

| Name | Domain | DNS record? | Notes |
|---|---|---|---|
| **ClearSite Digital** (working pick) | clearsitedigital.co.nz | none found | "Clear site" pun works for glass + websites |
| Glaze Digital | glazedigital.co.nz | none found | Short, trade-obvious |
| GlazeRank | glazerank.co.nz | none found | SEO-flavoured |
| TradeGlaze | tradeglaze.co.nz | none found | Reads more like a glazing firm |
| ClearView Digital | clearviewdigital.co.nz | none found | Safe but generic |

"No DNS record" ≠ available — confirm on the .nz Domain Name Commission register
(dnc.org.nz / any registrar) before committing, and check the NZ Companies Office +
Trade Marks register for the trading name.

## 5. Productised offering

Fixed-scope packages beat hourly for this market. All prices NZD excl. GST, indicative.

### Build (one-off)
- **Launch Site** — $2,500–$3,500: 5-page site (Home, Services, Gallery, About,
  Contact), mobile-first, contact form with spam protection, Google Business Profile
  setup/cleanup, basic on-page SEO, analytics. Delivered in ~2 weeks.
- **Growth Site** — $5,000–$7,500: everything above + service-area pages per suburb/
  city, per-service landing pages, review widget, quote-request funnel, photo gallery
  CMS.

### Retainers (monthly)
- **Rank Local** — $500/mo: GBP posts + review responses, 1 location/service page or
  article per month, citation management, monthly ranking/lead report.
- **Dominate** — $1,200/mo: 3–4 content pieces, link outreach to NZ trade directories
  and suppliers, conversion tweaks, call tracking, quarterly strategy call.
- **Care only** — $75–$120/mo: hosting, updates, small edits (floor for every client).

### Tech stack (reuse what already works)
Vite/React or Astro static sites → Cloudflare Pages (free hosting, fast, NZ-friendly),
Cloudflare Turnstile for forms, Resend for email, Google Business Profile + Search
Console + GA4. Near-zero marginal hosting cost per client protects retainer margin.

## 6. Go-to-market (first 90 days)

1. **Weeks 1–2:** register company + domain, build the agency's own site (prototype in
   `agency/site/`), write the Balustrading Concepts case study with real numbers
   (rankings, leads, form conversion).
2. **Weeks 2–6:** direct outreach — glaziers you already know via the trade, NZ Glass &
   Glazing Association member list, suppliers (Metro Glass, Viridian) who know every
   glazier in town. Offer 2–3 "founding client" builds at reduced rate in exchange for
   testimonials.
3. **Weeks 6–12:** publish "state of glazier websites in {Auckland}" teardown content;
   run a free "website & Google ranking audit" lead magnet; ask every supplier/assoc.
   contact for referrals. Target: 3 builds + 2 retainers by day 90.

## 7. Unit economics sketch

- 10 retainer clients @ avg $600/mo = $72k/yr recurring, before builds.
- Builds at $3k avg, ~1–2/mo once referrals flow = $36k–$72k/yr.
- Costs are mostly your time + ~$0 hosting + tooling (~$100–$200/mo). Solo-operator
  gross margin is very high; the constraint is your hours → productise hard, template
  the build, and keep custom work out of the base packages.

## 8. Risks / open questions

- **Time split** with the existing balustrading business — decide hours/week upfront.
- **Conflict of interest:** will you build sites for balustrading competitors in
  Auckland? Recommend a simple rule: one client per trade per region, sold as
  "exclusivity" (it's also a premium pricing lever).
- **AI-search shift:** local SEO is changing (AI overviews, maps-first). Mitigation:
  sell "be the business Google *and* AI recommends" — structured data, reviews,
  GBP hygiene age well.

## 9. Immediate next steps

- [ ] Confirm domain availability + register (domain ≈ $20–$40/yr)
- [ ] Reserve company name (Companies Office, ~$10 + $118 incorporation) or start as
      sole trader; get an NZBN; talk to accountant re GST (register at $60k turnover)
- [ ] Finalise brand (see `site/index.html` prototype for a starting visual identity)
- [ ] Write the Balustrading Concepts case study
- [ ] List 25 target glaziers + 5 supplier/association contacts for outreach
