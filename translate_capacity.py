import io

with io.open("src/pages/CapacityDashboard.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('Workload & Capacity Management', 'การจัดการภาระงานและกำลังคน (Workload & Capacity)')
text = text.replace('Total Workforce', 'จำนวนพนักงานรวม')
text = text.replace('Total Capacity', 'กำลังการผลิตสูงสุดรวม')
text = text.replace('Actual Workload', 'ภาระงานที่ทำจริงรวม')
text = text.replace('Overall Load %', 'อัตราภาระงานรวม (%)')
text = text.replace('Optimal is 85-95%', 'ค่ามาตรฐานอยู่ที่ 85-95%')

text = text.replace('Plan vs Actual Workload vs Capacity (Hours)', 'เปรียบเทียบภาระงานตามแผน, งานจริง และกำลังการผลิต (ชั่วโมง)')
text = text.replace('Workload Percentage (%)', 'สัดส่วนภาระงานรายแผนก (ร้อยละ)')
text = text.replace('Capacity Breakdown by Section', 'รายละเอียดกำลังคนแยกตามแผนก')

text = text.replace('Staff Count', 'จำนวนพนักงาน')
text = text.replace('Max Capacity (Hrs)', 'กำลังคนสูงสุด (ชม.)')
text = text.replace('Plan Load (Hrs)', 'งานตามแผน (ชม.)')
text = text.replace('Actual Load (Hrs)', 'งานทำจริง (ชม.)')
text = text.replace('Status', 'สถานะ')

text = text.replace('Over Capacity', 'ภาระงานเกินกำลัง')
text = text.replace('Under Capacity', 'ภาระงานต่ำกว่าเกณฑ์')
text = text.replace('Normal Load', 'ภาระงานอยู่ในเกณฑ์ปกติ')

with io.open("src/pages/CapacityDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(text)

