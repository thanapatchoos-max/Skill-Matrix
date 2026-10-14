import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowDownToLine, FileDown, LoaderCircle, ClipboardCheck } from 'lucide-react';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { downloadAssessmentPdf } from '../lib/assessmentPdf';
import { assessmentPanel } from '../lib/assessmentFormat';

export function AssessmentHeader({title,description,year,filename,definition,onCsv,disabled}:{title:string;description:string;year:number;filename:string;definition:()=>TDocumentDefinitions;onCsv:()=>void;disabled:boolean}) {
  const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [message,setMessage]=useState('');
  async function exportPdf(){if(busy)return;setBusy(true);setError('');setMessage('');try{await downloadAssessmentPdf(filename,definition());setMessage('ดาวน์โหลดรายงาน PDF แล้ว · พิมพ์บนกระดาษ A4 ด้วยขนาดจริง (100%)');}catch(e){setError(`ส่งออก PDF ไม่สำเร็จ: ${e instanceof Error?e.message:'กรุณาลองใหม่อีกครั้ง'}`);}finally{setBusy(false);}}
  return <><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-blue-700"><ClipboardCheck size={16}/>สรุปเพื่อประกอบการประเมิน · ปี {year}</p><h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p></div><div className="flex flex-wrap gap-2 print:hidden"><button disabled={disabled||busy} onClick={onCsv} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-40"><ArrowDownToLine size={16}/>ส่งออก CSV</button><button disabled={disabled||busy} onClick={exportPdf} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-40">{busy?<LoaderCircle size={17} className="animate-spin"/>:<FileDown size={17}/>} {busy?'กำลังสร้าง PDF…':'ส่งออก PDF'}</button></div></div>{error&&<p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}{message&&<p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 print:hidden">{message}</p>}</>;
}
export function AssessmentMetric({label,value,note,accent=false}:{label:string;value:ReactNode;note:string;accent?:boolean}) {
  return <div className={`${assessmentPanel} p-5 ${accent?'border-blue-200 bg-blue-50/60':''}`}><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p><p className="mt-2 text-xs leading-5 text-slate-500">{note}</p></div>;
}
export function ScoreProgress({total,maximum}:{total:number;maximum:number}) {
  const percent=maximum?total/maximum*100:0;
  return <div className="flex min-w-32 items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="คะแนนเทียบคะแนนเต็ม" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Number(percent.toFixed(1))}><div className="h-full rounded-full bg-blue-500" style={{width:`${percent}%`}}/></div><span className="w-12 text-right text-xs font-semibold text-slate-600">{maximum?`${percent.toFixed(1)}%`:'—'}</span></div>;
}
export function AssessmentFormula({section=false}:{section?:boolean}) {
  return <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs leading-6 text-blue-900"><strong>วิธีอ่านคะแนน:</strong> คะแนนรวม = ผลรวมระดับสกิลที่ยืนยันแล้ว · {section?'คะแนนเฉลี่ยต่อคน = คะแนนรวม ÷ จำนวนพนักงาน · ':''}คะแนนเฉลี่ยต่อสกิล = คะแนนรวม ÷ จำนวนสกิล (ระดับ 0–3) · สัดส่วนคะแนน = คะแนนรวม ÷ คะแนนเต็ม × 100<br/><span className="text-blue-700">ใช้สรุปความสามารถเพื่อประกอบการประเมิน โดยไม่มีการกำหนดเกณฑ์ผ่านหรือปรับคะแนนจากหน้านี้</span></div>;
}
export function LevelLegend(){return <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">{[['#94a3b8','0 · ยังทำไม่ได้'],['#f59e0b','1 · ต้องมีผู้ดูแล'],['#3b82f6','2 · ทำเองได้'],['#10b981','3 · สอนได้']].map(([color,label])=><span key={label} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{backgroundColor:color}}/>{label}</span>)}</div>;}
