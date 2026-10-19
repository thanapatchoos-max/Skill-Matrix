import { useState } from 'react';
import { Bell, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import RolePageRouter from './pages/RolePageRouter';
import { ACTORS, bangkokYear, employeesForYear } from './data/phase1Core';
import type { Role } from './data/phase1Core';
import type { ScoreAssessmentScope } from './data/skillAssessment';
import { ROLE_NAMES, roleCanVisit, roleHome, rolePage } from './data/roleNavigation';
import { getStorageError, useSkillState } from './data/phase1Store';
import { trainingStorageError, useTrainingRequests } from './data/trainingStore';
import { Avatar } from './components/Avatar';

export default function App() {
  const [role,setRole]=useState<Role|null>(null);
  const [currentPage,setCurrentPage]=useState('');
  const [showNotifications,setShowNotifications]=useState(false);
  const [assessmentScope,setAssessmentScope]=useState<ScoreAssessmentScope>();
  const state=useSkillState();const training=useTrainingRequests();
  function navigate(id:string,scope?:ScoreAssessmentScope){if(role&&roleCanVisit(id,role)){setAssessmentScope(scope);setCurrentPage(id);setShowNotifications(false);}}
  if(!role)return <LoginPage onLoginSuccess={value=>{if(Object.hasOwn(ACTORS,value)){const selected=value as Role;setRole(selected);setCurrentPage(roleHome(selected));}}}/>;
  const page=roleCanVisit(currentPage,role)?currentPage:roleHome(role);
  const actor=ACTORS[role];
  const actorEmployee = employeesForYear(state, bangkokYear()).find(e => e.id === actor.employeeId);
  const notifications=role==='chief' ? [
    {id:'chief-training-requests',label:'คำขอฝึกอบรมรอตรวจ',count:training.filter(r=>r.department===actor.department&&r.status==='requested').length},
    {id:'chief-training-evaluation',label:'รายการรอบันทึกผลอบรม',count:training.filter(r=>r.department===actor.department&&r.status==='scheduled').length},
  ] : role==='manager' ? [
    {id:'manager-skill-approvals',label:'คะแนนสกิลรออนุมัติ',count:state.adjustments.filter(a=>a.status==='pending').length},
    {id:'manager-training-approvals',label:'ผลอบรมรอรับรอง',count:training.filter(r=>r.status==='pending-manager').length},
  ] : role==='staff' ? [{id:'staff-training-tracking',label:'คำขอฝึกอบรมระหว่างดำเนินการ',count:training.filter(r=>r.employeeId===actor.employeeId&&['requested','scheduled'].includes(r.status)).length}] : [];
  const count=notifications.reduce((n,item)=>n+item.count,0);
  return <div className="flex min-h-screen bg-app-surface print:block print:bg-white"><Sidebar currentPage={page} setCurrentPage={navigate} userRole={role}/><main className="ml-64 min-w-0 flex-1 p-6 lg:p-8 print:ml-0 print:p-0"><header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 print:hidden"><div><div className="text-sm font-bold text-blue-800">{ROLE_NAMES[role]}</div><div className="mt-1 text-xs text-slate-500">{rolePage(page,role)?.purpose}</div></div><div className="flex items-center gap-4"><div className="relative"><button aria-label="การแจ้งเตือน" onClick={()=>setShowNotifications(!showNotifications)} className="relative rounded-full p-2 hover:bg-slate-100"><Bell size={20}/>{count>0&&<span className="absolute right-0 top-0 rounded-full bg-amber-500 px-1 text-xs text-white">{count}</span>}</button>{showNotifications&&<div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"><h2 className="mb-3 font-semibold">รายการของคุณ</h2>{count?notifications.filter(item=>item.count>0).map(item=><button key={item.id} className="block w-full rounded-lg p-3 text-left text-sm text-blue-800 hover:bg-blue-50" onClick={()=>navigate(item.id)}>{item.label} · {item.count} รายการ →</button>):<p className="text-sm text-slate-500">ไม่มีรายการที่ต้องติดตาม</p>}</div>}</div><div className="flex items-center gap-3 border-l border-slate-200 pl-4"><Avatar src={actorEmployee?.avatarUrl} name={actor.name} size="sm"/><div className="text-right"><div className="text-sm font-bold text-slate-700">{actor.name}</div><div className="text-xs text-slate-500">{role==='staff'?'Staff':role==='chief'?'Section Chief':role==='manager'?'Department Manager':'System Admin'}</div></div></div><button aria-label="เปลี่ยนบทบาท / ออกจากระบบ" onClick={()=>{setRole(null);setCurrentPage('');setShowNotifications(false);}} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-100"><LogOut size={16}/><span>เปลี่ยนบทบาท</span></button></div></header>
    <p className="mb-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800 print:hidden">โหมดสาธิต · ข้อมูลพนักงาน คะแนนย้อนหลัง และรายการฝึกอบรมเป็นข้อมูลตัวอย่าง สามารถทดลองตรวจคำขอ ประเมิน และอนุมัติได้ โดยผลบันทึกอยู่ในเบราว์เซอร์นี้</p>
    {(getStorageError()||trainingStorageError())&&<p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{getStorageError()||trainingStorageError()}</p>}
    <RolePageRouter key={page} page={page} role={role} onNavigate={navigate} assessmentScope={assessmentScope}/>
  </main></div>;
}
