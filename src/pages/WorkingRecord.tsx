import React, { useState } from 'react';
import { Plus, Search, Filter, Play, CheckCircle, CheckCircle2, AlertTriangle, Clock, Calendar, Activity, Briefcase, BarChart2, Award, Sparkles, X } from 'lucide-react';
import Pagination from '../components/Pagination';

interface WorkRecord {
  id: string;
  date: string;
  sn: string;
  employee: string;
  department: string;
  wi: string;
  skillType: string;
  type: 'Normal' | 'Rework QC' | 'Rework Mfg';
  startTime: string;
  finishTime: string;
  actualHrs: number;
  standardHrs: number;
  status: 'เสร็จสมบูรณ์' | 'กำลังดำเนินการ';
  nc: string | null;
}

// Highly consistent mock data aligned with MasterData and Employees
const mockWorkingRecords: WorkRecord[] = Array.from({ length: 45 }).map((_, i) => {
  const departments = ['QC Section', 'Engineering', 'Production'];
  const employeesByDept: Record<string, string[]> = {
    'QC Section': ['นายสมชาย ใจดี', 'นายกฤต พร้อมใจ', 'นางสมศรี มีสุข'],
    'Engineering': ['นางสาวแนน สุขใจ'],
    'Production': ['นายสมศักดิ์ มั่นคง']
  };
  const dept = departments[i % 3];
  const empList = employeesByDept[dept];
  const emp = empList[i % empList.length];
  
  const wiList = ['QCW001-001', 'QCW001-002', 'QCW002-001', 'QCW004-001', 'QCW005-001', 'ENG-M-001', 'ENG-D-003', 'PROD-010-01', 'PROD-020-01'];
  const wi = wiList[i % wiList.length];
  
  const skillTypes = ['A - Circuit Connecting', 'B - Machine Operator', 'C - Inspection Report', 'D - Data Analysis', 'E - Safety Control'];
  const skill = skillTypes[i % skillTypes.length];
  
  // Distribute dates over a week
  const dateObj = new Date(2026, 9, 5 - (i % 7)); // Oct 5, 2026 backwards
  const dateStr = dateObj.toISOString().split('T')[0];

  const isRework = i % 8 === 0;
  
  return {
    id: `JOB-${261005 - i}-${i.toString().padStart(2, '0')}`,
    date: dateStr,
    sn: `PP${(600 - i).toString().padStart(3, '0')}A${(i+1).toString().padStart(2, '0')}`,
    employee: emp,
    department: dept,
    wi: wi,
    skillType: skill,
    type: isRework ? 'Rework QC' : 'Normal',
    startTime: '08:00',
    finishTime: i % 5 === 0 ? '' : '12:00',
    actualHrs: i % 5 === 0 ? 0 : 4.0,
    standardHrs: 3.5 + (i % 2),
    status: i % 5 === 0 ? 'กำลังดำเนินการ' : 'เสร็จสมบูรณ์',
    nc: isRework ? `NC-2609-${(100+i).toString()}` : null
  };
});


const WI_SKILL_MAPPING: Record<string, string[]> = {
  'QCW001-001': ['A - Circuit Connecting', 'B - Machine Operator', 'C - Inspection Report', 'D - Data Analysis'],
  'QCW001-002': ['A - Circuit Connecting', 'B - Machine Operator', 'C - Inspection Report', 'D - Data Analysis'],
  'QCW002-001': ['C - Inspection Report', 'D - Data Analysis'],
  'QCW004-001': ['A - Circuit Connecting', 'C - Inspection Report', 'D - Data Analysis'],
  'QCW005-001': ['C - Inspection Report', 'E - Safety Control'],
  'ENG-M-001': ['B - Machine Operator', 'D - Data Analysis', 'E - Safety Control'],
  'ENG-M-002': ['C - Inspection Report', 'D - Data Analysis'],
  'ENG-D-003': ['B - Machine Operator', 'D - Data Analysis'],
  'PROD-010-01': ['A - Circuit Connecting', 'B - Machine Operator', 'E - Safety Control'],
  'PROD-010-02': ['B - Machine Operator', 'C - Inspection Report', 'E - Safety Control'],
  'PROD-020-01': ['B - Machine Operator', 'E - Safety Control'],
  'PROD-030-01': ['B - Machine Operator', 'E - Safety Control']
};

const ALL_SKILL_TYPES = [
  'A - Circuit Connecting',
  'B - Machine Operator',
  'C - Inspection Report',
  'D - Data Analysis',
  'E - Safety Control'
];

export default function WorkingRecord({ userRole = 'admin' }: { userRole?: string }) {
  const isStaff = userRole === 'staff' || userRole === 'clerk';
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager' || userRole === 'admin';

  const [records, setRecords] = useState(mockWorkingRecords);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form States
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formSn, setFormSn] = useState('');
  const [formEmployee, setFormEmployee] = useState(isStaff ? 'นายสมชาย ใจดี' : 'นายสมชาย ใจดี');
  const [formWi, setFormWi] = useState('QCW001-001');
  const [formSkillType, setFormSkillType] = useState('A - Circuit Connecting');
  const [formJobType, setFormJobType] = useState<'Normal' | 'Rework QC' | 'Rework Mfg'>('Normal');
  const [formStartTime, setFormStartTime] = useState('08:00');
  const [formFinishTime, setFormFinishTime] = useState('12:00');
  const [formNc, setFormNc] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleWiChange = (newWi: string) => {
    setFormWi(newWi);
    const availableSkills = WI_SKILL_MAPPING[newWi] || ALL_SKILL_TYPES;
    if (!availableSkills.includes(formSkillType)) {
      setFormSkillType(availableSkills[0]);
    }
  };

  const handleSubmitJob = (e: React.FormEvent) => {
    e.preventDefault();

    let actualHrs = 4.0;
    if (formStartTime && formFinishTime) {
      const [startH, startM] = formStartTime.split(':').map(Number);
      const [finH, finM] = formFinishTime.split(':').map(Number);
      const diff = (finH * 60 + finM) - (startH * 60 + startM);
      if (diff > 0) {
        actualHrs = Number((diff / 60).toFixed(1));
      }
    }

    const assignedEmployee = isStaff ? 'นายสมชาย ใจดี' : formEmployee;
    let dept = 'QC Section';
    if (assignedEmployee === 'นางสาวแนน สุขใจ') dept = 'Engineering';
    else if (assignedEmployee === 'นายสมศักดิ์ มั่นคง') dept = 'Production';

    const generatedSn = formSn.trim() || `PP06${Math.floor(10 + Math.random() * 89)}A01`;

    const newRecord: WorkRecord = {
      id: `JOB-${Date.now().toString().slice(-6)}`,
      date: formDate || new Date().toISOString().split('T')[0],
      sn: generatedSn,
      employee: assignedEmployee,
      department: dept,
      wi: formWi,
      skillType: formSkillType,
      type: formJobType,
      startTime: formStartTime || '08:00',
      finishTime: formFinishTime,
      actualHrs: formFinishTime ? actualHrs : 0,
      standardHrs: 3.5,
      status: formFinishTime ? 'เสร็จสมบูรณ์' : 'กำลังดำเนินการ',
      nc: formJobType !== 'Normal' ? (formNc || 'NC-2610-099') : null
    };

    setRecords([newRecord, ...records]);
    setSuccessMessage(`บันทึกข้อมูลงาน ${generatedSn} (${formWi} - ${formSkillType}) สำหรับ ${assignedEmployee} เรียบร้อยแล้ว!`);
    setTimeout(() => setSuccessMessage(''), 5000);
    setIsFormOpen(false);

    // Reset inputs
    setFormSn('');
    setFormNc('');
    setFormJobType('Normal');
  };

  // Table Filters (Affects both Table and KPIs base)
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(isManager ? 'ALL' : 'QC Section');
  const [selectedEmp, setSelectedEmp] = useState(isStaff ? 'นายสมชาย ใจดี' : 'ALL');

  const [selectedWI, setSelectedWI] = useState('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // KPI Specific Filter (Only affects KPI cards)
  const [kpiSkillFilter, setKpiSkillFilter] = useState('ALL');
  const [kpiWIFilter, setKpiWIFilter] = useState('ALL');

  // Logic: Filter records for the Table
  const filteredRecords = records.filter(r => {
    // Role-based enforcement
    if (isStaff && r.employee !== 'นายสมชาย ใจดี') return false;
    if (isChief && r.department !== 'QC Section') return false;
    
    // State filters
    if (filterDate && r.date !== filterDate) return false;
    if (!isStaff && selectedDept !== 'ALL' && r.department !== selectedDept) return false;
    if (!isStaff && selectedEmp !== 'ALL' && r.employee !== selectedEmp) return false;
    if (selectedWI !== 'ALL' && r.wi !== selectedWI) return false;
    
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.sn.toLowerCase().includes(q) && !r.employee.toLowerCase().includes(q) && !r.wi.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Logic: Filter records for KPIs ONLY
  // Pagination logic
  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  // Ensure current page is valid
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const kpiRecords = filteredRecords.filter(r => {
    let match = true;
    if (kpiSkillFilter !== 'ALL' && !r.skillType.startsWith(kpiSkillFilter)) match = false;
    if (kpiWIFilter !== 'ALL' && r.wi !== kpiWIFilter) match = false;
    return match;
  });

  const totalActual = kpiRecords.reduce((sum, r) => sum + r.actualHrs, 0);
  const totalStandard = kpiRecords.reduce((sum, r) => sum + r.standardHrs, 0);
  const productivity = totalActual > 0 ? (totalStandard / totalActual * 100).toFixed(1) : 0;
  const reworkCount = kpiRecords.filter(r => r.type !== 'Normal').length;
  
  // Get unique WIs from the current dataset for dropdowns
  const uniqueWIs = Array.from(new Set(records.map(r => r.wi))).sort();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-indigo-600" /> บันทึกการทำงาน (Daily Working Record)
          </h1>
          <p className="text-slate-500 text-sm mt-1">บันทึกข้อมูลงาน Assignment, เวลาทำงานจริง (Actual Hours) และ NC/Rework ประจำวัน</p>
        </div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold shadow-sm text-sm">
          <Plus size={18} /> {isFormOpen ? 'ยกเลิก' : 'บันทึกข้อมูลงาน ใหม่'}
        </button>
      </div>

      {/* Success Notification Toast */}
      {successMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-800 px-4 py-3 rounded-xl shadow-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600 shrink-0" size={22} />
            <span className="font-bold text-sm">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-emerald-600 hover:text-emerald-800 text-sm font-bold">
            <X size={18} />
          </button>
        </div>
      )}

      {/* KPI Section with its own separate filter */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-indigo-600" />
            <h2 className="font-bold text-slate-700">ข้อมูลสรุปประสิทธิภาพ (KPIs)</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">กรองเฉพาะ Skill Type:</span>
            <select 
              value={kpiSkillFilter} 
              onChange={(e) => setKpiSkillFilter(e.target.value)}
              className="border border-indigo-200 text-indigo-700 bg-indigo-50/50 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">รวมทุก Skill Type (ALL)</option>
              <option value="A">A - Circuit Connecting</option>
              <option value="B">B - Machine Operator</option>
              <option value="C">C - Inspection Report</option>
              <option value="D">D - Data Analysis</option>
              <option value="E">E - Safety Control</option>
            </select>
            <select 
              value={kpiWIFilter} 
              onChange={(e) => setKpiWIFilter(e.target.value)}
              className="border border-indigo-200 text-indigo-700 bg-indigo-50/50 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">รวมทุก W/I</option>
              {uniqueWIs.map(wi => <option key={wi} value={wi}>{wi}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between hover:border-blue-300 transition-colors">
            <div><p className="text-sm text-slate-500 font-medium">เวลาทำงานจริง (Actual)</p><h3 className="text-2xl font-bold text-slate-800 mt-1">{totalActual} hrs</h3></div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Clock size={20} /></div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-colors">
            <div><p className="text-sm text-slate-500 font-medium">เวลามาตรฐาน (Standard)</p><h3 className="text-2xl font-bold text-slate-800 mt-1">{totalStandard} hrs</h3></div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle size={20} /></div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-colors">
            <div><p className="text-sm text-slate-500 font-medium">ประสิทธิภาพ (Productivity)</p><h3 className="text-2xl font-bold text-indigo-700 mt-1">{productivity}%</h3></div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Activity size={20} /></div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between hover:border-rose-300 transition-colors">
            <div><p className="text-sm text-slate-500 font-medium">งานแก้และเสีย (Rework/NC)</p><h3 className="text-2xl font-bold text-rose-600 mt-1">{reworkCount} Jobs</h3></div>
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600"><AlertTriangle size={20} /></div>
          </div>
        </div>
      </div>

      {/* Inline Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmitJob} className="bg-white p-6 rounded-2xl border-2 border-indigo-200 shadow-xl mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-indigo-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <Briefcase size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-800">แบบฟอร์มบันทึกมอบหมายงาน (Job Assignment & Skill Practice)</h2>
                  <span className="bg-indigo-100 text-indigo-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles size={11} /> ISO 17025 Tracked
                  </span>
                </div>
                <p className="text-xs text-slate-500">ระบุ W/I พร้อมทักษะ (Skill Type) ที่ปฏิบัติเพื่อสะสมประวัติชั่วโมงและผลงานสำหรับ Skill Matrix</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {/* วันที่ */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">วันที่ปฏิบัติงาน</label>
              <input 
                type="date" 
                value={formDate} 
                onChange={e => setFormDate(e.target.value)} 
                required
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-semibold bg-white focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>

            {/* Job S/N */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job S/N (หมายเลขชิ้นงาน)</label>
              <input 
                type="text" 
                placeholder="e.g. PP0600A05 (เว้นว่างเพื่อ Auto)" 
                value={formSn} 
                onChange={e => setFormSn(e.target.value)} 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>

            {/* พนักงาน */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">พนักงานผู้ปฏิบัติ</label>
              {isStaff ? (
                <div className="w-full border border-slate-200 bg-slate-100 rounded-lg p-2.5 text-sm font-bold text-slate-700 flex items-center justify-between">
                  <span>นายสมชาย ใจดี</span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">STAFF</span>
                </div>
              ) : (
                <select 
                  value={formEmployee} 
                  onChange={e => setFormEmployee(e.target.value)} 
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-semibold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="นายสมชาย ใจดี">นายสมชาย ใจดี (QC Section)</option>
                  <option value="นายกฤต พร้อมใจ">นายกฤต พร้อมใจ (QC Section)</option>
                  <option value="นางสมศรี มีสุข">นางสมศรี มีสุข (QC Section)</option>
                  <option value="นางสาวแนน สุขใจ">นางสาวแนน สุขใจ (Engineering)</option>
                  <option value="นายสมศักดิ์ มั่นคง">นายสมศักดิ์ มั่นคง (Production)</option>
                </select>
              )}
            </div>

            {/* W/I */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">ขั้นตอนงาน (W/I)</label>
              <select 
                value={formWi} 
                onChange={e => handleWiChange(e.target.value)} 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-semibold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {uniqueWIs.map(wi => (
                  <option key={wi} value={wi}>{wi}</option>
                ))}
              </select>
            </div>

            {/* Skill Type - Highlighted */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-indigo-700 uppercase mb-1 flex items-center gap-1.5">
                <Award size={14} className="text-indigo-600" />
                ทักษะที่ปฏิบัติ (Skill Type) <span className="text-rose-500">*จำเป็นสำหรับ Matrix</span>
              </label>
              <select 
                value={formSkillType} 
                onChange={e => setFormSkillType(e.target.value)} 
                className="w-full border-2 border-indigo-400 bg-indigo-50/50 text-indigo-900 font-bold rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              >
                {(WI_SKILL_MAPPING[formWi] || ALL_SKILL_TYPES).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <span className="text-[11px] text-indigo-600 mt-1 block font-medium">
                💡 เชื่อมโยงตามรายการทักษะที่อนุมัติใน W/I: <strong className="font-bold">{formWi}</strong>
              </span>
            </div>

            {/* ประเภทงาน (Job Type) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">ประเภทงาน (Job Type)</label>
              <select 
                value={formJobType} 
                onChange={e => setFormJobType(e.target.value as any)} 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-semibold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Normal">Normal (งานปกติ)</option>
                <option value="Rework QC">Rework QC (งานแก้ QC)</option>
                <option value="Rework Mfg">Rework Mfg (งานแก้ฝ่ายผลิต)</option>
              </select>
            </div>

            {/* NC Number (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                NC Number {formJobType === 'Normal' ? '(ไม่ระบุ)' : '*'}
              </label>
              <select 
                value={formNc} 
                onChange={e => setFormNc(e.target.value)} 
                disabled={formJobType === 'Normal'}
                className={`w-full border rounded-lg p-2.5 text-sm font-semibold outline-none ${formJobType === 'Normal' ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-rose-50 text-rose-800 border-rose-300 focus:ring-2 focus:ring-rose-500'}`}
              >
                <option value="">-- ไม่ระบุ (งานปกติ) --</option>
                <option value="NC-2610-001">NC-2610-001 : รอยขีดข่วนตัวถัง</option>
                <option value="NC-2610-002">NC-2610-002 : ค่าความต้านทานเกินพิกัด</option>
                <option value="NC-2610-003">NC-2610-003 : สีหลุดร่อน</option>
                <option value="NC-2610-004">NC-2610-004 : ขั้วต่อสายหลวม</option>
              </select>
            </div>

            {/* เริ่ม (Start) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">เวลาเริ่ม (Start)</label>
              <input 
                type="time" 
                value={formStartTime} 
                onChange={e => setFormStartTime(e.target.value)} 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>

            {/* เสร็จ (Finish) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">เวลาเสร็จ (Finish)</label>
              <input 
                type="time" 
                value={formFinishTime} 
                onChange={e => setFormFinishTime(e.target.value)} 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">เว้นว่างได้หากกำลังทำ</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button 
              type="button" 
              onClick={() => setIsFormOpen(false)} 
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-sm transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors shadow-md flex items-center gap-2"
            >
              <CheckCircle size={16} /> บันทึกข้อมูลงาน
            </button>
          </div>
        </form>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="ค้นหา Job S/N, พนักงาน, หรือ W/I..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Calendar size={16} className="text-slate-500" />
              <input 
                type="date" 
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {!isStaff && (
            <div className="flex flex-col md:flex-row gap-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase size={16} className="text-slate-400" />
                <span className="font-bold text-slate-600">กรองแผนก:</span>
                <select 
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  disabled={!isManager}
                  className={`border border-slate-300 rounded-lg px-3 py-1.5 font-bold outline-none ${!isManager ? 'bg-slate-100 text-slate-500' : 'bg-white text-indigo-700 focus:ring-2 focus:ring-indigo-500'}`}
                >
                  <option value="ALL">รวมทุกแผนก</option>
                  <option value="QC Section">QC Section</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Production">Production</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Filter size={16} className="text-slate-400" />
                <span className="font-bold text-slate-600">กรองพนักงาน:</span>
                <select 
                  value={selectedEmp}
                  onChange={e => setSelectedEmp(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 font-bold outline-none bg-white text-indigo-700 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ALL">ทุกคนในแผนก</option>
                  {selectedDept === 'QC Section' || selectedDept === 'ALL' ? (
                    <>
                      <option value="นายสมชาย ใจดี">นายสมชาย ใจดี</option>
                      <option value="นายกฤต พร้อมใจ">นายกฤต พร้อมใจ</option>
                      <option value="นางสมศรี มีสุข">นางสมศรี มีสุข</option>
                    </>
                  ) : null}
                  {selectedDept === 'Engineering' || selectedDept === 'ALL' ? (
                    <option value="นางสาวแนน สุขใจ">นางสาวแนน สุขใจ</option>
                  ) : null}
                  {selectedDept === 'Production' || selectedDept === 'ALL' ? (
                    <option value="นายสมศักดิ์ มั่นคง">นายสมศักดิ์ มั่นคง</option>
                  ) : null}
                </select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-slate-600">กรอง W/I:</span>
                <select 
                  value={selectedWI}
                  onChange={e => setSelectedWI(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 font-bold outline-none bg-white text-indigo-700 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ALL">ทุก W/I</option>
                  {uniqueWIs.map(wi => <option key={wi} value={wi}>{wi}</option>)}
                </select>
              </div>
            </div>
          )}

        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wide">
                <th className="px-4 py-3">Job S/N</th>
                <th className="px-4 py-3">วันที่</th>
                {!isStaff && <th className="px-4 py-3">พนักงาน</th>}
                <th className="px-4 py-3">W/I & Skill</th>
                <th className="px-4 py-3">ประเภทงาน & NC</th>
                <th className="px-4 py-3">เวลา (เริ่ม - เสร็จ)</th>
                <th className="px-4 py-3 text-center">เวลาจริง (มาตรฐาน)</th>
                <th className="px-4 py-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr><td colSpan={isStaff ? 7 : 8} className="text-center py-8 text-slate-500">ไม่มีประวัติการทำงานในเงื่อนไขที่เลือก</td></tr>
              ) : paginatedRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-700">{r.sn}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-bold">{r.date}</td>
                  {!isStaff && <td className="px-4 py-3 font-semibold text-slate-800">{r.employee}</td>}
                  <td className="px-4 py-3">
                    <div className="text-xs font-bold text-slate-700">{r.wi}</div>
                    <div className="text-[10px] text-slate-500">{r.skillType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${r.type === 'Normal' ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-700'}`}>{r.type}</span>
                    {r.nc && <div className="text-[10px] text-rose-500 font-mono mt-0.5">{r.nc}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    <span className="font-bold">{r.startTime}</span> - <span className="font-bold">{r.finishTime || 'Now'}</span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className={r.actualHrs > r.standardHrs ? 'text-rose-600' : 'text-emerald-600'}>{r.actualHrs}</span> 
                    <span className="text-slate-400 text-xs font-normal"> ({r.standardHrs})</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.status === 'เสร็จสมบูรณ์' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700"><CheckCircle size={12}/> เสร็จสมบูรณ์</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"><Play size={12}/> ดำเนินการ</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <Pagination 
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
