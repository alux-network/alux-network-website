import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=await fs.readFile(path.join(root,'script.js'),'utf8');
const translations=await fs.readFile(path.join(root,'i18n/site.generated.js'),'utf8');
const routing=await fs.readFile(path.join(root,'scripts/language-routing.js'),'utf8');
const roadmapTemplate=await fs.readFile(path.join(root,'scripts/templates/roadmap.html'),'utf8');
const languages=['en','zh','ja','ko','ar'];
const files=['index.html','for-ai-agents.html','glvm.html','alux-vs-others.html','runtime-lab.html','team.html','roadmap.html'];
const checkOnly=process.argv.includes('--check');
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const pageUrl=(file,lang)=>'https://www.alux.network'+(lang==='en'?'':'/'+lang)+(file==='index.html'?(lang==='en'?'/':''):'/'+file.replace(/\.html$/,''));
function render(page,language){
 const element=()=>({dataset:{},style:{},innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){},contains(){return false;}},setAttribute(){},getAttribute(){return null;},addEventListener(){},querySelector(){return null;},querySelectorAll(){return [];}});
 const main=element(),body=element();body.dataset.page=page;
 const storage={getItem(){return null;},setItem(){},removeItem(){}};
 const context=vm.createContext({console,document:{body,documentElement:element(),querySelector(s){return s==='#page-content'?main:null;},querySelectorAll(){return [];},createElement:element,addEventListener(){}},window:{ALUX_LANGUAGE:{language},location:{protocol:'https:',href:'https://www.alux.network/',hash:''},matchMedia(){return {matches:false,addEventListener(){}};},addEventListener(){}},navigator:{language:'en-US'},localStorage:storage,sessionStorage:storage,setTimeout(){},clearTimeout(){},IntersectionObserver:class {observe(){}}});
 vm.runInContext(translations,context,{timeout:5000});
 vm.runInContext(source+'\n;globalThis.output={chrome:ui,languageNames:visibleLanguageNames,page:pages[currentPage]["'+language+'"]||pages[currentPage].en};globalThis.sanitizeText=sanitizeExternalProjectNames;',context,{timeout:5000});
 return {...context.output,entries:context.window.ALUX_SITE_I18N.entries[language]||{},markup:main.innerHTML.replace(/(^|>)([^<]+)(?=<|$)/g,(_,b,t)=>b+context.sanitizeText(t,language)).replace(/[\t ]+$/gm,'')};
}
function roadmap(language,result){
 let index=0;
 let html=roadmapTemplate.replace(/>([^<>]+)</g,(all,text)=>{
  if(!text.trim())return all;
  const translated=result.entries['roadmapStatic.'+index++];
  return translated===undefined?all:'>'+text.match(/^\s*/)[0]+escape(translated)+text.match(/\s*$/)[0]+'<';
 });
 html=html.replace(/(<p\b[^>]*data-quarter="(Q[1-4])"[^>]*>)([^<]*)(<\/p>)/g,(_,open,q,label,close)=>open+'<span class="sr-only">'+label+'</span><bdi class="roadmap-quarter-visible" dir="ltr" aria-hidden="true">'+q+'</bdi>'+close);
 if(language==='en')html=html.replace(/\((Completed|Planned|In Progress|In Review|WIP)\)/g,'<strong>($1)</strong>');
 const years=[...html.matchAll(/<section\b[^>]*roadmap-year-section--(\d{4})[^>]*>[\s\S]*?<\/section>/g)].map(match=>{
  let section=match[0].replace(/<section\b/,'<section data-year="'+match[1]+'"');
  const quarters=[...section.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(m=>({quarter:Number(m[0].match(/data-quarter="Q([1-4])"/)[1]),html:m[0]})).sort((a,b)=>b.quarter-a.quarter);
  let i=0;section=section.replace(/<article\b[\s\S]*?<\/article>/g,()=>{const q=quarters[i++];return q.html.replace(/<article\b/,'<article data-quarter="'+q.quarter+'"');});
  return {year:Number(match[1]),html:section};
 }).sort((a,b)=>b.year-a.year);
 html=html.replace(/<section\b[^>]*roadmap-year-section--\d{4}[^>]*>[\s\S]*?<\/section>/g,'');
 const labels=result.chrome[language].roadmapSort;
 const controls='<div class="roadmap-order" role="group" aria-label="'+escape(labels.label)+'"><button type="button" data-roadmap-order="newest" aria-pressed="true">'+escape(labels.newest)+' <span aria-hidden="true">↑</span></button><button type="button" data-roadmap-order="oldest" aria-pressed="false">'+escape(labels.oldest)+' <span aria-hidden="true">↓</span></button></div>';
 return html.replace('</main>',controls+'\n'+years.map(y=>y.html).join('\n')+'\n</main>').replace(/(<main\b[^>]*)(>)/,'$1 data-prerendered="'+language+'"$2').replace(/\n\s*\n\s*\n/g,'\n\n').trim();
}
const stale=[];
for(const file of files){
 const original=(await fs.readFile(path.join(root,file),'utf8')).replace(/\r\n/g,'\n');
 const page=original.match(/<body\b[^>]*data-page="([^"]+)"/)[1];
 for(const language of languages){
  const result=render(page,language),chrome=result.chrome[language];
  let html=original.replace(/\n*<script data-initial-navigation>[\s\S]*?<\/script>\n*/,'\n').replace(/\n*<script data-language-routing>[\s\S]*?<\/script>\n*/,'\n').replace(/\s*<link rel="alternate" hreflang="[^"]+"[^>]*>/g,'');
  html=html.replace(/<html\b[^>]*>/,'<html lang="'+language+'" dir="'+(language==='ar'?'rtl':'ltr')+'">');
  html=html.replace(/(<meta charset="UTF-8">)/,'$1\n<script data-language-routing>\n'+routing.trim()+'\n</script>');
  const main=file==='roadmap.html'?roadmap(language,result):'<main id="page-content" data-prerendered="'+language+'">'+result.markup+'</main>';
  if(!/<h[1-6]\b/.test(main))throw Error(file+': empty content');
  html=html.replace(/<main\b[^>]*id="page-content"[^>]*>[\s\S]*?<\/main>/,()=>main);
  html=html.replace(/(<[^>]+data-nav="([^"]+)"[^>]*>)[^<]*/g,(_,open,key)=>open+escape(chrome.nav[key]));
  html=html.replace(/(data-lang-label>)[^<]*/g,'$1'+escape(chrome.languageLabel)).replace(/(data-lang-current>)[^<]*/g,'$1'+escape(result.languageNames[language]));
  html=html.replace(/(class="site-nav"[^>]*aria-label=")[^"]*/,'$1'+escape(chrome.primaryNavigationLabel)).replace(/(class="menu-toggle"[^>]*aria-label=")[^"]*/,'$1'+escape(chrome.menuToggleLabel));
  html=html.replace(/(<[^>]+data-footer="copyright"[^>]*>)[^<]*/g,'$1'+escape(chrome.footer.copyright));
  html=html.replace(/<title>[\s\S]*?<\/title>/,()=>'<title>'+escape(result.page.metaTitle)+'</title>').replace(/(<meta name="description" content=")[^"]*/,()=>'<meta name="description" content="'+escape(result.page.metaDescription));
  const canonical=pageUrl(file,language);
  const canonicalTag='<link rel="canonical" href="'+canonical+'">';
  html=/<link rel="canonical"/.test(html)?html.replace(/<link rel="canonical"[^>]*>/,canonicalTag):html.replace('</title>','</title>\n'+canonicalTag);
  html=html.replace(/(<meta property="og:url" content=")[^"]*/,'$1'+canonical);
  if(language!=='en')html=html.replace(/(<meta (?:property|name)="(?:og|twitter):(title|description)" content=")[^"]*/g,(_,open,key)=>open+escape(key==='title'?result.page.metaTitle:result.page.metaDescription));
  const locales={en:'en_US',zh:'zh_CN',ja:'ja_JP',ko:'ko_KR',ar:'ar_AR'};
  html=html.replace(/(<meta property="og:locale" content=")[^"]*/,'$1'+locales[language]);
  const alternates=languages.map(lang=>'<link rel="alternate" hreflang="'+(lang==='zh'?'zh-Hans':lang)+'" href="'+pageUrl(file,lang)+'">').concat('<link rel="alternate" hreflang="x-default" href="'+pageUrl(file,'en')+'">').join('\n');
  html=html.replace(canonicalTag,canonicalTag+'\n'+alternates);
  // Explicit language hyperlinks work even when the runtime is unavailable.
  html=html.replace(/<(?:button|a)([^>]*class="lang-button[^"]*"[^>]*data-lang="([^"]+)"[^>]*)>([^<]*)<\/(?:button|a)>/g,(_,attrs,lang,text)=>'<a'+attrs.replace(/ type="button"| href="[^"]*"| hreflang="[^"]*"/g,'')+' href="'+pageUrl(file,lang)+'" hreflang="'+(lang==='zh'?'zh-Hans':lang)+'">'+text+'</a>');
  html=html.replace(/(href|src|poster)="([^"]+)"/g,(all,attr,value)=>{
   if(/^(?:#|mailto:|tel:|data:|https?:\/\/)/.test(value))return all;
   const parts=value.split(/(?=[?#])/),raw=parts.shift();
   const target=raw.replace(/^\/(?:zh|ja|ko|ar)\//,'/').replace(/^\//,'').replace(/\.html$/,'');
   const pageFile=target===''||target==='index'?'index.html':target+'.html';
   if(attr==='href'&&files.includes(pageFile))return attr+'="'+pageUrl(pageFile,language).replace('https://www.alux.network','')+parts.join('')+'"';
   return attr+'="/'+raw.replace(/^\//,'')+parts.join('')+'"';
  });
  html=html.replace(/(styles\.css|script\.js)\?v=[^"\s]+/g,'$1?v=20261012-language-routes').replace(/site.generated.js\?v=[^"\s]+/g,'site.generated.js?v=20261012-roadmap-order');
  html=html.trimEnd()+'\n';
  const target=path.join(root,language==='en'?'':language,file);
  const existing=await fs.readFile(target,'utf8').catch(()=>null);
  if(existing!==html){if(checkOnly)stale.push(path.relative(root,target));else{await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,html,'utf8');}}
 }
}
if(stale.length)throw Error('Stale localized pages: '+stale.join(', ')+'. Run npm run pages:render.');
console.log((checkOnly?'Verified':'Rendered')+' all 35 language pages, initial content, links and metadata.');
