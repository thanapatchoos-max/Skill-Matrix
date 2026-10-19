import { FilterBar } from '../components/FilterBar';
import { useState } from 'react';
import { Users, Plus, X } from 'lucide-react';
import { bangkokYear, employeesForYear, SKILL_DEPARTMENTS, SKILL_WIS, sumSkills, visibleEmployees } from '../data/phase1Core';
import { saveSkillEmployee, useSkillState } from '../data/phase1Store';
import { buttonClass, Field, inputClass, panelClass } from '../components/Phase1Shared';
import { Pagination } from '../components/Pagination';

const blank = {id:'',name:'',position:'',department:'QC Section',assignedSkills:[] as string[]};
export default function PhaseOneEmployees({userRole}:{userRole:string}) {
  const state=useSkillState();
  const [search,setSearch]=useState('');
  const [form,setForm]=useState<typeof blank|null>(null);
  const [editing,setEditing]=useState(false);
  const [error,setError]=useState('');
  const [currentPage,setCurrentPage]=useState(1);
  const [pageSize,setPageSize]=useState(5);

  const employees=visibleEmployees(employeesForYear(state,bangkokYear()),userRole).filter(e => `${e.id} ${e.name} ${e.department}`.toLowerCase().includes(search.toLowerCase()));

  const totalEmployees = employees.length;
  const totalPages = Math.max(1, Math.ceil(totalEmployees / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedEmployees = employees.slice(startIndex, startIndex + pageSize);

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function save(event:React.FormEvent) {
    event.preventDefault();
    try {
      if (!editing && employeesForYear(state,bangkokYear()).some(e => e.id === form!.id)) throw new Error('รหัสพนักงานนี้มีอยู่แล้ว');
      saveSkillEmployee('admin',form!); setForm(null); setError('');
    } catch(e) { setError((e as Error).message); }
  }
  return <div className="space-y-6"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800"><Users/>จัดการข้อมูลพนักงาน</h1><span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">ทั้งหมด {totalEmployees} คน</span></div>{userRole === 'admin' && <button className={buttonClass} onClick={() => {setForm({...blank});setEditing(false);setError('');}}><Plus size={16}/>เพิ่มพนักงาน</button>}</div><p className="text-sm text-slate-500">คะแนนพนักงานปรับผ่านหัวหน้างานและการอนุมัติ · พนักงานใหม่เริ่มที่ Level 0</p><FilterBar title="ค้นหาพนักงาน" onReset={()=>{setSearch('');setCurrentPage(1);}}><Field label="ค้นหาพนักงาน"><input className={inputClass} value={search} onChange={e => handleSearchChange(e.target.value)} placeholder="รหัส / ชื่อ / แผนก"/></Field></FilterBar><div className={`${panelClass} overflow-x-auto`}><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-4">รหัส</th><th className="p-4">ชื่อ</th><th className="p-4">ตำแหน่ง</th><th className="p-4">แผนก</th><th className="p-4 text-right">คะแนนรวม</th><th className="p-4"></th></tr></thead><tbody>{paginatedEmployees.length ? paginatedEmployees.map(e => <tr key={e.id} className="border-t border-slate-100"><td className="p-4 font-mono">{e.id}</td><td className="p-4 font-semibold">{e.name}</td><td className="p-4">{e.position}</td><td className="p-4">{e.department}</td><td className="p-4 text-right font-bold text-blue-800">{sumSkills(e)}</td><td className="p-4">{userRole === 'admin' && <button className="text-blue-700 hover:underline" onClick={() => {setForm({id:e.id,name:e.name,position:e.position,department:e.department,assignedSkills:[...e.assignedSkills]});setEditing(true);setError('');}}>แก้ไขข้อมูล</button>}</td></tr>) : <tr><td colSpan={6} className="p-8 text-center text-sm text-slate-500">ไม่พบข้อมูลพนักงานที่ตรงกับเงื่อนไขการค้นหา</td></tr>}</tbody></table><Pagination currentPage={safeCurrentPage} totalItems={totalEmployees} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} pageSizeOptions={[5, 10, 25, 50]} itemLabel="คน"/></div>
    {form && userRole === 'admin' && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6"><form onSubmit={save} className={`${panelClass} max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto p-6`}><div className="flex items-center justify-between"><h2 className="font-bold">{editing ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงาน'}</h2><button aria-label="ปิดหน้าข้อมูลพนักงาน" type="button" onClick={() => setForm(null)}><X size={20}/></button></div>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<div className="grid gap-4 md:grid-cols-2"><Field label="รหัสพนักงาน"><input required disabled={editing} maxLength={30} pattern="[A-Za-z0-9_-]+" className={inputClass} value={form.id} onChange={e => setForm({...form,id:e.target.value})}/></Field><Field label="ชื่อพนักงาน"><input required maxLength={150} className={inputClass} value={form.name} onChange={e => setForm({...form,name:e.target.value})}/></Field><Field label="ตำแหน่ง"><input required maxLength={150} className={inputClass} value={form.position} onChange={e => setForm({...form,position:e.target.value})}/></Field><Field label="แผนก"><select className={inputClass} value={form.department} onChange={e => setForm({...form,department:e.target.value,assignedSkills:[]})}>{SKILL_DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></Field></div><p className="text-sm font-semibold text-slate-700">งานที่มอบหมาย (On-duty)</p>{SKILL_WIS.filter(w => w.department === form.department).map(w => <div key={w.code} className="rounded-lg border border-slate-200 p-3"><div className="mb-2 text-sm font-semibold">{w.code}</div><div className="flex flex-wrap gap-4">{w.types.map(t => {const key=`${w.code}_${t.code}`;return <label key={key} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.assignedSkills.includes(key)} onChange={e => setForm({...form,assignedSkills:e.target.checked ? [...form.assignedSkills,key] : form.assignedSkills.filter(k => k !== key)})}/>{t.code} · {t.label}</label>;})}</div></div>)}<div className="flex justify-end"><button className={buttonClass}>บันทึกข้อมูลพนักงาน</button></div></form></div>}
  </div>;
}
