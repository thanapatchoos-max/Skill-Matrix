import React from 'react';

export function CompareSkillMatrix() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="text-4xl mb-4">📊</div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">เปรียบเทียบ Skill Matrix (Compare View)</h2>
      <p className="text-slate-500 text-center max-w-md">หน้านี้ใช้สำหรับเปรียบเทียบคะแนนเฉลี่ยระหว่างแผนกหรือระหว่างปี ด้วย Bar Chart ตามที่ออกแบบไว้ใน Phase 1</p>
    </div>
  );
}

export function Approvals() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="text-4xl mb-4">✅</div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">การอนุมัติ (Approval Workflow)</h2>
      <p className="text-slate-500 text-center max-w-md">หน้าสำหรับให้ Chief ยื่นเสนอปรับ Skill และให้ Manager กด Approve/Reject พร้อมเก็บบันทึก Audit Trail ISO 17025</p>
    </div>
  );
}

export function EmployeeManagement() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="text-4xl mb-4">👥</div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">จัดการพนักงาน (Employee Management)</h2>
      <p className="text-slate-500 text-center max-w-md">ระบบเพิ่ม/แก้ไข/Soft-delete พนักงาน รวมถึงกำหนด Role และสายบังคับบัญชา</p>
    </div>
  );
}

export function MasterData() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="text-4xl mb-4">📋</div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">จัดการข้อมูลพื้นฐาน (Master Data)</h2>
      <p className="text-slate-500 text-center max-w-md">สำหรับ Admin เท่านั้น ในการตั้งค่า Work Instruction (W/I) และกำหนด Skill Types ย่อย (A, B, C, D)</p>
    </div>
  );
}

export function Training() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="text-4xl mb-4">🎓</div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">แผนการฝึกอบรม (OJT)</h2>
      <p className="text-slate-500 text-center max-w-md">บันทึกผลคะแนนทฤษฎี/ปฏิบัติ หากผ่านเกณฑ์ 80% ระบบจะสร้างคำขอปรับ Level 0 → 1 อัตโนมัติ</p>
    </div>
  );
}

export function Reports() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="text-4xl mb-4">📈</div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">รายงาน (Reports)</h2>
      <p className="text-slate-500 text-center max-w-md">หน้าดาวน์โหลดรายงานรูปแบบ Excel และ PDF เช่น Skill Matrix รวม, ประวัติการอนุมัติ ฯลฯ</p>
    </div>
  );
}

export function Settings() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="text-4xl mb-4">⚙️</div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">ตั้งค่าระบบ (Settings)</h2>
      <p className="text-slate-500 text-center max-w-md">ตั้งค่าแผนก, ข้อมูลบริษัท, สิทธิ์การใช้งาน และการแจ้งเตือน (เฉพาะ Admin)</p>
    </div>
  );
}
