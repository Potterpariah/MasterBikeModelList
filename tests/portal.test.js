import test from 'node:test';
import assert from 'node:assert/strict';
import { Script } from 'node:vm';
import worker from '../src/worker.js';
import { localEnv } from '../scripts/local-db.js';
import { texasToday, upcomingTexas } from '../src/portal.js';
const env=localEnv();
const request=(path,options={},bindings=env)=>worker.fetch(new Request('https://bike.test'+path,options),bindings);
const send=(path,data,cookie='')=>request(path,{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(data)});

test('test deployment excludes homepage, diagnostics, assets, APIs and errors from indexing',async()=>{
  for(const path of ['/','/stage4-test','/portal.js','/portal.css','/api/health','/missing']) {
    const response=await request(path);
    assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow',path);
  }
  assert.equal((await request('/',{method:'HEAD'})).headers.get('x-robots-tag'),'noindex, nofollow');
});
test('production signup fails closed when the Turnstile secret is missing',async()=>{
  const productionEnv=localEnv();
  productionEnv.ENVIRONMENT='production';
  productionEnv.AUTH_LIMITER={limit:async()=>({success:true})};
  const original=console.error;console.error=()=>{};
  try {
    const response=await request('/api/auth/signup',{method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'},body:JSON.stringify({email:'guard@example.test',username:'guardrider',password:'local-test-password'})},productionEnv);
    assert.equal(response.status,500);
    assert.equal(response.headers.get('set-cookie'),null);
    assert.equal(productionEnv._db.prepare('SELECT COUNT(*) AS count FROM users').get().count,0);
  } finally {console.error=original;productionEnv._db.close();}
});

test('homepage renders seeded content and all requested entry points',async()=>{
  const response=await request('/');assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/text\/html/);
  const html=await response.text();for(const text of ['Your next ride','Upcoming Texas events','Popular maintenance guides','Latest discussions','portal-search','#signup','#login','#invite','home-invite-action','/editorial','Trek'])assert.ok(html.includes(text),text);
  assert.match(html,/Fix a Flat/i);assert.match(html,/<a class="hero-art" href="\/events" aria-label="Browse Texas cycling events">/);assert.ok(!html.includes('undefined'));assert.equal(response.headers.get('cache-control'),'no-store');
});
test('HEAD and static assets have correct MIME types, security headers, and valid JavaScript',async()=>{
  const head=await request('/',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
  for(const [path,type] of [['/portal.js','text/javascript'],['/portal.css','text/css']]){
    const response=await request(path);assert.equal(response.status,200);assert.ok(response.headers.get('content-type').startsWith(type));assert.equal(response.headers.get('x-content-type-options'),'nosniff');
    const body=await response.text();if(path.endsWith('.js'))new Script(body);else assert.match(body,/\.hero-art svg\{display:block\}/);
    const assetHead=await request(path,{method:'HEAD'});assert.equal(await assetHead.text(),'');
  }
});
test('catalog reads published articles and the existing Stage 3 brand/model tables',async()=>{
  const data=await (await request('/api/portal/catalog')).json();assert.equal(data.brands.length,18);assert.equal(data.bikes.length,25);assert.equal(data.guides.length,16);assert.ok(data.guides.every(g=>g.body_markdown));
  env._db.prepare("UPDATE guides SET status='draft' WHERE slug='fix-a-flat'").run();
  const hidden=await (await request('/api/portal/catalog')).json();assert.ok(!hidden.guides.some(g=>g.slug==='fix-a-flat'));
  env._db.prepare("UPDATE guides SET status='published' WHERE slug='fix-a-flat'").run();
});
test('upcoming event filtering uses the Texas date, excludes past/cancelled/non-Texas events, and sorts',()=>{
  assert.equal(texasToday(new Date('2026-09-15T01:00:00Z')),'2026-09-14');
  const event=(start_date,state='TX',verification_status='verified')=>({start_date,state,verification_status,title:'Ride'});
  const rows=upcomingTexas([event('2026-09-13'),event('2026-09-16'),event('2026-09-14'),event('2026-09-17','CA'),event('2026-09-18','TX','cancelled'),event(null),event('2026-09-20','TX','unverified')],'2026-09-14');
  assert.deepEqual(rows.map(e=>e.start_date),['2026-09-14','2026-09-16']);
});
test('homepage handles unavailable database sections with useful error states',async()=>{
  const badEnv={DB:{prepare(){throw Error('Simulated unavailable DB');}}};const original=console.error;console.error=()=>{};
  try{const response=await request('/',{},badEnv);assert.equal(response.status,200);const html=await response.text();assert.match(html,/Events are temporarily unavailable/);assert.match(html,/Guides are temporarily unavailable/);assert.match(html,/Discussions are temporarily unavailable/);}finally{console.error=original;}
});
test('homepage safely escapes persisted content and the Turnstile site key',async()=>{
  const original=env._db.prepare("SELECT title FROM guides WHERE slug='fix-a-flat'").get().title;
  env._db.prepare("UPDATE guides SET title=? WHERE slug='fix-a-flat'").run('<img src=x onerror=alert(1)>');
  try{const html=await (await request('/',{},{...env,TURNSTILE_SITE_KEY:'</script><script>alert(1)</script>'})).text();assert.ok(!html.includes('<img src=x'));assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('</script><script>alert'));assert.ok(html.includes('\\u003c/script>'));}finally{env._db.prepare("UPDATE guides SET title=? WHERE slug='fix-a-flat'").run(original);}
});
test('preserved diagnostics, health, events, missing routes, and origin rejection',async()=>{
  assert.match(await (await request('/stage4-test')).text(),/Stage 4 persistence test/);
  const health=await (await request('/api/health')).json();assert.equal(health.ok,true);assert.equal(health.stage,4);
  const events=await (await request('/api/events?limit=10')).json();assert.equal(events.events.length,10);
  const event=await (await request('/api/events/'+events.events[0].id)).json();assert.equal(event.event.id,events.events[0].id);
  assert.equal((await request('/missing')).status,404);assert.equal((await request('/api/garage')).status,401);
  assert.equal((await request('/api/auth/signup',{method:'POST',headers:{Origin:'https://other.test'}})).status,403);
});
test('existing account, session, discussion, comment, garage and event status APIs work together',async()=>{
  const signup=await send('/api/auth/signup',{email:'rider@example.test',username:'localrider',password:'local-test-password'});assert.equal(signup.status,201);
  const cookie=signup.headers.get('set-cookie').split(';')[0];assert.ok(cookie.startsWith('bp_session='));
  assert.equal((await request('/api/me',{headers:{Cookie:cookie}})).status,200);
  const d=await send('/api/discussions',{title:'A local test ride',body:'Looking forward to the next ride.'},cookie);assert.equal(d.status,201);const discussion=await d.json();
  assert.equal((await send('/api/discussions/'+discussion.id+'/comments',{body:'See you there!'},cookie)).status,201);
  const detail=await (await request('/api/discussions/'+discussion.id)).json();assert.equal(detail.comments.length,1);
  assert.equal((await send('/api/garage',{custom_brand:'Trek',custom_model:'Checkpoint',model_year:2026},cookie)).status,201);
  assert.equal((await (await request('/api/garage',{headers:{Cookie:cookie}})).json()).bikes.length,1);
  const events=await (await request('/api/events?limit=1')).json();assert.equal((await send('/api/events/'+events.events[0].id+'/status',{status:'going'},cookie)).status,200);
  assert.equal((await (await request('/api/events/'+events.events[0].id,{headers:{Cookie:cookie}})).json()).user_status,'going');
  assert.equal((await send('/api/auth/logout',{},cookie)).status,200);assert.equal((await request('/api/me',{headers:{Cookie:cookie}})).status,401);
  assert.equal((await send('/api/auth/login',{identity:'localrider',password:'local-test-password'})).status,200);
});
