import { useState } from 'react';
import { approveTrainingResult, useTrainingRequests } from '../../data/trainingStore';
import { buttonClass, EmptyState, Field, inputClass, Metric } from '../../components/Phase1Shared';
import TrainingRecordCard from '../../components/TrainingRecordCard';
import { RolePageIntro } from '../../components/RolePageIntro';
export default function TrainingApprovalsPage() {
  const requests=useTrainingRequests().filter(r=>r.status==='pending-manager');
  const [remarks,setRemarks]=useState<Record<string,string>>({});
  const [error,setError]=useState('');const [message,setMessage]=useState('');
  function decide(id:string,approve:boolean) {setError('');setMessage('');try{approveTrainingResult(id,approve,remarks[id]??'');setMessage(approve?'รับรองผลฝึกอบรมแล้ว':'บันทึกผลไม่รับรองพร้อมเหตุผลแล้ว');}catch(e){setError((e as Error).message);}}
  return <div className="space-y-6"><RolePageIntro title="รับรองผลฝึกอบรม" description="ตรวจคะแนนและหลักฐานที่หัวหน้างานประเมินก่อนรับรองผล" steps={['ตรวจผลประเมินจากหัวหน้า','พิจารณาหลักฐานและความเหมาะสม','รับรองหรือส่งความเห็นกลับ']}/><Metric label="ผลอบรมรอผู้จัดการรับรอง" value={requests.length}/>{error&&<p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}{message&&<p role="status" className="rounded-lg bg-emerald-50 p-4 text-emerald-800">{message}</p>}{requests.length?requests.map(r=><TrainingRecordCard key={r.id} record={r}><Field label={`ความเห็นผู้จัดการ ${r.employeeId} ${r.wiCode}`}><textarea maxLength={2000} className={inputClass} value={remarks[r.id]??''} onChange={e=>setRemarks({...remarks,[r.id]:e.target.value})} placeholder="จำเป็นเมื่อไม่รับรองผล"/></Field><div className="flex justify-end gap-2"><button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700" onClick={()=>decide(r.id,false)}>ไม่รับรองผล</button><button className={buttonClass} onClick={()=>decide(r.id,true)}>รับรองผลฝึกอบรม</button></div></TrainingRecordCard>):<EmptyState>ไม่มีผลฝึกอบรมที่รอผู้จัดการรับรอง</EmptyState>}</div>;
}
