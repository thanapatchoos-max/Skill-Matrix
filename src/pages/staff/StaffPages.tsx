import { ACTORS, bangkokYear, employeesForYear, sumSkills } from '../../data/phase1Core';
import { useSkillState } from '../../data/phase1Store';
import { useTrainingRequests } from '../../data/trainingStore';
import { Metric } from '../../components/Phase1Shared';
import { RolePageIntro, TaskCard } from '../../components/RolePageIntro';
import MyScoresPage from './MyScoresPage';
import YearlySkill from '../YearlySkill';
import { WILibrary } from '../WILibrary';
export function StaffHomePage({onNavigate}:{onNavigate:(page:string)=>void}) {
  const state=useSkillState();
  const employee=employeesForYear(state,bangkokYear()).find(e=>e.id===ACTORS.staff.employeeId);
  const requests=useTrainingRequests().filter(r=>r.employeeId===ACTORS.staff.employeeId);
  return <div className="space-y-6"><RolePageIntro title="หน้าหลักของฉัน" description={`${ACTORS.staff.name} · ติดตามทักษะและการฝึกอบรมของตนเอง`}/><div className="grid gap-4 md:grid-cols-3"><Metric label="คะแนนสกิลของฉัน" value={employee?sumSkills(employee):0}/><Metric label="คำขอรอหัวหน้าตรวจ" value={requests.filter(r=>r.status==='requested').length}/><Metric label="รายการที่มีนัดอบรม" value={requests.filter(r=>r.status==='scheduled').length}/></div><div className="grid gap-4 md:grid-cols-2"><TaskCard title="พัฒนาทักษะที่ต้องการ" description="เลือกงานและเสนอวันฝึกอบรมให้หัวหน้าพิจารณา" action="ยื่นขอฝึกอบรม" onClick={()=>onNavigate('staff-training-request')}/><TaskCard title="ตรวจคำขอที่ส่งไว้" description="ดูว่าหัวหน้าตอบรับแล้วหรือยัง และตรวจวันนัดอบรม" action="ติดตามคำขอของฉัน" onClick={()=>onNavigate('staff-training-tracking')}/><TaskCard title="ผลฝึกอบรมของฉัน" description="ดูคะแนนหลังฝึกอบรมและผลรับรองจากผู้จัดการ" action="ดูผลฝึกอบรม" onClick={()=>onNavigate('staff-training-results')}/><TaskCard title="พัฒนาการของฉัน" description="ดูคะแนนสกิลและประวัติการเปลี่ยนแปลงรายปี" action="ดูพัฒนาการรายปี" onClick={()=>onNavigate('staff-yearly')}/></div></div>;
}
export function StaffSkillsPage(){return <MyScoresPage/>;}
export function StaffYearlyPage(){return <YearlySkill userRole="staff" title="พัฒนาการของฉัน"/>;}
export function StaffGuidePage(){return <div className="space-y-5"><RolePageIntro title="คู่มือสำหรับพนักงาน" description="อ่านมาตรฐาน W/I เพื่อเตรียมตัวก่อนปฏิบัติงานหรือฝึกอบรม"/><WILibrary userRole="staff"/></div>;}
