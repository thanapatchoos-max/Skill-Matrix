import { useState } from 'react';
import { GitCompare, Users, Building2, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  bangkokYear, employeesForYear, visibleEmployees, skillKeys, sumSkills, 
  sectionSummary, SKILL_DEPARTMENTS, SKILL_WIS, LEVEL_LABELS 
} from '../data/phase1Core';
import { useSkillState } from '../data/phase1Store';
import { Field, inputClass, LevelBadge, Metric, panelClass } from '../components/Phase1Shared';
import { FilterBar } from '../components/FilterBar';
import { Avatar } from '../components/Avatar';

function renderDelta(delta: number | null) {
  if (delta === null) return <span className="font-mono text-xs text-slate-400">N/A</span>;
  if (delta > 0) {
    return <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">+{delta}</span>;
  }
  if (delta < 0) {
    return <span className="inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 text-xs font-bold text-red-700 border border-red-200">{delta}</span>;
  }
  return <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-500 border border-slate-200">0</span>;
}

function renderDiffAB(diff: number | null, nameA: string, nameB: string) {
  if (diff === null) return <span className="text-slate-400">—</span>;
  if (diff > 0) return <span className="text-blue-700 font-bold">A สูงกว่า (+{diff})</span>;
  if (diff < 0) return <span className="text-emerald-700 font-bold">B สูงกว่า (+{Math.abs(diff)})</span>;
  return <span className="text-slate-500 font-medium">เท่ากัน (0)</span>;
}

export default function CompareView({ userRole, title = 'เปรียบเทียบทักษะ' }: { userRole: string; title?: string }) {
  const state = useSkillState();
  const currentYear = bangkokYear();
  const minSnapshotYear = Math.min(...state.snapshots.map(s => s.year), currentYear - 3);
  const availableYears = Array.from({ length: currentYear - minSnapshotYear + 1 }, (_, i) => minSnapshotYear + i);

  const [compareMode, setCompareMode] = useState<'employee' | 'department'>('employee');
  const [startYear, setStartYear] = useState(currentYear - 2 >= minSnapshotYear ? currentYear - 2 : minSnapshotYear);
  const [endYear, setEndYear] = useState(currentYear);

  // Filters
  const [department, setDepartment] = useState(userRole === 'chief' || userRole === 'staff' ? 'QC Section' : 'ALL');
  const [empAId, setEmpAId] = useState('EMP001');
  const [empBId, setEmpBId] = useState('EMP002');
  const [deptA, setDeptA] = useState('QC Section');
  const [deptB, setDeptB] = useState('Production');
  const [wi, setWi] = useState('ALL');
  const [type, setType] = useState('ALL');

  const targetDept = compareMode === 'employee' ? department : 'ALL';
  const availableWis = SKILL_WIS.filter(w => targetDept === 'ALL' || w.department === targetDept);
  const availableTypes = [...new Set(availableWis.filter(w => wi === 'ALL' || w.code === wi).flatMap(w => w.types.map(t => t.code)))];

  const fromYear = Math.min(startYear, endYear);
  const toYear = Math.max(startYear, endYear);
  const yearsRange = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i);

  // Employee pool for selection
  const employeePool = visibleEmployees(employeesForYear(state, currentYear), userRole).filter(
    e => department === 'ALL' || e.department === department
  );

  // Fallbacks if IDs not in pool
  const effectiveEmpAId = employeePool.some(e => e.id === empAId) ? empAId : (employeePool[0]?.id ?? '');
  const effectiveEmpBId = employeePool.some(e => e.id === empBId) 
    ? empBId 
    : (employeePool.find(e => e.id !== effectiveEmpAId)?.id ?? employeePool[0]?.id ?? '');

  // Retrieve employees at fromYear and toYear
  const employeesFrom = employeesForYear(state, fromYear);
  const employeesTo = employeesForYear(state, toYear);

  const empAStart = employeesFrom.find(e => e.id === effectiveEmpAId);
  const empAEnd = employeesTo.find(e => e.id === effectiveEmpAId);
  const empBStart = employeesFrom.find(e => e.id === effectiveEmpBId);
  const empBEnd = employeesTo.find(e => e.id === effectiveEmpBId);

  // Line Chart Data
  let chartData: Array<Record<string, string | number | null>> = [];
  let seriesALabel = '';
  let seriesBLabel = '';

  if (compareMode === 'employee') {
    seriesALabel = empAEnd?.name ? `${empAEnd.name} (A)` : 'พนักงาน A';
    seriesBLabel = empBEnd?.name ? `${empBEnd.name} (B)` : 'พนักงาน B';

    chartData = yearsRange.map(y => {
      const roster = employeesForYear(state, y);
      const a = roster.find(e => e.id === effectiveEmpAId);
      const b = roster.find(e => e.id === effectiveEmpBId);
      const keysA = a ? skillKeys(a, wi, type) : [];
      const keysB = b ? skillKeys(b, wi, type) : [];
      return {
        year: String(y),
        [seriesALabel]: a ? sumSkills(a, keysA) : null,
        [seriesBLabel]: b ? sumSkills(b, keysB) : null,
      };
    });
  } else {
    seriesALabel = `${deptA} (แผนก A)`;
    seriesBLabel = `${deptB} (แผนก B)`;

    chartData = yearsRange.map(y => {
      const roster = employeesForYear(state, y);
      const peopleA = roster.filter(e => e.department === deptA);
      const peopleB = roster.filter(e => e.department === deptB);
      const sumA = sectionSummary(peopleA, wi, type);
      const sumB = sectionSummary(peopleB, wi, type);
      return {
        year: String(y),
        [seriesALabel]: peopleA.length ? Number(sumA.averagePerPerson.toFixed(2)) : null,
        [seriesBLabel]: peopleB.length ? Number(sumB.averagePerPerson.toFixed(2)) : null,
      };
    });
  }

  // Employee Skills comparison rows
  const keysA = empAEnd ? skillKeys(empAEnd, wi, type) : [];
  const keysB = empBEnd ? skillKeys(empBEnd, wi, type) : [];
  const combinedKeys = [...new Set([...keysA, ...keysB])];

  const skillComparisonRows = combinedKeys.map(key => {
    const item = SKILL_WIS.find(w => key.startsWith(w.code + '_'));
    const typeCode = key.slice(key.lastIndexOf('_') + 1);
    const typeName = item?.types.find(t => t.code === typeCode)?.label ?? typeCode;

    const sAStart = (empAStart && empAStart.scores && typeof empAStart.scores[key] === 'number') ? empAStart.scores[key] : null;
    const sAEnd = (empAEnd && empAEnd.scores && typeof empAEnd.scores[key] === 'number') ? empAEnd.scores[key] : null;
    const deltaA = (sAStart !== null && sAEnd !== null) ? sAEnd - sAStart : null;

    const sBStart = (empBStart && empBStart.scores && typeof empBStart.scores[key] === 'number') ? empBStart.scores[key] : null;
    const sBEnd = (empBEnd && empBEnd.scores && typeof empBEnd.scores[key] === 'number') ? empBEnd.scores[key] : null;
    const deltaB = (sBStart !== null && sBEnd !== null) ? sBEnd - sBStart : null;

    const diffAB = (sAEnd !== null && sBEnd !== null) ? sAEnd - sBEnd : null;

    return {
      key,
      wiCode: item?.code ?? key,
      wiName: item?.name ?? '—',
      typeCode,
      typeName,
      sAStart,
      sAEnd,
      deltaA,
      sBStart,
      sBEnd,
      deltaB,
      diffAB,
    };
  });

  // Employee Total sums
  const totalScoreAStart = empAStart ? sumSkills(empAStart, keysA) : 0;
  const totalScoreAEnd = empAEnd ? sumSkills(empAEnd, keysA) : 0;
  const deltaScoreA = totalScoreAEnd - totalScoreAStart;

  const totalScoreBStart = empBStart ? sumSkills(empBStart, keysB) : 0;
  const totalScoreBEnd = empBEnd ? sumSkills(empBEnd, keysB) : 0;
  const deltaScoreB = totalScoreBEnd - totalScoreBStart;

  const totalDiffAB = totalScoreAEnd - totalScoreBEnd;

  // Department Summaries for both years
  const deptAPeopleStart = employeesFrom.filter(e => e.department === deptA);
  const deptAPeopleEnd = employeesTo.filter(e => e.department === deptA);
  const deptASummaryStart = sectionSummary(deptAPeopleStart, wi, type);
  const deptASummaryEnd = sectionSummary(deptAPeopleEnd, wi, type);

  const deptBPeopleStart = employeesFrom.filter(e => e.department === deptB);
  const deptBPeopleEnd = employeesTo.filter(e => e.department === deptB);
  const deptBSummaryStart = sectionSummary(deptBPeopleStart, wi, type);
  const deptBSummaryEnd = sectionSummary(deptBPeopleEnd, wi, type);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <GitCompare className="text-blue-700" />
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          เปรียบเทียบคะแนนและแนวโน้มระหว่างพนักงาน หรือระหว่างแผนก พร้อมเลือกช่วงปีได้อย่างอิสระ ({fromYear} เทียบ {toYear})
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setCompareMode('employee')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition border ${
            compareMode === 'employee'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users size={16} />
          เปรียบเทียบพนักงาน (A vs B)
        </button>
        <button
          type="button"
          onClick={() => setCompareMode('department')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition border ${
            compareMode === 'department'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 size={16} />
          เปรียบเทียบรายแผนก (แผนก A vs แผนก B)
        </button>
      </div>

      {/* Comparison Filters */}
      <FilterBar
        title={`ตัวเลือกการเปรียบเทียบ: ${compareMode === 'employee' ? 'พนักงาน' : 'แผนก'}`}
        onReset={() => {
          setStartYear(currentYear - 2 >= minSnapshotYear ? currentYear - 2 : minSnapshotYear);
          setEndYear(currentYear);
          setDepartment(userRole === 'chief' || userRole === 'staff' ? 'QC Section' : 'ALL');
          setEmpAId('EMP001');
          setEmpBId('EMP002');
          setDeptA('QC Section');
          setDeptB('Production');
          setWi('ALL');
          setType('ALL');
        }}
      >
        {compareMode === 'employee' ? (
          <>
            <Field label="แผนก">
              <select
                className={inputClass}
                disabled={userRole === 'chief' || userRole === 'staff'}
                value={department}
                onChange={e => setDepartment(e.target.value)}
              >
                {userRole !== 'chief' && userRole !== 'staff' && <option value="ALL">ทุกแผนก</option>}
                {SKILL_DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>

            <Field label="พนักงาน A (เส้นสีน้ำเงิน)">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center z-10">
                  <Avatar src={empAEnd?.avatarUrl} name={empAEnd?.name} size="xs" />
                </div>
                <select
                  className={inputClass}
                  style={{ paddingLeft: '2.75rem' }}
                  value={effectiveEmpAId}
                  onChange={e => setEmpAId(e.target.value)}
                >
                  {employeePool.map(e => (
                    <option key={e.id} value={e.id}>{e.id} · {e.name}</option>
                  ))}
                </select>
              </div>
            </Field>

            <Field label="พนักงาน B (เส้นสีเขียว)">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center z-10">
                  <Avatar src={empBEnd?.avatarUrl} name={empBEnd?.name} size="xs" />
                </div>
                <select
                  className={inputClass}
                  style={{ paddingLeft: '2.75rem' }}
                  value={effectiveEmpBId}
                  onChange={e => setEmpBId(e.target.value)}
                >
                  {employeePool.map(e => (
                    <option key={e.id} value={e.id}>{e.id} · {e.name}</option>
                  ))}
                </select>
              </div>
            </Field>
          </>
        ) : (
          <>
            <Field label="แผนก A (เส้นสีน้ำเงิน)">
              <select
                className={inputClass}
                value={deptA}
                onChange={e => setDeptA(e.target.value)}
              >
                {SKILL_DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>

            <Field label="แผนก B (เส้นสีเขียว)">
              <select
                className={inputClass}
                value={deptB}
                onChange={e => setDeptB(e.target.value)}
              >
                {SKILL_DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>
          </>
        )}

        <Field label="ปีต้นทาง (เริ่ม)">
          <select
            className={inputClass}
            value={startYear}
            onChange={e => setStartYear(Number(e.target.value))}
          >
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </Field>

        <Field label="ปีปลายทาง (จบ)">
          <select
            className={inputClass}
            value={endYear}
            onChange={e => setEndYear(Number(e.target.value))}
          >
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </Field>

        <Field label="Work Instruction">
          <select
            className={inputClass}
            value={wi}
            onChange={e => {
              setWi(e.target.value);
              setType('ALL');
            }}
          >
            <option value="ALL">ทุก W/I</option>
            {availableWis.map(w => (
              <option key={w.code} value={w.code}>
                {w.code} · {w.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="ประเภทสกิล">
          <select className={inputClass} value={type} onChange={e => setType(e.target.value)}>
            <option value="ALL">ทุกประเภท</option>
            {availableTypes.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </FilterBar>

      {/* Summary KPI Cards */}
      {compareMode === 'employee' ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric
            label={`พนักงาน A: ${empAEnd?.name ?? 'พนักงาน A'}`}
            value={`${totalScoreAEnd} คะแนน (ปี ${toYear})`}
            note={`จาก ${totalScoreAStart} คะแนน (ปี ${fromYear}) · ผลต่าง ${deltaScoreA > 0 ? '+' : ''}${deltaScoreA}`}
          />
          <Metric
            label={`พนักงาน B: ${empBEnd?.name ?? 'พนักงาน B'}`}
            value={`${totalScoreBEnd} คะแนน (ปี ${toYear})`}
            note={`จาก ${totalScoreBStart} คะแนน (ปี ${fromYear}) · ผลต่าง ${deltaScoreB > 0 ? '+' : ''}${deltaScoreB}`}
          />
          <Metric
            label={`ผลต่างระหว่างสองคน (${toYear})`}
            value={
              totalDiffAB > 0
                ? `A สูงกว่า B (+${totalDiffAB})`
                : totalDiffAB < 0
                ? `B สูงกว่า A (+${Math.abs(totalDiffAB)})`
                : 'คะแนนเท่ากัน (0)'
            }
            note={`เทียบภาพรวม ณ ปี ${toYear}`}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric
            label={`แผนก A: ${deptA}`}
            value={`เฉลี่ย ${deptASummaryEnd.averagePerPerson.toFixed(2)} คะแนน/คน`}
            note={`ปี ${fromYear}: ${deptASummaryStart.averagePerPerson.toFixed(2)} · พนักงาน ${deptAPeopleEnd.length} คน`}
          />
          <Metric
            label={`แผนก B: ${deptB}`}
            value={`เฉลี่ย ${deptBSummaryEnd.averagePerPerson.toFixed(2)} คะแนน/คน`}
            note={`ปี ${fromYear}: ${deptBSummaryStart.averagePerPerson.toFixed(2)} · พนักงาน ${deptBPeopleEnd.length} คน`}
          />
          <Metric
            label={`ผลต่างค่าเฉลี่ยสองแผนก (${toYear})`}
            value={
              deptASummaryEnd.averagePerPerson > deptBSummaryEnd.averagePerPerson
                ? `${deptA} สูงกว่า (+${(deptASummaryEnd.averagePerPerson - deptBSummaryEnd.averagePerPerson).toFixed(2)})`
                : deptASummaryEnd.averagePerPerson < deptBSummaryEnd.averagePerPerson
                ? `${deptB} สูงกว่า (+${(deptBSummaryEnd.averagePerPerson - deptASummaryEnd.averagePerPerson).toFixed(2)})`
                : 'เท่ากัน'
            }
            note={`เทียบ ณ ปี ${toYear}`}
          />
        </div>
      )}

      {/* Multi-line Chart */}
      <div className={`${panelClass} p-5 lg:p-6`}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {compareMode === 'employee'
                ? `กราฟเปรียบเทียบแนวโน้ม: ${empAEnd?.name ?? 'A'} vs ${empBEnd?.name ?? 'B'}`
                : `กราฟเปรียบเทียบแนวโน้ม: ${deptA} vs ${deptB}`}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {compareMode === 'employee' ? 'คะแนนรวมรายบุคคล' : 'คะแนนเฉลี่ยต่อคน (คะแนน/คน)'} · ช่วงปี {fromYear} ถึง {toYear}
            </p>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 12, right: 24, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis
                allowDecimals={compareMode === 'department'}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                itemSorter={item => (String(item.name || item.dataKey || '').includes('(A)') ? 0 : 1)}
              />
              <Legend
                wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }}
                itemSorter={item => (String(item.value || '').includes('(A)') ? 0 : 1)}
              />
              <Line
                type="monotone"
                dataKey={seriesALabel}
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5, fill: '#2563eb' }}
                activeDot={{ r: 7 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey={seriesBLabel}
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5, fill: '#10b981' }}
                activeDot={{ r: 7 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      {compareMode === 'employee' ? (
        <div className={`${panelClass} overflow-x-auto`}>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800">ตารางเปรียบเทียบคะแนนรายสกิล ({fromYear} vs {toYear})</h2>
              <p className="mt-1 text-xs text-slate-500">
                เปรียบเทียบระดับสกิล 0–3 ระหว่าง {empAEnd?.name} และ {empBEnd?.name}
              </p>
            </div>
          </div>
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4" rowSpan={2}>W/I</th>
                <th className="p-4" rowSpan={2}>ชื่องาน</th>
                <th className="p-4" rowSpan={2}>ประเภทสกิล</th>
                <th className="p-4 text-center border-l border-slate-200" colSpan={3}>
                  <span className="text-blue-700 font-bold">{empAEnd?.name ?? 'พนักงาน A'} ({empAEnd?.id})</span>
                </th>
                <th className="p-4 text-center border-l border-slate-200" colSpan={3}>
                  <span className="text-emerald-700 font-bold">{empBEnd?.name ?? 'พนักงาน B'} ({empBEnd?.id})</span>
                </th>
                <th className="p-4 text-center border-l border-slate-200" rowSpan={2}>
                  ผลต่าง A vs B ({toYear})
                </th>
              </tr>
              <tr className="border-t border-slate-200 bg-slate-50/70 text-xs">
                <th className="p-2 text-center border-l border-slate-200">ปี {fromYear}</th>
                <th className="p-2 text-center">ปี {toYear}</th>
                <th className="p-2 text-center">ผลต่าง A</th>
                <th className="p-2 text-center border-l border-slate-200">ปี {fromYear}</th>
                <th className="p-2 text-center">ปี {toYear}</th>
                <th className="p-2 text-center">ผลต่าง B</th>
              </tr>
            </thead>
            <tbody>
              {skillComparisonRows.map(row => (
                <tr key={row.key} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4 font-mono font-medium">{row.wiCode}</td>
                  <td className="p-4 max-w-xs truncate" title={row.wiName}>{row.wiName}</td>
                  <td className="p-4">{row.typeCode} · {row.typeName}</td>
                  <td className="p-4 text-center border-l border-slate-200">
                    {row.sAStart !== null ? <LevelBadge level={row.sAStart} /> : <span className="text-slate-300 font-mono text-xs">N/A</span>}
                  </td>
                  <td className="p-4 text-center">
                    {row.sAEnd !== null ? <LevelBadge level={row.sAEnd} /> : <span className="text-slate-300 font-mono text-xs">N/A</span>}
                  </td>
                  <td className="p-4 text-center">{renderDelta(row.deltaA)}</td>
                  <td className="p-4 text-center border-l border-slate-200">
                    {row.sBStart !== null ? <LevelBadge level={row.sBStart} /> : <span className="text-slate-300 font-mono text-xs">N/A</span>}
                  </td>
                  <td className="p-4 text-center">
                    {row.sBEnd !== null ? <LevelBadge level={row.sBEnd} /> : <span className="text-slate-300 font-mono text-xs">N/A</span>}
                  </td>
                  <td className="p-4 text-center">{renderDelta(row.deltaB)}</td>
                  <td className="p-4 text-center border-l border-slate-200 font-bold">
                    {renderDiffAB(row.diffAB, empAEnd?.name ?? 'A', empBEnd?.name ?? 'B')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-slate-200 bg-slate-100/70 font-bold text-slate-800">
              <tr>
                <td className="p-4" colSpan={3}>รวมคะแนนทั้งหมด ({skillComparisonRows.length} สกิล)</td>
                <td className="p-4 text-center border-l border-slate-200 text-blue-800">{totalScoreAStart}</td>
                <td className="p-4 text-center text-blue-800">{totalScoreAEnd}</td>
                <td className="p-4 text-center">{renderDelta(deltaScoreA)}</td>
                <td className="p-4 text-center border-l border-slate-200 text-emerald-800">{totalScoreBStart}</td>
                <td className="p-4 text-center text-emerald-800">{totalScoreBEnd}</td>
                <td className="p-4 text-center">{renderDelta(deltaScoreB)}</td>
                <td className="p-4 text-center border-l border-slate-200">
                  {renderDiffAB(totalDiffAB, empAEnd?.name ?? 'A', empBEnd?.name ?? 'B')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className={`${panelClass} overflow-x-auto`}>
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">ตารางเปรียบเทียบสถิติและผลงานรายแผนก ({fromYear} vs {toYear})</h2>
            <p className="mt-1 text-xs text-slate-500">
              เปรียบเทียบภาพรวมระหว่างแผนก {deptA} และแผนก {deptB}
            </p>
          </div>
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4">หัวข้อการเปรียบเทียบ</th>
                <th className="p-4 text-center border-l border-slate-200 text-blue-700 font-bold">{deptA} ({fromYear})</th>
                <th className="p-4 text-center text-blue-700 font-bold">{deptA} ({toYear})</th>
                <th className="p-4 text-center text-blue-700">ผลต่าง {deptA}</th>
                <th className="p-4 text-center border-l border-slate-200 text-emerald-700 font-bold">{deptB} ({fromYear})</th>
                <th className="p-4 text-center text-emerald-700 font-bold">{deptB} ({toYear})</th>
                <th className="p-4 text-center text-emerald-700">ผลต่าง {deptB}</th>
                <th className="p-4 text-center border-l border-slate-200 font-bold">ผลต่าง A vs B ({toYear})</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100 hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-800">จำนวนบุคลากร (คน)</td>
                <td className="p-4 text-center border-l border-slate-200">{deptAPeopleStart.length}</td>
                <td className="p-4 text-center font-bold text-blue-800">{deptAPeopleEnd.length}</td>
                <td className="p-4 text-center">{renderDelta(deptAPeopleEnd.length - deptAPeopleStart.length)}</td>
                <td className="p-4 text-center border-l border-slate-200">{deptBPeopleStart.length}</td>
                <td className="p-4 text-center font-bold text-emerald-800">{deptBPeopleEnd.length}</td>
                <td className="p-4 text-center">{renderDelta(deptBPeopleEnd.length - deptBPeopleStart.length)}</td>
                <td className="p-4 text-center border-l border-slate-200 font-bold">
                  {deptAPeopleEnd.length - deptBPeopleEnd.length > 0
                    ? `A มากกว่า (+${deptAPeopleEnd.length - deptBPeopleEnd.length})`
                    : deptAPeopleEnd.length - deptBPeopleEnd.length < 0
                    ? `B มากกว่า (+${Math.abs(deptAPeopleEnd.length - deptBPeopleEnd.length)})`
                    : 'เท่ากัน'}
                </td>
              </tr>
              <tr className="border-t border-slate-100 hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-800">คะแนนรวมทั้งแผนก</td>
                <td className="p-4 text-center border-l border-slate-200">{deptASummaryStart.total}</td>
                <td className="p-4 text-center font-bold text-blue-800">{deptASummaryEnd.total}</td>
                <td className="p-4 text-center">{renderDelta(deptASummaryEnd.total - deptASummaryStart.total)}</td>
                <td className="p-4 text-center border-l border-slate-200">{deptBSummaryStart.total}</td>
                <td className="p-4 text-center font-bold text-emerald-800">{deptBSummaryEnd.total}</td>
                <td className="p-4 text-center">{renderDelta(deptBSummaryEnd.total - deptBSummaryStart.total)}</td>
                <td className="p-4 text-center border-l border-slate-200 font-bold">
                  {deptASummaryEnd.total - deptBSummaryEnd.total > 0
                    ? `A สูงกว่า (+${deptASummaryEnd.total - deptBSummaryEnd.total})`
                    : deptASummaryEnd.total - deptBSummaryEnd.total < 0
                    ? `B สูงกว่า (+${Math.abs(deptASummaryEnd.total - deptBSummaryEnd.total)})`
                    : 'เท่ากัน'}
                </td>
              </tr>
              <tr className="border-t border-slate-100 hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-800">คะแนนเฉลี่ยต่อคน (คะแนน/คน)</td>
                <td className="p-4 text-center border-l border-slate-200">{deptASummaryStart.averagePerPerson.toFixed(2)}</td>
                <td className="p-4 text-center font-bold text-blue-800">{deptASummaryEnd.averagePerPerson.toFixed(2)}</td>
                <td className="p-4 text-center">
                  {renderDelta(Number((deptASummaryEnd.averagePerPerson - deptASummaryStart.averagePerPerson).toFixed(2)))}
                </td>
                <td className="p-4 text-center border-l border-slate-200">{deptBSummaryStart.averagePerPerson.toFixed(2)}</td>
                <td className="p-4 text-center font-bold text-emerald-800">{deptBSummaryEnd.averagePerPerson.toFixed(2)}</td>
                <td className="p-4 text-center">
                  {renderDelta(Number((deptBSummaryEnd.averagePerPerson - deptBSummaryStart.averagePerPerson).toFixed(2)))}
                </td>
                <td className="p-4 text-center border-l border-slate-200 font-bold">
                  {deptASummaryEnd.averagePerPerson - deptBSummaryEnd.averagePerPerson > 0
                    ? `A สูงกว่า (+${(deptASummaryEnd.averagePerPerson - deptBSummaryEnd.averagePerPerson).toFixed(2)})`
                    : deptASummaryEnd.averagePerPerson - deptBSummaryEnd.averagePerPerson < 0
                    ? `B สูงกว่า (+${Math.abs(deptASummaryEnd.averagePerPerson - deptBSummaryEnd.averagePerPerson).toFixed(2)})`
                    : 'เท่ากัน'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
