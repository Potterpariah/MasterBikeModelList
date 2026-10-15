import {discoveryPilot} from './discovery-pilot.js';
const paths=new Set(['/texas/events',...discoveryPilot.events.map(e=>'/texas/events/'+e.slug)]);
export const metricsEnabled=env=>env.DISCOVERY_MEASUREMENT==='enabled'&&Boolean(env.DISCOVERY_METRICS);
export function metricsMarkup(path,env){return metricsEnabled(env)&&paths.has(path)?'<script src="/discovery-metrics.js" defer></script>':'';}
export const metricsScript=`(()=>{
 try {
  const query=new URLSearchParams(location.search);
  if(query.get('measurement')==='off')sessionStorage.setItem('discovery-measurement-off','1');
  if(sessionStorage.getItem('discovery-measurement-off')||navigator.doNotTrack==='1'||navigator.globalPrivacyControl)return;
  const path=location.pathname;
  const isList=path==='/texas/events';
  let sent=false,clicked=false;
  const send=type=>{try{fetch('/discovery-metrics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,path}),keepalive:true,credentials:'omit'}).catch(()=>{});}catch{}};
  const view=()=>{if(!sent&&document.visibilityState==='visible'){sent=true;send(isList?'discovery_view':'detail_view');}};
  view();document.addEventListener('visibilitychange',view);
  const click=event=>{const link=event.target.closest?.('[data-official-organizer]');if(!clicked&&link&&event.isTrusted&&(event.type==='click'||event.button===1)){view();clicked=true;send('organizer_click');}};
  if(!isList){document.addEventListener('click',click);document.addEventListener('auxclick',click);}
 }catch{}
})();`;
const reply=status=>new Response(null,{status,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});
export async function discoveryMetrics(request,env){
 const url=new URL(request.url);
 if(url.pathname==='/discovery-metrics.js'&&['GET','HEAD'].includes(request.method))return new Response(request.method==='HEAD'?null:metricsScript,{headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});
 if(url.pathname!=='/discovery-metrics')return null;
 if(request.method!=='POST')return reply(405);
 if(!metricsEnabled(env))return reply(503);
 if(request.headers.get('origin')!==url.origin)return reply(403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply(415);
 if(/bot|crawler|spider|headless/i.test(request.headers.get('user-agent')||'')||request.headers.get('DNT')==='1'||request.headers.get('Sec-GPC')==='1')return reply(204);
 if(env.ENVIRONMENT==='production'){
  const ip=request.headers.get('CF-Connecting-IP');
  if(!env.AUTH_LIMITER||!ip)return reply(503);
  const {success}=await env.AUTH_LIMITER.limit({key:'discovery-metrics:'+ip});
  if(!success)return reply(429);
 }
 // Read a bounded body even if Content-Length is missing or incorrect.
 const reader=request.body?.getReader();if(!reader)return reply(400);
 let chunks=[],size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>512){await reader.cancel();return reply(413);}chunks.push(value);}
 let item;try{const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}item=JSON.parse(new TextDecoder().decode(bytes));}catch{return reply(400);}
 if(!item||typeof item!=='object'||Object.keys(item).some(key=>!['type','path'].includes(key))||!paths.has(item.path))return reply(400);
 const list=item.path==='/texas/events';
 if(!(list?item.type==='discovery_view':['detail_view','organizer_click'].includes(item.type)))return reply(400);
 try{env.DISCOVERY_METRICS.writeDataPoint({indexes:[discoveryPilot.batch],blobs:[item.type,item.path,discoveryPilot.batch],doubles:[1]});return reply(204);}catch{return reply(503);}
}
