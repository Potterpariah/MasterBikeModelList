import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import {localEnv} from '../scripts/local-db.js';
import {discoveryPilot,filterDiscoveryEvents} from '../src/discovery-pilot.js';
test('ongoing multi-day rides remain discoverable; postponed dates are withheld',()=>{
 const base={title:'Fixture',city:'Austin',county:'Travis',rideDate:'2026-10-01',rideEndDate:'2026-10-03',status:'scheduled',rideType:'Road'};
 assert.equal(filterDiscoveryEvents([base],new URLSearchParams(),'2026-10-02').length,1);
 assert.equal(filterDiscoveryEvents([{...base,status:'postponed'}],new URLSearchParams(),'2026-10-02').length,0);
});
test('calendar cancellation/completion semantics and date uncertainty',async()=>{
 const row=discoveryPilot.events[0],saved={...row},env=localEnv();
 try{
  const get=()=>worker.fetch(new Request('http://localhost/texas/events/'+row.slug+'/calendar.ics'),env);
  row.status='cancelled';let r=await get();assert.equal(r.status,200);assert.match(await r.text(),/STATUS:CANCELLED/);
  row.status='completed';r=await get();assert.match(await r.text(),/STATUS:CONFIRMED/);
  row.status='postponed';assert.equal((await get()).status,409);
  row.status='scheduled';row.rideDate='2026-02-30';assert.equal((await get()).status,409);
 }finally{Object.assign(row,saved);env._db.close();}
});

test('curated list map follows filters including empty results',async()=>{
 const env=localEnv();try{for(const [query,count] of [['region=North&discipline=MTB',1],['q=no-such-place',0]]){
  const r=await worker.fetch(new Request('http://localhost/texas/events?'+query),env);const html=await r.text();
  const rows=JSON.parse(html.match(/id="event-map-records">([^]*?)<\/script>/)[1]);assert.equal(rows.length,count);
 }}finally{env._db.close();}
});
