import {createServer} from 'node:http';
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const root='C:/Development/bike-portal-texas-catalog-integration/';
const {localEnv}=await import(pathToFileURL(root+'scripts/local-db.js'));
const {default:worker}=await import(pathToFileURL(root+'src/worker.js'));
const env=localEnv(),out=new URL('./audit-format-final/',import.meta.url);await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{const r=await worker.fetch(new Request('http://127.0.0.1:'+server.address().port+req.url),env);res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));}catch(e){res.writeHead(500);res.end(String(e));}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const profile=new URL('./chrome-profile-'+Date.now()+'/',out);await mkdir(profile,{recursive:true});
const chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+decodeURIComponent(profile.pathname).replace(/^\//,''),'about:blank'],{windowsHide:true,stdio:'ignore'});
let ws,seq=0;const pending=new Map();const results=[];const watchdog=setTimeout(()=>{console.error('Browser check timed out');chrome.kill();process.exit(2);},300000).unref();
try{
 let port;for(let i=0;i<100;i++){try{port=(await readFile(new URL('DevToolsActivePort',profile),'utf8')).split('\n')[0];break;}catch{}await new Promise(r=>setTimeout(r,100));}if(!port)throw Error('Chrome debugging unavailable');
 console.log('CDP port',port);const tabs=await(await fetch('http://127.0.0.1:'+port+'/json')).json();console.log('Tab discovery done');ws=new WebSocket(tabs.find(t=>t.type==='page'&&t.url==='about:blank').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));ws.addEventListener('message',e=>{const x=JSON.parse(e.data);if(x.id){const p=pending.get(x.id);pending.delete(x.id);x.error?p.reject(x.error):p.resolve(x.result);}});
 const cmd=(method,params={})=>new Promise((resolve,reject)=>{console.log('CDP',method);const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>(await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
 console.log('WebSocket connected');await cmd('Page.enable');await cmd('Network.enable');
 for(const origin of ['http://127.0.0.1:'+server.address().port]) for(const width of [1280,320]) {
 await cmd('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
 for(const path of ['/events?format=General%20%2F%20social%20ride','/events?format=Noncompetitive%20ride','/events?format=Social%20%2F%20community%20ride']) {
 await cmd('Page.navigate',{url:origin+path}); await new Promise(r=>setTimeout(r,650));
 const helpExists=await evaluate(`!!document.querySelector('.section-help summary')`);let help=null;if(helpExists){await evaluate(`document.querySelector('.section-help summary').focus()`);await cmd('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});await cmd('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});help=await evaluate(`({open:document.querySelector('.section-help details').open,caveat:document.querySelector('.section-help-essential').textContent,focus:document.activeElement.tagName})`);}
 const state=await evaluate(`({title:document.title,url:location.href,overflow:document.documentElement.scrollWidth>innerWidth,logo:!!document.querySelector('header .logo svg'),h1:[...document.querySelectorAll('h1')].map(x=>x.textContent),svgMap:!!document.querySelector('.event-start-map-canvas svg'),realMap:!!document.querySelector('#event-map-records'),smallControls:[...document.querySelectorAll('input,select,button,summary')].filter(e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height<44).map(e=>({tag:e.tagName,text:e.textContent.slice(0,35),height:e.getBoundingClientRect().height}))})`);
 if(helpExists)await evaluate(`document.querySelector('.section-help').scrollIntoView({block:'start'})`);const shot=await cmd('Page.captureScreenshot',{format:'png'}); const filename=(origin.startsWith('https')?'live':'local')+'-'+width+'-'+(path.replaceAll('/','_').replaceAll('?','_').replaceAll('%','_')||'home')+'.png';await writeFile(new URL(filename,out),Buffer.from(shot.data,'base64'));results.push({...state,width,path,screenshot:filename,help});
 }
 }
 await writeFile(new URL('baseline.json',out),JSON.stringify(results,null,2));console.log('RESULTS',results.length);await cmd('Browser.close');
}finally{ws?.close();chrome.kill();await new Promise(r=>server.close(r));env._db.close();}






