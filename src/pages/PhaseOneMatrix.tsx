import { FilterBar, FilterToggle } from '../components/FilterBar';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Grid, User } from 'lucide-react';
import { useSkillState } from '../data/phase1Store';
import { bangkokYear, employeesForYear, visibleEmployees, skillKeys, SKILL_WIS, LEVEL_LABELS } from '../data/phase1Core';
import { EmptyState, Field, LevelBadge, ScopeFilters, inputClass, panelClass } from '../components/Phase1Shared';
import { Pagination } from '../components/Pagination';
import { Avatar } from '../components/Avatar';

function DeltaBadge({ current, prev }: { current: number; prev: number | null | undefined }) {
  if (prev === null || prev === undefined) {
    return (
      <span className="inline-flex items-center rounded bg-slate-50 px-2 py-0.5 text-xs text-slate-400 border border-slate-200">
        ไม่มีข้อมูลเปรียบเทียบ
      </span>
    );
  }
  const delta = current - prev;
  if (delta > 0) {
    return (
      <span className="inline-flex items-center rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
        +{delta}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center rounded bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700 border border-red-200">
        {delta}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 border border-slate-200">
      0
    </span>
  );
}

function CompactDeltaBadge({ current, prev }: { current: number; prev: number | null | undefined }) {
  if (prev === null || prev === undefined) {
    return <span className="text-[10px] text-slate-400 font-mono" title="ไม่มีข้อมูลปีก่อนหน้า">N/A</span>;
  }
  const delta = current - prev;
  if (delta > 0) {
    return (
      <span
        className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200"
        title={`ปีก่อนหน้า: Level ${prev} (เพิ่มขึ้น +${delta})`}
      >
        +{delta}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span
        className="inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-700 border border-red-200"
        title={`ปีก่อนหน้า: Level ${prev} (ลดลง ${delta})`}
      >
        {delta}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 border border-slate-200"
      title={`ปีก่อนหน้า: Level ${prev} (คงเดิม)`}
    >
      0
    </span>
  );
}

// Read-only score display. Summaries and exports live in the manager's assessment pages.
export default function PhaseOneMatrix({userRole,individual=false,title}:{userRole:string;individual?:boolean;title?:string}) {
  const state=useSkillState();
  const currentYear = bangkokYear();
  const prevYear = currentYear - 1;
  const prevEmployees = employeesForYear(state, prevYear);

  const [department,setDepartment]=useState(userRole==='chief'||userRole==='staff'?'QC Section':'ALL');
  const [wi,setWi]=useState('ALL');const [type,setType]=useState('ALL');const [level,setLevel]=useState('ALL');
  const [search,setSearch]=useState('');const [selectedId,setSelectedId]=useState('EMP001');const [onDuty,setOnDuty]=useState(false);
  const [showDelta,setShowDelta]=useState(true);
  const [currentPage,setCurrentPage]=useState(1);
  const [pageSize,setPageSize]=useState(10);

  const employees=visibleEmployees(employeesForYear(state,currentYear),userRole).filter(employee=>(department==='ALL'||employee.department===department)&&`${employee.id} ${employee.name} ${employee.department} ${employee.position}`.toLowerCase().includes(search.trim().toLowerCase()));
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

  const prevSelected = selected ? prevEmployees.find(p => p.id === selected.id) : undefined;

  return <div className="space-y-5">
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">{individual?<User/>:<Grid/>}{title??(individual?'ดูคะแนนรายบุคคล':'ดูคะแนนรายแผนก')}</h1>
      <p className="mt-1 text-sm text-slate-500">ดูระดับสกิลที่ได้รับการยืนยันแล้ว · ปี {currentYear} (เปรียบเทียบผลต่างกับปี {prevYear}) · Level 0–3</p>
    </div>
    <FilterBar
      title="ตัวกรองคะแนนสกิล"
      onReset={()=>{setDepartment(userRole==='chief'||userRole==='staff'?'QC Section':'ALL');setWi('ALL');setType('ALL');setLevel('ALL');setSearch('');setSelectedId('EMP001');setOnDuty(false);setShowDelta(true);resetPage();}}
      footer={
        <div className="flex flex-wrap items-center gap-4">
          <FilterToggle checked={onDuty} onChange={checked=>{setOnDuty(checked);resetPage();}}>เฉพาะสกิลที่ได้รับมอบหมาย</FilterToggle>
          {!individual && <FilterToggle checked={showDelta} onChange={setShowDelta}>แสดงผลต่างจากปีก่อน (Delta)</FilterToggle>}
        </div>
      }
    >
      <ScopeFilters role={userRole} department={department} setDepartment={d=>{setDepartment(d);resetPage();}} wi={wi} setWi={w=>{setWi(w);resetPage();}} type={type} setType={t=>{setType(t);resetPage();}}/>
      {individual?<Field label="พนักงาน"><div className="flex items-center gap-2"><button type="button" title="พนักงานคนก่อนหน้า" disabled={userRole==='staff'||selectedIndex<=0} onClick={prevEmployee} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"><ChevronLeft size={16}/></button><div className="relative flex-1 min-w-[200px]"><div className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center z-10"><Avatar src={selected?.avatarUrl} name={selected?.name} size="xs"/></div><select className={inputClass} style={{ paddingLeft: '2.75rem' }} value={selected?.id??''} disabled={userRole==='staff'} onChange={event=>{setSelectedId(event.target.value);resetPage();}}>{employees.map(employee=><option value={employee.id} key={employee.id}>{employee.id} · {employee.name}</option>)}</select></div><button type="button" title="พนักงานคนถัดไป" disabled={userRole==='staff'||selectedIndex<0||selectedIndex>=employees.length-1} onClick={nextEmployee} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"><ChevronRight size={16}/></button></div></Field>:<Field label="ค้นหาพนักงาน"><input className={inputClass} value={search} onChange={event=>{setSearch(event.target.value);resetPage();}} placeholder="รหัสหรือชื่อพนักงาน"/></Field>}
      <Field label="ระดับสกิล"><select className={inputClass} value={level} onChange={event=>{setLevel(event.target.value);resetPage();}}><option value="ALL">ทุกระดับ</option>{[0,1,2,3].map(value=><option key={value} value={value}>Level {value}</option>)}</select></Field>
    </FilterBar>

    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
      <span className="font-semibold text-slate-600">ระดับสกิล:</span>
      {LEVEL_LABELS.map((label,value)=><span key={value} className="flex items-center gap-1.5"><LevelBadge level={value}/>{label}</span>)}
      <span className="text-slate-300">|</span>
      <span className="font-semibold text-slate-600">คำอธิบายสัญลักษณ์:</span>
      <span className="flex items-center gap-1.5"><span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">+</span> เพิ่มขึ้น</span>
      <span className="flex items-center gap-1.5"><span className="inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-red-700 border border-red-200">-</span> ลดลง</span>
      <span className="flex items-center gap-1.5"><span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 border border-slate-200">0</span> คงเดิม</span>
      <span className="flex items-center gap-1.5"><span className="inline-flex items-center rounded bg-slate-50 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-200">N/A</span> ไม่มีข้อมูลปีก่อน</span>
    </div>

    {individual && selected && (() => {
      const allEmpKeys = skillKeys(selected, wi, type, onDuty);
      const curTotal = allEmpKeys.reduce((sum, k) => sum + (selected.scores[k] ?? 0), 0);
      const prevEmp = prevEmployees.find(p => p.id === selected.id);
      const hasPrevHistory = prevEmp && prevEmp.scores;
      const prevTotal = hasPrevHistory ? allEmpKeys.reduce((sum, k) => sum + (prevEmp.scores[k] ?? 0), 0) : null;
      const totalDelta = prevTotal !== null ? curTotal - prevTotal : null;

      return (
        <div className={`${panelClass} flex flex-wrap items-center justify-between gap-4 p-5`}>
          <div className="flex items-center gap-4">
            <Avatar src={selected.avatarUrl} name={selected.name} size="lg" className="ring-2 ring-white shadow-xs"/>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{selected.name}</h2>
              <p className="mt-0.5 text-sm text-slate-500">{selected.id} · {selected.department} · {selected.position}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-600">
              คะแนนปี {prevYear}: <strong className="text-slate-800 font-bold">{prevTotal !== null ? `${prevTotal}` : 'N/A'}</strong>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs text-blue-800">
              คะแนนปี {currentYear}: <strong className="text-blue-900 font-bold">{curTotal}</strong>
            </div>
            {totalDelta !== null ? (
              <div className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                totalDelta > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                totalDelta < 0 ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                ผลต่างเทียบปี {prevYear}: {totalDelta > 0 ? `+${totalDelta}` : totalDelta}
              </div>
            ) : (
              <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-400">
                ผลต่างเทียบปี {prevYear}: ไม่มีข้อมูลเปรียบเทียบ
              </div>
            )}
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">คะแนนที่ยืนยันแล้ว</span>
          </div>
        </div>
      );
    })()}

    {!people.length||!keys.length||individual&&!rows.length?<EmptyState>ไม่พบคะแนนตามตัวกรองที่เลือก</EmptyState>:individual&&selected?<div className={`${panelClass} overflow-x-auto`}><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">W/I</th><th className="p-4">ชื่องาน</th><th className="p-4">ประเภทสกิล</th><th className="p-4 text-center">คะแนนปีก่อน ({prevYear})</th><th className="p-4 text-center">คะแนนปัจจุบัน ({currentYear})</th><th className="p-4 text-center">ผลต่าง (Delta)</th></tr></thead><tbody>{paginatedRows.map(key=>{const item=SKILL_WIS.find(w=>key.startsWith(w.code+'_'))!;const typeCode=key.slice(key.lastIndexOf('_')+1);const currentScore=selected.scores[key]??0;const prevScore=(prevSelected&&prevSelected.scores&&typeof prevSelected.scores[key]==='number')?prevSelected.scores[key]:null;return <tr key={key} data-skill-key={key} className="border-t border-slate-100"><td className="p-4 font-mono font-medium">{item.code}</td><td className="p-4">{item.name}</td><td className="p-4">{typeCode} · {item.types.find(t=>t.code===typeCode)?.label}</td><td className="p-4 text-center">{prevScore!==null?<LevelBadge level={prevScore}/>:<span className="font-mono text-xs text-slate-400">N/A</span>}</td><td className="p-4 text-center"><LevelBadge level={currentScore}/></td><td className="p-4 text-center"><DeltaBadge current={currentScore} prev={prevScore}/></td></tr>;})}</tbody></table><Pagination currentPage={safeCurrentPage} totalItems={rows.length} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} pageSizeOptions={[5, 10, 25, 50]} itemLabel="สกิล"/></div>:<div className={`${panelClass} overflow-x-auto`}><table className="w-full whitespace-nowrap text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4 text-left">พนักงาน</th>{keys.map(key=><th key={key} className="px-3 py-4 text-center text-xs">{key.slice(0,key.lastIndexOf('_'))}<br/>Type {key.slice(key.lastIndexOf('_')+1)}</th>)}</tr></thead><tbody>{paginatedPeople.map(employee=>{const prevEmp=prevEmployees.find(p=>p.id===employee.id);return <tr key={employee.id} className="border-t border-slate-100"><td className="p-4"><div className="flex items-center gap-3"><Avatar src={employee.avatarUrl} name={employee.name} size="sm"/><div><div className="font-semibold text-slate-800">{employee.name}</div><span className="text-xs text-slate-500">{employee.id} · {employee.department}</span></div></div></td>{keys.map(key=>{const hasSkill=skillKeys(employee,wi,type,onDuty).includes(key);if(!hasSkill)return <td key={key} className="px-3 py-3 text-center text-slate-300">—</td>;const currentScore=employee.scores[key]??0;const prevScore=(prevEmp&&prevEmp.scores&&typeof prevEmp.scores[key]==='number')?prevEmp.scores[key]:null;return <td key={key} className="px-3 py-3 text-center"><div className="inline-flex items-center justify-center gap-1.5"><LevelBadge level={currentScore}/>{showDelta&&<CompactDeltaBadge current={currentScore} prev={prevScore}/>}</div></td>;})}</tr>;})}</tbody></table><Pagination currentPage={safeCurrentPage} totalItems={totalPeople} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} pageSizeOptions={[5, 10, 25, 50]} itemLabel="คน"/></div>}
  </div>;
}
