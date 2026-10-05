import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, GraduationCap, TrendingUp, ShieldAlert, FileText, Check, Award, Settings } from 'lucide-react';

// New Mock Data reflecting the 3 distinct approval types
const pendingOJT = [
  { id: 'APP-OJT-001', employee: 'นายณัฐพล ช่างเชื่อม', employeeId: 'EMP006', department: 'Production', wi: 'PROD-010-01', skillType: 'A - Circuit Connecting', currentLevel: 0, proposedLevel: 1, reason: 'ผ่านการทดสอบทฤษฎี 90% และปฏิบัติ 85% (เกณฑ์ผ่าน >80%)', submittedBy: 'Chief เอกวิทย์', submittedAt: '2026-09-22 14:30', ojtRef: 'OJT-2609-014' }
];

const pendingAuto = [
  { id: 'APP-AUTO-001', employee: 'นายสมชาย ใจดี', employeeId: 'EMP001', department: 'QC Section', wi: 'QCW001-001', skillType: 'A - Circuit Connecting', currentLevel: 1, proposedLevel: 2, reason: 'ทำงานต่อเนื่อง 24 Jobs (ผ่านเป้า 20) และอัตราของเสีย 0% (ผ่านเป้า <5%) - ผ่านการยืนยันเบื้องต้นโดย Chief แล้ว', submittedBy: 'System + Chief สมศักดิ์', submittedAt: '2026-09-25 09:15', ref: 'EVAL-001' },
  { id: 'APP-AUTO-002', employee: 'นางสาวแนน สุขใจ', employeeId: 'EMP005', department: 'Engineering', wi: 'ENG-M-001', skillType: 'B - Machine Operator', currentLevel: 2, proposedLevel: 3, reason: 'ทำงานต่อเนื่อง 35 Jobs (ผ่านเป้า 20) และอัตราของเสีย 0.5% (ผ่านเป้า <1%) - ผ่านการยืนยันเบื้องต้นโดย Chief แล้ว', submittedBy: 'System + Chief วนิดา', submittedAt: '2026-09-26 11:20', ref: 'EVAL-002' }
];

const pendingManual = [
  { id: 'APP-MAN-001', employee: 'นายวิชัย เก่งดี', employeeId: 'EMP004', department: 'Engineering', wi: 'ENG-M-002', skillType: 'D - Data Analysis', currentLevel: 1, proposedLevel: 2, reason: 'หัวหน้างานประเมินว่ามีทักษะดีเยี่ยม สามารถปฏิบัติงานด้วยตนเองได้อย่างชำนาญ และมีภาวะผู้นำ (ยื่นเสนอพิเศษ)', submittedBy: 'Chief วนิดา', submittedAt: '2026-09-27 10:00', ref: 'MAN-005' }
];

export default function Approvals() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [category, setCategory] = useState<'ojt' | 'auto' | 'manual'>('ojt');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <CheckCircle className="text-[#0a2540]" /> ศูนย์รวมการอนุมัติ (Approval Center)
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          ระบบรวมศูนย์สำหรับผู้จัดการ (Manager) เพื่อตรวจสอบและอนุมัติการเปลี่ยนแปลงทักษะพนักงาน โดยแยกหมวดหมู่อย่างชัดเจนตามที่มาของข้อมูล
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200">
        <button onClick={() => setActiveTab('pending')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'pending' ? 'border-[#0a2540] text-[#0a2540]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          <Clock size={18} /> รอการอนุมัติ (Pending)
        </button>
        <button onClick={() => setActiveTab('history')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'history' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          <FileText size={18} /> ประวัติการอนุมัติ (Audit Trail)
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Categories */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            <button onClick={() => setCategory('ojt')} className={`w-full text-left px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${category === 'ojt' ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
              <div>
                <div className={`font-bold flex items-center gap-1.5 ${category === 'ojt' ? 'text-blue-800' : 'text-slate-700'}`}><GraduationCap size={16}/> OJT Training</div>
                <div className="text-[11px] text-slate-500 mt-0.5">อนุมัติผลฝึกอบรม (Level 0 &rarr; 1)</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${category === 'ojt' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{pendingOJT.length}</span>
            </button>

            <button onClick={() => setCategory('auto')} className={`w-full text-left px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${category === 'auto' ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
              <div>
                <div className={`font-bold flex items-center gap-1.5 ${category === 'auto' ? 'text-emerald-800' : 'text-slate-700'}`}><TrendingUp size={16}/> Auto Evaluated</div>
                <div className="text-[11px] text-slate-500 mt-0.5">ระบบแนะนำเลื่อนขั้น (Level 1 &rarr; 3)</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${category === 'auto' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{pendingAuto.length}</span>
            </button>

            <button onClick={() => setCategory('manual')} className={`w-full text-left px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${category === 'manual' ? 'bg-purple-50 border-purple-200 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
              <div>
                <div className={`font-bold flex items-center gap-1.5 ${category === 'manual' ? 'text-purple-800' : 'text-slate-700'}`}><Award size={16}/> Manual Proposed</div>
                <div className="text-[11px] text-slate-500 mt-0.5">หัวหน้ายื่นเสนอพิเศษ (Level 1 &rarr; 3)</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${category === 'manual' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{pendingManual.length}</span>
            </button>
          </div>

          {/* List Area */}
          <div className="flex-1 space-y-4">
            {/* Header info based on category */}
            <div className={`p-4 rounded-xl border ${category === 'ojt' ? 'bg-blue-50 border-blue-200' : category === 'auto' ? 'bg-emerald-50 border-emerald-200' : 'bg-purple-50 border-purple-200'}`}>
              <h3 className={`font-bold ${category === 'ojt' ? 'text-blue-900' : category === 'auto' ? 'text-emerald-900' : 'text-purple-900'}`}>
                {category === 'ojt' ? '1. รายการรออนุมัติ: ผลการฝึกอบรม OJT (Level 0 ไป 1)' : category === 'auto' ? '2. รายการรออนุมัติ: ระบบประเมินเลื่อนระดับอัตโนมัติ' : '3. รายการรออนุมัติ: หัวหน้างานยื่นเสนอเลื่อนระดับเอง'}
              </h3>
              <p className={`text-xs mt-1 ${category === 'ojt' ? 'text-blue-700' : category === 'auto' ? 'text-emerald-700' : 'text-purple-700'}`}>
                {category === 'ojt' ? 'ข้อมูลถูกส่งมาจากเมนู Training Management หลังจาก Chief กรอกคะแนนสอบผ่านเกณฑ์' : category === 'auto' ? 'ข้อมูลถูกคำนวณจาก Working Record และผ่านการยืนยันเบื้องต้นจาก Chief ในเมนู Skill Evaluation แล้ว' : 'ข้อมูลถูกยื่นเสนอโดยตรงจาก Chief ในเมนู Skill Evaluation พร้อมแนบเหตุผลพิเศษ'}
              </p>
            </div>

            {/* Render items */}
            {(category === 'ojt' ? pendingOJT : category === 'auto' ? pendingAuto : pendingManual).map(req => (
              <div key={req.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <User size={18} className="text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-base">{req.employee}</span>
                        <span className="text-xs font-mono text-slate-400">{req.employeeId}</span>
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{req.department}</span>
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">อ้างอิง: {req.ref || req.ojtRef}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-700 mt-1.5">{req.wi} &middot; {req.skillType}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded font-bold text-slate-700 text-xs">Level {req.currentLevel}</span>
                        <span className="text-slate-400 font-bold text-lg">&rarr;</span>
                        <span className="px-2.5 py-1 bg-blue-100 border border-blue-200 rounded font-bold text-blue-700 text-xs">Level {req.proposedLevel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400 flex-shrink-0">
                    <div className="font-medium text-slate-600">{req.submittedAt}</div>
                    <div className="mt-1 font-semibold text-slate-500">{req.submittedBy}</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                  <div className="text-xs font-bold text-slate-600 uppercase mb-1">เหตุผล / หลักฐานประกอบการพิจารณา</div>
                  <div className="text-xs text-slate-700 font-medium leading-relaxed">{req.reason}</div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <CheckCircle size={18} /> อนุมัติ (Approve)
                  </button>
                  <button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <XCircle size={18} /> ปฏิเสธ (Reject)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">ประวัติการอนุมัติ (Audit Trail)</h3>
          <p className="text-slate-500 text-sm mt-2">หน้านี้ใช้สำหรับค้นหาและดูประวัติการอนุมัติทั้งหมด (Mockup ไม่ได้แสดงข้อมูลในแท็บนี้)</p>
        </div>
      )}
    </div>
  );
}
