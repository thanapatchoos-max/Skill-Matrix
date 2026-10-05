import React, { useState } from 'react';
import { BookOpen, Search, Filter, Calendar, Edit, CheckCircle, Plus, Send, XCircle, AlertCircle, Save, X, ArrowRight, User } from 'lucide-react';

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
  
  // Form States
  const [activeForm, setActiveForm] = useState<'none' | 'request' | 'reject' | 'score'>('none');
  const [selectedReq, setSelectedReq] = useState<OJTRequest | null>(null);
  const [formDate, setFormDate] = useState('');
  const [formRejectReason, setFormRejectReason] = useState('');
  const [theory, setTheory] = useState('');
  const [practical, setPractical] = useState('');

  // Handle Staff Submit Request
  const handleStaffRequest = () => {
    if (selectedReq) {
      // Edit rejected request
      setRequests(reqs => reqs.map(r => r.id === selectedReq.id ? { ...r, requestedDate: formDate, status: 'pending_request', rejectReason: undefined } : r));
    } else {
      // New request
      const newReq: OJTRequest = {
        id: `OJT-00${requests.length + 1}`,
        employee: 'คุณ (ผู้ใช้งานปัจจุบัน)',
        employeeId: 'EMP-CURRENT',
        department: 'QC Section',
        wi: 'QCW001-001', // mock fixed
        skillType: 'A - Circuit Connecting', // mock fixed
        requestedDate: formDate,
        status: 'pending_request'
      };
      setRequests([newReq, ...requests]);
    }
    setActiveForm('none');
  };

  // Handle Chief Reject
  const handleReject = () => {
    if (selectedReq) {
      setRequests(reqs => reqs.map(r => r.id === selectedReq.id ? { ...r, status: 'rejected_request', rejectReason: formRejectReason } : r));
      setActiveForm('none');
    }
  };

  // Handle Chief Accept Schedule
  const handleAcceptSchedule = (id: string) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'waiting_for_test' } : r));
  };

  // Handle Chief Save Score
  const handleSaveScore = () => {
    if (selectedReq) {
      const t = Number(theory);
      const p = Number(practical);
      const passed = (t >= 80 && p >= 80);
      setRequests(reqs => reqs.map(r => r.id === selectedReq.id ? { 
        ...r, 
        theoryScore: t, 
        practicalScore: p, 
        testResult: passed ? 'passed' : 'failed',
        status: passed ? 'pending_manager' : 'waiting_for_test' // If failed, maybe they stay waiting for retest, or status becomes failed. Let's make it simple.
      } : r));
      setActiveForm('none');
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch(status) {
      case 'pending_request': return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold border border-amber-200">รอ Chief อนุมัติวันอบรม</span>;
      case 'rejected_request': return <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200">ปฏิเสธ / ให้แก้ไขวัน</span>;
      case 'waiting_for_test': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200">รอฝึกอบรม & บันทึกคะแนน</span>;
      case 'pending_manager': return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">ส่งผลให้ Manager แล้ว</span>;
      case 'completed': return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">เสร็จสิ้น (Level 1)</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" /> Training Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">จัดการระบบการฝึกอบรม (OJT) เพื่อปรับระดับพนักงานจาก Level 0 เป็น Level 1</p>
        </div>
        <div>
          {isStaff && (
            <button 
              onClick={() => { setSelectedReq(null); setFormDate(''); setActiveForm('request'); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold shadow-md text-sm"
            >
              <Plus size={18} /> ยื่นคำขอฝึกอบรม
            </button>
          )}
        </div>
      </div>

      {/* WORKFLOW BANNER */}
      <div className="bg-[#1e1b4b] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-indigo-900/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <span className="text-blue-300 text-sm md:text-base font-mono">13.</span> OJT Workflow (Level 0 &rarr; 1)
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
            {[
              { title: '1. Request', desc: 'พนักงานยื่นคำขอและเสนอวันที่', active: true },
              { title: '2. Approve Schedule', desc: 'Chief ตรวจสอบและยืนยันนัดหมาย', active: true },
              { title: '3. Training & Score', desc: 'อบรมและ Chief บันทึกคะแนนสอบ', active: true },
              { title: '4. Manager Approve', desc: 'ผู้จัดการอนุมัติปรับเป็น Level 1', active: true },
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div className={`flex-1 w-full flex flex-col items-center justify-center p-4 rounded-xl border ${step.active ? 'bg-white/10 border-white/20 shadow-inner' : 'bg-white/5 border-white/10 opacity-50'}`}>
                  <div className="font-bold text-sm md:text-base text-center text-blue-100">{step.title}</div>
                  <div className="text-[11px] md:text-xs text-blue-300 text-center mt-1">{step.desc}</div>
                </div>
                {idx < arr.length - 1 && (
                  <ArrowRight className="hidden md:block text-blue-400/50 flex-shrink-0" size={24} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="ค้นหาชื่อพนักงาน, รหัส หรือ W/I..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
        </div>
        <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>ทุกสถานะคำขอ</option>
          <option>รอ Chief อนุมัติวันอบรม</option>
          <option>รอฝึกอบรม & บันทึกคะแนน</option>
        </select>
      </div>

      {/* INLINE FORMS */}
      {activeForm === 'request' && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-blue-900 flex items-center gap-2"><BookOpen size={18}/> {selectedReq ? 'แก้ไขคำขอฝึกอบรม' : 'แบบฟอร์มยื่นคำขอฝึกอบรม OJT'}</h3>
            <button onClick={() => setActiveForm('none')} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div><label className="text-xs font-bold text-slate-700">มาตรฐาน W/I</label><select className="w-full border rounded-lg p-2 text-sm bg-white"><option>QCW001-001</option></select></div>
            <div><label className="text-xs font-bold text-slate-700">ทักษะที่ต้องการอบรม</label><select className="w-full border rounded-lg p-2 text-sm bg-white"><option>A - Circuit Connecting</option></select></div>
            <div><label className="text-xs font-bold text-slate-700">วันที่เสนอขออบรม <span className="text-red-500">*</span></label><input type="date" value={formDate} onChange={e=>setFormDate(e.target.value)} className="w-full border rounded-lg p-2 text-sm bg-white"/></div>
          </div>
          <div className="flex justify-end"><button onClick={handleStaffRequest} disabled={!formDate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"><Save size={16}/> บันทึกคำขอ</button></div>
        </div>
      )}

      {activeForm === 'reject' && (
        <div className="bg-rose-50 rounded-xl border border-rose-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-rose-900 flex items-center gap-2"><XCircle size={18}/> ปฏิเสธคำขอฝึกอบรม (ให้ Staff เลือกวันใหม่)</h3>
            <button onClick={() => setActiveForm('none')} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
          </div>
          <textarea value={formRejectReason} onChange={e=>setFormRejectReason(e.target.value)} placeholder="ระบุเหตุผล เช่น Trainer ไม่ว่าง..." className="w-full border border-rose-200 rounded-lg p-3 text-sm bg-white mb-4 resize-none" rows={3}></textarea>
          <div className="flex justify-end"><button onClick={handleReject} disabled={!formRejectReason} className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"><Send size={16}/> ส่งกลับให้พนักงานแก้ไข</button></div>
        </div>
      )}

      {activeForm === 'score' && (
        <div className="bg-[#0a2540] rounded-xl border border-[#0a2540] p-5 shadow-sm text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2"><Edit size={18}/> บันทึกผลสอบ OJT (Chief Check)</h3>
            <button onClick={() => setActiveForm('none')} className="text-slate-400 hover:text-white"><X size={20}/></button>
          </div>
          <p className="text-sm text-slate-300 mb-4">พนักงาน: {selectedReq?.employee} | W/I: {selectedReq?.wi}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">คะแนนทฤษฎี (Theory %) <span className="text-red-400">*</span></label>
              <input type="number" placeholder="เช่น 85" value={theory} onChange={e=>setTheory(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">คะแนนปฏิบัติ (Practical %) <span className="text-red-400">*</span></label>
              <input type="number" placeholder="เช่น 90" value={practical} onChange={e=>setPractical(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setActiveForm('none')} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors">ยกเลิก</button>
            <button onClick={handleSaveScore} disabled={!theory || !practical} className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"><Save size={16}/> บันทึกคะแนน & ดำเนินการต่อ</button>
          </div>
        </div>
      )}

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-slate-500" /> ตารางรายการคำขอ & ผลประเมิน OJT</h3>
          <span className="text-xs font-bold text-slate-500">รวม {requests.length} รายการ</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-100/50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wide">
                <th className="px-4 py-3">พนักงาน</th>
                <th className="px-4 py-3">W/I & Skill</th>
                <th className="px-4 py-3">วันที่ขออบรม</th>
                <th className="px-4 py-3 text-center">คะแนน</th>
                <th className="px-4 py-3 text-center">สถานะ</th>
                <th className="px-4 py-3 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">{r.employee}</div>
                    <div className="text-xs text-slate-500">{r.id} &middot; {r.department}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-indigo-700 text-xs">{r.wi}</div>
                    <div className="text-[11px] text-slate-500">{r.skillType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Calendar size={14} className="text-slate-400"/> {r.requestedDate}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.theoryScore ? (
                      <div className="text-[11px] font-bold">
                        <span className="text-slate-500">ทฤษฎี:</span> <span className={r.theoryScore >= 80 ? 'text-emerald-600' : 'text-rose-600'}>{r.theoryScore}%</span> <br/>
                        <span className="text-slate-500">ปฏิบัติ:</span> <span className={(r.practicalScore ?? 0) >= 80 ? 'text-emerald-600' : 'text-rose-600'}>{r.practicalScore}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {getStatusBadge(r.status)}
                      {r.rejectReason && <div className="text-[10px] text-rose-500 font-medium max-w-[120px] truncate" title={r.rejectReason}>{r.rejectReason}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* STAFF ACTIONS */}
                      {isStaff && r.status === 'rejected_request' && (
                        <button onClick={() => { setSelectedReq(r); setFormDate(r.requestedDate); setActiveForm('request'); }} className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                          <Edit size={14}/> แก้ไขคำขอ
                        </button>
                      )}
                      {/* CHIEF ACTIONS */}
                      {isChief && r.status === 'pending_request' && (
                        <>
                          <button onClick={() => handleAcceptSchedule(r.id)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                            <CheckCircle size={14}/> ยืนยันวัน
                          </button>
                          <button onClick={() => { setSelectedReq(r); setFormRejectReason(''); setActiveForm('reject'); }} className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                            <XCircle size={14}/> เลื่อน
                          </button>
                        </>
                      )}
                      {isChief && r.status === 'waiting_for_test' && (
                        <button onClick={() => { setSelectedReq(r); setTheory(''); setPractical(''); setActiveForm('score'); }} className="px-3 py-1.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-sm">
                          <Edit size={14}/> บันทึกคะแนนสอบ
                        </button>
                      )}
                      {/* MANAGER ACTIONS */}
                      {isManager && (
                        <span className="text-xs text-slate-400 font-medium">ดูได้อย่างเดียว</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
