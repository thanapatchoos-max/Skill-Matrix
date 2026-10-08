// src/lib/sharedMockData.ts
// ============================================================
// SOURCE OF TRUTH: ข้อมูลจำลองชุดเดียวกันทั้งระบบ
// ในระบบจริง: ไฟล์นี้จะถูกแทนด้วย API calls ไปยัง Backend/DB
// ============================================================

// ----------------------
// User Profiles (จำลอง logged-in user ตาม role)
// Production: ดึงจาก Auth Token / Session
// ----------------------
export const CURRENT_USER_PROFILES: Record<string, {
  id: string;
  name: string;
  position: string;
  department: string;
  chief: string;
  skillsAssigned: number;
  skillsCompleted: number;
  pendingOJT: number;
  competencyPercent: number;
}> = {
  staff: {
    id: 'EMP001',
    name: 'นายสมชาย ใจดี',
    position: 'Quality Inspector',
    department: 'QC Section',
    chief: 'นางสาวอรุณี รักดี (Chief)',
    skillsAssigned: 5,
    skillsCompleted: 4,
    pendingOJT: 1,
    competencyPercent: 78,
  },
  chief: {
    id: 'EMP-C01',
    name: 'นางสาวอรุณี รักดี',
    position: 'Section Chief',
    department: 'QC Section',
    chief: 'นายกฤต พร้อมใจ (Manager)',
    skillsAssigned: 8,
    skillsCompleted: 7,
    pendingOJT: 0,
    competencyPercent: 92,
  },
  manager: {
    id: 'EMP-M01',
    name: 'นายกฤต พร้อมใจ',
    position: 'Department Manager',
    department: 'ALL',
    chief: '-',
    skillsAssigned: 10,
    skillsCompleted: 9,
    pendingOJT: 0,
    competencyPercent: 95,
  },
  admin: {
    id: 'SYS-A01',
    name: 'สมชาย วงศ์ไทย',
    position: 'System Admin',
    department: 'ALL',
    chief: '-',
    skillsAssigned: 0,
    skillsCompleted: 0,
    pendingOJT: 0,
    competencyPercent: 100,
  },
};

// ----------------------
// Capacity Data (กำลังคนและภาระงาน)
// Production: ดึงจาก DB + HR System (Time Attendance) + ERP (Production Plan)
// Admin สามารถ override ผ่านหน้า CapacityDashboard
// ----------------------
export type CapacityRow = {
  section: string;
  staff: number;
  capacity: number;   // staff * 8 hours
  planLoad: number;   // จาก ERP / แผนผลิต
  actualLoad: number; // จาก Working Record ในระบบนี้
  planPercent: number;
  actualPercent: number;
};

export const DEFAULT_CAPACITY_DATA: CapacityRow[] = [
  { section: 'Production',  staff: 25, capacity: 200, planLoad: 180, actualLoad: 195, planPercent: 90,   actualPercent: 97.5 },
  { section: 'QC Section',  staff: 15, capacity: 120, planLoad: 130, actualLoad: 110, planPercent: 108,  actualPercent: 91.6 },
  { section: 'Engineering', staff: 10, capacity: 80,  planLoad: 70,  actualLoad: 75,  planPercent: 87.5, actualPercent: 93.7 },
  { section: 'Maintenance', staff: 8,  capacity: 64,  planLoad: 60,  actualLoad: 60,  planPercent: 93.7, actualPercent: 93.7 },
  { section: 'Warehouse',   staff: 12, capacity: 96,  planLoad: 100, actualLoad: 90,  planPercent: 104,  actualPercent: 93.7 },
];

// ----------------------
// Working Record Stats (สรุปจากโมดูล Working Record ในระบบ)
// Production: SELECT SUM(duration_hours) FROM working_records WHERE date = TODAY GROUP BY department
// ----------------------
export const WORKING_STATS = {
  totalActualHours: 530,   // ชั่วโมงงานจริงรวมทั้งโรงงาน (คำนวณจาก Working Record)
  totalCapacityHours: 560, // กำลังคนสูงสุดรวม (จาก Capacity Data)
  overallLoadPercent: 94.6, // actualHours / capacityHours * 100
  avgNcReworkPercent: 1.2, // เฉลี่ย % งานเสีย/Rework จาก Working Record
  totalStaff: 70,           // พนักงานทั้งหมด (จาก Employees Module)
};

// ----------------------
// Approval Counts (จาก Approvals Module)
// Production: SELECT COUNT(*) FROM approvals WHERE status = 'pending'
// ----------------------
export const APPROVAL_STATS = {
  pendingTotal: 6,          // คำขอรออนุมัติทั้งหมด (ทุกประเภท)
  pendingOJT: 4,            // คำขอ OJT รออนุมัติ
  pendingAnnual: 2,         // คำขอเลื่อนระดับประจำปีรออนุมัติ
  autoUpgradePending: 3,    // ระบบสร้างข้อเสนอเลื่อนระดับอัตโนมัติ
  ojtAwaitingTest: 2,       // รอจัดสอบ
};

// ----------------------
// Department List (ใช้ร่วมกันทุกหน้า)
// Production: SELECT * FROM departments
// ----------------------
export const DEPARTMENTS = [
  'QC Section',
  'Production',
  'Engineering',
  'Maintenance',
  'Warehouse',
];

// Department → Chief mapping (สำหรับ lock visibility ของ Chief role)
export const DEPT_CHIEF_MAP: Record<string, string> = {
  'QC Section': 'chief',    // chief login → locked to QC Section
  'Production': 'chief2',
  'Engineering': 'chief3',
};
