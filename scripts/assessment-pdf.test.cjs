const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs/promises');
const PdfPrinter=require('pdfmake');
const {load}=require('./test-source-loader.cjs');
const {populateSkillDemo}=load(path.resolve('src/data/demoData.ts'));
const {employeesForYear}=load(path.resolve('src/data/phase1Core.ts'));
const {individualAssessment,sectionAssessment}=load(path.resolve('src/data/skillAssessment.ts'));
const {individualReport,sectionReport}=load(path.resolve('src/lib/assessmentReport.ts'));
const now=new Date('2026-10-14T04:00:00Z');
const people=employeesForYear(populateSkillDemo(undefined,now),2026);
const printer=new PdfPrinter({Sarabun:{normal:path.resolve('public/fonts/Sarabun-Regular.ttf'),bold:path.resolve('public/fonts/Sarabun-Bold.ttf'),italics:path.resolve('public/fonts/Sarabun-Regular.ttf'),bolditalics:path.resolve('public/fonts/Sarabun-Bold.ttf')}});
async function create(definition,name){
  const doc=printer.createPdfKitDocument(definition);const chunks=[];
  const buffer=await new Promise((resolve,reject)=>{doc.on('data',chunk=>chunks.push(chunk));doc.on('error',reject);doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.end();});
  await fs.mkdir('review/assessment-pdf',{recursive:true});await fs.writeFile(`review/assessment-pdf/${name}.pdf`,buffer);
  assert.equal(buffer.subarray(0,5).toString(),'%PDF-');
  return {buffer,pages:(buffer.toString('latin1').match(/\/Type \/Page\b/g)||[]).length};
}
test('Thai assessment PDFs paginate cleanly for individual, selected department and all departments',async()=>{
  const individual=await create(individualReport(individualAssessment(people[0]),2026,now),'individual');assert.equal(individual.pages,2);
  const qc=people.filter(employee=>employee.department==='QC Section');
  const department=await create(sectionReport(sectionAssessment(qc),2026,'QC Section',now),'department-qc');assert.ok(department.pages>=1);
  const all=await create(sectionReport(sectionAssessment(people),2026,'ALL',now),'departments-all');assert.ok(all.pages>=4);
});
test('large departments and long Thai names continue across pages with repeating table headers',async()=>{
  const employees=Array.from({length:60},(_,index)=>({...people[0],id:`LONG-${String(index+1).padStart(3,'0')}`,name:`นายทดสอบชื่อพนักงานภาษาไทยที่มีความยาวเพื่อใช้ตรวจสอบการตัดบรรทัด หมายเลข ${index+1}`}));
  const result=await create(sectionReport(sectionAssessment(employees),2026,'QC Section',now),'department-long-roster');assert.ok(result.pages>3);
});
