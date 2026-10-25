import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {locales, languages, localeBootstrap} from './locales.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=await fs.readFile(path.join(root,'script.js'),'utf8');
const translations=await fs.readFile(path.join(root,'i18n/site.generated.js'),'utf8');
const routing=localeBootstrap+await fs.readFile(path.join(root,'scripts/language-routing.js'),'utf8');
const roadmapTemplate=await fs.readFile(path.join(root,'scripts/templates/roadmap.html'),'utf8');
const files=['index.html','for-ai-agents.html','glvm.html','alux-vs-others.html','runtime-lab.html','team.html','roadmap.html'];
const checkOnly=process.argv.includes('--check');
const selectedArg=process.argv.find(arg=>arg.startsWith('--lang='));
const renderLanguages=selectedArg?selectedArg.slice(7).split(','):languages;
if(renderLanguages.some(language=>!languages.includes(language)))throw Error('Unknown language filter');
const media=JSON.parse(await fs.readFile(path.join(root,'scripts/optimized-media.json'),'utf8'));
async function emit(target,content){
 const existing=await fs.readFile(target,'utf8').catch(()=>null);
 if(existing!==content){if(checkOnly)stale.push(path.relative(root,target));else{await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,content,'utf8');}}
}
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const pageUrl=(file,lang)=>'https://www.alux.network'+(lang==='en'?'':'/'+lang)+(file==='index.html'?(lang==='en'?'/':''):'/'+file.replace(/\.html$/,''));
const hreflang=language=>locales.find(locale=>locale.code===language).hreflang;
const languagePrefix=new RegExp('^/(?:'+languages.filter(lang=>lang!=='en').join('|')+')(?=/|$)');
function render(page,language){
 const element=()=>({dataset:{},style:{},innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){},contains(){return false;}},setAttribute(){},getAttribute(){return null;},addEventListener(){},querySelector(){return null;},querySelectorAll(){return [];}});
 const main=element(),body=element();body.dataset.page=page;
 const storage={getItem(){return null;},setItem(){},removeItem(){}};
 const context=vm.createContext({console,document:{body,documentElement:element(),querySelector(s){return s==='#page-content'?main:null;},querySelectorAll(){return [];},createElement:element,addEventListener(){}},window:{ALUX_LOCALES:locales,ALUX_LANGUAGE:{language},location:{protocol:'https:',href:'https://www.alux.network/',hash:''},matchMedia(){return {matches:false,addEventListener(){}};},addEventListener(){}},navigator:{language:'en-US'},localStorage:storage,sessionStorage:storage,setTimeout(){},clearTimeout(){},IntersectionObserver:class {observe(){}}});
 vm.runInContext(translations,context,{timeout:5000});
 vm.runInContext(source+'\n;globalThis.output={chrome:ui,languageNames:visibleLanguageNames,page:pages[currentPage]["'+language+'"]||pages[currentPage].en};globalThis.sanitizeText=sanitizeExternalProjectNames;globalThis.technicalMatches=localizedTechnicalMatches;globalThis.arabicRuns=ARABIC_TECHNICAL_RUN;',context,{timeout:5000});
 return {...context.output,technicalMatches:context.technicalMatches,arabicRuns:context.arabicRuns,entries:context.window.ALUX_SITE_I18N.entries[language]||{},markup:main.innerHTML.replace(/(^|>)([^<]+)(?=<|$)/g,(_,b,t)=>b+context.sanitizeText(t,language)).replace(/[\t ]+$/gm,'')};
}

// Match the runtime's semantic word protection before the first paint. The
// runtime is idempotent over these wrappers, so loading JS cannot rewrap text.
function protectInitialText(markup, language, result) {
 if(language==='en')return markup;
 const stack=[],voidTags=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
 const decode=text=>text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(entity,key)=>key[0]==='#'?String.fromCodePoint(parseInt(key.slice(key[1]?.toLowerCase()==='x'?2:1),key[1]?.toLowerCase()==='x'?16:10)):({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:'\u00a0'}[key.toLowerCase()]||entity));
 const wrap=(text,matches,tag,attributes,rest=escape)=>{let cursor=0,html='';for(const match of matches){html+=rest(text.slice(cursor,match.index))+'<'+tag+attributes+'>'+escape(match[0])+'</'+tag+'>';cursor=match.index+match[0].length;}return html+rest(text.slice(cursor));};
 return markup.replace(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g,part=>{
  if(part.startsWith('<!--'))return part;
  if(part[0]==='<'){
   const closing=part.match(/^<\/([\w-]+)/),opening=part.match(/^<([\w-]+)/);
   if(closing){const i=stack.map(e=>e.tag).lastIndexOf(closing[1].toLowerCase());if(i>=0)stack.length=i;}
   else if(opening&&!voidTags.has(opening[1].toLowerCase())&&!part.endsWith('/>'))stack.push({tag:opening[1].toLowerCase(),classes:(part.match(/\bclass="([^"]*)"/)?.[1]||'').split(/\s+/),ltr:/\bdir=['"]ltr['"]/.test(part)});
   return part;
  }
  if(!part.trim()||stack.some(e=>['script','style','svg','bdi'].includes(e.tag)||e.ltr||e.classes.some(c=>['technical-token','no-break-token'].includes(c))))return part;
  const arabicScope=stack.some(e=>e.classes.includes('agent-difference-node'))||stack.some(e=>e.classes.includes('roadmap-bullet-list'))&&stack.some(e=>e.tag==='li')||stack.some(e=>e.classes.includes('glvm-page'))&&stack.some(e=>['p','h1','h2','h3','span','strong','small','li','code','a','button'].includes(e.tag));
  const text=decode(part),matches=result.technicalMatches(text);
  const rest=language==='ar'&&arabicScope?value=>wrap(value,[...value.matchAll(result.arabicRuns)],'bdi',' dir="ltr"'):escape;
  if(matches.length)return wrap(text,matches,language==='ar'?'bdi':'span',' class="technical-token"'+(language==='ar'?' dir="ltr"':''),rest);
  if(language==='ar'&&arabicScope)return rest(text);
  return part;
 });
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
 html=html.replace(/([（(][^<()（）]+[)）])(?=\s*(?:<\/strong>)?(?:<\/span>)?<\/li>)/g,'<span class="roadmap-item-status">$1</span>');
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
 for(const language of renderLanguages){
  const result=render(page,language),chrome=result.chrome[language];
  if(!chrome || (language!=='en' && !Object.keys(result.entries).some(key=>key.startsWith(page+'.'))))throw Error(language+'/'+page+': missing reviewed translations');
  let html=original.replace(/\n*<script data-initial-navigation>[\s\S]*?<\/script>\n*/,'\n').replace(/\n*<script data-language-routing>[\s\S]*?<\/script>\n*/,'\n').replace(/\s*<link rel="alternate" hreflang="[^"]+"[^>]*>/g,'');
  html=html.replace(/<html\b[^>]*>/,'<html lang="'+language+'" dir="'+(language==='ar'?'rtl':'ltr')+'">');
  html=html.replace(/\s*<link\b[^>]*href="https:\/\/fonts\.(?:googleapis|gstatic)\.com[^"<>]*"[^>]*>/g,'');
  if(!html.includes('href="/fonts.css?'))html=html.replace(/(<link rel="stylesheet" href="\/styles\.css)/,'<link rel="stylesheet" href="/fonts.css?v=20261014-local-fonts">\n$1');
  // Slow web fonts keep the stable fallback rather than swapping after paint.
  html=html.replace(/([&?])display=swap\b/g,'$1display=optional');
  html=html.replace(/(<meta charset="UTF-8">)/,'$1\n<script data-language-routing>\n'+routing.trim()+'\n</script>');
  const main=protectInitialText(file==='roadmap.html'?roadmap(language,result):'<main id="page-content" data-prerendered="'+language+'">'+result.markup+'</main>',language,result);
  if(!/<h[1-6]\b/.test(main))throw Error(file+': empty content');
  html=html.replace(/<main\b[^>]*id="page-content"[^>]*>[\s\S]*?<\/main>/,()=>main);
  html=html.replace(/(<[^>]+data-nav="([^"]+)"[^>]*>)[^<]*/g,(_,open,key)=>open+escape(chrome.nav[key]));
  const navPages={home:'home',vs:'vs',learnGlvm:'glvm',learnPcc:'parallelConcurrentComposable',learnAlux:'aluxVsOthers',team:'team',roadmap:'roadmap'};
  html=html.replace(/<a\b[^>]*data-nav="([^"]+)"[^>]*>/g,(tag,key)=>{
   const active=navPages[key]===page;
   let classes=(tag.match(/\bclass="([^"]*)"/)?.[1]||'').split(/\s+/).filter(c=>c&&c!=='active-link');
   if(active)classes.push('active-link');
   tag=tag.replace(/\s+(?:class|aria-current)="[^"]*"/g,'');
   return tag.replace(/>$/, (classes.length?' class="'+classes.join(' ')+'"':'')+(active?' aria-current="page"':'')+'>');
  });
  html=html.replace(/(data-lang-label>)[^<]*/g,'$1'+escape(chrome.languageLabel)).replace(/(data-lang-current>)[^<]*/g,'$1'+escape(result.languageNames[language]));
  html=html.replace(/(class="site-nav"[^>]*aria-label=")[^"]*/,'$1'+escape(chrome.primaryNavigationLabel)).replace(/(class="menu-toggle"[^>]*aria-label=")[^"]*/,'$1'+escape(chrome.menuToggleLabel));
  html=html.replace(/(<[^>]+data-footer="copyright"[^>]*>)[^<]*/g,'$1'+escape(chrome.footer.copyright));
  html=html.replace(/<title>[\s\S]*?<\/title>/,()=>'<title>'+escape(result.page.metaTitle)+'</title>').replace(/(<meta name="description" content=")[^"]*/,()=>'<meta name="description" content="'+escape(result.page.metaDescription));
  const canonical=pageUrl(file,language);
  const canonicalTag='<link rel="canonical" href="'+canonical+'">';
  html=/<link rel="canonical"/.test(html)?html.replace(/<link rel="canonical"[^>]*>/,canonicalTag):html.replace('</title>','</title>\n'+canonicalTag);
  html=html.replace(/(<meta property="og:url" content=")[^"]*/,'$1'+canonical);
  if(language!=='en')html=html.replace(/(<meta (?:property|name)="(?:og|twitter):(title|description)" content=")[^"]*/g,(_,open,key)=>open+escape(key==='title'?result.page.metaTitle:result.page.metaDescription));
  const ogLocale=locales.find(locale=>locale.code===language).ogLocale;
  html=html.replace(/(<meta property="og:locale" content=")[^"]*/,'$1'+ogLocale);
  // Share crawlers read the static head without running the language/runtime JS.
  const shareSlug=file==='index.html'?'home':file.replace(/\.html$/,'');
  const shareImage='https://www.alux.network/assets/social/pages/'+language+'/'+shareSlug+'.jpg?v=20261015';
  const shareMeta={
   'og:type':'website','og:site_name':'ALUX Network','og:locale':ogLocale,
   'og:url':canonical,'og:title':result.page.metaTitle,'og:description':result.page.metaDescription,
   'og:image':shareImage,'og:image:secure_url':shareImage,'og:image:type':'image/jpeg',
   'og:image:width':'1200','og:image:height':'630','og:image:alt':result.page.metaTitle,
   'twitter:card':'summary_large_image','twitter:title':result.page.metaTitle,
   'twitter:description':result.page.metaDescription,'twitter:image':shareImage,
   'twitter:image:alt':result.page.metaTitle
  };
  for(const [key,value] of Object.entries(shareMeta)){
   const tag='<meta '+(key.startsWith('og:')?'property':'name')+'="'+key+'" content="'+escape(value)+'">';
   const matcher=new RegExp('<meta (?:property|name)="'+key+'"[^>]*>','g');
   html=matcher.test(html)?html.replace(matcher,()=>tag):html.replace('</head>',tag+'\n</head>');
  }
  const alternates=languages.map(lang=>'<link rel="alternate" hreflang="'+hreflang(lang)+'" href="'+pageUrl(file,lang)+'">').concat('<link rel="alternate" hreflang="x-default" href="'+pageUrl(file,'en')+'">').join('\n');
  html=html.replace(canonicalTag,canonicalTag+'\n'+alternates);
  // Explicit language hyperlinks work even when the runtime is unavailable.
  html=html.replace(/(<div class="lang-menu"[^>]*>)[\s\S]*?<\/div>/,(_,open)=>open+locales.map(locale=>'<a class="lang-button'+(locale.code===language?' active':'')+'" role="menuitemradio" aria-checked="'+(locale.code===language)+'" data-lang="'+locale.code+'" lang="'+locale.hreflang+'" dir="'+(locale.code==='ar'?'rtl':'ltr')+'" href="'+pageUrl(file,locale.code)+'" hreflang="'+locale.hreflang+'">'+escape(locale.name)+'</a>').join('')+'</div>');
  html=html.replace(/(href|src|poster)="([^"]+)"/g,(all,attr,value)=>{
   if(/^(?:#|mailto:|tel:|data:|https?:\/\/)/.test(value))return all;
   const parts=value.split(/(?=[?#])/),raw=parts.shift();
   const target=raw.replace(languagePrefix,'').replace(/^\//,'').replace(/\.html$/,'');
   const pageFile=target===''||target==='index'?'index.html':target+'.html';
   if(attr==='href'&&files.includes(pageFile))return attr+'="'+pageUrl(pageFile,language).replace('https://www.alux.network','')+parts.join('')+'"';
   return attr+'="/'+raw.replace(/^\//,'')+parts.join('')+'"';
  });
  for(const [before,after] of Object.entries(media))html=html.replaceAll(before,after);
  html=html.replace(/(\/assets\/optimized\/[^"?]+\.webp)\?v=[^"]+/g,'$1');
  html=html.replace(/\s*<script\b[^>]*src="\/i18n\/(?:site\.generated\.js|runtime\/[^"?]+)(?:\?[^"<>]*)?"[^>]*><\/script>/g,'');
  if(language!=='en'){
   const prefixes=[page+'.','ui.','inlineUiLabels.','capabilityFlowLabels.','homeHeroActions.',...(page==='roadmap'?['roadmapStatic.']:[])];
   const entries=Object.fromEntries(Object.entries(result.entries).filter(([key])=>prefixes.some(prefix=>key.startsWith(prefix))));
   const pack='window.ALUX_SITE_I18N='+JSON.stringify({entries:{[language]:entries}})+';\n';
   const name='i18n/runtime/'+language+'/'+page+'.js',version=createHash('sha256').update(pack).digest('hex').slice(0,12);
   await emit(path.join(root,name),pack);
   html=html.replace(/(<script\b[^>]*src="\/script\.js)/,'<script defer src="/'+name+'?v='+version+'"></script>\n$1');
  }
  html=html.replace(/<script\b(?: defer)? src="\/script\.js/g,'<script defer src="/script.js');
  html=html.replace(/styles\.css\?v=[^"\s]+/g,'styles.css?v=20261023-locales').replace(/script\.js\?v=[^"\s]+/g,'script.js?v=20261024-discord').replace(/site-frame\.css\?v=[^"\s]+/g,'site-frame.css?v=20261023-locales').replace(/home-hero-3d\.css\?v=[^"\s]+/g,'home-hero-3d.css?v=20261015-hero-spacing').replace(/roadmap\.css\?v=[^"\s]+/g,'roadmap.css?v=20261014-details');
  if(page==='home'){
   html=html.replace(/\s*<link rel="preload"[^>]*data-home-media[^>]*>/g,'');
   const preloads=['assets/home/hero/alux-hero-3d-upper-brick.png','assets/home/hero/alux-hero-3d-lower-assembly.png'].map(name=>'<link rel="preload" as="image" type="image/webp" href="/'+media[name]+'" fetchpriority="high"'+' data-home-media>').join('\n');
   html=html.replace(/\s*<\/head>/,'\n'+preloads+'\n</head>');
  }
  html=html.trimEnd()+'\n';
  await emit(path.join(root,language==='en'?'':language,file),html);
 }
}
if(stale.length)throw Error('Stale localized pages: '+stale.join(', ')+'. Run npm run pages:render.');
console.log((checkOnly?'Verified':'Rendered')+' '+renderLanguages.length*files.length+' language pages, initial content, links and metadata.');
