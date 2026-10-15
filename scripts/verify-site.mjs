import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const activePages = [
  "index.html",
  "for-ai-agents.html",
  "glvm.html",
  "alux-vs-others.html",
  "runtime-lab.html",
  "team.html",
  "roadmap.html"
];
const compatibilityPage = "parallel-concurrent-composable.html";
const allPages = [...activePages, ...["zh", "ja", "ko", "ar"].flatMap(lang => activePages.map(page => `${lang}/${page}`)), compatibilityPage];
const errors = [];
const checkedReferences = new Set();
const shareImages = new Set();

function jpegDimensions(buffer) {
  if (buffer.readUInt16BE(0) !== 0xffd8) throw Error('not a JPEG');
  for (let offset=2; offset+9<buffer.length;) {
    if (buffer[offset] !== 0xff) throw Error('invalid JPEG marker');
    const marker=buffer[offset+1],length=buffer.readUInt16BE(offset+2);
    if ([0xc0,0xc1,0xc2].includes(marker)) return [buffer.readUInt16BE(offset+7),buffer.readUInt16BE(offset+5)];
    offset+=length+2;
  }
  throw Error('missing JPEG dimensions');
}

function cleanLocalUrl(value) {
  const decoded = value.trim().replaceAll("&amp;", "&");
  if (!decoded || /^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(decoded)) return "";
  return decoded.split(/[?#]/, 1)[0];
}

async function ensureLocalReference(owner, value) {
  const clean = cleanLocalUrl(value);
  if (!clean) return;
  const isRootRelative = clean.startsWith("/");
  const referencePath = isRootRelative ? clean.slice(1) || "index.html" : clean;
  const referenceBase = isRootRelative ? rootDir : path.dirname(path.join(rootDir, owner));
  const resolved = path.resolve(referenceBase, referencePath);
  const rootPrefix = `${rootDir}${path.sep}`;
  if (resolved !== rootDir && !resolved.startsWith(rootPrefix)) {
    errors.push(`${owner}: local reference escapes site root: ${value}`);
    return;
  }
  const referenceKey = `${owner} -> ${path.relative(rootDir, resolved)}`;
  if (checkedReferences.has(referenceKey)) return;
  checkedReferences.add(referenceKey);
  try {
    let stat;
    try { stat = await fs.stat(resolved); } catch (error) {
      if (path.extname(resolved)) throw error;
      try { stat = await fs.stat(resolved + ".html"); } catch {
        stat = await fs.stat(path.join(resolved, "index.html"));
      }
    }
    if (stat.isDirectory()) stat = await fs.stat(path.join(resolved, "index.html"));
    if (!stat.isFile() || stat.size === 0) errors.push(`${owner}: empty or non-file reference: ${value}`);
  } catch {
    errors.push(`${owner}: missing local reference: ${value}`);
  }
}

for (const page of allPages) {
  const html = await fs.readFile(path.join(rootDir, page), "utf8");
  const attributes = html.matchAll(/(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi);
  for (const match of attributes) await ensureLocalReference(page, match[1]);

  if (!/rel="icon" href="\/?assets\/alux-favicon\.png\?v=20260714-logo4"/.test(html)) {
    errors.push(`${page}: missing explicit favicon`);
  }

  if (page !== compatibilityPage) {
    for (const required of ["styles.css?v=", "site-frame.css?v=", "fonts.css?v=", "script.js?v="]) {
      if (!html.includes(required)) errors.push(`${page}: missing runtime asset ${required}`);
    }
    const metas = [...html.matchAll(/<meta (?:property|name)="([^"]+)" content="([^"]*)"/g)];
    const meta = key => {
      const values = metas.filter(match => match[1] === key);
      if(values.length!==1) errors.push(`${page}: expected one ${key}`);
      return values[0]?.[2];
    };
    const lang = page.includes('/') ? page.split('/')[0] : 'en';
    const slug = path.basename(page,'.html').replace(/^index$/,'home');
    const relative = `assets/social/pages/${lang}/${slug}.jpg`;
    const image = `https://www.alux.network/${relative}?v=20261015`;
    for(const key of ['og:image','og:image:secure_url','twitter:image']) {
      if(meta(key)!==image) errors.push(`${page}: incorrect ${key} language/page mapping`);
    }
    for(const key of ['og:image:alt','twitter:image:alt']) if(!meta(key)) errors.push(`${page}: missing image alternative text`);
    if(meta('twitter:card')!=='summary_large_image'||meta('og:image:type')!=='image/jpeg'||meta('og:image:width')!=='1200'||meta('og:image:height')!=='630') errors.push(`${page}: invalid share card format`);
    const title=html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const description=meta('description');
    for(const key of ['og:title','twitter:title']) if(meta(key)!==title) errors.push(`${page}: inconsistent ${key}`);
    for(const key of ['og:description','twitter:description']) if(meta(key)!==description) errors.push(`${page}: inconsistent ${key}`);
    if(shareImages.has(image)) errors.push(`${page}: duplicated language/page share image`);
    shareImages.add(image);
    await ensureLocalReference(page,'/'+relative);
    try {
      const buffer=await fs.readFile(path.join(rootDir,relative));
      if(jpegDimensions(buffer).join('x')!=='1200x630'||buffer.length>5*1024*1024) errors.push(`${page}: invalid share image size`);
    } catch(error) { errors.push(`${page}: ${error.message}`); }
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

for (const duplicatePage of ["global-vm.html", "the-global-vm.html"]) {
  try {
    await fs.stat(path.join(rootDir, duplicatePage));
    errors.push(`duplicate GLVM page still present: ${duplicatePage}`);
  } catch {
    // Expected: glvm.html is the single canonical GLVM page.
  }
}

for (const legacyShareCard of [
  "assets/social/share-cards/alux-website-share-card-1200x630-20260716.jpg",
  "assets/social/share-cards/alux-website-share-card-3840x2016-20260716.jpg"
]) {
  try {
    await fs.stat(path.join(rootDir, legacyShareCard));
    errors.push(`legacy Global VM share card still present: ${legacyShareCard}`);
  } catch {
    // Expected: public share assets use the GLVM name.
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
