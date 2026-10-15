import test from 'node:test';
import assert from 'node:assert/strict';
import {localEnv} from '../scripts/local-db.js';
import {modelEnrichment} from '../src/model-data.js';
import worker from '../src/worker.js';
const req=(env,path)=>worker.fetch(new Request('https://bike.test'+path),env);
test('enrichment covers existing identities with scoped sourced facts and explicit unknowns; seed rows remain intact',async()=>{
 const env=localEnv();try{
 const before=env._db.prepare('SELECT * FROM bike_models ORDER BY id').all();
 assert.deepEqual(modelEnrichment.map(x=>x.model_id).sort(),before.map(x=>x.id));
 const catalog=await (await req(env,'/api/portal/catalog')).json();assert.equal(catalog.bikes.length,25);
 for(const b of catalog.bikes){const d=b.enrichment;assert.ok(d.scope&&d.summary&&d.caveat);assert.match(d.reviewed_on,/^\d{4}-\d{2}-\d{2}$/);assert.equal(new URL(d.source_url).protocol,'https:');assert.ok(d.facts.length>=2);assert.ok(d.facts.every(f=>f.label&&f.value));assert.ok(Object.values(d.unknowns).every(x=>x===null));}
 assert.deepEqual(env._db.prepare('SELECT * FROM bike_models ORDER BY id').all(),before);
 }finally{env._db.close();}
});
test('every model has a standalone page, canonical, brand navigation and source scope without invented offers',async()=>{
 const env=localEnv();try{
 const catalog=await (await req(env,'/api/portal/catalog')).json();
 for(const b of catalog.bikes){const r=await req(env,'/bikes/'+b.slug),h=await r.text();assert.equal(r.status,200,b.slug);assert.match(h,/Which version is described/);assert.match(h,/Selected specifications/);assert.ok(h.includes(b.enrichment.reviewed_on));assert.ok(!h.includes('"@type":"Offer"'));assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');const id=await req(env,'/bikes/'+b.id);assert.equal(id.status,308);assert.equal(id.headers.get('location'),'/bikes/'+b.slug);}
 assert.equal((await req(env,'/bikes/missing')).status,404);
 env.PUBLIC_ORIGIN='https://bike.test';env.PUBLIC_INDEXING='enabled';assert.equal((await req(env,'/bikes/domane')).headers.get('x-robots-tag'),'noindex, nofollow');assert.ok(!(await (await req(env,'/sitemap.xml')).text()).includes('/bikes/'));
 }finally{env._db.close();}
});
test('model filters, empty state, source conflicts and generation boundaries are visible',async()=>{
 const env=localEnv();try{
 const h=await (await req(env,'/bikes?q=trek')).text();assert.match(h,/Matching models \(1047\)/);assert.match(h,/Trek/);assert.ok(!h.includes('href="/bikes/domane"'));
 assert.match(await (await req(env,'/bikes?q=zzznomatch')).text(),/No historical models match/);
 for(const slug of ['c-line','defy'])assert.match(await (await req(env,'/bikes/'+slug)).text(),/Unresolved source differences/);
 const domane=await (await req(env,'/bikes/domane')).text();assert.match(domane,/Gen 5/);assert.match(domane,/Not present on Gen 5/);assert.match(domane,/40 mm measured/);
 assert.match(await (await req(env,'/brands/trek')).text(),/href="\/bikes\/domane"/);
 }finally{env._db.close();}
});
test('public content links resolve, including model/guide/event destinations, and malformed sources do not break pages',async()=>{
 const env=localEnv();try{
 env._db.prepare("UPDATE guides SET source_urls_json=? WHERE slug='fix-a-flat'").run(JSON.stringify(['not a url','javascript:alert(1)','https://example.com/']));
 const catalog=await (await req(env,'/api/portal/catalog')).json();
 const paths=['/','/events','/guides','/brands','/bikes','/about','/editorial','/data-use','/community-guidelines',...catalog.guides.map(g=>'/guides/'+g.slug),...catalog.brands.map(b=>'/brands/'+b.slug),...catalog.bikes.map(b=>'/bikes/'+b.slug),...env._db.prepare('SELECT slug FROM events').all().map(e=>'/events/'+e.slug)];
 const targets=new Set();for(const p of paths){const r=await req(env,p);assert.equal(r.status,200,p);const h=await r.text();assert.ok(!h.includes('href="javascript:'));for(const m of h.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g))targets.add(m[1]);}
 for(const target of targets)assert.ok([200,308].includes((await req(env,target)).status),target);
 }finally{env._db.close();}
});
