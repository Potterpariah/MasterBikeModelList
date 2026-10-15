import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import {localEnv} from '../scripts/local-db.js';
import {mapRecords} from '../src/interactive-event-map.js';
import {mergeDiscoveryEvents} from '../src/discovery-pilot.js';
import {texasEvents} from '../src/texas-cycling-data.js';
import {editEvent} from '../src/editorial.js';
test('map includes catalog and legacy starts once, excludes cancelled events, and labels approximate locations',async()=>{
 const env=localEnv();try{const legacy=(await env.DB.prepare('SELECT * FROM events').all()).results.map(editEvent),records=mapRecords(mergeDiscoveryEvents(texasEvents),legacy);
 assert.ok(records.length>=17);assert.ok(!records.some(r=>/Ray Porter/i.test(r.title)));assert.equal(records.filter(r=>/Rudolph/i.test(r.title)).length,1);assert.equal(records.filter(r=>/Pedal in the Pines/i.test(r.title)).length,1);
 for(const r of records){assert.ok(r.lat>25&&r.lat<37&&r.lng>-107&&r.lng<-93);assert.ok(r.source);assert.ok(r.label.includes('not confirmed')||r.label.includes('unconfirmed'));}
 const fallback=records.find(r=>r.slug==='bike-around-the-bay-2026');assert.equal(fallback.precision,'area');
 const get=async p=>await worker.fetch(new Request('http://localhost'+p),env);
 const html=await(await get('/texas/events?region=North')).text();assert.match(html,/class="logo"[^]*?<svg/);assert.match(html,/data-event-location="camp-spinistry-bikepacking-2026"/);
 const detail=await(await get('/texas/events/camp-spinistry-bikepacking-2026')).text();assert.doesNotMatch(detail,/<dd>[^<]/);assert.doesNotMatch(detail,/<a data-official-organizer[^>]*target=/);
 for(const path of ['/event-map.js','/leaflet.js','/event-map.css']){const r=await get(path);assert.equal(r.status,200);assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');}
 }finally{env._db.close();}
});
