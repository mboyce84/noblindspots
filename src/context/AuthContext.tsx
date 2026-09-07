import React,{createContext,useContext,useState,useEffect} from 'react';
import {User} from '../types';
import {api,post,getMode,setMode,type WorkspaceMode} from '../lib/api';
interface AuthContextType{user:User|null;isLoading:boolean;error:string;mode:WorkspaceMode;switchWorkspace:(mode:WorkspaceMode)=>Promise<void>;login:(email:string,password:string)=>Promise<boolean>;logout:()=>void;reload:()=>Promise<void>}
const AuthContext=createContext<AuthContextType|undefined>(undefined);
export function AuthProvider({children}:{children:React.ReactNode}){
 const[user,setUser]=useState<User|null>(null),[isLoading,setLoading]=useState(true),[error,setError]=useState(''),[mode,setWorkspace]=useState(getMode());
 const reload=async()=>{setLoading(true);setError('');try{const session=await api<{user:User}>('/session');await post('/init',{});setUser(session.user);}catch(e){setUser(null);setError(e instanceof Error?e.message:'Workspace unavailable.');}finally{setLoading(false);}};
 useEffect(()=>{void reload();},[]);
 const switchWorkspace=async(next:WorkspaceMode)=>{setMode(next);setWorkspace(next);await reload();window.dispatchEvent(new Event('nbs-refresh'));};
 const login=async()=>{await reload();return true;};
 const logout=()=>{window.location.assign('/signout-with-chatgpt?return_to=/');};
 return <AuthContext.Provider value={{user,isLoading,error,mode,switchWorkspace,login,logout,reload}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const c=useContext(AuthContext);if(!c)throw new Error('AuthProvider is required.');return c;}
export function ReportUserProvider({user,children}:{user:User;children:React.ReactNode}){const parent=useAuth();return <AuthContext.Provider value={{...parent,user}}>{children}</AuthContext.Provider>}
