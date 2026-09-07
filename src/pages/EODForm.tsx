import {useEffect,useState} from 'react';
import Layout from '../components/Layout/Layout';
import {useAuth,ReportUserProvider} from '../context/AuthContext';
import {userService,type DatabaseUser} from '../lib/supabase';
import PhoneSetterForm from '../components/Forms/PhoneSetterForm';
import DMSetterForm from '../components/Forms/DMSetterForm';
import CloserForm from '../components/Forms/CloserForm';
import {Link} from 'react-router-dom';
export default function EODForm(){const{user,mode}=useAuth();const[team,setTeam]=useState<DatabaseUser[]>([]),[id,setId]=useState(''),[error,setError]=useState('');
 useEffect(()=>{userService.getAll().then(users=>{const eligible=users.filter(u=>u.role!=='admin');setTeam(eligible);setId(user?.role==='admin'?eligible[0]?.id||'':user?.id||'');}).catch(e=>setError(e.message));},[mode,user?.id,user?.role]);
 const person=team.find(u=>u.id===id);
 return <Layout title="Daily check-in" subtitle="Keep the context only your team can provide."><div className="notice"><div><strong>Manual activity reports stay separate from verified money.</strong><p>These forms preserve your team’s daily reporting. Payment totals here do not get added to imported cash collections. Automatic form prefilling is not active yet.</p></div></div>{error&&<p role="alert" className="notice warning">{error}</p>}{user?.role==='admin'&&<div className="filter-bar"><label className="field-label">Reporting for<select value={id} onChange={e=>setId(e.target.value)}><option value="">Choose a team member</option>{team.map(u=><option key={u.id} value={u.id}>{u.name} · {u.role.replace('-',' ')}</option>)}</select></label><Link to="/admin/all-submissions" className="text-link">View saved check-ins</Link></div>}{person?<ReportUserProvider user={person}><div key={person.id}>{person.role==='closer'?<CloserForm/>:person.role==='dm-setter'?<DMSetterForm/>:<PhoneSetterForm/>}</div></ReportUserProvider>:<div className="panel empty-state"><h3>Add your team to start reporting.</h3><p>Choose a closer, DM setter, or phone setter from your roster.</p><Link className="button dark" to="/admin/users">Open team roster</Link></div>}</Layout>;
}