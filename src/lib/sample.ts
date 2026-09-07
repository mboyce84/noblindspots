import { type DataRecord, type Kind, recordKey, matchContact } from './engine.ts';
export function sampleRecords(anchor=new Date()):DataRecord[] {
 const rows:DataRecord[]=[];
 const date=(days:number)=>{const d=new Date(anchor);d.setUTCDate(d.getUTCDate()-days);return d.toISOString().slice(0,10);};
 const names=['Alex Morgan','Jordan Lee','Sam Rivera','Taylor Brooks','Casey Parker','Riley Chen','Jamie Ellis','Avery Davis','Cameron Quinn','Morgan Reed','Robin West','Drew Hayes'];
 const channels=['Instagram organic','Meta ads','Referral','YouTube','Email'];
 const offers=['Accelerator','Inner Circle','Foundations'];
 const base=(kind:Kind,source:string,id:string,days:number,extra:Partial<DataRecord>={})=>({kind,source,source_id:id,occurred_at:date(days),name:'',email:'',contact_ref:'',contact_id:'',offer:'',channel:'',assigned_user:'',status:'',amount:0,fees:0,currency:'USD',category:'',data:{},...extra} satisfies DataRecord);
 for(let i=0;i<96;i++){
 const days=1+i%56,offer=offers[i%3],email='client'+(i+1)+'@example.com',name=names[i%names.length]+' '+(Math.floor(i/12)+1),contact='c_'+i;
 rows.push(base('contacts','ghl',contact,days,{name,email,channel:channels[i%5],offer,status:'lead',assigned_user:i%2?'Jordan Lee':'Alex Morgan'}));
 if(i<70)rows.push(base('appointments','ghl','apt_'+i,days,{name,email,contact_ref:contact,offer,assigned_user:i%2?'Jordan Lee':'Alex Morgan',status:i%9===0?'cancelled':i%4===0?'no_show':'showed'}));
 if(i<44)rows.push(base('opportunities','ghl','opp_'+i,days,{name,email,contact_ref:contact,offer,amount:[600000,1200000,200000][i%3],status:i%3===0?'pitched':i%7===0?'lost':'won',assigned_user:i%2?'Jordan Lee':'Alex Morgan',category:i%7===0?'Timing':''}));
 if(i<35)rows.push(base('transactions',i%4===0?'paypal':'stripe','pay_'+i,days,{name,email:i%11===0?'unlinked'+i+'@example.com':email,contact_ref:i%11===0?'':contact,offer,amount:[300000,600000,200000][i%3],fees:[9000,18000,6000][i%3],status:i%13===0?'failed':'succeeded'}));
 if(i<12)rows.push(base('client_programs','manual','program_'+i,days,{name,email,contact_ref:contact,offer,status:i%3===0?'at_risk':'active',assigned_user:i%2?'Jordan Lee':'Alex Morgan',data:{phase:['Onboarding','Implementation','Growth'][i%3],execution_score:30+i*5,last_activity_at:date(i%3===0?18:2),ends_at:date(-10-i*3),renewal_status:'not_contacted'}}));
 }
 for(let i=0;i<12;i++){const offer=offers[i%3];rows.push(base('ad_spend','meta_ads','ad_'+i,2+i*4,{offer,amount:[160000,180000,90000][i%3],channel:'Meta ads',name:'Coaching acquisition'}));rows.push(base('expenses','quickbooks','exp_'+i,2+i*4,{offer,amount:[50000,260000,20000][i%3],category:'delivery',name:'Program delivery'}));rows.push(base('commissions','manual','commission_'+i,2+i*4,{offer,amount:[30000,60000,20000][i%3],assigned_user:'Jordan Lee'}));}
 rows.push(base('expenses','quickbooks','overhead_1',5,{amount:200000,category:'overhead',name:'Operations'}));
 const contacts=rows.filter(r=>r.kind==='contacts');for(const r of rows){const m=matchContact(r,contacts);r.contact_id=m.contact_id;r.data.match_confidence=m.confidence;}
 // A duplicate candidate stays visible until explicitly excluded.
 const original=rows.find(r=>r.kind==='transactions'&&r.status==='succeeded')!;
 rows.push({...original,source:'manual',source_id:'duplicate_example',data:{...original.data,review_note:'Also appears in the payment processor export.'}});
 return rows.map(r=>({...r,data:{...r.data,sample:true,key:recordKey(r)}}));
}
