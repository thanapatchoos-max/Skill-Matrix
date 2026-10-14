import { useState } from 'react';
import { FilterBar } from '../../components/FilterBar';
import { Building2, CalendarDays, UserRound } from 'lucide-react';
import { bangkokYear, employeesForYear, SKILL_DEPARTMENTS } from '../../data/phase1Core';
import { useSkillState } from '../../data/phase1Store';
import { individualAssessment } from '../../data/skillAssessment';
import type { ScoreAssessmentScope } from '../../data/skillAssessment';
import { employeeTeam } from '../../data/teamScope';
import { downloadCsv } from '../../lib/phase1Export';
import { individualReport } from '../../lib/assessmentReport';
import { EmptyState, Field, inputClass, LevelBadge } from '../../components/Phase1Shared';
import { AssessmentFormula, AssessmentHeader, AssessmentMetric, LevelLegend, ScoreProgress } from '../../components/AssessmentShared';
import { assessmentPanel, scoreText } from '../../lib/assessmentFormat';

export default function IndividualAssessmentPage({initialScope}:{initialScope?:ScoreAssessmentScope}) {
  const state=useSkillState();const currentYear=bangkokYear();
  const [year,setYear]=useState(initialScope?.year??currentYear);
  const [department,setDepartment]=useState(initialScope?.department??'ALL');
  const [employeeId,setEmployeeId]=useState('EMP001');
  const people=employeesForYear(state,year).filter(employee=>department==='ALL'||employee.department===department);
  const employee=people.find(person=>person.id===employeeId)??people[0];
  const result=employee?individualAssessment(employee):null;
  const team=employee?employeeTeam(employee):null;
  function exportResult(){if(!result)return;downloadCsv(`individual-assessment-${employee!.id}-${year}.csv`,[['รายงาน','ประเมินคะแนนรายบุคคล'],['ปี',year],['รหัสพนักงาน',employee!.id],['ชื่อ',employee!.name],['แผนก',employee!.department],['ทีม',team?.name??'ไม่ระบุทีม'],['W/I','ชื่องาน','ประเภทสกิล','คะแนน'],...result.rows.map(row=>[row.wiCode,row.wiName,row.type,row.level]),['ผลรวมคะแนน','','',result.total],['คะแนนเต็ม','','',result.maximum],['คะแนนเฉลี่ยต่อสกิล (0–3)','','',scoreText(result.averagePerSkill)],['สัดส่วนคะแนนเต็ม (%)','','',scoreText(result.scorePercent,1)]]);}
  return <div className="assessment-report space-y-6">
    <AssessmentHeader title="ประเมินคะแนนรายบุคคล" description="สรุปคะแนนรวม คะแนนเฉลี่ย และความสามารถตามงานของพนักงานแต่ละคน พร้อมรายงาน PDF สำหรับประกอบการพิจารณา" year={year} filename={`individual-assessment-${employee?.id??'empty'}-${year}.pdf`} definition={()=>individualReport(result!,year)} onCsv={exportResult} disabled={!result||!result.rows.length}/>
    <FilterBar title="ขอบเขตการประเมินรายบุคคล" onReset={()=>{setYear(currentYear);setDepartment('ALL');setEmployeeId('EMP001');}}>
      <Field label="ปีประเมิน"><select className={inputClass} value={year} onChange={event=>setYear(Number(event.target.value))}>{Array.from({length:4},(_,index)=>currentYear-index).map(value=><option key={value}>{value}</option>)}</select></Field>
      <Field label="แผนก"><select className={inputClass} value={department} onChange={event=>{setDepartment(event.target.value);setEmployeeId('');}}><option value="ALL">ทุกแผนก</option>{SKILL_DEPARTMENTS.map(value=><option key={value}>{value}</option>)}</select></Field>
      <Field label="พนักงานที่ประเมิน"><select className={inputClass} value={employee?.id??''} onChange={event=>setEmployeeId(event.target.value)}>{people.map(person=><option key={person.id} value={person.id}>{person.id} · {person.name}</option>)}</select></Field>
    </FilterBar>
    {!result?<EmptyState>ไม่มีข้อมูลคะแนนสำหรับปีหรือแผนกที่เลือก</EmptyState>:<>
      <section className={`${assessmentPanel} flex flex-wrap items-center justify-between gap-5 border-l-4 border-l-blue-600 p-6`}>
        <div className="flex items-center gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><UserRound size={27}/></span><div><p className="mb-1 text-xs font-semibold text-blue-700">พนักงานที่ประเมิน · {employee!.id}</p><h2 className="text-xl font-bold text-slate-900">{employee!.name}</h2><p className="mt-1 text-sm text-slate-500">{employee!.position}</p></div></div>
        <div className="space-y-2 text-sm text-slate-500"><p className="flex items-center gap-2"><Building2 size={15}/>{employee!.department} · {team?.name??'ไม่ระบุทีม'}</p><p className="flex items-center gap-2"><CalendarDays size={15}/>ปีประเมิน {year} · {result.jobs.length} งาน / {result.rows.length} สกิล</p></div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AssessmentMetric label="ผลรวมคะแนนรายบุคคล" value={result.total} note={`จากคะแนนเต็ม ${result.maximum} คะแนน`} accent/>
        <AssessmentMetric label="คะแนนเฉลี่ยต่อสกิล" value={scoreText(result.averagePerSkill)} note={`${result.total} คะแนน ÷ ${result.rows.length} สกิล · ระดับ 0–3`}/>
        <AssessmentMetric label="สัดส่วนคะแนนเต็ม" value={result.scorePercent===null?'—':`${scoreText(result.scorePercent,1)}%`} note="คะแนนรวมเทียบกับคะแนนเต็ม"/>
        <AssessmentMetric label="จำนวนสกิลที่นำมารวม" value={result.rows.length} note={`ครอบคลุม ${result.jobs.length} งาน W/I · คะแนนเต็มสกิลละ 3`}/>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <section className={`${assessmentPanel} assessment-summary xl:col-span-2`}>
          <div className="border-b border-slate-100 p-5"><h2 className="font-bold text-slate-900">สรุปคะแนนตามประเภทสกิล</h2><p className="mt-1 text-xs leading-5 text-slate-500">ผลรวมและค่าเฉลี่ยของแต่ละประเภท พร้อมสัดส่วนคะแนนเทียบคะแนนเต็ม</p></div>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-5 py-3">ประเภท</th><th className="px-4 py-3 text-right">รวม / เต็ม</th><th className="px-4 py-3 text-right">เฉลี่ย / สกิล</th><th className="px-5 py-3">สัดส่วนคะแนน</th></tr></thead><tbody>{result.types.map(type=><tr key={type.type} className="border-t border-slate-100"><td className="px-5 py-4"><span className="font-bold text-slate-800">Type {type.type}</span><p className="mt-1 text-xs text-slate-400">{type.count} สกิล</p></td><td className="px-4 py-4 text-right font-bold text-blue-800">{type.total} <span className="font-normal text-slate-400">/ {type.maximum}</span></td><td className="px-4 py-4 text-right font-semibold">{scoreText(type.averagePerSkill)}</td><td className="px-5 py-4"><ScoreProgress total={type.total} maximum={type.maximum}/></td></tr>)}</tbody><tfoot className="border-t border-blue-100 bg-blue-50 font-bold text-blue-900"><tr><td className="px-5 py-4">รวมทุกประเภท</td><td className="px-4 py-4 text-right">{result.total} / {result.maximum}</td><td className="px-4 py-4 text-right">{scoreText(result.averagePerSkill)}</td><td className="px-5 py-4">{scoreText(result.scorePercent,1)}%</td></tr></tfoot></table></div>
        </section>
        <aside className={`${assessmentPanel} p-5`}><h2 className="font-bold text-slate-900">อ่านผลประเมิน</h2><p className="mt-3 text-sm leading-7 text-slate-500">คะแนนรวมบอกความสามารถสะสมของพนักงาน ส่วนคะแนนเฉลี่ยต่อสกิลช่วยอ่านระดับความสามารถโดยรวมบนสเกล 0–3</p><div className="my-5 h-px bg-slate-100"/><h3 className="text-sm font-semibold text-slate-700">ระดับความสามารถ</h3><div className="mt-3 space-y-3">{['ยังทำไม่ได้','ทำได้ภายใต้การดูแล','ทำได้ด้วยตนเอง','สอน / ควบคุมผู้อื่นได้'].map((label,level)=><div key={level} className="flex items-center gap-3 text-xs text-slate-500"><LevelBadge level={level}/>{label}</div>)}</div><p className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-500 print:hidden">รายงาน PDF มีหน้าสรุปผลและรายละเอียดคะแนนตามงาน พร้อมช่องลงชื่อผู้พิจารณา</p></aside>
      </div>
      <section className={`${assessmentPanel} assessment-details overflow-hidden`}><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><div><h2 className="font-bold text-slate-900">รายละเอียดคะแนนที่นำมาประเมิน</h2><p className="mt-1 text-xs text-slate-500">แยกตามงาน W/I · ช่องที่ไม่เกี่ยวข้องกับงานแสดง —</p></div><LevelLegend/></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-5 py-3">งาน W/I</th>{result.types.map(type=><th key={type.type} className="px-4 py-3 text-center">Type {type.type}</th>)}<th className="px-5 py-3 text-right">รวม / เต็ม</th></tr></thead><tbody>{result.jobs.map(job=><tr key={job.wiCode} className="border-t border-slate-100"><td className="px-5 py-4"><p className="font-mono font-semibold text-slate-800">{job.wiCode}</p><p className="mt-1 max-w-lg text-xs leading-5 text-slate-500">{job.wiName}</p></td>{result.types.map(type=>{const skill=job.skills.find(row=>row.type===type.type);return <td key={type.type} className="px-4 py-4 text-center">{skill?<LevelBadge level={skill.level}/>:<span className="text-slate-300">—</span>}</td>;})}<td className="px-5 py-4 text-right font-bold text-blue-900">{job.total} / {job.maximum}</td></tr>)}</tbody><tfoot className="border-t bg-blue-50 font-bold text-blue-900"><tr><td className="px-5 py-4">ผลรวมคะแนนรายบุคคล</td>{result.types.map(type=><td key={type.type} className="px-4 py-4 text-center">{type.total}</td>)}<td className="px-5 py-4 text-right">{result.total} / {result.maximum}</td></tr></tfoot></table></div></section>
      <AssessmentFormula/>
    </>}
  </div>;
}
