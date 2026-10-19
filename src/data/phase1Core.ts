import { MASTER_WIS } from './masterData';
import { INITIAL_EMPLOYEES } from './phase1Seed';
import { DEMO_TEAMS, demoMembership, isChiefReport } from './teamScope';

export type SkillLevel = 0 | 1 | 2 | 3;
export type Role = 'admin' | 'chief' | 'manager' | 'staff';

export interface DepartmentTransferRecord {
  id: string;
  employeeId: string;
  fromDepartment: string;
  toDepartment: string;
  effectiveDate: string;
  transferredAt: string;
  reason: string;
  scoresSnapshot: Record<string, number>;
  assignedSkillsSnapshot: string[];
}

export interface Employee {
  id: string; name: string; role: string; position: string; department: string;
  scores: Record<string, number>; assignedSkills: string[];
  teamId?: string; supervisorId?: string;
  avatarUrl?: string;
  transferHistory?: DepartmentTransferRecord[];
}

export function saveEmployeeProfile(state: SkillState, role: Role, profile: Pick<Employee, 'id' | 'name' | 'position' | 'department'> & { assignedSkills: string[]; avatarUrl?: string }, now = new Date()): SkillState {
  if (role !== 'admin') throw new Error('เฉพาะผู้ดูแลระบบเท่านั้นที่จัดการข้อมูลพนักงานได้');
  if (!profile.id.trim() || !profile.name.trim() || !profile.position.trim() || !SKILL_DEPARTMENTS.includes(profile.department))
    throw new Error('กรุณากรอกข้อมูลพนักงานให้ครบถ้วน');
  const year = bangkokYear(now);
  const employees = employeesForYear(state,year);
  const employee = employees.find(e => e.id === profile.id);
  if (employee && employee.department !== profile.department && state.adjustments.some(a => a.employeeId === profile.id && a.status === 'pending'))
    throw new Error('กรุณาพิจารณาคำขอปรับคะแนนที่ค้างอยู่ก่อนย้ายแผนก');
  const validKeys=SKILL_WIS.filter(w => w.department === profile.department).flatMap(w => w.types.map(t => `${w.code}_${t.code}`));
  if (profile.assignedSkills.some(key => !validKeys.includes(key))) throw new Error('สกิลที่มอบหมายต้องอยู่ในแผนกของพนักงาน');
  const updated: Employee = {
    ...employee,
    ...profile,
    name: profile.name.trim(),
    position: profile.position.trim(),
    role: employee?.role ?? 'Staff',
    scores: employee?.scores ?? {},
    avatarUrl: profile.avatarUrl !== undefined ? profile.avatarUrl : employee?.avatarUrl,
    transferHistory: employee?.transferHistory ?? [],
  };
  const nextEmployees=employee ? employees.map(e => e.id === profile.id ? updated : e) : [...employees,updated];
  return {...state,snapshots:[...state.snapshots.filter(s => s.year !== year),{year,employees:nextEmployees}]};
}

export function transferEmployeeDepartment(
  state: SkillState,
  role: Role,
  employeeId: string,
  newDepartment: string,
  effectiveDate: string,
  reason = '',
  now = new Date()
): SkillState {
  if (role !== 'admin') throw new Error('เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถโอนย้ายแผนกได้');
  if (!SKILL_DEPARTMENTS.includes(newDepartment)) throw new Error('กรุณาเลือกแผนกปลายทางที่ถูกต้อง');

  const year = bangkokYear(now);
  const employees = employeesForYear(state, year);
  const employee = employees.find(e => e.id === employeeId);
  if (!employee) throw new Error('ไม่พบข้อมูลพนักงานที่ต้องการโอนย้าย');
  if (employee.department === newDepartment) throw new Error('พนักงานสังกัดแผนกนี้อยู่แล้ว กรุณาเลือกแผนกอื่น');

  if (state.adjustments.some(a => a.employeeId === employeeId && a.status === 'pending')) {
    throw new Error('กรุณาพิจารณาคำขอปรับคะแนนที่ค้างอยู่ของพนักงานก่อนดำเนินการโอนย้ายแผนก');
  }

  const transferRecord: DepartmentTransferRecord = {
    id: `TRF-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    employeeId,
    fromDepartment: employee.department,
    toDepartment: newDepartment,
    effectiveDate: effectiveDate || now.toISOString().slice(0, 10),
    transferredAt: now.toISOString(),
    reason: reason.trim() || 'โอนย้ายตามโครงสร้างองค์กร',
    scoresSnapshot: { ...employee.scores },
    assignedSkillsSnapshot: [...employee.assignedSkills],
  };

  const newDeptSkills = SKILL_WIS.filter(w => w.department === newDepartment).flatMap(w => w.types.map(t => `${w.code}_${t.code}`));
  const newTeam = DEMO_TEAMS.find(t => t.department === newDepartment && t.id !== 'QC-MGMT');

  const newScores: Record<string, number> = {};
  newDeptSkills.forEach(key => {
    newScores[key] = employee.scores[key] ?? 0;
  });

  const updated: Employee = {
    ...employee,
    department: newDepartment,
    teamId: newTeam?.id,
    supervisorId: newTeam?.supervisorId,
    scores: newScores,
    assignedSkills: newDeptSkills.slice(0, 4),
    transferHistory: [...(employee.transferHistory ?? []), transferRecord],
  };

  const nextEmployees = employees.map(e => e.id === employeeId ? updated : e);
  return {
    ...state,
    snapshots: [
      ...state.snapshots.filter(s => s.year !== year),
      { year, employees: nextEmployees },
    ],
  };
}

export function importEmployeesBatch(
  state: SkillState,
  role: Role,
  newEmployees: Array<{ id: string; name: string; position: string; department: string; avatarUrl?: string }>,
  now = new Date()
): SkillState {
  if (role !== 'admin') throw new Error('เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถนำเข้าข้อมูลพนักงานได้');
  const year = bangkokYear(now);
  const existing = employeesForYear(state, year);
  const existingIds = new Set(existing.map(e => e.id));

  const validEntries: Employee[] = [];
  for (const item of newEmployees) {
    const trimmedId = item.id.trim();
    if (!trimmedId || existingIds.has(trimmedId)) continue;
    existingIds.add(trimmedId);

    const validDeptSkills = SKILL_WIS.filter(w => w.department === item.department).flatMap(w => w.types.map(t => `${w.code}_${t.code}`));
    const initialAssigned = validDeptSkills.slice(0, 4);
    const initialScores: Record<string, number> = {};
    validDeptSkills.forEach(k => { initialScores[k] = 0; });
    const team = DEMO_TEAMS.find(t => t.department === item.department && t.id !== 'QC-MGMT');

    validEntries.push({
      id: trimmedId,
      name: item.name.trim(),
      position: item.position.trim(),
      department: item.department.trim(),
      role: 'Staff',
      teamId: team?.id,
      supervisorId: team?.supervisorId,
      scores: initialScores,
      assignedSkills: initialAssigned,
      avatarUrl: item.avatarUrl ? item.avatarUrl.trim() : undefined,
      transferHistory: [],
    });
  }

  const nextEmployees = [...existing, ...validEntries];
  return {
    ...state,
    snapshots: [
      ...state.snapshots.filter(s => s.year !== year),
      { year, employees: nextEmployees },
    ],
  };
}
export interface SkillChange { key: string; before: number; after: SkillLevel }
export interface Adjustment {
  id: string; employeeId: string; year: number; changes: SkillChange[];
  reason: string; evidence: string; submittedBy: string; submittedName: string; submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string; reviewedName?: string; reviewedAt?: string; remark?: string;
}
export interface Snapshot { year: number; employees: Employee[] }
export interface SkillState { version: 1; snapshots: Snapshot[]; adjustments: Adjustment[] }

export const SKILL_WIS = MASTER_WIS.map(wi => ({
  ...wi,
  department: wi.department.replace('Production Section', 'Production').replace('Engineering Section', 'Engineering'),
}));
export const SKILL_DEPARTMENTS = [...new Set(SKILL_WIS.map(wi => wi.department))];
export const LEVEL_LABELS = ['ยังทำไม่ได้', 'ทำได้ภายใต้การดูแล', 'ทำได้ด้วยตนเอง', 'สอน / ควบคุมผู้อื่นได้'];
export const ACTORS: Record<Role, { id: string; name: string; employeeId: string; department: string }> = {
  admin: { id: 'SYS-A01', name: 'สมชาย วงศ์ไทย', employeeId: '', department: 'ALL' },
  chief: { id: 'EMP-C01', name: 'นางสาวอรุณี รักดี', employeeId: 'EMP002', department: 'QC Section' },
  manager: { id: 'EMP-M01', name: 'นายกฤต พร้อมใจ', employeeId: 'EMP003', department: 'ALL' },
  staff: { id: 'EMP001', name: 'นายสมชาย ใจดี', employeeId: 'EMP001', department: 'QC Section' },
};
export function bangkokYear(date = new Date()) {
  return Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Bangkok', year: 'numeric' }).format(date));
}
export function initialState(): SkillState {
  const employees=structuredClone(INITIAL_EMPLOYEES).map(employee => {
    const keys=skillKeys(employee);
    return {...employee, ...demoMembership(employee), scores:Object.fromEntries(keys.map(key => [key,employee.scores[key] ?? 0])), assignedSkills:employee.assignedSkills.filter(key => keys.includes(key))};
  });
  return { version: 1, snapshots: [{ year: 2026, employees }], adjustments: [] };
}
export function skillKeys(employee: Employee, wiCode = 'ALL', type = 'ALL', onDuty = false) {
  return SKILL_WIS.filter(wi => wi.department === employee.department && (wiCode === 'ALL' || wi.code === wiCode))
    .flatMap(wi => wi.types.filter(t => type === 'ALL' || t.code === type).map(t => `${wi.code}_${t.code}`))
    .filter(key => !onDuty || employee.assignedSkills.includes(key));
}
export function sumSkills(employee: Employee, keys = skillKeys(employee)) {
  return keys.reduce((total, key) => total + (employee.scores[key] ?? 0), 0);
}
export function sectionSummary(employees: Employee[], wiCode = 'ALL', type = 'ALL', onDuty = false) {
  const total = employees.reduce((sum, employee) => sum + sumSkills(employee, skillKeys(employee, wiCode, type, onDuty)), 0);
  return { people: employees.length, total, averagePerPerson: employees.length ? total / employees.length : 0 };
}
// A year's closing values contain only approved changes. Earlier years remain unchanged.
export function employeesForYear(state: SkillState, year: number): Employee[] {
  const snapshot = state.snapshots.filter(s => s.year <= year).sort((a, b) => b.year - a.year)[0];
  if (!snapshot) return [];
  const employees = structuredClone(snapshot.employees);
  state.adjustments.filter(a => a.status === 'approved' && a.year >= snapshot.year && a.year <= year)
    .sort((a, b) => a.reviewedAt!.localeCompare(b.reviewedAt!))
    .forEach(a => {
      const employee = employees.find(e => e.id === a.employeeId);
      if (employee) a.changes.forEach(change => { employee.scores[change.key] = change.after; });
    });
  return employees;
}
export function visibleEmployees(employees: Employee[], role: string) {
  if (role === 'staff') return employees.filter(e => e.id === ACTORS.staff.employeeId);
  if (role === 'chief') return employees.filter(e => isChiefReport(e, ACTORS.chief.id, ACTORS.chief.department));
  return role === 'admin' || role === 'manager' ? employees : [];
}
export function proposeAdjustment(state: SkillState, role: Role, employeeId: string,
  proposed: Record<string, number>, reason: string, evidence: string, now = new Date()): SkillState {
  if (role !== 'chief') throw new Error('เฉพาะหัวหน้างานเท่านั้นที่เสนอปรับคะแนนได้');
  const actor = ACTORS[role];
  const year = bangkokYear(now);
  const employee = employeesForYear(state, year).find(e => e.id === employeeId);
  if (!employee || !isChiefReport(employee, actor.id, actor.department))
    throw new Error('เลือกพนักงานใต้บังคับบัญชาในแผนกของคุณ');
  if (!reason.trim()) throw new Error('กรุณาระบุเหตุผลการปรับคะแนน');
  const allowed = skillKeys(employee);
  const changes: SkillChange[] = Object.entries(proposed).map(([key, after]) => {
    if (!allowed.includes(key) || !Number.isInteger(after) || after < 0 || after > 3)
      throw new Error('คะแนนต้องเป็นระดับ 0–3 ของ W/I และประเภทสกิลที่ถูกต้อง');
    return { key, before: employee.scores[key] ?? 0, after: after as SkillLevel };
  }).filter(change => change.before !== change.after);
  if (!changes.length) throw new Error('กรุณาปรับคะแนนอย่างน้อย 1 สกิล');
  if (state.adjustments.some(a => a.status === 'pending' && a.employeeId === employeeId && a.changes.some(c => changes.some(n => n.key === c.key))))
    throw new Error('สกิลนี้มีคำขอรออนุมัติอยู่แล้ว กรุณารอผลก่อนเสนอใหม่');
  const adjustment: Adjustment = {
    id: `SK-${crypto.randomUUID()}`, employeeId, year, changes, reason: reason.trim(), evidence: evidence.trim(),
    submittedBy: actor.id, submittedName: actor.name, submittedAt: now.toISOString(), status: 'pending',
  };
  return { ...state, adjustments: [...state.adjustments, adjustment] };
}
export function reviewAdjustment(state: SkillState, role: Role, id: string, decision: 'approved' | 'rejected', remark: string, now = new Date()): SkillState {
  if (role !== 'manager') throw new Error('เฉพาะผู้จัดการเท่านั้นที่อนุมัติได้');
  const adjustment = state.adjustments.find(a => a.id === id);
  if (!adjustment || adjustment.status !== 'pending') throw new Error('รายการนี้ได้รับการพิจารณาแล้วหรือไม่พบคำขอ');
  if (adjustment.submittedBy === ACTORS.manager.id || adjustment.employeeId === ACTORS.manager.employeeId)
    throw new Error('ไม่สามารถอนุมัติคำขอของตนเองได้');
  if (decision === 'rejected' && !remark.trim()) throw new Error('กรุณาระบุเหตุผลที่ไม่อนุมัติ');
  if (decision === 'approved') {
    if (adjustment.year !== bangkokYear(now)) throw new Error('คำขอข้ามปี กรุณาให้หัวหน้างานเสนอคะแนนใหม่สำหรับปีปัจจุบัน');
    const employee = employeesForYear(state, adjustment.year).find(e => e.id === adjustment.employeeId);
    if (!employee || adjustment.changes.some(c => (employee.scores[c.key] ?? 0) !== c.before))
      throw new Error('คะแนนปัจจุบันเปลี่ยนจากที่เสนอ กรุณาปฏิเสธและให้หัวหน้าเสนอใหม่');
  }
  return { ...state, adjustments: state.adjustments.map(a => a.id === id ? {
    ...a, status: decision, reviewedBy: ACTORS.manager.id, reviewedName: ACTORS.manager.name,
    reviewedAt: now.toISOString(), remark: remark.trim(),
  } : a) };
}
