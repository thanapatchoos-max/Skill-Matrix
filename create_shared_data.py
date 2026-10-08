import io

# ------- Create Shared Mock Data Layer -------
shared_data = '''// src/lib/sharedMockData.ts
// SOURCE OF TRUTH: ข้อมูลจำลองชุดเดียวกันทั้งระบบ
// ในระบบจริง: ไฟล์นี้จะถูกแทนด้วย API Calls ไปยัง Backend

export const CURRENT_USER_PROFILES: Record<string, {
  id: string; name: string; position: string; department: string; chief: string; hoursStandard: number;
  skillsAssigned: number; skillsCompleted: number; pendingOJT: number; competencyPercent: number;
}> = {
  staff: {
    id: 'EMP001', name: 'นายสมชาย ใจดี', position: 'Quality Inspector',
    department: 'QC Section', chief: 'นางสาวอรุณี รักดี (Chief)',
    hoursStandard: 8, skillsAssigned: 5, skillsCompleted: 4, pendingOJT: 1, competencyPercent: 78,
  },
  chief: {
    id: 'EMP-C01', name: 'นางสาวอรุณี รักดี', position: 'Section Chief',
    department: 'QC Section', chief: 'นายกฤต พร้อมใจ (Manager)',
    hoursStandard: 8, skillsAssigned: 8, skillsCompleted: 7, pendingOJT: 0, competencyPercent: 92,
  },
  manager: {
    id: 'EMP-M01', name: 'นายกฤต พร้อมใจ', position: 'Department Manager',
    department: 'ALL', chief: '-',
    hoursStandard: 8, skillsAssigned: 10, skillsCompleted: 9, pendingOJT: 0, competencyPercent: 95,
  },
  admin: {
    id: 'SYS-A01', name: 'สมชาย วงศ์ไทย', position: 'System Admin',
    department: 'ALL', chief: '-',
    hoursStandard: 8, skillsAssigned: 0, skillsCompleted: 0, pendingOJT: 0, competencyPercent: 100,
  },
};

// Capacity data — Admin can update via CapacityDashboard
// In production: stored in DB, fetched via API + HR system integration
export type CapacityRow = {
  section: string; staff: number; capacity: number;
  planLoad: number; actualLoad: number; planPercent: number; actualPercent: number;
};

export const DEFAULT_CAPACITY_DATA: CapacityRow[] = [
  { section: 'Production',  staff: 25, capacity: 200, planLoad: 180, actualLoad: 195, planPercent: 90,    actualPercent: 97.5 },
  { section: 'QC Section',  staff: 15, capacity: 120, planLoad: 130, actualLoad: 110, planPercent: 108,   actualPercent: 91.6 },
  { section: 'Engineering', staff: 10, capacity: 80,  planLoad: 70,  actualLoad: 75,  planPercent: 87.5,  actualPercent: 93.7 },
  { section: 'Maintenance', staff: 8,  capacity: 64,  planLoad: 60,  actualLoad: 60,  planPercent: 93.7,  actualPercent: 93.7 },
  { section: 'Warehouse',   staff: 12, capacity: 96,  planLoad: 100, actualLoad: 90,  planPercent: 104,   actualPercent: 93.7 },
];

// Working record stats — computed from WorkingRecord mock data
// In production: SELECT SUM(duration) FROM working_records GROUP BY department
export const WORKING_RECORD_STATS = {
  totalActualLoad: 530,  // Sum of all actual hours across all depts
  totalCapacity: 560,    // Sum of max capacity across all depts
  overallLoadPct: 94.6,  // totalActualLoad / totalCapacity * 100
  ncReworkPct: 1.2,      // Average rework % from working records
};

// Department list (shared)
export const DEPARTMENTS = ['QC Section', 'Production', 'Engineering', 'Maintenance', 'Warehouse'];

// Pending approvals count (from Approvals page, shared for sidebar badge)
// In production: SELECT COUNT(*) FROM approvals WHERE status = 'pending'
export const PENDING_APPROVALS_COUNT = 6;

// OJT Requests pending per role
export const OJT_PENDING_COUNT = 7;

// Skill level upgrade auto-proposals
export const AUTO_UPGRADE_PENDING = 3;
'''

with io.open("src/lib/sharedMockData.ts", "w", encoding="utf-8") as f:
    f.write(shared_data)
print("Created sharedMockData.ts")
