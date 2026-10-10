import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = await fs.readFile(path.join(root, "script.js"), "utf8");
const translations = await fs.readFile(path.join(root, "i18n/site.generated.js"), "utf8");
const checkOnly = process.argv.includes("--check");
const pages = ["index.html", "for-ai-agents.html", "glvm.html", "alux-vs-others.html", "runtime-lab.html", "team.html", "roadmap.html"];

// Runs in the head, before the header can paint. The small inline catalog is
// drawn from the same reviewed translations as the main runtime.
function initializeNavigation(catalog, languageNames) {
  let language = "en";
  try {
    language = sessionStorage.getItem("alux-lang") || "en";
  } catch {}
  if (!Object.prototype.hasOwnProperty.call(catalog, language)) language = "en";
  const chrome = catalog[language];
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

  const observer = new MutationObserver(() => {
    const header = document.querySelector(".site-header");
    // The menu toggle is the last control in every header.
    if (!header?.querySelector(".menu-toggle")) return;
    header.querySelectorAll("[data-nav]").forEach((node) => {
      node.textContent = chrome.nav[node.dataset.nav] || node.textContent;
    });
    header.querySelectorAll("[data-lang-label]").forEach((node) => {
      node.textContent = chrome.languageLabel;
    });
    header.querySelectorAll("[data-lang-current]").forEach((node) => {
      node.textContent = languageNames[language];
    });
    header.querySelector(".site-nav")?.setAttribute("aria-label", chrome.primaryNavigationLabel);
    header.querySelector(".menu-toggle")?.setAttribute("aria-label", chrome.menuToggleLabel);
    observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

// The runtime owns the markup. Evaluate it with an inert DOM to capture its
// English output without adding a browser or a second set of templates.
function render(page) {
  const element = () => ({
    dataset: {}, style: {}, innerHTML: "", textContent: "",
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    setAttribute() {}, getAttribute() { return null; }, addEventListener() {},
    querySelector() { return null; }, querySelectorAll() { return []; }
  });
  const main = element();
  const body = element();
  body.dataset.page = page;
  const storage = { getItem() { return null; }, setItem() {}, removeItem() {} };
  const context = vm.createContext({
    console,
    document: {
      body, documentElement: element(),
      querySelector(selector) { return selector === "#page-content" ? main : null; },
      querySelectorAll() { return []; }, createElement: element, addEventListener() {}
    },
    window: {
      location: { protocol: "https:", hash: "" },
      matchMedia() { return { matches: false, addEventListener() {} }; },
      addEventListener() {}
    },
    navigator: { language: "en-US" },
    localStorage: storage, sessionStorage: storage,
    setTimeout() {}, clearTimeout() {},
    IntersectionObserver: class { observe() {} }
  });
  vm.runInContext(translations, context, { timeout: 5000 });
  vm.runInContext(`${source}\n;globalThis.sanitizeText = sanitizeExternalProjectNames; globalThis.languageNames = visibleLanguageNames; globalThis.chrome = ui;`, context, { timeout: 5000 });
  // Mirror the runtime's English text-node cleanup, leaving attributes intact.
  const markup = main.innerHTML.replace(/(^|>)([^<]+)(?=<|$)/g,
    (_, boundary, text) => boundary + context.sanitizeText(text, "en"))
    .replace(/[\t ]+$/gm, "");
  const catalog = Object.fromEntries(Object.entries(context.chrome).map(([language, chrome]) => [language, {
    nav: chrome.nav,
    languageLabel: chrome.languageLabel,
    primaryNavigationLabel: chrome.primaryNavigationLabel,
    menuToggleLabel: chrome.menuToggleLabel
  }]));
  const json = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
  const bootstrap = `<script data-initial-navigation>\n(${initializeNavigation.toString()})(${json(catalog)},${json(context.languageNames)});\n</script>\n`;
  return { markup, languageName: context.languageNames.en, bootstrap };
}

const stale = [];
for (const file of pages) {
  const filename = path.join(root, file);
  const html = await fs.readFile(filename, "utf8");
  const page = html.match(/<body\b[^>]*data-page="([^"]+)"/)?.[1];
  if (!page) throw new Error(`${file}: missing page identity`);
  const { markup, languageName, bootstrap } = render(page);
  if (file !== "roadmap.html" && !/<h[1-6]\b/.test(markup)) throw new Error(`${file}: renderer returned no heading`);
  const mainPattern = /<main\b[^>]*id="page-content"[^>]*>[\s\S]*?<\/main>/;
  if (!mainPattern.test(html)) throw new Error(`${file}: missing main content`);
  let expected = file === "roadmap.html" ? html : html.replace(mainPattern, () => `<main id="page-content" data-prerendered="en">${markup}</main>`);
  expected = expected.replace(/(data-lang-current>)[^<]*/g, (_, prefix) => prefix + languageName)
    .replace(/<script data-initial-navigation>[\s\S]*?<\/script>\n?/, "")
    .replace("</head>", () => bootstrap + "</head>");
  if (html !== expected) {
    if (checkOnly) stale.push(file);
    else await fs.writeFile(filename, expected, "utf8");
  }
}

if (stale.length) {
  throw new Error(`Stale initial page content: ${stale.join(", ")}. Run npm run pages:render.`);
}
console.log(`${checkOnly ? "Verified" : "Rendered"} initial navigation for ${pages.length} pages and English content for 6 pages.`);
