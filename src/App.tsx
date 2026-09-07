import {lazy,Suspense,type ReactNode} from 'react';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {AuthProvider,useAuth} from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
const Dashboard=lazy(()=>import('./pages/Dashboard'));
const Imports=lazy(()=>import('./pages/Imports'));
const Reconciliation=lazy(()=>import('./pages/Reconciliation'));
const Activity=lazy(()=>import('./pages/Activity'));
const Insights=lazy(()=>import('./pages/Insights'));
const EODForm=lazy(()=>import('./pages/EODForm'));
const TeamPerformance=lazy(()=>import('./pages/TeamPerformance'));
const TeamGoals=lazy(()=>import('./pages/TeamGoals'));
const Users=lazy(()=>import('./pages/admin/Users'));
const AllSubmissions=lazy(()=>import('./pages/admin/AllSubmissions'));
const EODCompliance=lazy(()=>import('./pages/admin/EODCompliance'));
const Settings=lazy(()=>import('./pages/admin/Settings'));
const Documentation=lazy(()=>import('./pages/Documentation'));
const NotFound=lazy(()=>import('./pages/NotFound'));
function Protected({children,admin=false}:{children:ReactNode;admin?:boolean}){const{user,isLoading,error,reload}=useAuth();if(isLoading)return <div className="loading-state full" role="status"><span/>Opening your workspace…</div>;if(!user)return error?<div className="empty-state full"><h2>Let’s get your workspace open.</h2><p>{error}</p><button className="button dark" onClick={()=>void reload()}>Try again</button><a className="button white" href="/signin-with-chatgpt?return_to=/dashboard" target="_top">Sign in</a></div>:<Navigate to="/login" replace/>;if(admin&&user.role!=='admin')return <Navigate to="/dashboard" replace/>;return <>{children}</>}
export default function App(){return <AuthProvider><BrowserRouter><a href="#main-content" className="skip-link">Skip to content</a><Suspense fallback={<div className="loading-state full" role="status">Loading…</div>}><Routes><Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/dashboard" element={<Protected><Dashboard/></Protected>}/>{['/financials','/attribution','/pipeline','/clients'].map(path=><Route key={path} path={path} element={<Protected><Insights/></Protected>}/>)}<Route path="/imports" element={<Protected admin><Imports/></Protected>}/><Route path="/reconciliation" element={<Protected admin><Reconciliation/></Protected>}/><Route path="/activity" element={<Protected admin><Activity/></Protected>}/><Route path="/eod-form" element={<Protected><EODForm/></Protected>}/><Route path="/team-performance" element={<Protected><TeamPerformance/></Protected>}/><Route path="/team-goals" element={<Protected><TeamGoals/></Protected>}/><Route path="/admin/users" element={<Protected admin><Users/></Protected>}/><Route path="/admin/all-submissions" element={<Protected admin><AllSubmissions/></Protected>}/><Route path="/admin/eod-compliance" element={<Protected admin><EODCompliance/></Protected>}/><Route path="/admin/settings" element={<Protected admin><Settings/></Protected>}/><Route path="/documentation" element={<Protected><Documentation/></Protected>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense></BrowserRouter></AuthProvider>}