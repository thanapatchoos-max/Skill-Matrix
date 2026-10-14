import { ACTORS } from '../../data/phase1Core';
import { useTrainingRequests } from '../../data/trainingStore';
import { EmptyState, Metric } from '../../components/Phase1Shared';
import TrainingRecordCard from '../../components/TrainingRecordCard';
import { RolePageIntro } from '../../components/RolePageIntro';
export default function TrainingResultsPage() {
  const results=useTrainingRequests().filter(r=>r.employeeId===ACTORS.staff.employeeId && ['pending-manager','approved','rejected-manager','failed'].includes(r.status)).slice().reverse();
  return <div className="space-y-6"><RolePageIntro title="ผลฝึกอบรมของฉัน" description="ดูคะแนนประเมินและผลรับรองจากผู้จัดการ"/><div className="grid gap-4 md:grid-cols-3"><Metric label="ประเมินแล้ว" value={results.length}/><Metric label="รับรองผลแล้ว" value={results.filter(r=>r.status==='approved').length}/><Metric label="รอผู้จัดการรับรอง" value={results.filter(r=>r.status==='pending-manager').length}/></div>{results.length?results.map(r=><TrainingRecordCard key={r.id} record={r}/>):<EmptyState>ยังไม่มีผลการฝึกอบรมของคุณ</EmptyState>}<p className="text-xs text-slate-500">ผลอบรมเป็นหลักฐานประกอบการประเมินสกิล หัวหน้างานจะเสนอปรับคะแนนผ่านขั้นตอนอนุมัติสกิล</p></div>;
}
