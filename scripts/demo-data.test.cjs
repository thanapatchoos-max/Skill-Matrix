const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { load } = require('./test-source-loader.cjs');
const core = load(path.resolve('src/data/phase1Core.ts'));
const demo = load(path.resolve('src/data/demoData.ts'));
const training = load(path.resolve('src/data/trainingCore.ts'));
const { chiefAnalytics } = load(path.resolve('src/data/chiefAnalytics.ts'));
const now = new Date('2026-10-14T04:00:00Z');

test('demo migration supplies four populated years and actionable skill approvals without changing current scores', () => {
  const saved = core.initialState();
  const before = core.employeesForYear(saved, 2026);
  const populated = demo.populateSkillDemo(saved, now);
  assert.deepEqual(core.employeesForYear(populated, 2026).filter(employee=>before.some(original=>original.id===employee.id)), before);
  assert.equal(core.employeesForYear(populated, 2026).length, before.length + 2);
  for (const year of [2023, 2024, 2025, 2026]) assert.ok(core.employeesForYear(populated, year).length > 0);
  assert.ok(core.sectionSummary(core.employeesForYear(populated, 2023)).total < core.sectionSummary(before).total);
  for (const request of populated.adjustments.filter(a => a.status === 'pending')) {
    const reviewed = core.reviewAdjustment(populated, 'manager', request.id, 'approved', 'ตรวจแล้ว', now);
    assert.equal(core.employeesForYear(reviewed, 2026).find(e => e.id === request.employeeId).scores[request.changes[0].key], request.changes[0].after);
  }
  assert.equal(demo.populateSkillDemo(populated, now), populated);
  assert.deepEqual(saved.adjustments, []);
});

test('existing user edits, snapshots and decisions survive migration and reload', () => {
  let saved = core.proposeAdjustment(core.initialState(), 'chief', 'EMP001', { 'QCW001-001_A': 2 }, 'ข้อมูลผู้ใช้', 'DOC-USER', now);
  saved = core.reviewAdjustment(saved, 'manager', saved.adjustments[0].id, 'approved', 'ยืนยัน', now);
  saved.snapshots.push({ year: 2025, employees: [{ ...core.employeesForYear(saved, 2026)[0], name: 'ชื่อประวัติเดิม' }] });
  const before = core.employeesForYear(saved, 2026);
  const populated = demo.populateSkillDemo(saved, now);
  assert.deepEqual(core.employeesForYear(populated, 2026).filter(employee=>before.some(original=>original.id===employee.id)), before);
  const originalHistory = saved.snapshots.find(s => s.year === 2025);
  assert.deepEqual(populated.snapshots.find(s => s.year === 2025).employees.filter(employee=>originalHistory.employees.some(original=>original.id===employee.id)), originalHistory.employees);
  assert.deepEqual(populated.adjustments.find(a => a.id === saved.adjustments[0].id), saved.adjustments[0]);
  const reloaded = JSON.parse(JSON.stringify(populated));
  assert.equal(demo.populateSkillDemo(reloaded, now), reloaded);
});

test('training examples cover every status, valid department skills and immediately usable actions', () => {
  const records = demo.trainingDemo(now);
  assert.equal(new Set(records.map(r => r.status)).size, Object.keys(training.TRAINING_STATUS).length);
  for (const r of records) {
    const wi = core.SKILL_WIS.find(w => w.code === r.wiCode);
    assert.equal(wi.department, r.department);
    assert.ok(wi.types.some(type => type.code === r.skillType));
    if (['pending-manager', 'approved', 'rejected-manager'].includes(r.status)) assert.ok(r.theoryScore >= 80 && r.practicalScore >= 80 && r.evaluationNote);
  }
  const scheduled = records.find(r => r.status === 'scheduled' && r.scheduledDate <= training.bangkokDate(now));
  assert.equal(training.evaluateTraining(records, 'chief', scheduled.id, 85, 90, 'หลักฐานใหม่', now).find(r => r.id === scheduled.id).status, 'pending-manager');
  const pending = records.find(r => r.status === 'pending-manager');
  assert.equal(training.certifyTraining(records, 'manager', pending.id, true, '', now).find(r => r.id === pending.id).status, 'approved');
  assert.doesNotThrow(() => training.requestTraining(records, 'staff', { wiCode: 'QCW001-001', skillType: 'A', desiredDate: '2026-10-14', reason: 'ทดลองคำขอใหม่' }, now));
});

test('training migration keeps processed examples and avoids duplicate active skill requests', () => {
  const example = demo.trainingDemo(now)[0];
  const saved = training.reviewTrainingRequest([example], 'chief', example.id, false, '', 'เหตุผลเดิม', now);
  const custom = { ...example, id: 'TR-USER', wiCode: 'QCW004-001', status: 'requested' };
  const merged = demo.populateTrainingDemo([...saved, custom], now);
  assert.deepEqual(merged.find(r => r.id === example.id), saved[0]);
  assert.equal(merged.filter(r => r.employeeId === custom.employeeId && r.wiCode === custom.wiCode && r.skillType === custom.skillType && ['requested', 'scheduled', 'pending-manager'].includes(r.status)).length, 1);
  assert.deepEqual(demo.populateTrainingDemo(merged, now), merged);
});

test('Chief graphs use only the Chief department, split due/upcoming work and follow live decisions', () => {
  const state = demo.populateSkillDemo(undefined, now);
  const records = demo.trainingDemo(now);
  const data = chiefAnalytics(state, records, now);
  assert.ok(data.employees.every(e => e.department === core.ACTORS.chief.department));
  assert.deepEqual(data.employees.map(e=>e.id),['EMP001','EMP004','EMP011']);
  assert.equal(data.trend.length, 4);
  assert.ok(data.trend.every(row => row.average !== null));
  assert.equal(data.awaitingReview.length, 2);
  assert.equal(data.readyToEvaluate.length, 1);
  assert.equal(data.upcoming.length, 1);
  assert.ok(data.people.every(person => person.needsTraining + person.independent + person.trainers === data.assessment.people.find(p => p.employee.id === person.id).rows.length));
  const reviewed = training.reviewTrainingRequest(records, 'chief', data.awaitingReview[0].id, true, training.bangkokDate(now), '', now);
  const next = chiefAnalytics(state, reviewed, now);
  assert.equal(next.awaitingReview.length, 1);
  assert.equal(next.readyToEvaluate.length, 2);
  assert.equal(next.cells, data.cells);
});

test('job report permissions follow the supervisor, including a different team in the same department', () => {
  const {jobReportEmployees}=load(path.resolve('src/data/teamScope.ts'));
  const state=demo.populateSkillDemo(undefined,now);
  for(const year of [2023,2024,2025,2026]){
    const roster=core.employeesForYear(state,year);
    assert.deepEqual(jobReportEmployees(roster,'chief').map(employee=>employee.id),['EMP001','EMP004','EMP011']);
    assert.ok(jobReportEmployees(roster,'manager').length>=11);
    assert.deepEqual(jobReportEmployees(roster,'manager','QC Section','QC-B').map(employee=>employee.id),['EMP012','EMP013']);
    for(const department of ['Production','Engineering'])assert.ok(jobReportEmployees(roster,'manager',department).length>=2);
    assert.deepEqual(jobReportEmployees(roster,'chief','QC Section','QC-B'),[]);
    assert.deepEqual(jobReportEmployees(roster,'chief','ALL','ALL','EMP012'),[]);
    assert.deepEqual(jobReportEmployees(roster,'chief','Production'),[]);
    assert.deepEqual(jobReportEmployees(roster,'unknown'),[]);
  }
  const roster=core.employeesForYear(state,2026);
  const reassigned=roster.map(employee=>employee.id==='EMP001'?{...employee,supervisorId:'EMP-C02'}:employee);
  assert.ok(!jobReportEmployees(reassigned,'chief').some(employee=>employee.id==='EMP001'));
  const stranger={...roster[0],id:'NEW-QC',supervisorId:undefined,teamId:undefined};
  assert.deepEqual(jobReportEmployees([stranger],'chief'),[]);
  const unauthorized={...state,snapshots:[{year:2026,employees:reassigned}]};
  assert.throws(()=>core.proposeAdjustment(unauthorized,'chief','EMP001',{'QCW001-001_A':1},'ทดสอบ','',now));
});

test('team metadata migration adds missing demo relationships once and preserves existing overrides', () => {
  const state=demo.populateSkillDemo(undefined,now);
  const legacy=structuredClone(state);delete legacy.teamDemoRevision;
  for(const snapshot of legacy.snapshots){snapshot.employees=snapshot.employees.filter(employee=>!['EMP012','EMP013'].includes(employee.id));for(const employee of snapshot.employees){delete employee.teamId;delete employee.supervisorId;}}
  const custom=legacy.snapshots.find(snapshot=>snapshot.year===2026).employees.find(employee=>employee.id==='EMP004');
  custom.supervisorId='EMP-C99';custom.teamId='CUSTOM';custom.name='ชื่อที่ผู้ใช้แก้ไข';
  const migrated=demo.populateSkillDemo(legacy,now);
  const current=core.employeesForYear(migrated,2026);
  assert.deepEqual(current.find(employee=>employee.id==='EMP004'),custom);
  assert.equal(current.find(employee=>employee.id==='EMP001').supervisorId,'EMP-C01');
  assert.equal(current.filter(employee=>employee.teamId==='QC-B').length,2);
  assert.equal(demo.populateSkillDemo(migrated,now),migrated);
});
