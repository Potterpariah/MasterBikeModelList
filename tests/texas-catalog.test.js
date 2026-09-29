import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import {localEnv} from '../scripts/local-db.js';
import {texasCatalogSnapshot,texasEvents,texasCities,texasTrails,cyclingRoutes,routeHighlights} from '../src/texas-cycling-data.js';

const request=(env,path)=>worker.fetch(new Request('https://bike.test'+path),env);

test('Texas Cycling Hub public catalog is preserved as source-attributed, crawlable pages',async()=>{
 const env=localEnv();try{
  assert.deepEqual(texasCatalogSnapshot.records,{events:11,cities:13,trails:7,routes:15,highlights:15});
  assert.equal(texasEvents.length,11);assert.equal(texasCities.length,13);assert.equal(texasTrails.length,7);assert.equal(cyclingRoutes.length,15);assert.equal(routeHighlights.length,15);
  for(const event of texasEvents)assert.equal(new URL(event.sourceUrl).protocol,'https:');
  for(const route of cyclingRoutes)assert.equal(new URL(route.sourceUrl).protocol,'https:');
  const hub=await request(env,'/texas');assert.equal(hub.status,200);assert.equal(hub.headers.get('x-robots-tag'),'noindex, nofollow');assert.match(await hub.text(),/15 sourced routes/);
  const city=await request(env,'/texas/cities/longview');assert.equal(city.status,200);assert.match(await city.text(),/Cargill Long Trail/);
  const trail=await request(env,'/trails/cargill-long-trail');assert.equal(trail.status,200);const trailHtml=await trail.text();assert.match(trailHtml,/generalized from the City of Longview public GIS trail segments/);assert.match(trailHtml,/Official reference/);
  const event=await request(env,'/texas/events/pedal-in-the-pines-2026');assert.equal(event.status,200);assert.match(await event.text(),/2026-11-07/);
 }finally{env._db.close();}
});

test('Texas catalog joins the sitemap only after the existing public-origin indexing gate is enabled',async()=>{
 const env=localEnv();try{
  env.PUBLIC_INDEXING='enabled';env.PUBLIC_ORIGIN='https://bike.test';
  const sitemap=await (await request(env,'/sitemap.xml')).text();
  for(const path of ['/texas','/texas/events','/texas/cities','/texas/cities/longview','/trails','/trails/cargill-long-trail','/texas/events/pedal-in-the-pines-2026'])assert.ok(sitemap.includes(path),path);
  assert.equal((await request(env,'/trails/cargill-long-trail')).headers.get('x-robots-tag'),'index, follow');
 }finally{env._db.close();}
});
