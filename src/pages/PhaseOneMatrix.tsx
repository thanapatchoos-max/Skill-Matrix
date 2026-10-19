import { FilterBar, FilterToggle } from '../components/FilterBar';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Grid, User } from 'lucide-react';
import { useSkillState } from '../data/phase1Store';
import { bangkokYear, employeesForYear, visibleEmployees, skillKeys, SKILL_WIS, LEVEL_LABELS } from '../data/phase1Core';
import { EmptyState, Field, LevelBadge, ScopeFilters, inputClass, panelClass } from '../components/Phase1Shared';
import { Pagination } from '../components/Pagination';

// Read-only score display. Summaries and exports live in the manager's assessment pages.
export default function PhaseOneMatrix({userRole,individual=false,title}:{userRole:string;individual?:boolean;title?:string}) {
  const state=useSkillState();
  const [department,setDepartment]=useState(userRole==='chief'||userRole==='staff'?'QC Section':'ALL');
  const [wi,setWi]=useState('ALL');const [type,setType]=useState('ALL');const [level,setLevel]=useState('ALL');
  const [search,setSearch]=useState('');const [selectedId,setSelectedId]=useState('EMP001');const [onDuty,setOnDuty]=useState(false);
  const [currentPage,setCurrentPage]=useState(1);
  const [pageSize,setPageSize]=useState(5);

  const employees=visibleEmployees(employeesForYear(state,bangkokYear()),userRole).filter(employee=>(department==='ALL'||employee.department===department)&&`${employee.id} ${employee.name}`.toLowerCase().includes(search.toLowerCase()));
  const selected=employees.find(employee=>employee.id===selectedId)??employees[0];
  const displayed=(individual?(selected?[selected]:[]):employees).filter(employee=>skillKeys(employee,wi,type,onDuty).length>0);
  const keys=[...new Set(displayed.flatMap(employee=>skillKeys(employee,wi,type,onDuty)))];
  const people=displayed.filter(employee=>level==='ALL'||skillKeys(employee,wi,type,onDuty).some(key=>(employee.scores[key]??0)===Number(level)));
  const rows=selected?skillKeys(selected,wi,type,onDuty).filter(key=>level==='ALL'||(selected.scores[key]??0)===Number(level)):[];

  const totalPeople = people.length;
  const totalRows = rows.length;
  const totalItems = individual ? totalRows : totalPeople;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedPeople = individual ? people : people.slice(startIndex, startIndex + pageSize);
  const paginatedRows = individual ? rows.slice(startIndex, startIndex + pageSize) : rows;

  function resetPage() { setCurrentPage(1); }

  const selectedIndex = employees.findIndex(p => p.id === (selected?.id ?? ''));
  function prevEmployee() {
    if (selectedIndex > 0) {
      setSelectedId(employees[selectedIndex - 1].id);
      resetPage();
    }
  }
  function nextEmployee() {
    if (selectedIndex >= 0 && selectedIndex < employees.length - 1) {
      setSelectedId(employees[selectedIndex + 1].id);
      resetPage();
    }
  }

  return <div className="space-y-5"><div><h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">{individual?<User/>:<Grid/>}{title??(individual?'ดูคะแนนรายบุคคล':'ดูคะแนนรายแผนก')}</h1><p className="mt-1 text-sm text-slate-500">ดูระดับสกิลที่ได้รับการยืนยันแล้ว · ปี {bangkokYear()} · Level 0–3</p></div>
    <FilterBar title="ตัวกรองคะแนนสกิล" onReset={()=>{setDepartment(userRole==='chief'||userRole==='staff'?'QC Section':'ALL');setWi('ALL');setType('ALL');setLevel('ALL');setSearch('');setSelectedId('EMP001');setOnDuty(false);resetPage();}} footer={<FilterToggle checked={onDuty} onChange={checked=>{setOnDuty(checked);resetPage();}}>เฉพาะสกิลที่ได้รับมอบหมาย</FilterToggle>}><ScopeFilters role={userRole} department={department} setDepartment={d=>{setDepartment(d);resetPage();}} wi={wi} setWi={w=>{setWi(w);resetPage();}} type={type} setType={t=>{setType(t);resetPage();}}/>{individual?<Field label="พนักงาน"><div className="flex items-center gap-2"><button type="button" title="พนักงานคนก่อนหน้า" disabled={userRole==='staff'||selectedIndex<=0} onClick={prevEmployee} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"><ChevronLeft size={16}/></button><select className={inputClass} value={selected?.id??''} disabled={userRole==='staff'} onChange={event=>{setSelectedId(event.target.value);resetPage();}}>{employees.map(employee=><option value={employee.id} key={employee.id}>{employee.id} · {employee.name}</option>)}</select><button type="button" title="พนักงานคนถัดไป" disabled={userRole==='staff'||selectedIndex<0||selectedIndex>=employees.length-1} onClick={nextEmployee} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"><ChevronRight size={16}/></button></div></Field>:<Field label="ค้นหาพนักงาน"><input className={inputClass} value={search} onChange={event=>{setSearch(event.target.value);resetPage();}} placeholder="รหัสหรือชื่อพนักงาน"/></Field>}<Field label="ระดับสกิล"><select className={inputClass} value={level} onChange={event=>{setLevel(event.target.value);resetPage();}}><option value="ALL">ทุกระดับ</option>{[0,1,2,3].map(value=><option key={value} value={value}>Level {value}</option>)}</select></Field></FilterBar>
    <div className="flex flex-wrap gap-4 text-xs text-slate-500">{LEVEL_LABELS.map((label,value)=><span key={value} className="flex items-center gap-2"><LevelBadge level={value}/>{label}</span>)}</div>
    {individual&&selected&&<div className={`${panelClass} flex flex-wrap items-center justify-between gap-3 p-5`}><div><h2 className="font-bold text-slate-800">{selected.name}</h2><p className="mt-1 text-sm text-slate-500">{selected.id} · {selected.department} · {selected.position}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">คะแนนที่ยืนยันแล้ว</span></div>}
    {!people.length||!keys.length||individual&&!rows.length?<EmptyState>ไม่พบคะแนนตามตัวกรองที่เลือก</EmptyState>:individual&&selected?<div className={`${panelClass} overflow-x-auto`}><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">W/I</th><th className="p-4">ชื่องาน</th><th className="p-4">ประเภทสกิล</th><th className="p-4 text-center">คะแนนปัจจุบัน</th></tr></thead><tbody>{paginatedRows.map(key=>{const item=SKILL_WIS.find(w=>key.startsWith(w.code+'_'))!;const typeCode=key.slice(key.lastIndexOf('_')+1);return <tr key={key} data-skill-key={key} className="border-t border-slate-100"><td className="p-4 font-mono">{item.code}</td><td className="p-4">{item.name}</td><td className="p-4">{typeCode} · {item.types.find(t=>t.code===typeCode)?.label}</td><td className="p-4 text-center"><LevelBadge level={selected.scores[key]??0}/></td></tr>;})}</tbody></table><Pagination currentPage={safeCurrentPage} totalItems={rows.length} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} pageSizeOptions={[5, 10, 25, 50]} itemLabel="สกิล"/></div>:<div className={`${panelClass} overflow-x-auto`}><table className="w-full whitespace-nowrap text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4 text-left">พนักงาน</th>{keys.map(key=><th key={key} className="px-3 py-4 text-center text-xs">{key.slice(0,key.lastIndexOf('_'))}<br/>Type {key.slice(key.lastIndexOf('_')+1)}</th>)}</tr></thead><tbody>{paginatedPeople.map(employee=><tr key={employee.id} className="border-t border-slate-100"><td className="p-4"><div className="font-semibold">{employee.name}</div><span className="text-xs text-slate-500">{employee.id} · {employee.department}</span></td>{keys.map(key=><td key={key} className="px-3 py-3 text-center">{skillKeys(employee,wi,type,onDuty).includes(key)?<LevelBadge level={employee.scores[key]??0}/>:<span className="text-slate-300">—</span>}</td>)}</tr>)}</tbody></table><Pagination currentPage={safeCurrentPage} totalItems={totalPeople} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} pageSizeOptions={[5, 10, 25, 50]} itemLabel="คน"/></div>}
  </div>;
}
