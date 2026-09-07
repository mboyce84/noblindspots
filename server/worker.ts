import { parseCSV, normalizeImport, kinds, recordKey, matchContact, dateISO, type DataRecord, type Kind } from '../src/lib/engine.ts';
import { sampleRecords } from '../src/lib/sample.ts';
type Statement={bind(...args:unknown[]):Statement;all():Promise<{results:any[]}>;first():Promise<any>;run():Promise<any>};
export type DB={prepare(sql:string):Statement;batch(statements:Statement[]):Promise<any[]>};
declare const __SITE_INDEX_HTML__:string;
type Env={DB:DB;ASSETS?:{fetch(request:Request):Promise<Response>}};
class HttpError extends Error {status:number;constructor(status:number,message:string){super(message);this.status=status;}}
const json=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'}});
const now=()=>new Date().toISOString();
const uuid=()=>crypto.randomUUID();
const stmt=(db:DB,sql:string,...args:unknown[])=>db.prepare(sql).bind(...args);
async function body(req:Request){const text=await req.text();if(text.length>1500000)throw new HttpError(413,'Keep requests under 1.5 MB.');try{return JSON.parse(text)}catch{throw new HttpError(400,'Invalid JSON request.');}}
const bad=(message:string):never=>{throw new HttpError(400,message)};
function audit(db:DB,org:string,actor:string,action:string,target:string,detail:unknown){return stmt(db,'INSERT INTO audit_log (id,org_id,actor_id,action,target,detail,created_at) VALUES (?,?,?,?,?,?,?)',uuid(),org,actor,action,target,JSON.stringify(detail),now());}
function upsert(db:DB,org:string,r:DataRecord){return stmt(db,'INSERT INTO records (id,org_id,kind,source,source_id,occurred_at,payload,updated_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(org_id,kind,source,source_id) DO UPDATE SET occurred_at=excluded.occurred_at,payload=excluded.payload,updated_at=excluded.updated_at',uuid(),org,r.kind,r.source,r.source_id,r.occurred_at,JSON.stringify(r),now());}
async function allRecords(db:DB,org:string,withExcluded=false):Promise<any[]> {
 const rows=(await stmt(db,'SELECT id,payload,excluded FROM records WHERE org_id=? ORDER BY occurred_at DESC LIMIT 10001',org).all()).results;
 if(rows.length>10000)throw new HttpError(422,'This v1 workspace supports 10,000 records. Archive a period before adding more.');
 return rows.filter(r=>withExcluded||!r.excluded).map(r=>({...JSON.parse(r.payload),id:r.id,excluded:!!r.excluded}));
}
async function logRun(db:DB,org:string,run:any){await stmt(db,'INSERT INTO ingest_runs (id,org_id,payload,created_at) VALUES (?,?,?,?)',run.id,org,JSON.stringify(run),run.created_at).run();}
const defaultSettings={companyName:'My business',currency:'USD',monthlyTarget:10000000,showBenchmark:70};
export async function handleApi(req:Request,env:Env):Promise<Response>{
 try{
 const url=new URL(req.url),path=url.pathname;
 if(!['GET','POST','PATCH','DELETE'].includes(req.method))return json({error:'Method not allowed.'},405);
 if(req.method!=='GET'){
 const origin=req.headers.get('origin');
 if(origin&&origin!==url.origin)return json({error:'Cross-origin writes are not allowed.'},403);
 if(req.headers.get('sec-fetch-site')==='cross-site')return json({error:'Cross-site writes are not allowed.'},403);
 }
 if(!env.DB)throw new HttpError(503,'The workspace database is not available.');
 const actor=req.headers.get('oai-authenticated-user-id');
 if(!actor)throw new HttpError(401,'Sign in to open your private workspace.');
 const mode=req.headers.get('x-nbs-workspace')==='live'?'live':'demo';
 const org=actor+':'+mode;
 const email=req.headers.get('oai-authenticated-user-email')||'';
 let display=req.headers.get('oai-authenticated-user-full-name')||'Workspace owner';
 if(req.headers.get('oai-authenticated-user-full-name-encoding')==='percent-encoded-utf-8'){try{display=decodeURIComponent(display)}catch{/* optional display claim */}}
 const user={id:actor,name:display,email,role:'admin',created_at:now(),updated_at:now()};
 // The hosting dispatcher verifies the identity. The tenant is derived here,
 // never accepted from request JSON, a URL, or a browser role selector.
 if(path==='/api/session')return json({user,mode});
 if(path==='/api/init'&&req.method==='POST'){
 const exists=await stmt(env.DB,'SELECT id FROM workspaces WHERE id=? AND owner=?',org,actor).first();
 if(!exists){
 const data=mode==='demo'?sampleRecords():[];
 const roster=[user,...(mode==='demo'?[{id:'demo-closer',name:'Jordan Lee',email:'jordan@example.com',role:'closer'},{id:'demo-dm',name:'Alex Morgan',email:'alex@example.com',role:'dm-setter'},{id:'demo-phone',name:'Sam Rivera',email:'sam@example.com',role:'phone-setter'}]:[])];
 const statements=[stmt(env.DB,'INSERT OR IGNORE INTO workspaces (id,owner,mode,settings,created_at) VALUES (?,?,?,?,?)',org,actor,mode,JSON.stringify({...defaultSettings,companyName:mode==='demo'?'Northstar Coaching':defaultSettings.companyName}),now()),...roster.map(r=>stmt(env.DB,'INSERT OR IGNORE INTO roster (id,org_id,payload) VALUES (?,?,?)',r.id,org,JSON.stringify({...r,created_at:now(),updated_at:now()}))),...data.map(r=>upsert(env.DB,org,r))];
 // One atomic batch makes an interrupted initialization retry-safe.
 await env.DB.batch(statements);
 if(mode==='demo')await logRun(env.DB,org,{id:'seed-'+uuid(),source:'sample',kind:'all',filename:'Illustrative sample workspace',inserted:data.length,updated:0,rejected:0,status:'completed',created_at:now(),errors:[]});
 }
 return json({ok:true});
 }
 const workspace=await stmt(env.DB,'SELECT * FROM workspaces WHERE id=? AND owner=?',org,actor).first();
 if(!workspace)throw new HttpError(409,'Initialize this workspace first.');
 if(path==='/api/data'&&req.method==='GET')return json({records:await allRecords(env.DB,org,true),settings:JSON.parse(workspace.settings),mode});
 if(path==='/api/runs'&&req.method==='GET')return json((await stmt(env.DB,'SELECT payload FROM ingest_runs WHERE org_id=? ORDER BY created_at DESC LIMIT 100',org).all()).results.map(r=>JSON.parse(r.payload)));
 if(path==='/api/inquiries'&&req.method==='GET')return json((await stmt(env.DB,"SELECT payload,created_at FROM inquiries WHERE json_extract(payload,'$.owner')=? ORDER BY created_at DESC LIMIT 100",actor).all()).results.map(r=>({...JSON.parse(r.payload),created_at:r.created_at})));
 if(path==='/api/audit'&&req.method==='GET')return json((await stmt(env.DB,'SELECT action,target,detail,created_at FROM audit_log WHERE org_id=? ORDER BY created_at DESC LIMIT 100',org).all()).results.map(r=>({...r,detail:JSON.parse(r.detail)})));
 if(path==='/api/import'&&req.method==='POST'){
 const input=await body(req); if(!kinds.includes(input.kind))bad('Choose a supported record type.');
 if(typeof input.source!=='string'||!/^[a-z0-9_-]{1,40}$/.test(input.source))bad('Use a stable source name with lowercase letters, numbers, or underscores.');
 if(typeof input.csv!=='string'||input.csv.length>1000000)bad('Upload a CSV under 1 MB.');
 if(!input.mapping||typeof input.mapping!=='object')bad('Column mapping is required.');
 let preview;try{const parsed=parseCSV(input.csv);preview=normalizeImport(parsed.headers,parsed.rows,input.mapping,input.kind,input.source);}catch(e){bad(e instanceof Error?e.message:'Invalid CSV');}
 const run:any={id:uuid(),source:input.source,kind:input.kind,filename:String(input.filename||'Import').slice(0,180),created_at:now(),inserted:0,updated:0,rejected:preview!.errors.length,status:preview!.errors.length?'rejected':'completed',errors:preview!.errors};
 if(preview!.errors.length){await logRun(env.DB,org,run);return json({error:'No rows were saved. Fix the flagged rows and try again.',run},422);}
 const unique=[...new Map(preview!.records.map(r=>[recordKey(r),r])).values()];
 const existing=await allRecords(env.DB,org,true);const existingKeys=new Set(existing.map(recordKey));
 if(existing.length+unique.filter(r=>!existingKeys.has(recordKey(r))).length>10000)bad('This v1 workspace supports 10,000 records.');
 const contacts=[...existing.filter(r=>r.kind==='contacts'&&!r.excluded),...unique.filter(r=>r.kind==='contacts')];
 const contactMap=[...new Map(contacts.map(r=>[recordKey(r),r])).values()];
 const writes=unique.map(r=>{const old=existing.find(e=>recordKey(e)===recordKey(r));const m=old?.data?.match_confidence==='manual'?{contact_id:old.contact_id,confidence:'manual'}:matchContact(r,contactMap);r.contact_id=m.contact_id;r.data.match_confidence=m.confidence;if(existingKeys.has(recordKey(r)))run.updated++;else run.inserted++;return upsert(env.DB,org,r);});
 // Backfill a late contact import into previously unmatched rows.
 if(input.kind==='contacts')for(const row of existing.filter(r=>r.kind!=='contacts'&&!r.contact_id)){const m=matchContact(row,contactMap);if(m.contact_id){row.contact_id=m.contact_id;row.data.match_confidence=m.confidence;writes.push(upsert(env.DB,org,row));}}
 writes.push(stmt(env.DB,'INSERT INTO ingest_runs (id,org_id,payload,created_at) VALUES (?,?,?,?)',run.id,org,JSON.stringify(run),run.created_at),audit(env.DB,org,actor,'import',run.id,{source:run.source,inserted:run.inserted,updated:run.updated}));
 await env.DB.batch(writes);return json({run});
 }
 if(path==='/api/reconcile'&&req.method==='POST'){
 const input=await body(req);const row=await stmt(env.DB,'SELECT * FROM records WHERE org_id=? AND id=?',org,input.id).first();
 if(!row)throw new HttpError(404,'Record not found.');
 const payload=JSON.parse(row.payload);
 if(input.action==='match'){
 const contact=await stmt(env.DB,"SELECT payload FROM records WHERE org_id=? AND kind='contacts' AND id=? AND excluded=0",org,input.contactId).first();
 if(!contact)bad('Choose a contact in this workspace.');
 const c=JSON.parse(contact.payload);payload.contact_id=recordKey(c);payload.data.match_confidence='manual';
 await env.DB.batch([stmt(env.DB,'UPDATE records SET payload=?,updated_at=? WHERE org_id=? AND id=?',JSON.stringify(payload),now(),org,input.id),audit(env.DB,org,actor,'match',input.id,{contact:payload.contact_id})]);
 }else if(['exclude','restore'].includes(input.action)){
 if(input.action==='exclude'&&(!input.reason||String(input.reason).trim().length<3))bad('Add a reason for excluding this record.');
 await env.DB.batch([stmt(env.DB,'UPDATE records SET excluded=?,updated_at=? WHERE org_id=? AND id=?',input.action==='exclude'?1:0,now(),org,input.id),audit(env.DB,org,actor,input.action,input.id,{reason:String(input.reason||'').slice(0,500)})]);
 }else bad('Unsupported reconciliation action.');
 return json({ok:true});
 }
 if(path==='/api/settings'){
 if(req.method==='GET')return json(JSON.parse(workspace.settings));
 if(req.method==='POST'){const s=await body(req);if(typeof s.companyName!=='string'||!s.companyName.trim()||s.companyName.length>80)bad('Enter a business name under 80 characters.');if(!Number.isSafeInteger(s.monthlyTarget)||s.monthlyTarget<0||s.monthlyTarget>100000000000)bad('Enter a valid monthly target.');if(!Number.isFinite(s.showBenchmark)||s.showBenchmark<0||s.showBenchmark>100)bad('Show-rate benchmark must be between 0 and 100.');
 const value={companyName:s.companyName.trim(),currency:'USD',monthlyTarget:s.monthlyTarget,showBenchmark:s.showBenchmark};
 await env.DB.batch([stmt(env.DB,'UPDATE workspaces SET settings=? WHERE id=? AND owner=?',JSON.stringify(value),org,actor),audit(env.DB,org,actor,'settings',org,value)]);return json(value);}
 }
 if(path==='/api/users'){
 if(req.method==='GET')return json((await stmt(env.DB,'SELECT payload FROM roster WHERE org_id=?',org).all()).results.map(r=>JSON.parse(r.payload)));
 const input=await body(req);
 if(req.method==='DELETE'){
 if(input.id===actor)bad('The workspace owner cannot be removed.');
 await env.DB.batch([stmt(env.DB,'DELETE FROM roster WHERE org_id=? AND id=?',org,input.id),audit(env.DB,org,actor,'remove_team_member',input.id,{})]);return json({ok:true});}
 if(!input.name||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email||''))bad('A name and valid email are required.');
 if(!['admin','closer','phone-setter','dm-setter'].includes(input.role))bad('Choose a valid role.');
 if(input.id===actor&&input.role!=='admin')bad('The workspace owner must remain an admin.');
 const existing=input.id?await stmt(env.DB,'SELECT payload FROM roster WHERE org_id=? AND id=?',org,input.id).first():null;
 const member={...input,id:input.id||uuid(),name:String(input.name).slice(0,100),email:input.email.toLowerCase(),created_at:existing?JSON.parse(existing.payload).created_at:now(),updated_at:now()};
 await env.DB.batch([stmt(env.DB,'INSERT INTO roster (id,org_id,payload) VALUES (?,?,?) ON CONFLICT(org_id,id) DO UPDATE SET payload=excluded.payload',member.id,org,JSON.stringify(member)),audit(env.DB,org,actor,'save_team_member',member.id,{role:member.role})]);return json(member);
 }
 if(path==='/api/submissions'){
 if(req.method==='GET'){const rows=(await stmt(env.DB,'SELECT payload FROM daily_reports WHERE org_id=?',org).all()).results.map(r=>JSON.parse(r.payload));const team=(await stmt(env.DB,'SELECT payload FROM roster WHERE org_id=?',org).all()).results.map(r=>JSON.parse(r.payload));return json(rows.map(r=>({...r,users:team.find(u=>u.id===r.user_id)})));}
 const input=await body(req);if(req.method==='DELETE'){await stmt(env.DB,'DELETE FROM daily_reports WHERE org_id=? AND id=?',org,input.id).run();return json({ok:true});}
 try{dateISO(input.submission_date||'');}catch{bad('Choose a valid submission date.');}if(!['closer','dm-setter','phone-setter'].includes(input.submission_type))bad('Choose an EOD role.');
 const person=await stmt(env.DB,'SELECT id FROM roster WHERE org_id=? AND id=?',org,input.user_id).first();if(!person)bad('Choose a team member in this workspace.');
 if(!input.data||typeof input.data!=='object')bad('Form data is required.');
 for(const value of Object.values(input.data))if(typeof value==='number'&&(!Number.isFinite(value)||value<0))bad('EOD numbers cannot be negative.');
 const previous=await stmt(env.DB,'SELECT id,payload FROM daily_reports WHERE org_id=? AND user_id=? AND date=?',org,input.user_id,input.submission_date).first();
 const row={...input,id:previous?.id||uuid(),created_at:previous?JSON.parse(previous.payload).created_at:now(),updated_at:now(),submitted_at:now()};
 await env.DB.batch([stmt(env.DB,'INSERT INTO daily_reports (id,org_id,user_id,date,payload) VALUES (?,?,?,?,?) ON CONFLICT(org_id,user_id,date) DO UPDATE SET payload=excluded.payload',row.id,org,row.user_id,row.submission_date,JSON.stringify(row)),audit(env.DB,org,actor,'save_eod',row.id,{date:row.submission_date})]);return json(row);
 }
 if(path==='/api/goals'){
 if(req.method==='GET')return json((await stmt(env.DB,'SELECT payload FROM team_goals WHERE org_id=?',org).all()).results.map(r=>JSON.parse(r.payload)));
 const input=await body(req);if(req.method==='DELETE'){await stmt(env.DB,'DELETE FROM team_goals WHERE org_id=? AND id=?',org,input.id).run();return json({ok:true});}
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(input.month))bad('Choose a valid month.');
 if(!Number.isFinite(input.goalAmount)||input.goalAmount<0||!Number.isFinite(input.currentAmount)||input.currentAmount<0)bad('Goal amounts must be nonnegative.');
 const person=await stmt(env.DB,'SELECT payload FROM roster WHERE org_id=? AND id=?',org,input.userId).first();if(!person)bad('Choose a team member.');
 const previous=await stmt(env.DB,'SELECT id,payload FROM team_goals WHERE org_id=? AND user_id=? AND month=?',org,input.userId,input.month).first();const personData=JSON.parse(person.payload);
 const row={...input,userName:personData.name,userRole:personData.role,id:previous?.id||uuid(),createdAt:previous?JSON.parse(previous.payload).createdAt:now(),updatedAt:now()};
 await stmt(env.DB,'INSERT INTO team_goals (id,org_id,user_id,month,payload) VALUES (?,?,?,?,?) ON CONFLICT(org_id,user_id,month) DO UPDATE SET payload=excluded.payload',row.id,org,row.userId,row.month,JSON.stringify(row)).run();return json(row);
 }
 if(path==='/api/waitlist'&&req.method==='POST'){
 const input=await body(req);const mail=String(input.email||'').trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))bad('Enter a valid email.');
 if(input.website)return json({success:true});
 const value={owner:actor,email:mail,firstName:String(input.first_name||input.firstName||'').slice(0,100),source:String(input.numbers_location||input.numbersLocation||input.source||'').slice(0,100),revenue:String(input.revenue_band||input.revenue||'').slice(0,100)};
 await stmt(env.DB,'INSERT INTO inquiries (id,email,payload,created_at) VALUES (?,?,?,?) ON CONFLICT(email) DO UPDATE SET payload=excluded.payload',uuid(),mail,JSON.stringify(value),now()).run();
 return json({success:true});
 }
 return json({error:'Endpoint not found.'},404);
 }catch(e){return json({error:e instanceof HttpError?e.message:'The request could not be completed. Your saved data is unchanged.'},e instanceof HttpError?e.status:500);}
}
export default {async fetch(request:Request,env:Env):Promise<Response>{
 const url=new URL(request.url);if(url.pathname.startsWith('/api/'))return handleApi(request,env);
 if(!url.pathname.split('/').pop()?.includes('.'))return new Response(__SITE_INDEX_HTML__,{headers:{'content-type':'text/html;charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
 if(env.ASSETS){let response=await env.ASSETS.fetch(request);if(response.status===404&&!url.pathname.includes('.'))response=await env.ASSETS.fetch(new Request(new URL('/index.html',url),request));return response;}
 return new Response('Not found',{status:404});
}};
