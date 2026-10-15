import {createServer} from 'node:http';
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const root='C:/Development/bike-portal-texas-catalog-integration/';
const {localEnv}=await import(pathToFileURL(root+'scripts/local-db.js'));
const {default:worker}=await import(pathToFileURL(root+'src/worker.js'));
const env=localEnv(),out=new URL('./audit-pan/',import.meta.url);await mkdir(out,{recursive:true});
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


 const errors=[];ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);});await cmd('Runtime.enable');
 await cmd('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:true});await cmd('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/events?q=Austin'});await new Promise(r=>setTimeout(r,400));await evaluate(`document.querySelector('[data-event-location]').click()`);await new Promise(r=>setTimeout(r,800));
 const before=await evaluate(`({rect:document.querySelector('#interactive-event-map').getBoundingClientRect().toJSON(),transform:document.querySelector('.leaflet-map-pane').style.transform})`);const x=before.rect.x+70,y=before.rect.y+100;
 await cmd('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});for(let i=1;i<=8;i++)await cmd('Input.dispatchMouseEvent',{type:'mouseMoved',x:x+i*10,y:y+i*3,button:'left',buttons:1});await cmd('Input.dispatchMouseEvent',{type:'mouseReleased',x:x+80,y:y+24,button:'left',clickCount:1});await new Promise(r=>setTimeout(r,400));
 const after=await evaluate(`document.querySelector('.leaflet-map-pane').style.transform`);await writeFile(new URL('pan.json',out),JSON.stringify({before:before.transform,after,changed:before.transform!==after,errors},null,2));await cmd('Browser.close');
}finally{ws?.close();chrome.kill();await new Promise(r=>server.close(r));env._db.close();}






