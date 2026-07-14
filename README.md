# ALUX Network Website

This repository contains the source code and production assets for the official ALUX Network website.

**Website:** [alux.network](https://alux.network)

## About the Website

We maintain this repository as the source of truth for the ALUX Network website. The website presents our technology, roadmap, team, and ongoing development.

It is built as a multilingual static website using HTML, CSS, and JavaScript. English is the default language for every new visit, with Simplified Chinese, Korean, Japanese, and Arabic available through the language selector.

## Repository Structure

- `index.html` — Official homepage
- `*.html` — Website pages and compatibility routes
- `assets/` — Images, videos, icons, and visual assets
- `i18n/` — Localization sources and generated language bundles
- `blender/` — 3D source scenes and production scripts
- `scripts/` — Localization and website validation tools

## Development

No build step is required for local preview. Open `index.html` directly in a browser.

Before publishing changes, run:

```bash
npm run check
```

This verifies JavaScript syntax, localization integrity, website pages, and local asset references.

## Deployment

Production deployments are managed through Vercel from the `main` branch.

Pull requests and development branches receive independent preview deployments for review before being merged into production.

## Maintenance

This website is maintained by the ALUX Network team.

Website creator, lead developer, and primary maintainer: [@shixi-11](https://github.com/shixi-11).
