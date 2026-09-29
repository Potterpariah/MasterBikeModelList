import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import {localEnv} from '../scripts/local-db.js';
import {texasCatalogSnapshot,texasEvents,texasCities,texasTrails,cyclingRoutes,routeHighlights} from '../src/texas-cycling-data.js';
import {texasClubs,texasEventCrosswalk} from '../src/texas-public-features.js';

const request=(env,path)=>worker.fetch(new Request('https://bike.test'+path),env);

test('Texas Cycling Hub public catalog is preserved as source-attributed, crawlable pages',async()=>{
 const env=localEnv();try{
  assert.deepEqual(texasCatalogSnapshot.records,{events:11,cities:12,trails:7,routes:13,highlights:15});
  assert.equal(texasEvents.length,11);assert.equal(texasCities.length,12);assert.equal(texasTrails.length,7);assert.equal(cyclingRoutes.length,13);assert.equal(routeHighlights.length,15);
  for(const event of texasEvents)assert.equal(new URL(event.sourceUrl).protocol,'https:');
  for(const route of cyclingRoutes)assert.equal(new URL(route.sourceUrl).protocol,'https:');
  const hub=await request(env,'/texas');assert.equal(hub.status,200);assert.equal(hub.headers.get('x-robots-tag'),'noindex, nofollow');assert.match(await hub.text(),/13 sourced routes/);
  const city=await request(env,'/texas/cities/canyon');assert.equal(city.status,200);assert.match(await city.text(),/Capitol Peak MTB Loop/);
  const trail=await request(env,'/trails/capitol-peak-mtb-loop');assert.equal(trail.status,200);const trailHtml=await trail.text();assert.match(trailHtml,/reviewed against the current TPWD trail map/);assert.match(trailHtml,/Official reference/);
  const event=await request(env,'/texas/events/pedal-in-the-pines-2026');assert.equal(event.status,200);assert.match(await event.text(),/2026-11-07/);
 }finally{env._db.close();}
});

test('Texas public-only functions expose reviewed clubs, map links, calendar files, and bounded GPX',async()=>{
 const env=localEnv();try{
  assert.equal(texasClubs.length,15);assert.equal(texasEventCrosswalk.length,11);assert.ok(texasEventCrosswalk.some(row=>row.status==='hold_date_conflict'));
  const clubs=await request(env,'/texas/clubs');assert.equal(clubs.status,200);const clubsHtml=await clubs.text();assert.match(clubsHtml,/15 reviewed local organizations/);assert.match(clubsHtml,/Austin Ridge Riders/);
  const club=await request(env,'/texas/clubs/austin-ridge-riders');assert.equal(club.status,200);assert.match(await club.text(),/Visit official club site/);
  const event=await request(env,'/texas/events/park-to-port-bike-ride-2026');const eventHtml=await event.text();assert.match(eventHtml,/Open reviewed location in maps/);assert.match(eventHtml,/Download calendar file/);
  const ics=await request(env,'/texas/events/park-to-port-bike-ride-2026/calendar.ics');assert.equal(ics.headers.get('content-type'),'text/calendar; charset=utf-8');assert.match(await ics.text(),/BEGIN:VCALENDAR/);
  const gpx=await request(env,'/trails/capitol-peak-mtb-loop/route.gpx');assert.equal(gpx.headers.get('content-type'),'application/gpx+xml; charset=utf-8');assert.match(await gpx.text(),/<gpx /);
  assert.equal((await request(env,'/trails/ann-and-roy-butler-trail/route.gpx')).status,404);
 }finally{env._db.close();}
});

test('Texas catalog joins the sitemap only after the existing public-origin indexing gate is enabled',async()=>{
 const env=localEnv();try{
  env.PUBLIC_INDEXING='enabled';env.PUBLIC_ORIGIN='https://bike.test';
  const sitemap=await (await request(env,'/sitemap.xml')).text();
  for(const path of ['/texas','/texas/events','/texas/cities','/texas/cities/canyon','/texas/clubs','/texas/clubs/austin-ridge-riders','/trails','/trails/capitol-peak-mtb-loop','/texas/events/pedal-in-the-pines-2026'])assert.ok(sitemap.includes(path),path);
  assert.equal((await request(env,'/trails/capitol-peak-mtb-loop')).headers.get('x-robots-tag'),'index, follow');
 }finally{env._db.close();}
});
