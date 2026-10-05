import io
import re

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# I will rewrite the component structure directly to implement Modals and Two Tables.

new_component = """import React, { useState } from 'react';
import { BookOpen, Search, Calendar, Edit, CheckCircle, Plus, Send, XCircle, Save, X, ArrowRight, User, ClipboardList, CheckSquare } from 'lucide-react';

type RequestStatus = 'pending_request' | 'rejected_request' | 'waiting_for_test' | 'pending_manager' | 'completed';

interface OJTRequest {
  id: string;
  employee: string;
  employeeId: string;
  department: string;
  wi: string;
  skillType: string;
  requestedDate: string;
  status: RequestStatus;
  rejectReason?: string;
  theoryScore?: number;
  practicalScore?: number;
  testResult?: 'passed' | 'failed';
}

const initialMockData: OJTRequest[] = [
  { id: 'OJT-001', employee: 'นายสมชาย ใจดี', employeeId: 'EMP001', department: 'QC Section', wi: 'QCW001-001', skillType: 'A - Circuit Connecting', requestedDate: '2026-10-10', status: 'pending_request' },
  { id: 'OJT-002', employee: 'นางสาวแนน สุขใจ', employeeId: 'EMP005', department: 'Engineering', wi: 'ENG-M-001', skillType: 'B - Machine Operator', requestedDate: '2026-10-05', status: 'rejected_request', rejectReason: 'วันเวลาดังกล่าว Trainer ไม่ว่าง โปรดเลื่อนเป็นสัปดาห์หน้า' },
  { id: 'OJT-003', employee: 'นายกฤต พร้อมใจ', employeeId: 'EMP003', department: 'QC Section', wi: 'QCW001-002', skillType: 'C - Report', requestedDate: '2026-10-01', status: 'waiting_for_test' },
  { id: 'OJT-004', employee: 'นายวิชัย เก่งดี', employeeId: 'EMP004', department: 'Engineering', wi: 'ENG-M-002', skillType: 'D - Data Analysis', requestedDate: '2026-09-28', status: 'pending_manager', theoryScore: 90, practicalScore: 85, testResult: 'passed' },
];

export default function Training({ userRole }: { userRole: string }) {
  const isStaff = userRole === 'staff' || userRole === 'clerk';
  const isChief = userRole === 'chief' || userRole === 'admin';
  const isManager = userRole === 'manager';

  const [requests, setRequests] = useState<OJTRequest[]>(initialMockData);
  
  // Modal States
  const [activeModal, setActiveModal] = useState<'none' | 'request' | 'reject' | 'score'>('none');
  const [selectedReq, setSelectedReq] = useState<OJTRequest | null>(null);
  
  // Form Data
  const [formDate, setFormDate] = useState('');
  const [formRejectReason, setFormRejectReason] = useState('');
  const [theory, setTheory] = useState('');
  const [practical, setPractical] = useState('');

  // Handle Staff Submit Request
  const handleStaffRequest = () => {
    if (selectedReq) {
      setRequests(reqs => reqs.map(r => r.id === selectedReq.id ? { ...r, requestedDate: formDate, status: 'pending_request', rejectReason: undefined } : r));
    } else {
      const newReq: OJTRequest = {
        id: `OJT-00${requests.length + 1}`,
        employee: 'คุณ (ผู้ใช้งานปัจจุบัน)',
        employeeId: 'EMP-CURRENT',
        department: 'QC Section',
        wi: 'QCW001-001',
        skillType: 'A - Circuit Connecting',
        requestedDate: formDate,
        status: 'pending_request'
      };
      setRequests([newReq, ...requests]);
    }
    setActiveModal('none');
  };

  const handleReject = () => {
    if (selectedReq) {
      setRequests(reqs => reqs.map(r => r.id === selectedReq.id ? { ...r, status: 'rejected_request', rejectReason: formRejectReason } : r));
      setActiveModal('none');
    }
  };

  const handleAcceptSchedule = (id: string) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'waiting_for_test' } : r));
  };

  const handleSaveScore = () => {
    if (selectedReq) {
      const t = Number(theory);
      const p = Number(practical);
      const passed = (t >= 80 && p >= 80);
      setRequests(reqs => reqs.map(r => r.id === selectedReq.id ? { 
        ...r, theoryScore: t, practicalScore: p, testResult: passed ? 'passed' : 'failed',
        status: passed ? 'pending_manager' : 'waiting_for_test'
      } : r));
      setActiveModal('none');
    }
  };

  const requestTableData = requests.filter(r => r.status === 'pending_request' || r.status === 'rejected_request');
  const executionTableData = requests.filter(r => r.status !== 'pending_request' && r.status !== 'rejected_request');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24 relative">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" /> Training Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">จัดการระบบการฝึกอบรม (OJT) แบ่งส่วนคำขอและส่วนประเมินผลอย่างชัดเจน</p>
        </div>
        <div>
          {isStaff && (
            <button 
              onClick={() => { setSelectedReq(null); setFormDate(''); setActiveModal('request'); }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 font-bold text-sm"
            >
              <Plus size={18} /> ยื่นคำขอฝึกอบรม
            </button>
          )}
        </div>
      </div>

      {/* WORKFLOW BANNER (Kept same) */}
      <div className="bg-[#1e1b4b] rounded-2xl p-6 text-white shadow-lg border border-indigo-900/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2"><span className="text-blue-300 font-mono">13.</span> OJT Workflow (Level 0 &rarr; 1)</h2>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          {[
            { title: '1. Request', desc: 'พนักงานยื่นคำขอเสนอวันที่' },
            { title: '2. Approve Schedule', desc: 'Chief ยืนยันนัดหมาย' },
            { title: '3. Training & Score', desc: 'อบรมและบันทึกคะแนน' },
            { title: '4. Manager Approve', desc: 'ผู้จัดการอนุมัติเป็น Level 1' },
          ].map((step, idx, arr) => (
            <React.Fragment key={idx}>
              <div className="flex-1 w-full flex flex-col items-center justify-center p-3 rounded-xl border bg-white/10 border-white/20 shadow-inner">
                <div className="font-bold text-sm text-blue-100">{step.title}</div>
                <div className="text-[11px] text-blue-300 text-center mt-1">{step.desc}</div>
              </div>
              {idx < arr.length - 1 && <ArrowRight className="hidden md:block text-blue-400/50 flex-shrink-0" size={24} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TABLE 1: REQUESTS */}
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-blue-200 bg-blue-50">
            <h3 className="font-bold text-blue-900 flex items-center gap-2"><ClipboardList size={18}/> 1. ตารางคำขอฝึกอบรม (Requests)</h3>
            <p className="text-xs text-blue-700 mt-1">รายการรอยืนยันวันอบรม หรือถูกปฏิเสธให้เปลี่ยนวัน</p>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wide">
                <tr><th className="px-4 py-3">ข้อมูลคำขอ</th><th className="px-4 py-3">สถานะ</th><th className="px-4 py-3 text-center">จัดการ</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requestTableData.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-8 text-slate-400">ไม่มีรายการคำขอ</td></tr>
                ) : requestTableData.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{r.employee}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{r.wi} &middot; {r.skillType}</div>
                      <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs mt-1.5"><Calendar size={12}/> เสนอวันที่: {r.requestedDate}</div>
                    </td>
                    <td className="px-4 py-3">
                      {r.status === 'pending_request' ? (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[11px] font-bold border border-amber-200">รออนุมัติวัน</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[11px] font-bold border border-rose-200">ถูกปฏิเสธ</span>
                          <span className="text-[10px] text-rose-500 leading-tight line-clamp-2" title={r.rejectReason}>{r.rejectReason}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {isStaff && r.status === 'rejected_request' && (
                          <button onClick={() => { setSelectedReq(r); setFormDate(r.requestedDate); setActiveModal('request'); }} className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold w-full transition-colors">แก้ไข / ส่งใหม่</button>
                        )}
                        {isChief && r.status === 'pending_request' && (
                          <>
                            <button onClick={() => handleAcceptSchedule(r.id)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold w-full transition-colors flex justify-center gap-1"><CheckCircle size={14}/> ยืนยัน</button>
                            <button onClick={() => { setSelectedReq(r); setFormRejectReason(''); setActiveModal('reject'); }} className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold w-full transition-colors flex justify-center gap-1"><XCircle size={14}/> เลื่อน</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 2: EVALUATIONS */}
        <div className="bg-white rounded-xl border border-emerald-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-emerald-200 bg-emerald-50">
            <h3 className="font-bold text-emerald-900 flex items-center gap-2"><CheckSquare size={18}/> 2. ตารางประเมินผล (OJT Execution)</h3>
            <p className="text-xs text-emerald-700 mt-1">รายการที่ยืนยันวันแล้ว รอการอบรมและบันทึกคะแนน</p>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wide">
                <tr><th className="px-4 py-3">ข้อมูลการอบรม</th><th className="px-4 py-3">คะแนน</th><th className="px-4 py-3 text-center">จัดการ</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {executionTableData.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-8 text-slate-400">ไม่มีรายการประเมินผล</td></tr>
                ) : executionTableData.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{r.employee}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{r.wi} &middot; {r.skillType}</div>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs mt-1.5"><Calendar size={12}/> วันที่อบรม: {r.requestedDate}</div>
                    </td>
                    <td className="px-4 py-3">
                      {r.theoryScore ? (
                        <div className="text-[11px] font-bold">
                          <span className="text-slate-500">ทฤษฎี:</span> <span className={r.theoryScore >= 80 ? 'text-emerald-600' : 'text-rose-600'}>{r.theoryScore}%</span> <br/>
                          <span className="text-slate-500">ปฏิบัติ:</span> <span className={(r.practicalScore ?? 0) >= 80 ? 'text-emerald-600' : 'text-rose-600'}>{r.practicalScore}%</span>
                        </div>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[11px] font-bold border border-slate-200">รอคะแนน</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isChief && r.status === 'waiting_for_test' && (
                        <button onClick={() => { setSelectedReq(r); setTheory(''); setPractical(''); setActiveModal('score'); }} className="px-3 py-1.5 bg-[#0a2540] text-white hover:bg-[#0d3060] rounded-lg text-xs font-bold w-full transition-colors flex items-center justify-center gap-1"><Edit size={14}/> ลงคะแนน</button>
                      )}
                      {r.status === 'pending_manager' && (
                        <span className="px-2 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold flex justify-center items-center gap-1"><CheckCircle size={12}/> ส่งผลแล้ว</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODALS OVERLAY */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          
          {activeModal === 'request' && (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><BookOpen size={20}/> {selectedReq ? 'แก้ไขคำขอฝึกอบรม' : 'แบบฟอร์มยื่นคำขอฝึกอบรม (OJT Request)'}</h3>
                <button onClick={() => setActiveModal('none')} className="text-blue-200 hover:text-white transition-colors"><X size={24}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div><label className="text-sm font-bold text-slate-700 mb-1 block">มาตรฐาน W/I ที่ต้องการพัฒนา</label><select className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"><option>QCW001-001 : การทดสอบวัดความต้านทานฯ</option></select></div>
                <div><label className="text-sm font-bold text-slate-700 mb-1 block">ทักษะย่อย (Skill Type)</label><select className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"><option>A - Circuit Connecting</option></select></div>
                <div><label className="text-sm font-bold text-slate-700 mb-1 block">วันที่สะดวกเสนอขออบรม <span className="text-red-500">*</span></label><input type="date" value={formDate} onChange={e=>setFormDate(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"/></div>
              </div>
              <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setActiveModal('none')} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">ยกเลิก</button>
                <button onClick={handleStaffRequest} disabled={!formDate} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"><Send size={18}/> ยืนยันการยื่นคำขอ</button>
              </div>
            </div>
          )}

          {activeModal === 'reject' && (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-rose-600 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><XCircle size={20}/> แจ้งเลื่อน / ปฏิเสธวันอบรม</h3>
                <button onClick={() => setActiveModal('none')} className="text-rose-200 hover:text-white transition-colors"><X size={24}/></button>
              </div>
              <div className="p-6">
                <label className="text-sm font-bold text-slate-700 mb-2 block">เหตุผลที่ต้องการให้พนักงานเปลี่ยนวัน <span className="text-red-500">*</span></label>
                <textarea value={formRejectReason} onChange={e=>setFormRejectReason(e.target.value)} placeholder="เช่น Trainer ไม่ว่างติดงานโปรเจกต์ด่วน โปรดเลือกสัปดาห์หน้า..." className="w-full border border-slate-300 rounded-xl p-3 h-32 resize-none focus:ring-2 focus:ring-rose-500 outline-none"></textarea>
              </div>
              <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setActiveModal('none')} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">ยกเลิก</button>
                <button onClick={handleReject} disabled={!formRejectReason} className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50"><Send size={18}/> ตีกลับคำขอ</button>
              </div>
            </div>
          )}

          {activeModal === 'score' && (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-2 border-[#0a2540]">
              <div className="bg-[#0a2540] p-4 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><Edit size={20}/> บันทึกผลสอบประเมิน (Chief Check)</h3>
                <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-sm font-bold text-slate-800">{selectedReq?.employee}</div>
                  <div className="text-xs text-slate-500">{selectedReq?.wi}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-bold text-slate-700 mb-1 block">ทฤษฎี (%)</label><input type="number" placeholder="0-100" value={theory} onChange={e=>setTheory(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0a2540] outline-none text-center font-bold text-lg"/></div>
                  <div><label className="text-sm font-bold text-slate-700 mb-1 block">ปฏิบัติ (%)</label><input type="number" placeholder="0-100" value={practical} onChange={e=>setPractical(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0a2540] outline-none text-center font-bold text-lg"/></div>
                </div>
                <div className="text-xs text-slate-500 text-center">* เกณฑ์ผ่านคือ 80% ทั้งสองส่วน หากบันทึกแล้วผ่าน ระบบจะส่งให้ Manager อนุมัติทันที</div>
              </div>
              <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setActiveModal('none')} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">ยกเลิก</button>
                <button onClick={handleSaveScore} disabled={!theory || !practical} className="px-6 py-2.5 bg-[#0a2540] text-white font-bold rounded-xl hover:bg-[#0d3060] transition-colors flex items-center gap-2 disabled:opacity-50"><Save size={18}/> บันทึกผลสอบ</button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
"""

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(new_component)

