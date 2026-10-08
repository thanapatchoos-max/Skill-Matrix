import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, CheckCircle2, ShieldCheck, BookOpen, Layers, Search, Filter, Calendar, Check, Loader2, Eye, RefreshCw } from 'lucide-react';

interface ReportFilterState {
  matrixDept: string;
  matrixYear: string;
  auditStartDate: string;
  auditEndDate: string;
  auditType: string;
  ojtWi: string;
  ojtResult: string;
  gapDept: string;
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

export function Reports({ userRole = 'admin' }: { userRole?: string }) {
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager' || userRole === 'admin';
  const CHIEF_DEPT = 'QC Section'; // In production: from user session
  // Chief: pre-lock their department in all filters
  const initialDept = isChief ? 'QC Section' : 'ALL';
  const [filters, setFilters] = useState<ReportFilterState>({
    matrixDept: initialDept,
    matrixYear: '2026',
    auditStartDate: '2026-01-01',
    auditEndDate: '2026-10-01',
    auditType: 'ALL',
    ojtWi: 'ALL',
    ojtResult: 'ALL',
    gapDept: initialDept,
  });

  const [activePreview, setActivePreview] = useState<'matrix' | 'audit' | 'ojt' | 'gap' | null>('matrix');
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Browser CSV Download Helper
  const triggerCSVDownload = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.map(h => `"${h}"`).join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // EXPORT EXCEL HANDLER
  const handleExportExcel = (type: 'matrix' | 'audit' | 'ojt' | 'gap') => {
    setIsExporting(type + '_excel');

    setTimeout(() => {
      if (type === 'matrix') {
        const headers = ['Employee ID', 'Employee Name', 'Department', 'Position', 'W/I Code', 'Skill Type A', 'Skill Type B', 'Skill Type C', 'Skill Type D', 'Total Score'];
        const rows = [
          ['EMP001', 'นายสมชาย ใจดี', 'QC Section', 'Inspector', 'QCW001-001', 3, 2, 2, 1, 16],
          ['EMP002', 'นางสาวอรุณี รักดี', 'QC Section', 'Supervisor', 'QCW001-001', 3, 3, 3, 2, 20],
          ['EMP003', 'นายกฤต พร้อมใจ', 'QC Section', 'Technician', 'QCW001-001', 1, 1, 2, 0, 8],
          ['EMP005', 'นางสาวแนน สุขใจ', 'Engineering', 'Calibration Eng', 'ENG-M-002', 0, 2, 3, 2, 18],
          ['EMP008', 'นายสมศักดิ์ มั่นคง', 'Production', 'Assembly Tech', 'PROD-010-01', 2, 2, 0, 0, 14],
        ];
        triggerCSVDownload(`Skill_Matrix_Report_${filters.matrixDept}_${filters.matrixYear}.csv`, headers, rows);
        showToast(`ส่งออกไฟล์ Excel: Skill_Matrix_Report_${filters.matrixDept}_${filters.matrixYear}.csv สำเร็จ!`);
      } else if (type === 'audit') {
        const headers = ['Request ID', 'Type', 'Employee', 'Department', 'W/I Code', 'Skill Type', 'Before Level', 'After Level', 'Approved By', 'Date', 'ISO Status'];
        const rows = [
          ['APR-001', 'OJT (Level 0->1)', 'นายกฤต พร้อมใจ', 'QC Section', 'QCW001-001', 'A - Circuit Connecting', 0, 1, 'นายกฤต (Manager)', '2026-09-22', 'Passed Audit'],
          ['APR-007', 'Skill Upgrade', 'นางสาวอรุณี รักดี', 'QC Section', 'QCW002-001', 'D - Data Analysis', 1, 2, 'นายกฤต (Manager)', '2026-09-19', 'Passed Audit'],
          ['APR-008', 'OJT (Level 0->1)', 'นางสาวแนน สุขใจ', 'Engineering', 'ENG-M-002', 'C - Inspection Report', 0, 1, 'นายกฤต (Manager)', '2026-09-16', 'Passed Audit'],
        ];
        triggerCSVDownload(`ISO17025_Audit_Trail_Report_${filters.auditStartDate}_to_${filters.auditEndDate}.csv`, headers, rows);
        showToast(`ส่งออกไฟล์ Excel: ISO17025_Audit_Trail_Report.csv สำเร็จ!`);
      } else if (type === 'ojt') {
        const headers = ['OJT ID', 'Employee Name', 'Department', 'W/I Code', 'Skill Type', 'Date', 'Theory Score (%)', 'Practical Score (%)', 'Test Result', 'Submission Status'];
        const rows = [
          ['OJT-001', 'นายกฤต พร้อมใจ', 'QC Section', 'QCW001-001', 'A - Circuit Connecting', '2026-09-10', 85, 88, 'Passed', 'Submitted'],
          ['OJT-003', 'นายสมศักดิ์ มั่นคง', 'Production', 'PROD-010-01', 'A - Circuit Connecting', '2026-09-20', 88, 90, 'Passed', 'Submitted'],
          ['OJT-005', 'นางสาวอรทัย ใฝ่รู้', 'Engineering', 'ENG-M-001', 'B - Machine Operator', '2026-09-24', 92, 95, 'Passed', 'Submitted'],
        ];
        triggerCSVDownload(`OJT_Training_Evaluation_Records.csv`, headers, rows);
        showToast(`ส่งออกไฟล์ Excel: OJT_Training_Evaluation_Records.csv สำเร็จ!`);
      } else {
        const headers = ['W/I Code', 'W/I Name', 'Department', 'Avg Score 2026', 'Trainer Count', 'Risk Level', 'Action Required'];
        const rows = [
          ['PROD-030-01', 'การพ่นสีอบความร้อนรองพื้น', 'Production', 1.8, 0, 'High Risk', '🚨 เร่งสร้าง Trainer'],
          ['QCW004-001', 'การทดสอบวัดค่าการสูญเสียไร้ภาระ', 'QC Section', 2.0, 1, 'Medium Risk', 'สอบซ่อม OJT ทฤษฎี'],
        ];
        triggerCSVDownload(`Competency_Gap_Training_Plan.csv`, headers, rows);
        showToast(`ส่งออกไฟล์ Excel: Competency_Gap_Training_Plan.csv สำเร็จ!`);
      }
      setIsExporting(null);
    }, 800);
  };

  // EXPORT PDF HANDLER (Trigger Print / PDF Preview)
  const handleExportPDF = (type: 'matrix' | 'audit' | 'ojt' | 'gap') => {
    setActivePreview(type);
    setIsExporting(type + '_pdf');
    setTimeout(() => {
      setIsExporting(null);
      showToast(`เตรียมเอกสาร PDF มาตรฐาน ISO 17025 แล้ว (กำลังเปิดหน้าต่างพิมพ์)`);
      window.print();
    }, 400);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-[#0a2540]" /> รายงานและการส่งออกข้อมูล (Reports & Export Center)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            ศูนย์กลางสกัดข้อมูล กรองเงื่อนไข ดูตัวอย่างแบบเรียลไทม์ และส่งออกรายงานในรูปแบบ Excel (CSV) และ PDF มาตรฐาน ISO 17025
          </p>
        </div>
      </div>

      {/* REPORT MODULES GRID (4 Practical Modules) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">

        {/* MODULE 1: SKILL MATRIX SUMMARY REPORT */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                <Layers size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">1. Skill Matrix Summary Report</h2>
                <p className="text-xs text-slate-500">รายงานสรุปทักษะพนักงานรายแผนก / รายบุคคล (ซิงก์ข้อมูล Skill Matrix)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">เลือกแผนก</label>
                <select
                  value={filters.matrixDept}
                  onChange={e => setFilters({ ...filters, matrixDept: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="ALL">ทุกแผนก (All Sections)</option>
                  <option value="QC Section">QC Section</option>
                  <option value="Production">Production</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">เลือกปี</label>
                <select
                  value={filters.matrixYear}
                  onChange={e => setFilters({ ...filters, matrixYear: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="2026">ปี 2026 (ปัจจุบัน)</option>
                  <option value="2025">ปี 2025</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePreview('matrix')}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye size={14} /> ตัวอย่างข้อมูล (Preview)
              </button>
              <button
                onClick={() => handleExportPDF('matrix')}
                disabled={isExporting === 'matrix_pdf'}
                className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isExporting === 'matrix_pdf' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                Export PDF
              </button>
              <button
                onClick={() => handleExportExcel('matrix')}
                disabled={isExporting === 'matrix_excel'}
                className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isExporting === 'matrix_excel' ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* MODULE 2: APPROVAL AUDIT TRAIL REPORT */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between hover:border-amber-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">2. Approval Audit Trail Report</h2>
                <p className="text-xs text-slate-500">ประวัติการอนุมัติรับรอง Skill สืบย้อนกลับได้ (รองรับ ISO 17025)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">ตั้งแต่วันที่</label>
                <input
                  type="date"
                  value={filters.auditStartDate}
                  onChange={e => setFilters({ ...filters, auditStartDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">ถึงวันที่</label>
                <input
                  type="date"
                  value={filters.auditEndDate}
                  onChange={e => setFilters({ ...filters, auditEndDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePreview('audit')}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye size={14} /> ตัวอย่างข้อมูล (Preview)
              </button>
              <button
                onClick={() => handleExportPDF('audit')}
                disabled={isExporting === 'audit_pdf'}
                className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isExporting === 'audit_pdf' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                Export PDF
              </button>
              <button
                onClick={() => handleExportExcel('audit')}
                disabled={isExporting === 'audit_excel'}
                className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isExporting === 'audit_excel' ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* MODULE 3: OJT TRAINING RECORDS REPORT */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between hover:border-purple-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <BookOpen size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">3. OJT Training Evaluation Records</h2>
                <p className="text-xs text-slate-500">ประวัติและผลการทดสอบภาคทฤษฎี/ปฏิบัติ (OJT) ของพนักงาน</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">เลือก W/I</label>
                <select
                  value={filters.ojtWi}
                  onChange={e => setFilters({ ...filters, ojtWi: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 truncate"
                >
                  <option value="ALL">ดูทุก W/I ในระบบ</option>
                  {masterWIs.map(w => (
                    <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">ผลการอบรม</label>
                <select
                  value={filters.ojtResult}
                  onChange={e => setFilters({ ...filters, ojtResult: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="ALL">ทั้งหมด (Passed & Failed)</option>
                  <option value="passed">เฉพาะที่ผ่าน (≥80%)</option>
                  <option value="failed">เฉพาะที่ไม่ผ่าน (&lt;80%)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePreview('ojt')}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye size={14} /> ตัวอย่างข้อมูล (Preview)
              </button>
              <button
                onClick={() => handleExportPDF('ojt')}
                disabled={isExporting === 'ojt_pdf'}
                className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isExporting === 'ojt_pdf' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                Export PDF
              </button>
              <button
                onClick={() => handleExportExcel('ojt')}
                disabled={isExporting === 'ojt_excel'}
                className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isExporting === 'ojt_excel' ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* MODULE 4: COMPETENCY GAP & TRAINING PLAN REPORT */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">4. Competency Gap & Training Plan</h2>
                <p className="text-xs text-slate-500">รายงานวิเคราะห์ช่องว่างทักษะและแผนความต้องการฝึกอบรม OJT</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">เลือกแผนก</label>
                <select
                  value={filters.gapDept}
                  onChange={e => setFilters({ ...filters, gapDept: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="ALL">ทุกแผนก (All Sections)</option>
                  <option value="QC Section">QC Section</option>
                  <option value="Production">Production</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">ระดับความเสี่ยง</label>
                <select className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800">
                  <option value="ALL">ทุกระดับความเสี่ยง</option>
                  <option value="high">เสี่ยงสูง (ขาด Trainer)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePreview('gap')}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye size={14} /> ตัวอย่างข้อมูล (Preview)
              </button>
              <button
                onClick={() => handleExportPDF('gap')}
                disabled={isExporting === 'gap_pdf'}
                className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isExporting === 'gap_pdf' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                Export PDF
              </button>
              <button
                onClick={() => handleExportExcel('gap')}
                disabled={isExporting === 'gap_excel'}
                className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isExporting === 'gap_excel' ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
                Export Excel
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* LIVE DATA PREVIEW PANEL (ตัวอย่างตารางข้อมูลก่อนส่งออกจริง) */}
      {activePreview && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-md p-5 space-y-4 animate-fadeIn print:hidden">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="text-blue-600" size={18} />
              <h3 className="font-bold text-slate-800 text-sm">
                ตัวอย่างตารางข้อมูลก่อนส่งออก (Live Report Preview: {
                  activePreview === 'matrix' ? 'Skill Matrix Summary Report'
                  : activePreview === 'audit' ? 'Approval Audit Trail Report'
                  : activePreview === 'ojt' ? 'OJT Training Records Report'
                  : 'Competency Gap & Training Plan'
                })
              </h3>
            </div>
            <button
              onClick={() => setActivePreview(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              ซ่อนตัวอย่าง
            </button>
          </div>

          {/* TABLE PREVIEW */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold text-slate-700">
                {activePreview === 'matrix' && (
                  <tr>
                    <th className="p-3">รหัสพนักงาน</th>
                    <th className="p-3">ชื่อ-นามสกุล</th>
                    <th className="p-3">แผนก</th>
                    <th className="p-3">ตำแหน่ง</th>
                    <th className="p-3 text-center">Skill A</th>
                    <th className="p-3 text-center">Skill B</th>
                    <th className="p-3 text-center">Skill C</th>
                    <th className="p-3 text-center">Skill D</th>
                    <th className="p-3 text-center">คะแนนรวม</th>
                  </tr>
                )}
                {activePreview === 'audit' && (
                  <tr>
                    <th className="p-3">คำขอ ID</th>
                    <th className="p-3">ประเภท</th>
                    <th className="p-3">พนักงาน</th>
                    <th className="p-3">แผนก</th>
                    <th className="p-3">W/I Code</th>
                    <th className="p-3 text-center">ระดับก่อน → หลัง</th>
                    <th className="p-3">ผู้อนุมัติ</th>
                    <th className="p-3">วันที่อนุมัติ</th>
                    <th className="p-3 text-center">ISO Status</th>
                  </tr>
                )}
                {activePreview === 'ojt' && (
                  <tr>
                    <th className="p-3">OJT ID</th>
                    <th className="p-3">พนักงาน</th>
                    <th className="p-3">แผนก</th>
                    <th className="p-3">W/I Code</th>
                    <th className="p-3">Skill Type</th>
                    <th className="p-3 text-center">คะแนนทฤษฎี</th>
                    <th className="p-3 text-center">คะแนนปฏิบัติ</th>
                    <th className="p-3 text-center">ผลสอบ</th>
                  </tr>
                )}
                {activePreview === 'gap' && (
                  <tr>
                    <th className="p-3">W/I Code</th>
                    <th className="p-3">ชื่อขั้นตอน W/I</th>
                    <th className="p-3">แผนก</th>
                    <th className="p-3 text-center">คะแนนเฉลี่ย</th>
                    <th className="p-3 text-center">จำนวน Trainer</th>
                    <th className="p-3 text-center">ระดับความเสี่ยง</th>
                    <th className="p-3">ข้อเสนอแนะ OJT</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {activePreview === 'matrix' && (
                  <>
                    <tr><td className="p-3 font-mono font-bold">EMP001</td><td className="p-3 font-bold">นายสมชาย ใจดี</td><td className="p-3">QC Section</td><td className="p-3">Inspector</td><td className="p-3 text-center font-bold text-indigo-700">3</td><td className="p-3 text-center font-bold text-emerald-700">2</td><td className="p-3 text-center font-bold text-emerald-700">2</td><td className="p-3 text-center font-bold text-amber-700">1</td><td className="p-3 text-center font-bold">16</td></tr>
                    <tr><td className="p-3 font-mono font-bold">EMP002</td><td className="p-3 font-bold">นางสาวอรุณี รักดี</td><td className="p-3">QC Section</td><td className="p-3">Supervisor</td><td className="p-3 text-center font-bold text-indigo-700">3</td><td className="p-3 text-center font-bold text-indigo-700">3</td><td className="p-3 text-center font-bold text-indigo-700">3</td><td className="p-3 text-center font-bold text-emerald-700">2</td><td className="p-3 text-center font-bold">20</td></tr>
                    <tr><td className="p-3 font-mono font-bold">EMP003</td><td className="p-3 font-bold">นายกฤต พร้อมใจ</td><td className="p-3">QC Section</td><td className="p-3">Technician</td><td className="p-3 text-center font-bold text-amber-700">1</td><td className="p-3 text-center font-bold text-amber-700">1</td><td className="p-3 text-center font-bold text-emerald-700">2</td><td className="p-3 text-center font-bold text-slate-400">0</td><td className="p-3 text-center font-bold">8</td></tr>
                  </>
                )}
                {activePreview === 'audit' && (
                  <>
                    <tr><td className="p-3 font-mono">APR-001</td><td className="p-3">OJT (Level 0→1)</td><td className="p-3 font-bold">นายกฤต พร้อมใจ</td><td className="p-3">QC Section</td><td className="p-3 font-mono">QCW001-001</td><td className="p-3 text-center">0 → 1</td><td className="p-3">นายกฤต (Manager)</td><td className="p-3">2026-09-22</td><td className="p-3 text-center"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Passed Audit</span></td></tr>
                    <tr><td className="p-3 font-mono">APR-007</td><td className="p-3">Skill Upgrade</td><td className="p-3 font-bold">นางสาวอรุณี รักดี</td><td className="p-3">QC Section</td><td className="p-3 font-mono">QCW002-001</td><td className="p-3 text-center">1 → 2</td><td className="p-3">นายกฤต (Manager)</td><td className="p-3">2026-09-19</td><td className="p-3 text-center"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Passed Audit</span></td></tr>
                  </>
                )}
                {activePreview === 'ojt' && (
                  <>
                    <tr><td className="p-3 font-mono">OJT-001</td><td className="p-3 font-bold">นายกฤต พร้อมใจ</td><td className="p-3">QC Section</td><td className="p-3 font-mono">QCW001-001</td><td className="p-3">A - Circuit Connecting</td><td className="p-3 text-center font-bold text-emerald-600">85%</td><td className="p-3 text-center font-bold text-emerald-600">88%</td><td className="p-3 text-center"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Passed</span></td></tr>
                    <tr><td className="p-3 font-mono">OJT-003</td><td className="p-3 font-bold">นายสมศักดิ์ มั่นคง</td><td className="p-3">Production</td><td className="p-3 font-mono">PROD-010-01</td><td className="p-3">A - Circuit Connecting</td><td className="p-3 text-center font-bold text-emerald-600">88%</td><td className="p-3 text-center font-bold text-emerald-600">90%</td><td className="p-3 text-center"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Passed</span></td></tr>
                  </>
                )}
                {activePreview === 'gap' && (
                  <>
                    <tr><td className="p-3 font-mono font-bold">PROD-030-01</td><td className="p-3 font-bold">การพ่นสีอบความร้อนรองพื้น</td><td className="p-3">Production</td><td className="p-3 text-center font-bold">1.8</td><td className="p-3 text-center font-bold text-red-600">0 คน</td><td className="p-3 text-center"><span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">High Risk</span></td><td className="p-3">🚨 เร่งสร้าง Trainer ในสเตชันนี้</td></tr>
                    <tr><td className="p-3 font-mono font-bold">QCW004-001</td><td className="p-3 font-bold">การทดสอบวัดค่าการสูญเสียไร้ภาระ</td><td className="p-3">QC Section</td><td className="p-3 text-center font-bold">2.0</td><td className="p-3 text-center font-bold text-indigo-700">1 คน</td><td className="p-3 text-center"><span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">Medium Risk</span></td><td className="p-3">จัดสอบซ่อม OJT ทฤษฎี</td></tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DEDICATED PRINT TEMPLATE FOR HIGH-QUALITY PDF EXPORT (ISO 17025 AUDIT FORMAT) */}
      <div className="hidden print:block font-sans text-slate-900 bg-white p-4 space-y-6">
        {/* ISO 17025 Document Standard Header */}
        <div className="border-2 border-slate-900 p-4 rounded-none space-y-3">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">THAI DAIHEN ELECTRIC CO., LTD.</h1>
              <p className="text-xs font-semibold text-slate-700">WORKFORCE COMPETENCY & SKILL MATRIX MANAGEMENT SYSTEM</p>
            </div>
            <div className="text-right text-xs space-y-0.5 font-mono">
              <div className="font-bold">Doc No: TDE-SKM-RPT-2026</div>
              <div>Issue Date: {new Date().toISOString().slice(0, 10)}</div>
              <div>ISO Standards: ISO 9001 / ISO 17025</div>
            </div>
          </div>

          <div className="text-center pt-2">
            <h2 className="text-lg font-bold uppercase tracking-wide underline">
              {activePreview === 'matrix' ? 'Skill Matrix Competency Summary Report'
               : activePreview === 'audit' ? 'Approval & Skill Upgrade Audit Trail Report'
               : activePreview === 'ojt' ? 'OJT Training & Evaluation Official Record'
               : 'Competency Gap & Risk Analysis Report'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              ขอบเขตข้อมูล: แผนก {filters.matrixDept === 'ALL' ? 'ทุกแผนก (All Sections)' : filters.matrixDept} | ปีงบประมาณ: {filters.matrixYear}
            </p>
          </div>
        </div>

        {/* Printable Data Table */}
        <div className="border border-slate-900">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              {activePreview === 'matrix' && (
                <tr className="bg-slate-200 border-b border-slate-900 text-slate-900 font-bold">
                  <th className="p-2 border-r border-slate-900">รหัสพนักงาน</th>
                  <th className="p-2 border-r border-slate-900">ชื่อ-นามสกุล</th>
                  <th className="p-2 border-r border-slate-900">แผนก</th>
                  <th className="p-2 border-r border-slate-900">ตำแหน่ง</th>
                  <th className="p-2 border-r border-slate-900 text-center">A: ต่อวงจร</th>
                  <th className="p-2 border-r border-slate-900 text-center">B: คุมเครื่อง</th>
                  <th className="p-2 border-r border-slate-900 text-center">C: ตรวจสอบ</th>
                  <th className="p-2 border-r border-slate-900 text-center">D: วิเคราะห์</th>
                  <th className="p-2 text-center">รวม (เต็ม 20)</th>
                </tr>
              )}
              {activePreview === 'audit' && (
                <tr className="bg-slate-200 border-b border-slate-900 text-slate-900 font-bold">
                  <th className="p-2 border-r border-slate-900">Ref ID</th>
                  <th className="p-2 border-r border-slate-900">ประเภทอนุมัติ</th>
                  <th className="p-2 border-r border-slate-900">ชื่อพนักงาน</th>
                  <th className="p-2 border-r border-slate-900">แผนก</th>
                  <th className="p-2 border-r border-slate-900">มาตรฐาน W/I</th>
                  <th className="p-2 border-r border-slate-900 text-center">ก่อน → หลัง</th>
                  <th className="p-2 border-r border-slate-900">ผู้อนุมัติ</th>
                  <th className="p-2 border-r border-slate-900">วันที่</th>
                  <th className="p-2 text-center">Audit Result</th>
                </tr>
              )}
              {activePreview === 'ojt' && (
                <tr className="bg-slate-200 border-b border-slate-900 text-slate-900 font-bold">
                  <th className="p-2 border-r border-slate-900">OJT ID</th>
                  <th className="p-2 border-r border-slate-900">พนักงาน</th>
                  <th className="p-2 border-r border-slate-900">แผนก</th>
                  <th className="p-2 border-r border-slate-900">W/I Code</th>
                  <th className="p-2 border-r border-slate-900">หัวข้อ Skill</th>
                  <th className="p-2 border-r border-slate-900 text-center">ทฤษฎี (%)</th>
                  <th className="p-2 border-r border-slate-900 text-center">ปฏิบัติ (%)</th>
                  <th className="p-2 text-center">ผลการประเมิน</th>
                </tr>
              )}
              {activePreview === 'gap' && (
                <tr className="bg-slate-200 border-b border-slate-900 text-slate-900 font-bold">
                  <th className="p-2 border-r border-slate-900">W/I Code</th>
                  <th className="p-2 border-r border-slate-900">ชื่อขั้นตอนคู่มือ W/I</th>
                  <th className="p-2 border-r border-slate-900">แผนก</th>
                  <th className="p-2 border-r border-slate-900 text-center">คะแนนเฉลี่ย</th>
                  <th className="p-2 border-r border-slate-900 text-center">จำนวน Trainer</th>
                  <th className="p-2 border-r border-slate-900 text-center">ระดับความเสี่ยง</th>
                  <th className="p-2">แผนพัฒนาทักษะเร่งด่วน</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-400 font-sans">
              {activePreview === 'matrix' && (
                <>
                  <tr className="border-b border-slate-300"><td className="p-2 border-r border-slate-300 font-mono">EMP001</td><td className="p-2 border-r border-slate-300 font-bold">นายสมชาย ใจดี</td><td className="p-2 border-r border-slate-300">QC Section</td><td className="p-2 border-r border-slate-300">Inspector</td><td className="p-2 border-r border-slate-300 text-center">3</td><td className="p-2 border-r border-slate-300 text-center">2</td><td className="p-2 border-r border-slate-300 text-center">2</td><td className="p-2 border-r border-slate-300 text-center">1</td><td className="p-2 text-center font-bold">16 / 20</td></tr>
                  <tr className="border-b border-slate-300"><td className="p-2 border-r border-slate-300 font-mono">EMP002</td><td className="p-2 border-r border-slate-300 font-bold">นางสาวอรุณี รักดี</td><td className="p-2 border-r border-slate-300">QC Section</td><td className="p-2 border-r border-slate-300">Supervisor</td><td className="p-2 border-r border-slate-300 text-center">3</td><td className="p-2 border-r border-slate-300 text-center">3</td><td className="p-2 border-r border-slate-300 text-center">3</td><td className="p-2 border-r border-slate-300 text-center">2</td><td className="p-2 text-center font-bold">20 / 20</td></tr>
                  <tr className="border-b border-slate-300"><td className="p-2 border-r border-slate-300 font-mono">EMP003</td><td className="p-2 border-r border-slate-300 font-bold">นายกฤต พร้อมใจ</td><td className="p-2 border-r border-slate-300">QC Section</td><td className="p-2 border-r border-slate-300">Technician</td><td className="p-2 border-r border-slate-300 text-center">1</td><td className="p-2 border-r border-slate-300 text-center">1</td><td className="p-2 border-r border-slate-300 text-center">2</td><td className="p-2 border-r border-slate-300 text-center">0</td><td className="p-2 text-center font-bold">8 / 20</td></tr>
                  <tr className="border-b border-slate-300"><td className="p-2 border-r border-slate-300 font-mono">EMP005</td><td className="p-2 border-r border-slate-300 font-bold">นางสาวแนน สุขใจ</td><td className="p-2 border-r border-slate-300">Engineering</td><td className="p-2 border-r border-slate-300">Calibration Eng</td><td className="p-2 border-r border-slate-300 text-center">0</td><td className="p-2 border-r border-slate-300 text-center">2</td><td className="p-2 border-r border-slate-300 text-center">3</td><td className="p-2 border-r border-slate-300 text-center">2</td><td className="p-2 text-center font-bold">18 / 20</td></tr>
                  <tr className="border-b border-slate-300"><td className="p-2 border-r border-slate-300 font-mono">EMP008</td><td className="p-2 border-r border-slate-300 font-bold">นายสมศักดิ์ มั่นคง</td><td className="p-2 border-r border-slate-300">Production</td><td className="p-2 border-r border-slate-300">Assembly Tech</td><td className="p-2 border-r border-slate-300 text-center">2</td><td className="p-2 border-r border-slate-300 text-center">2</td><td className="p-2 border-r border-slate-300 text-center">0</td><td className="p-2 border-r border-slate-300 text-center">0</td><td className="p-2 text-center font-bold">14 / 20</td></tr>
                </>
              )}
              {activePreview === 'audit' && (
                <>
                  <tr className="border-b border-slate-300"><td className="p-2 border-r border-slate-300 font-mono">APR-001</td><td className="p-2 border-r border-slate-300">OJT (Level 0→1)</td><td className="p-2 border-r border-slate-300 font-bold">นายกฤต พร้อมใจ</td><td className="p-2 border-r border-slate-300">QC Section</td><td className="p-2 border-r border-slate-300 font-mono">QCW001-001</td><td className="p-2 border-r border-slate-300 text-center">Level 0 → 1</td><td className="p-2 border-r border-slate-300">นายกฤต (Manager)</td><td className="p-2 border-r border-slate-300">2026-09-22</td><td className="p-2 text-center font-bold text-emerald-800">PASSED</td></tr>
                  <tr className="border-b border-slate-300"><td className="p-2 border-r border-slate-300 font-mono">APR-007</td><td className="p-2 border-r border-slate-300">Skill Upgrade</td><td className="p-2 border-r border-slate-300 font-bold">นางสาวอรุณี รักดี</td><td className="p-2 border-r border-slate-300">QC Section</td><td className="p-2 border-r border-slate-300 font-mono">QCW002-001</td><td className="p-2 border-r border-slate-300 text-center">Level 1 → 2</td><td className="p-2 border-r border-slate-300">นายกฤต (Manager)</td><td className="p-2 border-r border-slate-300">2026-09-19</td><td className="p-2 text-center font-bold text-emerald-800">PASSED</td></tr>
                </>
              )}
              {activePreview === 'ojt' && (
                <>
                  <tr className="border-b border-slate-300"><td className="p-2 border-r border-slate-300 font-mono">OJT-001</td><td className="p-2 border-r border-slate-300 font-bold">นายกฤต พร้อมใจ</td><td className="p-2 border-r border-slate-300">QC Section</td><td className="p-2 border-r border-slate-300 font-mono">QCW001-001</td><td className="p-2 border-r border-slate-300">A - Circuit Connecting</td><td className="p-2 border-r border-slate-300 text-center">85%</td><td className="p-2 border-r border-slate-300 text-center">88%</td><td className="p-2 text-center font-bold text-emerald-800">PASSED</td></tr>
                  <tr className="border-b border-slate-300"><td className="p-2 border-r border-slate-300 font-mono">OJT-003</td><td className="p-2 border-r border-slate-300 font-bold">นายสมศักดิ์ มั่นคง</td><td className="p-2 border-r border-slate-300">Production</td><td className="p-2 border-r border-slate-300 font-mono">PROD-010-01</td><td className="p-2 border-r border-slate-300">A - Circuit Connecting</td><td className="p-2 border-r border-slate-300 text-center">88%</td><td className="p-2 border-r border-slate-300 text-center">90%</td><td className="p-2 text-center font-bold text-emerald-800">PASSED</td></tr>
                </>
              )}
              {activePreview === 'gap' && (
                <>
                  <tr className="border-b border-slate-300"><td className="p-2 border-r border-slate-300 font-mono font-bold">PROD-030-01</td><td className="p-2 border-r border-slate-300 font-bold">การพ่นสีอบความร้อนรองพื้น</td><td className="p-2 border-r border-slate-300">Production</td><td className="p-2 border-r border-slate-300 text-center">1.8 / 3.0</td><td className="p-2 border-r border-slate-300 text-center font-bold text-red-700">0 คน</td><td className="p-2 border-r border-slate-300 text-center font-bold text-red-700">HIGH RISK</td><td className="p-2">เร่งสร้าง Trainer ประจำสเตชันพ่นสีอบความร้อน</td></tr>
                  <tr className="border-b border-slate-300"><td className="p-2 border-r border-slate-300 font-mono font-bold">QCW004-001</td><td className="p-2 border-r border-slate-300 font-bold">การทดสอบวัดค่าการสูญเสียไร้ภาระ</td><td className="p-2 border-r border-slate-300">QC Section</td><td className="p-2 border-r border-slate-300 text-center">2.0 / 3.0</td><td className="p-2 border-r border-slate-300 text-center">1 คน</td><td className="p-2 border-r border-slate-300 text-center font-bold text-amber-700">MEDIUM RISK</td><td className="p-2">จัดสอบซ่อมทฤษฎี OJT ภายใน Q3</td></tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Formal ISO Audit Signatures Section */}
        <div className="grid grid-cols-3 gap-6 pt-10 text-xs">
          <div className="border border-slate-400 p-3 text-center space-y-8">
            <div className="font-bold">Prepared By (ผู้จัดทำรายงาน)</div>
            <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
            <div>(......................................................)<br/><span className="text-[10px] text-slate-600">เจ้าหน้าที่ฝ่าย HR / Training System</span></div>
          </div>
          <div className="border border-slate-400 p-3 text-center space-y-8">
            <div className="font-bold">Reviewed By (ผู้ทบทวน)</div>
            <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
            <div>(......................................................)<br/><span className="text-[10px] text-slate-600">หัวหน้าส่วนงาน / Section Manager</span></div>
          </div>
          <div className="border border-slate-400 p-3 text-center space-y-8">
            <div className="font-bold">Approved By (ผู้อนุมัติ ISO 17025)</div>
            <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
            <div>(......................................................)<br/><span className="text-[10px] text-slate-600">ผู้จัดการฝ่ายทรัพยากรบุคคล / HR Manager</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

