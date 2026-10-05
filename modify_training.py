import io
import re

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Let's change the title to Training Management
text = text.replace("ประเมินทักษะ & OJT", "Training Management")

# Change Flow Hint to match proposal exactly
old_hint = """<span className="font-semibold">นอกระบบ:</span> Staff ปฏิบัติงานจริง &rarr; เรียนรู้ผ่าน OJT &rarr; ทดสอบภาคทฤษฎีและปฏิบัติ
              &nbsp;&rarr;&nbsp;
              <span className="font-semibold">ในระบบ (Chief):</span> เลือก W/I จาก Master Data &rarr; บันทึกคะแนน &rarr; ส่งขออนุมัติ
              &nbsp;&rarr;&nbsp;
              <span className="font-semibold">ในระบบ (Manager):</span> อนุมัติ &rarr; ระบบปรับ Level 0 &rarr; 1 อัตโนมัติ"""

new_hint = """<span className="font-bold">1. Request:</span> พนักงาน/Clerk ยื่นคำขอฝึกอบรม W/I ที่ต้องการ
              &nbsp;&rarr;&nbsp;
              <span className="font-bold">2. Training:</span> เข้ารับการฝึกอบรม
              &nbsp;&rarr;&nbsp;
              <span className="font-bold">3. Chief Check:</span> หัวหน้าตรวจสอบผล
              &nbsp;&rarr;&nbsp;
              <span className="font-bold">4. Manager Approve:</span> ผู้จัดการอนุมัติ &rarr; ปรับ Skill Level 0 &rarr; 1 อัตโนมัติ"""

text = text.replace(old_hint, new_hint)
text = text.replace("ขั้นตอนการทำงาน (OJT Competency Flow)", "Training Workflow (อ้างอิง Proposal)")

# Change the OJT Table headers slightly
text = text.replace("รายการ OJT ปัจจุบัน และ รออนุมัติ", "Training Requests & Chief Checks (Level 0 &rarr; 1)")

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)
