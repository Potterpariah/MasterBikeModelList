import test from 'node:test';
import assert from 'node:assert/strict';
import {eventTaxonomy,eventCategoryOptions,matchesEventCategory} from '../src/event-taxonomy.js';

test('legacy aliases deduplicate while preserving raw arrays and independent purposes',()=>{
 const event={disciplines_json:'["mountain","mountain bike","road","recreational"]',event_types_json:'["charity ride","fundraiser","interscholastic race"]'};
 const before=JSON.stringify(event), got=eventTaxonomy(event);
 assert.deepEqual(got.disciplines,['Mountain bike','Road']);
 assert.deepEqual(got.formats,['Race']);assert.deepEqual(got.purposes,['Fundraising']);
 assert.deepEqual(got.details,['Recreational','Interscholastic']);
 assert.deepEqual(got.raw.types,['charity ride','fundraiser','interscholastic race']);
 assert.equal(JSON.stringify(event),before);
});
test('curated mixed surface and purpose never infer road from charity',()=>{
 assert.deepEqual(eventTaxonomy({rideType:'Charity'}).disciplines,[]);
 const got=eventTaxonomy({discipline:'Road / Gravel',rideType:'Charity'});
 assert.deepEqual(got.disciplines,['Road','Gravel']);assert.deepEqual(got.purposes,['Fundraising']);
 assert.deepEqual(got.raw.disciplines,['Road / Gravel']);
 assert.deepEqual(eventTaxonomy({discipline:'Randonneuring'}).formats,['Randonneuring']);
});
test('unknown labels and malformed source strings remain visible without invented classification',()=>{
 const got=eventTaxonomy({disciplines:['unusual surface'],event_types_json:'[invalid'});
 assert.deepEqual(got.unknown,['unusual surface','[invalid']);assert.deepEqual(got.formats,[]);
 assert.equal(matchesEventCategory({event_types:['unusual format']},'unusual format'),true);
});
test('mixed competitive and untimed options retain both; support and duration remain separate',()=>{
 const got=eventTaxonomy({event_types:['race','untimed ride','multi-day supported ride','fundraiser']});
 assert.deepEqual(got.formats,['Race','General / social ride']);
 assert.deepEqual(got.details,['Untimed ride','Supported ride','Multi-day']);assert.deepEqual(got.purposes,['Fundraising']);
});
test('filters accept canonical labels and old raw links without expanding narrow race variants',()=>{
 const event={disciplines:['mountain'],event_types:['race','charity ride']};
 assert.equal(matchesEventCategory(event,'MTB','disciplines'),true);
 assert.equal(matchesEventCategory(event,'Mountain bike','disciplines'),true);
 assert.equal(matchesEventCategory(event,'charity ride'),true);
 assert.equal(matchesEventCategory(event,'Fundraising','purposes'),true);
 assert.equal(matchesEventCategory(event,'interscholastic race'),false);
 assert.equal(matchesEventCategory(event,'Road','disciplines'),false);
 assert.deepEqual(eventCategoryOptions([event,{disciplines:['mountain bike']}],'disciplines'),['Mountain bike']);
});

test('overlapping general ride formats consolidate while keeping each source subtype',()=>{
 const event={event_types:['ride','casual ride','untimed ride','community ride','car-free social ride']};
 const before=JSON.stringify(event),got=eventTaxonomy(event);
 assert.deepEqual(got.formats,['General / social ride']);
 assert.deepEqual(got.raw.types,event.event_types);
 assert.deepEqual(got.details,['Generic ride','Casual ride','Untimed ride','Community ride','Car-free social ride']);
 assert.equal(JSON.stringify(event),before);
});
test('former display links retain narrow semantics rather than selecting every general ride',()=>{
 const generic={event_types:['ride']},casual={event_types:['casual ride']},social={event_types:['community ride']};
 for(const event of [generic,casual,social])assert.equal(matchesEventCategory(event,'General / social ride','formats'),true);
 assert.equal(matchesEventCategory(generic,'Noncompetitive ride','formats'),false);
 assert.equal(matchesEventCategory(casual,'Noncompetitive ride','formats'),true);
 assert.equal(matchesEventCategory(social,'Social / community ride','formats'),true);
 assert.equal(matchesEventCategory(casual,'Social / community ride','formats'),false);
 assert.equal(matchesEventCategory(social,'Ride','formats'),false);
});
test('named ambiguous formats are not recast as recreational or racing',()=>{
 for(const type of ['gran fondo','tour','rally','challenge']){
  const got=eventTaxonomy({event_types:[type]});
  assert.equal(got.formats.length,1);assert.ok(!got.formats.includes('Race'));assert.ok(!got.formats.includes('General / social ride'));
 }
});
