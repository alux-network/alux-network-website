# ko pending translations

Target: Korean, polished native Korean product/protocol copy

Translate and self-review the entries below. Return JSON only in this shape:

```json
{
  "translations": [
    {
      "key": "home.hero.title | vs.sections.0.title | glvm.hero.title",
      "translation": "...",
      "status": "approved",
      "reviewerNotes": "why the copy is natural and precise"
    }
  ]
}
```

Quality rules:

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

Entries:

```json
{
  "home.sections.0.architecture.runtime.caption": {
    "source": "TVM abstraction — each TVM is abstracted into the Unified World VM above.",
    "sourceHash": "9c98a8c45b3694e95cf98365ffbe7d02737350f8bb1a5baa456ed87e10b70409",
    "currentStatus": "stale",
    "existingTranslation": "목표 VM 추상화: 각 TVM을 상위 계층의 통합 월드 VM으로 추상화",
    "previousSource": "Target VM abstraction - abstracts each TVM into the Unified World VM above"
  },
  "home.sections.0.architecture.runtime.controls.2": {
    "source": "Capability Management",
    "sourceHash": "a6ba599af7c2c54f9e1718005e885633b5e3734f08898aa32e4a150817f353af",
    "currentStatus": "stale",
    "existingTranslation": "권한 관리",
    "previousSource": "Capability Mgmt"
  },
  "home.sections.0.architecture.runtime.title": {
    "source": "ALUX — Decentralized Concurrent Runtime",
    "sourceHash": "33459e4ee0d0d375937566ab772da79cce4bb4e812a21975bdf4286f94fa2aa7",
    "currentStatus": "stale",
    "existingTranslation": "ALUX - 탈중앙화 동시성 런타임",
    "previousSource": "ALUX - Decentralized Concurrent Runtime"
  },
  "home.sections.0.architecture.world.items.1": {
    "source": "Service/Agent Orchestration",
    "sourceHash": "8da42e04c443c56baf703ca4e863fc9551943a491365babaef1943460689158e",
    "currentStatus": "stale",
    "existingTranslation": "서비스 / 에이전트 오케스트레이션",
    "previousSource": "Service / Agent Orchestration"
  }
}
```
