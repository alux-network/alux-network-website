import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptPath = path.join(rootDir, "script.js");
const roadmapPath = path.join(rootDir, "roadmap.html");
const qualityPath = path.join(rootDir, "i18n", "QUALITY.md");
const sourcePath = path.join(rootDir, "i18n", "source", "site.en.json");
const generatedPath = path.join(rootDir, "i18n", "site.generated.js");
const localeDir = path.join(rootDir, "i18n", "locales");
const pendingDir = path.join(rootDir, "i18n", "pending");

const targetLanguages = {
  zh: "Chinese, polished Simplified Chinese product/protocol copy",
  ko: "Korean, polished native Korean product/protocol copy",
  ja: "Japanese, polished native Japanese product/protocol copy",
  ar: "Arabic, polished native Arabic product/protocol copy"
};

const args = new Set(process.argv.slice(2));
const shouldAi = args.has("--ai");
const shouldApply = args.has("--apply");
const shouldScan = args.has("--scan") || (!shouldAi && !shouldApply);
const now = new Date().toISOString();

const skipKeys = new Set([
  "type", "href", "src", "image", "poster", "video", "variant", "hidden",
  "id", "email", "state", "kind", "tone", "portrait"
]);
const publishableStatuses = new Set(["ai-reviewed", "human-reviewed"]);
const publishGroups = {
  home: ["home.", "homeHeroActions."],
  vs: ["vs."],
  aluxVsOthers: ["aluxVsOthers."],
  runtimeLab: ["parallelConcurrentComposable."],
  glvm: ["glvm."],
  team: ["team."],
  roadmap: ["roadmap.", "roadmapStatic."],
  common: ["ui.", "inlineUiLabels.", "capabilityFlowLabels."]
};

function readArg(name) {
  const flag = `--${name}`;
  const inline = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (inline) return inline.slice(flag.length + 1);

  const index = process.argv.indexOf(flag);
  if (index === -1) return "";
  return process.argv[index + 1] || "";
}

function parseListArg(name, allowed, label) {
  const raw = readArg(name) || readArg(`${name}s`);
  if (!raw) return [...allowed];

  const values = raw.split(",").map((item) => item.trim()).filter(Boolean);
  const invalid = values.filter((value) => !allowed.includes(value));
  if (invalid.length) {
    throw new Error(`Unknown ${label}: ${invalid.join(", ")}. Allowed: ${allowed.join(", ")}`);
  }

  return values;
}

const selectedLanguages = parseListArg("lang", Object.keys(targetLanguages), "language");
const selectedPages = parseListArg("page", Object.keys(publishGroups), "page");
const selectedPrefixes = selectedPages.flatMap((page) => publishGroups[page]);

function isSelectedKey(key) {
  return selectedPrefixes.some((prefix) => key.startsWith(prefix));
}

function hashText(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sortObject(value) {
  return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
}

async function ensureDirs() {
  await fs.mkdir(path.dirname(sourcePath), { recursive: true });
  await fs.mkdir(localeDir, { recursive: true });
  await fs.mkdir(pendingDir, { recursive: true });
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function makeElement(selector = "") {
  return {
    dataset: {},
    style: {},
    hidden: false,
    innerHTML: "",
    textContent: "",
    classList: {
      add() {},
      remove() {},
      toggle() { return false; },
      contains() { return false; }
    },
    setAttribute() {},
    getAttribute() { return null; },
    addEventListener() {},
    removeEventListener() {},
    remove() {},
    contains() { return false; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    selector
  };
}

function createBrowserContext() {
  const pageContent = makeElement("#page-content");
  const body = makeElement("body");
  const documentElement = makeElement("html");
  body.dataset.page = "home";
  pageContent.dataset.static = "false";

  const document = {
    body,
    documentElement,
    title: "",
    querySelector(selector) {
      if (selector === "#page-content") return pageContent;
      return null;
    },
    querySelectorAll() {
      return [];
    },
    createElement(selector) {
      return makeElement(selector);
    },
    addEventListener() {},
    removeEventListener() {}
  };

  const storage = {
    getItem() { return null; },
    setItem() {},
    removeItem() {}
  };

  const window = {
    ALUX_HOME_I18N: undefined,
    matchMedia() {
      return {
        matches: false,
        addEventListener() {},
        removeEventListener() {}
      };
    },
    addEventListener() {},
    removeEventListener() {}
  };

  const context = {
    console,
    document,
    window,
    navigator: { language: "en-US" },
    localStorage: storage,
    sessionStorage: storage,
    setTimeout() {},
    clearTimeout() {},
    IntersectionObserver: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  };

  context.globalThis = context;
  return vm.createContext(context);
}

async function loadEnglishSource() {
  const source = await fs.readFile(scriptPath, "utf8");
  const roadmapHtml = await fs.readFile(roadmapPath, "utf8");
  const exportCode = `${source}\n;globalThis.__ALUX_I18N_EXPORT__ = { pages, forAiAgentsPage, homeHeroActions, ui, inlineUiLabels, capabilityFlowLabels };`;
  const context = createBrowserContext();
  vm.runInContext(exportCode, context, { filename: scriptPath });

  const exported = context.__ALUX_I18N_EXPORT__;
  return {
    home: exported.pages.home.en,
    vs: exported.forAiAgentsPage,
    aluxVsOthers: exported.pages.aluxVsOthers.en,
    parallelConcurrentComposable: exported.pages.parallelConcurrentComposable.en,
    glvm: exported.pages.glvm.en,
    team: exported.pages.team.en,
    roadmap: exported.pages.roadmap.en,
    roadmapStatic: extractStaticPageText(roadmapHtml),
    homeHeroActions: exported.homeHeroActions.en,
    ui: exported.ui.en,
    inlineUiLabels: exported.inlineUiLabels.en,
    capabilityFlowLabels: exported.capabilityFlowLabels.en
  };
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function extractStaticPageText(html) {
  const main = html.match(/<main\b[^>]*id=["']page-content["'][^>]*>([\s\S]*?)<\/main>/i);
  const content = main ? main[1] : html;
  const texts = [];
  const textNodePattern = />([^<>]+)</g;
  let match;

  while ((match = textNodePattern.exec(content))) {
    const text = decodeHtmlEntities(match[1]).replace(/\s+/g, " ").trim();
    if (text) texts.push(text);
  }

  return texts;
}

function isTranslatable(pathParts, value) {
  const key = pathParts[pathParts.length - 1];
  if (skipKeys.has(key)) return false;
  if (pathParts.includes("brandLetters")) return false;
  if (pathParts.includes("featuredClusterIds")) return false;
  if (pathParts.includes("combinations") && pathParts.includes("nodes")) return false;
  if (!value.trim()) return false;
  if (/^https?:\/\//i.test(value)) return false;
  if (/^[./\w-]+\.html(?:#[-\w]+)?$/i.test(value)) return false;
  return true;
}

function flattenStrings(value, pathParts = [], out = {}) {
  if (typeof value === "string") {
    if (isTranslatable(pathParts, value)) {
      out[pathParts.join(".")] = value;
    }
    return out;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => flattenStrings(item, [...pathParts, String(index)], out));
    return out;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => flattenStrings(item, [...pathParts, key], out));
  }

  return out;
}

function buildCatalog(source) {
  const entries = sortObject(flattenStrings(source));
  return {
    generatedAt: now,
    source: "script.js:all active English page and shared UI data; roadmap.html static roadmap text nodes",
    entries: Object.fromEntries(
      Object.entries(entries).map(([key, text]) => [
        key,
        {
          source: text,
          sourceHash: hashText(text)
        }
      ])
    )
  };
}

function mergeLocale(locale, catalog, lang, keyFilter = () => true) {
  const existingEntries = locale.entries || {};
  const nextEntries = {};
  const pending = {};

  Object.entries(catalog.entries).forEach(([key, entry]) => {
    const existing = existingEntries[key] || {};
    const unchanged = existing.sourceHash === entry.sourceHash;
    const status = unchanged ? existing.status || "missing" : existing.text ? "stale" : "missing";

    nextEntries[key] = {
      source: entry.source,
      sourceHash: entry.sourceHash,
      text: existing.text || "",
      status,
      reviewedAt: unchanged ? existing.reviewedAt || null : null,
      reviewerNotes: unchanged ? existing.reviewerNotes || "" : "",
      previousSource: unchanged ? undefined : existing.source || undefined
    };

    if (keyFilter(key) && (!unchanged || !publishableStatuses.has(status) || !nextEntries[key].text)) {
      pending[key] = nextEntries[key];
    }
  });

  return {
    language: lang,
    target: targetLanguages[lang],
    updatedAt: now,
    entries: sortObject(nextEntries),
    pending: sortObject(pending)
  };
}

async function writePendingPrompt(lang, locale, qualityRules) {
  const pending = locale.pending || {};
  const pendingPath = path.join(pendingDir, `${lang}.md`);

  if (!Object.keys(pending).length) {
    await fs.rm(pendingPath, { force: true });
    return;
  }

  const payload = Object.fromEntries(
    Object.entries(pending).map(([key, entry]) => [
      key,
      {
        source: entry.source,
        sourceHash: entry.sourceHash,
        currentStatus: entry.status,
        existingTranslation: entry.text || undefined,
        previousSource: entry.previousSource || undefined
      }
    ])
  );

  const prompt = [
    `# ${lang} pending translations`,
    "",
    `Target: ${locale.target}`,
    "",
    "Translate and self-review the entries below. Return JSON only in this shape:",
    "",
    "```json",
    "{",
    "  \"translations\": [",
    "    {",
    "      \"key\": \"home.hero.title | vs.sections.0.title | glvm.hero.title\",",
    "      \"translation\": \"...\",",
    "      \"status\": \"approved\",",
    "      \"reviewerNotes\": \"why the copy is natural and precise\"",
    "    }",
    "  ]",
    "}",
    "```",
    "",
    "Quality rules:",
    "",
    qualityRules.trim(),
    "",
    "Entries:",
    "",
    "```json",
    JSON.stringify(payload, null, 2),
    "```",
    ""
  ].join("\n");

  await fs.writeFile(pendingPath, prompt, "utf8");
}

function readOutputText(data) {
  if (typeof data.output_text === "string") return data.output_text;

  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") parts.push(content.text);
    }
  }

  return parts.join("\n");
}

async function callAiTranslator(lang, locale, qualityRules) {
  const pending = locale.pending || {};
  const entries = Object.entries(pending);
  if (!entries.length) return [];

  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_TRANSLATION_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY or AI_TRANSLATION_API_KEY for --ai.");
  }

  const endpoint = process.env.AI_TRANSLATION_ENDPOINT || "https://api.openai.com/v1/responses";
  const model = process.env.OPENAI_MODEL || process.env.AI_TRANSLATION_MODEL || "gpt-4.1";
  const payload = Object.fromEntries(
    entries.map(([key, entry]) => [
      key,
      {
        source: entry.source,
        sourceHash: entry.sourceHash,
        existingTranslation: entry.text || undefined,
        previousSource: entry.previousSource || undefined
      }
    ])
  );

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [
            "You are the senior localization reviewer for ALUX.",
            "Translate with native fluency and technical precision.",
            "If a translation sounds like machine output, rewrite it before approving.",
            "Return JSON only."
          ].join(" ")
        },
        {
          role: "user",
          content: [
            `Target language: ${targetLanguages[lang]}.`,
            "",
            qualityRules,
            "",
            "Translate and self-review these entries.",
            "Return {\"translations\":[{\"key\":\"...\",\"translation\":\"...\",\"status\":\"approved|needs_work\",\"reviewerNotes\":\"...\"}]} only.",
            "",
            JSON.stringify(payload, null, 2)
          ].join("\n")
        }
      ]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI translation request failed (${response.status}): ${body}`);
  }

  const text = readOutputText(await response.json()).trim();
  return JSON.parse(text).translations || [];
}

async function applyAiResults(lang, locale, qualityRules) {
  const results = await callAiTranslator(lang, locale, qualityRules);
  for (const result of results) {
    const entry = locale.entries[result.key];
    if (!entry) continue;

    entry.text = result.translation || "";
    entry.status = result.status === "approved" ? "ai-reviewed" : "needs-work";
    entry.reviewedAt = now;
    entry.reviewerNotes = result.reviewerNotes || "";
  }

  delete locale.pending;
  await writeJson(path.join(localeDir, `${lang}.json`), locale);
  return results.length;
}

async function scanLocales(catalog, qualityRules) {
  const locales = {};

  for (const lang of selectedLanguages) {
    const localePath = path.join(localeDir, `${lang}.json`);
    const existing = await readJson(localePath, {});
    const merged = mergeLocale(existing, catalog, lang, isSelectedKey);
    locales[lang] = merged;
    await writeJson(localePath, {
      language: merged.language,
      target: merged.target,
      updatedAt: merged.updatedAt,
      entries: merged.entries
    });
    await writePendingPrompt(lang, merged, qualityRules);
  }

  return locales;
}

async function buildGeneratedBundle(catalog) {
  const output = {};

  for (const lang of Object.keys(targetLanguages)) {
    const locale = await readJson(path.join(localeDir, `${lang}.json`), { entries: {} });

    Object.values(publishGroups).forEach((prefixes) => {
      const groupKeys = Object.keys(catalog.entries).filter((key) => (
        prefixes.some((prefix) => key.startsWith(prefix))
      ));
      const groupEntries = {};
      let complete = groupKeys.length > 0;

      groupKeys.forEach((key) => {
        const sourceEntry = catalog.entries[key];
        const entry = locale.entries?.[key];
        const current = entry && sourceEntry.sourceHash === entry.sourceHash;
        if (!entry || !current || !publishableStatuses.has(entry.status) || !entry.text) {
          complete = false;
          return;
        }

        groupEntries[key] = entry.text;
      });

      if (complete) {
        output[lang] ||= {};
        Object.assign(output[lang], groupEntries);
      }
    });
  }

  const bundle = {
    generatedAt: now,
    source: catalog.source,
    qualityGate: "Each page is published only when every current entry on that page is ai-reviewed or human-reviewed.",
    entries: sortObject(output)
  };

  await fs.writeFile(generatedPath, `window.ALUX_SITE_I18N = ${JSON.stringify(bundle, null, 2)};\n`, "utf8");
}

async function main() {
  await ensureDirs();
  const qualityRules = await fs.readFile(qualityPath, "utf8");
  const englishSource = await loadEnglishSource();
  const catalog = buildCatalog(englishSource);

  await writeJson(sourcePath, catalog);
  const locales = shouldScan || shouldAi ? await scanLocales(catalog, qualityRules) : {};

  if (shouldAi) {
    for (const lang of selectedLanguages) {
      const count = await applyAiResults(lang, locales[lang], qualityRules);
      console.log(`${lang}: AI reviewed ${count} entries`);
    }
  }

  if (shouldApply) {
    await buildGeneratedBundle(catalog);
    console.log(`Wrote ${path.relative(rootDir, generatedPath)}`);
  } else if (shouldScan) {
    console.log("Scanned site source and wrote incremental pending translation prompts.");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
