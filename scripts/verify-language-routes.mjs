import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const routing = await fs.readFile(new URL("scripts/language-routing.js", root), "utf8");
function enter(pathname, { preferred = ["en-US"], saved = null, session = null, blocked = false } = {}) {
  let redirect = null;
  const storage = (value) => ({ getItem() { if (blocked) throw Error("Storage unavailable"); return value; }, setItem() {} });
  const context = vm.createContext({
    URL, navigator: { languages: preferred },
    localStorage: storage(saved), sessionStorage: storage(session),
    document: { documentElement: { style: {} } },
    window: { location: { href: "https://www.alux.network" + pathname, replace(value) { redirect = value; } } }
  });
  vm.runInContext(routing, context);
  return { ...context.window.ALUX_LANGUAGE, redirect };
}
assert.equal(enter("/", { preferred: ["zh-CN"] }).redirect, "https://www.alux.network/zh");
assert.equal(enter("/", { preferred: ["fr-FR", "ja-JP"] }).language, "ja");
assert.equal(enter("/", { preferred: ["fr-FR"] }).language, "en");
assert.equal(enter("/", { preferred: ["zh-CN"], saved: "en" }).redirect, null);
assert.equal(enter("/", { preferred: ["zh-CN"], saved: "ko" }).language, "ko");
assert.equal(enter("/", { session: "ja" }).language, "ja");
assert.equal(enter("/", { saved: "invalid", preferred: ["ar-SA"] }).language, "ar");
assert.equal(enter("/", { blocked: true, preferred: ["ja-JP"] }).language, "ja");
assert.equal(enter("/zh/roadmap", { saved: "ja" }).redirect, null);
assert.equal(enter("/roadmap", { saved: "zh" }).language, "en");
assert.equal(enter("/roadmap?lang=zh&ref=old#milestones").redirect, "https://www.alux.network/zh/roadmap?ref=old#milestones");
const page = enter("/ar/glvm");
assert.equal(page.urlFor("/roadmap.html?ref=nav#history", "zh"), "https://www.alux.network/zh/roadmap?ref=nav#history");
assert.equal(page.urlFor("/ar/glvm#architecture", "en"), "https://www.alux.network/glvm#architecture");
assert.equal(page.urlFor("https://example.com/article", "zh"), "https://example.com/article");
assert.equal(page.urlFor("/assets/alux-logo.png", "zh"), "https://www.alux.network/assets/alux-logo.png");

const languages = ["en", "zh", "ja", "ko", "ar"];
const fullCatalog = { window: {} };
vm.runInNewContext(await fs.readFile(new URL('i18n/site.generated.js', root), 'utf8'), fullCatalog);
const files = ["index", "for-ai-agents", "glvm", "alux-vs-others", "runtime-lab", "team", "roadmap"];
for (const lang of languages) {
  for (const file of files) {
    const local = `${lang === "en" ? "" : lang + "/"}${file}.html`;
    const html = await fs.readFile(new URL(local, root), "utf8");
    assert(html.includes(`<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">`), local);
    assert(html.includes(`data-prerendered="${lang}"`), local);
    const expectedNav={index:'home','for-ai-agents':'vs',glvm:'learnGlvm','alux-vs-others':'learnAlux','runtime-lab':'learnPcc',team:'team',roadmap:'roadmap'}[file];
    const currentLinks=[...html.matchAll(/<a\b[^>]*aria-current="page"[^>]*>/g)];
    assert.equal(currentLinks.length,1,`${local}: current page must be marked before JavaScript`);
    assert(currentLinks[0][0].includes(`data-nav="${expectedNav}"`),`${local}: incorrect current navigation item`);
    assert(/class="[^"]*\bactive-link\b/.test(currentLinks[0][0]),`${local}: missing initial selected style`);
    const canonical = "https://www.alux.network" + (lang === "en" ? "" : "/" + lang) + (file === "index" ? lang === "en" ? "/" : "" : "/" + file);
    assert(html.includes(`<link rel="canonical" href="${canonical}">`), local);
    assert.equal([...html.matchAll(/rel="alternate" hreflang=/g)].length, 6, local);
    assert.equal([...html.matchAll(/class="lang-button[^"]*"[^>]*href=/g)].length, 5, local);
    assert(!html.includes('display=swap'), `${local}: late font swapping can change line breaks`);
    assert(!html.includes('https://fonts.googleapis.com') && !html.includes('https://fonts.gstatic.com'), `${local}: external font dependency`);
    assert(!html.includes('src="/i18n/site.generated.js'), `${local}: unnecessary full-site catalog`);
    assert(/<script defer src="\/script\.js\?/.test(html), `${local}: runtime must not block parsing`);
    if (lang !== "en") {
      assert(html.includes('class="technical-token"'), `${local}: word protection must exist before JavaScript loads`);
      const shard = html.match(/<script defer src="\/(i18n\/runtime\/[^"?]+)\?v=([a-f0-9]{12})"><\/script>/);
      assert(shard, `${local}: missing scoped catalog`);
      const runtime = { window: {} };
      vm.runInNewContext(await fs.readFile(new URL(shard[1], root), 'utf8'), runtime);
      const catalog = runtime.window.ALUX_SITE_I18N.entries;
      assert.deepEqual(Object.keys(catalog), [lang]);
      const page = html.match(/<body data-page="([^"]+)"/)[1];
      const allowed = [page+'.', 'ui.', 'inlineUiLabels.', 'capabilityFlowLabels.', 'homeHeroActions.', ...(page==='roadmap'?['roadmapStatic.']:[])];
      const expected = Object.fromEntries(Object.entries(fullCatalog.window.ALUX_SITE_I18N.entries[lang]).filter(([key])=>allowed.some(prefix=>key.startsWith(prefix))));
      assert.equal(JSON.stringify(catalog[lang]), JSON.stringify(expected), `${local}: runtime catalog differs from reviewed translations`);
    }
    if (lang === "zh" && file === "alux-vs-others") {
      const heading = html.match(/<h1>([\s\S]*?)<\/h1>/)[1];
      for (const version of ["Web 2", "Web 3"]) {
        assert(heading.includes(`<span class="technical-token">${version}</span>`), `Initial heading splits ${version}`);
      }
    }
    if(file==='alux-vs-others'){
      assert.equal([...html.matchAll(/class="alux-summary-group /g)].length,2,`${local}: comparison subjects must form two groups`);
      const features=html.match(/<ul class="alux-summary-features">([\s\S]*?)<\/ul>/)?.[1];
      assert(features,`${local}: missing ALUX feature group`);
      assert.equal([...features.matchAll(/<li>/g)].length,3,`${local}: all three characteristics must belong to ALUX`);
    }
    if (file === "roadmap") {
      const bullets = [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)];
      assert(bullets.every(m=>m[1].includes('class="roadmap-item-status"')), `${local}: missing localized status emphasis`);
      const dates = [...html.matchAll(/<section data-year="(\d+)"[\s\S]*?<\/section>/g)]
        .flatMap(section => [...section[0].matchAll(/<article data-quarter="([1-4])"/g)].map(q => Number(section[1]) * 10 + Number(q[1])));
      assert(dates.length > 0 && dates.every((date, i) => i === 0 || date < dates[i - 1]), local);
      assert(html.includes('data-roadmap-order="newest" aria-pressed="true"'), local);
    }
  }
}
const config = JSON.parse(await fs.readFile(new URL("vercel.json", root), "utf8"));
assert.equal(config.cleanUrls, true);
console.log("Language routes verified: preference priority, blocked storage, deep links, 35 static pages, metadata and quarter order.");
