const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const cache = new Map();
function load(file) {
  file = path.resolve(__dirname, '../src/data', file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = {exports:{}};
  cache.set(file,module);
  const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2023}}).outputText;
  new Function('require','exports','module',js)(name => load(path.resolve(path.dirname(file),name+'.ts')),module.exports,module);
  return module.exports;
}
const core=load('phase1Core.ts');
const now=new Date('2026-10-12T04:00:00Z');
const nextDay=new Date('2026-10-13T04:00:00Z');
const baseline=() => core.initialState();
const employee=state => core.employeesForYear(state,2026).find(e => e.id === 'EMP001');

test('PDF sum example and section average use sums per person, not mean per cell',() => {
  const e={...employee(baseline()),scores:{'QCW001-001_A':1,'QCW001-001_B':3,'QCW001-001_C':2,'QCW001-001_D':0,'QCW001-002_A':1,'QCW001-002_B':0}};
  assert.equal(core.sumSkills(e),7);
  const section=core.sectionSummary([e,{...e,id:'B'}]);
  assert.equal(section.total,14); assert.equal(section.averagePerPerson,7);
  assert.deepEqual(core.sectionSummary([]),{people:0,total:0,averagePerPerson:0});
});
test('pending changes never affect scores; approval replaces rather than adds',() => {
  const initial=baseline(); const before=core.sumSkills(employee(initial));
  const pending=core.proposeAdjustment(initial,'chief','EMP001',{'QCW001-001_A':1,'QCW001-001_B':3},'ประเมินประจำปี','DOC-001',now);
  assert.equal(core.sumSkills(employee(pending)),before);
  assert.equal(initial.adjustments.length,0);
  const approved=core.reviewAdjustment(pending,'manager',pending.adjustments[0].id,'approved','ตรวจสอบแล้ว',nextDay);
  assert.equal(employee(approved).scores['QCW001-001_A'],1);
  assert.equal(core.sumSkills(employee(approved)),before-1);
  assert.equal(approved.adjustments[0].reviewedBy,'EMP-M01');
  assert.throws(() => core.reviewAdjustment(approved,'manager',approved.adjustments[0].id,'approved','',nextDay));
});
test('reject retains existing values and records reason; can propose again',() => {
  const initial=baseline();
  const pending=core.proposeAdjustment(initial,'chief','EMP001',{'QCW001-001_A':0},'ประเมิน','',now);
  assert.throws(() => core.reviewAdjustment(pending,'manager',pending.adjustments[0].id,'rejected','',now));
  const rejected=core.reviewAdjustment(pending,'manager',pending.adjustments[0].id,'rejected','หลักฐานไม่เพียงพอ',now);
  assert.deepEqual(employee(rejected).scores,employee(initial).scores);
  assert.equal(core.proposeAdjustment(rejected,'chief','EMP001',{'QCW001-001_A':0},'ประเมินใหม่','',now).adjustments.length,2);
});
test('role, department, self review, range, W/I Type, no-op and duplicate checks',() => {
  for(const role of ['staff','manager','admin']) assert.throws(() => core.proposeAdjustment(baseline(),role,'EMP001',{'QCW001-001_A':2},'เหตุผล','',now));
  for(const id of ['EMP002','EMP003','EMP005','UNKNOWN']) assert.throws(() => core.proposeAdjustment(baseline(),'chief',id,{'QCW001-001_A':2},'เหตุผล','',now));
  for(const score of [-1,4,1.5,NaN]) assert.throws(() => core.proposeAdjustment(baseline(),'chief','EMP001',{'QCW001-001_A':score},'เหตุผล','',now));
  assert.throws(() => core.proposeAdjustment(baseline(),'chief','EMP001',{'QCW002-001_A':2},'เหตุผล','',now));
  assert.throws(() => core.proposeAdjustment(baseline(),'chief','EMP001',{'QCW001-001_A':3},'เหตุผล','',now));
  assert.throws(() => core.proposeAdjustment(baseline(),'chief','EMP001',{'QCW001-001_A':2},' ','',now));
  const pending=core.proposeAdjustment(baseline(),'chief','EMP001',{'QCW001-001_A':2},'เหตุผล','',now);
  assert.throws(() => core.proposeAdjustment(pending,'chief','EMP001',{'QCW001-001_A':1},'เหตุผล','',now));
  for(const role of ['chief','staff','admin']) assert.throws(() => core.reviewAdjustment(pending,role,pending.adjustments[0].id,'approved','',now));
  const stale=structuredClone(pending); stale.snapshots[0].employees.find(e=>e.id==='EMP001').scores['QCW001-001_A']=0;
  assert.throws(() => core.reviewAdjustment(stale,'manager',stale.adjustments[0].id,'approved','',now));
});
test('year history, carry forward and Bangkok year boundary',() => {
  const pending=core.proposeAdjustment(baseline(),'chief','EMP001',{'QCW001-001_A':2},'เหตุผล','',new Date('2027-02-01T00:00:00Z'));
  const approved=core.reviewAdjustment(pending,'manager',pending.adjustments[0].id,'approved','',new Date('2027-02-02T00:00:00Z'));
  assert.equal(employee(approved).scores['QCW001-001_A'],3);
  assert.equal(core.employeesForYear(approved,2027).find(e=>e.id==='EMP001').scores['QCW001-001_A'],2);
  assert.equal(core.employeesForYear(approved,2028).find(e=>e.id==='EMP001').scores['QCW001-001_A'],2);
  assert.deepEqual(core.employeesForYear(approved,2025),[]);
  assert.equal(core.bangkokYear(new Date('2026-12-31T17:00:00Z')),2027);
  assert.throws(() => core.reviewAdjustment(pending,'manager',pending.adjustments[0].id,'approved','',new Date('2028-01-01T00:00:00Z')));
});
test('W/I / Type / On-duty filters and role visibility',() => {
  const employees=core.employeesForYear(baseline(),2026);
  assert.equal(core.visibleEmployees(employees,'staff').length,1);
  assert.ok(core.visibleEmployees(employees,'chief').every(e=>e.department==='QC Section'));
  assert.deepEqual(core.skillKeys(employee(baseline()),'QCW002-001','A'),[]);
  assert.equal(core.skillKeys(employee(baseline()),'QCW001-001','A').length,1);
  const unassigned={...employee(baseline()),assignedSkills:['QCW001-001_A']};
  assert.equal(core.skillKeys(unassigned,'ALL','ALL',true).length,1);
});
test('employee maintenance cannot change approved scores; new staff start at zero',() => {
  const pending=core.proposeAdjustment(baseline(),'chief','EMP001',{'QCW001-001_A':1},'เหตุผล','',now);
  const approved=core.reviewAdjustment(pending,'manager',pending.adjustments[0].id,'approved','',now);
  const e=employee(approved);
  const saved=core.saveEmployeeProfile(approved,'admin',{id:e.id,name:'ชื่อใหม่',position:e.position,department:e.department,assignedSkills:[]},now);
  assert.deepEqual(employee(saved).scores,e.scores);
  const future=core.saveEmployeeProfile(approved,'admin',{id:e.id,name:'ชื่ออนาคต',position:e.position,department:e.department,assignedSkills:[]},new Date('2027-01-01T00:00:00Z'));
  assert.equal(employee(future).name,e.name);
  const added=core.saveEmployeeProfile(approved,'admin',{id:'NEW001',name:'พนักงานใหม่',position:'Inspector',department:'QC Section',assignedSkills:['QCW001-001_A']},now);
  assert.equal(core.sumSkills(core.employeesForYear(added,2026).find(e=>e.id==='NEW001')),0);
});
