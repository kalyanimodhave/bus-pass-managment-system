import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import api from '../api';
export default function Apply(){
 const [routes,setRoutes]=useState([]);const [form,setForm]=useState({college:'',gender:'',course:'',startStop:'',endStop:'',duration:'Monthly'});
 const [docs,setDocs]=useState({bonafide:null,idCard:null,photo:null});const [error,setError]=useState('');const [success,setSuccess]=useState('');const [busy,setBusy]=useState(false);const navigate=useNavigate();
 useEffect(()=>{api.get('/applications/routes').then(r=>setRoutes(r.data.routes)).catch(()=>{});},[]);
 const stops=[...new Set(routes.flatMap(r=>r.stops))];
 const validRoutes=routes.filter(r=>r.stops.includes(form.startStop)&&r.stops.includes(form.endStop)&&r.stops.indexOf(form.startStop)<r.stops.indexOf(form.endStop));
 const submit=async e=>{e.preventDefault();setError('');setSuccess('');if(!docs.bonafide||!docs.idCard||!docs.photo){setError('Please upload all three required documents.');return;}const data=new FormData();Object.entries(form).forEach(([k,v])=>data.append(k,v));Object.entries(docs).forEach(([k,v])=>data.append(k,v));setBusy(true);try{const r=await api.post('/applications',data,{headers:{'Content-Type':'multipart/form-data'}});setSuccess(r.data.message);setTimeout(()=>navigate('/applications'),900);}catch(err){setError(err.response?.data?.message||'Unable to submit application.');}finally{setBusy(false);}};
 const file=(key,label,accept)=> 
 <div className="upload-box">
    <UploadCloud/><b>{label}</b><small>{docs[key]?.name||'PDF, JPG or PNG · max 5 MB'}</small>
    <input type="file" accept={accept}
     required onChange={e=>setDocs({...docs,[key]:e.target.files[0]||null})}/></div>;
 return <><div className="page-title">
    <span className="eyebrow">STUDENT SERVICES</span>
 <h1>Apply for Bus Pass</h1><p>Fill in your details and upload the required documents.</p>
 </div>{error&&<div className="alert error">{error}</div>}{success&&<div className="alert success">
    {success}</div>}<form className="panel application-form" onSubmit={submit}>
        <h3>Personal and college details</h3><div className="form-grid"><div>
            <label>College name</label>
            <input required value={form.college} onChange={e=>setForm({...form,college:e.target.value})}
             placeholder="Enter college name"/></div>
             <div><label>Gender</label>
             <select required value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                <option value="">Select gender</option><option>Male</option><option>Female</option>
                <option>Other</option></select></div>
                <div className="span-2"><label>Course / Class</label><input required value={form.course}
                 onChange={e=>setForm({...form,course:e.target.value})} placeholder="e.g. B.Sc. Computer Science"/>
                 </div>
                 </div><h3 className="form-subhead">Journey details</h3
                 ><div className="form-grid"><div>
                    <label>Start stop</label>
                    <select required value={form.startStop} 
                    onChange={e=>setForm({...form,startStop:e.target.value,endStop:''})}>
                        <option value="">Select start stop</option>{stops.map(s=><option key={s}>{s}</option>)}</select>
                        </div><div><label>End stop</label>
                        <select required value={form.endStop} onChange={e=>setForm({...form,endStop:e.target.value})}>
                            <option value="">Select end stop</option>{stops.filter(s=>s!==form.startStop).map(s=>
                            
                            <option key={s}>{s}</option>)}
                            </select></div>
                            {/* <div> 
                                 <label>Available route</label> 

 <select required disabled={!validRoutes.length} 
 value={validRoutes.some(r=>r.name===form.routeName)?form.routeName:validRoutes[0]?.name||''}
 
 onChange={()=>{}}><option value="">{validRoutes[0]?.name||'Select valid stops first'}</option>
 </select>{form.startStop&&form.endStop&&!validRoutes.length&&<small className="field-error">
    No configured route for this stop pair.</small>}</div> */}

 <div>
    <label>Pass duration</label><select value={form.duration} 
    onChange={e=>setForm({...form,duration:e.target.value})}>
        <option>Monthly</option><option>Quarterly</option><option>Yearly</option></select>
        </div></div><h3 className="form-subhead">Required documents</h3>
        <p className="muted small">Upload clear and readable documents. PDF, JPG and PNG files up to 5 MB each.</p>
        <div className="upload-grid">{file('bonafide','Bonafide Certificate','.pdf,.jpg,.jpeg,.png')}
            {file('idCard','College ID Card','.pdf,.jpg,.jpeg,.png')}{file('photo','Passport Photo','.jpg,.jpeg,.png')}</div><div className="form-actions"><button className="btn primary" disabled={busy||!validRoutes.length}>{busy?'Submitting…':'Submit Application'}</button></div></form></>;
}
