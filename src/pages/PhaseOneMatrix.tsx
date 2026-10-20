import { FilterBar, FilterToggle } from '../components/FilterBar';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Grid, User, Users, CheckCircle2, X, Filter, Table, LayoutGrid, ArrowDownWideNarrow } from 'lucide-react';
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
  const [viewMode,setViewMode]=useState<'matrix'|'cards'>('matrix');
  const [cardSort,setCardSort]=useState<'score-desc'|'score-asc'>('score-desc');
  const [currentPage,setCurrentPage]=useState(1);
  const [pageSize,setPageSize]=useState(10);
  const [cardPageSize,setCardPageSize]=useState(8);

  const matchesLevel = (score: number) => level === 'ALL' || score === Number(level);

  const employees=visibleEmployees(employeesForYear(state,currentYear),userRole).filter(employee=>(department==='ALL'||employee.department===department)&&`${employee.id} ${employee.name} ${employee.department} ${employee.position}`.toLowerCase().includes(search.trim().toLowerCase()));
  const selected=employees.find(employee=>employee.id===selectedId)??employees[0];
  const displayed=(individual?(selected?[selected]:[]):employees).filter(employee=>skillKeys(employee,wi,type,onDuty).length>0);
  const keys=[...new Set(displayed.flatMap(employee=>skillKeys(employee,wi,type,onDuty)))];
  const people=displayed.filter(employee=>level==='ALL'||skillKeys(employee,wi,type,onDuty).some(key=>matchesLevel(employee.scores[key]??0)));
  const rows=selected?skillKeys(selected,wi,type,onDuty).filter(key=>matchesLevel(selected.scores[key]??0)):[];

  const getEmpScopeScore = (emp: typeof employees[0]) => {
    const matching = skillKeys(emp, wi, type, onDuty).filter(k => matchesLevel(emp.scores[k] ?? 0));
    return matching.reduce((sum, k) => sum + (emp.scores[k] ?? 0), 0);
  };

  const sortedPeople = [...people].sort((a, b) => {
    if (!individual && viewMode === 'cards') {
      if (cardSort === 'score-desc') {
        const diff = getEmpScopeScore(b) - getEmpScopeScore(a);
        if (diff !== 0) return diff;
      } else if (cardSort === 'score-asc') {
        const diff = getEmpScopeScore(a) - getEmpScopeScore(b);
        if (diff !== 0) return diff;
      }
    }
    return a.id.localeCompare(b.id);
  });

  const totalPeople = people.length;
  const totalRows = rows.length;
  const totalItems = individual ? totalRows : totalPeople;
  const effectivePageSize = individual ? pageSize : (viewMode === 'cards' ? cardPageSize : pageSize);
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * effectivePageSize;
  const paginatedPeople = individual ? people : sortedPeople.slice(startIndex, startIndex + effectivePageSize);
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

  const activeFilters = [
    department !== 'ALL' && {
      key: 'department',
      label: `แผนก: ${department}`,
      onRemove: () => { setDepartment(userRole === 'chief' || userRole === 'staff' ? 'QC Section' : 'ALL'); resetPage(); },
    },
    wi !== 'ALL' && {
      key: 'wi',
      label: `W/I: ${wi}${SKILL_WIS.find(w => w.code === wi) ? ` (${SKILL_WIS.find(w => w.code === wi)?.name})` : ''}`,
      onRemove: () => { setWi('ALL'); resetPage(); },
    },
    type !== 'ALL' && {
      key: 'type',
      label: `ประเภท: Type ${type}`,
      onRemove: () => { setType('ALL'); resetPage(); },
    },
    level !== 'ALL' && {
      key: 'level',
      label: `ระดับ: Level ${level}`,
      onRemove: () => { setLevel('ALL'); resetPage(); },
    },
    onDuty && {
      key: 'onDuty',
      label: 'เฉพาะสกิลที่ได้รับมอบหมาย',
      onRemove: () => { setOnDuty(false); resetPage(); },
    },
    search.trim() !== '' && {
      key: 'search',
      label: `ค้นหา: "${search}"`,
      onRemove: () => { setSearch(''); resetPage(); },
    },
  ].filter(Boolean) as Array<{ key: string; label: string; onRemove: () => void }>;

  return <div className="space-y-5">
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">{individual?<User/>:<Grid/>}{title??(individual?'ดูคะแนนรายบุคคล':'ดูคะแนนรายแผนก')}</h1>
      <p className="mt-1 text-sm text-slate-500">ดูระดับสกิลที่ได้รับการยืนยันแล้ว · ปี {currentYear} (เปรียบเทียบผลต่างกับปี {prevYear}) · Level 0–3</p>
    </div>
    <FilterBar
      title="ตัวกรองคะแนนสกิล"
      onReset={()=>{setDepartment(userRole==='chief'||userRole==='staff'?'QC Section':'ALL');setWi('ALL');setType('ALL');setLevel('ALL');setSearch('');setSelectedId('EMP001');setOnDuty(false);setShowDelta(true);setCardSort('score-desc');resetPage();}}
      footer={
        <div className="flex flex-wrap items-center gap-4">
          <FilterToggle checked={onDuty} onChange={checked=>{setOnDuty(checked);resetPage();}}>เฉพาะสกิลที่ได้รับมอบหมาย</FilterToggle>
          {!individual && <FilterToggle checked={showDelta} onChange={setShowDelta}>แสดงผลต่างจากปีก่อน (Delta)</FilterToggle>}
        </div>
      }
    >
      <ScopeFilters role={userRole} department={department} setDepartment={d=>{setDepartment(d);resetPage();}} wi={wi} setWi={w=>{setWi(w);resetPage();}} type={type} setType={t=>{setType(t);resetPage();}}/>
      {individual?<Field label="พนักงาน"><div className="flex items-center gap-2"><button type="button" title="พนักงานคนก่อนหน้า" disabled={userRole==='staff'||selectedIndex<=0} onClick={prevEmployee} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"><ChevronLeft size={16}/></button><div className="relative flex-1 min-w-[200px]"><div className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center z-10"><Avatar src={selected?.avatarUrl} name={selected?.name} size="xs"/></div><select className={inputClass} style={{ paddingLeft: '2.75rem' }} value={selected?.id??''} disabled={userRole==='staff'} onChange={event=>{setSelectedId(event.target.value);resetPage();}}>{employees.map(employee=><option value={employee.id} key={employee.id}>{employee.id} · {employee.name}</option>)}</select></div><button type="button" title="พนักงานคนถัดไป" disabled={userRole==='staff'||selectedIndex<0||selectedIndex>=employees.length-1} onClick={nextEmployee} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"><ChevronRight size={16}/></button></div></Field>:<Field label="ค้นหาพนักงาน"><input className={inputClass} value={search} onChange={event=>{setSearch(event.target.value);resetPage();}} placeholder="รหัสหรือชื่อพนักงาน"/></Field>}
      <Field label="ระดับสกิล">
        <select className={inputClass} value={level} onChange={event=>{setLevel(event.target.value);resetPage();}}>
          <option value="ALL">ทุกระดับ</option>
          {[0,1,2,3].map(value=><option key={value} value={value}>Level {value}</option>)}
        </select>
      </Field>
    </FilterBar>

    {/* Active Filter Badges */}
    {activeFilters.length > 0 && (
      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-3.5 border border-slate-200">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mr-1">
          <Filter size={13} className="text-blue-700" /> เงื่อนไขที่กำลังกรอง:
        </span>
        {activeFilters.map(filter => (
          <span
            key={filter.key}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-2.5 py-1 text-xs font-medium text-blue-800 border border-blue-200 shadow-2xs"
          >
            <span>{filter.label}</span>
            <button
              type="button"
              onClick={filter.onRemove}
              className="rounded-full p-0.5 text-blue-600 hover:bg-blue-200 hover:text-blue-900 transition"
              title="ลบเงื่อนไขนี้"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={() => {
            setDepartment(userRole === 'chief' || userRole === 'staff' ? 'QC Section' : 'ALL');
            setWi('ALL');
            setType('ALL');
            setLevel('ALL');
            setSearch('');
            setOnDuty(false);
            setCardSort('score-desc');
            resetPage();
          }}
          className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline ml-2"
        >
          ล้างทั้งหมด
        </button>
        <span className="ml-auto text-xs text-slate-500 font-medium">
          พบพนักงานที่ผ่านเกณฑ์ <strong className="text-blue-700 font-bold">{totalPeople}</strong> คน
        </span>
      </div>
    )}

    {/* View Mode Switcher & Sort (เมื่อดูรายแผนก) */}
    {!individual && (
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">รูปแบบการแสดงผล:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => { setViewMode('matrix'); resetPage(); }}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'matrix' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Grid size={14} /> มุมมองตารางเมทริกซ์
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('cards'); resetPage(); }}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'cards' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users size={14} /> การ์ดคัดเลือกคนไปไซต์
              </button>
            </div>
          </div>

          {/* Dropdown แสดงเฉพาะในมุมมองการ์ดคัดเลือกคนไปไซต์ */}
          {viewMode === 'cards' && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">เรียงคะแนน:</span>
              <select
                value={cardSort}
                onChange={e => {
                  setCardSort(e.target.value as 'score-desc' | 'score-asc');
                  resetPage();
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-blue-400 focus:border-blue-500 focus:outline-hidden"
              >
                <option value="score-desc">มากไปน้อย</option>
                <option value="score-asc">น้อยไปมาก</option>
              </select>
            </div>
          )}
        </div>

        <span className="text-xs text-slate-500">
          {viewMode === 'cards' ? (
            <span className="inline-flex items-center gap-1 text-blue-700 font-medium">
              <CheckCircle2 size={13} /> พบ {totalPeople} คน
              {cardSort === 'score-desc' ? ' · มากไปน้อย' : ' · น้อยไปมาก'}
            </span>
          ) : (
            'แสดงตารางระดับทักษะพนักงานเปรียบเทียบทุก W/I'
          )}
        </span>
      </div>
    )}

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

    {!people.length||!keys.length||individual&&!rows.length?<EmptyState>ไม่พบคะแนนตามตัวกรองที่เลือก</EmptyState>:individual&&selected?<div className={`${panelClass} overflow-x-auto`}><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">W/I</th><th className="p-4">ชื่องาน</th><th className="p-4">ประเภทสกิล</th><th className="p-4 text-center">คะแนนปีก่อน ({prevYear})</th><th className="p-4 text-center">คะแนนปัจจุบัน ({currentYear})</th><th className="p-4 text-center">ผลต่าง (Delta)</th></tr></thead><tbody>{paginatedRows.map(key=>{const item=SKILL_WIS.find(w=>key.startsWith(w.code+'_'))!;const typeCode=key.slice(key.lastIndexOf('_')+1);const currentScore=selected.scores[key]??0;const prevScore=(prevSelected&&prevSelected.scores&&typeof prevSelected.scores[key]==='number')?prevSelected.scores[key]:null;return <tr key={key} data-skill-key={key} className="border-t border-slate-100"><td className="p-4 font-mono font-medium">{item.code}</td><td className="p-4">{item.name}</td><td className="p-4">{typeCode} · {item.types.find(t=>t.code===typeCode)?.label}</td><td className="p-4 text-center">{prevScore!==null?<LevelBadge level={prevScore}/>:<span className="font-mono text-xs text-slate-400">N/A</span>}</td><td className="p-4 text-center"><LevelBadge level={currentScore}/></td><td className="p-4 text-center"><DeltaBadge current={currentScore} prev={prevScore}/></td></tr>;})}</tbody></table><Pagination currentPage={safeCurrentPage} totalItems={rows.length} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} pageSizeOptions={[5, 10, 25, 50]} itemLabel="สกิล"/></div>:viewMode==='cards'?(
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedPeople.map(employee => {
            const prevEmp = prevEmployees.find(p => p.id === employee.id);
            const empMatchingKeys = skillKeys(employee, wi, type, onDuty).filter(key => matchesLevel(employee.scores[key] ?? 0));
            const highestScore = empMatchingKeys.length ? Math.max(...empMatchingKeys.map(k => employee.scores[k] ?? 0)) : 0;
            const isReadyForSite = highestScore >= 2;

            return (
              <div
                key={employee.id}
                className={`${panelClass} flex flex-col justify-between p-5 transition hover:border-blue-300 hover:shadow-md border-slate-200`}
              >
                <div>
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={employee.avatarUrl}
                      name={employee.name}
                      size="md"
                      className="ring-2 ring-slate-100 shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-xs font-bold text-blue-700">{employee.id}</span>
                        {isReadyForSite ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 shrink-0">
                            <CheckCircle2 size={11} /> พร้อมไปไซต์
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200 shrink-0">
                            ต้องมีผู้ดูแล
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm truncate mt-0.5" title={employee.name}>
                        {employee.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{employee.position}</p>
                      <span className="inline-block mt-1 text-[11px] font-medium text-slate-600 bg-slate-100 rounded px-1.5 py-0.5">
                        {employee.department}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-600">ทักษะที่ใช้คัดเลือก:</span>
                      <span className="text-[11px] text-slate-500 font-mono">{empMatchingKeys.length} รายการ</span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {empMatchingKeys.slice(0, 4).map(key => {
                        const item = SKILL_WIS.find(w => key.startsWith(w.code + '_'));
                        const typeCode = key.slice(key.lastIndexOf('_') + 1);
                        const currentScore = employee.scores[key] ?? 0;
                        const prevScore = (prevEmp && prevEmp.scores && typeof prevEmp.scores[key] === 'number') ? prevEmp.scores[key] : null;

                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 p-2 text-xs border border-slate-100"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-mono font-semibold text-slate-800 truncate text-[11px]">
                                {item?.code ?? key} <span className="font-sans text-blue-700">· Type {typeCode}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">{item?.name}</div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <LevelBadge level={currentScore} />
                              {showDelta && <CompactDeltaBadge current={currentScore} prev={prevScore} />}
                            </div>
                          </div>
                        );
                      })}
                      {empMatchingKeys.length > 4 && (
                        <p className="text-center text-[11px] text-slate-400 pt-1">
                          + อีก {empMatchingKeys.length - 4} ทักษะ
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>คะแนนรวมในเกณฑ์:</span>
                  <span className="font-bold text-slate-800">
                    {empMatchingKeys.reduce((acc, k) => acc + (employee.scores[k] ?? 0), 0)} คะแนน
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <Pagination
          currentPage={safeCurrentPage}
          totalItems={totalPeople}
          pageSize={cardPageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={s => { setCardPageSize(s); resetPage(); }}
          pageSizeOptions={[8, 16, 24, 48]}
          itemLabel="คน"
        />
      </div>
    ):<div className={`${panelClass} overflow-x-auto`}><table className="w-full whitespace-nowrap text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4 text-left">พนักงาน</th>{keys.map(key=><th key={key} className="px-3 py-4 text-center text-xs">{key.slice(0,key.lastIndexOf('_'))}<br/>Type {key.slice(key.lastIndexOf('_')+1)}</th>)}</tr></thead><tbody>{paginatedPeople.map(employee=>{const prevEmp=prevEmployees.find(p=>p.id===employee.id);return <tr key={employee.id} className="border-t border-slate-100"><td className="p-4"><div className="flex items-center gap-3"><Avatar src={employee.avatarUrl} name={employee.name} size="sm"/><div><div className="font-semibold text-slate-800">{employee.name}</div><span className="text-xs text-slate-500">{employee.id} · {employee.department}</span></div></div></td>{keys.map(key=>{const hasSkill=skillKeys(employee,wi,type,onDuty).includes(key);if(!hasSkill)return <td key={key} className="px-3 py-3 text-center text-slate-300">—</td>;const currentScore=employee.scores[key]??0;const prevScore=(prevEmp&&prevEmp.scores&&typeof prevEmp.scores[key]==='number')?prevEmp.scores[key]:null;return <td key={key} className="px-3 py-3 text-center"><div className="inline-flex items-center justify-center gap-1.5"><LevelBadge level={currentScore}/>{showDelta&&<CompactDeltaBadge current={currentScore} prev={prevScore}/>}</div></td>;})}</tr>;})}</tbody></table><Pagination currentPage={safeCurrentPage} totalItems={totalPeople} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} pageSizeOptions={[5, 10, 25, 50]} itemLabel="คน"/></div>}
  </div>;
}
