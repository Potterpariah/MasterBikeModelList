import {createServer} from 'node:http';
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const root='C:/Development/bike-portal-texas-catalog-integration/';
const {localEnv}=await import(pathToFileURL(root+'scripts/local-db.js'));
const {default:worker}=await import(pathToFileURL(root+'src/worker.js'));
const env=localEnv(),out=new URL('./event-browser-evidence/',import.meta.url);await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{const r=await worker.fetch(new Request('http://127.0.0.1:'+server.address().port+req.url),env);res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));}catch(e){res.writeHead(500);res.end(String(e));}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const profile=new URL('./chrome-profile-'+Date.now()+'/',out);await mkdir(profile,{recursive:true});
const chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+decodeURIComponent(profile.pathname).replace(/^\//,''),'about:blank'],{windowsHide:true,stdio:'ignore'});
let ws,seq=0;const pending=new Map();const results=[];const watchdog=setTimeout(()=>{console.error('Browser check timed out');chrome.kill();process.exit(2);},55000).unref();
try{
 let port;for(let i=0;i<100;i++){try{port=(await readFile(new URL('DevToolsActivePort',profile),'utf8')).split('\n')[0];break;}catch{}await new Promise(r=>setTimeout(r,100));}if(!port)throw Error('Chrome debugging unavailable');
 console.log('CDP port',port);const tabs=await(await fetch('http://127.0.0.1:'+port+'/json')).json();console.log('Tab discovery done');ws=new WebSocket(tabs.find(t=>t.type==='page'&&t.url==='about:blank').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));ws.addEventListener('message',e=>{const x=JSON.parse(e.data);if(x.id){const p=pending.get(x.id);pending.delete(x.id);x.error?p.reject(x.error):p.resolve(x.result);}});
 const cmd=(method,params={})=>new Promise((resolve,reject)=>{console.log('CDP',method);const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>(await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
 console.log('WebSocket connected');await cmd('Page.enable');await cmd('Network.enable');await cmd('Network.setBlockedURLs',{urls:['https://*']});
 for(const width of [1280,320,375,390,768]){
  await cmd('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
  for(const path of ['/texas/events?region=North&discipline=MTB','/texas/events?q=no-such-place','/events']){
   console.log('NAV',await cmd('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+path}));await new Promise(r=>setTimeout(r,600));
   const state=await evaluate(`({title:document.title,url:location.href,body:document.body.innerText.slice(0,180),cards:document.querySelectorAll('.grid .card').length,mapRows:document.getElementById('event-map-records')?JSON.parse(document.getElementById('event-map-records').textContent).length:null,overflow:document.documentElement.scrollWidth>innerWidth,status:[...document.querySelectorAll('[role=status]')].map(e=>e.textContent),smallControls:[...document.querySelectorAll('main input,main select,main button')].filter(e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height<44).map(e=>({tag:e.tagName,text:e.textContent.slice(0,30),height:e.getBoundingClientRect().height})),monthControls:document.querySelectorAll('input[type=month]').length})`);
   if(path.startsWith('/texas/events')){await evaluate(`document.querySelector('[data-event-location]').click()`);await new Promise(r=>setTimeout(r,500));state.dialog=await evaluate(`({open:document.querySelector('#event-location-map').open,note:document.querySelector('#event-location-note').textContent,status:document.querySelector('#event-map-status').textContent,markers:document.querySelectorAll('.event-location-pin').length})`);await cmd('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await cmd('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});state.escapeClosed=await evaluate(`!document.querySelector('#event-location-map').open`);state.focusRestored=await evaluate(`document.activeElement.hasAttribute('data-event-location')`);}
   if(path.includes('discipline=MTB')){const target=await evaluate(`document.querySelector('.grid .card h2 a').getAttribute('href')`);await evaluate(`document.querySelector('.grid .card h2 a').click()`);await new Promise(r=>setTimeout(r,350));state.detailLinkWorks=await evaluate(`location.pathname===${JSON.stringify(target)}`);await evaluate(`history.back()`);await new Promise(r=>setTimeout(r,350));state.backPreservesFilters=await evaluate(`location.search==='?region=North&discipline=MTB'`);}
   const shot=await cmd('Page.captureScreenshot',{format:'png'});await writeFile(new URL(width+'-'+results.length+'.png',out),Buffer.from(shot.data,'base64'));results.push({width,path,...state});
  }
 }
 await cmd('Network.setBlockedURLs',{urls:['https://*','*leaflet.js*']});await cmd('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/texas/events?region=North&discipline=MTB'});await new Promise(r=>setTimeout(r,500));await evaluate(`document.querySelector('.grid [data-event-location]').click()`);const fallback=await evaluate(`({message:document.getElementById('event-map-status').textContent,link:document.querySelector('#event-location-note a')?.href,open:document.getElementById('event-location-map').open})`);await writeFile(new URL('library-fallback.json',out),JSON.stringify(fallback,null,2));console.log('LIBRARY_FALLBACK',fallback);
 await writeFile(new URL('after.json',out),JSON.stringify(results,null,2));console.log(JSON.stringify(results));await cmd('Browser.close');
}finally{ws?.close();chrome.kill();await new Promise(r=>server.close(r));env._db.close();}






