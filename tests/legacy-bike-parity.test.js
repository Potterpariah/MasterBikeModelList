import test from 'node:test';
import assert from 'node:assert/strict';
import parity from '../reports/legacy-bike-parity.json' with {type:'json'};
import {localEnv} from '../scripts/local-db.js';

test('read-only legacy bicycle parity matrix covers every current model with an explicit safe destination',()=>{
 const env=localEnv();try{
  const models=env._db.prepare('SELECT m.id,m.name,m.slug,m.disciplines_json,m.source_url,b.name manufacturer,b.slug brand_slug FROM bike_models m JOIN brands b ON b.id=m.brand_id ORDER BY m.id').all();
  assert.equal(parity.rows.length,models.length);
  assert.deepEqual(parity.rows.map(row=>row.legacy_id).sort(),models.map(model=>model.id).sort());
  for(const model of models){
   const row=parity.rows.find(item=>item.legacy_id===model.id);
   assert.equal(row.manufacturer,model.manufacturer);assert.equal(row.model_family,model.name);assert.deepEqual(row.disciplines,JSON.parse(model.disciplines_json));assert.equal(row.source_url,model.source_url);
   assert.equal(row.legacy_url,`/bikes/${model.slug}`);assert.equal(row.destination,row.legacy_url);assert.equal(row.brand_link,`/brands/${model.brand_slug}`);assert.equal(row.migration_status,'preserve');assert.equal(row.image_relationship,null);assert.match(row.seo,/noindex/);
  }
 }finally{env._db.close();}
});
