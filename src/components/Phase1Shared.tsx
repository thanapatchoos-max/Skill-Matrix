import { Children, cloneElement, isValidElement, useId } from 'react';
import type { ReactNode, ReactElement } from 'react';
import { Download, Printer } from 'lucide-react';
import { ACTORS, LEVEL_LABELS, SKILL_DEPARTMENTS, SKILL_WIS } from '../data/phase1Core';

export const inputClass = 'w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500';
export const panelClass = 'rounded-xl border border-blue-100 bg-white shadow-sm';
export const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40';
export function Field({ label, children }: { label: string; children: ReactNode }) {
  const id=useId();
  const control = isValidElement(children) ? children as ReactElement<{ id?: string; value?: string | number; children?: ReactNode; title?: string }> : null;
  const selected = control?.type === 'select' ? Children.toArray(control.props.children).find(option => {
    if (!isValidElement(option)) return false;
    const props = option.props as { value?: string | number; children?: ReactNode };
    return String(props.value ?? props.children) === String(control.props.value);
  }) : null;
  const selectedText = isValidElement(selected) ? Children.toArray((selected.props as { children?: ReactNode }).children).join('') : '';
  const showSelected = selectedText.length > 42;
  return <div className="filter-field min-w-0 space-y-1.5 text-sm font-medium text-slate-600"><label className="block leading-6" htmlFor={id}>{label}</label>{control ? cloneElement(control, { id, ...(selectedText ? { title: selectedText } : {}) }) : children}{showSelected && <p className="field-selected-value">{selectedText}</p>}</div>;
}
export function Metric({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return <div className={`${panelClass} p-5`}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>{note && <p className="mt-1 text-xs text-slate-500">{note}</p>}</div>;
}
export function LevelBadge({ level }: { level: number }) {
  const colors = ['bg-slate-100 text-slate-500', 'bg-amber-50 text-amber-700', 'bg-blue-50 text-blue-700', 'bg-emerald-50 text-emerald-700'];
  return <span title={LEVEL_LABELS[level]} className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg font-bold ${colors[level]}`}>{level}</span>;
}
export function EmptyState({ children }: { children: ReactNode }) {
  return <div className={`${panelClass} p-10 text-center text-sm text-slate-500`}>{children}</div>;
}
export function ExportButtons({ onCsv, disabled = false }: { onCsv: () => void; disabled?: boolean }) {
  return <div className="flex gap-2 print:hidden"><button disabled={disabled} onClick={onCsv} className={buttonClass}><Download size={16}/> ส่งออก CSV</button><button disabled={disabled} onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm disabled:opacity-40"><Printer size={16}/> พิมพ์ / PDF</button></div>;
}
export function FormulaNote() {
  return <div className="rounded-lg border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs leading-6 text-blue-800">วิธีรวมคะแนน: คะแนนรายบุคคล = ผลรวมระดับสกิลทุก W/I–Type · คะแนนแผนก = ผลรวมคะแนนของพนักงาน · ค่าเฉลี่ยต่อคน = คะแนนแผนก ÷ จำนวนพนักงาน (หน่วยคะแนน/คน) · คะแนนเต็ม = จำนวนสกิลที่เลือก × 3</div>;
}
export function ScopeFilters({ role, department, setDepartment, wi, setWi, type, setType }: {
  role: string; department: string; setDepartment: (value: string) => void;
  wi: string; setWi: (value: string) => void; type: string; setType: (value: string) => void;
}) {
  const restricted = role === 'chief' || role === 'staff';
  const departments = restricted ? [ACTORS[role].department] : SKILL_DEPARTMENTS;
  const wis = SKILL_WIS.filter(w => departments.includes(w.department) && (department === 'ALL' || w.department === department));
  const types = [...new Set(wis.filter(w => wi === 'ALL' || w.code === wi).flatMap(w => w.types.map(t => t.code)))];
  return <>
    <Field label="แผนก"><select className={inputClass} value={department} disabled={restricted} onChange={e => { setDepartment(e.target.value); setWi('ALL'); setType('ALL'); }}>{!restricted&&<option value="ALL">ทุกแผนก</option>}{departments.map(d => <option key={d}>{d}</option>)}</select></Field>
    <Field label="Work Instruction"><select className={inputClass} value={wi} onChange={e => { setWi(e.target.value); setType('ALL'); }}><option value="ALL">ทุก W/I</option>{wis.map(w => <option key={w.code} value={w.code}>{w.code} · {w.name}</option>)}</select></Field>
    <Field label="ประเภทสกิล"><select className={inputClass} value={type} onChange={e => setType(e.target.value)}><option value="ALL">ทุกประเภท</option>{types.map(t => <option key={t}>{t}</option>)}</select></Field>
  </>;
}
