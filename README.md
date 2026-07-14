# ALUX Network Website

This project is the static website package for `alux.network`.

The homepage entry is `index.html`, so hosted domains and local previews open the same homepage file.

Current pages:

- `index.html`
- `for-ai-agents.html`
- `alux-vs-others.html`
- `runtime-lab.html`
- `glvm.html`
- `team.html`
- `roadmap.html`

Keep shared assets, localization data, scripts, and styles in this same project folder when publishing the full website.

`parallel-concurrent-composable.html` is a compatibility redirect for the former Runtime Lab URL. Keep it until traffic or backlink data confirms that the old URL is no longer needed.

## Localization workflow

English page and interface copy in `script.js` is the only authored runtime source. Do not add hand-written Chinese, Korean, Japanese, or Arabic page objects back into the script.

1. Edit only necessary English source copy in `script.js`.
2. Run `npm run i18n:scan` to refresh `i18n/source/site.en.json` and mark only changed entries stale.
3. Review every changed entry in `i18n/locales/{zh,ko,ja,ar}.json`; publishable entries must be `human-reviewed` or `ai-reviewed`.
4. Run `npm run i18n:apply` to rebuild `i18n/site.generated.js`.
5. Run `npm run i18n:verify` and `npm run check` before publishing.

The official concepts **Long Transaction** and **Global Logical Virtual Machine (GLVM)** must follow `i18n/QUALITY.md`. Internal IDs, asset paths, portrait keys, and capability-map combination keys are structural data and must never be translated.

## Verification

The release gate covers all seven active pages in English, Simplified Chinese, Korean, Japanese, and Arabic at phone, tablet, laptop, and desktop widths. It checks horizontal overflow, overlap, first-viewport content, touch targets, local resource failures, RTL layout, translation freshness, HTML-tag preservation, and generated-bundle parity.

Disposable audit reports, screenshots, backups, and archived design masters belong in the sibling `F:\shixi\ALUX\output` directory rather than this website source tree.

## Team LEGO avatars

The Team page portraits are LEGO-style minifigs generated inline by `renderTeamPortrait()` in `script.js`, colored via per-member CSS variables in `styles.css` (`--lego-skin`, `--lego-torso`, `--lego-laptop`, ...).

- Design spec + guide for adding new members: `assets/team/README.md`
- Finalized static SVG exports (for use outside the site): `assets/team/*.svg`
- After editing `script.js`/`styles.css`, bump the `?v=` query in the HTML pages so browsers pick up changes.
