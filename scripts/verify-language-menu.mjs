import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {locales} from './locales.mjs';

// Optional rendered checks; use the same existing browser setup as share cards.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
assert(locales.length > 1, 'Expected a nonempty multilingual registry');
const languageArg = process.argv.slice(2).find(arg => arg.startsWith('--langs='));
const selectedCodes = languageArg ? new Set(languageArg.slice(8).split(',')) : null;
const selectedLocales = selectedCodes ? locales.filter(locale => selectedCodes.has(locale.code)) : locales;
assert(selectedLocales.length > 0 && (!selectedCodes || selectedLocales.length === selectedCodes.size), 'Unknown language in --langs');
const output = path.resolve(root, '../output/language-menu-checks');
const modulePath = process.env.PLAYWRIGHT_MODULE;
const {chromium, webkit} = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright');
const pages = args.has('--all-pages')
  ? ['', 'for-ai-agents', 'glvm', 'alux-vs-others', 'runtime-lab', 'team', 'roadmap']
  : [''];
const engines = [['chromium', chromium]];
if (args.has('--webkit')) engines.push(['webkit', webkit]);
const mime = {'.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.woff2':'font/woff2', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg'};
const server = http.createServer(async (request, response) => {
  try {
    let name = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1);
    if (!name || locales.some(locale => locale.code === name)) name += (name ? '/' : '') + 'index.html';
    else if (!path.extname(name)) name += '.html';
    const target = path.resolve(root, name);
    if (!target.startsWith(root + path.sep)) throw Error('Outside website root');
    response.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream');
    response.end(await fs.readFile(target));
  } catch {
    response.statusCode = 404;
    response.end();
  }
});
const reports = [];
await fs.mkdir(output, {recursive:true});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = 'http://127.0.0.1:' + server.address().port;
try {
  for (const [engineName, engine] of engines) {
    const browser = await engine.launch({headless:true, ...(engineName === 'chromium' && process.env.BROWSER_EXECUTABLE ? {executablePath:process.env.BROWSER_EXECUTABLE} : {})});
    const profiles = [
      {name:'phone', width:engineName === 'webkit' ? 390 : 360, height:844, touch:true},
      {name:'landscape', width:568, height:320, touch:true},
      {name:'tablet', width:engineName === 'webkit' ? 820 : 768, height:1180, touch:true},
      {name:'compact-start', width:961, height:900, touch:true},
      {name:'compact-end', width:1180, height:900, touch:true},
      {name:'desktop', width:1440, height:900, touch:false}
    ];
    if (engineName === 'chromium' && args.has('--4k')) profiles.push({name:'4k', width:3840, height:2160, touch:false});
    try {
      const jobs = profiles.flatMap(profile => selectedLocales.map(locale => ({profile, locale})));
      let nextJob = 0;
      let lastProgress = reports.length;
      await Promise.all(Array.from({length:3}, async () => {
        while (nextJob < jobs.length) {
          const {profile, locale} = jobs[nextJob++];
          const context = await browser.newContext({viewport:{width:profile.width, height:profile.height}, isMobile:profile.touch, hasTouch:profile.touch, locale:'en-US'});
          try {
            for (const slug of pages) {
              const page = await context.newPage();
              const errors = [];
              page.on('pageerror', error => errors.push(error.message));
              try {
                const prefix = locale.code === 'en' ? '' : '/' + locale.code;
                await page.goto(origin + prefix + (slug ? '/' + slug : prefix ? '' : '/'));
                await page.evaluate(() => document.fonts.ready);
                if (locale.code === 'zh' || locale.code === 'zh-hant') {
                  const balanced = await page.locator('main :is(h1,h2,h3,h4,h5,h6), main :is(h1,h2,h3,h4,h5,h6) *').evaluateAll(elements => elements.filter(element => getComputedStyle(element).textWrapStyle === 'balance').length);
                  assert.equal(balanced, 0, 'Chinese headings must use natural line flow');
                }
                const switcher = page.locator('.lang-switch');
                const activate = locator => profile.touch ? locator.tap() : locator.click();
                if (profile.touch) {
                  const bars = await page.locator('.menu-toggle span').evaluateAll(elements => elements.map(element => {
                    const rect = element.getBoundingClientRect();
                    return {x:rect.x+rect.width/2,y:rect.y+rect.height/2,width:rect.width,height:rect.height};
                  }));
                  assert.equal(bars.length, 3, 'Expected three visible hamburger bars');
                  assert(bars.every(bar => bar.width > 10 && bar.height > 0), 'Collapsed hamburger bar');
                  assert(Math.max(...bars.map(bar => bar.x))-Math.min(...bars.map(bar => bar.x)) < 1 && bars[1].y-bars[0].y > 4 && bars[2].y-bars[1].y > 4, 'Hamburger bars must stack vertically');
                  await activate(page.locator('.menu-toggle'));
                  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true', 'Navigation did not open');
                  await page.waitForFunction(() => getComputedStyle(document.querySelector('.menu-toggle span:nth-child(2)')).opacity === '0');
                  await activate(page.locator('[aria-controls="learn-menu"]'));
                  assert.equal(await page.locator('[aria-controls="learn-menu"]').getAttribute('aria-expanded'), 'true', 'Learn did not open');
                  await page.touchscreen.tap(1, profile.height - 2);
                  assert.equal(await page.locator('[aria-controls="learn-menu"]').getAttribute('aria-expanded'), 'false');
                  await activate(page.locator('[aria-controls="learn-menu"]'));
                }
                const toolsTrigger = page.locator('[aria-controls="tools-menu"]');
                await activate(toolsTrigger);
                assert.equal(await toolsTrigger.getAttribute('aria-expanded'), 'true', 'Tools did not open');
                assert.equal(await page.locator('#tools-menu a').getAttribute('aria-current'), null, 'External Explorer is not the current homepage');
                assert.equal(await page.locator('[aria-controls="learn-menu"]').getAttribute('aria-expanded'), 'false');
                await toolsTrigger.focus();
                await page.keyboard.press('ArrowDown');
                assert(await page.locator('#tools-menu a').evaluate(element => element === document.activeElement));
                await page.keyboard.press('Escape');
                assert.equal(await toolsTrigger.getAttribute('aria-expanded'), 'false');
                assert(await toolsTrigger.evaluate(element => element === document.activeElement));
                await activate(toolsTrigger);
                await activate(switcher);
                assert.equal(await switcher.getAttribute('aria-expanded'), 'true', 'Language picker did not open');
                assert(await page.locator('.lang-menu').isVisible(), 'Language picker is hidden');
                const state = await page.locator('.lang-menu').evaluate(menu => {
                  const rect = menu.getBoundingClientRect();
                  return {
                    left:rect.left, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height,
                    display:getComputedStyle(menu).display,
                    internalScroll:menu.scrollHeight - menu.clientHeight,
                    columns:getComputedStyle(menu).gridTemplateColumns.split(/\s+/).length,
                    pageWidth:document.documentElement.scrollWidth,
                    items:[...menu.children].map(item => ({code:item.dataset.lang, text:item.textContent, checked:item.getAttribute('aria-checked'), clipped:item.scrollWidth > item.clientWidth + 1})),
                    competingMenu:[...document.querySelectorAll('.nav-dropdown')].some(menu => menu.classList.contains('open')) || (matchMedia('(max-width: 1180px)').matches && document.querySelector('.site-nav').classList.contains('open'))
                  };
                });
                assert.deepEqual(state.items.map(item => item.code), locales.map(item => item.code));
                assert.deepEqual(state.items.map(item => item.text), locales.map(item => item.name));
                assert.equal(state.items.filter(item => item.checked === 'true')[0]?.code, locale.code);
                assert.equal(state.items.filter(item => item.checked === 'true').length, 1);
                assert(!state.items.some(item => item.clipped), 'Clipped language label');
                assert.equal(state.display, 'grid');
                assert(state.width > 0 && state.height > 0, 'Picker has no visible area');
                assert(!state.competingMenu, 'Language picker overlaps another open menu');
                assert(state.left >= -1 && state.right <= profile.width + 1 && state.bottom <= profile.height + 1, 'Picker outside viewport');
                assert(state.internalScroll <= 1, 'Picker has an internal scrollbar');
                assert(state.pageWidth <= profile.width + 1, 'Horizontal page overflow');
                {
                  await switcher.focus();
                  await page.keyboard.press('ArrowDown');
                  assert.equal(await page.evaluate(() => document.activeElement.dataset.lang), locales[0].code);
                  await page.keyboard.press('ArrowDown');
                  assert.equal(await page.evaluate(() => document.activeElement.dataset.lang), locales[state.columns].code);
                  await page.keyboard.press(locale.code === 'ar' ? 'ArrowLeft' : 'ArrowRight');
                  assert.equal(await page.evaluate(() => document.activeElement.dataset.lang), locales[state.columns + 1].code);
                  await page.keyboard.press('End');
                  assert.equal(await page.evaluate(() => document.activeElement.dataset.lang), locales.at(-1).code);
                  await page.keyboard.press('Tab');
                  assert.equal(await switcher.getAttribute('aria-expanded'), 'false');
                  await switcher.focus();
                  await page.keyboard.press('ArrowDown');
                  await page.keyboard.press('Escape');
                  assert.equal(await switcher.getAttribute('aria-expanded'), 'false');
                  assert(await switcher.evaluate(element => element === document.activeElement));
                }
                await activate(switcher);
                if (profile.touch) {
                  await page.touchscreen.tap(1, profile.height - 2);
                } else {
                  await page.mouse.click(1, profile.height - 2);
                }
                assert.equal(await switcher.getAttribute('aria-expanded'), 'false');
                if (profile.name === 'tablet' && !slug) {
                  await activate(page.locator('.menu-toggle'));
                  await page.setViewportSize({width:1280, height:900});
                  await activate(switcher);
                  await page.setViewportSize({width:profile.width, height:profile.height});
                  assert(!await page.locator('.site-nav').evaluate(element => element.classList.contains('open')), 'Mobile navigation survived a breakpoint change');
                  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
                  assert.equal(await switcher.getAttribute('aria-expanded'), 'true');
                  await page.touchscreen.tap(1, profile.height - 2);
                }
                assert.deepEqual(errors, []);
                if (args.has('--screenshots') && !slug && ['en','ar','fr','zh','zh-hant'].includes(locale.code)) {
                  await activate(switcher);
                  await page.screenshot({path:path.join(output, `${engineName}-${profile.name}-${locale.code}.png`)});
                }
                reports.push({engine:engineName, profile:profile.name, language:locale.code, page:slug || 'home', passed:true});
              } catch (error) {
                reports.push({engine:engineName, profile:profile.name, language:locale.code, page:slug || 'home', passed:false, error:error.message});
              } finally {
                await page.close();
              }
            }
          } finally {
            await context.close();
          }
          if (reports.length - lastProgress >= 84) {
            console.log(`Language menu checks: ${reports.length}; failures: ${reports.filter(report => !report.passed).length}`);
            lastProgress = reports.length;
          }
        }
      }));
    } finally {
      await browser.close();
    }
  }
} finally {
  server.close();
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(reports, null, 2));
}
const failed = reports.filter(report => !report.passed);
console.log(JSON.stringify({checks:reports.length, failures:failed.length, examples:failed.slice(0, 3)}));
if (failed.length) process.exitCode = 1;
