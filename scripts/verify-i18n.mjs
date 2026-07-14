import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(rootDir, "i18n", "source", "site.en.json");
const localeDir = path.join(rootDir, "i18n", "locales");
const generatedPath = path.join(rootDir, "i18n", "site.generated.js");
const languages = ["zh", "ko", "ja", "ar"];
const publishableStatuses = new Set(["ai-reviewed", "human-reviewed"]);
const preservedTokens = [
  "ALUX", "TVM", "TSAC", "BlockGit", "Tolang", "OpenClaw", "OCAP",
  "EVM", "Solidity", "MetaMask", "Hardhat", "ReplayTrie", "COMM"
];
const officialTermPatterns = {
  zh: {
    longTransaction: /长交易/,
    glvm: /全局逻辑虚拟机/,
    bitExact: /逐比特精确/
  },
  ko: {
    longTransaction: /장기 트랜잭션/,
    glvm: /전역 논리 가상 머신/,
    bitExact: /비트 단위/
  },
  ja: {
    longTransaction: /長期トランザクション/,
    glvm: /グローバル論理仮想マシン/,
    bitExact: /ビット単位/
  },
  ar: {
    longTransaction: /(?:ال)?معامل(?:ة|ات)[^\n]*طويلة الأمد/,
    glvm: /الآلة الافتراضية المنطقية العالمية/,
    bitExact: /البت|بتًا ببت/
  }
};

const localeOnlyMarkup = new Map([
  ["zh:glvm.hero.tagline", ["<br>"]],
  ["zh:parallelConcurrentComposable.close.title", ["<span class=\"no-break\">", "</span>"]],
  ["zh:parallelConcurrentComposable.foundations.text", ["<span class=\"no-break\">", "</span>"]],
  ["zh:parallelConcurrentComposable.foundations.title", ["<span class=\"no-break\">", "</span>"]],
  ["zh:parallelConcurrentComposable.intro.title", ["<br>"]],
  ["zh:vs.sections.0.text", [
    "<span class=\"mobile-title-break\"></span>",
    "<span class=\"mobile-title-break\"></span>"
  ]]
]);

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stripAllowedLocaleMarkup(lang, key, value) {
  let result = value;
  for (const marker of localeOnlyMarkup.get(`${lang}:${key}`) || []) {
    const index = result.indexOf(marker);
    if (index === -1) return { value: result, missingMarker: marker };
    result = `${result.slice(0, index)}${result.slice(index + marker.length)}`;
  }
  return { value: result, missingMarker: "" };
}

function tags(value) {
  return value.match(/<[^>]+>/g) || [];
}

function compareKeySets(expected, actual) {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  return {
    missing: expected.filter((key) => !actualSet.has(key)),
    extra: actual.filter((key) => !expectedSet.has(key))
  };
}

const sourceCatalog = JSON.parse(await fs.readFile(sourcePath, "utf8"));
const sourceEntries = sourceCatalog.entries || {};
const sourceKeys = Object.keys(sourceEntries).sort();
const errors = [];
const summaries = [];
const locales = {};

for (const [key, entry] of Object.entries(sourceEntries)) {
  if (hash(entry.source) !== entry.sourceHash) {
    errors.push(`source hash mismatch: ${key}`);
  }
}

for (const lang of languages) {
  const locale = JSON.parse(await fs.readFile(path.join(localeDir, `${lang}.json`), "utf8"));
  locales[lang] = locale;
  const entries = locale.entries || {};
  const localeKeys = Object.keys(entries).sort();
  const keyDiff = compareKeySets(sourceKeys, localeKeys);
  if (keyDiff.missing.length) errors.push(`${lang}: ${keyDiff.missing.length} missing keys`);
  if (keyDiff.extra.length) errors.push(`${lang}: ${keyDiff.extra.length} obsolete keys`);

  let empty = 0;
  let unreviewed = 0;
  let stale = 0;
  let tagMismatch = 0;
  let tokenLoss = 0;

  for (const key of sourceKeys) {
    const source = sourceEntries[key];
    const entry = entries[key];
    if (!entry) continue;
    if (!String(entry.text || "").trim()) {
      empty += 1;
      errors.push(`${lang}: empty translation: ${key}`);
    }
    if (!publishableStatuses.has(entry.status)) {
      unreviewed += 1;
      errors.push(`${lang}: unpublished status ${entry.status}: ${key}`);
    }
    if (entry.source !== source.source || entry.sourceHash !== source.sourceHash) {
      stale += 1;
      errors.push(`${lang}: stale source metadata: ${key}`);
    }

    const stripped = stripAllowedLocaleMarkup(lang, key, String(entry.text || ""));
    if (stripped.missingMarker || JSON.stringify(tags(source.source)) !== JSON.stringify(tags(stripped.value))) {
      tagMismatch += 1;
      errors.push(`${lang}: HTML tag mismatch: ${key}`);
    }

    for (const token of preservedTokens) {
      if (source.source.includes(token) && !String(entry.text || "").includes(token)) {
        tokenLoss += 1;
        errors.push(`${lang}: missing technical token ${token}: ${key}`);
      }
    }

    const officialPatterns = officialTermPatterns[lang];
    if (/\blong transactions?\b/i.test(source.source) && !officialPatterns.longTransaction.test(entry.text)) {
      errors.push(`${lang}: Long Transaction terminology mismatch: ${key}`);
    }
    if (source.source.includes("Global Logical Virtual Machine") && !officialPatterns.glvm.test(entry.text)) {
      errors.push(`${lang}: GLVM full-name terminology mismatch: ${key}`);
    }
    if (/\bbit-exact\b/i.test(source.source) && !officialPatterns.bitExact.test(entry.text)) {
      errors.push(`${lang}: bit-exact replay terminology mismatch: ${key}`);
    }
  }

  const allText = Object.values(entries).map((entry) => String(entry.text || "")).join("\n");
  if (/\b(?:rho|rholang)\b/i.test(allText)) errors.push(`${lang}: forbidden rho/Rholang terminology`);
  if (lang === "zh") {
    if (/回放/.test(allText)) errors.push("zh: replay must be translated as 重放");
    if (/长期交易/.test(allText)) errors.push("zh: Long Transaction must be 长交易");
    if (/全球逻辑虚拟机/.test(allText)) errors.push("zh: GLVM must be 全局逻辑虚拟机");
    if (/\bSegments?\b|trie-backed|DAG fringes?/i.test(allText)) errors.push("zh: untranslated protocol prose remains");
  }
  if (lang === "ar" && /[\u3400-\u9fff]/u.test(allText)) {
    errors.push("ar: CJK/mojibake characters remain");
  }

  summaries.push({ lang, keys: localeKeys.length, empty, unreviewed, stale, tagMismatch, tokenLoss });
}

const generatedCode = await fs.readFile(generatedPath, "utf8");
const context = vm.createContext({ window: {} });
vm.runInContext(generatedCode, context, { filename: generatedPath });
const generated = context.window.ALUX_SITE_I18N;
if (!generated?.entries) {
  errors.push("generated bundle missing window.ALUX_SITE_I18N.entries");
} else {
  for (const lang of languages) {
    const generatedEntries = generated.entries[lang] || {};
    const keyDiff = compareKeySets(sourceKeys, Object.keys(generatedEntries).sort());
    if (keyDiff.missing.length || keyDiff.extra.length) {
      errors.push(`${lang}: generated bundle coverage mismatch (${keyDiff.missing.length} missing, ${keyDiff.extra.length} extra)`);
    }
    for (const key of sourceKeys) {
      if (generatedEntries[key] !== locales[lang]?.entries?.[key]?.text) {
        errors.push(`${lang}: generated text differs from reviewed catalog: ${key}`);
      }
    }
  }
}

console.log(JSON.stringify({ sourceKeys: sourceKeys.length, locales: summaries }, null, 2));
if (errors.length) {
  console.error(`\nI18N verification failed with ${errors.length} issue(s):`);
  errors.slice(0, 80).forEach((error) => console.error(`- ${error}`));
  if (errors.length > 80) console.error(`- ...and ${errors.length - 80} more`);
  process.exitCode = 1;
} else {
  console.log("\nI18N verification passed.");
}
