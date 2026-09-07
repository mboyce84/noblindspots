import React,{useState} from 'react';
import {Menu,X,FlaskConical} from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import {useAuth} from '../../context/AuthContext';
export default function Layout({children,title,subtitle,showExport,onExport}:{children:React.ReactNode;title:string;subtitle?:string;showExport?:boolean;onExport?:()=>void}){
 const[open,setOpen]=useState(false);const{mode}=useAuth();
 return <div className={'app-shell '+(open?'nav-open':'')}><button className="mobile-menu" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>{open&&<button className="nav-backdrop" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}<Sidebar onNavigate={()=>setOpen(false)}/><div className="app-main">{mode==='demo'&&<div className="demo-strip"><FlaskConical size={14}/><strong>Sample workspace</strong><span>Illustrative data. Your changes are saved here separately from My business.</span></div>}<Header title={title} subtitle={subtitle} showExport={showExport} onExport={onExport}/><main id="main-content" className="app-content">{children}</main><footer className="app-foot"><span>NoBlindSpots</span><span>Clarity is a competitive advantage.</span></footer></div></div>
}