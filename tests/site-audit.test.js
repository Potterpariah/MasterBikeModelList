import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import {localEnv} from '../scripts/local-db.js';
const rows=html=>JSON.parse(html.match(/id="event-map-records">([^]*?)<\/script>/)[1]);
test('legacy event map follows list filters and preserves unlocated entries',async(t)=>{
 t.mock.timers.enable({apis:['Date'],now:new Date('2026-10-05T12:00:00Z')});
 const env=localEnv();try{
  const get=async path=>(await worker.fetch(new Request('http://localhost'+path),env)).text();
  const austin=await get('/events?q=Austin');assert.equal(rows(austin).length,1);assert.match(rows(austin)[0].title,/Bikes & Beers Austin/);assert.match(austin,/leaflet.js/);assert.doesNotMatch(austin,/event-start-map-canvas/);
  const empty=await get('/events?q=no-such-place');assert.equal(rows(empty).length,0);assert.match(empty,/0 matching upcoming events/);
  const all=await get('/events');assert.match(all,/Events without a reviewed location remain in the list/);assert.doesNotMatch(all,/Ray Porter Memorial/);
  const slug=env._db.prepare("SELECT slug FROM events WHERE id='event_2026_10_10_ray_porter_memorial_6_hour_endurance_race_and_fundraiser'").get().slug;const detail=await get('/events/'+slug);assert.match(detail,/reported cancelled/);
 }finally{env._db.close();}
});
test('separate category filters keep canonical and original links usable without mixing fundraising into disciplines',async()=>{
 const env=localEnv();try{
  const get=async path=>(await worker.fetch(new Request('http://localhost'+path),env)).text();
  const legacy=await get('/texas/events?discipline=MTB'),canonical=await get('/texas/events?discipline=Mountain%20bike');assert.deepEqual(rows(legacy),rows(canonical));assert.match(legacy,/<option value="MTB" selected>/);
  const html=await get('/events?type=mountain');assert.match(html,/Original category filter: mountain/);assert.match(html,/name="format"/);assert.match(html,/name="purpose"/);
  const discipline=html.match(/<select name="discipline">([^]*?)<\/select>/)[1];assert.doesNotMatch(discipline,/Fundraising|charity|multi-day|fundraiser/);
 }finally{env._db.close();}
});

test('consolidated form preserves former format filters and explains unknown competition status',async()=>{
 const env=localEnv();try{
  const get=async value=>(await worker.fetch(new Request('http://localhost/events?'+new URLSearchParams({format:value})),env)).text();
  const broad=await get('General / social ride');assert.match(broad,/<option value="General \/ social ride" selected>/);assert.match(broad,/does not confirm pace or competitive status/);
  for(const value of ['Noncompetitive ride','Social / community ride']){
   const html=await get(value);assert.ok(html.includes('<option value="'+value+'" selected>'));assert.match(html,/<p role=\"status\">[1-9]\d* matching upcoming events\.<\/p>/);
  }
 }finally{env._db.close();}
});

