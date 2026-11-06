# Brand.Studio

The free, private brand-building studio: name it, design it, document it — then get matched with vetted brand studios.

**Live:** https://brand.studio (GitHub Pages, `main` branch, root)

## What's inside
- **9 browser tools** (`/tools/`): name generator, palette builder + WCAG checker, font pairing, wordmark maker (SVG/PNG), slogan generator, archetype quiz, brand audit, brand guide builder (PDF), trademark search launcher — plus the **Studio** dashboard that ties them together. All run locally; the kit is stored in the visitor's browser.
- **Lead generation:** 5-step Get Matched brief, partner plans & applications, audit expert-review, archetype report, exit-intent checklist, newsletter, talent & hiring forms, advertising inquiries.
- **Monetisation:** Google AdSense (`ca-pub-6620975821265271`), partner plans, sponsorships, monthly contest sponsorship, donations, site/domain sale CTA (top bar → web.works/contact).
- **Content:** 10 in-depth guides, glossary, templates, resource directory, video library, auto-updating design news.
- **Automation:** `.github/workflows/refresh-news.yml` refreshes `data/news.json` daily; prompt/palette of the day and contest briefs rotate automatically; forms send instant auto-responses.

## Structure
```
_config.yml            Jekyll config (GitHub Pages builds it automatically)
_layouts/default.html  Global head (AdSense, SEO), top bar, header, footer, modals
_layouts/guide.html    Article layout (TOC, breadcrumbs, sidebar, CTAs)
assets/css/style.css   Design system
assets/js/main.js      Shared behaviour, forms, automation
assets/js/tools.js     All browser tools
tools/  guides/        Tool and guide pages
data/news.json         Auto-refreshed headlines
scripts/refresh_news.py
```

## Forms
All forms post through FormSubmit to a private inbox. The address is never stored in readable form in this repository or in the rendered HTML. The first submission from the live domain triggers a one-time FormSubmit activation email — confirm it once.

## Deploy
Settings → Pages → Build and deployment → **Deploy from a branch** → `main` / `(root)`. Custom domain: `brand.studio` (see `CNAME`), then enable **Enforce HTTPS**.

See `BUILD-PROMPTS.md` for the phase-wise build prompts and `RESEARCH.md` for the competitive research.

## Legal
Brand.Studio is an independent publication and is not affiliated with any company named "BrandStudio" or "Brand Studio". Third-party names are used for identification only. © 2026 Brand.Studio / Webworks Media.
