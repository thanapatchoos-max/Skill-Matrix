import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'node:http';

const root=path.resolve('dist');
const server=process.env.PHASE1_TEST_URL?null:createServer(async(request,response)=>{
  let target=path.resolve(root,'.'+decodeURIComponent(new URL(request.url,'http://localhost').pathname));
  if(!target.startsWith(root+path.sep)||target===root)target=path.join(root,'index.html');
  try{const bytes=await fs.readFile(target);response.setHeader('Content-Type',target.endsWith('.js')?'text/javascript':target.endsWith('.css')?'text/css':target.endsWith('.svg')?'image/svg+xml':target.endsWith('.ttf')?'font/ttf':'text/html');response.end(bytes);}
  catch{response.statusCode=404;response.end('Not found');}
});
if(server)await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(5184,'127.0.0.1',resolve);});
let browser;
try{
  browser=await chromium.launch({executablePath:process.env.PHASE1_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:1000},timezoneId:'Asia/Bangkok'});
  const page=await context.newPage();page.setDefaultTimeout(10000);
  const errors=[];page.on('pageerror',error=>{errors.push(error.message);console.error('Browser error:',error.message);});
  await fs.mkdir('review/role-pages',{recursive:true});
  const login=async role=>{await page.getByRole('button',{name:role,exact:true}).click();await page.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click();};
  const switchRole=async role=>{await page.getByRole('button',{name:'เปลี่ยนบทบาท / ออกจากระบบ',exact:true}).click();await login(role);};
  const navigate=async title=>page.getByRole('navigation').getByRole('button',{name:title,exact:true}).click();
  const metric=async label=>Number(await page.getByText(label,{exact:true}).locator('..').locator('p').nth(1).innerText());
  const scoreLevel=async()=>Number(await page.locator('tr[data-skill-key="QCW001-001_A"]').locator('td').nth(3).innerText());
  const capture=async name=>{await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`review/role-pages/${name}.png`,fullPage:true});};
  await page.goto(process.env.PHASE1_TEST_URL||'http://127.0.0.1:5184/');
  assert.equal(await page.getByLabel('Username',{exact:true}).inputValue(),'staff.demo');
  assert.equal(await page.getByLabel('Password',{exact:true}).getAttribute('type'),'password');
  await page.getByRole('button',{name:'แสดงรหัสผ่าน',exact:true}).click();assert.equal(await page.getByLabel('Password',{exact:true}).getAttribute('type'),'text');
  await page.getByRole('button',{name:'ซ่อนรหัสผ่าน',exact:true}).click();await capture('login-credentials');
  // Inspect every menu page before consuming the demo queues.
  let firstRole=true;
  for(const role of ['Staff','Section Chief','Department Manager','System Admin']){
    if(firstRole){await login(role);firstRole=false;}else await switchRole(role);
    const titles=await page.getByRole('navigation').getByRole('button').evaluateAll(buttons=>buttons.map(button=>button.getAttribute('aria-label')));
    for(const title of titles){
      await navigate(title);
      assert.ok(await page.getByRole('main').getByRole('heading',{level:1}).count(),`${role}: ${title}`);
      assert.ok(!(await page.getByRole('main').innerText()).includes('ไม่พบหน้าที่เลือก'));
    }
    if(role==='Staff'){
      await navigate('ผลฝึกอบรมของฉัน');assert.equal(await page.locator('article').count(),4);await capture('staff-demo-results');
      await navigate('พัฒนาการของฉัน');await page.locator('.recharts-dot').nth(3).waitFor();await capture('staff-demo-trend');
      await page.getByLabel('ปีที่สรุป',{exact:true}).selectOption('2025');assert.ok((await page.getByRole('main').innerText()).includes('นายสมชาย ใจดี'));
    }
    if(role==='Section Chief'){
      await navigate('งานที่หัวหน้าต้องดำเนินการ');await page.locator('.recharts-surface').nth(3).waitFor();await capture('chief-demo-dashboard');
      assert.equal(await page.locator('.recharts-wrapper').count(),4);
      await page.setViewportSize({width:1080,height:900});await capture('chief-demo-dashboard-1080');
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));await page.setViewportSize({width:1440,height:1000});
      await page.getByRole('main').getByRole('button',{name:'ตรวจคำขอฝึกอบรม',exact:true}).click();assert.equal(await page.locator('article').count(),2);
      await navigate('บันทึกผลฝึกอบรม');assert.equal(await page.locator('article').count(),2);
      await navigate('พัฒนาการของทีม');await page.locator('.recharts-dot').nth(3).waitFor();await capture('chief-demo-trend');
      await navigate('สรุปความสามารถทีมตามงาน');
      assert.deepEqual(await page.getByLabel('พนักงาน',{exact:true}).locator('option').evaluateAll(options=>options.map(option=>option.value)),['ALL','EMP001','EMP004','EMP011']);
      assert.deepEqual(await page.getByLabel('แผนก',{exact:true}).locator('option').allTextContents(),['QC Section']);
      assert.equal(await metric('พนักงานในรายงาน'),3);assert.equal(await metric('ทีมในรายงาน'),1);
      assert.deepEqual(await page.locator('[data-report-employee]').evaluateAll(rows=>[...new Set(rows.map(row=>row.getAttribute('data-report-employee')))]),['EMP001','EMP004','EMP011']);
      await capture('chief-job-summary-team-scope');
      const chiefDownload=page.waitForEvent('download');await page.getByRole('button',{name:'ส่งออกรายละเอียด CSV',exact:true}).click();
      await (await chiefDownload).saveAs('review/role-pages/chief-job-summary.csv');
      const chiefCsv=await fs.readFile('review/role-pages/chief-job-summary.csv','utf8');
      for(const employee of ['EMP001','EMP004','EMP011'])assert.ok(chiefCsv.includes(employee));
      for(const excluded of ['EMP002','EMP003','EMP012','EMP013','EMP008','EMP005'])assert.ok(!chiefCsv.includes(excluded));
      await page.getByLabel('ปีรายงาน',{exact:true}).selectOption('2025');assert.equal(await metric('พนักงานในรายงาน'),3);
    }
    if(role==='Department Manager'){
      await navigate('ยืนยันการแก้ไขคะแนน');assert.equal(await page.locator('article').count(),2);await capture('manager-demo-skill-queue');
      await navigate('รับรองผลฝึกอบรม');assert.equal(await page.locator('article').count(),3);await capture('manager-demo-training-queue');
      await navigate('รายงานความสามารถตามงาน');assert.equal(await metric('พนักงานในรายงาน'),11);assert.equal(await metric('ทีมในรายงาน'),5);
      await capture('manager-job-summary-all-teams');
      const managerDownload=page.waitForEvent('download');await page.getByRole('button',{name:'ส่งออกรายละเอียด CSV',exact:true}).click();
      await (await managerDownload).saveAs('review/role-pages/manager-job-summary.csv');
      const managerCsv=await fs.readFile('review/role-pages/manager-job-summary.csv','utf8');
      for(const employee of ['EMP001','EMP004','EMP011','EMP002','EMP003','EMP012','EMP013','EMP008','EMP009','EMP005','EMP010'])assert.ok(managerCsv.includes(employee));
      await page.getByLabel('ทีม',{exact:true}).selectOption('QC-B');assert.equal(await metric('พนักงานในรายงาน'),2);
      assert.deepEqual(await page.getByLabel('พนักงาน',{exact:true}).locator('option').evaluateAll(options=>options.map(option=>option.value)),['ALL','EMP012','EMP013']);
      await capture('manager-job-summary-qc-team-b');
      await page.getByLabel('แผนก',{exact:true}).selectOption('Production');assert.equal(await page.getByLabel('ทีม',{exact:true}).inputValue(),'ALL');assert.equal(await metric('พนักงานในรายงาน'),2);
      await page.getByLabel('แผนก',{exact:true}).selectOption('Engineering');assert.equal(await metric('พนักงานในรายงาน'),2);
    }
  }
  await page.getByRole('button',{name:'เปลี่ยนบทบาท / ออกจากระบบ',exact:true}).click();
  await login('Staff');await navigate('ดูคะแนนของฉัน');const baseline=await scoreLevel();
  assert.equal(await page.getByRole('button',{name:'ส่งออก CSV',exact:true}).count(),0);
  assert.equal(await page.getByRole('navigation').getByRole('button',{name:'ตรวจคำขอฝึกอบรม',exact:true}).count(),0);
  await navigate('ยื่นขอฝึกอบรม');await page.getByLabel('เหตุผลที่ขอฝึกอบรม').fill('ฝึกการต่อวงจรสำหรับงานทดสอบ');await capture('staff-request');
  await page.getByRole('button',{name:'ส่งคำขอฝึกอบรม',exact:true}).click();await page.getByRole('status').waitFor();
  await navigate('ติดตามคำขอของฉัน');assert.ok((await page.getByRole('main').innerText()).includes('QCW001-001'));
  await switchRole('Section Chief');await navigate('ตรวจคำขอฝึกอบรม');await capture('chief-review');
  const request=page.locator('article').filter({hasText:'QCW001-001 · Type A'});
  await request.getByRole('button',{name:'อนุมัติคำขอและนัดหมาย',exact:true}).click();await page.getByRole('status').waitFor();
  await navigate('บันทึกผลฝึกอบรม');const evaluation=page.locator('article').filter({hasText:'QCW001-001 · Type A'});
  await evaluation.getByLabel('คะแนนทฤษฎี EMP001',{exact:true}).fill('85');await evaluation.getByLabel('คะแนนปฏิบัติ EMP001',{exact:true}).fill('90');
  await evaluation.getByLabel('ผลประเมิน / หลักฐาน EMP001',{exact:true}).fill('ผลทดสอบ OJT-001');
  await evaluation.getByRole('button',{name:'บันทึกผลประเมิน',exact:true}).click();await page.getByRole('status').waitFor();
  await switchRole('Department Manager');await navigate('รับรองผลฝึกอบรม');await capture('manager-certification');
  await page.locator('article').filter({hasText:'QCW001-001 · Type A'}).getByRole('button',{name:'รับรองผลฝึกอบรม',exact:true}).click();await page.getByRole('status').waitFor();
  await switchRole('Staff');await navigate('ผลฝึกอบรมของฉัน');assert.ok((await page.getByRole('main').innerText()).includes('รับรองผลแล้ว'));
  await navigate('ดูคะแนนของฉัน');assert.equal(await scoreLevel(),baseline);
  await switchRole('Section Chief');await navigate('ดูคะแนนรายบุคคล');
  await page.getByRole('button',{name:'แก้ไขคะแนนแบบแมนนวล',exact:true}).click();
  const score=page.getByLabel('คะแนน QCW001-001_A',{exact:true});const before=Number(await score.inputValue());const after=before===3?2:before+1;
  await score.selectOption(String(after));await page.getByLabel('เหตุผลการปรับคะแนน').fill('ทบทวนทักษะประจำปี');
  await capture('chief-manual-individual-score');
  await page.getByRole('button',{name:'ส่งคำขอเปลี่ยนคะแนนให้ผู้จัดการ',exact:true}).click();await page.getByRole('status').waitFor();
  await switchRole('Staff');await navigate('ดูคะแนนของฉัน');assert.equal(await scoreLevel(),baseline);
  await switchRole('Department Manager');await navigate('ยืนยันการแก้ไขคะแนน');await page.locator('article').filter({hasText:'ทบทวนทักษะประจำปี'}).getByRole('button',{name:'อนุมัติคะแนน',exact:true}).click();await page.getByRole('status').waitFor();
  await navigate('ภาพรวมสำหรับผู้จัดการ');await page.locator('.recharts-surface').nth(5).waitFor();await capture('manager-executive-dashboard');
  assert.ok(await page.locator('.recharts-surface').count()>=5);
  await page.getByLabel('แผนก',{exact:true}).selectOption('Production');
  assert.equal(await page.getByText('บุคลากรในขอบเขต',{exact:true}).locator('..').locator('..').locator('p').nth(1).innerText(),'2');
  await page.getByRole('button',{name:'ประเมินรายบุคคล',exact:true}).click();
  assert.equal(await page.getByLabel('แผนก',{exact:true}).inputValue(),'Production');
  await capture('manager-individual-assessment');
  const individualPdf=page.waitForEvent('download');await page.getByRole('button',{name:'ส่งออก PDF',exact:true}).click();
  await (await individualPdf.catch(async error=>{console.error('PDF alert:',await page.getByRole('alert').allTextContents());throw error;})).saveAs('review/role-pages/individual-assessment.pdf');
  assert.ok((await fs.readFile('review/role-pages/individual-assessment.pdf')).subarray(0,5).toString()==='%PDF-');
  const csvDownload=page.waitForEvent('download');await page.getByRole('button',{name:'ส่งออก CSV',exact:true}).click();
  await (await csvDownload).saveAs('review/role-pages/individual-assessment.csv');
  const csv=await fs.readFile('review/role-pages/individual-assessment.csv','utf8');assert.ok(csv.includes('ผลรวมคะแนน')&&csv.includes('Production'));
  await navigate('ประเมินคะแนนรายแผนก');await capture('manager-section-assessment');
  const sectionPdf=page.waitForEvent('download');await page.getByRole('button',{name:'ส่งออก PDF',exact:true}).click();
  await (await sectionPdf).saveAs('review/role-pages/section-assessment.pdf');
  assert.ok(await metric('ผลรวมคะแนนแผนกที่เลือก')>0);
  await page.getByLabel('แผนกที่ประเมิน',{exact:true}).selectOption('QC Section');
  assert.deepEqual(await page.locator('[data-assessment-employee]').evaluateAll(rows=>rows.map(row=>row.getAttribute('data-assessment-employee'))),['EMP001','EMP002','EMP003','EMP004','EMP011','EMP012','EMP013']);
  const qcTotal=await metric('ผลรวมคะแนนแผนกที่เลือก');
  assert.equal(await metric('คะแนนเฉลี่ยต่อคน'),Number((qcTotal/7).toFixed(2)));
  await capture('manager-section-assessment-qc');
  const qcPdf=page.waitForEvent('download');await page.getByRole('button',{name:'ส่งออก PDF',exact:true}).click();await (await qcPdf).saveAs('review/role-pages/section-assessment-qc.pdf');
  await page.getByLabel('แผนกที่ประเมิน',{exact:true}).selectOption('Production');assert.equal(await page.locator('[data-assessment-employee]').count(),2);
  assert.deepEqual(await page.locator('[data-assessment-employee]').evaluateAll(rows=>rows.map(row=>row.getAttribute('data-assessment-employee'))),['EMP008','EMP009']);
  await switchRole('Staff');await navigate('ดูคะแนนของฉัน');assert.equal(await scoreLevel(),baseline+after-before);
  assert.equal(await page.getByRole('navigation').getByRole('button',{name:'ประเมินคะแนนรายบุคคล',exact:true}).count(),0);
  await switchRole('System Admin');await navigate('ตรวจประวัติฝึกอบรม');await capture('admin-audit');
  assert.equal(await page.getByRole('button',{name:'รับรองผลฝึกอบรม',exact:true}).count(),0);
  await navigate('ตรวจประวัติการปรับคะแนน');assert.equal(await page.getByRole('button',{name:'อนุมัติคะแนน',exact:true}).count(),0);
  const savedBefore=await page.evaluate(()=>({skills:localStorage.getItem('daihen.skill-matrix.phase1.v1'),training:localStorage.getItem('daihen.training.role-pages.v2')}));
  await page.reload();await login('Section Chief');await page.locator('.recharts-surface').nth(3).waitFor();
  assert.deepEqual(await page.evaluate(()=>({skills:localStorage.getItem('daihen.skill-matrix.phase1.v1'),training:localStorage.getItem('daihen.training.role-pages.v2')})),savedBefore);
  assert.deepEqual(errors,[]);
  console.log('PASS: every role page, demo results/queues/four-year trends, Chief charts at two widths, reload persistence, role permissions, complete training and score approval flows, manager charts and exports.');
}finally{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));}
