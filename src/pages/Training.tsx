import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle, XCircle, BookOpen, User, Calendar, Award, Send, Edit, ArrowLeft, FileText, Check, History, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

interface OJTRecord {
  id: string;
  employee: string;
  employeeId: string;
  department: string;
  wi: string;
  wiName: string;
  skillType: string;
  date: string;
  trainer: string;
  theoryScore: number;
  practicalScore: number;
  status: 'passed' | 'failed';
  submissionStatus: 'draft' | 'submitted' | 'approved' | 'rejected';
  managerRemark?: string;
  updatedAt?: string;
}

// Master Data Alignment
const masterWIs = [
  { code: 'QCW001-001', name: 'การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น', department: 'QC Section', types: ['A', 'B', 'C', 'D'] },
  { code: 'QCW001-002', name: 'การทดสอบพิกัดกำลังไฟฟ้าและแรงดันสูง', department: 'QC Section', types: ['A', 'B', 'C', 'D'] },
  { code: 'QCW002-001', name: 'การตรวจสอบรอยเชื่อมและจุดยึดโครงสร้างหม้อแปลง', department: 'QC Section', types: ['C', 'D'] },
  { code: 'PROD-010-01', name: 'การพันคอยล์และประกอบแกนเหล็กหม้อแปลง', department: 'Production', types: ['A', 'B', 'E'] },
  { code: 'PROD-010-02', name: 'การเติมน้ำมันฉนวนสูญญากาศ', department: 'Production', types: ['B', 'C', 'E'] },
  { code: 'ENG-M-001', name: 'การบำรุงรักษาเชิงป้องกันเครื่องจักรทดสอบประจำเดือน', department: 'Engineering', types: ['B', 'D', 'E'] },
  { code: 'ENG-M-002', name: 'การสอบเทียบเครื่องมือวัดไฟฟ้ามาตรฐาน ISO/IEC 17025', department: 'Engineering', types: ['C', 'D'] },
];

const masterSkillTypes: Record<string, string> = {
  'A': 'A - Circuit Connecting / Wire Harnessing',
  'B': 'B - Machine Operator / Testing Station Control',
  'C': 'C - Inspection Report & Data Recording',
  'D': 'D - Data Analysis & Troubleshooting',
  'E': 'E - Safety & Environmental Control',
};

const employeesList = [
  { name: 'นายกฤต พร้อมใจ', id: 'EMP003', department: 'QC Section' },
  { name: 'นางสาวแนน สุขใจ', id: 'EMP005', department: 'Engineering' },
  { name: 'นายสมชาย ใจดี', id: 'EMP001', department: 'QC Section' },
  { name: 'นายวิชัย เก่งดี', id: 'EMP004', department: 'Engineering' },
  { name: 'นายสมศักดิ์ มั่นคง', id: 'EMP008', department: 'Production' },
  { name: 'นายสุรชัย สายชล', id: 'EMP009', department: 'Production' },
  { name: 'นางสาวอรทัย ใฝ่รู้', id: 'EMP010', department: 'Engineering' },
  { name: 'นายกฤษณะ แสงทอง', id: 'EMP011', department: 'QC Section' },
  { name: 'นางสาววรรณา ดีเลิศ', id: 'EMP012', department: 'QC Section' }
];

const expandedOJTRecords: OJTRecord[] = [
  // Current / Pending List
  {
    id: 'OJT-001',
    employee: 'นายกฤต พร้อมใจ',
    employeeId: 'EMP003',
    department: 'QC Section',
    wi: 'QCW001-001',
    wiName: 'การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น',
    skillType: 'A - Circuit Connecting / Wire Harnessing',
    date: '2026-09-10',
    trainer: 'นางสาวอรุณี รักดี',
    theoryScore: 85,
    practicalScore: 88,
    status: 'passed',
    submissionStatus: 'submitted',
    updatedAt: '2026-09-10'
  },
  {
    id: 'OJT-002',
    employee: 'นายกฤต พร้อมใจ',
    employeeId: 'EMP003',
    department: 'QC Section',
    wi: 'QCW001-001',
    wiName: 'การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น',
    skillType: 'B - Machine Operator / Testing Station Control',
    date: '2026-09-12',
    trainer: 'นายสมชาย ใจดี',
    theoryScore: 72,
    practicalScore: 65,
    status: 'failed',
    submissionStatus: 'draft',
    updatedAt: '2026-09-12'
  },
  {
    id: 'OJT-003',
    employee: 'นายสมศักดิ์ มั่นคง',
    employeeId: 'EMP008',
    department: 'Production',
    wi: 'PROD-010-01',
    wiName: 'การพันคอยล์และประกอบแกนเหล็กหม้อแปลง',
    skillType: 'A - Circuit Connecting / Wire Harnessing',
    date: '2026-09-20',
    trainer: 'Chief เอกวิทย์',
    theoryScore: 88,
    practicalScore: 90,
    status: 'passed',
    submissionStatus: 'submitted',
    updatedAt: '2026-09-20'
  },
  {
    id: 'OJT-004',
    employee: 'นายสุรชัย สายชล',
    employeeId: 'EMP009',
    department: 'Production',
    wi: 'PROD-010-02',
    wiName: 'การเติมน้ำมันฉนวนสูญญากาศ',
    skillType: 'B - Machine Operator / Testing Station Control',
    date: '2026-09-22',
    trainer: 'Chief เอกวิทย์',
    theoryScore: 84,
    practicalScore: 82,
    status: 'passed',
    submissionStatus: 'draft',
    updatedAt: '2026-09-22'
  },
  {
    id: 'OJT-005',
    employee: 'นางสาวอรทัย ใฝ่รู้',
    employeeId: 'EMP010',
    department: 'Engineering',
    wi: 'ENG-M-001',
    wiName: 'การบำรุงรักษาเชิงป้องกันเครื่องจักรทดสอบประจำเดือน',
    skillType: 'B - Machine Operator / Testing Station Control',
    date: '2026-09-24',
    trainer: 'นายวิชัย เก่งดี',
    theoryScore: 92,
    practicalScore: 95,
    status: 'passed',
    submissionStatus: 'submitted',
    updatedAt: '2026-09-24'
  },
  {
    id: 'OJT-006',
    employee: 'นายกฤษณะ แสงทอง',
    employeeId: 'EMP011',
    department: 'QC Section',
    wi: 'QCW001-002',
    wiName: 'การทดสอบพิกัดกำลังไฟฟ้าและแรงดันสูง',
    skillType: 'A - Circuit Connecting / Wire Harnessing',
    date: '2026-09-25',
    trainer: 'นางสาวอรุณี รักดี',
    theoryScore: 78,
    practicalScore: 85,
    status: 'failed',
    submissionStatus: 'draft',
    updatedAt: '2026-09-25'
  },
  {
    id: 'OJT-007',
    employee: 'นางสาววรรณา ดีเลิศ',
    employeeId: 'EMP012',
    department: 'QC Section',
    wi: 'QCW002-001',
    wiName: 'การตรวจสอบรอยเชื่อมและจุดยึดโครงสร้างหม้อแปลง',
    skillType: 'C - Inspection Report & Data Recording',
    date: '2026-09-26',
    trainer: 'นางสาวอรุณี รักดี',
    theoryScore: 91,
    practicalScore: 89,
    status: 'passed',
    submissionStatus: 'submitted',
    updatedAt: '2026-09-26'
  },

  // History Log (Approved & Rejected)
  {
    id: 'OJT-008',
    employee: 'นางสาวแนน สุขใจ',
    employeeId: 'EMP005',
    department: 'Engineering',
    wi: 'ENG-M-002',
    wiName: 'การสอบเทียบเครื่องมือวัดไฟฟ้ามาตรฐาน ISO/IEC 17025',
    skillType: 'C - Inspection Report & Data Recording',
    date: '2026-09-15',
    trainer: 'นายสมชาย ใจดี',
    theoryScore: 90,
    practicalScore: 92,
    status: 'passed',
    submissionStatus: 'approved',
    updatedAt: '2026-09-16'
  },
  {
    id: 'OJT-009',
    employee: 'นายสมศักดิ์ มั่นคง',
    employeeId: 'EMP008',
    department: 'Production',
    wi: 'PROD-010-01',
    wiName: 'การพันคอยล์และประกอบแกนเหล็กหม้อแปลง',
    skillType: 'E - Safety & Environmental Control',
    date: '2026-09-08',
    trainer: 'Chief เอกวิทย์',
    theoryScore: 82,
    practicalScore: 85,
    status: 'passed',
    submissionStatus: 'rejected',
    managerRemark: 'ผลการสอบทฤษฎีอ้างอิงเอกสารรุ่นเก่า กรุณาทดสอบใหม่ด้วย W/I ฉบับปรับปรุง v2.0',
    updatedAt: '2026-09-09'
  },
  {
    id: 'OJT-010',
    employee: 'นายสมชาย ใจดี',
    employeeId: 'EMP001',
    department: 'QC Section',
    wi: 'QCW001-001',
    wiName: 'การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น',
    skillType: 'C - Inspection Report & Data Recording',
    date: '2026-09-01',
    trainer: 'นางสาวอรุณี รักดี',
    theoryScore: 95,
    practicalScore: 98,
    status: 'passed',
    submissionStatus: 'approved',
    updatedAt: '2026-09-02'
  },
  {
    id: 'OJT-011',
    employee: 'นายวิชัย เก่งดี',
    employeeId: 'EMP004',
    department: 'Engineering',
    wi: 'ENG-M-001',
    wiName: 'การบำรุงรักษาเชิงป้องกันเครื่องจักรทดสอบประจำเดือน',
    skillType: 'D - Data Analysis & Troubleshooting',
    date: '2026-08-28',
    trainer: 'Admin (คุณสมชาย)',
    theoryScore: 89,
    practicalScore: 91,
    status: 'passed',
    submissionStatus: 'approved',
    updatedAt: '2026-08-29'
  },
  {
    id: 'OJT-012',
    employee: 'นายกฤต พร้อมใจ',
    employeeId: 'EMP003',
    department: 'QC Section',
    wi: 'QCW001-002',
    wiName: 'การทดสอบพิกัดกำลังไฟฟ้าและแรงดันสูง',
    skillType: 'D - Data Analysis & Troubleshooting',
    date: '2026-08-20',
    trainer: 'นางสาวอรุณี รักดี',
    theoryScore: 86,
    practicalScore: 88,
    status: 'passed',
    submissionStatus: 'approved',
    updatedAt: '2026-08-21'
  },
  {
    id: 'OJT-013',
    employee: 'นางสาวอรทัย ใฝ่รู้',
    employeeId: 'EMP010',
    department: 'Engineering',
    wi: 'ENG-M-002',
    wiName: 'การสอบเทียบเครื่องมือวัดไฟฟ้ามาตรฐาน ISO/IEC 17025',
    skillType: 'D - Data Analysis & Troubleshooting',
    date: '2026-08-15',
    trainer: 'นายวิชัย เก่งดี',
    theoryScore: 74,
    practicalScore: 86,
    status: 'passed',
    submissionStatus: 'rejected',
    managerRemark: 'คะแนนสอบภาคทฤษฎีไม่ผ่านเกณฑ์ขั้นต่ำ 80% ต้องลงทะเบียนสอบซ่อมใหม่',
    updatedAt: '2026-08-16'
  },
  {
    id: 'OJT-014',
    employee: 'นายสุรชัย สายชล',
    employeeId: 'EMP009',
    department: 'Production',
    wi: 'PROD-010-01',
    wiName: 'การพันคอยล์และประกอบแกนเหล็กหม้อแปลง',
    skillType: 'B - Machine Operator / Testing Station Control',
    date: '2026-08-10',
    trainer: 'Chief เอกวิทย์',
    theoryScore: 88,
    practicalScore: 92,
    status: 'passed',
    submissionStatus: 'approved',
    updatedAt: '2026-08-11'
  }
];

const SUBMISSION_LABEL: Record<string, { label: string; color: string }> = {
  draft:     { label: 'บันทึกแล้ว (รอส่ง)', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  submitted: { label: 'รออนุมัติจาก Manager', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved:  { label: 'อนุมัติแล้ว', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected:  { label: 'ถูกปฏิเสธ (ต้องแก้ไข)', color: 'bg-red-50 text-red-600 border-red-200' },
};

const ITEMS_PER_PAGE = 8;

export default function Training() {
  const [records, setRecords] = useState<OJTRecord[]>(expandedOJTRecords);
  const [viewMode, setViewMode] = useState<'current' | 'history'>('current');
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [resultFilter, setResultFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Inline Form State (No Popup Modal!)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    employee: '',
    employeeId: '',
    department: 'QC Section',
    wi: masterWIs[0].code,
    skillType: '',
    date: new Date().toISOString().slice(0, 10),
    trainer: '',
    theoryScore: '',
    practicalScore: '',
    note: ''
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Selected W/I object to get available Skill Types
  const selectedWiObj = masterWIs.find(w => w.code === form.wi) || masterWIs[0];
  const availableSkillTypes = selectedWiObj.types.map(tCode => masterSkillTypes[tCode]).filter(Boolean);

  // Filter Calculation
  const filteredRecords = records.filter(r => {
    const matchesSearch = r.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.wi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.wiName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = deptFilter === 'ALL' || r.department === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || r.submissionStatus === statusFilter;
    const matchesResult = resultFilter === 'ALL' || r.status === resultFilter;
    
    let matchesDate = true;
    if (startDate) matchesDate = matchesDate && r.date >= startDate;
    if (endDate) matchesDate = matchesDate && r.date <= endDate;

    // View Mode Filter
    const matchesViewMode = viewMode === 'current'
      ? ['draft', 'submitted'].includes(r.submissionStatus)
      : ['approved', 'rejected'].includes(r.submissionStatus);

    return matchesSearch && matchesDept && matchesStatus && matchesResult && matchesDate && matchesViewMode;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Counts
  const currentCount = records.filter(r => ['draft', 'submitted'].includes(r.submissionStatus)).length;
  const historyCount = records.filter(r => ['approved', 'rejected'].includes(r.submissionStatus)).length;

  // Calculate scores
  const theoryNum = parseFloat(form.theoryScore) || 0;
  const practicalNum = parseFloat(form.practicalScore) || 0;
  const isPassed = theoryNum >= 80 && practicalNum >= 80;
  const formValid = form.employee && form.wi && form.skillType && form.date && form.theoryScore && form.practicalScore;

  // Handlers for Inline Form
  const handleOpenAddForm = () => {
    setEditingId(null);
    const firstWi = masterWIs[0];
    const firstSkillType = masterSkillTypes[firstWi.types[0]];
    const defaultEmp = employeesList[0];

    setForm({
      employee: defaultEmp.name,
      employeeId: defaultEmp.id,
      department: defaultEmp.department,
      wi: firstWi.code,
      skillType: firstSkillType,
      date: new Date().toISOString().slice(0, 10),
      trainer: 'Chief เอกวิทย์',
      theoryScore: '85',
      practicalScore: '85',
      note: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (record: OJTRecord) => {
    if (record.submissionStatus === 'approved') {
      alert('รายการนี้ผ่านการอนุมัติจาก Manager เรียบร้อยแล้ว ไม่สามารถแก้ไขได้');
      return;
    }

    setEditingId(record.id);
    setForm({
      employee: record.employee,
      employeeId: record.employeeId,
      department: record.department,
      wi: record.wi,
      skillType: record.skillType,
      date: record.date,
      trainer: record.trainer,
      theoryScore: String(record.theoryScore),
      practicalScore: String(record.practicalScore),
      note: record.managerRemark || ''
    });
    setIsFormOpen(true);
  };

  const handleSave = (submitNow: boolean) => {
    if (!formValid) return;

    const wiObj = masterWIs.find(w => w.code === form.wi) || masterWIs[0];

    if (editingId) {
      setRecords(prev => prev.map(r => r.id === editingId ? {
        ...r,
        employee: form.employee,
        employeeId: form.employeeId,
        department: form.department,
        wi: form.wi,
        wiName: wiObj.name,
        skillType: form.skillType,
        date: form.date,
        trainer: form.trainer,
        theoryScore: theoryNum,
        practicalScore: practicalNum,
        status: isPassed ? 'passed' : 'failed',
        submissionStatus: submitNow && isPassed ? 'submitted' : 'draft',
        updatedAt: new Date().toISOString().slice(0, 10)
      } : r));
      showToast(`อัปเดตข้อมูล OJT (${editingId}) เรียบร้อยแล้ว`);
    } else {
      const newRecord: OJTRecord = {
        id: `OJT-${String(records.length + 1).padStart(3, '0')}`,
        employee: form.employee,
        employeeId: form.employeeId,
        department: form.department,
        wi: form.wi,
        wiName: wiObj.name,
        skillType: form.skillType,
        date: form.date,
        trainer: form.trainer,
        theoryScore: theoryNum,
        practicalScore: practicalNum,
        status: isPassed ? 'passed' : 'failed',
        submissionStatus: submitNow && isPassed ? 'submitted' : 'draft',
        updatedAt: new Date().toISOString().slice(0, 10)
      };
      setRecords([newRecord, ...records]);
      showToast(submitNow && isPassed ? 'บันทึกและส่งขออนุมัติ OJT สำเร็จ' : 'บันทึกฉบับร่าง OJT สำเร็จ');
    }

    setIsFormOpen(false);
  };

  const handleSubmitDraft = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, submissionStatus: 'submitted' } : r));
    showToast(`ส่งคำขออนุมัติ OJT (${id}) ไปยัง Manager สำเร็จ`);
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
            <BookOpen className="text-[#0a2540]" /> แผนการฝึกอบรม (OJT)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Chief บันทึกผลการทดสอบหลังอบรม ดึงโครงสร้างมาตรฐาน W/I จาก Master Data ส่งให้ Manager เลื่อน Skill Level 0 → 1
          </p>
        </div>

        {!isFormOpen && (
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-200/70 p-1 rounded-xl">
              <button
                onClick={() => { setViewMode('current'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'current' 
                    ? 'bg-white text-[#0a2540] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers size={14} /> รายการปัจจุบัน ({currentCount})
              </button>
              <button
                onClick={() => { setViewMode('history'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'history' 
                    ? 'bg-white text-[#0a2540] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History size={14} /> ประวัติการอนุมัติ ({historyCount})
              </button>
            </div>

            <button
              onClick={handleOpenAddForm}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg transition-colors font-semibold shadow-md text-sm"
            >
              <Plus size={18} /> บันทึกผล OJT ใหม่
            </button>
          </div>
        )}
      </div>

      {/* Flow Hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <div className="text-blue-500 mt-0.5 flex-shrink-0">ℹ️</div>
        <div className="text-sm text-blue-900 space-y-0.5">
          <div className="font-bold">ขั้นตอนการทำงาน (OJT Competency Flow)</div>
          <div className="text-blue-700 text-xs">
            <span className="font-semibold">นอกระบบ:</span> Staff ปฏิบัติงานจริง → เรียนรู้ผ่าน OJT → ทดสอบภาคทฤษฎีและปฏิบัติ
            &nbsp;→&nbsp;
            <span className="font-semibold">ในระบบ (Chief):</span> เลือก W/I จาก Master Data → บันทึกคะแนน → ส่งขออนุมัติ
            &nbsp;→&nbsp;
            <span className="font-semibold">ในระบบ (Manager):</span> อนุมัติ → ระบบปรับ Level 0 → 1 อัตโนมัติ
          </div>
        </div>
      </div>

      {/* INLINE FORM: Add / Edit OJT (No Popup Modal!) */}
      {isFormOpen && (
        <div className="bg-white rounded-xl border-2 border-blue-500 shadow-xl overflow-hidden transition-all duration-300">
          <div className="bg-gradient-to-r from-[#0a2540] to-blue-900 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)} 
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-200"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-lg font-bold">
                  {editingId ? `แก้ไขบันทึกผล OJT (${editingId})` : 'บันทึกผลการทดสอบ OJT ใหม่ (Inline Form)'}
                </h2>
                <p className="text-xs text-blue-200">กรอกคะแนนทดสอบและเลือกมาตรฐาน W/I ที่ซิงก์จาก Master Data</p>
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

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Employee Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  <User size={13} /> พนักงานผู้เข้ารับการอบรม <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.employee}
                  onChange={e => {
                    const emp = employeesList.find(emp => emp.name === e.target.value);
                    if (emp) {
                      setForm({ ...form, employee: emp.name, employeeId: emp.id, department: emp.department });
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium text-slate-800"
                >
                  {employeesList.map(e => (
                    <option key={e.id} value={e.name}>{e.name} ({e.id}) - {e.department}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  <Calendar size={13} /> วันที่ทดสอบ <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800"
                />
              </div>

              {/* Trainer */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">ผู้สอน / วิทยากร (Trainer)</label>
                <input
                  type="text"
                  placeholder="ชื่อผู้ฝึกสอน (Engineer หรือผู้มี Level 3)"
                  value={form.trainer}
                  onChange={e => setForm({ ...form, trainer: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800"
                />
              </div>

              {/* W/I Master Data Select */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                  <span>เลือก Work Instruction (ซิงก์จาก Master Data) <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedWiObj.department}
                  </span>
                </label>
                <select
                  value={form.wi}
                  onChange={e => {
                    const newWiCode = e.target.value;
                    const newWiObj = masterWIs.find(w => w.code === newWiCode) || masterWIs[0];
                    const firstSkillType = masterSkillTypes[newWiObj.types[0]] || '';
                    setForm({ ...form, wi: newWiCode, skillType: firstSkillType });
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-bold text-slate-800"
                >
                  {masterWIs.map(w => (
                    <option key={w.code} value={w.code}>{w.code} - {w.name} ({w.department})</option>
                  ))}
                </select>
              </div>

              {/* Skill Type DYNAMIC Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Skill Type ที่ประเมิน <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.skillType}
                  onChange={e => setForm({ ...form, skillType: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-semibold text-blue-900"
                >
                  {availableSkillTypes.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Score Calculator Card */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
              <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Award size={18} className="text-blue-600" />
                คะแนนสอบประเมินผล (เกณฑ์ผ่าน ≥ 80% ทั้งสองส่วน)
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">ภาคทฤษฎี (%) <span className="text-red-500">*</span></label>
                  <input
                    type="number" min="0" max="100" placeholder="0 - 100"
                    value={form.theoryScore} onChange={e => setForm({ ...form, theoryScore: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-bold text-slate-800"
                  />
                  {form.theoryScore && (
                    <div className={`text-xs font-bold ${theoryNum >= 80 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {theoryNum >= 80 ? '✓ ผ่านเกณฑ์ (≥ 80%)' : '✗ ไม่ผ่านเกณฑ์ (< 80%)'}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">ภาคปฏิบัติ (%) <span className="text-red-500">*</span></label>
                  <input
                    type="number" min="0" max="100" placeholder="0 - 100"
                    value={form.practicalScore} onChange={e => setForm({ ...form, practicalScore: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-bold text-slate-800"
                  />
                  {form.practicalScore && (
                    <div className={`text-xs font-bold ${practicalNum >= 80 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {practicalNum >= 80 ? '✓ ผ่านเกณฑ์ (≥ 80%)' : '✗ ไม่ผ่านเกณฑ์ (< 80%)'}
                    </div>
                  )}
                </div>
              </div>

              {form.theoryScore && form.practicalScore && (
                <div className={`rounded-xl p-4 border ${isPassed ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'}`}>
                  <div className={`font-bold text-sm flex items-center gap-2 ${isPassed ? 'text-emerald-800' : 'text-red-700'}`}>
                    {isPassed ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {isPassed ? 'ผลการประเมิน: ผ่านเกณฑ์การอบรม OJT' : 'ผลการประเมิน: ไม่ผ่านเกณฑ์'}
                  </div>
                  <p className={`text-xs mt-1 ${isPassed ? 'text-emerald-700' : 'text-red-600'}`}>
                    {isPassed
                      ? 'คะแนนสมบูรณ์แบบ สามารถส่งขออนุมัติให้ Manager เพื่อเลื่อน Skill Level จาก 0 เป็น 1'
                      : 'คะแนนต่ำกว่าเกณฑ์ ไม่สามารถส่งขออนุมัติปรับ Skill Level ได้ ต้องจัดสอบซ่อมใหม่'}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={!formValid}
                className="px-5 py-2.5 border border-[#0a2540] text-[#0a2540] hover:bg-slate-50 rounded-lg font-semibold text-sm transition-colors disabled:opacity-40"
              >
                บันทึก (ยังไม่ส่ง)
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={!formValid || !isPassed}
                className="px-6 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg font-semibold text-sm transition-colors shadow-md flex items-center gap-2 disabled:opacity-40"
              >
                <Send size={16} /> บันทึก + ส่งขออนุมัติ Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER FILTERS (กรองตามแผนก, ผลการทดสอบ, สถานะ, วันที่, ค้นหา) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Filter size={14} /> ตัวกรองข้อมูลตาราง OJT (Filters Bar)
          </div>
          {(searchQuery || deptFilter !== 'ALL' || statusFilter !== 'ALL' || resultFilter !== 'ALL' || startDate || endDate) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setDeptFilter('ALL');
                setStatusFilter('ALL');
                setResultFilter('ALL');
                setStartDate('');
                setEndDate('');
                setCurrentPage(1);
              }}
              className="text-xs text-red-500 hover:underline font-semibold"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นชื่อพนักงาน, รหัส หรือ W/I..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={deptFilter}
              onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">ทุกแผนก</option>
              <option value="QC Section">QC Section</option>
              <option value="Production">Production</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>

          {/* Submission Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">ทุกสถานะคำขอ</option>
              <option value="draft">บันทึกแล้ว (รอส่ง)</option>
              <option value="submitted">รออนุมัติจาก Manager</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="rejected">ถูกปฏิเสธ</option>
            </select>
          </div>

          {/* Test Result Filter */}
          <div>
            <select
              value={resultFilter}
              onChange={e => { setResultFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">ทุกผลการสอบ</option>
              <option value="passed">ผ่าน (≥ 80%)</option>
              <option value="failed">ไม่ผ่าน (&lt; 80%)</option>
            </select>
          </div>

          {/* Date Range Start & End */}
          <div className="flex items-center gap-1.5 md:col-span-1">
            <input
              type="date"
              title="ตั้งแต่วันที่"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-[11px] text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-slate-500" />
            <span className="text-sm font-bold text-slate-800">
              {viewMode === 'current' ? 'รายการ OJT ปัจจุบัน และ รออนุมัติ' : 'ประวัติการอบรม OJT ที่ผ่านการพิจารณา (History Log)'}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500">รวมทั้งหมด {filteredRecords.length} รายการ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wide">
                <th className="px-4 py-3.5">รหัส OJT</th>
                <th className="px-4 py-3.5">พนักงาน</th>
                <th className="px-4 py-3.5">W/I & Skill Type (จาก Master Data)</th>
                <th className="px-4 py-3.5 text-center">วันที่ทดสอบ</th>
                <th className="px-3 py-3.5 text-center">ทฤษฎี</th>
                <th className="px-3 py-3.5 text-center">ปฏิบัติ</th>
                <th className="px-4 py-3.5 text-center">ผลสอบ</th>
                <th className="px-4 py-3.5 text-center">สถานะ</th>
                <th className="px-4 py-3.5 text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    ไม่พบรายการ OJT ที่ตรงตามตัวกรอง
                  </td>
                </tr>
              ) : (
                paginatedRecords.map(r => {
                  const sub = SUBMISSION_LABEL[r.submissionStatus];
                  const canEdit = r.submissionStatus !== 'approved'; // EDITABLE UNLESS APPROVED!

                  return (
                    <tr key={r.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-4 font-mono text-xs font-bold text-slate-600 whitespace-nowrap">{r.id}</td>
                      
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-800">{r.employee}</div>
                        <div className="text-xs text-slate-400">{r.employeeId} · {r.department}</div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          <span className="bg-blue-50 border border-blue-200 text-blue-900 px-1.5 py-0.5 rounded font-mono">
                            {r.wi}
                          </span>
                          <span className="truncate max-w-[200px]" title={r.wiName}>{r.wiName}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">{r.skillType}</div>
                      </td>

                      <td className="px-4 py-4 text-center text-xs text-slate-600 whitespace-nowrap font-medium">{r.date}</td>

                      <td className="px-3 py-4 text-center font-bold text-xs whitespace-nowrap">
                        <span className={r.theoryScore >= 80 ? 'text-emerald-600' : 'text-red-500'}>
                          {r.theoryScore}%
                        </span>
                      </td>

                      <td className="px-3 py-4 text-center font-bold text-xs whitespace-nowrap">
                        <span className={r.practicalScore >= 80 ? 'text-emerald-600' : 'text-red-500'}>
                          {r.practicalScore}%
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        {r.status === 'passed' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle size={12} /> ผ่าน
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[11px] font-bold px-2.5 py-1 rounded-full border border-red-200">
                            <XCircle size={12} /> ไม่ผ่าน
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border ${sub.color}`}>
                          {sub.label}
                        </span>
                        {r.managerRemark && (
                          <div className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate" title={r.managerRemark}>
                            หมายเหตุ: {r.managerRemark}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          {/* EDIT BUTTON (ALLOWED ONLY IF NOT APPROVED) */}
                          {canEdit ? (
                            <button
                              onClick={() => handleOpenEditForm(r)}
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 border border-blue-200"
                              title="แก้ไขข้อมูล OJT"
                            >
                              <Edit size={13} /> แก้ไข
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-100 rounded border border-slate-200" title="รายการนี้ถูกอนุมัติแล้ว ไม่สามารถแก้ไขได้">
                              อนุมัติแล้ว (อ่านอย่างเดียว)
                            </span>
                          )}

                          {/* SUBMIT DRAFT BUTTON */}
                          {r.submissionStatus === 'draft' && r.status === 'passed' && (
                            <button
                              onClick={() => handleSubmitDraft(r.id)}
                              className="px-2.5 py-1 bg-[#0a2540] text-white hover:bg-[#0d3060] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                              title="ส่งคำขออนุมัติไปยัง Manager"
                            >
                              <Send size={12} /> ส่งอนุมัติ
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION / PARTITION CONTROLS (8 items per page) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-slate-200 text-xs text-slate-500 bg-slate-50/50">
          <div>
            แสดงผล {filteredRecords.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredRecords.length)} จากทั้งหมด {filteredRecords.length} รายการ
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
    </div>
  );
}
