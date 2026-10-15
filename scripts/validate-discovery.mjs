import assert from 'node:assert/strict';
import {discoveryPilot} from '../src/discovery-pilot.js';
const asOf=process.argv[2]||new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago'}).format(new Date());
const rows=discoveryPilot.events;
const required=['slug','title','city','county','region','discipline','venue','organizer','sourceUrl','checkedAt','rideDate'];
assert.equal(rows.length,discoveryPilot.expectedCount,'Record count must match the declared batch');
assert.equal(new Set(rows.map(e=>e.slug)).size,rows.length,'Duplicate slug');
assert.equal(new Set(rows.map(e=>[e.title.toLowerCase(),e.city.toLowerCase(),e.rideDate].join('|'))).size,rows.length,'Duplicate event');
for(const e of rows){for(const key of required)assert.ok(e[key],e.slug+' missing '+key);assert.equal(e.region,discoveryPilot.region);assert.ok(e.rideDate>=asOf||['completed','cancelled'].includes(e.status),e.slug+' needs a past-event status refresh');assert.equal(new URL(e.sourceUrl).protocol,'https:');assert.ok(e.checkedAt<=asOf);}
console.log(JSON.stringify({asOf,records:rows.length,region:discoveryPilot.region,structuralValidation:'passed',sourceFreshness:'Requires official-source recheck before release; this script does not verify facts.'},null,2));
