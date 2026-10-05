import io
import re

with io.open("src/pages/Dashboard.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('Executive Dashboard', 'แดชบอร์ดผู้บริหาร (Executive Dashboard)')
text = text.replace('Workforce Capacity', 'กำลังการผลิตรวม (Capacity)')
text = text.replace('Total capacity across all sections', 'ชั่วโมงการทำงานสูงสุดของทุกแผนก')
text = text.replace('Plan vs Actual Load', 'เปรียบเทียบภาระงาน (Plan vs Actual)')
text = text.replace('Overall plant actual workload', 'อัตราภาระงานจริงของทั้งโรงงาน')
text = text.replace('NC / Rework', 'อัตรางานเสีย/งานแก้ (NC/Rework)')
text = text.replace('Rework rate (Below 5% threshold)', 'อัตรางานแก้ (อยู่ในเกณฑ์น้อยกว่า 5%)')
text = text.replace('Skill Evaluation', 'การประเมินทักษะ')
text = text.replace('Pending', 'รอดำเนินการ')
text = text.replace('System proposed auto level-up', 'รายการเลื่อนระดับอัตโนมัติจากระบบ')
text = text.replace('Yearly Skill Development Trend', 'แนวโน้มการพัฒนาทักษะรายปี (Yearly Trend)')
text = text.replace('Training & Development', 'การฝึกอบรมและการพัฒนา (Training & Development)')

text = text.replace('OJT Requests (Level 0 &rarr; 1)', 'คำขอรับการฝึกอบรม OJT (Level 0 &rarr; 1)')
text = text.replace('Wait for Chief Check', 'รอหัวหน้างาน (Chief) ตรวจสอบ')
text = text.replace('Manager Approvals', 'รอการอนุมัติจากผู้จัดการ')
text = text.replace('Pending Final Approve', 'รอการอนุมัติขั้นสุดท้าย (Manager)')
text = text.replace('Recently Upgraded (This Month)', 'พนักงานที่ได้รับการเลื่อนระดับ (เดือนนี้)')
text = text.replace('Successfully developed', 'พัฒนาทักษะสำเร็จแล้ว')

with io.open("src/pages/Dashboard.tsx", "w", encoding="utf-8") as f:
    f.write(text)

