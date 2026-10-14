import { employeesForYear, bangkokYear } from './phase1Core';
import type { SkillState } from './phase1Core';
import type { TrainingRequest } from './trainingCore';
import { sectionAssessment } from './skillAssessment';

export interface AnalyticsScope {year:number;department:string;onDuty:boolean}
const months=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const percent=(value:number,total:number)=>total?value/total*100:null;
export function managerAnalytics(state:SkillState,training:TrainingRequest[],scope:AnalyticsScope) {
  const roster=employeesForYear(state,scope.year);
  const employees=roster.filter(employee=>scope.department==='ALL'||employee.department===scope.department);
  const assessment=sectionAssessment(employees,scope.onDuty);
  const cells=assessment.people.flatMap(person=>person.rows.map(row=>({...row,employee:person.employee})));
  const levels=[0,1,2,3].map(level=>({level,count:cells.filter(cell=>cell.level===level).length}));
  const independent=levels[2].count+levels[3].count;
  const departments=assessment.departments.map(department=>{
    const rows=department.members.flatMap(member=>member.rows);
    const counts=[0,1,2,3].map(level=>rows.filter(row=>row.level===level).length);
    return {...department,cellCount:rows.length,level0:percent(counts[0],rows.length)??0,level1:percent(counts[1],rows.length)??0,level2:percent(counts[2],rows.length)??0,level3:percent(counts[3],rows.length)??0,readiness:percent(counts[2]+counts[3],rows.length)};
  });
  const types=[...new Set(cells.map(cell=>cell.type))].sort().map(type=>{
    const rows=cells.filter(cell=>cell.type===type);
    const total=rows.reduce((sum,row)=>sum+row.level,0);
    return {type:`Type ${type}`,count:rows.length,average:rows.length?total/rows.length:0,total,independent:rows.filter(row=>row.level>=2).length};
  });
  const coverage=[...new Set(cells.map(cell=>cell.key))].map(key=>{
    const rows=cells.filter(cell=>cell.key===key);
    const independent=rows.filter(row=>row.level>=2).length;
    const trainers=rows.filter(row=>row.level===3).length;
    const priority=independent===0?0:independent===1?1:trainers===0?2:3;
    return {key,wiCode:rows[0].wiCode,wiName:rows[0].wiName,type:rows[0].type,department:rows[0].employee.department,people:rows.length,independent,trainers,priority,label:priority===0?'ยังไม่มีคนทำได้เอง':priority===1?'พึ่งพาพนักงานคนเดียว':priority===2?'ยังไม่มีผู้สอน':'มีผู้ทำได้เองหลายคนและมีผู้สอน'};
  }).sort((a,b)=>a.priority-b.priority||a.independent-b.independent||a.key.localeCompare(b.key));
  const trend=Array.from({length:4},(_,index)=>scope.year-3+index).map(year=>{
    const people=employeesForYear(state,year).filter(employee=>scope.department==='ALL'||employee.department===scope.department);
    const summary=sectionAssessment(people,scope.onDuty);
    return {year:String(year),average:people.length&&summary.maximum?summary.averagePerPerson:null,people:people.length,total:people.length&&summary.maximum?summary.total:null};
  });
  const previous=trend[trend.length-2];
  const growth=employees.length&&assessment.maximum&&previous.average!==null?assessment.averagePerPerson-previous.average:null;
  const cohort=training.filter(request=>bangkokYear(new Date(request.submittedAt))===scope.year&&(scope.department==='ALL'||request.department===scope.department));
  const trainingStages=[
    {stage:'รอหัวหน้าตรวจ',count:cohort.filter(r=>r.status==='requested').length,color:'#f59e0b'},
    {stage:'รออบรม / ประเมิน',count:cohort.filter(r=>r.status==='scheduled').length,color:'#38bdf8'},
    {stage:'รอผู้จัดการรับรอง',count:cohort.filter(r=>r.status==='pending-manager').length,color:'#6366f1'},
    {stage:'รับรองแล้ว',count:cohort.filter(r=>r.status==='approved').length,color:'#10b981'},
    {stage:'ไม่ผ่าน / ไม่รับรอง',count:cohort.filter(r=>['rejected-chief','rejected-manager','failed'].includes(r.status)).length,color:'#ef4444'},
  ];
  const requests=state.adjustments.filter(request=>request.year===scope.year&&(scope.department==='ALL'||roster.find(employee=>employee.id===request.employeeId)?.department===scope.department));
  const monthly=months.map((month,index)=>{
    const items=requests.filter(request=>Number(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Bangkok',month:'2-digit'}).format(new Date(request.submittedAt)))===index+1);
    return {month,pending:items.filter(item=>item.status==='pending').length,approved:items.filter(item=>item.status==='approved').length,rejected:items.filter(item=>item.status==='rejected').length};
  });
  return {scope,employees,assessment,cells:cells.length,levels,departments,types,coverage,risk:coverage.filter(row=>row.priority<3),trend,growth,readiness:percent(independent,cells.length),independent,unassigned:assessment.people.filter(person=>!person.rows.length).length,trainingTotal:cohort.length,trainingStages,monthly,pendingSkills:requests.filter(request=>request.status==='pending').length,pendingTraining:cohort.filter(request=>request.status==='pending-manager').length,requestTotal:requests.length};
}
