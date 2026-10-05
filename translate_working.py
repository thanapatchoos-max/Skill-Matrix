import io

with io.open("src/pages/WorkingRecord.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('Total Actual Hours', 'เวลาทำงานจริง (Actual)')
text = text.replace('Standard Hours', 'เวลามาตรฐาน (Standard)')
text = text.replace('Daily Productivity', 'ประสิทธิภาพรายวัน (Productivity)')
text = text.replace('Rework / NC Jobs', 'งานแก้และงานเสีย (Rework/NC)')
text = text.replace('แบบฟอร์มบันทึกการทำงาน (Job Assignment)', 'แบบฟอร์มบันทึกมอบหมายงาน (Job Assignment)')
text = text.replace('Job Type', 'ประเภทงาน (Job Type)')
text = text.replace('Start Time', 'เวลาเริ่ม (Start)')
text = text.replace('Finish Time', 'เวลาเสร็จสิ้น (Finish)')
text = text.replace('บันทึก Job', 'บันทึกข้อมูลงาน')
text = text.replace('ค้นหา Job S/N, พนักงาน...', 'ค้นหารหัสงาน, ชื่อพนักงาน...')
text = text.replace('Job Type & NC', 'ประเภทงาน & รหัส NC')
text = text.replace('Time (Start - Finish)', 'เวลา (เริ่ม - เสร็จสิ้น)')
text = text.replace('Actual (Std)', 'เวลาจริง (มาตรฐาน)')
text = text.replace('Status', 'สถานะ')
text = text.replace('Completed', 'เสร็จสมบูรณ์')
text = text.replace('In Progress', 'กำลังดำเนินการ')

with io.open("src/pages/WorkingRecord.tsx", "w", encoding="utf-8") as f:
    f.write(text)

