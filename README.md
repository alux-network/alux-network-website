# ALUX Network Website

This repository contains the source code and production assets for the official ALUX Network website.

**Website:** [alux.network](https://alux.network)

## About the Website

We maintain this repository as the source of truth for the ALUX Network website. The website presents our technology, roadmap, team, and ongoing development.

It is built as a multilingual static website using HTML, CSS, and JavaScript. English uses unprefixed URLs. Eleven other languages use directories: Simplified Chinese (`/zh`), Traditional Chinese (`/zh-hant`), Japanese (`/ja`), Korean (`/ko`), Vietnamese (`/vi`), German (`/de`), Spanish (`/es`), Russian (`/ru`), Ukrainian (`/uk`), Arabic (`/ar`), and French (`/fr`). The homepage entry matches browser language preferences unless the visitor has saved a manual choice. Chinese script and region preferences distinguish Simplified from Traditional Chinese. Direct language URLs retain their own language. `scripts/locale-config.json` is the shared language registry for routing, menus, generation, and checks.

The language picker opens a complete grid: two columns normally and three on short landscape screens, with no internal scrolling. Options use a fixed order: English, Simplified Chinese, Traditional Chinese, Korean, Japanese, Spanish, Arabic, German, French, Ukrainian, Russian, Vietnamese. This is a website priority informed by adoption and ecosystem relevance, not a global language league table. The current language is highlighted without moving it; labels retain their native text direction. Keyboard arrows follow the grid, Home/End jump to its ends, and Escape or leaving the picker closes it.

Sources informing this priority include the [2026 adoption index](https://www.chainalysis.com/blog/2026-global-crypto-adoption-index/), [MENA ecosystem report](https://www.chainalysis.com/blog/middle-east-north-africa-crypto-adoption-2026/) and [Adan/Ipsos French adoption survey](https://www.adan.eu/publications/articles/barometre-2026-l-adoption-des-crypto-actifs-en-france-et-en-europe). Revisit the order when language-specific website traffic becomes available.

## Repository Structure

- `index.html` — Official homepage
- `*.html` — Website pages and compatibility routes
- `zh/`, `zh-hant/`, `ja/`, `ko/`, `vi/`, `de/`, `es/`, `ru/`, `uk/`, `ar/`, `fr/` — Generated localized pages
- `assets/` — Images, videos, icons, and visual assets
- `i18n/` — Localization sources and generated language bundles
- `blender/` — 3D source scenes and production scripts
- `scripts/` — Localization and website validation tools

## Development

Preview through Vercel or an HTTP static server supporting directory index pages and clean URLs. `vercel.json` removes `.html` from public URLs and redirects existing `.html` links to their clean equivalents.

All 84 language pages include their own navigation and initial content in HTML. The runtime enables interactions without replacing the page with another language. After changing content or renderers in `script.js`, refresh generated HTML with `npm run pages:render`. The checks below reject stale generated content and invalid language routes.

Edit roadmap milestones in `scripts/templates/roadmap.html`, preserving the reviewed localization workflow. This source template keeps stable text-node translation keys; the generated roadmap HTML is not the editing source. The generator sorts years and quarters numerically, newest first (Q4 to Q1 within each year), including future additions. The Newest/Oldest controls reverse both years and quarters without changing milestone content. Run localization synchronization and review any changed entries before generating pages.

Before publishing changes, run:

```bash
npm run check
```

This verifies JavaScript syntax, localization integrity, website pages, and local asset references.

For rendered language-menu regression checks, run `npm run menu:verify -- --all-pages --webkit --4k`. This optional check uses Playwright and installed Chromium/WebKit browsers; `PLAYWRIGHT_MODULE` and `BROWSER_EXECUTABLE` select existing installations as for share-card rendering. It checks all locales on phone, tablet, desktop and 4K viewports, including touch-menu exclusion, keyboard navigation, label fit, overflow and selection state. Reports go to `../output/language-menu-checks`; add `--screenshots` to save representative views there. `--langs=zh,zh-hant` limits a rerun to changed locales. Browser-engine emulation does not replace physical Android/iOS testing.

## Deployment

Production deployments are managed through Vercel from the `main` branch.

Pull requests and development branches receive independent preview deployments for review before being merged into production.

## Maintenance

`npm run pages:render` also generates a small runtime translation catalog for each non-English page. Keep the reviewed master catalog in `i18n/site.generated.js`; do not edit `i18n/runtime` output by hand. English pages use their built-in English data. Runtime scripts load with `defer` in dependency order.

Fonts are self-hosted with their original Open Font Licenses under `assets/fonts`. Optimized images preserve the original dimensions and RGBA pixels; originals remain in place. `scripts/optimized-media.json` maps approved originals to content-fingerprinted WebP assets. Regenerate the fingerprint and references whenever an optimized asset changes, since these image/font URLs are cached as immutable.

Each of the seven pages has a separate share image in each of the twelve languages under `assets/social/pages`. The static Open Graph and Twitter Card tags are generated from the page's reviewed title and description; unprefixed URLs use English images. After a copy or artwork update, render pages, run `node scripts/render-share-cards.mjs`, then render pages again and run the checks. The optional artwork renderer requires Playwright and an installed browser; `PLAYWRIGHT_MODULE` and `BROWSER_EXECUTABLE` can select existing local installations. `--langs fr` limits rendering to selected languages. `--masters <directory>` selects the output folder for 3840×2016 JPG masters; only the lightweight 1200×630 images are deployed. Bump the share-image version in the generator and validator whenever replacing deployed cards. Platform preview caches may need a refresh after deployment.

This website is maintained by the ALUX Network team.

Website creator, lead developer, and primary maintainer: [@shixi-11](https://github.com/shixi-11).
