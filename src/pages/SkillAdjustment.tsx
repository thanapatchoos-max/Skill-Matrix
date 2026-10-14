import { useState } from 'react';
import { ClipboardEdit, Send } from 'lucide-react';
import { ACTORS, bangkokYear, employeesForYear, LEVEL_LABELS, skillKeys } from '../data/phase1Core';
import { submitSkillAdjustment, useSkillState } from '../data/phase1Store';
import { buttonClass, EmptyState, Field, inputClass, LevelBadge, panelClass } from '../components/Phase1Shared';
import { formatDate, skillLabel } from '../lib/phase1Format';

export default function SkillAdjustment({ userRole }: { userRole: string }) {
  const state = useSkillState();
  const eligible = employeesForYear(state, bangkokYear()).filter(e => e.department === ACTORS.chief.department && e.id !== ACTORS.chief.employeeId && e.id !== ACTORS.manager.employeeId);
  const [employeeId, setEmployeeId] = useState(eligible[0]?.id ?? '');
  const [proposed, setProposed] = useState<Record<string, number>>({});
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const employee = eligible.find(e => e.id === employeeId);
  const requests = state.adjustments.filter(a => a.submittedBy === ACTORS.chief.id).slice().reverse();
  function submit(event: React.FormEvent) {
    event.preventDefault(); setError(''); setMessage('');
    try { submitSkillAdjustment('chief', employeeId, proposed, reason, evidence); setProposed({}); setReason(''); setEvidence(''); setMessage('ส่งคำขอแล้ว คะแนนปัจจุบันจะเปลี่ยนเมื่อผู้จัดการอนุมัติ'); }
    catch (e) { setError((e as Error).message); }
  }
  if (userRole !== 'chief') return <EmptyState>หน้าปรับคะแนนสำหรับหัวหน้างาน ผู้จัดการพิจารณาคะแนนผ่านหน้าการอนุมัติ</EmptyState>;
  const changedCount = employee ? Object.entries(proposed).filter(([key,value]) => value !== (employee.scores[key] ?? 0)).length : 0;
  return <div className="space-y-6">
    <div><h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800"><ClipboardEdit/>เสนอปรับคะแนนสกิล</h1><p className="mt-1 text-sm text-slate-500">หัวหน้างานเสนอปรับระดับประจำปี {bangkokYear()} · ผู้จัดการตรวจสอบและอนุมัติ</p></div>
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">1. เลือกพนักงาน → 2. กำหนดระดับ 0–3 พร้อมเหตุผล → 3. ส่งให้ผู้จัดการ → 4. อนุมัติและบันทึกประวัติ</div>
    {message && <p role="status" className="rounded-lg bg-emerald-50 p-4 text-emerald-800">{message}</p>}{error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
    <form onSubmit={submit} className={`${panelClass} space-y-5 p-6`}>
      <div className="grid gap-4 md:grid-cols-2"><Field label="พนักงานใต้บังคับบัญชา"><select className={inputClass} value={employeeId} onChange={e => { setEmployeeId(e.target.value); setProposed({}); setError(''); setMessage(''); }}>{eligible.map(e => <option key={e.id} value={e.id}>{e.id} · {e.name}</option>)}</select></Field><div className="pt-6 text-sm text-slate-500">แผนก {ACTORS.chief.department} · ผู้เสนอ {ACTORS.chief.name}</div></div>
      {employee && <div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-3">W/I–ประเภทสกิล</th><th className="p-3 text-center">ระดับปัจจุบัน</th><th className="p-3">ระดับที่เสนอ</th></tr></thead><tbody>{skillKeys(employee).map(key => { const pending = state.adjustments.some(a => a.status === 'pending' && a.employeeId === employeeId && a.changes.some(c => c.key === key)); const current = employee.scores[key] ?? 0; const changed = (proposed[key] ?? current) !== current; return <tr key={key} className={`border-t border-slate-100 ${changed ? 'bg-blue-50/50' : ''}`}><td className="p-3 font-mono">{skillLabel(key)}{pending && <span className="ml-2 font-sans text-xs text-amber-700">รออนุมัติ</span>}</td><td className="p-3 text-center"><LevelBadge level={current}/></td><td className="p-3"><select aria-label={`คะแนน ${key}`} disabled={pending} value={proposed[key] ?? current} onChange={e => setProposed(p => ({...p, [key]: Number(e.target.value)}))} className={`${inputClass} max-w-xs disabled:bg-slate-100`}>{LEVEL_LABELS.map((label, l) => <option key={l} value={l}>{l} — {label}</option>)}</select></td></tr>; })}</tbody></table></div>}
      <Field label="เหตุผล / ผลการประเมิน (จำเป็น)"><textarea required maxLength={2000} rows={3} className={inputClass} value={reason} onChange={e => setReason(e.target.value)} placeholder="ระบุผลการประเมินและเหตุผลที่ปรับเพิ่มหรือลดระดับ"/></Field>
      <Field label="เอกสารหรือหลักฐานอ้างอิง"><input maxLength={1000} className={inputClass} value={evidence} onChange={e => setEvidence(e.target.value)} placeholder="เลขที่เอกสาร / ลิงก์หลักฐาน / ผลการทดสอบ"/></Field>
      <div className="flex items-center justify-between"><span className="text-sm text-slate-500">ปรับ {changedCount} สกิล</span><button disabled={!changedCount || !reason.trim()} className={buttonClass}><Send size={16}/>ส่งให้ผู้จัดการอนุมัติ</button></div>
    </form>
    <div className={`${panelClass} p-5`}><h2 className="mb-4 font-bold text-slate-800">คำขอที่เสนอ</h2>{!requests.length ? <p className="text-sm text-slate-500">ยังไม่มีคำขอ</p> : <div className="space-y-3">{requests.map(a => <div key={a.id} className="rounded-lg border border-slate-200 p-4"><div className="flex justify-between gap-4"><span className="font-semibold">{eligible.find(e => e.id === a.employeeId)?.name ?? a.employeeId}</span><span className={`text-sm font-semibold ${a.status === 'pending' ? 'text-amber-700' : a.status === 'approved' ? 'text-emerald-700' : 'text-red-700'}`}>{a.status === 'pending' ? 'รออนุมัติ' : a.status === 'approved' ? 'อนุมัติแล้ว' : 'ไม่อนุมัติ'}</span></div><p className="my-2 text-sm text-slate-600">{a.changes.map(c => `${skillLabel(c.key)}: ${c.before} → ${c.after}`).join(' · ')}</p><p className="text-sm text-slate-500">{a.reason}</p><p className="mt-2 text-xs text-slate-400">{formatDate(a.submittedAt)}{a.remark && ` · ความเห็นผู้จัดการ: ${a.remark}`}</p></div>)}</div>}</div>
  </div>;
}
