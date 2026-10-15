# ALUX Network Website

This repository contains the source code and production assets for the official ALUX Network website.

**Website:** [alux.network](https://alux.network)

## About the Website

We maintain this repository as the source of truth for the ALUX Network website. The website presents our technology, roadmap, team, and ongoing development.

It is built as a multilingual static website using HTML, CSS, and JavaScript. English uses unprefixed URLs, with Simplified Chinese (`/zh`), Korean (`/ko`), Japanese (`/ja`), and Arabic (`/ar`) using language directories. The homepage entry matches browser language preferences unless the visitor has saved a manual choice. Direct language URLs retain their own language.

## Repository Structure

- `index.html` — Official homepage
- `*.html` — Website pages and compatibility routes
- `zh/`, `ko/`, `ja/`, `ar/` — Generated localized pages
- `assets/` — Images, videos, icons, and visual assets
- `i18n/` — Localization sources and generated language bundles
- `blender/` — 3D source scenes and production scripts
- `scripts/` — Localization and website validation tools

## Development

Preview through Vercel or an HTTP static server supporting directory index pages and clean URLs. `vercel.json` removes `.html` from public URLs and redirects existing `.html` links to their clean equivalents.

All 35 language pages include their own navigation and initial content in HTML. The runtime enables interactions without replacing the page with another language. After changing content or renderers in `script.js`, refresh generated HTML with `npm run pages:render`. The checks below reject stale generated content and invalid language routes.

Edit roadmap milestones in `scripts/templates/roadmap.html`, preserving the reviewed localization workflow. This source template keeps stable text-node translation keys; the generated roadmap HTML is not the editing source. The generator sorts years and quarters numerically, newest first (Q4 to Q1 within each year), including future additions. The Newest/Oldest controls reverse both years and quarters without changing milestone content. Run localization synchronization and review any changed entries before generating pages.

Before publishing changes, run:

```bash
npm run check
```

This verifies JavaScript syntax, localization integrity, website pages, and local asset references.

## Deployment

Production deployments are managed through Vercel from the `main` branch.

Pull requests and development branches receive independent preview deployments for review before being merged into production.

## Maintenance

`npm run pages:render` also generates a small runtime translation catalog for each non-English page. Keep the reviewed master catalog in `i18n/site.generated.js`; do not edit `i18n/runtime` output by hand. English pages use their built-in English data. Runtime scripts load with `defer` in dependency order.

Fonts are self-hosted with their original Open Font Licenses under `assets/fonts`. Optimized images preserve the original dimensions and RGBA pixels; originals remain in place. `scripts/optimized-media.json` maps approved originals to content-fingerprinted WebP assets. Regenerate the fingerprint and references whenever an optimized asset changes, since these image/font URLs are cached as immutable.

Each of the seven pages has a separate share image in each of the five languages under `assets/social/pages`. The static Open Graph and Twitter Card tags are generated from the page's reviewed title and description; unprefixed URLs use English images. After a copy or artwork update, render pages, run `node scripts/render-share-cards.mjs`, then render pages again and run the checks. The optional artwork renderer requires Playwright and an installed browser; `PLAYWRIGHT_MODULE` and `BROWSER_EXECUTABLE` can select existing local installations. `--masters <directory>` selects the output folder for 3840×2016 JPG masters; only the lightweight 1200×630 images are deployed. Bump the share-image version in the generator and validator whenever replacing deployed cards. Platform preview caches may need a refresh after deployment.

This website is maintained by the ALUX Network team.

Website creator, lead developer, and primary maintainer: [@shixi-11](https://github.com/shixi-11).
