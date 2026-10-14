# React + TypeScript + Vite

## Skill Matrix — Phase 1

UI ล่าสุดแยกเป็นพื้นที่ Staff, Chief, Manager และ Admin แต่ละหน้ามีเจ้าของเพียงหนึ่งโรล คู่มือพรีเซนต์และรายการหน้า: [ROLE-PAGES.md](ROLE-PAGES.md)

ขอบเขตล่าสุดและสูตรตามเอกสารลูกค้า: [PHASE1.md](PHASE1.md)

หน้าหลัก: Yearly Skill, หัวหน้างานเสนอคะแนน / ผู้จัดการอนุมัติ, Job Summary ตาม W/I–ประเภทสกิล

เริ่มโปรเจคด้วย `npm run dev` ตรวจเว็บด้วย `npm run build` และ `npm test` ทดสอบหน้าจอด้วย `npm run test:ui`

รุ่นต้นแบบเก็บข้อมูลในเบราว์เซอร์และใช้บทบาทจำลอง หน้าข้อมูลพื้นฐานและคลังคู่มือยังเป็นต้นแบบเดิม

ข้อมูลสาธิตล่าสุดมีคะแนนย้อนหลัง 4 ปี (2023–2026), คำขอฝึกอบรม 12 รายการครบทุกสถานะ และตัวอย่างคำขอปรับคะแนนทั้งรอพิจารณา/อนุมัติ/ไม่อนุมัติ เปิดหน้าผลอบรม แนวโน้ม และคิวพิจารณาได้ทันที ระบบเติมตัวอย่างครั้งเดียว พร้อมเก็บข้อมูลและผลตัดสินเดิมของเบราว์เซอร์ไว้

แดชบอร์ด Chief มีกราฟความพร้อมรายคน สถานะงานอบรม สกิลที่ควรเตรียมคนทดแทน และแนวโน้มคะแนนเฉลี่ยทีม พร้อมรายการงานที่ถึงวันประเมิน/คำขอรอตรวจ และปุ่มไปหน้าดำเนินการ

รายงานความสามารถตามงานใช้ความสัมพันธ์พนักงาน–หัวหน้า: Chief เห็นเฉพาะลูกทีม 3 คน (EMP001, EMP004, EMP011) Manager ดูได้ทั้งหมด 11 คนใน QC, Production และ Engineering พร้อมตัวกรองทีม มีทีม QC B อีก 2 คน (EMP012, EMP013) อยู่กับหัวหน้าคนอื่นเพื่อสาธิตการจำกัดขอบเขต ตาราง ยอดรวม และ CSV ใช้ตัวกรองเดียวกัน ข้อมูลทีมตัวอย่างเติมครั้งเดียวโดยคงคะแนนและผลพิจารณาเดิม

หน้าประเมินรายบุคคลและรายแผนกแสดงคะแนนรวม คะแนนเฉลี่ย และสัดส่วนคะแนนเต็ม โดยแยกเฉลี่ยต่อคน (คะแนน/คน) จากเฉลี่ยต่อสกิล (0–3) หน้ารายแผนกแสดงรายชื่อและยอดรวมแยกตามแผนก ปุ่ม **ส่งออก PDF** ดาวน์โหลดรายงาน A4 โดยตรงพร้อมฟอนต์ไทย Sarabun ที่ฝังในไฟล์ หัวตารางซ้ำเมื่อขึ้นหน้าใหม่ เลขหน้า และช่องลงชื่อ รายบุคคลเป็นแนวตั้ง 2 หน้า ส่วนรายแผนกเป็นแนวนอนพร้อมหน้าภาพรวมเมื่อเลือกทุกแผนก ฟอนต์พร้อมใบอนุญาตอยู่ใน `public/fonts/`

หน้าเข้าสู่ระบบมีช่อง Username/Password และปุ่มแสดงรหัสผ่านสำหรับแสดงบัญชีตัวอย่าง การเข้าสู่โหมดสาธิตยังอ้างอิงบทบาทที่เลือก

ทดสอบ PDF เพิ่มเติม: `npm test` สร้างตัวอย่างใน `review/assessment-pdf/` และตรวจจำนวนหน้า/การแบ่งหน้าของรายชื่อยาว การตรวจข้อความและขอบเขตกระดาษทำด้วย `scripts/inspect-assessment-pdfs.py` (ต้องมี pdfplumber และ pypdf)

## Skill Matrix — Phase 1

ขอบเขตล่าสุดและสูตรตามเอกสารลูกค้า: [PHASE1.md](PHASE1.md)

หน้าหลัก: Yearly Skill, หัวหน้างานเสนอคะแนน / ผู้จัดการอนุมัติ, Job Summary ตาม W/I–ประเภทสกิล

เริ่มโปรเจคด้วย `npm run dev` ตรวจเว็บด้วย `npm run build` และ `npm test` ทดสอบหน้าจอด้วย `npm run test:ui`

รุ่นต้นแบบเก็บข้อมูลในเบราว์เซอร์และใช้บทบาทจำลอง หน้าข้อมูลพื้นฐานและคลังคู่มือยังเป็นต้นแบบเดิม

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
