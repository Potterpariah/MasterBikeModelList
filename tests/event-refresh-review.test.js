import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareReview,reviewRefresh,sha256} from '../scripts/review-event-refresh.mjs';
const data={batch:'fixture',events:[{slug:'ride',sourceUrl:'https://official.example/ride',rideDate:'2026-10-04',status:'scheduled',verifiedAt:'old',custom:{keep:true}},{slug:'other',untouched:42}]};
const original=Buffer.from(JSON.stringify(data));
const candidate={slug:'ride',sourceUrl:'https://official.example/ride',sourceHash:'a'.repeat(64),rideDate:'2026-10-11',status:'postponed',verificationStatus:'needs_review',fieldEvidence:{rideDate:'jsonld.startDate',status:'jsonld.eventStatus'}};
const report=()=>({candidates:[structuredClone(candidate)],quarantine:[]});
const manifest=()=>({expectedOriginalSha256:sha256(original),decisions:[{slug:'ride',sourceUrl:candidate.sourceUrl,sourceHash:candidate.sourceHash,reviewer:'Fixture reviewer',reason:'Explicit organizer correction inspected',fields:{rideDate:'2026-10-11',status:'postponed'},explicitFields:['rideDate','status']}]});
async function fixture(fn){const dir=await mkdtemp(join(tmpdir(),'review-events-')),dataPath=join(dir,'discovery.json');try{await writeFile(dataPath,original);await fn({dir,dataPath});}finally{await rm(dir,{recursive:true,force:true});}}

test('default dry run leaves original bytes and directory untouched',async()=>fixture(async({dir,dataPath})=>{
 const out=await reviewRefresh({dataPath,report:report(),manifest:manifest()});assert.equal(out.mode,'dry-run');assert.equal(out.changes.length,1);assert.deepEqual(await readFile(dataPath),original);assert.deepEqual(await readdir(dir),['discovery.json']);
}));
test('explicit fixture apply preserves unrelated content, exact backup and audit',async()=>fixture(async({dir,dataPath})=>{
 const out=await reviewRefresh({dataPath,report:report(),manifest:manifest(),apply:true});
 const after=JSON.parse(await readFile(dataPath));assert.equal(after.events[0].rideDate,'2026-10-11');assert.equal(after.events[0].status,'postponed');assert.equal(after.events[0].verifiedAt,'old');assert.deepEqual(after.events[0].custom,data.events[0].custom);assert.deepEqual(after.events[1],data.events[1]);assert.equal(after.batch,'fixture');
 assert.deepEqual(await readFile(out.backupPath),original);assert.equal(JSON.parse(await readFile(out.auditPath)).resultSha256,sha256(await readFile(dataPath)));assert.ok(!(await readdir(dir)).includes('discovery.json.review.lock'));
}));
test('no-op apply leaves bytes unchanged and creates no backup or audit',async()=>fixture(async({dir,dataPath})=>{
 const m=manifest();m.decisions=[];const out=await reviewRefresh({dataPath,report:report(),manifest:m,apply:true});assert.equal(out.changes.length,0);assert.deepEqual(await readFile(dataPath),original);assert.deepEqual(await readdir(dir),['discovery.json']);
}));
test('stale state/source hashes, changed source identity and quarantined candidates reject',()=>{
 const cases=[
  [r=>{},m=>m.expectedOriginalSha256='b'.repeat(64),/stale original/],
  [r=>{},m=>m.decisions[0].sourceHash='b'.repeat(64),/stale source/],
  [r=>r.candidates[0].sourceUrl='https://changed.example',m=>{},/source identity/],
  [r=>r.quarantine.push({eventSlug:'ride'}),m=>{},/quarantined/],
  [r=>r.candidates.push({...candidate}),m=>{},/ambiguous/]
 ];
 for(const [editReport,editManifest,error] of cases){const r=report(),m=manifest();editReport(r);editManifest(m);assert.throws(()=>prepareReview(original,r,m),error);}
});
test('unknown/missing fields, missing reviewer and inferred dates reject',()=>{
 for(const alter of [m=>m.decisions[0].fields.verifiedAt='today',m=>delete m.decisions[0].reviewer,m=>m.decisions[0].extra=true,m=>m.decisions[0].explicitFields=[],m=>m.decisions[0].fields={},m=>m.unexpected=true]){
  const m=manifest();alter(m);assert.throws(()=>prepareReview(original,report(),m));
 }
 for(const flag of [{dateInferred:true},{inferredFields:['rideDate']}])assert.throws(()=>prepareReview(original,{candidates:[{...candidate,...flag}],quarantine:[]},manifest()),/inferred/);
});
test('invalid dates/status and selected values not in evidence reject',()=>{
 for(const [field,value] of [['rideDate','2026-02-30'],['status','verified'],['status','unknown']]){
  const r=report(),m=manifest();r.candidates[0][field]=value;m.decisions[0].fields[field]=value;assert.throws(()=>prepareReview(original,r,m),/invalid date or status/);
 }
 const m=manifest();m.decisions[0].fields.rideDate='2026-10-12';assert.throws(()=>prepareReview(original,report(),m),/differs/);
});
test('exclusive lock blocks apply and failed validation leaves original intact',async()=>fixture(async({dir,dataPath})=>{
 await writeFile(dataPath+'.review.lock','fixture active lock');await assert.rejects(reviewRefresh({dataPath,report:report(),manifest:manifest(),apply:true}),/already running/);await rm(dataPath+'.review.lock');
 const m=manifest();m.expectedOriginalSha256='b'.repeat(64);await assert.rejects(reviewRefresh({dataPath,report:report(),manifest:m,apply:true}),/stale original/);assert.deepEqual(await readFile(dataPath),original);assert.deepEqual(await readdir(dir),['discovery.json']);
}));

test('missing field evidence and unconfirmed null end date cannot be approved',()=>{
 const r=report();r.candidates[0].fieldEvidence.status=null;assert.throws(()=>prepareReview(original,r,manifest()),/field evidence/);
 const m=manifest();m.decisions[0].fields={rideEndDate:null};m.decisions[0].explicitFields=['rideEndDate'];const missing=report();missing.candidates[0].rideEndDate=null;assert.throws(()=>prepareReview(original,missing,m),/field evidence/);
});
