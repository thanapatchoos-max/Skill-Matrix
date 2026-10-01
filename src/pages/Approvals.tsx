import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Clock, Plus, FileText, User, GraduationCap, TrendingUp, ChevronLeft, ChevronRight, ArrowLeft, Save, ShieldAlert, Check } from 'lucide-react';

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'returned';
type FlowType = 'ojt' | 'annual';

interface ApprovalRequest {
  id: string;
  flowType: FlowType;
  employee: string;
  employeeId: string;
  department: string;
  wi: string;
  skillType: string;
  currentLevel: number;
  proposedLevel: number;
  reason: string;
  submittedBy: string;
  submittedAt: string;
  status: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  remark?: string;
  ojtRef?: string;
}

const masterWIs = [
  { code: 'QCW001-001', name: 'การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น', department: 'QC Section' },
  { code: 'QCW001-002', name: 'การทดสอบพิกัดกำลังไฟฟ้าและแรงดันสูง', department: 'QC Section' },
  { code: 'QCW002-001', name: 'การตรวจสอบรอยเชื่อมและจุดยึดโครงสร้างหม้อแปลง', department: 'QC Section' },
  { code: 'PROD-010-01', name: 'การพันคอยล์และประกอบแกนเหล็กหม้อแปลง', department: 'Production' },
  { code: 'PROD-010-02', name: 'การเติมน้ำมันฉนวนสูญญากาศ', department: 'Production' },
  { code: 'ENG-M-001', name: 'การบำรุงรักษาเชิงป้องกันเครื่องจักรทดสอบประจำเดือน', department: 'Engineering' },
  { code: 'ENG-M-002', name: 'การสอบเทียบเครื่องมือวัดไฟฟ้ามาตรฐาน ISO/IEC 17025', department: 'Engineering' }
];

const masterSkillTypesList = [
  'A - Circuit Connecting / Wire Harnessing',
  'B - Machine Operator / Testing Station Control',
  'C - Inspection Report & Data Recording',
  'D - Data Analysis & Troubleshooting',
  'E - Safety & Environmental Control'
];

const LEVEL_LABEL: Record<number, string> = {
  0: 'Cannot', 1: 'Under Supervision', 2: 'Independent', 3: 'Trainer',
};

const LEVEL_COLOR: Record<number, string> = {
  0: 'bg-slate-100 text-slate-500 border-slate-200',
  1: 'bg-amber-100 text-amber-700 border-amber-200',
  2: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  3: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const expandedApprovalRequests: ApprovalRequest[] = [
  // PENDING REQUESTS (6 Items)
  {
    id: 'APR-001', flowType: 'ojt',
    employee: 'นายกฤต พร้อมใจ', employeeId: 'EMP003', department: 'QC Section',
    wi: 'QCW001-001', skillType: 'A - Circuit Connecting / Wire Harnessing',
    currentLevel: 0, proposedLevel: 1,
    reason: 'ผ่านการทดสอบ OJT-001 ภาคทฤษฎี 85% ภาคปฏิบัติ 88% (เกณฑ์ผ่าน ≥80% ทั้งสองส่วน)',
    submittedBy: 'นางสาวอรุณี รักดี (Chief)',
    submittedAt: '2026-09-22', status: 'pending', ojtRef: 'OJT-001',
  },
  {
    id: 'APR-002', flowType: 'annual',
    employee: 'นายสมชาย ใจดี', employeeId: 'EMP001', department: 'QC Section',
    wi: 'QCW001-001', skillType: 'B - Machine Operator / Testing Station Control',
    currentLevel: 2, proposedLevel: 3,
    reason: 'ปฏิบัติงานอิสระมาตลอด 12 เดือน สามารถสอนงานและทำหน้าที่เป็น Trainer กำกับดูแลพนักงานใหม่ได้',
    submittedBy: 'นางสาวอรุณี รักดี (Chief)',
    submittedAt: '2026-09-20', status: 'pending',
  },
  {
    id: 'APR-003', flowType: 'ojt',
    employee: 'นายสมศักดิ์ มั่นคง', employeeId: 'EMP008', department: 'Production',
    wi: 'PROD-010-01', skillType: 'A - Circuit Connecting / Wire Harnessing',
    currentLevel: 0, proposedLevel: 1,
    reason: 'ผ่านการทดสอบ OJT-003 ภาคทฤษฎี 88% ภาคปฏิบัติ 90% (ผ่านเกณฑ์ประเมินการประกอบแกนเหล็ก)',
    submittedBy: 'Chief เอกวิทย์ (Chief)',
    submittedAt: '2026-09-21', status: 'pending', ojtRef: 'OJT-003',
  },
  {
    id: 'APR-004', flowType: 'annual',
    employee: 'นายวิชัย เก่งดี', employeeId: 'EMP004', department: 'Engineering',
    wi: 'ENG-M-001', skillType: 'D - Data Analysis & Troubleshooting',
    currentLevel: 2, proposedLevel: 3,
    reason: 'เสนอขอปรับเป็น Trainer หลังผ่านการวิเคราะห์แก้ปัญหาสถานีทดสอบและจัดทำคู่มือ PM ประจำเดือน',
    submittedBy: 'Admin (คุณสมชาย)',
    submittedAt: '2026-09-23', status: 'pending',
  },
  {
    id: 'APR-005', flowType: 'ojt',
    employee: 'นางสาวอรทัย ใฝ่รู้', employeeId: 'EMP010', department: 'Engineering',
    wi: 'ENG-M-001', skillType: 'B - Machine Operator / Testing Station Control',
    currentLevel: 0, proposedLevel: 1,
    reason: 'ผ่านการทดสอบ OJT-005 ภาคทฤษฎี 92% ภาคปฏิบัติ 95% (เกณฑ์ผ่านการบำรุงรักษาเชิงป้องกัน)',
    submittedBy: 'นายวิชัย เก่งดี (Chief)',
    submittedAt: '2026-09-24', status: 'pending', ojtRef: 'OJT-005',
  },
  {
    id: 'APR-006', flowType: 'ojt',
    employee: 'นางสาววรรณา ดีเลิศ', employeeId: 'EMP012', department: 'QC Section',
    wi: 'QCW002-001', skillType: 'C - Inspection Report & Data Recording',
    currentLevel: 0, proposedLevel: 1,
    reason: 'ผ่านการทดสอบ OJT-007 ภาคทฤษฎี 91% ภาคปฏิบัติ 89% (เกณฑ์บันทึกรายงานการตรวจสอบโครงสร้าง)',
    submittedBy: 'นางสาวอรุณี รักดี (Chief)',
    submittedAt: '2026-09-26', status: 'pending', ojtRef: 'OJT-007',
  },

  // HISTORY / AUDIT TRAIL REQUESTS (8 Items)
  {
    id: 'APR-007', flowType: 'annual',
    employee: 'นางสาวอรุณี รักดี', employeeId: 'EMP002', department: 'QC Section',
    wi: 'QCW002-001', skillType: 'D - Data Analysis & Troubleshooting',
    currentLevel: 1, proposedLevel: 2,
    reason: 'ผ่านการปฏิบัติงานอิสระครบ 6 เดือน ไม่มีข้อผิดพลาดในรายงานการวิเคราะห์โครงสร้าง',
    submittedBy: 'นางสาวอรุณี รักดี (Chief)',
    submittedAt: '2026-09-18', status: 'approved',
    approvedBy: 'นายกฤต พร้อมใจ (Manager)', approvedAt: '2026-09-19',
  },
  {
    id: 'APR-008', flowType: 'ojt',
    employee: 'นางสาวแนน สุขใจ', employeeId: 'EMP005', department: 'Engineering',
    wi: 'ENG-M-002', skillType: 'C - Inspection Report & Data Recording',
    currentLevel: 0, proposedLevel: 1,
    reason: 'ผ่านการทดสอบ OJT-008 ภาคทฤษฎี 90% ภาคปฏิบัติ 92% (เกณฑ์สอบเทียบ ISO/IEC 17025)',
    submittedBy: 'นายวิชัย เก่งดี (Chief)',
    submittedAt: '2026-09-15', status: 'approved',
    approvedBy: 'นายกฤต พร้อมใจ (Manager)', approvedAt: '2026-09-16', ojtRef: 'OJT-008',
  },
  {
    id: 'APR-009', flowType: 'annual',
    employee: 'นางสาวแนน สุขใจ', employeeId: 'EMP005', department: 'Engineering',
    wi: 'ENG-M-002', skillType: 'D - Data Analysis & Troubleshooting',
    currentLevel: 2, proposedLevel: 3,
    reason: 'เสนอขอเลื่อนเป็น Trainer เพื่ออบรมพนักงานใหม่ด้านสอบเทียบ',
    submittedBy: 'นายวิชัย เก่งดี (Chief)',
    submittedAt: '2026-09-10', status: 'rejected',
    approvedBy: 'นายกฤต พร้อมใจ (Manager)', approvedAt: '2026-09-12',
    remark: 'หลักฐานการปฏิบัติงานไม่ครบถ้วน กรุณาแนบรายงานผลการสอบเทียบย้อนหลัง 6 เดือน',
  },
  {
    id: 'APR-010', flowType: 'ojt',
    employee: 'นายสมชาย ใจดี', employeeId: 'EMP001', department: 'QC Section',
    wi: 'QCW001-001', skillType: 'C - Inspection Report & Data Recording',
    currentLevel: 0, proposedLevel: 1,
    reason: 'ผ่านการทดสอบ OJT-010 ภาคทฤษฎี 95% ภาคปฏิบัติ 98%',
    submittedBy: 'นางสาวอรุณี รักดี (Chief)',
    submittedAt: '2026-09-01', status: 'approved',
    approvedBy: 'นายกฤต พร้อมใจ (Manager)', approvedAt: '2026-09-02', ojtRef: 'OJT-010',
  },
  {
    id: 'APR-011', flowType: 'annual',
    employee: 'นายสุรชัย สายชล', employeeId: 'EMP009', department: 'Production',
    wi: 'PROD-010-01', skillType: 'B - Machine Operator / Testing Station Control',
    currentLevel: 1, proposedLevel: 2,
    reason: 'ปฏิบัติงานควบคุมเครื่องจักรการพันคอยล์โดยไม่พบของเสียในรอบ 6 เดือน',
    submittedBy: 'Chief เอกวิทย์ (Chief)',
    submittedAt: '2026-08-11', status: 'approved',
    approvedBy: 'นายกฤต พร้อมใจ (Manager)', approvedAt: '2026-08-12',
  },
  {
    id: 'APR-012', flowType: 'ojt',
    employee: 'นายสมศักดิ์ มั่นคง', employeeId: 'EMP008', department: 'Production',
    wi: 'PROD-010-01', skillType: 'E - Safety & Environmental Control',
    currentLevel: 0, proposedLevel: 1,
    reason: 'ผ่านการทดสอบ OJT-009 ภาคทฤษฎี 82% ภาคปฏิบัติ 85%',
    submittedBy: 'Chief เอกวิทย์ (Chief)',
    submittedAt: '2026-09-08', status: 'rejected',
    approvedBy: 'นายกฤต พร้อมใจ (Manager)', approvedAt: '2026-09-09', ojtRef: 'OJT-009',
    remark: 'ผลการสอบทฤษฎีอ้างอิงเอกสาร W/I รุ่นเก่า กรุณาสอบซ่อมใหม่ด้วย W/I ฉบับ v2.0',
  },
  {
    id: 'APR-013', flowType: 'annual',
    employee: 'นายกฤษณะ แสงทอง', employeeId: 'EMP011', department: 'QC Section',
    wi: 'QCW001-002', skillType: 'A - Circuit Connecting / Wire Harnessing',
    currentLevel: 1, proposedLevel: 2,
    reason: 'เสนอขอปรับเป็น Independent ในการทดสอบแรงดันสูง',
    submittedBy: 'นางสาวอรุณี รักดี (Chief)',
    submittedAt: '2026-08-25', status: 'returned',
    approvedBy: 'นายกฤต พร้อมใจ (Manager)', approvedAt: '2026-08-26',
    remark: 'กรุณาแนบรายงานผลการทดสอบความปลอดภัยความต่างศักย์สูงเพิ่มเติมก่อนพิจารณา',
  },
  {
    id: 'APR-014', flowType: 'ojt',
    employee: 'นายสุรชัย สายชล', employeeId: 'EMP009', department: 'Production',
    wi: 'PROD-010-01', skillType: 'B - Machine Operator / Testing Station Control',
    currentLevel: 0, proposedLevel: 1,
    reason: 'ผ่านการทดสอบ OJT-014 ภาคทฤษฎี 88% ภาคปฏิบัติ 92%',
    submittedBy: 'Chief เอกวิทย์ (Chief)',
    submittedAt: '2026-08-10', status: 'approved',
    approvedBy: 'นายกฤต พร้อมใจ (Manager)', approvedAt: '2026-08-11', ojtRef: 'OJT-014',
  }
];

const ITEMS_PER_PAGE = 8;

export default function Approvals() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [flowFilter, setFlowFilter] = useState<'all' | FlowType>('all');
  const [requests, setRequests] = useState<ApprovalRequest[]>(expandedApprovalRequests);
  const [actionModal, setActionModal] = useState<{ request: ApprovalRequest; action: 'approve' | 'reject' | 'return' } | null>(null);
  const [remark, setRemark] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Inline Form State (No Popup Modal!)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    employee: 'นายสมชาย ใจดี',
    employeeId: 'EMP001',
    department: 'QC Section',
    wi: masterWIs[0].code,
    skillType: masterSkillTypesList[0],
    currentLevel: '2',
    proposedLevel: '3',
    reason: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const pending = requests.filter(r => r.status === 'pending');
  const history = requests.filter(r => r.status !== 'pending');

  const filteredPending = flowFilter === 'all' ? pending : pending.filter(r => r.flowType === flowFilter);
  const filteredHistory = flowFilter === 'all' ? history : history.filter(r => r.flowType === flowFilter);

  // History Pagination
  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAction = () => {
    if (!actionModal) return;
    const { request, action } = actionModal;
    const statusMap: Record<string, ApprovalStatus> = { approve: 'approved', reject: 'rejected', return: 'returned' };
    setRequests(prev => prev.map(r => r.id === request.id ? {
      ...r,
      status: statusMap[action],
      approvedBy: 'นายกฤต พร้อมใจ (Manager)',
      approvedAt: new Date().toISOString().slice(0, 10),
      remark: remark || undefined,
    } : r));
    setActionModal(null);
    setRemark('');
    showToast(`ทำรายการ ${action === 'approve' ? 'อนุมัติ' : action === 'reject' ? 'ปฏิเสธ' : 'ส่งกลับ'} สำเร็จ`);
    setActiveTab('history');
  };

  const handleNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.employee || !newForm.reason.trim()) return;

    const newReq: ApprovalRequest = {
      id: `APR-${String(requests.length + 1).padStart(3, '0')}`,
      flowType: 'annual',
      employee: newForm.employee,
      employeeId: newForm.employeeId,
      department: newForm.department,
      wi: newForm.wi,
      skillType: newForm.skillType,
      currentLevel: parseInt(newForm.currentLevel),
      proposedLevel: parseInt(newForm.proposedLevel),
      reason: newForm.reason,
      submittedBy: 'นางสาวอรุณี รักดี (Chief)',
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
    };
    setRequests([newReq, ...requests]);
    setIsFormOpen(false);
    showToast(`ยื่นเสนอปรับ Grade ประจำปี (${newReq.id}) สำเร็จ`);
  };

  const LevelBadge = ({ level }: { level: number }) => (
    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${LEVEL_COLOR[level]}`}>
      {level} · {LEVEL_LABEL[level]}
    </span>
  );

  const FlowTypeBadge = ({ type }: { type: FlowType }) => (
    type === 'ojt'
      ? <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full border border-blue-200"><GraduationCap size={12} /> OJT (Level 0→1)</span>
      : <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-full border border-purple-200"><TrendingUp size={12} /> ปรับ Grade ประจำปี</span>
  );

  const StatusBadge = ({ status }: { status: ApprovalStatus }) => {
    const map = {
      pending:  { label: 'รออนุมัติ',    cls: 'bg-amber-50 text-amber-700 border-amber-200',   icon: <Clock size={11} /> },
      approved: { label: 'อนุมัติแล้ว',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle size={11} /> },
      rejected: { label: 'ปฏิเสธ',       cls: 'bg-red-50 text-red-600 border-red-200',          icon: <XCircle size={11} /> },
      returned: { label: 'ส่งกลับแก้ไข', cls: 'bg-slate-100 text-slate-600 border-slate-200',   icon: <RotateCcw size={11} /> },
    };
    const { label, cls, icon } = map[status];
    return <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>{icon} {label}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <Check size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle className="text-[#0a2540]" /> การอนุมัติ (Approval Workflow)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            รวม 2 วงจร: OJT (เลื่อน Level 0→1) และ ปรับ Grade ประจำปี — บันทึก Audit Trail ตาม ISO 17025
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2540] text-white rounded-lg hover:bg-[#0d3060] transition-colors font-semibold shadow-md text-sm"
          >
            <Plus size={18} /> เสนอปรับ Grade ประจำปี
          </button>
        )}
      </div>

      {/* Flow Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 font-bold text-blue-900 mb-1"><GraduationCap size={16} /> วงจร OJT — เลื่อน Level 0 → 1</div>
          <div className="text-xs text-blue-700">Chief บันทึกผลทดสอบ (ทฤษฎี+ปฏิบัติ ≥80%) → ส่งขออนุมัติ → Manager Approve → ระบบปรับ Level อัตโนมัติ</div>
        </div>
        <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center gap-2 font-bold text-purple-900 mb-1"><TrendingUp size={16} /> วงจรประจำปี — ปรับ Grade</div>
          <div className="text-xs text-purple-700">Chief เสนอปรับ Grade พร้อมหลักฐาน (ปรับได้ทุก Level) → Manager ตรวจสอบ Approve → ระบบอัปเดต Skill</div>
        </div>
      </div>

      {/* INLINE FORM: เสนอปรับ Grade ประจำปี (No Popup Modal!) */}
      {isFormOpen && (
        <div className="bg-white rounded-xl border-2 border-purple-500 shadow-xl overflow-hidden transition-all duration-300">
          <div className="bg-gradient-to-r from-[#0a2540] to-purple-900 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)} 
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-200"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-lg font-bold">ยื่นเสนอปรับ Grade ประจำปี (Inline Form)</h2>
                <p className="text-xs text-purple-200">Chief ยื่นข้อเสนอปรับระดับ Skill Level พนักงานพร้อมแนบหลักฐานอ้างอิงให้ Manager พิจารณา</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setIsFormOpen(false)} 
              className="text-slate-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              ยกเลิก / ปิดฟอร์ม
            </button>
          </div>

          <form onSubmit={handleNewSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Employee */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  พนักงาน <span className="text-red-500">*</span>
                </label>
                <select
                  value={newForm.employee}
                  onChange={e => setNewForm({ ...newForm, employee: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 font-medium text-slate-800"
                >
                  <option value="นายสมชาย ใจดี">นายสมชาย ใจดี (EMP001) - QC Section</option>
                  <option value="นางสาวอรุณี รักดี">นางสาวอรุณี รักดี (EMP002) - QC Section</option>
                  <option value="นายกฤต พร้อมใจ">นายกฤต พร้อมใจ (EMP003) - QC Section</option>
                  <option value="นายวิชัย เก่งดี">นายวิชัย เก่งดี (EMP004) - Engineering</option>
                  <option value="นางสาวแนน สุขใจ">นางสาวแนน สุขใจ (EMP005) - Engineering</option>
                </select>
              </div>

              {/* W/I */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Work Instruction (W/I) <span className="text-red-500">*</span>
                </label>
                <select
                  value={newForm.wi}
                  onChange={e => setNewForm({ ...newForm, wi: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 font-bold text-slate-800"
                >
                  {masterWIs.map(w => (
                    <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>

              {/* Skill Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Skill Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newForm.skillType}
                  onChange={e => setNewForm({ ...newForm, skillType: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 font-semibold text-slate-800"
                >
                  {masterSkillTypesList.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Current Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Level ปัจจุบัน (Read-only)</label>
                <select
                  value={newForm.currentLevel}
                  onChange={e => setNewForm({ ...newForm, currentLevel: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-100 font-bold text-slate-600"
                >
                  {[0, 1, 2, 3].map(l => <option key={l} value={l}>{l} — {LEVEL_LABEL[l]}</option>)}
                </select>
              </div>

              {/* Proposed Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Level ที่เสนอปรับ <span className="text-red-500">*</span></label>
                <select
                  value={newForm.proposedLevel}
                  onChange={e => setNewForm({ ...newForm, proposedLevel: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 font-bold text-purple-900"
                >
                  {[0, 1, 2, 3].map(l => <option key={l} value={l}>{l} — {LEVEL_LABEL[l]}</option>)}
                </select>
              </div>

              {/* Reason */}
              <div className="space-y-2 md:col-span-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  เหตุผลและหลักฐานประกอบการปรับ Grade <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="อธิบายเหตุผล เช่น ปฏิบัติงานอิสระครบ 12 เดือน สามารถสอนพนักงานใหม่ได้ พร้อมแนบผลงาน Q1-Q4..."
                  value={newForm.reason}
                  onChange={e => setNewForm({ ...newForm, reason: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 resize-none text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={!newForm.reason.trim()}
                className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-lg font-semibold text-sm transition-colors shadow-md flex items-center gap-2 disabled:opacity-40"
              >
                <Save size={16} /> ส่งคำขอเสนอปรับ Grade
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'รออนุมัติทั้งหมด', value: pending.length, color: 'amber', icon: Clock },
          { label: 'อนุมัติแล้ว', value: history.filter(r => r.status === 'approved').length, color: 'emerald', icon: CheckCircle },
          { label: 'ปฏิเสธ', value: history.filter(r => r.status === 'rejected').length, color: 'red', icon: XCircle },
          { label: 'ส่งกลับแก้ไข', value: history.filter(r => r.status === 'returned').length, color: 'slate', icon: RotateCcw },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              s.color === 'amber' ? 'bg-amber-50 text-amber-600'
              : s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600'
              : s.color === 'red' ? 'bg-red-50 text-red-500'
              : 'bg-slate-100 text-slate-500'
            }`}>
              <s.icon size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              <div className="text-xs text-slate-500 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Sub-Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex gap-1 bg-slate-200/70 p-1 rounded-xl w-full md:w-auto">
          {(['pending', 'history'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab ? 'bg-white text-[#0a2540] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'pending' ? `รออนุมัติ (${pending.length})` : `ประวัติ / Audit Trail (${history.length})`}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 w-full md:w-auto">
          {(['all', 'ojt', 'annual'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFlowFilter(f); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                flowFilter === f 
                  ? 'bg-[#0a2540] text-white border-[#0a2540]' 
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {f === 'all' ? 'ทุกประเภท' : f === 'ojt' ? '🎓 OJT' : '📈 ประจำปี'}
            </button>
          ))}
        </div>
      </div>

      {/* PENDING CARDS LIST */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {filteredPending.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <CheckCircle size={36} className="mx-auto mb-3 text-emerald-400" />
              <p className="font-semibold text-slate-600">ไม่มีรายการรออนุมัติในขณะนี้</p>
            </div>
          )}
          {filteredPending.map(req => (
            <div key={req.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-blue-300 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800 text-base">{req.employee}</span>
                      <span className="text-xs font-mono text-slate-400">{req.employeeId}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{req.department}</span>
                      <FlowTypeBadge type={req.flowType} />
                      {req.ojtRef && <span className="text-xs font-mono text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">อ้างอิง: {req.ojtRef}</span>}
                    </div>
                    <div className="text-sm font-semibold text-slate-700 mt-1.5">{req.wi} · {req.skillType}</div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <LevelBadge level={req.currentLevel} />
                      <span className="text-slate-400 font-bold text-lg">→</span>
                      <LevelBadge level={req.proposedLevel} />
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400 flex-shrink-0">
                  <div className="font-medium text-slate-600">{req.submittedAt}</div>
                  <div className="mt-1 text-slate-400">{req.submittedBy}</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                <div className="text-xs font-bold text-slate-600 uppercase mb-1">เหตุผล / หลักฐานประกอบ</div>
                <div className="text-xs text-slate-700 font-medium leading-relaxed">{req.reason}</div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setActionModal({ request: req, action: 'approve' })}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  <CheckCircle size={15} /> Approve (อนุมัติ)
                </button>
                <button
                  onClick={() => setActionModal({ request: req, action: 'reject' })}
                  className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  <XCircle size={15} /> Reject (ปฏิเสธ)
                </button>
                <button
                  onClick={() => setActionModal({ request: req, action: 'return' })}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                >
                  <RotateCcw size={15} /> ส่งกลับแก้ไข
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HISTORY / AUDIT TRAIL TABLE WITH PAGINATION */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-slate-500" />
              <span className="text-sm font-bold text-slate-800">Audit Trail — บันทึกทุกการอนุมัติปรับ Skill Level (ISO 17025)</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">รวมทั้งหมด {filteredHistory.length} รายการ</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-xs text-slate-700 font-bold uppercase tracking-wide">
                  <th className="px-4 py-3.5">รหัส</th>
                  <th className="px-4 py-3.5">ประเภท</th>
                  <th className="px-4 py-3.5">พนักงาน</th>
                  <th className="px-4 py-3.5">W/I · Skill Type</th>
                  <th className="px-4 py-3.5 text-center">Level</th>
                  <th className="px-4 py-3.5">ผู้ยื่น</th>
                  <th className="px-4 py-3.5">ผู้อนุมัติ</th>
                  <th className="px-4 py-3.5">วันที่</th>
                  <th className="px-4 py-3.5 text-center">ผล</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedHistory.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-slate-400">
                      ไม่พบประวัติการอนุมัติที่ตรงเงื่อนไข
                    </td>
                  </tr>
                ) : (
                  paginatedHistory.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 text-xs font-mono font-bold text-slate-400">{req.id}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap"><FlowTypeBadge type={req.flowType} /></td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-800">{req.employee}</div>
                        <div className="text-xs text-slate-400">{req.department}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-800 text-xs">{req.wi}</div>
                        <div className="text-xs text-slate-500 font-medium">{req.skillType}</div>
                      </td>
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLOR[req.currentLevel]}`}>{req.currentLevel}</span>
                          <span className="text-slate-300">→</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLOR[req.proposedLevel]}`}>{req.proposedLevel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">{req.submittedBy}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">{req.approvedBy ?? '-'}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{req.approvedAt ?? '-'}</td>
                      <td className="px-4 py-3.5 text-center whitespace-nowrap"><StatusBadge status={req.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION / PARTITION CONTROLS FOR HISTORY */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-slate-200 text-xs text-slate-500 bg-slate-50/50">
            <div>
              แสดงผล {filteredHistory.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredHistory.length)} จากทั้งหมด {filteredHistory.length} รายการ (8 รายการต่อหน้า)
            </div>

            {/* Styled Pill Pagination: [ < ]  1 OF 2  [ > ] */}
            <div className="inline-flex items-center bg-white border border-slate-300 rounded-full px-3 py-1 shadow-xs gap-3">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1 hover:bg-slate-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 transition-colors"
                title="หน้าก่อนหน้า"
              >
                <ChevronLeft size={16} className="text-red-500 font-bold" />
              </button>

              <span className="font-mono font-bold text-slate-800 tracking-wider text-xs select-none">
                {currentPage} OF {totalPages || 1}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1 hover:bg-slate-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 transition-colors"
                title="หน้าถัดไป"
              >
                <ChevronRight size={16} className="text-red-500 font-bold" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM ACTION MODAL */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
              actionModal.action === 'approve' ? 'bg-emerald-100' : actionModal.action === 'reject' ? 'bg-red-100' : 'bg-slate-100'
            }`}>
              {actionModal.action === 'approve' && <CheckCircle size={28} className="text-emerald-600" />}
              {actionModal.action === 'reject' && <XCircle size={28} className="text-red-500" />}
              {actionModal.action === 'return' && <RotateCcw size={28} className="text-slate-600" />}
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-800">
                {actionModal.action === 'approve' ? 'ยืนยันการอนุมัติ' : actionModal.action === 'reject' ? 'ยืนยันการปฏิเสธ' : 'ส่งกลับแก้ไข'}
              </h3>
              <p className="text-sm text-slate-500 font-semibold">{actionModal.request.employee} · {actionModal.request.wi}</p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <LevelBadge level={actionModal.request.currentLevel} />
                <span className="text-slate-400 font-bold">→</span>
                <LevelBadge level={actionModal.request.proposedLevel} />
              </div>
              {actionModal.action === 'approve' && (
                <p className="text-xs text-emerald-600 pt-1 font-semibold">เมื่ออนุมัติ ระบบจะปรับแทนค่า Skill Level ทันที และประทับตราเวลาใน Audit Trail</p>
              )}
            </div>

            {actionModal.action !== 'approve' && (
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {actionModal.action === 'reject' ? 'เหตุผลการปฏิเสธ *' : 'หมายเหตุสำหรับการส่งกลับแก้ไข *'}
                </label>
                <textarea
                  rows={3}
                  placeholder="กรอกเหตุผลให้ชัดเจน..."
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  className="mt-1.5 w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium text-slate-800"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setActionModal(null); setRemark(''); }}
                className="flex-1 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold text-sm"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAction}
                disabled={actionModal.action !== 'approve' && !remark.trim()}
                className={`flex-1 py-2.5 text-white rounded-lg font-semibold text-sm disabled:opacity-40 ${
                  actionModal.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700'
                  : actionModal.action === 'reject' ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-slate-600 hover:bg-slate-700'
                }`}
              >
                {actionModal.action === 'approve' ? 'ยืนยัน Approve' : actionModal.action === 'reject' ? 'ยืนยัน Reject' : 'ยืนยันส่งกลับ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
