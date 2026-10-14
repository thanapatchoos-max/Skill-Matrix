import { ACTORS, SKILL_WIS } from './phase1Core';
import type { Role } from './phase1Core';

export type TrainingStatus = 'requested' | 'scheduled' | 'rejected-chief' | 'pending-manager' | 'approved' | 'rejected-manager' | 'failed';
export interface TrainingRequest {
  id: string; employeeId: string; employeeName: string; department: string;
  wiCode: string; skillType: string; desiredDate: string; reason: string;
  submittedAt: string; status: TrainingStatus;
  scheduledDate?: string; chiefName?: string; chiefRemark?: string; chiefReviewedAt?: string;
  theoryScore?: number; practicalScore?: number; evaluatedAt?: string; evaluationNote?: string;
  managerName?: string; managerRemark?: string; managerReviewedAt?: string;
}
export const TRAINING_STATUS: Record<TrainingStatus, string> = {
  requested: 'รอหัวหน้าตรวจคำขอ', scheduled: 'อนุมัติคำขอแล้ว / รออบรม',
  'rejected-chief': 'หัวหน้าไม่อนุมัติคำขอ', 'pending-manager': 'รอผู้จัดการรับรองผล',
  approved: 'รับรองผลแล้ว', 'rejected-manager': 'ผู้จัดการไม่รับรองผล', failed: 'ไม่ผ่านการประเมิน',
};
export function bangkokDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {timeZone: 'Asia/Bangkok', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(date);
  return `${parts.find(p=>p.type==='year')!.value}-${parts.find(p=>p.type==='month')!.value}-${parts.find(p=>p.type==='day')!.value}`;
}
function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
}
export function initialTraining(): TrainingRequest[] {
  return [{id:'TR-DEMO-001', employeeId:'EMP001', employeeName:ACTORS.staff.name, department:'QC Section', wiCode:'QCW002-001', skillType:'C', desiredDate:bangkokDate(), reason:'ขอทบทวนการจัดทำรายงานตรวจสอบโครงสร้าง', submittedAt:new Date().toISOString(), status:'requested'}];
}
export function requestTraining(records: TrainingRequest[], role: Role, form: {wiCode:string; skillType:string; desiredDate:string; reason:string}, now = new Date()): TrainingRequest[] {
  if(role!=='staff') throw new Error('หน้ายื่นคำขอสำหรับพนักงานเท่านั้น');
  const wi=SKILL_WIS.find(w=>w.code===form.wiCode && w.department===ACTORS.staff.department);
  if(!wi || !wi.types.some(t=>t.code===form.skillType)) throw new Error('เลือก W/I และประเภทสกิลในแผนกของคุณ');
  if(!validDate(form.desiredDate) || form.desiredDate<bangkokDate(now)) throw new Error('เลือกวันที่ตั้งแต่วันนี้เป็นต้นไป');
  if(!form.reason.trim()) throw new Error('กรุณาระบุเหตุผลขอฝึกอบรม');
  if(records.some(r=>r.employeeId===ACTORS.staff.employeeId && r.wiCode===form.wiCode && r.skillType===form.skillType && ['requested','scheduled','pending-manager'].includes(r.status))) throw new Error('มีคำขอฝึกอบรมสกิลนี้อยู่ระหว่างดำเนินการแล้ว');
  return [...records,{...form, reason:form.reason.trim(), id:`TR-${crypto.randomUUID()}`, employeeId:ACTORS.staff.employeeId, employeeName:ACTORS.staff.name, department:ACTORS.staff.department, submittedAt:now.toISOString(), status:'requested'}];
}
export function reviewTrainingRequest(records: TrainingRequest[], role: Role, id: string, approve: boolean, date: string, remark: string, now = new Date()): TrainingRequest[] {
  if(role!=='chief') throw new Error('เฉพาะหัวหน้าที่ตรวจคำขอฝึกอบรมได้');
  const request=records.find(r=>r.id===id);
  if(!request || request.status!=='requested' || request.department!==ACTORS.chief.department) throw new Error('ไม่พบคำขอที่รอหัวหน้าตรวจในแผนกของคุณ');
  if(approve && (!validDate(date) || date<bangkokDate(now))) throw new Error('กำหนดวันอบรมตั้งแต่วันนี้เป็นต้นไป');
  if(!approve && !remark.trim()) throw new Error('ระบุเหตุผลที่ไม่อนุมัติ');
  return records.map(r=>r.id===id ? {...r, status:approve?'scheduled':'rejected-chief', scheduledDate:approve?date:undefined, chiefName:ACTORS.chief.name, chiefRemark:remark.trim(), chiefReviewedAt:now.toISOString()} : r);
}
export function evaluateTraining(records: TrainingRequest[], role: Role, id: string, theory: number, practical: number, note: string, now = new Date()): TrainingRequest[] {
  if(role!=='chief') throw new Error('เฉพาะหัวหน้างานที่บันทึกผลการประเมินได้');
  const request=records.find(r=>r.id===id);
  if(!request || request.status!=='scheduled' || request.department!==ACTORS.chief.department) throw new Error('ไม่พบรายการฝึกอบรมที่รอประเมิน');
  if(request.scheduledDate!>bangkokDate(now)) throw new Error('บันทึกผลได้ตั้งแต่วันอบรมที่กำหนด');
  if([theory,practical].some(n=>!Number.isFinite(n)||n<0||n>100)) throw new Error('คะแนนต้องอยู่ระหว่าง 0–100');
  if(!note.trim()) throw new Error('ระบุผลการประเมินหรือหลักฐานอ้างอิง');
  return records.map(r=>r.id===id ? {...r, theoryScore:theory, practicalScore:practical, evaluationNote:note.trim(), evaluatedAt:now.toISOString(), status:theory>=80&&practical>=80?'pending-manager':'failed'} : r);
}
export function certifyTraining(records: TrainingRequest[], role: Role, id: string, approve: boolean, remark: string, now = new Date()): TrainingRequest[] {
  if(role!=='manager') throw new Error('เฉพาะผู้จัดการที่รับรองผลอบรมได้');
  const request=records.find(r=>r.id===id);
  if(!request || request.status!=='pending-manager') throw new Error('ไม่พบผลอบรมที่รอรับรอง');
  if(!approve && !remark.trim()) throw new Error('ระบุเหตุผลที่ไม่รับรอง');
  return records.map(r=>r.id===id ? {...r,status:approve?'approved':'rejected-manager',managerName:ACTORS.manager.name,managerRemark:remark.trim(),managerReviewedAt:now.toISOString()} : r);
}
