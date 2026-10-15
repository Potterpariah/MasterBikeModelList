import test from 'node:test';
import assert from 'node:assert/strict';
import {refreshEvents,parseOrganizer} from '../scripts/event-refresh.mjs';
const source={id:'organizer-one',eventSlug:'fixture-2026',expectedTitle:'Fixture Ride',url:'https://organizer.example/event',timeZone:'America/Chicago'};
const html=(extra={})=>'<script type="application/ld+json">'+JSON.stringify({'@type':'Event',name:'Fixture Ride',startDate:'2026-11-01',eventStatus:'https://schema.org/EventScheduled',...extra})+'</script>';
const response=body=>new Response(body,{headers:{'content-type':'text/html'}});
const now=new Date('2026-10-03T01:00:00Z');
const run=opts=>refreshEvents({sources:[source],now,sleep:async()=>{},...opts});
test('official candidate preserves provenance and does not certify or overwrite last known good',async()=>{
 const previous={lastKnownGood:[{slug:'fixture-2026',rideDate:'2026-10-31'}]};const out=await run({previous,fetchImpl:async()=>response(html())});
 assert.equal(out.runDate,'2026-10-02');assert.deepEqual(out.lastKnownGood,previous.lastKnownGood);assert.equal(out.candidates[0].verificationStatus,'needs_review');assert.equal(out.candidates[0].sourceHash.length,64);assert.equal(out.candidates[0].startAt,null);
});
test('completed day is idempotent, including Chicago date rollover',async()=>{
 const out=await run({previous:{complete:true,lastRunDate:'2026-10-02'},fetchImpl:()=>{throw Error('must not fetch');}});assert.ok(out.skipped);
});
test('failed source retries boundedly and preserves last known good',async()=>{
 let calls=0;const previous={lastKnownGood:[{slug:'kept'}]};const out=await run({previous,fetchImpl:async()=>{calls++;return new Response('down',{status:503});}});
 assert.equal(calls,3);assert.equal(out.complete,false);assert.deepEqual(out.lastKnownGood,previous.lastKnownGood);
});
test('conflicting official dates are quarantined rather than last-write-wins',async()=>{
 const out=await run({sources:[source,{...source,id:'second',url:'https://organizer.example/second'}],fetchImpl:async url=>response(html({startDate:url.endsWith('second')?'2026-11-02':'2026-11-01'}))});assert.equal(out.candidates.length,0);assert.equal(out.quarantine[0].reason,'official source conflict');
});
test('cancellation is explicit, contradictory postponement notice quarantined',async()=>{
 assert.equal(parseOrganizer(html({eventStatus:'https://schema.org/EventCancelled'}),source,now.toISOString()).status,'cancelled');
 const out=await run({fetchImpl:async()=>response(html()+'<p>Postponed due to flooding; new date TBD.</p>')});assert.equal(out.candidates.length,0);assert.match(out.quarantine[0].reason,/status notice/);
});
test('invalid calendar dates, missing offsets and duplicate identities rejected',()=>{
 for(const extra of [{startDate:'2026-02-30'},{startDate:'2026-11-01T08:00:00'}])assert.throws(()=>parseOrganizer(html(extra),source,now.toISOString()));
 assert.throws(()=>parseOrganizer(html()+html(),source,now.toISOString()),/ambiguous/);
 const result=parseOrganizer(html({startDate:'2026-11-01T08:00:00-06:00',endDate:'2026-11-01T11:00:00-06:00'}),source,now.toISOString());assert.equal(result.startAt,'2026-11-01T08:00:00-06:00');
});
test('non-HTML and oversized sources never replace data',async()=>{
 const bad=await run({fetchImpl:async()=>new Response('{}',{headers:{'content-type':'application/json'}})});assert.equal(bad.complete,false);
 const large=await run({maxBytes:10,fetchImpl:async()=>response(html())});assert.equal(large.complete,false);
});

import {mkdtemp,readFile,readdir,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {runLocalRefresh} from '../scripts/run-event-refresh.mjs';

test('strict timestamps reject normalized invalid clock, offset, mixed range and reverse instant',()=>{
 for(const extra of [
  {startDate:'2026-11-01T24:00:00Z'}, {startDate:'2026-11-01T08:60:00Z'},
  {startDate:'2026-11-01T08:00:60Z'}, {startDate:'2026-11-01T08:00:00+14:01'},
  {startDate:'2026-11-01',endDate:'2026-11-01T09:00:00Z'},
  {startDate:'2026-11-01T09:00:00-06:00',endDate:'2026-11-01T09:30:00-05:00'}
 ])assert.throws(()=>parseOrganizer(html(extra),source,now.toISOString()));
});
test('Retry-After honored, long deferral stops and permanent errors are not retried',async()=>{
 for(const header of ['5',new Date(now.getTime()+5000).toUTCString()]){
  let calls=0;const waits=[];const out=await run({sleep:async ms=>waits.push(ms),fetchImpl:async()=>++calls===1?new Response('',{status:429,headers:{'retry-after':header}}):response(html())});
  assert.equal(out.complete,true);assert.equal(waits[0],5000);assert.equal(calls,2);
 }
 for(const fixture of [{status:429,headers:{'retry-after':'3600'}},{status:404},{headers:{'content-type':'application/json'}}]){
  let calls=0;const out=await run({fetchImpl:async()=>{calls++;return new Response('{}',fixture);}});assert.equal(calls,1);assert.equal(out.complete,false);
 }
});
test('network errors use bounded exponential backoff',async()=>{
 const waits=[];let calls=0;await run({sleep:async ms=>waits.push(ms),fetchImpl:async()=>{calls++;throw new TypeError('network unavailable');}});
 assert.equal(calls,3);assert.deepEqual(waits,[1000,2000]);
});
test('Texas Gravel Champs Oct2 postponement notice quarantines stale scheduled structured data',async()=>{
 // Organizer evidence: https://www.bikesignup.com/Race/TX/Whitney/TexasGravelChamps2026
 const out=await run({fetchImpl:async()=>response(html({startDate:'2026-10-04'})+'<p>October 2 update: postponed due to flooding. Makeup date TBD.</p>')});
 assert.equal(out.candidates.length,0);assert.match(out.quarantine[0].reason,/status notice/);
});
test('exclusive runner lock blocks concurrency and successful day retry creates no duplicate report',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'event-refresh-'));let release,entered;
 const gate=new Promise(r=>release=r),started=new Promise(r=>entered=r);
 const opts={registry:{sources:[source],timeZone:'America/Chicago'},outputPath:dir,now,sleep:async()=>{}};
 try{
  const first=runLocalRefresh({...opts,fetchImpl:async()=>{entered();await gate;return response(html());}});
  await started;await assert.rejects(runLocalRefresh(opts),/already running/);release();await first;
  const second=await runLocalRefresh({...opts,fetchImpl:()=>{throw Error('must not fetch');}});assert.ok(second.skipped);
  const names=await readdir(dir);assert.equal(names.filter(n=>n.startsWith('run-')).length,1);assert.ok(!names.includes('refresh.lock'));
 }finally{release?.();await rm(dir,{recursive:true,force:true});}
});
test('runner releases lock and preserves prior bytes on validation or malformed-state failure',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'event-refresh-'));
 try{
  for(const original of ['{bad',JSON.stringify({lastKnownGood:[{slug:'preserve'}]})]){
   await writeFile(join(dir,'state.json'),original);
   await assert.rejects(runLocalRefresh({registry:{sources:[{...source,url:'http://unsafe.example'}]},outputPath:dir,now}));
   assert.equal(await readFile(join(dir,'state.json'),'utf8'),original);assert.ok(!(await readdir(dir)).includes('refresh.lock'));
  }
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('failed day can retry while preserving independent last-known-good copy',async()=>{
 const previous={lastKnownGood:[{slug:'kept'}]};
 const failed=await run({previous,fetchImpl:async()=>new Response('',{status:404})});
 failed.lastKnownGood[0].slug='copy';assert.equal(previous.lastKnownGood[0].slug,'kept');
 const retried=await run({previous:failed,fetchImpl:async()=>response(html())});assert.equal(retried.complete,true);assert.ok(!retried.skipped);
});

test('next Chicago day refreshes once despite UTC date already rolling over',async()=>{
 let calls=0;const fetchImpl=async()=>{calls++;return response(html());};
 const first=await run({fetchImpl});
 const same=await run({previous:first,now:new Date('2026-10-03T04:59:00Z'),fetchImpl});assert.ok(same.skipped);
 const next=await run({previous:first,now:new Date('2026-10-03T05:00:00Z'),fetchImpl});assert.equal(next.runDate,'2026-10-03');assert.equal(calls,2);
});

test('UTC timestamps normalize to Chicago calendar dates while date-only stays unchanged',()=>{
 const result=parseOrganizer(html({startDate:'2026-07-02T02:00:00Z',endDate:'2026-07-02T06:00:00Z'}),source,now.toISOString());
 assert.equal(result.rideDate,'2026-07-01');assert.equal(result.rideEndDate,'2026-07-02');assert.equal(result.startAt,'2026-07-02T02:00:00Z');
 assert.equal(parseOrganizer(html({startDate:'2026-07-02'}),source,now.toISOString()).rideDate,'2026-07-02');
});
test('Chicago DST offsets match actual instant including repeated fall hour',()=>{
 for(const startDate of ['2026-07-01T08:00:00-05:00','2026-12-01T08:00:00-06:00','2026-11-01T01:30:00-05:00','2026-11-01T01:30:00-06:00','2026-03-08T03:00:00-05:00']){
  assert.equal(parseOrganizer(html({startDate}),source,now.toISOString()).startAt,startDate);
 }
 for(const startDate of ['2026-07-01T08:00:00-06:00','2026-12-01T08:00:00-05:00','2026-03-08T02:30:00-06:00']){
  assert.throws(()=>parseOrganizer(html({startDate}),source,now.toISOString()),/offset conflicts/);
 }
});
test('incorrect organizer DST offset quarantines candidate without changing last known good',async()=>{
 const previous={lastKnownGood:[{slug:'kept'}]};
 const out=await run({previous,fetchImpl:async()=>response(html({startDate:'2026-07-01T08:00:00-06:00'}))});
 assert.equal(out.candidates.length,0);assert.match(out.quarantine[0].reason,/offset conflicts/);assert.deepEqual(out.lastKnownGood,previous.lastKnownGood);
});
