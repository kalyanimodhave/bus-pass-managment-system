import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
export default function Applications(){
 const [apps,setApps]=useState([]);const [error,setError]=useState('');
 useEffect(()=>{api.get('/applications/mine').then(r=>setApps(r.data.applications)).catch(e=>setError(e.response?.data?.message||'Could not load applications.'));},[]);
 return <><div className="page-title"><span className="eyebrow">YOUR RECORDS</span><h1>My Applications</h1><p>View your submitted bus pass applications and decisions.</p></div>{error&&<div className="alert error">{error}</div>}<div className="panel table-panel"><div className="table-wrap"><table><thead><tr><th>Application ID</th><th>Route</th><th>Submitted</th><th>Status</th><th>Action</th></tr></thead><tbody>{apps.map(a=><tr key={a._id}><td className="mono">{a._id.slice(-8).toUpperCase()}</td><td>{a.startStop} → {a.endStop}<small className="table-sub">{a.routeName}</small></td><td>{new Date(a.createdAt).toLocaleDateString()}</td><td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td><td><Link className="text-link" to={`/track?id=${a._id}`}>View details</Link></td></tr>)}{!apps.length&&<tr><td colSpan="5" className="empty">No applications yet. <Link to="/apply">Apply for your pass</Link>.</td></tr>}</tbody></table></div></div></>;
}
