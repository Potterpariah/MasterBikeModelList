import { createServer } from 'node:http';
import { localEnv } from './local-db.js';
const {default:worker}=await import(process.argv.includes('--bundle')?'../build-check/worker.js':'../src/worker.js');
const env=localEnv();
const port=Number(process.env.PORT||8788);
if(process.argv.includes('--discovery-measurement')){
  env.DISCOVERY_MEASUREMENT='enabled';
  env.DISCOVERY_METRICS={writeDataPoint:point=>console.log('LOCAL TEST METRIC '+JSON.stringify(point))};
}
const server=createServer(async(req,res)=>{
  try {
    const chunks=[];for await(const chunk of req)chunks.push(chunk);
    const request=new Request('http://localhost:'+port+req.url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
    const response=await worker.fetch(request,env);
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch(error){console.error(error);res.writeHead(500);res.end('Preview error');}
});
server.listen(port,'127.0.0.1',()=>console.log('Bike Portal preview: http://localhost:'+port+' (temporary local data only)'));
