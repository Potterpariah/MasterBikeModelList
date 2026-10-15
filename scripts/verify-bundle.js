import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import bundled from '../build-check/worker.js';
import { clientScript } from '../src/generated/portal-client-source.js';
import { localEnv } from './local-db.js';
const env=localEnv();
const asset=await bundled.fetch(new Request('https://bike.test/portal.js'),env);
const script=await asset.text();
assert.equal(script,clientScript,'Bundling must preserve the exact browser source');
assert.ok(!script.includes('__name('),'Browser script must not require Wrangler helpers');
new Script(script);
const home=await bundled.fetch(new Request('https://bike.test/'),env);
assert.equal(home.status,200);assert.match(await home.text(),/Upcoming Texas events/);
if(process.argv[2]) {
  const normalize=s=>s.replace(/\r\n/g,'\n');
  const original=normalize(readFileSync(process.argv[2],'utf8'));
  let updated=normalize(readFileSync(new URL('../src/worker.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n\n/,'');
  const start=updated.indexOf('\n      if (url.pathname === "/"');
  const end=updated.indexOf('\n\n      if (url.pathname === "/api/health"',start);
  updated=updated.slice(0,start)+updated.slice(end+1);
  assert.equal(updated,original,'Original backend must be unchanged apart from new route insertion');
  console.log('Original backend preservation: passed');
}
console.log('Compiled Worker HTML, browser source equivalence, and browser JavaScript syntax: passed');

const {eventMapClientScript}=await import('../src/generated/event-map-client-source.js');
const mapScript=await (await bundled.fetch(new Request('https://bike.test/event-map.js'),env)).text();
assert.equal(mapScript,eventMapClientScript);new Script(mapScript);assert.ok(!mapScript.includes('__name('));
console.log('Compiled interactive-map browser source: passed');
