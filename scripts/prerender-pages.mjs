import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = await fs.readFile(path.join(root, "script.js"), "utf8");
const checkOnly = process.argv.includes("--check");
const pages = ["index.html", "for-ai-agents.html", "glvm.html", "alux-vs-others.html", "runtime-lab.html", "team.html"];

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
  vm.runInContext(`${source}\n;globalThis.sanitizeText = sanitizeExternalProjectNames; globalThis.languageName = visibleLanguageNames.en;`, context, { timeout: 5000 });
  // Mirror the runtime's English text-node cleanup, leaving attributes intact.
  const markup = main.innerHTML.replace(/(^|>)([^<]+)(?=<|$)/g,
    (_, boundary, text) => boundary + context.sanitizeText(text, "en"))
    .replace(/[\t ]+$/gm, "");
  return { markup, languageName: context.languageName };
}

const stale = [];
for (const file of pages) {
  const filename = path.join(root, file);
  const html = await fs.readFile(filename, "utf8");
  const page = html.match(/<body\b[^>]*data-page="([^"]+)"/)?.[1];
  if (!page) throw new Error(`${file}: missing page identity`);
  const { markup, languageName } = render(page);
  if (!/<h[1-6]\b/.test(markup)) throw new Error(`${file}: renderer returned no heading`);
  const mainPattern = /<main\b[^>]*id="page-content"[^>]*>[\s\S]*?<\/main>/;
  if (!mainPattern.test(html)) throw new Error(`${file}: missing main content`);
  const expected = html.replace(mainPattern, () => `<main id="page-content" data-prerendered="en">${markup}</main>`)
    .replace(/(data-lang-current>)[^<]*/g, (_, prefix) => prefix + languageName);
  if (html !== expected) {
    if (checkOnly) stale.push(file);
    else await fs.writeFile(filename, expected, "utf8");
  }
}

if (stale.length) {
  throw new Error(`Stale initial page content: ${stale.join(", ")}. Run npm run pages:render.`);
}
console.log(`${checkOnly ? "Verified" : "Rendered"} initial English content for ${pages.length} pages.`);
