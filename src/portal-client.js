// Self-contained: the Worker serves this function as a same-origin browser script.
export function portalClient() {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const config = JSON.parse($('#portal-config').textContent);
  const dialog = $('#detail-dialog'), body = $('#detail-body');
  let catalogPromise, user = null, routeVersion = 0, widget = null, turnstilePromise, toastTimer;
  const link = (kind,id) => ({guide:'/guides/',event:'/events/',brand:'/brands/',bike:'/bikes/'}[kind] || '#'+kind+'/') + encodeURIComponent(id);
  function safeURL(value) { try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? esc(u.href) : ''; } catch { return ''; } }
  function external(value,label) {const href = safeURL(value); return href ? `<a class="textlink" href="${href}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>` : '';}
  const parseArray = value => {try {const result = JSON.parse(value || '[]'); return Array.isArray(result) ? result : [];} catch {return [];}};
  async function api(path, options={}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(path,{credentials:'same-origin',...options,signal:controller.signal});
      const data = await response.json();
      if (!response.ok) { const error = new Error(data.error || 'Something went wrong. Please try again.'); error.status = response.status; throw error; }
      return data;
    } catch(error) {
      if (error.name === 'AbortError') throw new Error('The request took too long. Please try again.');
      throw error;
    } finally { clearTimeout(timer); }
  }
  const post = (path,data) => api(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data || {})});
  function catalog() {if(!catalogPromise) catalogPromise = api('/api/portal/catalog').catch(error => {catalogPromise = null; throw error;}); return catalogPromise;}
  function toast(text) {clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,4500);}
  function setBody(html,version) {if(version!==routeVersion || !dialog.open) return false;body.innerHTML=html;dialog.scrollTop=0;return true;}
  const heading = (title,sub='') => `<h2 id="detail-title" tabindex="-1">${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ''}`;
  let unreadCount = null, noticeRequest = 0;
  async function refreshNotices() {
    const account=user?.id, request=++noticeRequest;if(!account)return;
    try {const data=await api('/api/notifications');if(user?.id!==account || request!==noticeRequest)return;unreadCount=data.unread_count;updateAccount();}
    catch {if(user?.id===account && request===noticeRequest){unreadCount=null;updateAccount();}}
  }
  async function profile(version) {
    if(!await requireUser(version,'edit your profile'))return;
    const u=user;
    if(!setBody(heading('Your profile','Your display name, bio, location, website, avatar and garage are public. Your email is private.')+`<p>Signed in as <strong>@${esc(u.username)}</strong></p>${u.avatar_url?`<img class="profile-avatar" src="${esc(u.avatar_url)}" alt="Your avatar">`:''}<form id="profile-form"><label class="field">Display name<input name="display_name" maxlength="80" value="${esc(u.display_name)}" required></label><label class="field">Bio<textarea name="bio" maxlength="500">${esc(u.bio)}</textarea></label><label class="field">Location<input name="location_text" maxlength="80" value="${esc(u.location_text)}"></label><label class="field">Website<input name="website_url" type="url" maxlength="200" value="${esc(u.website_url)}"></label>${submit('Save profile')}</form><h3>Avatar</h3><form id="avatar-form"><label class="field">Choose an image<input name="file" type="file" accept="image/png,image/jpeg,image/webp" required></label><p>PNG, JPEG or WebP, up to 5 MB. Uploaded avatars are public.</p>${submit('Upload avatar')}</form><div class="actions"><a class="btn outline" href="#garage">Bike Garage</a>${['admin','moderator'].includes(u.role)?'<a class="btn outline" href="#moderation">Moderation reports</a>':''}</div>`,version))return;
    bindForm('profile-form',async(data,status)=>{await api('/api/me/profile',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});await refreshUser();status.textContent='Profile saved.';});
    bindForm('avatar-form',async(data,status,form)=>{const fd=new FormData(form),file=fd.get('file');if(!file?.size)throw new Error('Choose an image first.');if(file.size>5*1024*1024)throw new Error('Image must be 5 MB or smaller.');if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('Choose a PNG, JPEG or WebP image.');await api('/api/me/avatar',{method:'POST',body:fd});await profile(version);toast('Avatar saved.');});
  }
  async function communityTools(type,id,version) {
    await refreshUser();if(!user || version!==routeVersion)return;
    const activity=await api('/api/me/activity');if(version!==routeVersion)return;
    const saved=activity.saves.some(x=>x.entity_type===type && x.entity_id===id),followed=activity.follows.some(x=>x.entity_type===type && x.entity_id===id),helpful=activity.reactions.some(x=>x.target_type===type && x.target_id===id && x.reaction_type==='helpful');
    const tools=document.createElement('section');tools.className='community-tools';tools.innerHTML=`<h3>Keep in touch</h3><div class="actions"><button class="btn outline" data-community="save" aria-pressed="${saved}">${saved?'Unsave':'Save'}</button><button class="btn outline" data-community="follow" aria-pressed="${followed}">${followed?'Unfollow':'Follow'}</button>${['discussion','comment'].includes(type)?`<button class="btn outline" data-community="helpful" ${helpful?'disabled':''}>${helpful?'Marked helpful':'Helpful'}</button><a class="textlink" href="#report/${type}/${encodeURIComponent(id)}">Report</a>`:''}</div><p class="status" role="status"></p>`;body.append(tools);
    tools.onclick=async event=>{const button=event.target.closest('[data-community]');if(!button)return;const status=tools.querySelector('[role=status]');button.disabled=true;try{const action=button.dataset.community;if(action==='helpful'){await post('/api/reactions',{target_type:type,target_id:id,reaction_type:'helpful'});button.textContent='Marked helpful';status.textContent='Thanks for your feedback.';return;}const active=button.getAttribute('aria-pressed')==='true',endpoint=action==='save'?'saves':'follows';if(active)await api('/api/'+endpoint+'?'+new URLSearchParams({entity_type:type,entity_id:id}),{method:'DELETE'});else await post('/api/'+endpoint,{entity_type:type,entity_id:id});button.setAttribute('aria-pressed',String(!active));button.textContent=action==='save'?(active?'Save':'Unsave'):(active?'Follow':'Unfollow');status.textContent='Your choice is saved.';}catch(error){status.textContent=error.message;}finally{if(button.dataset.community!=='helpful' || button.textContent!=='Marked helpful')button.disabled=false;}};
  }
  async function savedItems(version) {
    if(!await requireUser(version,'see saved items'))return;const data=await api('/api/me/library');
    if(!setBody(heading('Your saved items','Find saved and followed items by title or type.')+'<label class="field">Search saved items<input type="search" id="saved-filter" placeholder="Search titles or types"></label><div id="saved-results"></div><p class="status" role="status" id="saved-feedback"></p>',version))return;
    const render=()=>{
      const query=$('#saved-filter').value.trim().toLowerCase();
      const section=(key,label)=>{
        const items=data[key].filter(x=>(x.title+' '+x.entity_type).toLowerCase().includes(query));
        return `<section><h3>${label} (${items.length}${query?' matches':''})</h3>${data.totals[key]>data[key].length?`<p>Showing ${data[key].length} of ${data.totals[key]} items. Search applies to these loaded items.</p>`:''}${items.length?`<ol class="saved-index">${items.map(x=>`<li class="list-item"><span class="tag">${esc(x.entity_type)}</span><h4>${x.available?`<a class="textlink" href="${esc(x.href)}">${esc(x.title)} →</a>`:esc(x.title)}</h4><p>${x.available?'Added '+esc(x.saved_at?.slice(0,10) || ''):'This item was removed or is no longer public.'}</p><button class="btn outline" data-library="${key}" data-type="${esc(x.entity_type)}" data-id="${esc(x.entity_id)}">${key==='saves'?'Unsave':'Unfollow'}</button></li>`).join('')}</ol>`:`<p class="empty">${query?'No matching items.':key==='saves'?'No saved items yet. Open an event or discussion and choose Save.':'You are not following any items yet.'}</p>`}</section>`;
      };
      $('#saved-results').innerHTML=section('saves','Saved')+section('follows','Following');
    };
    $('#saved-filter').oninput=render;render();
    $('#saved-results').onclick=async event=>{
      const button=event.target.closest('[data-library]');if(!button)return;button.disabled=true;
      const {library:key,type,id}=button.dataset;
      try {await api('/api/'+key+'?'+new URLSearchParams({entity_type:type,entity_id:id}),{method:'DELETE'});if(version!==routeVersion)return;data[key]=data[key].filter(x=>x.entity_type!==type||x.entity_id!==id);data.totals[key]--;render();$('#saved-feedback').textContent=key==='saves'?'Item removed from Saved.':'Item unfollowed.';}
      catch(error){if(version===routeVersion)$('#saved-feedback').textContent=error.message;button.disabled=false;}
    };
  }
  async function reportItem(raw,version) {
    if(!await requireUser(version,'report content'))return;const slash=raw.indexOf('/'),type=raw.slice(0,slash),id=raw.slice(slash+1);if(!['discussion','comment','user'].includes(type)||!id)throw new Error('Invalid report link.');
    setBody(heading('Report content','Tell moderators what needs attention. Reports are not public.')+`<form id="report-form"><label class="field">Reason<select name="reason"><option>Spam</option><option>Harassment</option><option>Unsafe content</option><option>Other</option></select></label><label class="field">Details<textarea name="details" maxlength="1000"></textarea></label>${submit('Send report')}</form>`,version);
    bindForm('report-form',async(data)=>{await post('/api/reports',{...data,target_type:type,target_id:id});setBody(heading('Report received','A moderator can review your report.'),version);});
  }
  async function moderation(version) {
    if(!await requireUser(version,'review reports'))return;
    const data=await api('/api/mod/reports');
    if(!setBody(heading('Moderation reports','Closing a report records an outcome; it does not hide or remove the reported content.')+(data.reports.length?data.reports.map(r=>`<article class="list-item"><h3>${esc(r.reason)}</h3><p>${esc(r.details)}</p><p>${esc(r.target_type)} · ${esc(r.target_id)}</p>${r.target_type==='discussion'?`<a class="textlink" href="${link('discussion',r.target_id)}">View discussion</a>`:''}<form data-report-id="${esc(r.id)}"><label class="field">Outcome<select name="status"><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option></select></label><label class="field">Moderator note<textarea name="reason" maxlength="500" required></textarea></label>${submit('Close report')}</form></article>`).join(''):'<p class="empty">No open reports.</p>'),version))return;
    body.querySelectorAll('[data-report-id]').forEach((form,i)=>{form.id='resolve-report-'+i;bindForm(form.id,async data=>{await post('/api/mod/reports/'+encodeURIComponent(form.dataset.reportId)+'/resolve',data);await moderation(version);});});
  }

  function updateAccount() {
    $('#account-nav').innerHTML = user ? `<a href="#profile" title="Edit your profile">${esc(user.display_name || user.username)}</a><a href="#notifications" aria-label="Notifications${unreadCount===null?' (count unavailable)':', '+unreadCount+' unread'}">Notifications <span class="notice-count">${unreadCount===null?'…':unreadCount}</span></a><a href="#saved">Saved</a><a class="btn" href="#logout">Log out</a>` : '<a href="#login">Log in</a><a class="btn" href="#signup">Join the ride ↗</a>';
  }
  async function refreshUser() {const previous=user?.id;try {user=(await api('/api/me')).user;} catch {user=null;} if(previous!==user?.id)unreadCount=null;updateAccount();if(user)void refreshNotices();}
  function closeDialog() {routeVersion++;if(widget!==null && window.turnstile){window.turnstile.remove(widget);widget=null;}dialog.close();history.replaceState(null,'',location.pathname+location.search);}
  $('#close-dialog').onclick=closeDialog;
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
  function bindForm(id, handler) {
    const form=document.getElementById(id);if(!form)return;
    form.addEventListener('submit',async event=>{
      event.preventDefault();const button=form.querySelector('button[type="submit"]');const status=form.querySelector('[role="status"]');
      button.disabled=true;status.textContent='Working…';
      try {await handler(Object.fromEntries(new FormData(form)),status,form);} catch(error){status.textContent=error.message || 'Unable to connect. Please try again.';}
      finally {button.disabled=false;}
    });
  }
  const submit = text => `<button class="btn" type="submit">${esc(text)}</button><p class="status" role="status" aria-live="polite"></p>`;
  const field = (name,label,type='text',extra='') => `<label class="field">${label}<input name="${name}" type="${type}" ${extra} required></label>`;
  function authPrompt(version,action) {setBody(heading('Make yourself at home',`Log in or create an account to ${action}.`)+'<div class="actions"><a class="btn" href="#login">Log in</a><a class="btn outline" href="#signup">Create account</a></div>',version);}
  async function requireUser(version,action) {await refreshUser();if(version!==routeVersion)return false;if(!user){authPrompt(version,action);return false;}return true;}
  function loadTurnstile() {
    if(window.turnstile)return Promise.resolve(window.turnstile);
    if(!turnstilePromise)turnstilePromise=new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
      const timer=setTimeout(()=>reject(new Error('Verification could not load. Refresh and try again.')),15000);
      script.onload=()=>{clearTimeout(timer);resolve(window.turnstile);};script.onerror=()=>{clearTimeout(timer);reject(new Error('Verification could not load. Refresh and try again.'));};document.head.append(script);
    });return turnstilePromise;
  }
  async function auth(mode,version) {
    const signup=mode==='signup';
    setBody(heading(signup?'Join the ride.':'Welcome back.',signup?'Your bikes, your event plans, your community.':'Log in to pick up where you left off.')+`<form id="auth-form">${signup?field('email','Email address','email','autocomplete="email" maxlength="254"')+field('username','Username','text','autocomplete="username" pattern="[A-Za-z0-9_]{3,30}" minlength="3" maxlength="30" title="3–30 letters, numbers, or underscores"'):field('identity','Email or username','text','autocomplete="username" maxlength="254"')}${field('password',signup?'Password (at least 10 characters)':'Password','password',`autocomplete="${signup?'new-password':'current-password'}" ${signup?'minlength="10"':''} maxlength="1024"`)}${signup?'<div id="human-check"></div>':''}${submit(signup?'Create account':'Log in')}</form><p class="auth-switch">${signup?'Already part of the community? <a class="textlink" href="#login">Log in →</a>':'New here? <a class="textlink" href="#signup">Create an account →</a>'}</p>`,version);
    bindForm('auth-form',async (data,status)=>{
      data.turnstileToken = signup && widget!==null && window.turnstile ? window.turnstile.getResponse(widget) : '';
      if(signup && config.siteKey && !data.turnstileToken) throw new Error('Complete the human verification first.');
      try {const result=await post('/api/auth/'+mode,data);user=result.user;unreadCount=null;updateAccount();void refreshNotices();closeDialog();toast(signup?'Your account is ready. Welcome to Bike Portal!':'You are logged in.');}
      finally {if(signup && widget!==null && window.turnstile)window.turnstile.reset(widget);}
    });
    if(signup && config.siteKey){try {const turnstile=await loadTurnstile();if(version===routeVersion && dialog.open)widget=turnstile.render('#human-check',{sitekey:config.siteKey,'error-callback':()=>{const s=$('#auth-form [role="status"]');if(s)s.textContent='Verification is unavailable. Refresh and try again.';}});}catch(error){if(version===routeVersion)$('#auth-form [role="status"]').textContent=error.message;}}
  }
  function result(kind,id,title,summary,meta) {return `<a class="result" href="${link(kind,id)}"><span class="tag">${esc(meta || kind)}</span><h3>${esc(title)} ↗</h3>${summary?`<p>${esc(summary)}</p>`:''}</a>`;}
  async function guide(id,version){
    const data=await catalog();const g=data.guides.find(g=>g.slug===id || g.id===id);if(!g)throw new Error('This guide is not available. Browse all guides to find another.');
    if(!setBody(heading(g.title,g.summary)+`<div class="prose">${esc(g.body_markdown)}</div><h3 style="margin-top:26px">Sources & further reading</h3><div class="sources">${parseArray(g.source_urls_json).map(url=>external(url,new URL(safeURL(url).replace(/&amp;/g,'&') || 'https://example.invalid').hostname)).join('<br>')}</div>${g.discussion_prompt?`<div class="list-item"><strong>Talk about it</strong><p>${esc(g.discussion_prompt)}</p><a class="textlink" href="#new-discussion">Start a conversation →</a></div>`:''}<div class="actions"><a class="btn outline" href="#all-guides">All guides</a></div>`,version))return;
  }
  async function allGuides(version){const data=await catalog();setBody(heading('The riding library','Maintenance, preparation, and practical advice from the Bike Portal collection.')+data.guides.map(g=>result('guide',g.slug,g.title,g.summary,g.cluster)).join(''),version);}
  async function eventDetail(id,version){
    const {event:e,user_status:status}=await api('/api/events/'+encodeURIComponent(id));
    if(!setBody(heading(e.title)+`<p class="detail-meta">${esc(e.start_date)}${e.end_date && e.end_date!==e.start_date?' – '+esc(e.end_date):''} · ${esc(e.city)}, ${esc(e.state)}<br>${esc(e.venue_name || '')}<br>${esc(e.address || '')}</p><div class="actions">${(e.disciplines || []).map(d=>`<span class="tag">${esc(d)}</span>`).join('')}</div><p>${esc(e.distances?.length?'Distances: '+e.distances.join(' / ')+' miles':'See the organizer for distances and route information.')}</p>${e.notes?`<p class="prose">${esc(e.notes)}</p>`:''}<div class="actions">${external(e.source_url,'Organizer details')}${external(e.registration_url,'Registration')}</div><p class="note">Directory status: ${esc(e.verification_status)}${e.verified_on?' · Last checked '+esc(e.verified_on):''}. Confirm current details with the organizer.</p><h3 style="margin-top:28px">Your ride plans</h3><p id="event-status">${status?'Your plan: '+esc(status):'Choose a status to keep track of this event.'}</p><div class="actions" id="event-actions">${['interested','going','completed'].map(value=>`<button class="btn outline" data-status="${value}" aria-pressed="${status===value}">${value[0].toUpperCase()+value.slice(1)}</button>`).join('')}</div><p class="status" role="status" id="event-feedback"></p><a class="textlink" href="#guide/event-week-bike-prep-checklist">Get ready with the event-week checklist →</a>`,version))return;
    await communityTools('event',e.id,version);
    if(version!==routeVersion)return;
    $('#event-actions').onclick=async click=>{const button=click.target.closest('[data-status]');if(!button)return;const feedback=$('#event-feedback');button.disabled=true;try {await post('/api/events/'+encodeURIComponent(e.id)+'/status',{status:button.dataset.status});if(version!==routeVersion)return;$('#event-status').textContent='Your plan: '+button.dataset.status;document.querySelectorAll('[data-status]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));feedback.textContent='Your event plan is saved.';}catch(error){if(error.status===401){authPrompt(version,'save your event plans');}else feedback.textContent=error.message;}finally{button.disabled=false;}};
  }
  function texasEvents(events){return events.filter(e=>['TX','TEXAS'].includes(String(e.state).toUpperCase()) && e.start_date>=config.today && !/cancel|excluded|pending|unverified/i.test(e.verification_status || ''));}
  async function allEvents(version){const data=await api('/api/events?from='+config.today+'&limit=100');const events=texasEvents(data.events);setBody(heading('Your next Texas ride','Upcoming events in the current directory. Confirm dates and registration with each organizer.')+`<label class="field">Filter by city or discipline<input id="event-filter" type="search" placeholder="Try Austin, road, or gravel"></label><div id="event-results"></div>`,version);if(version!==routeVersion)return;const render=()=>{const q=$('#event-filter').value.toLowerCase();const matches=events.filter(e=>[e.title,e.city,...(e.disciplines || [])].join(' ').toLowerCase().includes(q));$('#event-results').innerHTML=matches.length?matches.map(e=>result('event',e.id,e.title,e.start_date+' · '+e.city+', Texas',(e.disciplines || ['cycling'])[0])).join(''):'<p class="empty">No upcoming events match. Try another city or discipline.</p>';};$('#event-filter').oninput=render;render();}
  async function discover(brandId,version){
    const data=await catalog();const selected=data.brands.find(b=>b.id===brandId);let active=selected?.id || '';
    if(!setBody(heading(selected?selected.name:'Find your kind of bike','Explore the brand and model-family directory. Follow manufacturer links for current specifications.')+`<div class="filters" id="brand-filters"><button class="brand" data-brand="" aria-pressed="${!active}">All brands</button>${data.brands.map(b=>`<button class="brand" data-brand="${esc(b.id)}" aria-pressed="${active===b.id}">${esc(b.name)}</button>`).join('')}</div><div id="bike-results" class="grid"></div><div class="actions"><a class="btn outline" href="#garage">Open your Bike Garage →</a></div>`,version))return;
    const render=()=>{const bikes=data.bikes.filter(b=>!active || b.brand_id===active);$('#bike-results').innerHTML=bikes.length?bikes.map(b=>`<article class="card"><span class="tag">${esc(b.brand_name)}</span><h3><a href="${link('bike',b.slug)}">${esc(b.name)}</a></h3><p>${esc(b.enrichment?.summary||parseArray(b.disciplines_json).join(' · '))}</p><a class="textlink" href="${link('bike',b.slug)}">Specifications and sources →</a></article>`).join(''):'<p class="empty">This brand is in the directory; its model families have not been added yet.</p>';};
    $('#brand-filters').onclick=click=>{const button=click.target.closest('[data-brand]');if(!button)return;active=button.dataset.brand;document.querySelectorAll('[data-brand]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();};render();
  }
  async function discussion(id,version){
    const {discussion:d,comments}=await api('/api/discussions/'+encodeURIComponent(id));
    if(!setBody(heading(d.title)+`<p class="meta">${esc(d.display_name || d.username)} · ${esc(d.created_at?.slice(0,10))}</p><div class="prose">${esc(d.body)}</div><h3 style="margin-top:28px">${comments.length} replies</h3>${comments.map(c=>`<article class="comment"><span class="meta">${esc(c.display_name || c.username)} · ${esc(c.created_at?.slice(0,10))}</span><p>${esc(c.body)}</p></article>`).join('')}${d.status==='published'?`<form id="reply-form"><label class="field">Add your reply<textarea name="body" maxlength="5000" required></textarea></label>${submit('Post reply')}</form>`:'<p class="empty">This discussion is closed to replies.</p>'}`,version))return;
    await communityTools('discussion',d.id,version);
    bindForm('reply-form',async(data,status)=>{try{await post('/api/discussions/'+encodeURIComponent(d.id)+'/comments',data);toast('Your reply was posted.');await discussion(id,version);}catch(error){if(error.status===401)status.innerHTML='Please <a class="textlink" href="#login">log in</a> to reply. Your reply has not been posted.';else throw error;}});
  }
  async function newDiscussion(version){if(!await requireUser(version,'start a conversation'))return;setBody(heading('Start a conversation','Ask a question, share what you learned, or introduce yourself.')+`<form id="discussion-form">${field('title','Title','text','maxlength="140"')}<label class="field">Your post<textarea name="body" maxlength="10000" required></textarea></label>${submit('Post discussion')}</form>`,version);bindForm('discussion-form',async data=>{const d=await post('/api/discussions',data);location.hash='discussion/'+encodeURIComponent(d.id);toast('Your discussion is live.');});}
  async function garage(version){
    if(!await requireUser(version,'manage your Bike Garage'))return;const [{bikes},catalogData]=await Promise.all([api('/api/garage'),catalog()]);const catalogBikes=catalogData.bikes||[],types=[...new Set(catalogBikes.flatMap(model=>parseArray(model.disciplines_json)))].sort(),option=model=>`${esc(model.brand_name)} ${esc(model.name)}`;
    if(!setBody(heading('Your Bike Garage','Keep your bikes and setup notes in one place.')+(bikes.length?bikes.map(b=>`<article class="list-item"><h3>${esc(b.nickname || b.model_name || b.custom_model || 'My bike')}</h3><p>${esc([b.brand_name || b.custom_brand,b.model_name || b.custom_model,b.model_year].filter(Boolean).join(' · '))}</p><p>${esc(b.notes)}</p><button class="btn outline" data-delete-bike="${esc(b.id)}">Remove bike</button></article>`).join(''):'<p class="empty">Your garage is ready for its first bike.</p>')+`<h3>Add a bike</h3><form id="garage-form"><label class="field">Bike type<select id="garage-bike-type"><option value="">All included bike types</option>${types.map(type=>`<option value="${esc(type)}">${esc(type)}</option>`).join('')}</select></label>${field('custom_brand','Brand','text','maxlength="80"')}<label class="field">Model<input id="garage-model" name="custom_model" list="garage-model-options" maxlength="100" placeholder="Search included models or enter your own" required><datalist id="garage-model-options">${catalogBikes.map(model=>`<option value="${option(model)}"></option>`).join('')}</datalist></label><p class="meta">Choose a type to narrow included models. You can still enter a custom brand or model.</p><label class="field">Nickname (optional)<input name="nickname" maxlength="80"></label><label class="field">Model year (optional)<input name="model_year" type="number" min="1880" max="2100"></label><label class="field">Setup notes (optional)<textarea name="notes" maxlength="1000"></textarea></label>${submit('Add to garage')}</form>`,version))return;
    body.querySelectorAll('[data-delete-bike]').forEach(button=>button.onclick=async()=>{if(!confirm('Remove this bike from your garage? This cannot be undone.'))return;button.disabled=true;try{await api('/api/garage/'+encodeURIComponent(button.dataset.deleteBike),{method:'DELETE'});await garage(version);}catch(error){toast(error.message);button.disabled=false;}});
    const typeSelect=$('#garage-bike-type'),modelInput=$('#garage-model'),modelOptions=$('#garage-model-options'),brandInput=body.querySelector('[name=custom_brand]');const updateModels=()=>{const type=typeSelect.value;const shown=catalogBikes.filter(model=>!type||parseArray(model.disciplines_json).includes(type));modelOptions.innerHTML=shown.map(model=>`<option value="${option(model)}"></option>`).join('');};typeSelect.onchange=updateModels;modelInput.onchange=()=>{const selected=catalogBikes.find(model=>`${model.brand_name} ${model.name}`===modelInput.value);if(selected){brandInput.value=selected.brand_name;modelInput.value=selected.name;}};
    bindForm('garage-form',async data=>{delete data.bike_type;data.model_year=data.model_year?Number(data.model_year):null;data.is_current=true;await post('/api/garage',data);toast('Bike added to your garage.');await garage(version);});
  }
  async function notifications(version){if(!await requireUser(version,'see your notifications'))return;const data=await api('/api/notifications');unreadCount=data.unread_count;updateAccount();if(!setBody(heading('Your notifications')+(data.notifications.length?data.notifications.map(n=>`<article class="list-item"><p>${esc(n.message)}</p>${n.entity_type==='discussion'?`<a class="textlink" href="${link('discussion',n.entity_id)}">View discussion →</a>`:''}${!n.read_at?` <button class="btn outline" data-read="${esc(n.id)}">Mark as read</button>`:'<span class="meta">Read</span>'}</article>`).join(''):'<p class="empty">You are all caught up.</p>'),version))return;body.querySelectorAll('[data-read]').forEach(button=>button.onclick=async()=>{button.disabled=true;try{await post('/api/notifications/'+encodeURIComponent(button.dataset.read)+'/read');await notifications(version);}catch(error){toast(error.message);button.disabled=false;}});}
  async function search(query,version){
    const term=query.trim().slice(0,120);if(!term){setBody(heading('Search Bike Portal','Enter a word or phrase in the homepage search.'),version);return;}
    const contains=(...values)=>values.join(' ').toLowerCase().includes(term.toLowerCase());
    const results=await Promise.allSettled([catalog(),api('/api/events?from='+config.today+'&limit=100'),api('/api/discussions?limit=50')]);
    let matches=[];const [c,ev,d]=results;
    if(c.status==='fulfilled'){
      matches.push(...c.value.guides.filter(g=>contains(g.title,g.summary,g.cluster,g.body_markdown)).map(g=>result('guide',g.slug,g.title,g.summary,'Guide')));
      matches.push(...c.value.brands.filter(b=>contains(b.name)).map(b=>result('brand',b.id,b.name,'Explore this brand’s model families.','Brand')));
      matches.push(...c.value.bikes.filter(b=>contains(b.brand_name,b.name,b.disciplines_json)).map(b=>result('bike',b.slug,b.brand_name+' '+b.name,parseArray(b.disciplines_json).join(' · '),'Bike')));
    }
    if(ev.status==='fulfilled')matches.push(...texasEvents(ev.value.events).filter(e=>contains(e.title,e.city,...(e.disciplines||[]))).map(e=>result('event',e.id,e.title,e.start_date+' · '+e.city,'Event')));
    if(d.status==='fulfilled')matches.push(...d.value.discussions.filter(d=>contains(d.title,d.body)).map(d=>result('discussion',d.id,d.title,d.body.slice(0,170),'Discussion')));
    const failed=results.filter(r=>r.status==='rejected').length;
    setBody(heading('Search: '+term,`${matches.length} results from published guides, bikes and brands, up to 100 upcoming events, and the 50 latest discussions.`)+(failed?'<p class="empty">Some sections could not be searched. Close and retry to load them.</p>':'')+(matches.join('') || '<p class="empty">No matches found. Try a brand, city, discipline, or maintenance topic.</p>'),version);
  }
  async function route(){
    const raw=location.hash.slice(1);const slash=raw.indexOf('/');const kind=slash<0?raw:raw.slice(0,slash);let id;try{id=decodeURIComponent(slash<0?'':raw.slice(slash+1));}catch{id='';}
    const routes=new Set(['login','signup','logout','guide','all-guides','event','all-events','discover','brand','discussion','new-discussion','garage','notifications','search','profile','saved','report','moderation']);
    const version=++routeVersion;
    if(widget!==null && window.turnstile){window.turnstile.remove(widget);widget=null;}
    if(!routes.has(kind)){if(dialog.open)dialog.close();return;}
    if(!dialog.open)dialog.showModal();setBody(heading('Loading…'),version);
    try{
      if(kind==='login' || kind==='signup')await auth(kind,version);
      if(kind==='logout'){await post('/api/auth/logout');user=null;unreadCount=null;noticeRequest++;updateAccount();closeDialog();toast('You are logged out.');}
      if(kind==='guide')await guide(id,version);
      if(kind==='all-guides')await allGuides(version);
      if(kind==='event')await eventDetail(id,version);
      if(kind==='all-events')await allEvents(version);
      if(kind==='discover' || kind==='brand')await discover(id,version);
      if(kind==='discussion')await discussion(id,version);
      if(kind==='new-discussion')await newDiscussion(version);
      if(kind==='garage')await garage(version);
      if(kind==='notifications')await notifications(version);
      if(kind==='search')await search(id,version);
      if(kind==='profile')await profile(version);
      if(kind==='saved')await savedItems(version);
      if(kind==='report')await reportItem(id,version);
      if(kind==='moderation')await moderation(version);
    }catch(error){setBody(heading('Unable to load this view')+`<p class="status" role="status">${esc(error.message || 'Please check your connection and try again.')}</p><button class="btn" id="retry-view">Try again</button>`,version);if(version===routeVersion && $('#retry-view'))$('#retry-view').onclick=route;}
    if(version===routeVersion && dialog.open)$('#detail-title')?.focus();
  }
  if($('#portal-search'))$('#portal-search').onsubmit=event=>{event.preventDefault();const query=$('#search-input').value.trim();if(!query)return;const hash='#search/'+encodeURIComponent(query);if(location.hash===hash)route();else location.hash=hash;};
  const siteMenu=document.querySelector('.site-menu');
  if(siteMenu){siteMenu.addEventListener('click',event=>{if(event.target.closest('a'))siteMenu.removeAttribute('open');});document.addEventListener('keydown',event=>{if(event.key==='Escape')siteMenu.removeAttribute('open');});}
  window.addEventListener('hashchange',route);
  const query=new URLSearchParams(location.search).get('q');if(query && !location.hash && $('#portal-search')){$('#search-input').value=query;history.replaceState(null,'','#search/'+encodeURIComponent(query));}
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)void refreshUser();});
  window.addEventListener('focus',()=>{void refreshUser();});
  setInterval(()=>{if(!document.hidden && user)void refreshNotices();},60000);
  refreshUser();route();
}
