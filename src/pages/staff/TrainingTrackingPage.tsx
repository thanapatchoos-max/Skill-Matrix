import { ACTORS } from '../../data/phase1Core';
import { useTrainingRequests } from '../../data/trainingStore';
import { EmptyState, buttonClass } from '../../components/Phase1Shared';
import TrainingRecordCard from '../../components/TrainingRecordCard';
import { RolePageIntro } from '../../components/RolePageIntro';
export default function TrainingTrackingPage({onNavigate}:{onNavigate:(page:string)=>void}) {
  const requests=useTrainingRequests().filter(r=>r.employeeId===ACTORS.staff.employeeId && ['requested','scheduled','rejected-chief'].includes(r.status)).slice().reverse();
  return <div className="space-y-6"><div className="flex flex-wrap justify-between gap-4"><RolePageIntro title="ติดตามคำขอของฉัน" description="ดูผลการตอบรับจากหัวหน้างานและวันนัดหมายอบรม"/><button className={buttonClass} onClick={()=>onNavigate('staff-training-request')}>ยื่นคำขอใหม่</button></div>{requests.length?requests.map(r=><TrainingRecordCard key={r.id} record={r}/>):<EmptyState>ไม่มีคำขอรอตรวจหรือรออบรม ดูรายการที่ประเมินแล้วได้ที่หน้าผลฝึกอบรมของฉัน</EmptyState>}</div>;
}
