import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock3, Files, Users } from 'lucide-react';
import api from '../api';
export default function AdminDashboard(){
 const [apps,setApps]=useState([]);
 useEffect(()=>{api.get('/applications/admin/all').then(r=>setApps(r.data.applications)).catch(()=>{});},[]);
 const pending=apps.filter(a=>a.status==='Pending').length,approved=apps.filter(a=>a.status==='Approved').length,rejected=apps.filter(a=>a.status==='Rejected').length;
 return <><div className="welcome-banner admin-banner"><div><span className="eyebrow">ADMINISTRATION</span><h1>Admin Dashboard</h1><p>Review student applications and manage bus pass approvals.</p><Link className="btn white-btn" to="/admin/applications">Manage Applications</Link></div><div className="banner-bus"><Users size={105}/></div></div><div className="stat-grid"><div className="stat-card"><span className="stat-icon pink"><Files/></span><div><small>Total applications</small><h2>{apps.length}</h2></div></div><div className="stat-card"><span className="stat-icon amber"><Clock3/></span><div><small>Pending review</small><h2>{pending}</h2></div></div><div className="stat-card"><span className="stat-icon green"><CheckCircle2/></span><div><small>Approved</small><h2>{approved}</h2></div></div></div><div className="panel admin-summary"><h3>Application overview</h3><div className="summary-row"><span>Pending</span><b>{pending}</b></div><div className="summary-row"><span>Approved</span><b>{approved}</b></div><div className="summary-row"><span>Rejected</span><b>{rejected}</b></div><Link className="text-link" to="/admin/applications">Review all applications →</Link></div></>;
}
