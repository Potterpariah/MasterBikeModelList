import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import {localEnv} from '../scripts/local-db.js';
import {readyEvent,reviewedEvents,reviewedGuides,starterEventIds} from '../src/publication-data.js';
import {modelEnrichment} from '../src/model-data.js';
const request=(env,path)=>worker.fetch(new Request('https://bike.test'+path),env);
test('review windows expire deterministically and never select incomplete or past events',()=>{
 const e=reviewedEvents[starterEventIds[0]];
 assert.equal(readyEvent(e,'2026-09-18'),true);
 assert.equal(readyEvent(e,'2026-10-03'),false);
 assert.equal(readyEvent({...e,recheck_by:'2026-12-01'},'2026-10-04'),false);
 assert.equal(readyEvent({...e,publication_ready:false},'2026-09-18'),false);
 for(const [id,x] of Object.entries(reviewedEvents)){assert.ok(x.review_sources.every(u=>new URL(u).protocol==='https:'));assert.ok(x.reviewed_fields.length);assert.ok(x.publication_ready||x.publication_gaps.length,id);}
});
test('reviewed guides expose scope, preparation, technical additions and linked primary sources',async()=>{
 const env=localEnv();try{const before=env._db.prepare('SELECT * FROM guides').all();
 for(const slug of Object.keys(reviewedGuides)){const r=await request(env,'/guides/'+slug);const h=await r.text();assert.equal(r.status,200);assert.match(h,/Before you start/);assert.match(h,/Reference-based technical review/);assert.match(h,/Technical references checked 2026-09-18/);assert.ok(h.indexOf('Before you start')<h.indexOf('<h2>1.'));}
 const flat=await (await request(env,'/guides/fix-a-flat')).text();assert.match(flat,/do not pull the brake lever while the wheel is out/);assert.match(flat,/Reconnect any rim-brake release/);assert.match(flat,/tire and rim makers/);
 const eventWeek=await (await request(env,'/guides/event-week-bike-prep-checklist')).text();assert.match(eventWeek,/Equipment checklist — inspect before you pack/);assert.match(eventWeek,/Bike-type maintenance baseline/);assert.match(eventWeek,/Travel and location checklist/);assert.match(eventWeek,/Event-mode checklist/);assert.match(eventWeek,/manufacturer service intervals/);assert.match(eventWeek,/type="checkbox"/);
 assert.deepEqual(env._db.prepare('SELECT * FROM guides').all(),before);
 }finally{env._db.close();}
});
test('event API and HTML use revised distances and disclose missing data without rewriting seed records',async()=>{
 const env=localEnv();try{const before=env._db.prepare('SELECT * FROM events').all();
 const pure=await (await request(env,'/api/events/event_2026_10_03_sloan_everett_pure_country_pedal_memorial_bike_ride')).json();assert.deepEqual(pure.event.distances,[4.22,7.79,18.73,31.62,59.07]);assert.equal(pure.event.address,null);
 const bonham=await (await request(env,'/api/events/event_2026_10_03_autumn_in_bonham_century_mile_ride')).json();assert.deepEqual(bonham.event.distances,[30,40,65,100,47,67]);assert.equal(bonham.event.publication_ready,false);
 const camp=await (await request(env,'/api/events/'+starterEventIds[1])).json();assert.deepEqual(camp.event.distances,[]);assert.match(camp.event.notes,/approximately 30 or 60/);
 const h=await (await request(env,'/events/'+pure.event.slug)).text();assert.match(h,/Still to confirm/);assert.match(h,/purecountrypedal.com\/faqs/);assert.ok(!h.includes('"@type":"SportsEvent"'));
 assert.deepEqual(env._db.prepare('SELECT * FROM events').all(),before);
 }finally{env._db.close();}
});
test('curated hub and sitemap distinguish reviewed content from unresolved event records',async()=>{
 const env=localEnv();try{env.PUBLIC_INDEXING='enabled';env.PUBLIC_ORIGIN='https://bike.test';
 const hub=await (await request(env,'/texas-rides')).text();assert.match(hub,/Prepare your bike/);assert.match(hub,/pre-ride-bike-safety-check/);assert.ok(!hub.includes('Missions Tour de Goliad'));
 const map=await (await request(env,'/sitemap.xml')).text();assert.match(map,/\/texas-rides/);assert.match(map,/\/guides\/event-week-bike-prep-checklist/);assert.ok(!map.includes('autumn-in-bonham'));assert.ok(!map.includes('missions-tour-de-goliad'));
 assert.equal((await request(env,'/texas-rides/missing')).status,404);
 }finally{env._db.close();}
});
test('model conflict review scopes gear options and withholds disputed dimensions and clearance',()=>{
 const brompton=modelEnrichment.find(m=>m.model_id==='model_brompton_c_line');assert.match(brompton.resolution_note,/resolved by scope/);assert.ok(!brompton.facts.some(f=>f.label==='Folded dimensions'));assert.equal(brompton.unknowns.family_folded_dimensions,null);
 const defy=modelEnrichment.find(m=>m.model_id==='model_giant_defy');assert.equal(defy.unknowns.maximum_tire_clearance_mm,null);assert.equal(defy.conflicts[0].resolution,null);assert.ok(defy.review_sources.some(u=>u.endsWith('/us/defy-advanced-1-2025')));
});
