import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import {localEnv} from '../scripts/local-db.js';
import {discoveryPilot,mergeDiscoveryEvents,filterDiscoveryEvents} from '../src/discovery-pilot.js';
import {texasEvents} from '../src/texas-cycling-data.js';
import {discoveryMetrics} from '../src/discovery-metrics.js';
const req=path=>new Request('https://bike.test'+path);
test('pilot has ten complete records; merging refreshes four without duplicating them',()=>{
 const rows=discoveryPilot.events;
 assert.equal(rows.length,discoveryPilot.expectedCount);assert.equal(new Set(rows.map(x=>x.slug)).size,rows.length);
 assert.equal(new Set(rows.map(x=>[x.title.toLowerCase(),x.city,x.rideDate].join('|'))).size,rows.length);
 for(const row of rows){for(const key of ['title','city','county','region','discipline','venue','sourceUrl','checkedAt','rideDate','organizer'])assert.ok(row[key],row.slug+':'+key);assert.equal(row.region,'North');assert.ok(row.rideDate>=row.checkedAt||['completed','cancelled'].includes(row.status));assert.equal(new URL(row.sourceUrl).protocol,'https:');}
 const merged=mergeDiscoveryEvents(texasEvents);const expected=texasEvents.length+rows.filter(e=>!texasEvents.some(old=>old.slug===e.slug)).length;assert.equal(merged.length,expected);assert.equal(new Set(merged.map(x=>x.slug)).size,expected);
 assert.equal(filterDiscoveryEvents(merged,new URLSearchParams('region=North'),'2026-10-02').length,rows.filter(x=>x.rideDate>='2026-10-02'&&!['completed','cancelled'].includes(x.status)).length);
 assert.deepEqual(filterDiscoveryEvents(merged,new URLSearchParams('region=North&discipline=MTB&from=2026-12-01&q=Aubrey'),'2026-10-02').map(x=>x.slug),['rudolphs-revenge-2026']);
 assert.equal(filterDiscoveryEvents(merged,new URLSearchParams('q=no-such-place'),'2026-10-02').length,0);
 assert.ok(filterDiscoveryEvents(merged,new URLSearchParams('discipline=Gravel'),'2026-10-02').some(e=>e.slug==='denton-turkey-roll-2026'));
});
test('pilot pages and links render, disclose discrepancies, and preserve noindex',async()=>{
 const env=localEnv();try{
  for(const event of discoveryPilot.events){const response=await worker.fetch(req('/texas/events/'+event.slug),env);assert.equal(response.status,200,event.slug);assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');const html=await response.text();assert.ok(html.includes('data-official-organizer'));assert.ok(html.includes(event.sourceUrl.replaceAll('&','&amp;')));assert.ok(html.includes(event.checkedAt));assert.ok(html.includes('Details to confirm'));assert.ok(!html.includes('src="/discovery-metrics.js"'));}
  const html=await (await worker.fetch(req('/texas/events?region=North&discipline=MTB'),env)).text();assert.match(html,/Rudolph/);assert.doesNotMatch(html.split('<div class="grid">')[1],/>Tour de Cure/);
  const empty=await (await worker.fetch(req('/texas/events?q=not-a-city'),env)).text();assert.match(empty,/No upcoming events match/);
  const bad=await worker.fetch(req('/texas/events/missing'),env);assert.equal(bad.status,404);
  const ics=await (await worker.fetch(req('/texas/events/denton-turkey-roll-2026/calendar.ics'),env)).text();assert.match(ics,/DTSTART;VALUE=DATE:20261121/);assert.match(ics,/DTEND;VALUE=DATE:20261122/);
 }finally{env._db.close();}
});
const path='/texas/events/'+discoveryPilot.events[0].slug;
const post=(item,headers={})=>new Request('https://bike.test/discovery-metrics',{method:'POST',headers:{origin:'https://bike.test','content-type':'application/json',...headers},body:typeof item==='string'?item:JSON.stringify(item)});
test('measurement collects only allowlisted actions and never stores supplied private fields',async()=>{
 const points=[];const env={DISCOVERY_MEASUREMENT:'enabled',DISCOVERY_METRICS:{writeDataPoint:p=>points.push(p)}};
 assert.equal((await discoveryMetrics(post({type:'detail_view',path}),env)).status,204);
 assert.equal((await discoveryMetrics(post({type:'organizer_click',path}),env)).status,204);
 assert.equal((await discoveryMetrics(post({type:'discovery_view',path:'/texas/events'}),env)).status,204);
 assert.equal(points.length,3);assert.deepEqual(points[0].blobs,['detail_view',path,discoveryPilot.batch]);
 for(const item of [{type:'detail_view',path:'/account'},{type:'organizer_click',path:'/texas/events'},{type:'detail_view',path,email:'private@example.test'}])assert.equal((await discoveryMetrics(post(item),env)).status,400);
 assert.equal((await discoveryMetrics(post('x'.repeat(513)),env)).status,413);
 assert.equal((await discoveryMetrics(post('{}',{origin:'https://other.test'}),env)).status,403);
 assert.equal((await discoveryMetrics(post('{'),env)).status,400);
 assert.equal((await discoveryMetrics(post({type:'detail_view',path},{DNT:'1'}),env)).status,204);assert.equal(points.length,3);
 assert.equal((await discoveryMetrics(post({type:'detail_view',path}),{})).status,503);
 const production={...env,ENVIRONMENT:'production'};assert.equal((await discoveryMetrics(post({type:'detail_view',path}),production)).status,503);
 production.AUTH_LIMITER={limit:async()=>({success:false})};assert.equal((await discoveryMetrics(post({type:'detail_view',path},{'CF-Connecting-IP':'192.0.2.1'}),production)).status,429);
});
