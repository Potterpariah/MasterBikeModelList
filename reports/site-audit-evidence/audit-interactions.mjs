import {createServer} from 'node:http';
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const root='C:/Development/bike-portal-texas-catalog-integration/';
const {localEnv}=await import(pathToFileURL(root+'scripts/local-db.js'));
const {default:worker}=await import(pathToFileURL(root+'src/worker.js'));
const env=localEnv(),out=new URL('./audit-interactions/',import.meta.url);await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{const r=await worker.fetch(new Request('http://127.0.0.1:'+server.address().port+req.url),env);res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));}catch(e){res.writeHead(500);res.end(String(e));}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const profile=new URL('./chrome-profile-'+Date.now()+'/',out);await mkdir(profile,{recursive:true});
const chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+decodeURIComponent(profile.pathname).replace(/^\//,''),'about:blank'],{windowsHide:true,stdio:'ignore'});
let ws,seq=0;const pending=new Map();const results=[];const watchdog=setTimeout(()=>{console.error('Browser check timed out');chrome.kill();process.exit(2);},180000).unref();
try{
 let port;for(let i=0;i<100;i++){try{port=(await readFile(new URL('DevToolsActivePort',profile),'utf8')).split('\n')[0];break;}catch{}await new Promise(r=>setTimeout(r,100));}if(!port)throw Error('Chrome debugging unavailable');
 console.log('CDP port',port);const tabs=await(await fetch('http://127.0.0.1:'+port+'/json')).json();console.log('Tab discovery done');ws=new WebSocket(tabs.find(t=>t.type==='page'&&t.url==='about:blank').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));ws.addEventListener('message',e=>{const x=JSON.parse(e.data);if(x.id){const p=pending.get(x.id);pending.delete(x.id);x.error?p.reject(x.error):p.resolve(x.result);}});
 const cmd=(method,params={})=>new Promise((resolve,reject)=>{console.log('CDP',method);const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>(await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
 console.log('WebSocket connected');await cmd('Page.enable');await cmd('Network.enable');

 const tiles=[];ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.method==='Network.responseReceived'&&m.params.response.url.includes('tile.openstreetmap.org'))tiles.push({url:m.params.response.url,status:m.params.response.status,mime:m.params.response.mimeType});});
 const base='http://127.0.0.1:'+server.address().port;
 for(const width of [320,375,390,768,1280]) {
 await cmd('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
 await cmd('Page.navigate',{url:base+'/events?q=Austin'});await new Promise(r=>setTimeout(r,500));
 await evaluate(`document.querySelector('.site-menu summary').click()`);
 const menu=await evaluate(`({open:document.querySelector('.site-menu').open,overflow:document.documentElement.scrollWidth>innerWidth,logo:!!document.querySelector('header .logo svg'),panel:document.querySelector('.site-menu-panel').getBoundingClientRect().toJSON()})`);
 await writeFile(new URL('menu-'+width+'.png',out),Buffer.from((await cmd('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await evaluate(`document.querySelector('.site-menu summary').click();document.querySelector('[data-event-location]').click()`);await new Promise(r=>setTimeout(r,width===320?3500:1300));
 const map=await evaluate(`({open:document.querySelector('#event-location-map').open,rows:JSON.parse(document.getElementById('event-map-records').textContent),loadedTiles:[...document.querySelectorAll('.leaflet-tile')].filter(x=>x.complete&&x.naturalWidth>0).length,attribution:document.querySelector('.leaflet-control-attribution')?.textContent,markers:document.querySelectorAll('.leaflet-marker-icon').length,status:document.getElementById('event-map-status').textContent,overflow:document.documentElement.scrollWidth>innerWidth,transform:document.querySelector('.leaflet-map-pane').style.transform})`);
 await writeFile(new URL('map-'+width+'.png',out),Buffer.from((await cmd('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await evaluate(`document.querySelector('.leaflet-control-zoom-in').click()`);await new Promise(r=>setTimeout(r,350));map.zoomChanged=await evaluate(`document.querySelector('.leaflet-map-pane').style.transform!==${JSON.stringify(map.transform)} || document.querySelector('.leaflet-tile-container').style.transform!==''`);
 await evaluate(`document.querySelector('.leaflet-marker-icon')?.click()`);map.popup=await evaluate(`({text:document.querySelector('.leaflet-popup-content')?.textContent,href:document.querySelector('.leaflet-popup-content a')?.getAttribute('href')})`);
 if(map.popup.href){await evaluate(`document.querySelector('.leaflet-popup-content a').click()`);await new Promise(r=>setTimeout(r,450));map.detailWorks=await evaluate(`location.pathname===${JSON.stringify(map.popup.href)}`);await evaluate(`history.back()`);await new Promise(r=>setTimeout(r,450));map.backFilters=await evaluate(`location.search==='?q=Austin'`);}
 await evaluate(`if(!document.querySelector('#event-location-map').open)document.querySelector('[data-event-location]').click()`);await cmd('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await cmd('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});map.escape=await evaluate(`!document.querySelector('#event-location-map').open&&document.activeElement.hasAttribute('data-event-location')`);
 results.push({width,menu,map});
 }
 await cmd('Network.setBlockedURLs',{urls:['*tile.openstreetmap.org*']});await cmd('Page.navigate',{url:base+'/texas/events?discipline=MTB'});await new Promise(r=>setTimeout(r,400));await evaluate(`document.querySelector('[data-event-location]').click()`);await new Promise(r=>setTimeout(r,1400));const tileFailure=await evaluate(`({status:document.getElementById('event-map-status').textContent,markers:document.querySelectorAll('.leaflet-marker-icon').length})`);
 await cmd('Network.setBlockedURLs',{urls:['*leaflet.js*']});await cmd('Page.navigate',{url:base+'/texas/events?discipline=MTB'});await new Promise(r=>setTimeout(r,400));await evaluate(`document.querySelector('.grid [data-event-location]').click()`);const libraryFailure=await evaluate(`({status:document.getElementById('event-map-status').textContent,href:document.querySelector('#event-location-note a')?.href})`);
 await cmd('Network.setBlockedURLs',{urls:[]});await cmd('Page.navigate',{url:base+'/events?q=no-such-place'});await new Promise(r=>setTimeout(r,350));await evaluate(`document.querySelector('[data-event-location]').click()`);const empty=await evaluate(`({status:document.getElementById('event-location-note').textContent,markers:document.querySelectorAll('.leaflet-marker-icon').length})`);
 await cmd('Page.navigate',{url:base+'/'});await new Promise(r=>setTimeout(r,350));const dialogs=[];for(const hash of ['garage','saved','notifications','new-discussion','invite','profile','moderation','login']){await evaluate(`location.hash=${JSON.stringify(hash)}`);await new Promise(r=>setTimeout(r,250));dialogs.push(await evaluate(`({hash:location.hash,open:document.querySelector('#detail-dialog').open,text:document.querySelector('#detail-body').innerText.slice(0,130)})`));}
 await writeFile(new URL('results.json',out),JSON.stringify({results,tiles,tileFailure,libraryFailure,empty,dialogs},null,2));console.log('INTERACTIONS_DONE');await cmd('Browser.close');
}finally{ws?.close();chrome.kill();await new Promise(r=>server.close(r));env._db.close();}






