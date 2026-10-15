import {createHash,randomUUID} from 'node:crypto';
import {readFile,writeFile,open,rename,unlink} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {pathToFileURL} from 'node:url';

export const sha256=value=>createHash('sha256').update(value).digest('hex');
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const nonempty=v=>typeof v==='string'&&v.trim().length>0;
const validDate=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+'T00:00:00Z'))&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;
const allowed=new Set(['rideDate','rideEndDate','status']);
const statuses=new Set(['scheduled','cancelled','postponed','rescheduled','online']);
function keys(value,expected,label){if(!object(value)||Object.keys(value).some(k=>!expected.includes(k)))throw Error('unknown or invalid '+label+' fields');}
function requireValue(condition,message){if(!condition)throw Error(message);}

export function prepareReview(original,report,manifest){
 keys(manifest,['expectedOriginalSha256','decisions'],'manifest');
 requireValue(manifest.expectedOriginalSha256===sha256(original),'stale original content hash');
 requireValue(Array.isArray(manifest.decisions),'missing decisions');
 requireValue(object(report)&&Array.isArray(report.candidates)&&Array.isArray(report.quarantine),'invalid refresh report');
 const data=JSON.parse(original.toString('utf8'));
 requireValue(object(data)&&Array.isArray(data.events),'expected discovery object with events');
 const changed=structuredClone(data),changes=[],seen=new Set();
 for(const decision of manifest.decisions){
  keys(decision,['slug','sourceUrl','sourceHash','reviewer','reason','fields','explicitFields'],'decision');
  for(const key of ['slug','sourceUrl','sourceHash','reviewer','reason'])requireValue(nonempty(decision[key]),'missing '+key);
  requireValue(/^[a-f0-9]{64}$/.test(decision.sourceHash),'invalid source hash');
  requireValue(!seen.has(decision.slug),'duplicate decision slug');seen.add(decision.slug);
  requireValue(object(decision.fields)&&Object.keys(decision.fields).length>0,'missing selected fields');
  requireValue(Object.keys(decision.fields).every(k=>allowed.has(k)),'only date/status fields allowed');
  requireValue(Array.isArray(decision.explicitFields)&&decision.explicitFields.length===Object.keys(decision.fields).length&&new Set(decision.explicitFields).size===decision.explicitFields.length&&decision.explicitFields.every(k=>Object.hasOwn(decision.fields,k)),'explicit evidence attestation required for every selected field');
  requireValue(!report.quarantine.some(q=>q.eventSlug===decision.slug||q.slug===decision.slug||q.sourceUrl===decision.sourceUrl||q.sources?.includes(decision.sourceUrl)),'quarantined event');
  const rows=changed.events.filter(e=>e.slug===decision.slug),candidates=report.candidates.filter(e=>e.slug===decision.slug);
  requireValue(rows.length===1&&candidates.length===1,'missing or ambiguous event identity');
  const row=rows[0],candidate=candidates[0];
  requireValue(row.sourceUrl===decision.sourceUrl&&candidate.sourceUrl===decision.sourceUrl,'changed source identity');
  requireValue(candidate.sourceHash===decision.sourceHash,'stale source hash');
  requireValue(!candidate.quarantined&&candidate.verificationStatus==='needs_review','candidate is not reviewable');
  const before={},after={};
  for(const [field,value] of Object.entries(decision.fields)){
   requireValue(Object.hasOwn(candidate,field)&&candidate[field]===value,'selected value differs from source candidate');
   requireValue(object(candidate.fieldEvidence)&&nonempty(candidate.fieldEvidence[field]),'missing direct field evidence');
   requireValue(!candidate.inferredFields?.includes(field)&&!(field!=='status'&&candidate.dateInferred),'inferred field cannot be applied');
   requireValue(field==='status'?statuses.has(value):validDate(value),'invalid date or status');
   if(row[field]!==value){before[field]=row[field]??null;after[field]=value;row[field]=value;}
  }
  if(row.rideEndDate!==undefined)requireValue(validDate(row.rideDate)&&validDate(row.rideEndDate)&&row.rideEndDate>=row.rideDate,'invalid final date range');
  if(Object.keys(after).length)changes.push({slug:decision.slug,before,after,sourceUrl:decision.sourceUrl,sourceHash:decision.sourceHash,reviewer:decision.reviewer,reason:decision.reason,explicitFields:decision.explicitFields});
 }
 return {changes,originalSha256:sha256(original),next:changes.length?Buffer.from(JSON.stringify(changed,null,2)+'\n'):original};
}

export async function reviewRefresh({dataPath,report,manifest,apply=false}){
 const target=resolve(dataPath),lockPath=target+'.review.lock';let lock,temporary;
 if(apply){try{lock=await open(lockPath,'wx');}catch(e){if(e.code==='EEXIST')throw Error('Review already running or interrupted lock requires review');throw e;}}
 try{
  const original=await readFile(target),plan=prepareReview(original,report,manifest);
  const result={mode:apply?'apply':'dry-run',originalSha256:plan.originalSha256,resultSha256:sha256(plan.next),changes:plan.changes};
  if(!apply||!plan.changes.length)return result;
  const id=randomUUID(),backupPath=target+'.before-review-'+id+'.bak',auditPath=target+'.review-'+id+'.json';
  await writeFile(backupPath,original,{flag:'wx'});
  // Evidence records proposed content; the final target hash determines whether it was installed.
  await writeFile(auditPath,JSON.stringify({...result,recordedAt:new Date().toISOString(),backupPath},null,2)+'\n',{flag:'wx'});
  temporary=join(dirname(target),'.review-'+id+'.tmp');await writeFile(temporary,plan.next,{flag:'wx'});
  requireValue(sha256(await readFile(target))===plan.originalSha256,'concurrent edit detected before replacement');
  await rename(temporary,target);temporary=undefined;
  return {...result,backupPath,auditPath};
 }finally{
  try{if(temporary)await unlink(temporary).catch(e=>{if(e.code!=='ENOENT')throw e;});}
  finally{if(lock){try{await lock.close();}finally{await unlink(lockPath);}}}
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const args=process.argv.slice(2),apply=args.includes('--apply'),paths=args.filter(a=>a!=='--apply');
 if(paths.length!==3||args.filter(a=>a==='--apply').length>1||paths.some(a=>a.startsWith('--')))throw Error('Usage: node scripts/review-event-refresh.mjs <discovery.json> <report.json> <decisions.json> [--apply]');
 const [dataPath,reportPath,manifestPath]=paths;
 console.log(JSON.stringify(await reviewRefresh({dataPath,report:JSON.parse(await readFile(reportPath,'utf8')),manifest:JSON.parse(await readFile(manifestPath,'utf8')),apply}),null,2));
}
