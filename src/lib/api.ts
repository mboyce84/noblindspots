export type WorkspaceMode='demo'|'live';
export function getMode():WorkspaceMode {return localStorage.getItem('nbs-workspace-mode')==='live'?'live':'demo';}
export function setMode(mode:WorkspaceMode){localStorage.setItem('nbs-workspace-mode',mode);}
export async function api<T=any>(path:string,options:RequestInit={}):Promise<T>{
 const response=await fetch('/api'+path,{...options,headers:{'content-type':'application/json','x-nbs-workspace':getMode(),...options.headers}});
 const result=await response.json().catch(()=>({error:'The server returned an unexpected response.'}));
 if(!response.ok){const error=new Error(result.error||'Request failed.') as Error & {details?:any};error.details=result;throw error;}return result;
}
export const post=<T=any>(path:string,value:unknown)=>api<T>(path,{method:'POST',body:JSON.stringify(value)});
export const remove=(path:string,id:string)=>api(path,{method:'DELETE',body:JSON.stringify({id})});
