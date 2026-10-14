import { FilterBar } from '../components/FilterBar';
import { useState } from 'react';
import { CheckSquare, Check, X } from 'lucide-react';
import { bangkokYear, employeesForYear } from '../data/phase1Core';
import { decideSkillAdjustment, useSkillState } from '../data/phase1Store';
import { buttonClass, EmptyState, Field, inputClass, LevelBadge, panelClass } from '../components/Phase1Shared';
import { formatDate, skillLabel } from '../lib/phase1Format';

export default function SkillApprovals({ userRole, title='อนุมัติการปรับคะแนนสกิล' }: { userRole: string; title?:string }) {
  const state = useSkillState();
  const [status, setStatus] = useState(userRole === 'admin' ? 'ALL' : 'pending');
  const [remarks, setRemarks] = useState<Record<string,string>>({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  if (userRole !== 'manager' && userRole !== 'admin') return <EmptyState>หน้านี้สำหรับผู้จัดการและผู้ดูแลระบบ</EmptyState>;
  const requests = state.adjustments.filter(a => status === 'ALL' || a.status === status).slice().reverse();
  const employees = employeesForYear(state, bangkokYear());
  function decide(id: string, decision: 'approved' | 'rejected') {
    setError(''); setMessage('');
    try { decideSkillAdjustment('manager', id, decision, remarks[id] ?? ''); setMessage(decision === 'approved' ? 'อนุมัติแล้ว คะแนนใน Skill Matrix, Yearly Skill และ Job Summary อัปเดตแล้ว' : 'ไม่อนุมัติคำขอ คะแนนเดิมยังคงอยู่'); }
    catch (e) { setError((e as Error).message); }
  }
  return <div className="space-y-6"><div className="flex flex-wrap justify-between gap-4"><div><h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800"><CheckSquare/>{title}</h1><p className="mt-1 text-sm text-slate-500">ตรวจสอบระดับที่หัวหน้างานเสนอ พร้อมเหตุผลและหลักฐาน</p></div></div>
    <FilterBar title="ตัวกรองคำขอปรับคะแนน" onReset={()=>setStatus(userRole==='admin'?'ALL':'pending')}><Field label="สถานะคำขอ"><select className={inputClass} value={status} onChange={e => setStatus(e.target.value)}><option value="pending">รออนุมัติ</option><option value="approved">อนุมัติแล้ว</option><option value="rejected">ไม่อนุมัติ</option><option value="ALL">ทั้งหมด</option></select></Field></FilterBar>
    {userRole === 'admin' && <p className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">ผู้ดูแลระบบดูรายการได้ ผู้จัดการเป็นผู้อนุมัติคะแนน</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}{message && <p role="status" className="rounded-lg bg-emerald-50 p-4 text-emerald-800">{message}</p>}
    {!requests.length ? <EmptyState>ไม่มีคำขอในสถานะที่เลือก</EmptyState> : requests.map(a => <article key={a.id} className={`${panelClass} p-6`}><div className="flex justify-between gap-4"><div><h2 className="font-bold text-slate-800">{employees.find(e => e.id === a.employeeId)?.name ?? a.employeeId}</h2><p className="mt-1 text-sm text-slate-500">{a.employeeId} · ปี {a.year} · ผู้เสนอ {a.submittedName} · {formatDate(a.submittedAt)}</p></div><span className="text-sm font-semibold text-blue-800">{a.status === 'pending' ? 'รออนุมัติ' : a.status === 'approved' ? 'อนุมัติแล้ว' : 'ไม่อนุมัติ'}</span></div>
      <table className="my-4 w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-3">W/I–ประเภท</th><th className="p-3 text-center">ก่อนปรับ</th><th className="p-3 text-center">เสนอใหม่</th></tr></thead><tbody>{a.changes.map(c => <tr key={c.key} className="border-b border-slate-100"><td className="p-3 font-mono">{skillLabel(c.key)}</td><td className="p-3 text-center"><LevelBadge level={c.before}/></td><td className="p-3 text-center"><LevelBadge level={c.after}/></td></tr>)}</tbody></table>
      <div className="mb-4 space-y-2 text-sm text-slate-600"><p><strong>เหตุผล:</strong> {a.reason}</p><p><strong>หลักฐานอ้างอิง:</strong> {a.evidence || 'ไม่ได้ระบุ'}</p></div>
      {a.status === 'pending' && userRole === 'manager' ? <div className="space-y-3 border-t border-slate-100 pt-4"><Field label="ความเห็นผู้จัดการ (จำเป็นเมื่อไม่อนุมัติ)"><textarea className={inputClass} rows={2} maxLength={2000} value={remarks[a.id] ?? ''} onChange={e => setRemarks({...remarks, [a.id]: e.target.value})}/></Field><div className="flex justify-end gap-2"><button onClick={() => decide(a.id, 'rejected')} className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"><X size={16}/>ไม่อนุมัติ</button><button onClick={() => decide(a.id, 'approved')} className={buttonClass}><Check size={16}/>อนุมัติคะแนน</button></div></div> : a.reviewedAt && <p className="text-sm text-slate-500">ผู้พิจารณา {a.reviewedName} · {formatDate(a.reviewedAt)} · {a.remark || 'ไม่มีความเห็นเพิ่มเติม'}</p>}
    </article>)}
  </div>;
}
