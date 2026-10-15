import {open,mkdir,readFile,writeFile,rename,unlink} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {randomUUID} from 'node:crypto';
import {refreshEvents} from './event-refresh.mjs';
// Local review artifacts only; never publishes candidates or registers a scheduler.
export async function runLocalRefresh({registry,outputPath,...options}){
 const dir=resolve(outputPath);await mkdir(dir,{recursive:true});
 const lockPath=join(dir,'refresh.lock');let lock;
 try{lock=await open(lockPath,'wx');}catch(e){if(e.code==='EEXIST')throw Error('Refresh already running or interrupted lock requires review');throw e;}
 let temporary;
 try{
  await lock.writeFile(JSON.stringify({pid:process.pid,startedAt:new Date().toISOString()}));
  let previous={};try{previous=JSON.parse(await readFile(join(dir,'state.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
  const result=await refreshEvents({...options,sources:registry.sources,previous,timeZone:registry.timeZone});
  if(!result.skipped){
   const id=randomUUID(),body=JSON.stringify(result,null,2);
   // Write audit evidence before replacing state. Any failed state write leaves the prior state intact.
   await writeFile(join(dir,'run-'+id+'.json'),body,{flag:'wx'});
   temporary=join(dir,'state-'+id+'.tmp');await writeFile(temporary,body,{flag:'wx'});
   await rename(temporary,join(dir,'state.json'));temporary=undefined;
  }
  return result;
 }finally{
  try{if(temporary)await unlink(temporary).catch(e=>{if(e.code!=='ENOENT')throw e;});}
  finally{try{await lock.close();}finally{await unlink(lockPath);}}
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const [registryPath,outputPath]=process.argv.slice(2);
 if(!registryPath||!outputPath)throw Error('Usage: node scripts/run-event-refresh.mjs <source-registry.json> <disposable-output-directory>');
 const registry=JSON.parse(await readFile(resolve(registryPath),'utf8'));
 const result=await runLocalRefresh({registry,outputPath});
 console.log(JSON.stringify({runDate:result.runDate,complete:result.complete,candidates:result.candidates?.length,quarantine:result.quarantine?.length,skipped:result.skipped}));
}
