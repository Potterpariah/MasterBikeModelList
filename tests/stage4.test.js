import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import {localEnv} from '../scripts/local-db.js';

function harness(){
  const env=localEnv();const media=new Map();
  env.MEDIA={async put(key,value,options){media.set(key,{bytes:new Uint8Array(value),...options});},async get(key){const x=media.get(key);return x?{body:x.bytes,httpEtag:'"local-test"',writeHttpMetadata(h){h.set('Content-Type',x.httpMetadata.contentType);}}:null;}};
  const req=(path,cookie='',method='GET',data)=>worker.fetch(new Request('https://bike.test'+path,{method,headers:{Cookie:cookie,...(data instanceof FormData?{}:{'Content-Type':'application/json'})},...(data===undefined?{}:{body:data instanceof FormData?data:JSON.stringify(data)})}),env);
  const user=async name=>{const r=await req('/api/auth/signup','','POST',{email:name+'@example.test',username:name,password:'stage4-test-password'});assert.equal(r.status,201);return {cookie:r.headers.get('set-cookie').split(';')[0],...(await r.json()).user};};
  const discussion=async u=>{const r=await req('/api/discussions',u.cookie,'POST',{title:'Stage 4 test discussion',body:'Local acceptance test.'});assert.equal(r.status,201);return (await r.json()).id;};
  return {env,media,req,user,discussion};
}
const png=Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aT1sAAAAASUVORK5CYII=','base64'));
test('saved library resolves named destinations and remains private to each account',async()=>{
 const h=harness();try{const a=await h.user('librarya'),b=await h.user('libraryb'),id=await h.discussion(a);
 const event=h.env._db.prepare('SELECT id,title FROM events LIMIT 1').get();
 for(const [type,target] of [['discussion',id],['event',event.id]])assert.equal((await h.req('/api/saves',a.cookie,'POST',{entity_type:type,entity_id:target})).status,200);
 await h.req('/api/follows',a.cookie,'POST',{entity_type:'discussion',entity_id:id});
 const response=await h.req('/api/me/library',a.cookie);assert.equal(response.headers.get('cache-control'),'no-store');const data=await response.json();
 assert.equal(data.totals.saves,2);assert.equal(data.follows[0].title,'Stage 4 test discussion');
 const savedEvent=data.saves.find(x=>x.entity_type==='event');assert.equal(savedEvent.title,event.title);assert.equal(savedEvent.href,'#event/'+encodeURIComponent(event.id));
 assert.equal(data.saves.find(x=>x.entity_type==='discussion').href,'#discussion/'+id);
 assert.equal((await (await h.req('/api/me/library',b.cookie)).json()).saves.length,0);assert.equal((await h.req('/api/me/library')).status,401);
 const html=await (await h.req('/')).text();assert.match(html,/<details class="site-menu">[\s\S]*?<a href="\/texas\/clubs">Cycling clubs<\/a>[\s\S]*?<a href="#garage">Bike Garage<\/a>[\s\S]*?<\/details>/);
 }finally{h.env._db.close();}
});
test('hidden and missing saved targets show removable unavailable entries without leaking titles',async()=>{
 const h=harness();try{const a=await h.user('hiddena'),id=await h.discussion(a);
 await h.req('/api/saves',a.cookie,'POST',{entity_type:'discussion',entity_id:id});h.env._db.prepare("UPDATE discussions SET status='hidden',title='PRIVATE TITLE' WHERE id=?").run(id);
 h.env._db.prepare("INSERT INTO saved_items(user_id,entity_type,entity_id) VALUES(?,?,?)").run(a.id,'event','deleted-event');
 const data=await (await h.req('/api/me/library',a.cookie)).json();assert.equal(data.saves.length,2);assert.ok(data.saves.every(x=>!x.available&&x.href===null&&x.title==='Unavailable item'));assert.ok(!JSON.stringify(data).includes('PRIVATE TITLE'));
 await h.req('/api/saves?entity_type=event&entity_id=deleted-event',a.cookie,'DELETE');assert.equal((await (await h.req('/api/me/library',a.cookie)).json()).saves.length,1);
 }finally{h.env._db.close();}
});
test('saved library resolves legacy supported entity types and reports bounded list totals',async()=>{
 const h=harness();try{const a=await h.user('legacya'),id=await h.discussion(a);const c=await (await h.req('/api/discussions/'+id+'/comments',a.cookie,'POST',{body:'A reply'})).json();
 const entries=[['comment',c.id],['user',a.id],['guide',h.env._db.prepare('SELECT id FROM guides LIMIT 1').get().id],['brand',h.env._db.prepare('SELECT id FROM brands LIMIT 1').get().id],['bike',h.env._db.prepare('SELECT id FROM bike_models LIMIT 1').get().id]];
 for(const [type,target] of entries)await h.req('/api/saves',a.cookie,'POST',{entity_type:type,entity_id:target});
 const data=await (await h.req('/api/me/library',a.cookie)).json();assert.equal(data.saves.length,5);assert.ok(data.saves.every(x=>x.available));assert.equal(data.saves.find(x=>x.entity_type==='comment').href,'#discussion/'+id);
 for(let i=0;i<501;i++)h.env._db.prepare('INSERT INTO follows(user_id,entity_type,entity_id) VALUES(?,?,?)').run(a.id,'event','old'+i);
 const capped=await (await h.req('/api/me/library',a.cookie)).json();assert.equal(capped.follows.length,500);assert.equal(capped.totals.follows,501);assert.equal(capped.limit,500);
 }finally{h.env._db.close();}
});
test('profile edits persist across sessions and cannot change another user or role',async()=>{
 const h=harness();try{const a=await h.user('profilea'),b=await h.user('profileb');
 assert.equal((await h.req('/api/me/profile',a.cookie,'PATCH',{display_name:'A rider',bio:'A bio',location_text:'Austin',website_url:'https://example.test',id:b.id,role:'admin'})).status,200);
 await h.req('/api/auth/logout',a.cookie,'POST',{});const login=await h.req('/api/auth/login','','POST',{identity:'profilea',password:'stage4-test-password'});const cookie=login.headers.get('set-cookie').split(';')[0];
 const me=(await (await h.req('/api/me',cookie)).json()).user;assert.equal(me.display_name,'A rider');assert.equal(me.bio,'A bio');assert.equal(me.location_text,'Austin');assert.equal(me.role,'member');
 assert.equal((await (await h.req('/api/me',b.cookie)).json()).user.display_name,'profileb');assert.equal((await h.req('/api/me/profile',cookie,'PATCH',{website_url:'javascript:alert(1)'})).status,400);
 const pub=await (await h.req('/api/users/profilea')).json();assert.equal(pub.user.email,undefined);
 }finally{h.env._db.close();}
});
test('avatar upload, retrieval and profile persistence; invalid type, spoofed bytes and oversize rejection',async()=>{
 const h=harness();try{const a=await h.user('avatara'),b=await h.user('avatarb');const upload=async(bytes,type,cookie=a.cookie)=>{const fd=new FormData();fd.set('file',new File([bytes],'avatar.png',{type}));return h.req('/api/me/avatar',cookie,'POST',fd);};
 const r=await upload(png,'image/png');assert.equal(r.status,201);const {avatar_url}=await r.json();const fetched=await h.req(avatar_url);assert.equal(fetched.status,200);assert.equal(fetched.headers.get('Content-Type'),'image/png');assert.deepEqual(new Uint8Array(await fetched.arrayBuffer()),png);
 assert.equal((await (await h.req('/api/me',a.cookie)).json()).user.avatar_url,avatar_url);assert.equal((await (await h.req('/api/me',b.cookie)).json()).user.avatar_url,null);
 assert.equal((await upload(png,'text/plain')).status,415);assert.equal((await upload('not an image','image/png')).status,415);assert.equal((await upload(new Uint8Array(5*1024*1024+1),'image/png')).status,413);assert.equal((await upload(png,'image/png','')).status,401);assert.equal(h.media.size,1);
 }finally{h.env._db.close();}
});
test('garage deletion is scoped to its owner',async()=>{
 const h=harness();try{const a=await h.user('garagea'),b=await h.user('garageb');const {id}=await (await h.req('/api/garage',a.cookie,'POST',{custom_brand:'Trek',custom_model:'Test bike'})).json();
 await h.req('/api/garage/'+id,b.cookie,'DELETE');assert.equal((await (await h.req('/api/garage',a.cookie)).json()).bikes.length,1);assert.equal((await (await h.req('/api/garage',b.cookie)).json()).bikes.length,0);
 await h.req('/api/garage/'+id,a.cookie,'DELETE');assert.equal((await (await h.req('/api/garage',a.cookie)).json()).bikes.length,0);
 }finally{h.env._db.close();}
});
test('Garage client includes bike-type filtering and a searchable included-model field',async()=>{
 const h=harness();try{const script=await (await h.req('/portal.js')).text();assert.match(script,/garage-bike-type/);assert.match(script,/garage-model-options/);assert.match(script,/All included bike types/);}finally{h.env._db.close();}
});
test('reactions, saves and follows persist idempotently and isolate users',async()=>{
 const h=harness();try{const a=await h.user('actiona'),b=await h.user('actionb'),id=await h.discussion(a);
 for(const endpoint of ['saves','follows'])for(let i=0;i<2;i++)assert.equal((await h.req('/api/'+endpoint,a.cookie,'POST',{entity_type:'discussion',entity_id:id,user_id:b.id})).status,200);
 for(let i=0;i<2;i++)assert.equal((await h.req('/api/reactions',a.cookie,'POST',{target_type:'discussion',target_id:id,reaction_type:'helpful',user_id:b.id})).status,200);
 const activity=await (await h.req('/api/me/activity',a.cookie)).json();assert.equal(activity.saves.length,1);assert.equal(activity.follows.length,1);assert.equal(activity.reactions.length,1);assert.equal((await (await h.req('/api/me/activity',b.cookie)).json()).saves.length,0);
 for(const endpoint of ['saves','follows'])await h.req('/api/'+endpoint+'?entity_type=discussion&entity_id='+id,b.cookie,'DELETE');assert.equal((await (await h.req('/api/me/activity',a.cookie)).json()).saves.length,1);
 for(const endpoint of ['saves','follows'])await h.req('/api/'+endpoint+'?entity_type=discussion&entity_id='+id,a.cookie,'DELETE');const empty=await (await h.req('/api/me/activity',a.cookie)).json();assert.equal(empty.saves.length,0);assert.equal(empty.follows.length,0);
 assert.equal((await h.req('/api/saves',a.cookie,'POST',{entity_type:'bad',entity_id:id})).status,400);assert.equal((await h.req('/api/reactions',a.cookie,'POST',{target_type:'discussion',target_id:'missing',reaction_type:'helpful'})).status,404);
 }finally{h.env._db.close();}
});
test('second-account notifications, no self notifications, read isolation and full unread count',async()=>{
 const h=harness();try{const a=await h.user('noticea'),b=await h.user('noticeb'),id=await h.discussion(a);
 await h.req('/api/discussions/'+id+'/comments',a.cookie,'POST',{body:'Self reply'});assert.equal((await (await h.req('/api/notifications',a.cookie)).json()).unread_count,0);
 await h.req('/api/discussions/'+id+'/comments',b.cookie,'POST',{body:'Second account reply'});const n=await (await h.req('/api/notifications',a.cookie)).json();assert.equal(n.unread_count,1);assert.equal(n.notifications[0].actor_user_id,b.id);
 await h.req('/api/notifications/'+n.notifications[0].id+'/read',b.cookie,'POST',{});assert.equal((await (await h.req('/api/notifications',a.cookie)).json()).unread_count,1);
 await h.req('/api/notifications/'+n.notifications[0].id+'/read',a.cookie,'POST',{});assert.equal((await (await h.req('/api/notifications',a.cookie)).json()).unread_count,0);
 for(let i=0;i<105;i++)h.env._db.prepare("INSERT INTO notifications(id,user_id,type,message) VALUES(?,?,?,?)").run('bulk'+i,a.id,'test','Unread');const many=await (await h.req('/api/notifications',a.cookie)).json();assert.equal(many.notifications.length,100);assert.equal(many.unread_count,105);
 }finally{h.env._db.close();}
});
test('reports reject missing targets; only moderators resolve; audit trail persists',async()=>{
 const h=harness();try{const a=await h.user('reporta'),b=await h.user('reportb'),id=await h.discussion(a);
 assert.equal((await h.req('/api/reports',b.cookie,'POST',{target_type:'discussion',target_id:'missing',reason:'Spam'})).status,404);
 const r=await h.req('/api/reports',b.cookie,'POST',{target_type:'discussion',target_id:id,reason:'Spam',details:'Test report'});assert.equal(r.status,201);const report=(await r.json()).id;
 assert.equal((await h.req('/api/mod/reports',b.cookie)).status,403);assert.equal((await h.req('/api/mod/reports/'+report+'/resolve',b.cookie,'POST',{status:'resolved'})).status,403);
 h.env._db.prepare("UPDATE users SET role='moderator' WHERE id=?").run(a.id);assert.equal((await (await h.req('/api/mod/reports',a.cookie)).json()).reports.length,1);
 assert.equal((await h.req('/api/mod/reports/'+report+'/resolve',a.cookie,'POST',{status:'invalid'})).status,400);
 assert.equal((await h.req('/api/mod/reports/'+report+'/resolve',a.cookie,'POST',{status:'dismissed',reason:'Local acceptance test'})).status,200);
 assert.equal((await (await h.req('/api/mod/reports',a.cookie)).json()).reports.length,0);assert.equal(h.env._db.prepare('SELECT COUNT(*) AS count FROM moderation_actions').get().count,1);
 assert.equal((await h.req('/api/mod/reports/'+report+'/resolve',a.cookie,'POST',{status:'resolved'})).status,409);assert.equal((await h.req('/api/mod/reports/missing/resolve',a.cookie,'POST',{status:'resolved'})).status,404);
 }finally{h.env._db.close();}
});
test('rate limiting rejects exhausted requests, fails closed in production and permits logout',async()=>{
 const h=harness();try{const a=await h.user('limita');h.env.ENVIRONMENT='production';
 assert.equal((await h.req('/api/me/profile',a.cookie,'PATCH',{})).status,503);
 h.env.WRITE_LIMITER={limit:async({key})=>{assert.equal(key,'bike-portal-stage4:write:'+a.id);return {success:false};}};
 const limited=await h.req('/api/me/profile',a.cookie,'PATCH',{});assert.equal(limited.status,429);assert.equal(limited.headers.get('Retry-After'),'60');
 h.env.AUTH_LIMITER={limit:async()=>({success:false})};const denied=await worker.fetch(new Request('https://bike.test/api/auth/login',{method:'POST',headers:{'CF-Connecting-IP':'192.0.2.1','Content-Type':'application/json'},body:JSON.stringify({identity:'limita',password:'stage4-test-password'})}),h.env);assert.equal(denied.status,429);
 assert.equal((await h.req('/api/auth/logout',a.cookie,'POST',{})).status,200);assert.equal((await h.req('/api/me/activity',a.cookie)).status,401);
 }finally{h.env._db.close();}
});
