# Brand.Studio — Phase-wise build prompts

Copy each phase into your AI builder in order. Each phase is self-contained and assumes the previous phases are done. The live repo is the reference implementation of every phase.

> **Global rules (include with every phase)**
> - Domain: **Brand.Studio** (brand.studio). Static site, Jekyll layouts only, vanilla HTML/CSS/JS, no build step, deployable on GitHub Pages free plan from `main` branch root.
> - Google AdSense on every page `<head>`: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>` plus `ads.txt` → `google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`.
> - Top bar on every page: "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership" → `https://web.works/contact`.
> - One inbox for every form and mailto, **never written in the HTML or repo in readable form**: store it as an XOR-encoded, reversed char-code array in JS, decode at submit time, and post via FormSubmit AJAX. Mailto links use `data-mail` and are built on click.
> - Avoid the trademark "BrandStudio": use "Brand.Studio" as a descriptive publication name and publish a trademark & copyright disclosure stating no affiliation with any "BrandStudio"/"Brand Studio" company.
> - AdSense-safe: original content only, no fake reviews or invented statistics, clear navigation, privacy/cookies/terms/disclaimer/about/contact pages, labelled ads, no ads near buttons that invite accidental clicks.

---

## Phase 1 — Strategy & information architecture
Build nothing yet. Produce:
1. Positioning: "The free, private brand-building studio for founders — name it, design it, document it, then get matched with vetted pros."
2. Revenue model ranked by value: agency lead marketplace (Get Matched + partner plans), AdSense on commercial guides/tools, sponsorships (tool/guide/newsletter/contest), donations, site sale CTA.
3. Sitemap: Home, Studio, 9 tools under `/tools/`, Guides hub + 10 guides under `/guides/`, Resources, Videos, News, Glossary, Templates, Get Matched, Partners, Contest, Careers, Support, Advertise, About, Contact, Editorial policy, Privacy, Terms, Cookies, Disclaimer, Trademark, 404.
4. Keyword map: business name generator, brand colour palette generator, font pairing, logo maker, slogan generator, brand archetype quiz, brand audit, brand guidelines template, trademark search, how to build a brand, how to name a business, logo design cost, how to trademark a name, colour psychology, when to rebrand, brand strategy template, how to choose a branding agency.

## Phase 2 — Design system & global layout
Create `_config.yml`, `_layouts/default.html`, `assets/css/style.css`, `assets/js/main.js`.
- Look: warm paper background (#F4F0E8), ink (#15130F), signal orange accent (#FF4A1C), cobalt links; Fraunces (display serif), Manrope (UI), JetBrains Mono (labels). Light/dark toggle saved to localStorage.
- Layout: top bar (global rule), sticky glass header with Tools mega-dropdown and "Get matched" CTA, mobile burger menu, global orange CTA strip, 5-column footer with newsletter form and trademark notice, cookie notice (Essential → non-personalised ads), exit-intent lead modal (max once/7 days, never after a lead).
- SEO head: title/description from front matter, canonical, Open Graph + Twitter image (`/assets/img/og.png`), Organization + WebSite JSON-LD, optional page `schema`, Article JSON-LD when `article: true`.
- main.js: hidden-inbox FormSubmit sender, per-form auto-responses (`data-auto` keys), multi-step forms with progress and auto-advance, YouTube click-to-load facades (youtube-nocookie), reveal-on-scroll, filters/search, monthly contest countdown + rotating brief, date-seeded "prompt of the day" and "palette of the day", news loader.

## Phase 3 — The nine browser tools (`assets/js/tools.js`)
All tools run locally and save into one `bs-kit` object in localStorage:
1. **Name generator** — 8 styles (compound, blend, suffix, prefix, metaphor, invented, respelled, two-word), vibe, TLD, max length, memorability score, shortlist, copy, domain search link, trademark-check link, "use as name".
2. **Palette builder** — 6 harmony modes, base colour, locks, spacebar shuffle, editable swatches, WCAG AA contrast table, CSS variables, shareable hash URL.
3. **Font pairing** — 24 Google Font pairs, mood filter, live custom copy, "use pair".
4. **Wordmark maker** — font, weight, case, spacing, size, 10 symbols, row/stacked layout, colours, transparent bg, favicon preview, SVG + 3× PNG export.
5. **Slogan generator** — 5 tones × 8 templates from name/benefit/audience/verb.
6. **Archetype quiz** — 12 questions → primary + secondary archetype, voice, words, colours; email form sends the full report as an auto-response.
7. **Brand audit** — 8 pillars × 3 questions, live score, per-pillar bars, top-3 fixes with links, "free expert review" lead form carrying the score.
8. **Brand guide builder** — mission, audience, archetype, voice, 5 colours, font pair, do/don’t → printable one-page guide (Save as PDF) + JSON export.
9. **Trademark launcher** — one input → USPTO, CIPO, EUIPO, UKIPO, WIPO, IP Australia, IP India, domains, social handles, web searches; copies the name on click.
Plus **Studio dashboard**: brand board, 8-step progress, quick name, import/export/reset kit.
Every tool page gets 300–600 words of original explanatory content below the tool.

## Phase 4 — Lead generation & monetisation pages
- **Get Matched** (highest-value page): 5-step brief — service → budget band → timeline (auto-advance) → stage/industry/details → contact + consent. URL prefill (`?service=`) jumps to step 2. Price-range table, FAQ, partner CTA. Homepage has a pre-qualifier that posts into it.
- **Partners**: three plans (Directory free + pay-per-intro, Pro $149/mo, Featured $499/mo), application form.
- **Contest**: auto-rotating monthly brief, live countdown, prize tiers, judging criteria, rules, entry form, sponsor CTA.
- **Careers**: open roles, talent-pool form, "hire talent" form for companies.
- **Support**: one-time/monthly tiers, purpose selector, pledge form that triggers a secure payment link (no card fields).
- **Advertise**: sponsorship products, ad standards, media-kit form, link to site/domain sale.
- **Contact**: topic-routed form, hidden-inbox mailto, web.works/contact card.

## Phase 5 — Content for AdSense approval & SEO
- `_layouts/guide.html`: breadcrumbs + BreadcrumbList JSON-LD, byline/updated/read time, auto TOC, reading progress, sticky sidebar tool CTA + ad slot, end-of-article Get Matched band, related guides.
- 10 original guides (900–1,500 words each) on the keyword map, with tables, checklists and internal links to tools; verified facts only (e.g. USPTO $350/class base fee since Jan 18 2025; EUIPO €850/€50/€150; UKIPO £170 + £50).
- Glossary (45 terms with filters), Templates (checklist, positioning, voice chart, creative brief, boilerplate), Resource directory (60+ curated links with filters), Video library (verified YouTube IDs only, with notes).

## Phase 6 — Trust, legal & technical SEO
Privacy (with Google AdSense cookie disclosures and opt-out links), Cookies, Terms (incl. contest & partner terms), Disclaimer, Trademark & copyright disclosure, Editorial policy, About (including "how we make money"), 404. Generate `sitemap.xml` with Liquid from `site.html_pages`, `robots.txt`, `ads.txt`, `site.webmanifest`, favicon SVG, 192/512 PNG icons, 1200×630 OG image, `CNAME` = `brand.studio`.

## Phase 7 — Automation (self-updating)
- `.github/workflows/refresh-news.yml` runs daily (and on demand): `scripts/refresh_news.py` pulls RSS/Atom from design publications, keeps headline/link/source/date only, de-duplicates, writes `data/news.json`, commits if changed.
- `.github/workflows/build-assets.yml` renders the PNG icons and OG image with `scripts/make_images.py`.
- Front end loads news from the repo’s raw file (fresh without a Pages rebuild) with a same-origin fallback.
- Daily prompt and palette are date-seeded; contest brief, month label and countdown roll over automatically; every form sends an instant auto-response to the visitor.

## Phase 8 — QA & launch
1. Build locally; check every internal link, JS syntax and console errors on desktop (1366px) and mobile (390px); no horizontal overflow.
2. Search the built site and repo for the inbox address — it must not appear in readable form anywhere.
3. Confirm AdSense script and the top bar on every page.
4. Push to `main` of the GitHub repo, enable **Settings → Pages → Deploy from a branch → main / (root)**, add the custom domain and enforce HTTPS.
5. DNS: apex `A` records 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 (and `AAAA` 2606:50c0:8000::153 … 8003::153); `www` CNAME → `<owner>.github.io`.
6. Send one test submission from each form to activate FormSubmit for the domain.
7. Submit the sitemap in Google Search Console, then apply/add the site in AdSense.

## Phase 9 — Growth roadmap (next)
- Programmatic pages: "business name ideas for [industry]" (50 industries) and "[colour] brand palettes" — each with a pre-filled tool.
- Partner directory pages by city/service once 20+ partners are approved.
- Monthly contest winners gallery and case studies.
- Weekly newsletter issues archived as pages.
- Optional paid "Brand Kit Pro" export (multi-page guide, social templates) via a payment link.
