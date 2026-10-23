import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {shareCardTemplate} from './share-card-template.mjs';
import {languages} from './locales.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const slugs=['home','for-ai-agents','glvm','alux-vs-others','runtime-lab','team','roadmap'];
const args=process.argv.slice(2),arg=name=>args[args.indexOf(name)+1];
const masters=path.resolve(root,args.includes('--masters')?arg('--masters'):'../output/share-cards');
const only=args.includes('--only')?arg('--only'):null;
const selectedLanguages=args.includes('--langs')?arg('--langs').split(','):languages;
if(selectedLanguages.some(lang=>!languages.includes(lang)))throw Error('Unknown language in --langs');
const modulePath=process.env.PLAYWRIGHT_MODULE;
const {chromium}=await import(modulePath?pathToFileURL(modulePath).href:'playwright');
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
const cards=new Map();
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');if(u.pathname==='/card'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(shareCardTemplate(cards.get(u.searchParams.get('key'))));return;}const name=decodeURIComponent(u.pathname).replace(/^\//,'');const target=path.resolve(root,name);if(!target.startsWith(root+path.sep))throw Error('Invalid path');res.setHeader('Content-Type',({'.css':'text/css','.woff2':'font/woff2','.webp':'image/webp','.svg':'image/svg+xml','.jpg':'image/jpeg'})[path.extname(target)]||'application/octet-stream');res.end(await fs.readFile(target));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
const reports=[];
try{
 for(const lang of selectedLanguages)for(const slug of slugs){
  const key=lang+'/'+slug;if(only&&key!==only)continue;
  const file=(lang==='en'?'':lang+'/')+(slug==='home'?'index':slug)+'.html';
  const html=await fs.readFile(path.join(root,file),'utf8');
  const parse=await browser.newPage();await parse.setContent(html.replace(/<script\b[\s\S]*?<\/script>/g,''));
  const meta=await parse.evaluate(()=>({title:document.title,description:document.querySelector('meta[name=description]').content,quarters:[...document.querySelectorAll('.roadmap-year-section article')].slice(0,3).map(e=>({year:e.closest('[data-year]').dataset.year,quarter:'Q'+e.dataset.quarter}))}));await parse.close();
  let title=meta.title.split(/[|｜]/)[0].trim();
  if(slug==='home'){
   title=title.replace(/^ALUX(?: Network)?\s*[—–-]+\s*/u,'');
   title=title.charAt(0).toLocaleUpperCase(lang)+title.slice(1);
  }
  cards.set(key,{lang,slug,title,description:meta.description,quarters:meta.quarters,displayUrl:'alux.network'+(lang==='en'?'':'/'+lang)+(slug==='home'?'':'/'+slug)});
  const webPath=path.join(root,'assets/social/pages',lang,slug+'.jpg');await fs.mkdir(path.dirname(webPath),{recursive:true});
  const masterPath=path.join(masters,lang,slug+'.jpg');await fs.mkdir(path.dirname(masterPath),{recursive:true});
  for(const [scale,target,quality] of [[1,webPath,90],[3.2,masterPath,95]]){
   const context=await browser.newContext({viewport:{width:1200,height:630},deviceScaleFactor:scale}),page=await context.newPage();await page.goto(origin+'/card?key='+encodeURIComponent(key));const report=await page.evaluate(()=>window.cardReady);if(report.height>392)throw Error(key+': text overflow');await page.screenshot({path:target,type:'jpeg',quality});reports.push({key,scale,...report});await context.close();
  }
 }
 await fs.mkdir(masters,{recursive:true});await fs.writeFile(path.join(masters,'render.json'),JSON.stringify(reports,null,2));console.log('Rendered '+reports.length/2+' localized share cards and 4K masters.');
}finally{await browser.close();server.close();}
