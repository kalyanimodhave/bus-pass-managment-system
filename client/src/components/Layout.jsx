import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BusFront, LayoutDashboard, FilePlus2, Files, Search, Users, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/login'); };
  const links = user?.role === 'admin'
    ? [{to:'/admin',label:'Dashboard',icon:LayoutDashboard},{to:'/admin/applications',label:'Manage Applications',icon:Users}]
    : [{to:'/',label:'Dashboard',icon:LayoutDashboard},{to:'/apply',label:'Apply for Pass',icon:FilePlus2},{to:'/applications',label:'My Applications',icon:Files},{to:'/track',label:'Track Status',icon:Search}];
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-icon"><BusFront/></span><span>ST Bus Pass<small>Management Portal</small></span></div>
      <div className="profile-mini"><div className="avatar">{user?.name?.[0]?.toUpperCase()}</div><div><b>{user?.name}</b><small>{user?.role === 'admin' ? 'Administrator' : 'Student account'}</small></div></div>
      <nav>{links.map(({to,label,icon:Icon})=><NavLink end={to==='/'} key={to} to={to}><Icon size={18}/>{label}</NavLink>)}</nav>
      <button className="nav-logout" onClick={signOut}><LogOut size={18}/>Logout</button>
      <div className="sidebar-note"><ShieldCheck size={17}/> Safe and simple student travel</div>
    </aside>
    <main className="main-area"><header className="topbar"><div><span className="eyebrow">MAHARASHTRA STATE ROAD TRANSPORT</span><h2>Bus Pass Management System</h2></div><div className="top-user"><span className="online-dot"></span>{user?.name}</div></header><section className="page-content"><Outlet/></section></main>
  </div>;
}
