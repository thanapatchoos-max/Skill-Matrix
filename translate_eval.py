import io

with io.open("src/pages/SkillEvaluation.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('Automatic Skill Evaluation', 'ระบบประเมินทักษะอัตโนมัติ (Automatic Skill Evaluation)')
text = text.replace('System Evaluation &rarr; Chief Review &rarr; Manager Approve', 'ระบบประเมิน &rarr; หัวหน้างานตรวจสอบ &rarr; ผู้จัดการอนุมัติ')
text = text.replace('Rule Engine สำหรับการเปลี่ยน Skill Level (อ้างอิง Proposal)', 'หลักเกณฑ์และเงื่อนไขการเลื่อนระดับทักษะ (Rule Engine)')
text = text.replace('Pass Training (ประเมินผ่านหน้า Training Management)', 'ผ่านการฝึกอบรม (ประเมินผ่านเมนู Training Management)')
text = text.replace('พนักงาน', 'ชื่อพนักงาน')
text = text.replace('Level Change', 'การปรับระดับ (Level)')
text = text.replace('เงื่อนไขที่ตรวจสอบ (Criteria)', 'ผลการประเมินเงื่อนไข (Criteria)')
text = text.replace('การดำเนินการ (Chief)', 'การดำเนินการ (Action)')
text = text.replace('System Proposed', 'ระบบแนะนำให้เลื่อนระดับ')
text = text.replace('Not Qualified', 'ยังไม่ผ่านเกณฑ์')
text = text.replace('Submit to Manager', 'ส่งให้ผู้จัดการอนุมัติ')

with io.open("src/pages/SkillEvaluation.tsx", "w", encoding="utf-8") as f:
    f.write(text)

