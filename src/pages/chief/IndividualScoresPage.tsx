import { FilterBar } from '../../components/FilterBar';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Send, X } from 'lucide-react';
import { ACTORS, bangkokYear, employeesForYear, LEVEL_LABELS, visibleEmployees } from '../../data/phase1Core';
import { individualAssessment } from '../../data/skillAssessment';
import { submitSkillAdjustment, useSkillState } from '../../data/phase1Store';
import { buttonClass, EmptyState, Field, inputClass, LevelBadge, panelClass } from '../../components/Phase1Shared';
import { RolePageIntro } from '../../components/RolePageIntro';
import { formatDate, skillLabel } from '../../lib/phase1Format';
import { Pagination } from '../../components/Pagination';
import { Avatar } from '../../components/Avatar';

export default function ChiefIndividualScoresPage() {
  const state=useSkillState();
  const employees=visibleEmployees(employeesForYear(state,bangkokYear()),'chief');
  const [employeeId,setEmployeeId]=useState('EMP001');const [editing,setEditing]=useState(false);
  const [proposed,setProposed]=useState<Record<string,number>>({});const [reason,setReason]=useState('');const [evidence,setEvidence]=useState('');
  const [message,setMessage]=useState('');const [error,setError]=useState('');
  const [currentPage,setCurrentPage]=useState(1);
  const [pageSize,setPageSize]=useState(10);

  const employee=employees.find(person=>person.id===employeeId)??employees[0];
  const rows=employee?individualAssessment(employee).rows:[];
  const canEdit=employee&&employee.id!==ACTORS.chief.employeeId&&employee.id!==ACTORS.manager.employeeId;
  const pending=state.adjustments.filter(request=>request.employeeId===employee?.id&&request.status==='pending');
  const history=state.adjustments.filter(request=>request.employeeId===employee?.id).slice().reverse().slice(0,5);
  const changes=rows.filter(row=>proposed[row.key]!==undefined&&proposed[row.key]!==row.level);

  const totalRows=rows.length;
  const totalPages=Math.max(1,Math.ceil(totalRows/pageSize));
  const safeCurrentPage=Math.min(Math.max(1,currentPage),totalPages);
  const startIndex=(safeCurrentPage-1)*pageSize;
  const paginatedRows=rows.slice(startIndex,startIndex+pageSize);

  const employeeIndex=employees.findIndex(p=>p.id===(employee?.id??''));
  function prevEmployee(){
    if(employeeIndex>0){
      setEmployeeId(employees[employeeIndex-1].id);
      cancel();
      setMessage('');
      setCurrentPage(1);
    }
  }
  function nextEmployee(){
    if(employeeIndex>=0&&employeeIndex<employees.length-1){
      setEmployeeId(employees[employeeIndex+1].id);
      cancel();
      setMessage('');
      setCurrentPage(1);
    }
  }

  function cancel(){setEditing(false);setProposed({});setReason('');setEvidence('');setError('');}
  function submit(event:React.FormEvent){event.preventDefault();setError('');setMessage('');try{submitSkillAdjustment('chief',employee!.id,proposed,reason,evidence);cancel();setMessage('ส่งข้อเสนอให้ผู้จัดการแล้ว คะแนนที่แสดงจะเปลี่ยนเมื่อผู้จัดการยืนยัน');}catch(caught){setError((caught as Error).message);}}
  return <div className="space-y-5"><RolePageIntro title="ดูคะแนนรายบุคคล" description="ดูสกิลของพนักงานในทีม หรือแก้ไขระดับสกิลเพื่อเสนอให้ผู้จัดการยืนยัน"/>{message&&<p role="status" className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}{error&&<p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <FilterBar title="เลือกพนักงานในทีม" footer={<><div className="flex items-center gap-3"><Avatar src={employee?.avatarUrl} name={employee?.name} size="md"/><div><p className="font-semibold text-slate-800 text-sm">{employee?.name}</p><p className="text-xs text-slate-500">{employee?.id} · {employee?.department} · {employee?.position}{editing?' · ส่งข้อเสนอหรือยกเลิกก่อนเปลี่ยนพนักงาน':''}</p></div></div>{canEdit&&!editing&&<button className={buttonClass} onClick={()=>{setEditing(true);setMessage('');}}><Pencil size={16}/>แก้ไขคะแนนแบบแมนนวล</button>}{editing&&<button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600" onClick={cancel}><X size={16}/>ยกเลิกการแก้ไข</button>}</>}><Field label="พนักงานในทีม"><div className="flex items-center gap-2"><button type="button" title="พนักงานคนก่อนหน้า" disabled={editing||employeeIndex<=0} onClick={prevEmployee} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"><ChevronLeft size={16}/></button><div className="relative flex-1 min-w-[200px]"><div className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center z-10"><Avatar src={employee?.avatarUrl} name={employee?.name} size="xs"/></div><select className={inputClass} style={{ paddingLeft: '2.75rem' }} disabled={editing} value={employee?.id??''} onChange={event=>{setEmployeeId(event.target.value);cancel();setMessage('');setCurrentPage(1);}}>{employees.map(person=><option key={person.id} value={person.id}>{person.id} · {person.name}</option>)}</select></div><button type="button" title="พนักงานคนถัดไป" disabled={editing||employeeIndex<0||employeeIndex>=employees.length-1} onClick={nextEmployee} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"><ChevronRight size={16}/></button></div></Field></FilterBar>
    {editing&&<p className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">ปรับระดับที่เสนอได้ตั้งแต่ 0–3 แล้วส่งให้ผู้จัดการยืนยัน คะแนนเดิมยังมีผลระหว่างรอพิจารณา</p>}
    {!employee?<EmptyState>ยังไม่มีข้อมูลพนักงานในแผนก</EmptyState>:<div className="space-y-5"><div className={`${panelClass} overflow-x-auto`}><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">W/I / ชื่องาน</th><th className="p-4">ประเภทสกิล</th><th className="p-4 text-center">คะแนนที่ยืนยันแล้ว</th>{editing&&<th className="p-4">คะแนนที่เสนอ</th>}<th className="p-4">สถานะ</th></tr></thead><tbody>{paginatedRows.map(row=>{const request=pending.find(item=>item.changes.some(change=>change.key===row.key));const change=request?.changes.find(item=>item.key===row.key);const altered=proposed[row.key]!==undefined&&proposed[row.key]!==row.level;return <tr key={row.key} className={`border-t border-slate-100 ${altered?'bg-blue-50/50':''}`}><td className="p-4"><span className="font-mono font-semibold">{row.wiCode}</span><p className="mt-1 max-w-md text-xs text-slate-500">{row.wiName}</p></td><td className="p-4">{row.type} · {row.typeName}</td><td className="p-4 text-center"><LevelBadge level={row.level}/></td>{editing&&<td className="p-4"><select aria-label={`คะแนน ${row.key}`} disabled={!!request} className={`${inputClass} min-w-52 disabled:bg-slate-100`} value={proposed[row.key]??row.level} onChange={event=>setProposed({...proposed,[row.key]:Number(event.target.value)})}>{LEVEL_LABELS.map((label,value)=><option key={value} value={value}>{value} · {label}</option>)}</select></td>}<td className="p-4 text-xs">{change?<span className="font-semibold text-amber-700">รอผู้จัดการยืนยัน {change.before} → {change.after}</span>:<span className="text-slate-400">ยืนยันแล้ว</span>}</td></tr>;})}</tbody></table><Pagination currentPage={safeCurrentPage} totalItems={totalRows} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} pageSizeOptions={[5, 10, 25, 50]} itemLabel="สกิล"/></div>
      {editing&&<div className={`${panelClass} space-y-4 p-5`}><h2 className="font-bold text-slate-800">ข้อเสนอปรับคะแนน {changes.length} สกิล</h2>{changes.length>0&&<div className="flex flex-wrap gap-2">{changes.map(row=><span key={row.key} className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">{skillLabel(row.key)} · {row.level} → {proposed[row.key]}</span>)}</div>}<Field label="เหตุผลการปรับคะแนน"><textarea required maxLength={2000} rows={3} className={inputClass} value={reason} onChange={event=>setReason(event.target.value)} placeholder="ระบุผลประเมินหรือเหตุผลที่เสนอให้ปรับระดับ"/></Field><Field label="หลักฐานอ้างอิง"><input maxLength={1000} className={inputClass} value={evidence} onChange={event=>setEvidence(event.target.value)} placeholder="เลขที่เอกสาร / ผลทดสอบ / ลิงก์หลักฐาน"/></Field><div className="flex justify-end"><button type="button" onClick={submit} disabled={!changes.length||!reason.trim()} className={buttonClass}><Send size={16}/>ส่งคำขอเปลี่ยนคะแนนให้ผู้จัดการ</button></div></div>}
    </div>}
    {history.length>0&&<details className={`${panelClass} p-5`} open={pending.length>0}><summary className="cursor-pointer text-sm font-bold text-slate-800">ประวัติคำขอเปลี่ยนคะแนนของพนักงาน</summary><div className="mt-4 space-y-4">{history.map(request=><div key={request.id} className="border-t border-slate-100 pt-3"><div className="flex flex-wrap justify-between gap-2 text-xs"><span className="text-slate-500">{formatDate(request.submittedAt)}</span><strong className={request.status==='pending'?'text-amber-700':request.status==='approved'?'text-emerald-700':'text-red-700'}>{request.status==='pending'?'รอผู้จัดการยืนยัน':request.status==='approved'?'ผู้จัดการยืนยันแล้ว':'ผู้จัดการไม่อนุมัติ'}</strong></div><p className="mt-2 text-sm text-slate-700">{request.changes.map(change=>`${skillLabel(change.key)}: ${change.before} → ${change.after}`).join(' · ')}</p><p className="mt-1 text-xs text-slate-500">เหตุผล: {request.reason}{request.remark?` · ความเห็นผู้จัดการ: ${request.remark}`:''}</p></div>)}</div></details>}
  </div>;
}

