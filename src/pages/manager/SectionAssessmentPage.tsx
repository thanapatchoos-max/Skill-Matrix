import { useState } from 'react';
import { FilterBar } from '../../components/FilterBar';
import { Building2, Users } from 'lucide-react';
import { bangkokYear, employeesForYear, SKILL_DEPARTMENTS } from '../../data/phase1Core';
import { useSkillState } from '../../data/phase1Store';
import { sectionAssessment } from '../../data/skillAssessment';
import type { ScoreAssessmentScope } from '../../data/skillAssessment';
import { employeeTeam } from '../../data/teamScope';
import { downloadCsv } from '../../lib/phase1Export';
import { sectionReport } from '../../lib/assessmentReport';
import { EmptyState, Field, inputClass } from '../../components/Phase1Shared';
import { AssessmentFormula, AssessmentHeader, AssessmentMetric, ScoreProgress } from '../../components/AssessmentShared';
import { assessmentPanel, scoreText } from '../../lib/assessmentFormat';
import { Avatar } from '../../components/Avatar';

export default function SectionAssessmentPage({initialScope}:{initialScope?:ScoreAssessmentScope}) {
  const state=useSkillState();const currentYear=bangkokYear();
  const [year,setYear]=useState(initialScope?.year??currentYear);
  const [department,setDepartment]=useState(initialScope?.department??'ALL');
  const employees=employeesForYear(state,year).filter(employee=>department==='ALL'||employee.department===department);
  const result=sectionAssessment(employees);
  const types=[...new Set(result.departments.flatMap(group=>group.types.map(type=>type.type)))].sort();
  function exportResult(){downloadCsv(`section-assessment-${year}.csv`,[['รายงาน','ประเมินคะแนนรายแผนก'],['ปี',year],['ขอบเขต',department==='ALL'?'ทุกแผนก':department],['แผนก','จำนวนพนักงาน',...types.map(type=>`Type ${type}`),'ผลรวมคะแนน','คะแนนเต็ม','คะแนนเฉลี่ยต่อคน','สัดส่วนคะแนนเต็ม (%)'],...result.departments.map(group=>[group.department,group.people,...types.map(type=>group.types.find(item=>item.type===type)?.total??''),group.total,group.maximum,group.averagePerPerson.toFixed(2),scoreText(group.scorePercent,1)]),['รวม',employees.length,...types.map(type=>result.departments.reduce((sum,group)=>sum+(group.types.find(item=>item.type===type)?.total??0),0)),result.total,result.maximum,result.averagePerPerson.toFixed(2),scoreText(result.scorePercent,1)],[],['รหัสพนักงาน','ชื่อ','แผนก','ทีม',...types.map(type=>`Type ${type}`),'คะแนนรวมรายบุคคล','คะแนนเต็ม','คะแนนเฉลี่ยต่อสกิล (0–3)','สัดส่วนคะแนนเต็ม (%)'],...result.people.map(person=>[person.employee.id,person.employee.name,person.employee.department,employeeTeam(person.employee)?.name??'ไม่ระบุทีม',...types.map(type=>person.types.find(item=>item.type===type)?.total??''),person.total,person.maximum,scoreText(person.averagePerSkill),scoreText(person.scorePercent,1)])]);}
  return <div className="assessment-report space-y-6">
    <AssessmentHeader title="ประเมินคะแนนรายแผนก" description="ดูรายชื่อและคะแนนของพนักงานในแต่ละแผนก พร้อมยอดรวมและคะแนนเฉลี่ยต่อคน เพื่อประกอบการประเมินภาพรวมของทีม" year={year} filename={`section-assessment-${department==='ALL'?'ALL':department.replaceAll(' ','-')}-${year}.pdf`} definition={()=>sectionReport(result,year,department)} onCsv={exportResult} disabled={!employees.length||!result.maximum}/>
    <FilterBar title="ขอบเขตการประเมินรายแผนก" onReset={()=>{setYear(currentYear);setDepartment('ALL');}} footer={<p className="flex items-center gap-2 text-xs text-slate-500"><Users size={15}/>{employees.length} คนในขอบเขตที่เลือก</p>}>
      <Field label="ปีประเมิน"><select className={inputClass} value={year} onChange={event=>setYear(Number(event.target.value))}>{Array.from({length:4},(_,index)=>currentYear-index).map(value=><option key={value}>{value}</option>)}</select></Field>
      <Field label="แผนกที่ประเมิน"><select className={inputClass} value={department} onChange={event=>setDepartment(event.target.value)}><option value="ALL">ทุกแผนก</option>{SKILL_DEPARTMENTS.map(value=><option key={value}>{value}</option>)}</select></Field>
    </FilterBar>
    {!employees.length?<EmptyState>ไม่มีข้อมูลคะแนนสำหรับปีหรือแผนกที่เลือก</EmptyState>:<>
      <section className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-900">{department==='ALL'?'ภาพรวมทุกแผนก':department}</h2><p className="mt-1 text-xs text-slate-500">ปีประเมิน {year} · {result.departments.length} แผนก · อ้างอิงคะแนนที่ยืนยันแล้ว</p></div>{department!=='ALL'&&<button onClick={()=>setDepartment('ALL')} className="text-sm font-semibold text-blue-700 print:hidden">ดูทุกแผนก</button>}</section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AssessmentMetric label="ผลรวมคะแนนแผนกที่เลือก" value={result.total} note={`จากคะแนนเต็มรวม ${result.maximum} คะแนน`} accent/>
        <AssessmentMetric label="คะแนนเฉลี่ยต่อคน" value={result.averagePerPerson.toFixed(2)} note={`${result.total} คะแนน ÷ ${employees.length} คน · หน่วยคะแนน/คน`}/>
        <AssessmentMetric label="พนักงานในขอบเขตประเมิน" value={employees.length} note={`${result.departments.length} แผนก · แสดงรายชื่อทุกคนด้านล่าง`}/>
        <AssessmentMetric label="สัดส่วนคะแนนเต็ม" value={result.scorePercent===null?'—':`${scoreText(result.scorePercent,1)}%`} note="อ่านคู่กับคะแนนรวมเมื่อจำนวนสกิลต่างกัน"/>
      </div>
      {result.departments.length>1&&<section className={`${assessmentPanel} assessment-summary p-5`}><div className="mb-4"><h2 className="font-bold text-slate-900">เปรียบเทียบคะแนนแต่ละแผนก</h2><p className="mt-1 text-xs leading-5 text-slate-500">จำนวนงานและสกิลแต่ละแผนกอาจต่างกัน · เลือกแผนกเพื่อดูเฉพาะรายชื่อพนักงาน</p></div><div className="grid gap-3 lg:grid-cols-3">{result.departments.map(group=><button key={group.department} onClick={()=>setDepartment(group.department)} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"><p className="flex items-center gap-2 text-sm font-bold text-slate-800"><Building2 size={16}/>{group.department}</p><p className="my-3 text-xs text-slate-500">{group.people} คน · รวม {group.total} / {group.maximum}</p><ScoreProgress total={group.total} maximum={group.maximum}/><p className="mt-3 text-sm font-bold text-blue-800">{group.averagePerPerson.toFixed(2)} <span className="text-xs font-normal text-slate-500">คะแนนเฉลี่ยต่อคน</span></p></button>)}</div></section>}
      {result.departments.map(group=><section key={group.department} className={`${assessmentPanel} assessment-department overflow-hidden`} data-assessment-department={group.department}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/70 p-5"><div><h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><Building2 size={20} className="text-blue-700"/>{group.department}</h2><p className="mt-1 text-xs text-slate-500">รายชื่อพนักงานในแผนก · {group.people} คน · ปี {year}</p></div><div className="flex flex-wrap gap-6"><div><p className="text-xs text-slate-500">ผลรวมคะแนนแผนก</p><p className="mt-1 text-xl font-bold text-blue-900">{group.total} <span className="text-sm font-normal text-slate-400">/ {group.maximum}</span></p></div><div><p className="text-xs text-slate-500">คะแนนเฉลี่ยต่อคนของแผนก</p><p className="mt-1 text-xl font-bold text-blue-900">{group.averagePerPerson.toFixed(2)} <span className="text-xs font-normal text-slate-400">คะแนน/คน</span></p></div></div></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="min-w-60 px-5 py-3">พนักงาน / ทีม</th>{group.types.map(type=><th key={type.type} className="whitespace-nowrap px-3 py-3 text-right">Type {type.type}</th>)}<th className="whitespace-nowrap px-4 py-3 text-right">รวม / เต็ม</th><th className="whitespace-nowrap px-4 py-3 text-right">เฉลี่ย / สกิล</th><th className="min-w-40 px-5 py-3">สัดส่วนคะแนน</th></tr></thead>
          <tbody>{group.members.map(person=><tr key={person.employee.id} data-assessment-employee={person.employee.id} className="border-t border-slate-100 hover:bg-slate-50/50"><td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar src={person.employee.avatarUrl} name={person.employee.name} size="sm"/><div><p className="font-semibold text-slate-800">{person.employee.name}</p><p className="mt-0.5 text-xs text-slate-400">{person.employee.id} · {employeeTeam(person.employee)?.name??'ไม่ระบุทีม'}</p></div></div></td>{group.types.map(type=><td key={type.type} className="px-3 py-4 text-right text-slate-600">{person.types.find(item=>item.type===type.type)?.total??'—'}</td>)}<td className="px-4 py-4 text-right font-bold text-blue-900">{person.total} <span className="text-xs font-normal text-slate-400">/ {person.maximum}</span></td><td className="px-4 py-4 text-right font-semibold">{scoreText(person.averagePerSkill)}</td><td className="px-5 py-4"><ScoreProgress total={person.total} maximum={person.maximum}/></td></tr>)}</tbody>
          <tfoot className="border-t border-blue-100 bg-blue-50 font-bold text-blue-900"><tr><td className="px-5 py-4">รวม {group.people} คน</td>{group.types.map(type=><td key={type.type} className="px-3 py-4 text-right">{type.total}</td>)}<td className="px-4 py-4 text-right">{group.total} / {group.maximum}</td><td className="px-4 py-4 text-right">{scoreText(group.averagePerSkill)}</td><td className="px-5 py-4">{scoreText(group.scorePercent,1)}%</td></tr></tfoot>
        </table></div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-blue-100 bg-blue-50/40 px-5 py-4 text-xs text-blue-900"><p><strong>คะแนนเฉลี่ยต่อคน:</strong> {group.total} ÷ {group.people} = <strong>{group.averagePerPerson.toFixed(2)} คะแนน/คน</strong></p><p>เฉลี่ยต่อสกิลในแถวรวม = คะแนนรวม ÷ จำนวนสกิลของพนักงานทั้งหมด</p></div>
      </section>)}
      <AssessmentFormula section/>
      <p className="text-xs leading-6 text-slate-500 print:hidden">รายงาน PDF จัดแผนกและรายชื่อพนักงานเป็นส่วนชัดเจน พร้อมยอดรวม คะแนนเฉลี่ย และเลขหน้าครบทุกหน้า</p>
    </>}
  </div>;
}
