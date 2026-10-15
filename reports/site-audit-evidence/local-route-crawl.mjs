import {readFileSync,writeFileSync} from 'node:fs';
import worker from 'file:///C:/Development/bike-portal-texas-catalog-integration/src/worker.js';
import {localEnv} from 'file:///C:/Development/bike-portal-texas-catalog-integration/scripts/local-db.js';
import {bikeCatalog} from 'file:///C:/Development/bike-portal-texas-catalog-integration/src/bike-catalog.js';
const env=localEnv(),origin='http://localhost',seen=new Set(),rows=[],assets=new Set();
const live=JSON.parse(readFileSync('route-audit-evidence/routes.json','utf8'));
let queue=['/','/texas','/events','/guides','/brands','/bikes','/texas/events','/texas/cities','/texas/clubs','/trails','/texas-rides',...live.map(r=>r.path)];
for(const r of bikeCatalog.records){const parts=[r.manufacturer_slug,r.model_family_slug,String(r.model_year),r.model_slug];for(let n=1;n<=4;n++)queue.push('/bikes/'+parts.slice(0,n).map(encodeURIComponent).join('/'));}
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&#39;',"'").replaceAll('&quot;','"');
try{while(queue.length&&seen.size<2500){const p=queue.shift();if(seen.has(p))continue;seen.add(p);const response=await worker.fetch(new Request(origin+p),env);const html=await response.text();const ct=response.headers.get('content-type')||'';
if(!ct.includes('text/html')){rows.push({path:p,status:response.status,contentType:ct,location:response.headers.get('location')});continue;}
const links=[...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>decode(m[1]));const header=html.match(/<header\b[^]*?<\/header>/)?.[0]||'';const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
const row={path:p,status:response.status,title:html.match(/<title>(.*?)<\/title>/)?.[1],h1:[...html.matchAll(/<h1\b/g)].length,logo:header.includes('<svg'),homeLogoLink:/<a[^>]*class="logo"[^>]*href="\/"/.test(header),noindex:response.headers.get('x-robots-tag'),links,missingMain:links.includes('#main')&&!ids.has('main')};rows.push(row);
for(const link of links){const u=new URL(link,origin+p);if(u.origin!==origin||u.pathname.startsWith('/api/')||u.pathname.startsWith('/media/'))continue;if(u.hash&&u.pathname===new URL(origin+p).pathname&&!u.search)continue;const dest=u.pathname+u.search;if(!seen.has(dest))queue.push(dest);}
for(const m of html.matchAll(/<(?:script|link|img)\b[^>]*(?:src|href)="([^"]+)"/g)){if(m[0].startsWith('<link')&&!m[0].includes('stylesheet'))continue;const u=new URL(decode(m[1]),origin+p);if(u.origin===origin)assets.add(u.pathname+u.search);}
}
const assetRows=[];for(const p of assets){const r=await worker.fetch(new Request(origin+p),env);assetRows.push({path:p,status:r.status,contentType:r.headers.get('content-type')});}
const summary={routes:rows.length,html:rows.filter(r=>r.h1!==undefined).length,bad:rows.filter(r=>r.status!==200),badLogo:rows.filter(r=>r.h1!==undefined&&!r.logo),badH1:rows.filter(r=>r.h1!==undefined&&r.h1!==1),badNoindex:rows.filter(r=>r.h1!==undefined&&!r.noindex?.includes('noindex')),badMain:rows.filter(r=>r.missingMain),assets:assetRows,newLocalPaths:[...new Set(rows.map(r=>r.path.split('?')[0]))].filter(p=>!live.some(r=>r.path===p))};
writeFileSync('route-audit-evidence/local-routes.json',JSON.stringify(rows,null,2));writeFileSync('route-audit-evidence/local-summary.json',JSON.stringify(summary,null,2));console.log(JSON.stringify({...summary,badLogo:summary.badLogo.length,badH1:summary.badH1.length,badNoindex:summary.badNoindex.length,badMain:summary.badMain.length},null,2));}finally{env._db.close();}
