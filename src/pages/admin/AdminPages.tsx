import { FilterBar } from '../../components/FilterBar';
import { useState } from 'react';
import { bangkokYear, employeesForYear, SKILL_WIS } from '../../data/phase1Core';
import { useSkillState } from '../../data/phase1Store';
import { useTrainingRequests } from '../../data/trainingStore';
import { TRAINING_STATUS } from '../../data/trainingCore';
import { EmptyState, Field, inputClass, Metric } from '../../components/Phase1Shared';
import { RolePageIntro, TaskCard } from '../../components/RolePageIntro';
import TrainingRecordCard from '../../components/TrainingRecordCard';
import PhaseOneEmployees from '../PhaseOneEmployees';
import PhaseOneSettings from '../PhaseOneSettings';
import SkillApprovals from '../SkillApprovals';
import JobSummary from '../JobSummary';
import { MasterData } from '../MasterData';
export function AdminHomePage({onNavigate}:{onNavigate:(page:string)=>void}) {
  const state=useSkillState();const training=useTrainingRequests();
  return <div className="space-y-6"><RolePageIntro title="ภาพรวมการดูแลระบบ" description="จัดการข้อมูลหลักและตรวจประวัติการดำเนินงาน"/><div className="grid gap-4 md:grid-cols-3"><Metric label="ข้อมูลพนักงาน" value={employeesForYear(state,bangkokYear()).length}/><Metric label="มาตรฐานงาน W/I" value={SKILL_WIS.length}/><Metric label="รายการฝึกอบรมในระบบ" value={training.length}/></div><div className="grid gap-4 md:grid-cols-2"><TaskCard title="จัดการข้อมูลพนักงาน" description="ดูแลข้อมูลพนักงาน แผนก และงานที่ได้รับมอบหมาย" action="จัดการพนักงาน" onClick={()=>onNavigate('admin-employees')}/><TaskCard title="จัดการข้อมูลพื้นฐาน" description="ดูแลรายการ W/I และประเภทสกิลสำหรับใช้งานในระบบ" action="จัดการข้อมูลหลัก" onClick={()=>onNavigate('admin-master-data')}/><TaskCard title="ตรวจประวัติการปรับคะแนน" description="ตรวจผู้เสนอ ผู้พิจารณา และสถานะคำขอคะแนน" action="ตรวจประวัติสกิล" onClick={()=>onNavigate('admin-skill-audit')}/><TaskCard title="ตรวจประวัติการฝึกอบรม" description="ดูรายการฝึกอบรมตั้งแต่ยื่นคำขอจนถึงการรับรองผล" action="ตรวจประวัติฝึกอบรม" onClick={()=>onNavigate('admin-training-audit')}/></div></div>;
}
export function AdminEmployeesPage(){return <PhaseOneEmployees userRole="admin"/>;}
export function AdminMasterDataPage(){return <MasterData userRole="admin"/>;}
export function AdminSkillAuditPage(){return <SkillApprovals userRole="admin" title="ตรวจประวัติการปรับคะแนน"/>;}
export function AdminReportsPage(){return <JobSummary userRole="admin" title="รายงานข้อมูลสกิล"/>;}
export function AdminSettingsPage({onNavigate}:{onNavigate:(page:string)=>void}){return <PhaseOneSettings onPermissions={()=>onNavigate('admin-permissions')}/>;}
export function AdminPermissionsPage(){return <PhaseOneSettings permissions onPermissions={()=>{}}/>;}
export function AdminTrainingAuditPage(){const requests=useTrainingRequests();const [status,setStatus]=useState('ALL');const filtered=requests.filter(r=>status==='ALL'||r.status===status).slice().reverse();return <div className="space-y-6"><RolePageIntro title="ตรวจประวัติฝึกอบรม" description="ตรวจรายการทุกขั้นตอนแบบอ่านอย่างเดียว การพิจารณาดำเนินการโดยหัวหน้าและผู้จัดการ"/><FilterBar title="ตัวกรองประวัติฝึกอบรม" onReset={()=>setStatus('ALL')}><Field label="สถานะฝึกอบรม"><select className={inputClass} value={status} onChange={e=>setStatus(e.target.value)}><option value="ALL">ทุกสถานะ</option>{Object.entries(TRAINING_STATUS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></Field></FilterBar>{filtered.length?filtered.map(r=><TrainingRecordCard key={r.id} record={r}/>):<EmptyState>ไม่มีรายการในสถานะที่เลือก</EmptyState>}</div>;}
