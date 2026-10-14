import type { ReactNode } from 'react';
import { TRAINING_STATUS } from '../data/trainingCore';
import type { TrainingRequest } from '../data/trainingCore';
import { panelClass } from './Phase1Shared';
import { SKILL_WIS } from '../data/phase1Core';
export default function TrainingRecordCard({record,children}:{record:TrainingRequest;children?:ReactNode}) {
  const wi=SKILL_WIS.find(w=>w.code===record.wiCode);
  const completed=record.status==='approved';
  const rejected=['rejected-chief','rejected-manager','failed'].includes(record.status);
  return <article className={`${panelClass} space-y-4 p-5`}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-bold text-slate-800">{record.employeeName}</h2><p className="mt-1 text-xs text-slate-500">{record.employeeId} · {record.department}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${completed?'bg-emerald-50 text-emerald-700':rejected?'bg-red-50 text-red-700':'bg-amber-50 text-amber-700'}`}>{TRAINING_STATUS[record.status]}</span></div><div><p className="text-sm font-semibold text-blue-800">{record.wiCode} · Type {record.skillType}</p><p className="mt-1 text-sm text-slate-500">{wi?.name}</p></div><div className="grid gap-3 text-sm md:grid-cols-2"><p><span className="text-slate-500">วันที่เสนอ: </span>{record.desiredDate}</p>{record.scheduledDate&&<p><span className="text-slate-500">วันนัดอบรม: </span>{record.scheduledDate}</p>}</div><p className="text-sm text-slate-600">เหตุผล: {record.reason}</p>{record.theoryScore!==undefined&&<div className="grid gap-3 rounded-lg bg-slate-50 p-3 text-sm md:grid-cols-2"><p>ทฤษฎี <strong>{record.theoryScore} / 100</strong></p><p>ปฏิบัติ <strong>{record.practicalScore} / 100</strong></p></div>}{record.evaluationNote&&<p className="text-sm text-slate-600">ผลประเมิน / หลักฐาน: {record.evaluationNote}</p>}{record.chiefRemark&&<p className="text-sm text-slate-600">ความเห็นหัวหน้า: {record.chiefRemark}</p>}{record.managerRemark&&<p className="text-sm text-slate-600">ความเห็นผู้จัดการ: {record.managerRemark}</p>}{children}</article>;
}
