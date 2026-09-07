export const kinds = ['contacts','appointments','opportunities','transactions','expenses','ad_spend','commissions','client_programs','activities'] as const;
export type Kind = typeof kinds[number];
export interface DataRecord {
  kind: Kind; source: string; source_id: string; occurred_at: string;
  name: string; email: string; contact_ref: string; contact_id: string;
  offer: string; channel: string; assigned_user: string; status: string;
  amount: number; fees: number; currency: string; category: string;
  data: Record<string, string | number | boolean | null>;
}
export interface ImportIssue { row: number; message: string }
export interface ImportPreview { records: DataRecord[]; errors: ImportIssue[]; repeated: number }
export const moneyKinds: Kind[] = ['transactions','expenses','ad_spend','commissions','opportunities'];
export const fields = ['source_id','occurred_at','name','email','contact_ref','offer','channel','assigned_user','status','amount','fees','currency','category'] as const;
export const labels: Record<string,string> = {source_id:'Source record ID',occurred_at:'Date',name:'Name',email:'Customer email',contact_ref:'CRM contact ID',offer:'Offer / program',channel:'Acquisition channel',assigned_user:'Team member',status:'Status',amount:'Amount (dollars)',fees:'Processing fee (dollars)',currency:'Currency',category:'Expense category'};
export function parseCSV(text: string): { headers:string[]; rows:string[][] } {
 text=text.replace(/^\uFEFF/,'');
 const result:string[][]=[];let row:string[]=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else if(!quoted&&cell.length)throw new Error('Unexpected quote in an unquoted field.');else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))result.push(row);row=[];cell='';}else cell+=c;}
 if(quoted)throw new Error('A quoted field is not closed. Check your CSV export.');
 row.push(cell);if(row.some(x=>x.trim()))result.push(row);
 if(result.length<2)throw new Error('Add a header row and at least one data row.');
 const headers=result.shift()!.map(h=>h.trim());
 if(headers.some(h=>!h)||new Set(headers.map(h=>h.toLowerCase())).size!==headers.length)throw new Error('Column names must be non-empty and unique.');
 if(headers.length>60)throw new Error('Use a CSV with 60 columns or fewer.');
 for(let i=0;i<result.length;i++)if(result[i].length!==headers.length)throw new Error('Row '+(i+2)+' has a different number of columns from the header.');
 if(result.length>500)throw new Error('Import up to 500 rows per file. Split larger exports into smaller files.');
 return {headers,rows:result};
}
export function suggestMapping(headers:string[]) {
 const aliases: Record<string,string[]>={
 source_id:['source_id','id','transaction_id','payment_id','contact_id','opportunity_id','appointment_id','charge_id'],
 occurred_at:['occurred_at','date','created','created_at','created_utc','created_date','payment_date','start_time'],
 name:['name','full_name','customer_name','contact_name','description'],email:['email','customer_email','email_address'],
 contact_ref:['contact_ref','ghl_contact_id','crm_contact_id'],offer:['offer','offer_slug','product','product_name','program'],
 channel:['channel','lead_source','attribution_source','utm_source'],assigned_user:['assigned_user','closer','setter','owner','assigned_to'],
 status:['status','payment_status','appointment_status','stage'],amount:['amount','amount_total','gross','total','value','spend'],
 fees:['fees','fee','processing_fees'],currency:['currency'],category:['category','expense_category']};
 return Object.fromEntries(fields.map(f=>[f,headers.find(h=>aliases[f].includes(h.toLowerCase().replace(/[^a-z0-9]+/g,'_')))||'']));
}
export function cents(value:string):number {
 const trimmed=value.trim(); if(!trimmed)throw new Error('Amount is missing.');
 const s=trimmed.replace(/[$,\s]/g,'');
 if(!/^-?\d+(\.\d{1,2})?$/.test(s))throw new Error('Use dollar amounts with at most two decimals.');
 const n=Math.round(Number(s)*100);if(!Number.isSafeInteger(n)||Math.abs(n)>100000000000)throw new Error('Amount is outside the supported range.');return n;
}
export function dateISO(value:string):string {
 const s=value.trim(); const match=s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ].*)?$/);
 if(!match)throw new Error('Use an ISO date: YYYY-MM-DD (timestamps also accepted).');
 const date=match[1]+'-'+match[2]+'-'+match[3]; const d=new Date(date+'T00:00:00Z');
 if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==date)throw new Error('Date is invalid.');
 return date;
}
export function normalizeImport(headers:string[], rows:string[][], mapping:Record<string,string>, kind:Kind, source:string):ImportPreview {
 const records:DataRecord[]=[],errors:ImportIssue[]=[];const seen=new Set<string>();let repeated=0;
 rows.forEach((row,index)=>{try{
 const get=(f:string)=>{const i=headers.indexOf(mapping[f]);return i<0?'':String(row[i]??'').trim();};
 const source_id=get('source_id');if(!source_id)throw new Error('Source record ID is required. Do not use a row number.');
 if(source_id.length>200)throw new Error('Source record ID is too long.');
 const occurred_at=dateISO(get('occurred_at'));
 const currency=(get('currency')||'USD').toUpperCase();if(currency!=='USD')throw new Error('This workspace uses USD. Convert other currencies before importing.');
 const amount=moneyKinds.includes(kind)?cents(get('amount')):0;
 const fees=get('fees')?cents(get('fees')):0;if(fees<0)throw new Error('Processing fees cannot be negative.');
 let status=get('status').toLowerCase().replace(/[ -]/g,'_');
 const aliases:Record<string,string>={paid:'succeeded',success:'succeeded',completed:'succeeded',complete:'succeeded',successful:'succeeded',refund:'refunded',closed_won:'won',closed_lost:'lost',no_show:'no_show',noshow:'no_show',show:'showed',attended:'showed',canceled:'cancelled'};
 status=aliases[status]||status;
 if(kind==='transactions'&&!['succeeded','failed','pending','refunded'].includes(status))throw new Error('Payment status must be succeeded, failed, pending, or refunded.');
 if(kind==='appointments'&&!['booked','showed','no_show','cancelled','rescheduled'].includes(status))throw new Error('Appointment status must be booked, showed, no_show, cancelled, or rescheduled.');
 if(kind==='opportunities'&&!['lead','contacted','booked','showed','pitched','won','lost'].includes(status))throw new Error('Use a supported pipeline stage: lead, contacted, booked, showed, pitched, won, lost.');
 if(kind!=='transactions'&&amount<0)throw new Error('Use a positive amount for this record type.');
 if(kind==='transactions'&&status!=='refunded'&&amount<0)throw new Error('Negative amounts must have refunded status.');
 if(kind==='transactions'&&status==='refunded'&&amount>0)throw new Error('Refund rows must use negative amounts and their own refund ID.');
 const data:DataRecord['data']={};headers.forEach((h,i)=>{if(h.length<=100)data[h]=String(row[i]||'').slice(0,2000)});
 const rec:DataRecord={kind,source,source_id,occurred_at,name:get('name'),email:get('email').toLowerCase(),contact_ref:get('contact_ref'),contact_id:'',offer:get('offer'),channel:get('channel'),assigned_user:get('assigned_user'),status,amount,fees,currency,category:get('category'),data};
 if(rec.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rec.email))throw new Error('Customer email is invalid.');
 if(seen.has(source_id))repeated++;seen.add(source_id);records.push(rec);
 }catch(e){errors.push({row:index+2,message:e instanceof Error?e.message:'Invalid row'});}});
 return {records,errors,repeated};
}
export function recordKey(r:Pick<DataRecord,'kind'|'source'|'source_id'>){return [r.kind,r.source,r.source_id].join('::');}
export function matchContact(r:DataRecord,contacts:DataRecord[]):{contact_id:string;confidence:string} {
 if(r.kind==='contacts')return {contact_id:recordKey(r),confidence:'source'};
 if(r.contact_ref){const matches=contacts.filter(c=>c.source==='ghl'&&c.source_id===r.contact_ref);if(matches.length===1)return {contact_id:recordKey(matches[0]),confidence:'metadata'};}
 if(r.email){const matches=contacts.filter(c=>c.email.toLowerCase()===r.email.toLowerCase());if(matches.length===1)return {contact_id:recordKey(matches[0]),confidence:'email'};if(matches.length>1)return {contact_id:'',confidence:'ambiguous'};}
 return {contact_id:'',confidence:'unmatched'};
}
export const formatMoney=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n/100);
export const formatExact=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n/100);
export function toCSV(rows:Record<string,unknown>[]):string {
 if(!rows.length)return '';
 const keys=Object.keys(rows[0]);const safe=(value:unknown)=>{let s=String(value??'');if(typeof value!=='number'&&/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 return [keys.map(safe).join(','),...rows.map(r=>keys.map(k=>safe(r[k])).join(','))].join('\r\n');
}
export function economics(records:DataRecord[]) {
 const offers=new Set(records.filter(r=>moneyKinds.includes(r.kind)).map(r=>r.offer||'Unallocated'));
 const netByOffer=new Map<string,number>();for(const r of records.filter(r=>r.kind==='transactions'&&['succeeded','refunded'].includes(r.status))){const key=r.offer||'Unallocated';netByOffer.set(key,(netByOffer.get(key)||0)+r.amount);}const positiveCash=[...netByOffer.values()].reduce((n,v)=>n+Math.max(0,v),0);
 const overhead=records.filter(r=>r.kind==='expenses'&&r.category==='overhead'&&!r.offer).reduce((n,r)=>n+r.amount,0);
 const list=[...offers].map(offer=>{
 const rows=records.filter(r=>(r.offer||'Unallocated')===offer);
 const sum=(kind:Kind)=>rows.filter(r=>r.kind===kind).reduce((n,r)=>n+r.amount,0);
 const payments=rows.filter(r=>r.kind==='transactions'&&['succeeded','refunded'].includes(r.status));
 const cash=payments.reduce((n,r)=>n+r.amount,0),ads=sum('ad_spend'),commissions=sum('commissions'),fees=payments.reduce((n,r)=>n+r.fees,0);
 const direct=rows.filter(r=>r.kind==='expenses'&&!(r.category==='overhead'&&!r.offer)).reduce((n,r)=>n+r.amount,0);
 const allocated=positiveCash>0?Math.floor(overhead*Math.max(cash,0)/positiveCash):0;
 const clients=new Set(payments.filter(r=>r.status==='succeeded'&&r.contact_id).map(r=>r.contact_id)).size;
 return {offer,cash,ads,commissions,fees,direct,overhead:allocated,margin:cash-ads-commissions-fees-direct-allocated,marginPct:cash>0?(cash-ads-commissions-fees-direct-allocated)/cash*100:null,clients,cac:clients?ads/clients:null};
 });
 // Allocate every overhead cent exactly once, including zero-revenue periods.
 const remainder=overhead-list.reduce((n,r)=>n+r.overhead,0);
 if(remainder){const target=[...list].sort((a,b)=>b.cash-a.cash)[0];if(target){target.overhead+=remainder;target.margin-=remainder;target.marginPct=target.cash>0?target.margin/target.cash*100:null;}}
 return list.filter(r=>Object.entries(r).some(([k,v])=>k!=='offer'&&typeof v==='number'&&v!==0)).sort((a,b)=>b.cash-a.cash);
}
export function summarize(records:DataRecord[]) {
 const tx=records.filter(r=>r.kind==='transactions'),paid=tx.filter(r=>['succeeded','refunded'].includes(r.status));
 const appointments=records.filter(r=>r.kind==='appointments'),showed=appointments.filter(r=>r.status==='showed').length;
 const eligible=appointments.filter(r=>['showed','no_show'].includes(r.status)).length;
 const cash=paid.reduce((n,r)=>n+r.amount,0),contracted=records.filter(r=>r.kind==='opportunities'&&r.status==='won').reduce((n,r)=>n+r.amount,0);
 const offers=economics(records),margin=offers.reduce((n,r)=>n+r.margin,0);
 return {cash,contracted,margin,marginPct:cash>0?margin/cash*100:null,booked:appointments.filter(r=>!['cancelled','rescheduled'].includes(r.status)).length,showed,showRate:eligible?showed/eligible*100:null,closed:records.filter(r=>r.kind==='opportunities'&&r.status==='won').length,unmatched:tx.filter(r=>!r.contact_id),failed:tx.filter(r=>r.status==='failed'),offers};
}
