import { FilterBar } from '../components/FilterBar';
import { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { ACTORS, bangkokYear, employeesForYear, SKILL_WIS } from '../data/phase1Core';
import { employeeTeam, jobReportEmployees } from '../data/teamScope';
import { useSkillState } from '../data/phase1Store';
import { downloadCsv } from '../lib/phase1Export';
import { EmptyState, ExportButtons, Field, FormulaNote, inputClass, LevelBadge, Metric, panelClass, ScopeFilters } from '../components/Phase1Shared';

export default function JobSummary({ userRole, title='Job Summary' }: { userRole: string; title?:string }) {
  const state = useSkillState();
  const [department, setDepartment] = useState(userRole === 'chief' || userRole === 'staff' ? 'QC Section' : 'ALL');
  const [wi, setWi] = useState('ALL');
  const [type, setType] = useState('ALL');
  const [employeeId, setEmployeeId] = useState('ALL');
  const [teamId, setTeamId] = useState('ALL');
  const [year, setYear] = useState(bangkokYear());
  const scopedDepartment = userRole === 'chief' ? ACTORS.chief.department : department;
  const roster = employeesForYear(state,year);
  const allowed = jobReportEmployees(roster,userRole,scopedDepartment);
  const teams = [...new Map(allowed.flatMap(employee => { const team=employeeTeam(employee); return team ? [[team.id,team] as const] : []; })).values()];
  const employees = jobReportEmployees(roster,userRole,scopedDepartment,teamId);
  const selectedEmployees = jobReportEmployees(roster,userRole,scopedDepartment,teamId,employeeId);
  const jobs = SKILL_WIS.filter(w => (scopedDepartment === 'ALL' || w.department === scopedDepartment) && (wi === 'ALL' || wi === w.code))
    .map(w => {
      const types = w.types.filter(t => type === 'ALL' || t.code === type);
      const people = selectedEmployees.filter(e => e.department === w.department);
      const totals = types.map(t => people.reduce((n,e) => n + (e.scores[`${w.code}_${t.code}`] ?? 0),0));
      return { ...w, types, people, totals, total: totals.reduce((a,b) => a+b,0), max: people.length*types.length*3 };
    }).filter(w => w.people.length && w.types.length);
  const types = [...new Set(jobs.flatMap(w => w.types.map(t => t.code)))];
  const rows: (string|number)[][] = [['ปี','W/I','ชื่องาน','แผนก','ทีม','หัวหน้างาน','รหัสพนักงาน','ชื่อ',...types.map(t => `Type ${t}`),'รวม','เต็ม']];
  jobs.forEach(w => w.people.forEach(e => { const values = types.map(t => w.types.some(x => x.code === t) ? (e.scores[`${w.code}_${t}`] ?? 0) : ''); const team=employeeTeam(e); rows.push([year,w.code,w.name,w.department,team?.name??'ไม่ระบุทีม',team?.supervisorName??'',e.id,e.name,...values,values.reduce<number>((n,v) => n + (typeof v === 'number' ? v : 0),0),w.types.length*3]); }));
  const summaryRows: (string|number)[][] = [['ปี','W/I','ชื่องาน','แผนก','ทีม','จำนวนพนักงาน',...types.map(t => `Type ${t}`),'รวม','เต็ม']];
  jobs.forEach(w => summaryRows.push([year,w.code,w.name,w.department,[...new Set(w.people.map(e=>employeeTeam(e)?.name??'ไม่ระบุทีม'))].join(' / '),w.people.length,...types.map(t => { const index=w.types.findIndex(x => x.code === t); return index === -1 ? '' : w.totals[index]; }),w.total,w.max]));
  const total = jobs.reduce((n,w) => n+w.total,0);
  summaryRows.push([year,'รวม','','','','',...types.map(t => jobs.reduce((n,w) => n + (w.totals[w.types.findIndex(x => x.code === t)] ?? 0),0)),total,jobs.reduce((n,w) => n+w.max,0)]);
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800"><BarChart2/>{title}</h1><p className="mt-1 text-sm text-slate-500">สรุปความสามารถพนักงานตามงาน W/I และประเภทสกิล · ปี {year}</p></div><ExportButtons disabled={!jobs.length} onCsv={() => downloadCsv(`job-summary-${year}.csv`,summaryRows)}/></div>
    <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">{userRole==='chief' ? `ขอบเขตของคุณ: เฉพาะพนักงานที่มีคุณเป็นหัวหน้า · ${ACTORS.chief.name} · ${teams.map(team=>team.name).join(' / ') || 'ยังไม่มีทีมที่ดูแล'}` : 'ขอบเขตผู้จัดการ / ผู้ดูแลระบบ: ดูข้อมูลได้ทุกทีม ทุกแผนก และเลือกกรองทีมเพื่อเปรียบเทียบความสามารถตามงาน'}</p>
    <FilterBar title="ขอบเขตรายงาน" onReset={()=>{setDepartment(userRole==='chief'||userRole==='staff'?ACTORS[userRole].department:'ALL');setWi('ALL');setType('ALL');setTeamId('ALL');setEmployeeId('ALL');setYear(bangkokYear());}}><ScopeFilters role={userRole} department={scopedDepartment} setDepartment={d => { setDepartment(d); setTeamId('ALL'); setEmployeeId('ALL'); }} wi={wi} setWi={setWi} type={type} setType={setType}/><Field label="ทีม"><select className={inputClass} value={teamId} onChange={e=>{setTeamId(e.target.value);setEmployeeId('ALL');}}><option value="ALL">{userRole==='chief'?'ทุกทีมที่คุณดูแล':'ทุกทีมในขอบเขต'}</option>{teams.map(team=><option value={team.id} key={team.id}>{team.name} · {team.department}</option>)}</select></Field><Field label="พนักงาน"><select className={inputClass} value={employeeId} onChange={e => setEmployeeId(e.target.value)}><option value="ALL">{userRole==='chief'?'ทุกคนใต้บังคับบัญชา':'ทุกคนในขอบเขต'}</option>{employees.map(e => <option value={e.id} key={e.id}>{e.id} · {e.name}</option>)}</select></Field><Field label="ปีรายงาน"><select className={inputClass} value={year} onChange={e => setYear(Number(e.target.value))}>{Array.from({length:4},(_,i) => bangkokYear()-i).map(y => <option key={y}>{y}</option>)}</select></Field></FilterBar>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Metric label="งาน W/I ในรายงาน" value={jobs.length}/><Metric label="ทีมในรายงาน" value={new Set(jobs.flatMap(w=>w.people.map(e=>employeeTeam(e)?.id??'UNASSIGNED'))).size}/><Metric label="พนักงานในรายงาน" value={new Set(jobs.flatMap(w => w.people.map(e => e.id))).size}/><Metric label="รวมคะแนนทุกงานที่เลือก" value={total} note={`คะแนนเต็ม ${jobs.reduce((n,w) => n+w.max,0)}`}/></div><FormulaNote/>
    {!jobs.length ? <EmptyState>ไม่พบข้อมูลในปีหรือขอบเขตที่เลือก</EmptyState> : <><div className={`${panelClass} overflow-x-auto`}><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-4">งาน W/I</th><th className="p-4 text-center">พนักงาน</th>{types.map(t => <th key={t} className="p-4 text-center">Type {t}</th>)}<th className="p-4 text-right">รวม / เต็ม</th></tr></thead><tbody>{jobs.map(w => <tr key={w.code} className="border-t border-slate-100"><td className="p-4"><button className="font-mono font-bold text-blue-700 hover:underline print:text-slate-800" onClick={() => setWi(w.code)}>{w.code}</button><div className="mt-1 max-w-xl text-xs text-slate-500">{w.name}</div></td><td className="p-4 text-center">{w.people.length}</td>{types.map(t => { const index=w.types.findIndex(x => x.code === t); return <td key={t} className="p-4 text-center">{index === -1 ? '—' : w.totals[index]}</td>; })}<td className="p-4 text-right font-bold text-blue-800">{w.total} / {w.max}</td></tr>)}</tbody><tfoot className="border-t bg-blue-50 font-bold"><tr><td colSpan={2} className="p-4">รวมคะแนน</td>{types.map(t => <td key={t} className="p-4 text-center">{jobs.reduce((n,w) => n + (w.totals[w.types.findIndex(x => x.code === t)] ?? 0),0)}</td>)}<td className="p-4 text-right">{total} / {jobs.reduce((n,w) => n+w.max,0)}</td></tr></tfoot></table></div>
    <div className="report-details-title flex items-center justify-between"><h2 className="font-bold text-slate-800">รายละเอียดพนักงานตามงาน</h2><button className="text-sm font-semibold text-blue-700 print:hidden" onClick={() => downloadCsv(`job-summary-employees-${year}.csv`,rows)}>ส่งออกรายละเอียด CSV</button></div>
    {jobs.map(w => <div key={w.code} className={`${panelClass} report-job-card overflow-hidden`}><div className="border-b border-slate-200 bg-slate-50 p-4"><h3 className="font-semibold text-slate-800">{w.code} · {w.department}</h3><p className="mt-1 text-xs text-slate-500">{w.name}</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-4">พนักงาน</th>{w.types.map(t => <th key={t.code} className="p-4 text-center">{t.code} · {t.label}</th>)}<th className="p-4 text-right">รวม</th></tr></thead><tbody>{w.people.map(e => <tr key={e.id} data-report-employee={e.id} className="border-t border-slate-100"><td className="p-4"><div className="font-semibold">{e.name}</div><span className="text-xs text-slate-500">{e.id} · {e.position}</span><p className="mt-1 text-xs text-blue-700">{employeeTeam(e)?.name ?? 'ไม่ระบุทีม'}</p></td>{w.types.map(t => <td key={t.code} className="p-4 text-center"><LevelBadge level={e.scores[`${w.code}_${t.code}`] ?? 0}/></td>)}<td className="p-4 text-right font-bold">{w.types.reduce((n,t) => n+(e.scores[`${w.code}_${t.code}`] ?? 0),0)} / {w.types.length*3}</td></tr>)}</tbody><tfoot className="border-t bg-blue-50 font-bold"><tr><td className="p-4">รวม</td>{w.totals.map((n,i) => <td key={w.types[i].code} className="p-4 text-center">{n}</td>)}<td className="p-4 text-right">{w.total} / {w.max}</td></tr></tfoot></table></div></div>)}</>}
  </div>;
}
