import { useState } from 'react';
import { ACTORS, SKILL_WIS } from '../../data/phase1Core';
import { bangkokDate } from '../../data/trainingCore';
import { submitTraining } from '../../data/trainingStore';
import { buttonClass, Field, inputClass, panelClass } from '../../components/Phase1Shared';
import { RolePageIntro } from '../../components/RolePageIntro';
export default function TrainingRequestPage({onNavigate}:{onNavigate:(page:string)=>void}) {
  const wis=SKILL_WIS.filter(w=>w.department===ACTORS.staff.department);
  const [wiCode,setWiCode]=useState(wis[0]?.code??'');
  const wi=wis.find(w=>w.code===wiCode);
  const [type,setType]=useState(wis[0]?.types[0]?.code??'');
  const [date,setDate]=useState(bangkokDate());
  const [reason,setReason]=useState('');
  const [error,setError]=useState('');
  const [sent,setSent]=useState(false);
  function submit(event:React.FormEvent) {
    event.preventDefault(); setError('');
    try{submitTraining({wiCode,skillType:type,desiredDate:date,reason});setSent(true);setReason('');}
    catch(e){setError((e as Error).message);}
  }
  return <div className="space-y-6"><RolePageIntro title="ยื่นขอฝึกอบรม" description="เลือกทักษะที่ต้องการพัฒนา แล้วส่งคำขอให้หัวหน้างานตรวจสอบ" steps={['เลือกงานและประเภทสกิล','เสนอวันอบรมและเหตุผล','ส่งคำขอให้หัวหน้างาน']}/>{error&&<p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}{sent&&<div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800"><span>ส่งคำขอให้หัวหน้าแล้ว</span><button className="font-bold underline" onClick={()=>onNavigate('staff-training-tracking')}>ติดตามคำขอ →</button></div>}<form onSubmit={submit} className={`${panelClass} space-y-5 p-6`}><div className="rounded-lg bg-slate-50 p-4 text-sm"><strong>{ACTORS.staff.name}</strong><p className="mt-1 text-slate-500">{ACTORS.staff.employeeId} · {ACTORS.staff.department}</p></div><Field label="งานที่ต้องการฝึกอบรม"><select className={inputClass} value={wiCode} onChange={e=>{setWiCode(e.target.value);setType(wis.find(w=>w.code===e.target.value)?.types[0]?.code??'');setSent(false);}}>{wis.map(w=><option key={w.code} value={w.code}>{w.code} · {w.name}</option>)}</select></Field><div className="grid gap-4 md:grid-cols-2"><Field label="ประเภทสกิลที่ขออบรม"><select className={inputClass} value={type} onChange={e=>setType(e.target.value)}>{wi?.types.map(t=><option key={t.code} value={t.code}>{t.code} · {t.label}</option>)}</select></Field><Field label="วันที่ต้องการอบรม"><input required type="date" min={bangkokDate()} className={inputClass} value={date} onChange={e=>setDate(e.target.value)}/></Field></div><Field label="เหตุผลที่ขอฝึกอบรม"><textarea required maxLength={2000} rows={4} className={inputClass} value={reason} onChange={e=>setReason(e.target.value)} placeholder="ระบุทักษะที่ต้องการพัฒนา หรือปัญหาที่พบในการปฏิบัติงาน"/></Field><div className="flex justify-end"><button className={buttonClass}>ส่งคำขอฝึกอบรม</button></div></form></div>;
}
