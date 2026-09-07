import {useState,useEffect,useCallback} from 'react';
import {api} from './api';
import {type DataRecord,toCSV} from './engine';
import {useAuth} from '../context/AuthContext';
export type SavedRecord=DataRecord & {id:string;excluded:boolean};
export interface WorkspaceData {records:SavedRecord[];settings:{companyName:string;monthlyTarget:number;showBenchmark:number;currency:string};mode:string}
export function useWorkspace(){
 const{mode}=useAuth();const[data,setData]=useState<WorkspaceData|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 const refresh=useCallback(async()=>{setLoading(true);try{setData(await api<WorkspaceData>('/data'));setError('');}catch(e){setError(e instanceof Error?e.message:'Could not load data.');}finally{setLoading(false);}},[mode]);
 useEffect(()=>{void refresh();const f=()=>void refresh();window.addEventListener('nbs-refresh',f);return()=>window.removeEventListener('nbs-refresh',f);},[refresh]);
 return {data,error,loading,refresh};
}
export function downloadRows(rows:Record<string,unknown>[],filename='noblindspots-records.csv'){
 const normalized=rows.map(r=>r.kind&&typeof r.amount==='number'?{...r,amount:r.amount/100,fees:typeof r.fees==='number'?r.fees/100:r.fees}:r);const blob=new Blob(['\uFEFF'+toCSV(normalized)],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function dateRange(period:string){const end=new Date().toISOString().slice(0,10),start=new Date();if(period==='month')start.setUTCDate(1);else start.setUTCDate(start.getUTCDate()-Number(period)+1);return{from:start.toISOString().slice(0,10),to:end};}
