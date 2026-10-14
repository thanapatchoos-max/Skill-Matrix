import { ACTORS, bangkokYear, employeesForYear, initialState, SKILL_WIS } from './phase1Core';
import type { Adjustment, SkillLevel, SkillState } from './phase1Core';
import { bangkokDate } from './trainingCore';
import type { TrainingRequest, TrainingStatus } from './trainingCore';
import { populateTeamDemo } from './teamScope';

export const DEMO_REVISION = 2;
export type DemoSkillState = SkillState & { demoRevision?: number; teamDemoRevision?: number };

function teamExamples() {
  const template = initialState().snapshots[0].employees.find(employee => employee.id === 'EMP001')!;
  return [
    { id: 'EMP012', name: 'นายณัฐพงศ์ ทดสอบดี', position: 'QC Test Technician', offset: 1 },
    { id: 'EMP013', name: 'นางสาวพิมพ์ชนก ละเอียดดี', position: 'QC Test Inspector', offset: 2 },
  ].map(person => ({ ...structuredClone(template), id: person.id, name: person.name, position: person.position, role: person.position, teamId: 'QC-B', supervisorId: 'EMP-C02', scores: Object.fromEntries(Object.keys(template.scores).map((key, index) => [key, (index + person.offset) % 4])) }));
}

// Merge once, preserving saved profiles, scores and decisions in existing browsers.
export function populateSkillDemo(saved: DemoSkillState = initialState(), now = new Date()): DemoSkillState {
  if ((saved.demoRevision ?? 0) >= DEMO_REVISION) return populateTeamDemo(saved, teamExamples());
  const year = bangkokYear(now);
  const baseline = initialState().snapshots[0].employees;
  const historical = [year - 3, year - 2, year - 1].filter(y => !saved.snapshots.some(s => s.year === y)).map(y => ({
    year: y,
    employees: baseline.map((employee, person) => ({ ...structuredClone(employee), scores: Object.fromEntries(Object.entries(employee.scores).map(([key, score], index) => [key, Math.max(0, score - Math.max(0, year - y - 1) - ((index + person) % 4 === 0 ? 1 : 0))])) })),
  }));
  const employees = employeesForYear(saved, year);
  const examples: Adjustment[] = [];
  const specs = [
    { employeeId: 'EMP004', key: 'QCW001-002_C', status: 'pending' as const, month: 10 },
    { employeeId: 'EMP011', key: 'QCW004-001_D', status: 'pending' as const, month: 10 },
    { employeeId: 'EMP001', key: 'QCW001-002_C', status: 'approved' as const, month: 2 },
    { employeeId: 'EMP004', key: 'QCW002-001_D', status: 'approved' as const, month: 5 },
    { employeeId: 'EMP011', key: 'QCW001-001_B', status: 'rejected' as const, month: 7 },
  ];
  for (const [index, spec] of specs.entries()) {
    const employee = employees.find(e => e.id === spec.employeeId);
    const id = `SK-DEMO-${year}-${index + 1}`;
    if (!employee || saved.adjustments.some(a => a.id === id || (a.status === 'pending' && a.employeeId === spec.employeeId && a.changes.some(c => c.key === spec.key)))) continue;
    const score = employee.scores[spec.key] ?? 0;
    const pending = spec.status === 'pending';
    const submittedAt = pending ? new Date(now.getTime() - (index + 1) * 86400000).toISOString() : `${year}-${String(spec.month).padStart(2, '0')}-05T02:00:00.000Z`;
    examples.push({ id, employeeId: employee.id, year, changes: [{ key: spec.key, before: spec.status === 'approved' ? Math.max(0, score - 1) : score, after: (spec.status === 'approved' ? score : score === 3 ? 2 : score + 1) as SkillLevel }], reason: 'ข้อมูลตัวอย่าง: ทบทวนความสามารถจากการปฏิบัติงานและผลฝึกอบรม', evidence: `แบบประเมิน OJT-DEMO-${index + 1} / บันทึกการสังเกตงาน`, submittedBy: ACTORS.chief.id, submittedName: ACTORS.chief.name, submittedAt, status: spec.status, ...(!pending ? { reviewedBy: ACTORS.manager.id, reviewedName: ACTORS.manager.name, reviewedAt: `${year}-${String(spec.month).padStart(2, '0')}-07T03:00:00.000Z`, remark: spec.status === 'approved' ? 'ตรวจหลักฐานและยืนยันระดับความสามารถแล้ว' : 'ขอหลักฐานการทำงานด้วยตนเองเพิ่มเติม' } : {}) });
  }
  return populateTeamDemo({ ...saved, demoRevision: DEMO_REVISION, snapshots: [...historical, ...saved.snapshots], adjustments: [...examples, ...saved.adjustments] }, teamExamples());
}

export function trainingDemo(now = new Date()): TrainingRequest[] {
  const employees = initialState().snapshots[0].employees;
  const day = (offset: number) => bangkokDate(new Date(now.getTime() + offset * 86400000));
  const stamp = (offset: number) => new Date(now.getTime() + offset * 86400000).toISOString();
  const specs: { employeeId: string; wiCode: string; type: string; status: TrainingStatus; offset: number }[] = [
    { employeeId: 'EMP001', wiCode: 'QCW002-001', type: 'C', status: 'requested', offset: -3 },
    { employeeId: 'EMP004', wiCode: 'QCW001-001', type: 'B', status: 'requested', offset: -2 },
    { employeeId: 'EMP001', wiCode: 'QCW001-002', type: 'B', status: 'scheduled', offset: -7 },
    { employeeId: 'EMP011', wiCode: 'QCW004-001', type: 'D', status: 'scheduled', offset: -5 },
    { employeeId: 'EMP001', wiCode: 'QCW004-001', type: 'C', status: 'pending-manager', offset: -12 },
    { employeeId: 'EMP004', wiCode: 'QCW001-002', type: 'C', status: 'pending-manager', offset: -10 },
    { employeeId: 'EMP001', wiCode: 'QCW004-001', type: 'A', status: 'approved', offset: -35 },
    { employeeId: 'EMP001', wiCode: 'QCW001-001', type: 'D', status: 'failed', offset: -22 },
    { employeeId: 'EMP001', wiCode: 'QCW002-001', type: 'D', status: 'rejected-manager', offset: -18 },
    { employeeId: 'EMP001', wiCode: 'QCW001-002', type: 'D', status: 'rejected-chief', offset: -15 },
    { employeeId: 'EMP008', wiCode: '', type: '', status: 'approved', offset: -30 },
    { employeeId: 'EMP005', wiCode: '', type: '', status: 'pending-manager', offset: -9 },
  ];
  return specs.map((spec, index) => {
    const employee = employees.find(e => e.id === spec.employeeId)!;
    const wi = SKILL_WIS.find(w => w.code === spec.wiCode) ?? SKILL_WIS.find(w => w.department === employee.department)!;
    const evaluated = ['pending-manager', 'approved', 'failed', 'rejected-manager'].includes(spec.status);
    const reviewed = !['requested', 'rejected-chief'].includes(spec.status);
    return { id: index === 0 ? 'TR-DEMO-001' : `TR-DEMO-${String(index + 1).padStart(3, '0')}`, employeeId: employee.id, employeeName: employee.name, department: employee.department, wiCode: wi.code, skillType: spec.type || wi.types[0].code, desiredDate: day(spec.status === 'requested' ? 2 : spec.offset + 3), reason: `ข้อมูลตัวอย่าง: ${index % 2 ? 'เตรียมพนักงานสำรองให้สามารถทำงานได้ด้วยตนเอง' : 'ทบทวนมาตรฐานและเพิ่มความชำนาญตามงานที่ได้รับมอบหมาย'}`, submittedAt: stamp(spec.offset), status: spec.status,
      ...(reviewed ? { scheduledDate: day(spec.status === 'scheduled' ? (index === 2 ? -1 : 3) : spec.offset + 3), chiefName: ACTORS.chief.name, chiefReviewedAt: stamp(spec.offset + 1), chiefRemark: 'จัดผู้สอนและเตรียมแบบประเมินภาคปฏิบัติแล้ว' } : {}),
      ...(spec.status === 'rejected-chief' ? { chiefName: ACTORS.chief.name, chiefReviewedAt: stamp(spec.offset + 1), chiefRemark: 'ผู้สอนติดงานตรวจรับ ขอให้ยื่นคำขอใหม่ในรอบถัดไป' } : {}),
      ...(evaluated ? { theoryScore: spec.status === 'failed' ? 72 : 85 + index % 10, practicalScore: 88 + index % 8, evaluatedAt: stamp(spec.offset + 4), evaluationNote: `แบบประเมิน OJT-DEMO-${index + 1}: ${spec.status === 'failed' ? 'ทบทวนทฤษฎีและสอบใหม่' : 'ผ่านการสาธิตงานและตรวจตามรายการมาตรฐาน'}` } : {}),
      ...(['approved', 'rejected-manager'].includes(spec.status) ? { managerName: ACTORS.manager.name, managerReviewedAt: stamp(spec.offset + 5), managerRemark: spec.status === 'approved' ? 'ตรวจผลประเมินครบถ้วน รับรองผลฝึกอบรม' : 'ขอแนบหลักฐานการตรวจชิ้นงานเพิ่มเติมก่อนรับรอง' } : {}),
    };
  });
}

export function populateTrainingDemo(saved: TrainingRequest[], now = new Date()) {
  const active = ['requested', 'scheduled', 'pending-manager'];
  return [...saved, ...trainingDemo(now).filter(example => !saved.some(record => record.id === example.id || (active.includes(example.status) && active.includes(record.status) && record.employeeId === example.employeeId && record.wiCode === example.wiCode && record.skillType === example.skillType)))];
}
