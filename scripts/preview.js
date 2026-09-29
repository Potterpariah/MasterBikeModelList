import { createServer } from 'node:http';
import { localEnv } from './local-db.js';
const {default:worker}=await import(process.argv.includes('--bundle')?'../build-check/worker.js':'../src/worker.js');
const env=localEnv();
const server=createServer(async(req,res)=>{
  try {
    const chunks=[];for await(const chunk of req)chunks.push(chunk);
    const request=new Request('http://localhost:8788'+req.url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
    const response=await worker.fetch(request,env);
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch(error){console.error(error);res.writeHead(500);res.end('Preview error');}
});
server.listen(8788,'127.0.0.1',()=>console.log('Bike Portal preview: http://localhost:8788 (temporary local data only)'));
