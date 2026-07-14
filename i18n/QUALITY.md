# ALUX Translation Quality Rules

ALUX translations must read like native product and protocol writing, not literal machine translation.

## Voice

- Keep the tone precise, senior, and technically credible.
- Prefer natural phrasing in each target language over English sentence structure.
- Avoid hype, vague futurism, and generic crypto marketing language.
- Preserve the original meaning; do not invent product claims or change technical scope.

## Terms To Preserve

Keep these terms exactly as written unless the surrounding grammar requires spacing:

- ALUX
- TVM
- TSAC
- BlockGit
- Tolang
- OpenClaw
- OCAP
- EVM
- Solidity
- MetaMask
- Hardhat
- `eth_*` JSON-RPC

The following are official ALUX concepts. Translate them consistently into the
target language, retain the English term or abbreviation on first use when that
improves technical clarity, and never dilute them into a generic workflow or VM:

- Long Transaction (长交易)
- Global Logical Virtual Machine (全局逻辑虚拟机, GLVM)

Approved locale forms:

- Simplified Chinese: `长交易`; `全局逻辑虚拟机（GLVM）`; use `重放`, never `回放`, for runtime replay.
- Korean: `장기 트랜잭션`; `전역 논리 가상 머신(GLVM)`.
- Japanese: `長期トランザクション`; `グローバル論理仮想マシン（GLVM）`.
- Arabic: `المعاملات طويلة الأمد`; `الآلة الافتراضية المنطقية العالمية (GLVM)`.

## Forbidden Terms

Do not use rho, Rho, RHO, Rholang, or equivalents. Use process calculus terminology instead.

## Formatting

- Preserve source HTML tags exactly and in the same order. A small set of
  locale-only line-break helpers is approved in `scripts/verify-i18n.mjs`; do
  not add another layout tag without extending and reviewing that allowlist.
- Preserve URLs, file names, code identifiers, variable names, and API names.
- Preserve numbers, dates, and product names unless localization is explicitly required.
- Never translate structural values such as IDs, portrait keys, capability-map
  `featuredClusterIds`, or combination `nodes`.
- Return clean copy without translator notes in the published text.

## Review Standard

Every translated entry must be self-reviewed. If it sounds machine translated, stiff, or unnatural for the target language, rewrite it before approval.
