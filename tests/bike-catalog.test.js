import test from 'node:test';
import assert from 'node:assert/strict';
import {localEnv} from '../scripts/local-db.js';
import worker from '../src/worker.js';
import {bikeCatalog,canonicalId,slugify,validateRecord} from '../src/bike-catalog.js';
const req=(env,path)=>worker.fetch(new Request('https://bike.test'+path),env);

test('canonical catalog keeps provenance, null unknowns, electric fields and a review-only conflict',()=>{
 assert.equal(slugify('Trek Bicycle'), 'trek-bicycle');
 assert.equal(canonicalId({manufacturer:'Trek',model_family:'Fuel EX',model_year:2023,model:'Fuel EX 9.8 XT Gen 6'}),'bike:trek:fuel-ex:2023:fuel-ex-9-8-xt-gen-6');
 assert.equal(bikeCatalog.records.length,2);
 for(const record of bikeCatalog.records){assert.deepEqual(validateRecord(record),[]);assert.match(record.content_source_hash,/^fnv1a-32:/);assert.equal(record.retrieval_date,'2026-09-29');assert.ok(Array.isArray(record.change_history));}
 const conventional=bikeCatalog.records.find(record=>!record.is_electric),electric=bikeCatalog.records.find(record=>record.is_electric);
 assert.equal(conventional.weight,null);assert.equal(conventional.electric,null);assert.equal(electric.electric.battery_capacity_wh,360);assert.equal(electric.electric.throttle,null);
 assert.equal(bikeCatalog.conflicts.length,1);assert.equal(bikeCatalog.conflicts[0].status,'review');assert.match(bikeCatalog.conflicts[0].note,/not public canonical/i);
});

test('hierarchy pages work without changing existing model URLs or indexability',async()=>{
 const env=localEnv();try{
  for(const path of ['/bikes/trek','/bikes/trek/mountain','/bikes/trek/fuel-ex','/bikes/trek/fuel-ex/2023','/bikes/trek/fuel-ex/2023/fuel-ex-9-8-xt-gen-6','/bikes/trek/fuel-exe/2023/fuel-exe-9-8']){
   const response=await req(env,path),html=await response.text();assert.equal(response.status,200,path);assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');assert.match(html,/limited, non-indexable pilot/i);
  }
  const detail=await (await req(env,'/bikes/trek/fuel-exe/2023/fuel-exe-9-8')).text();assert.match(detail,/TQ/);assert.match(detail,/360 Wh/);
  assert.equal((await req(env,'/bikes/domane')).status,200);assert.equal((await req(env,'/bikes/trek/fuel-ex/2022')).status,404);
 }finally{env._db.close();}
});
