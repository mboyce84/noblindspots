// Compatibility boundary for the existing FBASU forms and team pages.
// Services now call the authenticated API; no mock password or in-memory writes.
import { PhoneSetterForm, CloserForm, DMSetterForm, TeamGoal } from '../types';
import { api, post, remove } from './api';
export interface DatabaseUser {id:string;name:string;email:string;role:'admin'|'closer'|'dm-setter'|'phone-setter';created_at:string;updated_at:string}
export interface DatabaseSubmission {id:string;user_id:string;submission_date:string;submission_type:'phone-setter'|'dm-setter'|'closer';data:any;submitted_at:string;created_at:string;updated_at:string;users?:DatabaseUser}
export const userService={
 getAll:()=>api<DatabaseUser[]>('/users'),
 async getById(id:string){return (await this.getAll()).find(u=>u.id===id)||null;},
 async getByEmail(email:string){return (await this.getAll()).find(u=>u.email===email)||null;},
 create:(user:Omit<DatabaseUser,'id'|'created_at'|'updated_at'>)=>post<DatabaseUser>('/users',user),
 async update(id:string,updates:Partial<DatabaseUser>){const user=await this.getById(id);return post<DatabaseUser>('/users',{...user,...updates,id});},
 delete:(id:string)=>remove('/users',id).then(()=>undefined)
};
export const teamGoalsService={
 async getAll(month?:string){const goals=await api<TeamGoal[]>('/goals');return goals.filter(g=>!month||g.month===month);},
 async getByUserId(userId:string,month?:string){return (await this.getAll(month)).filter(g=>g.userId===userId);},
 upsert:(goal:Omit<TeamGoal,'id'|'createdAt'|'updatedAt'>)=>post<TeamGoal>('/goals',goal),
 delete:(id:string)=>remove('/goals',id).then(()=>undefined),
 async getMonthlyTeamGoals(){const goals=await this.getAll();const result=new Map<string,{month:string;totalGoal:number;totalCurrent:number;percentage:number}>();goals.forEach(g=>{const r=result.get(g.month)||{month:g.month,totalGoal:0,totalCurrent:0,percentage:0};r.totalGoal+=g.goalAmount;r.totalCurrent+=g.currentAmount;result.set(g.month,r);});return [...result.values()].map(r=>({...r,percentage:r.totalGoal?r.totalCurrent/r.totalGoal*100:0})).sort((a,b)=>a.month.localeCompare(b.month));}
};
export const submissionService={
 async getAll(filters?:{userId?:string;role?:string;dateFrom?:string;dateTo?:string}){return (await api<DatabaseSubmission[]>('/submissions')).filter(s=>(!filters?.userId||s.user_id===filters.userId)&&(!filters?.role||s.submission_type===filters.role)&&(!filters?.dateFrom||s.submission_date>=filters.dateFrom)&&(!filters?.dateTo||s.submission_date<=filters.dateTo)).sort((a,b)=>b.submission_date.localeCompare(a.submission_date));},
 async getByUserAndDate(userId:string,date:string){return (await this.getAll({userId,dateFrom:date,dateTo:date}))[0]||null;},
 upsert:(value:{user_id:string;submission_date:string;submission_type:'phone-setter'|'dm-setter'|'closer';data:any})=>post<DatabaseSubmission>('/submissions',value),
 delete:(id:string)=>remove('/submissions',id).then(()=>undefined),
 async getComplianceData(year:number,month:number,role?:string){const start=year+'-'+String(month).padStart(2,'0')+'-01';const end=year+'-'+String(month).padStart(2,'0')+'-'+new Date(year,month,0).getDate();return this.getAll({dateFrom:start,dateTo:end,role:role==='all'?undefined:role});}
};
export const authService={async getCurrentUser(){return (await api<{user:DatabaseUser}>('/session')).user;},async signOut(){return {error:null};}};
export const formatSubmissionData=(formData:Partial<PhoneSetterForm|CloserForm|DMSetterForm>,submissionType:'phone-setter'|'dm-setter'|'closer')=>({submission_type:submissionType,data:Object.fromEntries(Object.entries(formData).filter(([,v])=>v!==undefined&&v!==''))});
export const parseSubmissionData=(submission:DatabaseSubmission):PhoneSetterForm|CloserForm|DMSetterForm=>({id:submission.id,date:submission.submission_date,userId:submission.user_id,...submission.data});
