import type { Employee, SkillState } from './phase1Core';

export const DEMO_TEAMS = [
  { id: 'QC-A', name: 'ทีมตรวจสอบคุณภาพ A', department: 'QC Section', supervisorId: 'EMP-C01', supervisorName: 'นางสาวอรุณี รักดี' },
  { id: 'QC-B', name: 'ทีมทดสอบคุณภาพ B', department: 'QC Section', supervisorId: 'EMP-C02', supervisorName: 'นายวิชัย ตรวจดี' },
  { id: 'PROD-A', name: 'ทีมผลิตและประกอบ', department: 'Production', supervisorId: 'EMP-C03', supervisorName: 'นายธนา งานดี' },
  { id: 'ENG-A', name: 'ทีมวิศวกรรมและสอบเทียบ', department: 'Engineering', supervisorId: 'EMP-C04', supervisorName: 'นางสาวกมลวรรณ เที่ยงตรง' },
  { id: 'QC-MGMT', name: 'หัวหน้างานและผู้จัดการ', department: 'QC Section', supervisorId: '', supervisorName: '' },
];
const assignments: Record<string, string> = { EMP001: 'QC-A', EMP004: 'QC-A', EMP011: 'QC-A', EMP002: 'QC-MGMT', EMP003: 'QC-MGMT', EMP012: 'QC-B', EMP013: 'QC-B', EMP008: 'PROD-A', EMP009: 'PROD-A', EMP005: 'ENG-A', EMP010: 'ENG-A' };

export function demoMembership(employee: Employee): Pick<Employee, 'teamId' | 'supervisorId'> {
  const team = DEMO_TEAMS.find(team => team.id === assignments[employee.id] && team.department === employee.department);
  return team ? { teamId: team.id, supervisorId: team.supervisorId } : {};
}
export function employeeTeam(employee: Employee) {
  const id = employee.teamId ?? demoMembership(employee).teamId;
  return DEMO_TEAMS.find(team => team.id === id && team.department === employee.department);
}
export function isChiefReport(employee: Employee, chiefId = 'EMP-C01', department = 'QC Section') {
  const supervisor = employee.supervisorId ?? (employee.teamId === undefined ? demoMembership(employee).supervisorId : undefined);
  return employee.department === department && supervisor === chiefId && !['EMP002', 'EMP003'].includes(employee.id);
}
export function jobReportEmployees(employees: Employee[], role: string, department = 'ALL', teamId = 'ALL', employeeId = 'ALL') {
  const allowed = role === 'chief' ? employees.filter(employee => isChiefReport(employee)) : role === 'manager' || role === 'admin' ? employees : role === 'staff' ? employees.filter(employee => employee.id === 'EMP001') : [];
  return allowed.filter(employee => (department === 'ALL' || employee.department === department) && (teamId === 'ALL' || employeeTeam(employee)?.id === teamId) && (employeeId === 'ALL' || employee.id === employeeId));
}

// One-time additive migration for saved demo browsers; never replaces an existing person.
export function populateTeamDemo<T extends SkillState & { teamDemoRevision?: number }>(state: T, examples: Employee[]) {
  const needsExamples = state.snapshots.some(snapshot => examples.some(example => !snapshot.employees.some(employee => employee.id === example.id)));
  if ((state.teamDemoRevision ?? 0) >= 1 && !needsExamples) return state;
  return { ...state, teamDemoRevision: 1, snapshots: state.snapshots.map(snapshot => ({ ...snapshot, employees: [
    ...snapshot.employees.map(employee => ({ ...employee, ...(employee.teamId === undefined && employee.supervisorId === undefined ? demoMembership(employee) : {}) })),
    ...examples.filter(example => !snapshot.employees.some(employee => employee.id === example.id)).map(example => ({ ...structuredClone(example), scores: Object.fromEntries(Object.entries(example.scores).map(([key, score]) => [key, Math.max(0, score - Math.max(0, 2026 - snapshot.year))])) })),
  ] })) };
}
