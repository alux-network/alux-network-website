import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const activePages = [
  "index.html",
  "for-ai-agents.html",
  "alux-vs-others.html",
  "runtime-lab.html",
  "glvm.html",
  "team.html",
  "roadmap.html"
];
const compatibilityPage = "parallel-concurrent-composable.html";
const allPages = [...activePages, compatibilityPage];
const errors = [];
const checkedReferences = new Set();

function cleanLocalUrl(value) {
  const decoded = value.trim().replaceAll("&amp;", "&");
  if (!decoded || /^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(decoded)) return "";
  return decoded.split(/[?#]/, 1)[0];
}

async function ensureLocalReference(owner, value) {
  const clean = cleanLocalUrl(value);
  if (!clean) return;
  const resolved = path.resolve(path.dirname(path.join(rootDir, owner)), clean);
  const rootPrefix = `${rootDir}${path.sep}`;
  if (resolved !== rootDir && !resolved.startsWith(rootPrefix)) {
    errors.push(`${owner}: local reference escapes site root: ${value}`);
    return;
  }
  const referenceKey = `${owner} -> ${path.relative(rootDir, resolved)}`;
  if (checkedReferences.has(referenceKey)) return;
  checkedReferences.add(referenceKey);
  try {
    const stat = await fs.stat(resolved);
    if (!stat.isFile() || stat.size === 0) errors.push(`${owner}: empty or non-file reference: ${value}`);
  } catch {
    errors.push(`${owner}: missing local reference: ${value}`);
  }
}

for (const page of allPages) {
  const html = await fs.readFile(path.join(rootDir, page), "utf8");
  const attributes = html.matchAll(/(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi);
  for (const match of attributes) await ensureLocalReference(page, match[1]);

  if (!html.includes('rel="icon" href="assets/alux-favicon.png?v=20260714-logo4"')) {
    errors.push(`${page}: missing explicit favicon`);
  }

  if (page !== compatibilityPage) {
    for (const required of ["styles.css?v=", "site-frame.css?v=", "i18n/site.generated.js?v=", "script.js?v="]) {
      if (!html.includes(required)) errors.push(`${page}: missing runtime asset ${required}`);
    }
  }
}

const redirectHtml = await fs.readFile(path.join(rootDir, compatibilityPage), "utf8");
if (!redirectHtml.includes('url=runtime-lab.html') || !redirectHtml.includes('window.location.replace("runtime-lab.html")')) {
  errors.push(`${compatibilityPage}: compatibility redirect is incomplete`);
}

for (const stylesheet of ["styles.css", "site-frame.css"]) {
  const css = await fs.readFile(path.join(rootDir, stylesheet), "utf8");
  for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    await ensureLocalReference(stylesheet, match[1]);
  }
}

const script = await fs.readFile(path.join(rootDir, "script.js"), "utf8");
for (const match of script.matchAll(/["'](assets\/[^"']+)["']/g)) {
  await ensureLocalReference("script.js", match[1]);
}

const forbiddenScriptMarkers = [
  "whatIsAlux",
  "glvmPageZh",
  "glvmPageKo",
  "glvmPageJa",
  "glvmPageAr",
  "teamPageZhOverride",
  "renderHomeComparePanelLegacy",
  "renderHomeCapabilityMapSectionLegacy",
  "renderAluxVsRuntimeMap",
  "visibleUi"
];
for (const marker of forbiddenScriptMarkers) {
  if (script.includes(marker)) errors.push(`script.js: obsolete marker remains: ${marker}`);
}

try {
  await fs.stat(path.join(rootDir, "node_modules"));
  errors.push("node_modules must not be stored in the static site source tree");
} catch {
  // Expected: this project has no runtime package dependencies.
}

for (const obsolete of [
  "assets/parallel-concurrent-composable/parallel.webp",
  "assets/parallel-concurrent-composable/concurrent.webp",
  "assets/parallel-concurrent-composable/composable.webp"
]) {
  try {
    await fs.stat(path.join(rootDir, obsolete));
    errors.push(`obsolete asset still present: ${obsolete}`);
  } catch {
    // Expected: current Runtime Lab diagrams are SVG.
  }
}

console.log(JSON.stringify({ pages: allPages.length, checkedLocalReferences: checkedReferences.size }, null, 2));
if (errors.length) {
  console.error(`\nSite verification failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log("\nStatic site verification passed.");
}
