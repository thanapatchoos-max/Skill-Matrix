import io

new_code = """import React, { useState } from 'react';
import { Target, TrendingUp, CheckCircle, AlertCircle, ChevronRight, User, Plus, Save, Clock, ClipboardCheck, BarChart2 } from 'lucide-react';

interface AutoEvaluation {
  id: string;
  employee: string;
  wi: string;
  skillType: string;
  currentLevel: number;
  proposedLevel: number;
  jobsDone: number;
  jobTarget: number;
  reworkPercent: number;
  reworkTarget: number;
  status: 'gathering' | 'ready_to_submit' | 'pending_chief' | 'pending_manager' | 'completed';
}

const mockEvaluations: AutoEvaluation[] = [
  { id: 'EVAL-001', employee: 'คุณ (ผู้ใช้งานปัจจุบัน)', wi: 'QCW001-001', skillType: 'A - Circuit Connecting', currentLevel: 1, proposedLevel: 2, jobsDone: 24, jobTarget: 20, reworkPercent: 0, reworkTarget: 5, status: 'ready_to_submit' },
  { id: 'EVAL-002', employee: 'คุณ (ผู้ใช้งานปัจจุบัน)', wi: 'PROD-010-01', skillType: 'C - Assembly', currentLevel: 1, proposedLevel: 2, jobsDone: 15, jobTarget: 20, reworkPercent: 1.5, reworkTarget: 5, status: 'gathering' },
  { id: 'EVAL-003', employee: 'นายสมชาย ใจดี', wi: 'QCW001-001', skillType: 'A - Circuit Connecting', currentLevel: 1, proposedLevel: 2, jobsDone: 24, jobTarget: 20, reworkPercent: 0, reworkTarget: 5, status: 'pending_chief' },
  { id: 'EVAL-004', employee: 'นางสาวแนน สุขใจ', wi: 'ENG-M-001', skillType: 'B - Machine Operator', currentLevel: 2, proposedLevel: 3, jobsDone: 35, jobTarget: 20, reworkPercent: 0.5, reworkTarget: 1, status: 'pending_chief' },
  { id: 'EVAL-005', employee: 'นายกฤต พร้อมใจ', wi: 'PROD-020-02', skillType: 'E - Safety', currentLevel: 1, proposedLevel: 2, jobsDone: 5, jobTarget: 20, reworkPercent: 0, reworkTarget: 5, status: 'gathering' },
];

const mockManualRequests = [
  { id: 'MAN-005', employee: 'นายวิชัย เก่งดี', wi: 'ENG-M-002', skillType: 'D - Data Analysis', currentLevel: 1, proposedLevel: 2, reason: 'มีภาวะผู้นำ สามารถแก้ปัญหาหน้างานได้ด้วยตนเองอย่างชำนาญ (ยื่นเสนอพิเศษ)', status: 'Pending Manager' }
];

export default function SkillEvaluation({ userRole }: { userRole: string }) {
  const isStaff = userRole === 'staff' || userRole === 'clerk';
  const isChief = userRole === 'chief' || userRole === 'admin';
  const isManager = userRole === 'manager';

  const [evaluations, setEvaluations] = useState<AutoEvaluation[]>(mockEvaluations);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Staff Data
  const myData = evaluations.filter(e => e.employee === 'คุณ (ผู้ใช้งานปัจจุบัน)');
  
  // Chief Data
  const pendingChiefData = evaluations.filter(e => e.status === 'pending_chief');
  const allStaffData = evaluations.filter(e => e.employee !== 'คุณ (ผู้ใช้งานปัจจุบัน)');

  const handleStaffSubmit = (id: string) => {
    setEvaluations(evals => evals.map(e => e.id === id ? { ...e, status: 'pending_chief' } : e));
  };

  const handleChiefApprove = (id: string) => {
    setEvaluations(evals => evals.map(e => e.id === id ? { ...e, status: 'pending_manager' } : e));
  };

  const ProgressBar = ({ current, target, isInverse = false, suffix = '' }: { current: number, target: number, isInverse?: boolean, suffix?: string }) => {
    // For Rework, lower is better. For Jobs, higher is better.
    let isPassed = false;
    let percent = 0;
    if (isInverse) {
      isPassed = current <= target;
      percent = Math.min((current / (target * 2)) * 100, 100); // just for visualization
    } else {
      isPassed = current >= target;
      percent = Math.min((current / target) * 100, 100);
    }
    const color = isPassed ? 'bg-emerald-500' : 'bg-amber-500';
    const textColor = isPassed ? 'text-emerald-600' : 'text-amber-600';

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500 font-medium">{isInverse ? `Target: น้อยกว่า ${target}${suffix}` : `Target: ${target}${suffix}`}</span>
          <span className={`font-bold ${textColor}`}>{current}{suffix}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp className="text-emerald-600" /> ระบบประเมินและขอเลื่อนระดับทักษะ (Level 1 &rarr; 3)
        </h1>
        <p className="text-slate-500 text-sm mt-1">ประเมินผลจากชั่วโมงการทำงาน (Working Record) และให้ Chief ตรวจสอบก่อนส่ง Manager อนุมัติ</p>
      </div>

      {/* ========================================================= */}
      {/* 1. STAFF VIEW: My Progress (Visible only to Staff) */}
      {/* ========================================================= */}
      {(isStaff || userRole === 'admin') && (
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-blue-200 bg-blue-50 flex items-center justify-between">
            <h3 className="font-bold text-blue-900 flex items-center gap-2"><User size={18}/> ความคืบหน้าทักษะของฉัน (My Skill Progress)</h3>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">พนักงาน (Staff)</span>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {myData.map(ev => (
              <div key={ev.id} className={`border rounded-xl p-4 flex flex-col gap-4 ${ev.status === 'ready_to_submit' ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800">{ev.wi}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{ev.skillType}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-600 text-xs">Level {ev.currentLevel}</span>
                    <ChevronRight size={14} className="text-slate-400" />
                    <span className="font-bold text-blue-600 text-xs">Level {ev.proposedLevel}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <ProgressBar current={ev.jobsDone} target={ev.jobTarget} suffix=" Jobs" />
                  <ProgressBar current={ev.reworkPercent} target={ev.reworkTarget} isInverse={true} suffix="%" />
                </div>

                <div className="pt-3 border-t border-slate-100 mt-auto">
                  {ev.status === 'gathering' && (
                    <div className="text-center text-xs font-bold text-slate-400 bg-slate-50 py-2 rounded-lg border border-slate-100">
                      กำลังเก็บเกี่ยวประสบการณ์...
                    </div>
                  )}
                  {ev.status === 'ready_to_submit' && (
                    <button onClick={() => handleStaffSubmit(ev.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-sm animate-pulse">
                      <CheckCircle size={16}/> หลอดเต็มแล้ว! ส่งคำขอให้ Chief ประเมิน
                    </button>
                  )}
                  {ev.status === 'pending_chief' && (
                    <div className="text-center text-xs font-bold text-blue-600 bg-blue-50 py-2 rounded-lg border border-blue-100 flex items-center justify-center gap-2">
                      <Clock size={14}/> ส่งคำขอแล้ว รอ Chief ยืนยัน
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CHIEF VIEW: Pending Requests from Staff */}
      {/* ========================================================= */}
      {(isChief) && (
        <div className="bg-white rounded-xl border border-emerald-200 shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-emerald-200 bg-emerald-50 flex items-center justify-between">
            <h3 className="font-bold text-emerald-900 flex items-center gap-2"><ClipboardCheck size={18}/> คำขอเลื่อนระดับอัตโนมัติ (จากพนักงาน)</h3>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">หัวหน้างาน (Chief)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wide">
                <tr><th className="px-4 py-3">พนักงาน</th><th className="px-4 py-3">W/I & Skill</th><th className="px-4 py-3 text-center">ระดับ</th><th className="px-4 py-3 w-64">สรุปผลงาน (Working Record)</th><th className="px-4 py-3 text-center">จัดการ</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingChiefData.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400">ไม่มีคำขอที่รอตรวจสอบ</td></tr>
                ) : pendingChiefData.map(ev => (
                  <tr key={ev.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-800">{ev.employee}</td>
                    <td className="px-4 py-3"><div className="font-bold text-slate-700">{ev.wi}</div><div className="text-[11px] text-slate-500">{ev.skillType}</div></td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center justify-center gap-1 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        <span className="font-bold text-slate-500">L{ev.currentLevel}</span> <ChevronRight size={12}/> <span className="font-bold text-emerald-600">L{ev.proposedLevel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">จำนวนงาน:</span> <span className="font-bold text-emerald-600">{ev.jobsDone}/{ev.jobTarget}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">ของเสีย (Rework):</span> <span className="font-bold text-emerald-600">{ev.reworkPercent}% (เป้า &lt;{ev.reworkTarget}%)</span></div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleChiefApprove(ev.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors w-full flex items-center justify-center gap-1">
                        <CheckCircle size={14}/> ตรวจสอบ & ส่ง Manager
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SHARED VIEW: Progress Monitor & Manual Request */}
      {/* ========================================================= */}
      {(!isStaff) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* STAFF PROGRESS MONITOR (Chief & Manager) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><BarChart2 size={18}/> ติดตามความคืบหน้าพนักงาน (Staff Progress Monitor)</h3>
              <p className="text-xs text-slate-500 mt-1">ดูสถานะหลอดประสบการณ์ของพนักงานทั้งหมดในแผนก</p>
            </div>
            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full text-sm text-left">
                <thead className="bg-white sticky top-0 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                  <tr><th className="px-4 py-2">พนักงาน / W/I</th><th className="px-4 py-2">Progress</th><th className="px-4 py-2 text-center">สถานะ</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allStaffData.map(ev => (
                    <tr key={ev.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-700 text-xs">{ev.employee}</div>
                        <div className="text-[10px] text-slate-500">{ev.wi} (L{ev.currentLevel})</div>
                      </td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <ProgressBar current={ev.jobsDone} target={ev.jobTarget} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {ev.status === 'gathering' ? (
                          <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded font-bold">เก็บ Exp</span>
                        ) : ev.status === 'pending_chief' ? (
                          <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded font-bold">รอ Chief</span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-bold">ส่ง Manager</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MANUAL PROPOSED (Chief & Manager) */}
          <div className="bg-white rounded-xl border border-purple-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-purple-200 bg-purple-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-purple-900 flex items-center gap-2"><User size={18}/> ยื่นเสนอพิเศษ (Manual Proposed)</h3>
                <p className="text-xs text-purple-700 mt-1">Chief ยื่นเสนอเลื่อนระดับด้วยตนเอง (นอกเหนือเงื่อนไข)</p>
              </div>
              {isChief && (
                <button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-bold text-[11px] shadow-sm">
                  <Plus size={14} /> สร้างคำขอ
                </button>
              )}
            </div>

            {isFormOpen && isChief && (
              <div className="p-4 border-b border-purple-100 bg-purple-50/30 text-sm">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div><label className="text-[11px] font-bold text-slate-700 block mb-1">พนักงาน</label><select className="w-full border rounded p-1.5 text-xs"><option>นางสาวแนน สุขใจ</option></select></div>
                  <div><label className="text-[11px] font-bold text-slate-700 block mb-1">W/I</label><select className="w-full border rounded p-1.5 text-xs"><option>ENG-M-001</option></select></div>
                </div>
                <div><label className="text-[11px] font-bold text-slate-700 block mb-1">เหตุผลสนับสนุน</label><textarea rows={2} className="w-full border rounded p-1.5 text-xs resize-none" placeholder="เช่น ช่วยสอนงานเพื่อนร่วมงานได้..." /></div>
                <div className="mt-3 flex justify-end"><button onClick={() => setIsFormOpen(false)} className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"><Save size={14}/> บันทึกส่ง Manager</button></div>
              </div>
            )}

            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full text-sm text-left">
                <thead className="bg-white sticky top-0 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                  <tr><th className="px-4 py-2">ข้อมูลคำขอ</th><th className="px-4 py-2">เหตุผล (โดย Chief)</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockManualRequests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-700 text-xs">{req.employee}</div>
                        <div className="text-[10px] text-slate-500">{req.wi}</div>
                        <div className="text-[10px] font-bold text-purple-600 mt-1">L{req.currentLevel} &rarr; L{req.proposedLevel}</div>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-600 leading-relaxed">
                        {req.reason}
                        <div className="mt-1"><span className="inline-block bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 font-bold text-[9px]">รออนุมัติจาก Manager</span></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
"""

with io.open("src/pages/SkillEvaluation.tsx", "w", encoding="utf-8") as f:
    f.write(new_code)

