import test from 'node:test';
import assert from 'node:assert/strict';
import {localEnv} from '../scripts/local-db.js';
import worker from '../src/worker.js';
import {historicalBikeIndex,historicalBrand,historicalModels} from '../src/historical-bike-list.js';

const req=(env,path)=>worker.fetch(new Request('https://bike.test'+path),env);

test('historical bike browser exposes only retained complete-bike candidates in a brand-to-model hierarchy',async()=>{
 assert.equal(historicalBikeIndex.summary.models,5463);
 assert.equal(historicalBikeIndex.summary.withheld_possible_incomplete,34);
 assert.equal(historicalBikeIndex.brands.length,25);
 const trek=historicalBrand('trek');assert.ok(trek);assert.ok(trek.models.length>1000);
 assert.equal(historicalModels({brandSlug:'trek',query:'frameset'}).length,0);
 const env=localEnv();try{
  const root=await (await req(env,'/bikes')).text();assert.match(root,/Historical bike catalog/);assert.match(root,/Browse by brand/);assert.match(root,/Specialized/);assert.match(root,/34 unresolved frame\/module candidates/);
  const brand=await (await req(env,'/bikes?brand=trek')).text();assert.match(brand,/Trek historical models/);assert.match(brand,/Select a model/);assert.ok(!brand.includes('Frameset'));
  const search=await (await req(env,'/bikes?brand=trek&q=zzznomatch')).text();assert.match(search,/No historical models match/);
  assert.equal((await req(env,'/bikes/domane')).status,200);
 }finally{env._db.close();}
});
