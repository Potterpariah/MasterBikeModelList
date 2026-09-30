export const RELEASE='4.3.4';
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const jsonScript=value=>JSON.stringify(value).replace(/</g,'\\u003c');
export function siteOrigin(request,env){
  try{const u=new URL(env.PUBLIC_ORIGIN);if(u.protocol==='https:'&&u.pathname==='/'&&!u.search&&!u.hash&&!u.username&&!u.password)return u.origin;}catch{}
  return new URL(request.url).origin;
}
export function canIndex(request,env,eligible=false){
 const u=new URL(request.url);
 let origin;try{origin=new URL(env.PUBLIC_ORIGIN);if(origin.protocol!=='https:'||origin.pathname!=='/'||origin.search||origin.hash||origin.username||origin.password)return false;}catch{return false;}
 return eligible&&env.PUBLIC_INDEXING==='enabled'&&origin.origin===u.origin&&!u.search&&!origin.hostname.endsWith('.workers.dev');
}
export function meta(request,env,{title,description,path='/',schema=[]}){
 const canonical=siteOrigin(request,env)+path;
 return `<title>${escapeHTML(title)}</title><meta name="description" content="${escapeHTML(description)}"><link rel="canonical" href="${escapeHTML(canonical)}"><meta property="og:type" content="website"><meta property="og:site_name" content="Bike Portal"><meta property="og:title" content="${escapeHTML(title)}"><meta property="og:description" content="${escapeHTML(description)}"><meta property="og:url" content="${escapeHTML(canonical)}"><meta name="twitter:card" content="summary">${schema.length?`<script type="application/ld+json">${jsonScript({'@context':'https://schema.org','@graph':schema})}</script>`:''}`;
}
export const publicPath=(kind,id)=>({guide:'/guides/',event:'/events/',brand:'/brands/',bike:'/bikes/'}[kind]||'/#'+kind+'/')+encodeURIComponent(id);
export function safeExternal(url,label){try{const u=new URL(url);if(!['https:','http:'].includes(u.protocol))return '';return `<a href="${escapeHTML(u.href)}" rel="noopener noreferrer" target="_blank">${escapeHTML(label)}</a>`;}catch{return '';}}
