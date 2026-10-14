import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const root=path.resolve('dist');
const server=process.env.PHASE1_TEST_URL ? null : createServer(async (request,response) => {
  let target=path.resolve(root,'.'+decodeURIComponent(new URL(request.url,'http://localhost').pathname));
  if(!target.startsWith(root+path.sep) || target===root) target=path.join(root,'index.html');
  try {
    const bytes=await fs.readFile(target);
    response.setHeader('Content-Type',target.endsWith('.js') ? 'text/javascript' : target.endsWith('.css') ? 'text/css' : target.endsWith('.svg') ? 'image/svg+xml' : 'text/html');
    response.end(bytes);
  } catch {response.statusCode=404;response.end('Not found');}
});
if(server) await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(5184,'127.0.0.1',resolve);});

const browser=await chromium.launch({executablePath: process.env.PHASE1_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[];
const context=await browser.newContext({viewport:{width:1440,height:1000},timezoneId:'Asia/Bangkok'});
const page=await context.newPage();
page.setDefaultTimeout(10000);
page.on('pageerror',e => errors.push(e.message));
const url=process.env.PHASE1_TEST_URL || 'http://127.0.0.1:5184/';
const year=Number(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Bangkok',year:'numeric'}).format(new Date()));
await fs.mkdir('review/phase1',{recursive:true});
async function login(role) { await page.getByRole('button',{name:role,exact:true}).click(); await page.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click(); }
async function logout() { await page.getByRole('button',{name:'ออกจากระบบ',exact:true}).click(); }
async function navigate(name) { await page.getByRole('navigation').getByRole('button',{name,exact:true}).click(); }
async function metric(label) { return Number((await page.getByText(label,{exact:true}).locator('..').locator('p').nth(1).innerText()).replace(/,/g,'')); }
try {
  await page.goto(url); await login('Section Chief');
  assert.equal(await page.getByRole('navigation').getByRole('button',{name:/บันทึกการทำงาน|ฝึกอบรม|Capacity|ประเมินทักษะ/}).count(),0);
  await navigate('ทักษะรายบุคคล');
  const before=await metric('คะแนนรวมตามตัวกรอง');
  await navigate('Yearly Skill');
  await page.getByLabel('พนักงาน',{exact:true}).selectOption('EMP001');
  assert.equal(await metric('คะแนนรวมปีที่เลือก'),before);
  await navigate('ปรับคะแนนสกิล');
  assert.equal(await page.getByLabel('พนักงานใต้บังคับบัญชา').locator('option[value="EMP002"]').count(),0);
  await page.getByLabel('คะแนน QCW001-001_A',{exact:true}).selectOption('1');
  await page.getByLabel('คะแนน QCW001-001_B',{exact:true}).selectOption('3');
  await page.getByLabel('เหตุผล / ผลการประเมิน (จำเป็น)').fill('ผลประเมินความสามารถประจำปี');
  await page.getByLabel('เอกสารหรือหลักฐานอ้างอิง').fill('EVAL-2026-001');
  await page.evaluate(()=>window.scrollTo(0,0)); await page.screenshot({path:'review/phase1/adjustment.png',fullPage:true});
  await page.getByRole('button',{name:'ส่งให้ผู้จัดการอนุมัติ',exact:true}).click();
  await page.getByRole('status').waitFor();
  await navigate('ทักษะรายบุคคล'); assert.equal(await metric('คะแนนรวมตามตัวกรอง'),before);
  await logout(); await login('System Admin');
  await navigate('อนุมัติคะแนนสกิล'); assert.equal(await page.getByRole('button',{name:'อนุมัติคะแนน',exact:true}).count(),0);
  await logout(); await login('Department Manager');
  await page.getByRole('button',{name:'อนุมัติคะแนน',exact:true}).click(); await page.getByRole('status').waitFor();
  await navigate('ทักษะรายบุคคล'); assert.equal(await metric('คะแนนรวมตามตัวกรอง'),before-1);
  await page.reload(); await login('Department Manager');
  await navigate('ทักษะรายบุคคล'); assert.equal(await metric('คะแนนรวมตามตัวกรอง'),before-1);
  await navigate('Yearly Skill'); await page.getByLabel('พนักงาน',{exact:true}).selectOption('EMP001');
  assert.equal(await metric('คะแนนรวมปีที่เลือก'),before-1);
  assert.ok((await page.getByRole('main').innerText()).includes('EVAL-2026-001'));
  await page.getByLabel('ปีที่สรุป').selectOption(String(year-1));
  await page.getByText(`ยังไม่มีข้อมูลคะแนนสำหรับปี ${year-1}`,{exact:true}).waitFor();
  await page.getByLabel('ปีที่สรุป').selectOption(String(year));
  await page.evaluate(()=>window.scrollTo(0,0)); await page.screenshot({path:'review/phase1/yearly.png',fullPage:true});
  await navigate('Job Summary'); await page.getByLabel('พนักงาน',{exact:true}).selectOption('EMP001');
  assert.equal(await metric('รวมคะแนนทุกงานที่เลือก'),before-1);
  await page.getByLabel('Work Instruction',{exact:true}).selectOption('QCW001-001');
  await page.getByLabel('ประเภทสกิล',{exact:true}).selectOption('A');
  assert.equal(await metric('รวมคะแนนทุกงานที่เลือก'),1);
  const download=page.waitForEvent('download'); await page.getByRole('button',{name:'ส่งออก CSV',exact:true}).click();
  const downloaded=await download; await downloaded.saveAs('review/phase1/job-summary.csv');
  const csv=await fs.readFile('review/phase1/job-summary.csv','utf8');
  assert.ok(csv.includes('QCW001-001') && csv.includes('Type A'));
  await page.getByLabel('Work Instruction',{exact:true}).selectOption('ALL');
  await page.getByLabel('ประเภทสกิล',{exact:true}).selectOption('ALL');
  await page.evaluate(()=>window.scrollTo(0,0)); await page.screenshot({path:'review/phase1/job-summary.png',fullPage:true});
  await page.pdf({path:'review/phase1/job-summary-print.pdf',printBackground:true,preferCSSPageSize:true});
  const second=await context.newPage(); second.on('pageerror',e=>errors.push(e.message));
  await second.goto(url); await second.getByRole('button',{name:'Department Manager',exact:true}).click(); await second.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click();
  await second.getByRole('navigation').getByRole('button',{name:'ทักษะรายบุคคล',exact:true}).click();
  await logout(); await login('Section Chief'); await navigate('ปรับคะแนนสกิล');
  await page.getByLabel('คะแนน QCW001-001_A',{exact:true}).selectOption('2'); await page.getByLabel('เหตุผล / ผลการประเมิน (จำเป็น)').fill('เสนอเพิ่มระดับ'); await page.getByRole('button',{name:'ส่งให้ผู้จัดการอนุมัติ',exact:true}).click(); await page.getByRole('status').waitFor();
  await second.getByRole('navigation').getByRole('button',{name:/อนุมัติคะแนนสกิล/}).click();
  await second.getByRole('button',{name:'ไม่อนุมัติ',exact:true}).click(); await second.getByRole('alert').waitFor();
  await second.getByLabel('ความเห็นผู้จัดการ (จำเป็นเมื่อไม่อนุมัติ)').fill('ต้องทบทวนหลักฐาน');
  await second.getByRole('button',{name:'ไม่อนุมัติ',exact:true}).click(); await second.getByRole('status').waitFor();
  await navigate('ทักษะรายบุคคล'); assert.equal(await metric('คะแนนรวมตามตัวกรอง'),before-1);
  await logout(); await login('Staff');
  assert.equal(await page.getByRole('navigation').getByRole('button',{name:'ปรับคะแนนสกิล',exact:true}).count(),0);
  assert.equal(await page.getByRole('navigation').getByRole('button',{name:'Job Summary',exact:true}).count(),0);
  await navigate('ทักษะของฉัน'); assert.equal(await page.getByLabel('พนักงาน',{exact:true}).locator('option').count(),1);
  assert.equal(await metric('คะแนนรวมตามตัวกรอง'),before-1);
  assert.deepEqual(errors,[]);
  console.log('PASS: pending, approval, rejection, roles, yearly history, totals, filters, CSV, persistence and cross-tab updates.');
} catch(error) { await page.screenshot({path:'review/phase1/failure.png',fullPage:true}); throw error; }
finally { await browser.close(); if(server) await new Promise(resolve=>server.close(resolve)); }
