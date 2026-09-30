import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import {localEnv} from '../scripts/local-db.js';
import {canIndex} from '../src/seo.js';
function fixture(){const env=localEnv();return {env,req:(path,method='GET')=>worker.fetch(new Request('https://bike.test'+path,{method}),env)};}
test('public guides render standalone HTML, unique metadata, sections, sources and safe content',async()=>{
 const {env,req}=fixture();try{const r=await req('/guides/fix-a-flat'),html=await r.text();assert.equal(r.status,200);assert.match(html,/<title>How to Fix a Flat Tire With an Inner Tube \| Bike Portal/);assert.match(html,/rel="canonical" href="https:\/\/bike.test\/guides\/fix-a-flat"/);assert.match(html,/1\. Make the work area safe/);assert.match(html,/Prepare your repair kit/);assert.match(html,/parktool.com/);assert.equal((html.match(/<h1>/g)||[]).length,1);assert.match(html,/BreadcrumbList/);assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');
 env._db.prepare("UPDATE guides SET title=? WHERE slug='fix-a-flat'").run('</script><img src=x>');const safe=await (await req('/guides/fix-a-flat')).text();assert.ok(!safe.includes('</script><img'));assert.match(safe,/&lt;img/);
 }finally{env._db.close();}
});
test('public content resolves stable slugs, redirects IDs, and returns real not-found statuses',async()=>{
 const {env,req}=fixture();try{const g=env._db.prepare("SELECT id,slug FROM guides WHERE slug='fix-a-flat'").get();const r=await req('/guides/'+g.id);if(g.id!==g.slug){assert.equal(r.status,308);assert.equal(r.headers.get('location'),'/guides/fix-a-flat');}
 for(const p of ['/guides/missing','/events/missing','/brands/missing','/guides/fix-a-flat/extra'])assert.equal((await req(p)).status,404,p);
 env._db.prepare("UPDATE guides SET status='draft' WHERE slug='fix-a-flat'").run();assert.equal((await req('/guides/fix-a-flat')).status,404);
 assert.equal(await (await req('/events','HEAD')).text(),'');assert.equal((await req('/events/')).status,308);
 }finally{env._db.close();}
});
test('event calendar provides a complete event and city chooser plus only precise start markers',async()=>{
 const {env,req}=fixture();try{const html=await (await req('/events')).text();assert.match(html,/Choose an event or city/);assert.match(html,/<optgroup label="Events">/);assert.match(html,/Autumn in Bonham Century Mile Ride/);assert.match(html,/<optgroup label="Cities">/);assert.match(html,/value="Bonham"/);assert.match(html,/Verified event starts/);assert.match(html,/11 current events with a published precise start address/);assert.match(html,/event-start-map-canvas/);assert.match(html,/href="\/events\/2026-10-03-bonham-autumn-in-bonham-century-mile-ride"/);assert.ok(!html.includes('2026 Texas Gravel Champs</a></li>'));
 }finally{env._db.close();}
});
test('indexing needs approved origin and explicit opt-in; private and incomplete pages stay excluded',async()=>{
 const {env,req}=fixture();try{env.PUBLIC_INDEXING='enabled';env.PUBLIC_ORIGIN='https://bike.test';
 for(const p of ['/','/guides','/events','/guides/fix-a-flat'])assert.equal((await req(p)).headers.get('x-robots-tag'),'index, follow',p);
 for(const p of ['/api/health','/api/me/library','/stage4-test','/brands/bianchi','/guides/bmx-bike-basics','/events?q=gravel','/missing'])assert.equal((await req(p)).headers.get('x-robots-tag'),'noindex, nofollow',p);
 assert.equal(canIndex(new Request('https://bike.test/'),{PUBLIC_INDEXING:'enabled',PUBLIC_ORIGIN:'bad'},true),false);
 assert.equal(canIndex(new Request('https://bike-portal-stage4.m25-f6b.workers.dev/'),{PUBLIC_INDEXING:'enabled',PUBLIC_ORIGIN:'https://bike-portal-stage4.m25-f6b.workers.dev'},true),false);
 }finally{env._db.close();}
});
test('sitemap lists only approved canonical documents after public opt-in',async()=>{
 const {env,req}=fixture();try{assert.ok(!(await (await req('/sitemap.xml')).text()).includes('<loc>'));env.PUBLIC_INDEXING='enabled';env.PUBLIC_ORIGIN='https://bike.test';const xml=await (await req('/sitemap.xml')).text();assert.match(xml,/https:\/\/bike.test\/guides\/fix-a-flat/);for(const s of ['#','/api/','/stage4-test','/brands/bianchi','/guides/bmx-bike-basics'])assert.ok(!xml.includes(s));assert.match(await (await req('/robots.txt')).text(),/Sitemap: https:\/\/bike.test\/sitemap.xml/);
 }finally{env._db.close();}
});
test('event pages disclose field-level reviews, preserve uncertainty and gate Event markup',async()=>{
 const {env,req}=fixture();try{const row=env._db.prepare("SELECT slug FROM events WHERE id='event_2026_09_19_2026_midnight_massacre'").get();const html=await (await req('/events/'+row.slug)).text();assert.match(html,/35 &amp; Liberty/);assert.match(html,/4321 I-35/);assert.match(html,/Fields checked:/);assert.match(html,/Save, follow or update/);
 const conflict=env._db.prepare("SELECT slug FROM events WHERE id='event_2026_09_19_conquer_the_coast'").get();const c=await (await req('/events/'+conflict.slug)).text();assert.match(c,/Whataburger Field/);assert.match(c,/subject to approvals/);assert.ok(!c.includes('"@type":"SportsEvent"'));
 const api=await (await req('/api/events/event_2026_09_19_2026_midnight_massacre')).json();assert.equal(api.event.venue_name,'35 & Liberty');assert.equal(api.event.verified_on,'2026-09-18');
 }finally{env._db.close();}
});
test('editorial cleanup removes planning language without modifying baseline guide data',async()=>{
 const {env,req}=fixture();try{const before=env._db.prepare('SELECT body_markdown FROM guides ORDER BY id').all();const d=await (await req('/api/portal/catalog')).json();assert.ok(d.guides.every(g=>! /the portal should|the portal can/i.test(g.body_markdown)));assert.equal(d.guides.length,16);assert.deepEqual(env._db.prepare('SELECT body_markdown FROM guides ORDER BY id').all(),before);
 for(const p of ['/about','/editorial','/community-guidelines','/data-use'])assert.equal((await req(p)).status,200);
 }finally{env._db.close();}
});
test('home links to public content and excludes known test posts without deleting them',async()=>{
 const {env,req}=fixture();try{env._db.prepare("INSERT INTO users(id,email,username,password_hash,password_salt) VALUES('qa','qa@example.test','qa','x','x')").run();env._db.prepare("INSERT INTO discussions(id,author_user_id,title,body,slug) VALUES('710f3d63-ab6f-4e2c-a680-7597b839deca','qa','dfdfd','Test content','qa')").run();const html=await (await req('/')).text();assert.match(html,/href="\/guides\/fix-a-flat"/);assert.match(html,/href="\/events"/);assert.match(html,/href="\/editorial"/);assert.ok(!html.includes('dfdfd'));assert.equal(env._db.prepare('SELECT COUNT(*) AS n FROM discussions').get().n,1);
 }finally{env._db.close();}
});
