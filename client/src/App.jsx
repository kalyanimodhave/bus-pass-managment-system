import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Apply from './pages/Apply';
import Applications from './pages/Applications';
import Track from './pages/Track';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplications from './pages/AdminApplications';
function StudentLayout(){return <ProtectedRoute role="student"><Layout/></ProtectedRoute>}
function AdminLayout(){return <ProtectedRoute role="admin"><Layout/></ProtectedRoute>}
export default function App(){
 const {user}=useAuth();
 return <Routes>
  <Route path="/login" element={user?<Navigate to={user.role==='admin'?'/admin':'/'}/>:<Login/>}/>
  <Route path="/register" element={user?<Navigate to="/"/>:<Register/>}/>
  <Route element={<StudentLayout/>}><Route path="/" element={<Dashboard/>}/><Route path="/apply" element={<Apply/>}/><Route path="/applications" element={<Applications/>}/><Route path="/track" element={<Track/>}/></Route>
  <Route element={<AdminLayout/>}><Route path="/admin" element={<AdminDashboard/>}/><Route path="/admin/applications" element={<AdminApplications/>}/></Route>
  <Route path="*" element={<Navigate to={user?(user.role==='admin'?'/admin':'/'):'/login'} replace/>}/>
 </Routes>;
}
