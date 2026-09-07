import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync,readdirSync,mkdirSync } from 'node:fs';
import { handleApi } from '../server/worker.ts';
mkdirSync('.local',{recursive:true});
const sqlite=new DatabaseSync('.local/noblindspots.sqlite');
sqlite.exec('CREATE TABLE IF NOT EXISTS local_migrations (name TEXT PRIMARY KEY)');
for(const name of readdirSync('drizzle').filter(n=>n.endsWith('.sql')).sort()){
 if(!sqlite.prepare('SELECT name FROM local_migrations WHERE name=?').get(name)){
 sqlite.exec('BEGIN');try{sqlite.exec(readFileSync('drizzle/'+name,'utf8'));sqlite.prepare('INSERT INTO local_migrations VALUES (?)').run(name);sqlite.exec('COMMIT')}catch(e){sqlite.exec('ROLLBACK');throw e;}
 }
}
export function adapter(db){return {prepare(sql){let values=[];return {bind(...args){values=args;return this},async all(){return {results:db.prepare(sql).all(...values)}},async first(){return db.prepare(sql).get(...values)||null},async run(){return db.prepare(sql).run(...values)}}},async batch(statements){db.exec('BEGIN');try{const results=[];for(const s of statements)results.push(await s.run());db.exec('COMMIT');return results}catch(e){db.exec('ROLLBACK');throw e}}};}
const env={DB:adapter(sqlite)};
http.createServer(async(req,res)=>{
 try{const chunks=[];for await(const c of req)chunks.push(c);
 const headers=new Headers(req.headers);headers.set('oai-authenticated-user-id','local-owner');headers.set('oai-authenticated-user-email','owner@example.com');headers.set('oai-authenticated-user-full-name','Workspace owner');
 // Local identity exists only in this loopback development server.
 const request=new Request('http://127.0.0.1:5173'+req.url,{method:req.method,headers,...(req.method!=='GET'?{body:Buffer.concat(chunks)}:{})});
 const response=await handleApi(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500,{'content-type':'application/json'});res.end(JSON.stringify({error:'Local API error'}));}
}).listen(8787,'127.0.0.1',()=>console.log('NoBlindSpots API: http://127.0.0.1:8787'));
