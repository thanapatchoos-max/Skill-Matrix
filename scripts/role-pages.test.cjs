const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {load}=require('./test-source-loader.cjs');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const storage=new Map();
global.window={addEventListener(){}};
global.localStorage={getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)};
const nav=load(path.resolve('src/data/roleNavigation.ts'));
const training=load(path.resolve('src/data/trainingCore.ts'));
const core=load(path.resolve('src/data/phase1Core.ts'));
const Router=load(path.resolve('src/pages/RolePageRouter.tsx')).default;
const now=new Date('2026-10-14T04:00:00Z');
const form={wiCode:'QCW001-001',skillType:'A',desiredDate:'2026-10-14',reason:'พัฒนาการต่อวงจร'};

test('every page belongs to one role, and other roles cannot visit it',()=>{
  const ids=Object.values(nav.ROLE_PAGES).flatMap(pages=>pages.map(p=>p.id));
  assert.equal(new Set(ids).size,ids.length);
  for(const [role,pages] of Object.entries(nav.ROLE_PAGES)){
    assert.equal(nav.roleHome(role),pages[0].id);
    for(const page of pages)for(const other of Object.keys(nav.ROLE_PAGES))assert.equal(nav.roleCanVisit(page.id,other),role===other);
  }
  assert.equal(nav.roleCanVisit('staff-training-request','unknown'),false);
  assert.equal(nav.roleCanVisit('training','staff'),false);
});
test('all dedicated pages render with their own heading and no unknown-page fallback',()=>{
  for(const [role,pages] of Object.entries(nav.ROLE_PAGES))for(const page of pages){
    const html=renderToStaticMarkup(React.createElement(Router,{page:page.id,role,onNavigate(){}}));
    assert.ok(html.includes('<h1'),`${page.id} has no page heading`);
    assert.ok(html.includes(page.title),`${page.id} does not show its dedicated title`);
    assert.ok(!html.includes('ไม่พบหน้าที่เลือก'),page.id);
  }
});
test('staff request and chief decision show separate actions, while admin audit stays read-only',()=>{
  const render=(page,role)=>renderToStaticMarkup(React.createElement(Router,{page,role,onNavigate(){}}));
  const staff=render('staff-training-request','staff');
  assert.ok(staff.includes('ส่งคำขอฝึกอบรม'));assert.ok(!staff.includes('อนุมัติคำขอและนัดหมาย'));
  const chief=render('chief-training-requests','chief');
  assert.ok(chief.includes('อนุมัติคำขอและนัดหมาย'));assert.ok(!chief.includes('ส่งคำขอฝึกอบรม'));
  const audit=render('admin-training-audit','admin');assert.ok(!audit.includes('อนุมัติคำขอและนัดหมาย'));
  assert.ok(render('manager-skill-approvals','staff').includes('หน้านี้ไม่อยู่ในพื้นที่'));
});
test('score display pages stay separate from manager-only assessments and exports',()=>{
  const render=(page,role)=>renderToStaticMarkup(React.createElement(Router,{page,role,onNavigate(){}}));
  for(const id of ['manager-assessment-individual','manager-assessment-section']){
    assert.ok(nav.roleCanVisit(id,'manager'));
    for(const other of ['staff','chief','admin'])assert.equal(nav.roleCanVisit(id,other),false);
    assert.ok(render(id,'manager').includes('ส่งออก CSV'));
    assert.ok(render(id,'manager').includes('ผลรวมคะแนน'));
  }
  for(const [id,role] of [['chief-individual-scores','chief'],['chief-team-skills','chief'],['manager-individual-scores','manager'],['manager-section-skills','manager']]){
    const html=render(id,role);assert.ok(!html.includes('ส่งออก CSV'));assert.ok(!html.includes('ผลรวมคะแนน'));
  }
  assert.ok(render('chief-individual-scores','chief').includes('แก้ไขคะแนนแบบแมนนวล'));
  assert.ok(!render('manager-individual-scores','manager').includes('แก้ไขคะแนนแบบแมนนวล'));
});
test('staff sees only their own scores, with type subtotals and an overall total without a person filter',()=>{
  const html=renderToStaticMarkup(React.createElement(Router,{page:'staff-my-skills',role:'staff',onNavigate(){}}));
  const state=JSON.parse(storage.get('daihen.skill-matrix.phase1.v1'));
  const employee=core.employeesForYear(state,core.bangkokYear()).find(person=>person.id===core.ACTORS.staff.employeeId);
  const assessment=load(path.resolve('src/data/skillAssessment.ts')).individualAssessment(employee);
  assert.ok(html.includes('ดูคะแนนของฉัน'));
  assert.ok(!html.includes('>พนักงาน</label>'));
  assert.ok(!html.includes('นายสมศักดิ์ มั่นคง'));
  assert.ok(!html.includes('ส่งออก CSV'));
  assert.ok(!html.includes('แก้ไขคะแนนแบบแมนนวล'));
  assert.ok(html.includes(`${assessment.total} / ${assessment.maximum}`));
  for(const type of assessment.types){
    assert.ok(html.includes(`data-type-total="${type.type}"`));
    assert.ok(html.includes(`${type.total} / ${type.maximum}`));
  }
  assert.ok(html.includes('data-score-total'));
});
test('assessment opened from the dashboard keeps its selected year and department',()=>{
  const historical=renderToStaticMarkup(React.createElement(Router,{page:'manager-assessment-section',role:'manager',assessmentScope:{year:2025,department:'QC Section'},onNavigate(){}}));
  assert.ok(historical.includes('นายสมชาย ใจดี'));
  assert.ok(historical.includes('ปีประเมิน 2025'));
  assert.ok(!historical.includes('ไม่มีข้อมูลคะแนนสำหรับปีหรือแผนกที่เลือก'));
  const production=renderToStaticMarkup(React.createElement(Router,{page:'manager-assessment-individual',role:'manager',assessmentScope:{year:2026,department:'Production'},onNavigate(){}}));
  assert.ok(production.includes('นายสมศักดิ์ มั่นคง'));assert.ok(!production.includes('นายสมชาย ใจดี'));
});
test('training flows from staff request to chief schedule/evaluation and manager certification without changing skills',()=>{
  const skills=core.initialState();const scores=core.employeesForYear(skills,2026).find(e=>e.id==='EMP001').scores;
  let records=training.requestTraining([],'staff',form,now);const id=records[0].id;
  assert.equal(records[0].status,'requested');
  records=training.reviewTrainingRequest(records,'chief',id,true,'2026-10-14','ตรวจคำขอแล้ว',now);
  assert.equal(records[0].status,'scheduled');
  records=training.evaluateTraining(records,'chief',id,85,90,'ผลทดสอบ OJT-001',now);
  assert.equal(records[0].status,'pending-manager');
  records=training.certifyTraining(records,'manager',id,true,'รับรองผล',now);
  assert.equal(records[0].status,'approved');assert.equal(records[0].managerName,core.ACTORS.manager.name);
  assert.deepEqual(core.employeesForYear(skills,2026).find(e=>e.id==='EMP001').scores,scores);
});
test('role guards, duplicate requests, dates, invalid scores and future training are checked',()=>{
  for(const role of ['chief','manager','admin'])assert.throws(()=>training.requestTraining([],role,form,now));
  const records=training.requestTraining([],'staff',form,now);const id=records[0].id;
  assert.throws(()=>training.requestTraining(records,'staff',form,now));
  assert.throws(()=>training.requestTraining([],'staff',{...form,wiCode:'ENG-M-001'},now));
  assert.throws(()=>training.requestTraining([],'staff',{...form,desiredDate:'2026-02-30'},now));
  assert.throws(()=>training.reviewTrainingRequest(records,'manager',id,true,'2026-10-14','',now));
  assert.throws(()=>training.certifyTraining(records,'manager',id,true,'',now));
  const scheduled=training.reviewTrainingRequest(records,'chief',id,true,'2026-10-15','',now);
  assert.throws(()=>training.evaluateTraining(scheduled,'chief',id,90,90,'ยังไม่ถึงวันอบรม',now));
  const ready=training.reviewTrainingRequest(records,'chief',id,true,'2026-10-14','',now);
  for(const n of [-1,101,NaN])assert.throws(()=>training.evaluateTraining(ready,'chief',id,n,90,'หลักฐาน',now));
  assert.throws(()=>training.evaluateTraining(ready,'admin',id,90,90,'หลักฐาน',now));
});
test('chief rejection, failed evaluation and manager rejection remain separate stages with reasons',()=>{
  const records=training.requestTraining([],'staff',form,now);const id=records[0].id;
  assert.throws(()=>training.reviewTrainingRequest(records,'chief',id,false,'','',now));
  const rejected=training.reviewTrainingRequest(records,'chief',id,false,'','ยังไม่มีผู้สอน',now);
  assert.equal(rejected[0].status,'rejected-chief');
  assert.equal(training.requestTraining(rejected,'staff',form,now).length,2);
  const ready=training.reviewTrainingRequest(records,'chief',id,true,'2026-10-14','',now);
  const failed=training.evaluateTraining(ready,'chief',id,79,90,'ทฤษฎีไม่ผ่าน',now);
  assert.equal(failed[0].status,'failed');assert.throws(()=>training.certifyTraining(failed,'manager',id,true,'',now));
  const passed=training.evaluateTraining(ready,'chief',id,80,80,'ผ่านทั้งสองส่วน',now);
  assert.throws(()=>training.certifyTraining(passed,'manager',id,false,'',now));
  assert.equal(training.certifyTraining(passed,'manager',id,false,'ทบทวนหลักฐาน',now)[0].status,'rejected-manager');
});

test('Skill Matrix displays previous year score and delta badge or fallback',()=>{
  const individual=renderToStaticMarkup(React.createElement(Router,{page:'manager-individual-scores',role:'manager',onNavigate(){}}));
  assert.ok(individual.includes('ผลต่าง (Delta)'));
  assert.ok(individual.includes('คะแนนปีก่อน'));
  const department=renderToStaticMarkup(React.createElement(Router,{page:'manager-section-skills',role:'manager',onNavigate(){}}));
  assert.ok(department.includes('แสดงผลต่างจากปีก่อน'));
});
