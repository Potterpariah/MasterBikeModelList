import {createHash} from 'node:crypto';
const hash=value=>createHash('sha256').update(value).digest('hex');
const day=(now,timeZone)=>new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
const norm=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
const date=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
function timestamp(value,timeZone){
 if(date(value))return {day:value,instant:null};
 const m=/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(Z|([+-])(\d{2}):(\d{2}))$/.exec(value);
 if(!m||!date(m[1])||+m[2]>23||+m[3]>59||+(m[4]||0)>59||+(m[7]||0)>14||+(m[8]||0)>59||(+m[7]===14&&+m[8]!==0)||!Number.isFinite(Date.parse(value)))throw Error('invalid timestamp or missing explicit offset');
 const instant=Date.parse(value),at=new Date(instant);
 if(m[5]!=='Z'){
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(at).map(p=>[p.type,p.value]));
  const wall=`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
  if(wall!==`${m[1]}T${m[2]}:${m[3]}:${m[4]||'00'}`)throw Error('timestamp offset conflicts with source timezone');
 }
 return {day:day(at,timeZone),instant};
}
function retryDelay(value,now){
 if(!value)return 0;
 const ms=/^\d+$/.test(value)?Number(value)*1000:Date.parse(value)-now.getTime();
 return Number.isFinite(ms)?Math.max(0,ms):0;
}
function eventsIn(value){if(Array.isArray(value))return value.flatMap(eventsIn);if(!value||typeof value!=='object')return [];return [...([].concat(value['@type']||[]).some(t=>['Event','SportsEvent'].includes(t))?[value]:[]),...Object.values(value).filter(v=>typeof v==='object').flatMap(eventsIn)];}
export function parseOrganizer(html,source,retrievedAt){
 const nodes=[];for(const match of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi)){try{nodes.push(...eventsIn(JSON.parse(match[1])));}catch{throw Error('invalid JSON-LD');}}
 const matches=nodes.filter(e=>e.startDate&&norm(e.name)===norm(source.expectedTitle));if(matches.length!==1)throw Error(matches.length?'ambiguous event identity':'no exact event identity');
 const e=matches[0],start=String(e.startDate||''),end=String(e.endDate||start);
 const a=timestamp(start,source.timeZone),b=timestamp(end,source.timeZone),startDay=a.day,endDay=b.day;
 if((a.instant===null)!==(b.instant===null)||endDay<startDay||(a.instant!==null&&b.instant<a.instant))throw Error('invalid date range');
 if(source.expectedYear&&startDay.slice(0,4)!==String(source.expectedYear))throw Error('source year differs from approved occurrence');
 const states={EventScheduled:'scheduled',EventCancelled:'cancelled',EventPostponed:'postponed',EventRescheduled:'rescheduled',EventMovedOnline:'online'};
 const status=e.eventStatus?states[String(e.eventStatus).split('/').pop()]:'unknown';if(!status)throw Error('unknown event status');
 if(/\b(?:postponed|cancelled|canceled|flood)\b/i.test(html)&&!['cancelled','postponed'].includes(status))throw Error('status notice requires review');
 return {slug:source.eventSlug,title:e.name,rideDate:startDay,rideEndDate:e.endDate?endDay:null,startAt:start.length>10?start:null,endAt:e.endDate&&end.length>10?end:null,timeZone:source.timeZone,status,sourceUrl:source.url,retrievedAt,sourceHash:hash(html),verificationStatus:'needs_review',fieldEvidence:{rideDate:'jsonld.startDate',rideEndDate:e.endDate?'jsonld.endDate':null,status:e.eventStatus?'jsonld.eventStatus':null},inferredFields:[...(!e.endDate?['rideEndDate']:[]),...(!e.eventStatus?['status']:[])]};
}
export async function refreshEvents({sources,previous={},now=new Date(),timeZone='America/Chicago',fetchImpl=fetch,sleep=ms=>new Promise(r=>setTimeout(r,ms)),timeoutMs=12000,maxBytes=2000000,maxRetryDelayMs=60000}){
 const runDate=day(now,timeZone);if(previous.lastRunDate===runDate&&previous.complete)return {...previous,skipped:'already completed local day'};
 const report={runDate,startedAt:now.toISOString(),timeZone,outcomes:[],quarantine:[],candidates:[],lastKnownGood:structuredClone(previous.lastKnownGood||[]),complete:true};
 const ids=new Set();for(const s of sources){const u=new URL(s.url);if(u.protocol!=='https:'||u.username||u.password||!s.id||!s.eventSlug||!s.expectedTitle||ids.has(s.id))throw Error('invalid source registry');ids.add(s.id);new Intl.DateTimeFormat('en-US',{timeZone:s.timeZone});}
 for(const source of sources){if(source.enabled===false){report.outcomes.push({sourceId:source.id,status:'disabled',reason:source.disabledReason||'adapter not accepted'});continue;}let html,error;
  for(let attempt=0;attempt<3;attempt++){
   try{
    const response=await fetchImpl(source.url,{redirect:'error',signal:AbortSignal.timeout(timeoutMs),headers:{Accept:'text/html','User-Agent':'BikePortal-EventReview/1.0'}});
    if(!response.ok){const e=Error('HTTP '+response.status);e.retry=response.status===429||response.status>=500;e.retryAfter=retryDelay(response.headers.get('retry-after'),now);throw e;}
    if(!/text\/html|application\/xhtml\+xml/i.test(response.headers.get('content-type')||''))throw Object.assign(Error('unexpected source content type'),{retry:false});
    if(Number(response.headers.get('content-length'))>maxBytes)throw Object.assign(Error('source too large'),{retry:false});
    const reader=response.body.getReader(),chunks=[];let size=0;try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>maxBytes)throw Object.assign(Error('source too large'),{retry:false});chunks.push(value);}}finally{await reader.cancel();}
    html=Buffer.concat(chunks).toString('utf8');error=null;break;
   }catch(e){error=e;if(e.retry===false||attempt===2||e.retryAfter>maxRetryDelayMs)break;await sleep(Math.max(1000*2**attempt,e.retryAfter||0));}
  }
  if(error){report.complete=false;report.outcomes.push({sourceId:source.id,status:'failed',error:String(error.message),lastKnownGoodPreserved:true});continue;}
  try{const candidate=parseOrganizer(html,source,now.toISOString());report.candidates.push(candidate);report.outcomes.push({sourceId:source.id,status:'review_candidate',sourceHash:candidate.sourceHash});}
  catch(e){report.quarantine.push({sourceId:source.id,eventSlug:source.eventSlug,reason:e.message,sourceHash:hash(html),retrievedAt:now.toISOString()});report.outcomes.push({sourceId:source.id,status:'quarantined'});}
  await sleep(1000);
 }
 const grouped=new Map();for(const c of report.candidates){if(!grouped.has(c.slug))grouped.set(c.slug,[]);grouped.get(c.slug).push(c);}
 for(const [slug,rows] of grouped){const facts=r=>JSON.stringify([r.rideDate,r.rideEndDate,r.startAt,r.endAt,r.status]);if(new Set(rows.map(facts)).size>1){report.quarantine.push({eventSlug:slug,reason:'official source conflict',sources:rows.map(r=>r.sourceUrl)});report.candidates=report.candidates.filter(r=>r.slug!==slug);}else{report.candidates=report.candidates.filter(r=>r.slug!==slug);report.candidates.push({...rows[0],evidence:rows.map(r=>({sourceUrl:r.sourceUrl,sourceHash:r.sourceHash,retrievedAt:r.retrievedAt}))});}}
 return {...report,lastRunDate:runDate};
}
