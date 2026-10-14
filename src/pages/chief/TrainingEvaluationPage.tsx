import { useState } from 'react';
import { ACTORS } from '../../data/phase1Core';
import { scoreTraining, useTrainingRequests } from '../../data/trainingStore';
import { buttonClass, EmptyState, Field, inputClass } from '../../components/Phase1Shared';
import TrainingRecordCard from '../../components/TrainingRecordCard';
import { RolePageIntro } from '../../components/RolePageIntro';
export default function TrainingEvaluationPage() {
  const requests=useTrainingRequests().filter(r=>r.department===ACTORS.chief.department && r.status==='scheduled');
  const [scores,setScores]=useState<Record<string,{theory:string;practical:string;note:string}>>({});
  const [error,setError]=useState('');const [message,setMessage]=useState('');
  function save(id:string,event:React.FormEvent) {
    event.preventDefault();setError('');setMessage('');
    try{const s=scores[id];if(!s || !s.theory.trim() || !s.practical.trim())throw new Error('กรอกคะแนนทั้งสองส่วน');scoreTraining(id,Number(s.theory),Number(s.practical),s.note);setMessage(Number(s.theory)>=80&&Number(s.practical)>=80?'บันทึกผลและส่งให้ผู้จัดการรับรองแล้ว':'บันทึกผลไม่ผ่านแล้ว พนักงานดูผลได้ในหน้าของตนเอง');}
    catch(e){setError((e as Error).message);}
  }
  return <div className="space-y-6"><RolePageIntro title="บันทึกผลฝึกอบรม" description="ประเมินรายการที่หัวหน้าอนุมัติคำขอแล้ว และส่งผลที่ผ่านให้ผู้จัดการรับรอง" steps={['ตรวจรายการและวันอบรม','บันทึกทฤษฎี / ปฏิบัติ','ส่งผลประเมินเพื่อรับรอง']}/><p className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">เกณฑ์ประเมินของต้นแบบ: ทฤษฎีและปฏิบัติต้องได้อย่างน้อย 80% ทั้งสองส่วน คะแนนสกิลปรับผ่านหน้าเสนอปรับคะแนนแยกต่างหาก</p>{error&&<p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}{message&&<p role="status" className="rounded-lg bg-emerald-50 p-4 text-emerald-800">{message}</p>}{requests.length?requests.map(r=>{const s=scores[r.id]??{theory:'',practical:'',note:''};return <TrainingRecordCard key={r.id} record={r}><form className="space-y-4 border-t border-slate-100 pt-4" onSubmit={event=>save(r.id,event)}><div className="grid gap-4 md:grid-cols-2"><Field label={`คะแนนทฤษฎี ${r.employeeId}`}><input required type="number" min={0} max={100} step="any" className={inputClass} value={s.theory} onChange={e=>setScores({...scores,[r.id]:{...s,theory:e.target.value}})}/></Field><Field label={`คะแนนปฏิบัติ ${r.employeeId}`}><input required type="number" min={0} max={100} step="any" className={inputClass} value={s.practical} onChange={e=>setScores({...scores,[r.id]:{...s,practical:e.target.value}})}/></Field></div><Field label={`ผลประเมิน / หลักฐาน ${r.employeeId}`}><textarea required maxLength={2000} className={inputClass} value={s.note} onChange={e=>setScores({...scores,[r.id]:{...s,note:e.target.value}})}/></Field><div className="flex justify-end"><button className={buttonClass}>บันทึกผลประเมิน</button></div></form></TrainingRecordCard>;}):<EmptyState>ไม่มีรายการอบรมที่รอบันทึกผล</EmptyState>}</div>;
}
