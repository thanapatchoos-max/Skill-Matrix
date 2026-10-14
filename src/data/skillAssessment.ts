import { SKILL_WIS } from './phase1Core';
import type { Employee } from './phase1Core';

export interface ScoreAssessmentScope {year:number;department:string}

export function individualAssessment(employee: Employee, onDuty = false) {
  const rows = SKILL_WIS.filter(wi => wi.department === employee.department).flatMap(wi =>
    wi.types.map(type => ({key:`${wi.code}_${type.code}`,wiCode:wi.code,wiName:wi.name,type:type.code,typeName:type.label,level:employee.scores[`${wi.code}_${type.code}`] ?? 0}))
  ).filter(row => !onDuty || employee.assignedSkills.includes(row.key));
  const total = rows.reduce((sum,row) => sum + row.level,0);
  const maximum = rows.length * 3;
  const types = [...new Set(rows.map(row => row.type))].sort().map(type => {
    const cells=rows.filter(row=>row.type===type);const total=cells.reduce((sum,row)=>sum+row.level,0);
    return {type,total,maximum:cells.length*3,count:cells.length,averagePerSkill:cells.length?total/cells.length:null};
  });
  const jobs=[...new Set(rows.map(row=>row.wiCode))].map(wiCode=>{
    const skills=rows.filter(row=>row.wiCode===wiCode);
    return {wiCode,wiName:skills[0].wiName,skills,total:skills.reduce((sum,row)=>sum+row.level,0),maximum:skills.length*3};
  });
  return {employee,rows,total,maximum,types,jobs,averagePerSkill:rows.length?total/rows.length:null,scorePercent:maximum?total/maximum*100:null};
}

export function sectionAssessment(employees: Employee[], onDuty = false) {
  const people = employees.map(employee => individualAssessment(employee,onDuty));
  const departments = [...new Set(employees.map(employee=>employee.department))].map(department => {
    const members = people.filter(person=>person.employee.department===department);
    const total = members.reduce((sum,person)=>sum+person.total,0);
    const maximum = members.reduce((sum,person)=>sum+person.maximum,0);
    const typeCodes = [...new Set(members.flatMap(person=>person.types.map(type=>type.type)))].sort();
    const types = typeCodes.map(type=>({type,total:members.reduce((sum,person)=>sum+(person.types.find(item=>item.type===type)?.total??0),0),maximum:members.reduce((sum,person)=>sum+(person.types.find(item=>item.type===type)?.maximum??0),0)}));
    return {department,members,people:members.length,total,maximum,averagePerPerson:members.length?total/members.length:0,types,averagePerSkill:maximum?total/(maximum/3):null,scorePercent:maximum?total/maximum*100:null};
  });
  const total=people.reduce((sum,person)=>sum+person.total,0);
  const maximum=people.reduce((sum,person)=>sum+person.maximum,0);
  return {people,departments,total,maximum,averagePerPerson:employees.length?total/employees.length:0,averagePerSkill:maximum?total/(maximum/3):null,scorePercent:maximum?total/maximum*100:null};
}
