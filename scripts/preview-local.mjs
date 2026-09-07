import http from 'node:http';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
const root=resolve('dist/client');
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
http.createServer(async(req,res)=>{try{if(req.url.startsWith('/api/')){const chunks=[];for await(const c of req)chunks.push(c);const r=await fetch('http://127.0.0.1:8787'+req.url,{method:req.method,headers:req.headers,...(req.method!=='GET'?{body:Buffer.concat(chunks)}:{})});res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));return;}
let file=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
if(!existsSync(file)||statSync(file).isDirectory())file=resolve(root,'index.html');res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(readFileSync(file));}catch{res.writeHead(500);res.end('Preview unavailable');}}).listen(5173,'127.0.0.1',()=>console.log('NoBlindSpots preview: http://127.0.0.1:5173/'));
