const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {load}=require('./test-source-loader.cjs');
const core=load(path.resolve('src/data/phase1Core.ts'));
const {individualAssessment,sectionAssessment}=load(path.resolve('src/data/skillAssessment.ts'));
const {managerAnalytics}=load(path.resolve('src/data/managerAnalytics.ts'));
const now=new Date('2026-10-14T04:00:00Z');
function person(id,a,b){return {id,name:id,role:'Staff',position:'Inspector',department:'QC Section',scores:{'QCW001-001_A':a,'QCW001-001_B':b},assignedSkills:['QCW001-001_A','QCW001-001_B']};}
function state(){return {version:1,snapshots:[{year:2026,employees:[person('EMP001',2,3),person('EMP011',1,0)]}],adjustments:[]};}
const scope={year:2026,department:'ALL',onDuty:true};

test('assessment sums only applicable W/I Types and department averages use people as denominator',()=>{
  const individual=individualAssessment(person('EMP001',2,3));
  assert.equal(individual.total,5);
  assert.equal(individual.maximum,individual.rows.length*3);
  assert.equal(individual.types.reduce((sum,type)=>sum+type.total,0),individual.total);
  assert.ok(!individual.rows.some(row=>row.wiCode==='QCW002-001'&&row.type==='A'));
  const section=sectionAssessment(state().snapshots[0].employees);
  assert.equal(section.total,6);assert.equal(section.averagePerPerson,3);
  assert.equal(section.departments[0].total,6);assert.equal(section.departments[0].people,2);
  assert.equal(section.departments.reduce((sum,item)=>sum+item.total,0),section.total);
});
test('assessment averages keep score/person distinct from skill-level average and handle empty skills',()=>{
  const employee=person('EMP001',2,3);const individual=individualAssessment(employee,true);
  assert.equal(individual.averagePerSkill,2.5);assert.equal(individual.scorePercent,5/6*100);
  assert.equal(individual.jobs.reduce((sum,job)=>sum+job.total,0),individual.total);
  assert.equal(individual.types.reduce((sum,type)=>sum+type.count,0),individual.rows.length);
  const summary=sectionAssessment([employee,person('EMP011',1,0)],true);
  assert.equal(summary.averagePerPerson,3);assert.equal(summary.averagePerSkill,1.5);assert.equal(summary.scorePercent,50);
  assert.equal(summary.departments[0].averagePerSkill,1.5);
  const empty=individualAssessment({...employee,assignedSkills:[]},true);
  assert.equal(empty.averagePerSkill,null);assert.equal(empty.scorePercent,null);
});
test('dashboard level counts, normalized readiness and score/person remain distinct',()=>{
  const initial=state();const before=structuredClone(initial);const data=managerAnalytics(initial,[],scope);
  assert.equal(data.cells,4);assert.equal(data.independent,2);assert.equal(data.readiness,50);
  assert.deepEqual(data.levels.map(level=>level.count),[1,1,1,1]);
  assert.equal(data.assessment.total,6);assert.equal(data.assessment.averagePerPerson,3);
  assert.equal(data.departments[0].level0+data.departments[0].level1+data.departments[0].level2+data.departments[0].level3,100);
  assert.deepEqual(data.types.map(type=>type.average),[1.5,1.5]);
  assert.ok(managerAnalytics(initial,[],{...scope,onDuty:false}).cells>4);
  assert.deepEqual(initial,before);
});
test('pending proposals do not affect evaluation; manager confirmation updates both summaries and graphs',()=>{
  const pending=core.proposeAdjustment(state(),'chief','EMP001',{'QCW001-001_A':3},'ยกระดับทักษะ','EVAL-001',now);
  const waiting=managerAnalytics(pending,[],scope);
  assert.equal(waiting.assessment.total,6);assert.equal(waiting.pendingSkills,1);assert.equal(waiting.monthly[9].pending,1);
  const approved=core.reviewAdjustment(pending,'manager',pending.adjustments[0].id,'approved','ยืนยัน',now);
  const confirmed=managerAnalytics(approved,[],scope);
  assert.equal(confirmed.assessment.total,7);assert.equal(confirmed.pendingSkills,0);assert.equal(confirmed.monthly[9].approved,1);
  assert.equal(confirmed.levels[3].count,2);
});
test('coverage distinguishes missing independent staff, reliance on one person and missing trainers',()=>{
  const critical=managerAnalytics({...state(),snapshots:[{year:2026,employees:[person('EMP001',0,0),person('EMP011',0,0)]}]},[],scope);
  assert.ok(critical.risk.every(row=>row.priority===0&&row.independent===0));
  const single=managerAnalytics(state(),[],scope);assert.ok(single.risk.every(row=>row.priority===1));
  const noTrainers=managerAnalytics({...state(),snapshots:[{year:2026,employees:[person('EMP001',2,2),person('EMP011',2,2)]}]},[],scope);
  assert.ok(noTrainers.risk.every(row=>row.priority===2&&row.trainers===0));
  const covered=managerAnalytics({...state(),snapshots:[{year:2026,employees:[person('EMP001',3,2),person('EMP011',2,3)]}]},[],scope);
  assert.equal(covered.risk.length,0);assert.equal(covered.readiness,100);
});
test('historical gaps stay empty; empty or unassigned scopes never produce NaN or fake trend values',()=>{
  const initial=state();const data=managerAnalytics(initial,[],scope);
  assert.deepEqual(data.trend.map(point=>point.average),[null,null,null,3]);assert.equal(data.growth,null);
  const historical={...initial,snapshots:[{year:2025,employees:[person('EMP001',1,0),person('EMP011',1,0)]},...initial.snapshots]};
  assert.equal(managerAnalytics(historical,[],scope).growth,2);
  const empty=managerAnalytics(initial,[],{...scope,department:'Production'});
  assert.equal(empty.cells,0);assert.equal(empty.readiness,null);assert.equal(empty.risk.length,0);
  const unassigned=managerAnalytics({...initial,snapshots:[{year:2026,employees:[{...person('EMP001',2,3),assignedSkills:[]}]}]},[],scope);
  assert.equal(unassigned.cells,0);assert.equal(unassigned.unassigned,1);assert.equal(unassigned.readiness,null);
  assert.ok(unassigned.trend.every(point=>point.average===null));assert.equal(unassigned.growth,null);
});
test('training counts follow submission-year cohort and department; month chart uses request month',()=>{
  const requests=[
    {id:'T1',department:'QC Section',submittedAt:'2026-10-01T04:00:00Z',status:'requested'},
    {id:'T2',department:'Production',submittedAt:'2026-10-01T04:00:00Z',status:'pending-manager'},
    {id:'T3',department:'QC Section',submittedAt:'2025-10-01T04:00:00Z',status:'approved'},
    {id:'T4',department:'QC Section',submittedAt:'2026-12-31T18:00:00Z',status:'requested'},
  ];
  const all=managerAnalytics(state(),requests,scope);assert.equal(all.trainingTotal,2);assert.equal(all.pendingTraining,1);
  const qc=managerAnalytics(state(),requests,{...scope,department:'QC Section'});assert.equal(qc.trainingTotal,1);assert.equal(qc.pendingTraining,0);
  const next=managerAnalytics(state(),requests,{...scope,year:2027});assert.equal(next.trainingTotal,1);
  const proposed=core.proposeAdjustment(state(),'chief','EMP001',{'QCW001-001_A':3},'เหตุผล','',new Date('2026-09-15T04:00:00Z'));
  const approved=core.reviewAdjustment(proposed,'manager',proposed.adjustments[0].id,'approved','',now);
  const chart=managerAnalytics(approved,[],scope);assert.equal(chart.monthly[8].approved,1);assert.equal(chart.monthly[9].approved,0);
});
