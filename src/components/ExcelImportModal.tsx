import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  FileText,
  Building2,
  HelpCircle,
  Eye,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { SKILL_DEPARTMENTS } from '../data/phase1Core';
import type { Employee } from '../data/phase1Core';
import { importSkillEmployeesBatch } from '../data/phase1Store';
import { Avatar, normalizeImageUrl } from './Avatar';
import { buttonClass, panelClass } from './Phase1Shared';

export interface ParsedEmployeeRow {
  rowNumber: number;
  id: string;
  name: string;
  position: string;
  department: string;
  avatarUrl?: string;
  errors: string[];
  isValid: boolean;
}

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
  existingEmployees: Employee[];
}

export function ExcelImportModal({
  isOpen,
  onClose,
  onSuccess,
  existingEmployees,
}: ExcelImportModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState('');
  const [rows, setRows] = useState<ParsedEmployeeRow[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'valid' | 'invalid'>('all');
  const [importOnlyValid, setImportOnlyValid] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [showPhotoTips, setShowPhotoTips] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validRows = rows.filter(r => r.isValid);
  const invalidRows = rows.filter(r => !r.isValid);
  const canProceedFromStep2 = validRows.length > 0 && (invalidRows.length === 0 || importOnlyValid);

  function resetState() {
    setStep(1);
    setFile(null);
    setLoading(false);
    setParseError('');
    setRows([]);
    setFilterMode('all');
    setImportOnlyValid(false);
    setImportedCount(0);
    setSkippedCount(0);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  // Generate and download sample Excel/CSV template with 5 columns
  function handleDownloadTemplate() {
    const headers = ['รหัสพนักงาน', 'ชื่อ - นามสกุล', 'ตำแหน่ง', 'แผนก', 'ลิงก์รูปถ่าย (ไม่บังคับ)'];
    const sampleRows = [
      ['EMP101', 'นายประสิทธิ์ มั่นคง', 'Junior Quality Inspector', 'QC Section', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'],
      ['EMP102', 'นางสาวสุดาพร นามงาม', 'Assembly Operator', 'Production', ''],
      ['EMP103', 'นายชูเกียรติ ยอดเยี่ยม', 'Assistant Engineer', 'Engineering', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'],
    ];

    const csvContent = '\uFEFF' + [headers, ...sampleRows].map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employee_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Parse uploaded file (xlsx, xls, csv)
  async function handleFileChange(selectedFile: File) {
    setFile(selectedFile);
    setParseError('');
    setLoading(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) throw new Error('ไม่พบแผ่นงาน (Sheet) ในไฟล์ที่เลือก');

      const worksheet = workbook.Sheets[firstSheetName];
      const rawData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1, defval: '' });

      if (!rawData || rawData.length === 0) {
        throw new Error('ไฟล์ที่อัปโหลดไม่มีข้อมูล');
      }

      // Check if row 0 is header
      let startIndex = 0;
      const firstRow = rawData[0].map(c => String(c).trim().toLowerCase());
      const isHeader = firstRow.some(c =>
        c.includes('รหัส') || c.includes('id') || c.includes('ชื่อ') || c.includes('name') || c.includes('แผนก')
      );
      if (isHeader) {
        startIndex = 1;
      }

      const existingIds = new Set(existingEmployees.map(e => e.id.toLowerCase()));
      const fileIdCounts = new Map<string, number>();

      // First pass: count IDs in file for duplicate detection
      for (let i = startIndex; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.every(cell => !String(cell).trim())) continue;
        const id = String(row[0] ?? '').trim().toLowerCase();
        if (id) {
          fileIdCounts.set(id, (fileIdCounts.get(id) ?? 0) + 1);
        }
      }

      const parsed: ParsedEmployeeRow[] = [];
      let rowNum = startIndex + 1;

      for (let i = startIndex; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.every(cell => !String(cell).trim())) continue;

        const id = String(row[0] ?? '').trim();
        const name = String(row[1] ?? '').trim();
        const position = String(row[2] ?? '').trim();
        const department = String(row[3] ?? '').trim();
        const rawAvatar = row[4] !== undefined ? String(row[4]).trim() : '';
        const avatarUrl = normalizeImageUrl(rawAvatar);

        const errors: string[] = [];

        // Validation 1: Required ID
        if (!id) {
          errors.push('ยังไม่ได้ระบุรหัสพนักงาน');
        } else {
          // Check system duplicate
          if (existingIds.has(id.toLowerCase())) {
            errors.push(`รหัส "${id}" ซ้ำกับพนักงานที่มีอยู่แล้วในระบบ`);
          }
          // Check file duplicate
          if ((fileIdCounts.get(id.toLowerCase()) ?? 0) > 1) {
            errors.push(`รหัส "${id}" ปรากฏซ้ำกันหลายครั้งในไฟล์นี้`);
          }
        }

        // Validation 2: Required Name
        if (!name) {
          errors.push('ยังไม่ได้ระบุชื่อ - นามสกุล');
        }

        // Validation 3: Required Position
        if (!position) {
          errors.push('ยังไม่ได้ระบุตำแหน่ง');
        }

        // Validation 4: Valid Department
        if (!department) {
          errors.push('ยังไม่ได้ระบุแผนก');
        } else if (!SKILL_DEPARTMENTS.includes(department)) {
          errors.push(`แผนก "${department}" ไม่มีในระบบ (ต้องเป็น: ${SKILL_DEPARTMENTS.join(', ')})`);
        }

        parsed.push({
          rowNumber: rowNum++,
          id,
          name,
          position,
          department,
          avatarUrl: avatarUrl || undefined,
          errors,
          isValid: errors.length === 0,
        });
      }

      if (parsed.length === 0) {
        throw new Error('ไม่พบแถวข้อมูลพนักงานที่สามารถอ่านได้ในไฟล์');
      }

      setRows(parsed);
      setStep(1); // Preview step
    } catch (err) {
      setParseError((err as Error).message || 'เกิดข้อผิดพลาดในการอ่านไฟล์');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleConfirmImport() {
    if (invalidRows.length > 0 && !importOnlyValid) {
      setParseError('มีแถวข้อมูลที่พบข้อผิดพลาดและยังไม่ได้ทำเครื่องหมายยินยอมข้ามแถว');
      return;
    }
    const toImport = validRows;
    if (toImport.length === 0) {
      setParseError('ไม่มีแถวข้อมูลที่ถูกต้องสำหรับการนำเข้า');
      return;
    }

    try {
      importSkillEmployeesBatch(
        'admin',
        toImport.map(r => ({
          id: r.id,
          name: r.name,
          position: r.position,
          department: r.department,
          avatarUrl: r.avatarUrl,
        }))
      );

      setImportedCount(toImport.length);
      setSkippedCount(rows.length - toImport.length);
      setStep(4); // Summary step
      onSuccess(toImport.length);
    } catch (err) {
      setParseError((err as Error).message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  }

  const displayedRows =
    filterMode === 'valid' ? validRows : filterMode === 'invalid' ? invalidRows : rows;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs">
      <div className={`${panelClass} flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">นำเข้าพนักงานจาก Excel / CSV</h2>
              <p className="text-xs text-slate-500">รองรับ 5 คอลัมน์: รหัสพนักงาน, ชื่อ-นามสกุล, ตำแหน่ง, แผนก และรูปถ่าย</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stepper Wizard Indicator */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-3">
          <div className="flex items-center justify-between max-w-2xl mx-auto text-xs">
            {[
              { num: 1, title: 'เลือกไฟล์ & พรีวิว' },
              { num: 2, title: 'ตรวจสอบความถูกต้อง' },
              { num: 3, title: 'ยืนยันนำเข้า' },
              { num: 4, title: 'สรุปผล' },
            ].map((s, idx, arr) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs transition-colors ${
                    step === s.num
                      ? 'bg-blue-600 text-white shadow-xs'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step > s.num ? <Check size={13} /> : s.num}
                </div>
                <span
                  className={`font-semibold hidden sm:inline ${
                    step === s.num ? 'text-blue-900' : step > s.num ? 'text-emerald-800' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
                {idx < arr.length - 1 && <div className="h-0.5 w-6 sm:w-12 bg-slate-200 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {parseError && (
            <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
              <div>
                <strong className="font-bold">เกิดข้อผิดพลาด:</strong> {parseError}
              </div>
            </div>
          )}

          {/* STEP 1: Upload & Preview */}
          {step === 1 && (
            <div className="space-y-5">
              {rows.length === 0 ? (
                <div className="space-y-4">
                  {/* Upload Drop Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xs text-blue-600 group-hover:scale-110 transition-transform">
                      <Upload size={28} />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      {loading ? 'กำลังอ่านและประมวลผลไฟล์...' : 'คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      รองรับไฟล์ Excel (.xlsx, .xls) หรือ CSV (.csv) ขนาดไม่เกิน 10MB
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".xlsx, .xls, .csv"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) handleFileChange(f);
                      }}
                    />
                  </div>

                  {/* Template download helper */}
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs">
                    <div className="flex items-center gap-2.5 text-blue-900">
                      <HelpCircle size={18} className="text-blue-600 shrink-0" />
                      <div>
                        <strong className="font-semibold">ยังไม่มีไฟล์รูปแบบที่ถูกต้อง?</strong>
                        <p className="text-slate-500 mt-0.5">ดาวน์โหลดไฟล์แม่แบบตัวอย่าง (5 คอลัมน์) เพื่อนำไปกรอกข้อมูลได้ทันที</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-white px-3 py-1.5 font-bold text-blue-700 hover:bg-blue-50 shadow-2xs transition-colors"
                    >
                      <Download size={14} />
                      ดาวน์โหลดไฟล์ตัวอย่าง
                    </button>
                  </div>

                  {/* Collapsible Photo Column Tip */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden transition-all text-xs">
                    <button
                      type="button"
                      onClick={() => setShowPhotoTips(prev => !prev)}
                      className="w-full flex items-center justify-between p-3.5 text-left font-bold text-slate-700 hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>💡 คำแนะนำสำหรับคอลัมน์รูปถ่าย (คอลัมน์ที่ 5)</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          {showPhotoTips ? '(คลิกเพื่อซ่อน)' : '(คลิกเพื่อเปิดดู)'}
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-slate-500 transition-transform duration-200 ${
                          showPhotoTips ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {showPhotoTips && (
                      <div className="border-t border-slate-200/80 p-4 bg-white space-y-2 text-slate-600 leading-relaxed animate-in fade-in duration-150">
                        <ul className="list-disc list-inside space-y-1.5 pl-1">
                          <li>
                            <strong>หากใช้ลิงก์รูป (URL):</strong> รองรับ URL รูปภาพบนเว็บ หรือลิงก์แชร์จาก Google Drive (ตั้งเป็น Anyone with the link) ระบบจะแปลงและแสดงรูปให้อัตโนมัติ
                          </li>
                          <li>
                            <strong>หากแทรกรูปด้วย Insert &gt; Picture ใน Excel:</strong> ตัวโปรแกรม Excel จะไม่ส่งไฟล์รูปที่แปะลอยอยู่ในตารางออกมาเป็นข้อความ หากต้องการใช้ไฟล์รูปจริงในเครื่อง แนะนำให้เว้นคอลัมน์นี้ไว้ แล้วกดปุ่ม <span className="font-semibold text-blue-700">"แก้ไขข้อมูลพนักงาน &gt; อัปโหลดรูปภาพ"</span> หลังนำเข้าได้ทันที
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File info bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <FileText size={16} className="text-blue-600" />
                      <span>ไฟล์: {file?.name}</span>
                      <span className="text-slate-400 font-normal">({rows.length} แถวข้อมูล)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRows([])}
                      className="text-blue-700 hover:underline font-bold"
                    >
                      เลือกไฟล์ใหม่
                    </button>
                  </div>

                  {/* Preview Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">รูปถ่าย</th>
                          <th className="p-3">รหัสพนักงาน</th>
                          <th className="p-3">ชื่อ - นามสกุล</th>
                          <th className="p-3">ตำแหน่ง</th>
                          <th className="p-3">แผนก</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rows.slice(0, 8).map(row => (
                          <tr key={row.rowNumber} className="hover:bg-slate-50/50">
                            <td className="p-3">
                              <Avatar src={row.avatarUrl} name={row.name} size="xs" />
                            </td>
                            <td className="p-3 font-mono font-semibold text-slate-700">{row.id || '—'}</td>
                            <td className="p-3 font-semibold text-slate-800">{row.name || '—'}</td>
                            <td className="p-3 text-slate-600">{row.position || '—'}</td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-slate-700 font-medium">
                                <Building2 size={12} className="text-slate-400" />
                                {row.department || '—'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {rows.length > 8 && (
                    <p className="text-center text-xs text-slate-400">
                      แสดงตัวอย่าง 8 แถวแรก จากทั้งหมด {rows.length} แถว
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Validation */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Validation Metrics */}
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    filterMode === 'all'
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-500 block">แถวทั้งหมด</span>
                  <span className="text-xl font-bold text-slate-800">{rows.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterMode('valid')}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    filterMode === 'valid'
                      ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={14} /> ข้อมูลถูกต้อง
                  </span>
                  <span className="text-xl font-bold text-emerald-800">{validRows.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterMode('invalid')}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    filterMode === 'invalid'
                      ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                    <AlertTriangle size={14} /> พบข้อผิดพลาด
                  </span>
                  <span className="text-xl font-bold text-amber-800">{invalidRows.length}</span>
                </button>
              </div>

              {/* Validation Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">สถานะ</th>
                      <th className="p-3">รูปถ่าย</th>
                      <th className="p-3">รหัส</th>
                      <th className="p-3">ชื่อ - นามสกุล</th>
                      <th className="p-3">ตำแหน่ง</th>
                      <th className="p-3">แผนก</th>
                      <th className="p-3">รายละเอียดผลการตรวจสอบ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedRows.map(row => (
                      <tr
                        key={row.rowNumber}
                        className={row.isValid ? 'hover:bg-slate-50/50' : 'bg-red-50/40 hover:bg-red-50/60'}
                      >
                        <td className="p-3">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={12} /> ถูกต้อง
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700 border border-red-200">
                              <AlertTriangle size={12} /> ผิดพลาด
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <Avatar src={row.avatarUrl} name={row.name} size="xs" />
                        </td>
                        <td className="p-3 font-mono font-semibold text-slate-700">{row.id || <span className="text-red-400 italic">ว่าง</span>}</td>
                        <td className="p-3 font-semibold text-slate-800">{row.name || <span className="text-red-400 italic">ว่าง</span>}</td>
                        <td className="p-3 text-slate-600">{row.position || <span className="text-red-400 italic">ว่าง</span>}</td>
                        <td className="p-3 text-slate-700">{row.department || <span className="text-red-400 italic">ว่าง</span>}</td>
                        <td className="p-3">
                          {row.isValid ? (
                            <span className="text-emerald-700 text-[11px]">พร้อมนำเข้า</span>
                          ) : (
                            <div className="space-y-0.5">
                              {row.errors.map((err, i) => (
                                <p key={i} className="text-red-700 font-semibold text-[11px] flex items-center gap-1">
                                  • {err}
                                </p>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {invalidRows.length > 0 && (
                <div
                  className={`rounded-xl border p-4 transition-all ${
                    importOnlyValid
                      ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950'
                      : 'border-amber-300 bg-amber-50/70 text-amber-950'
                  }`}
                >
                  <label className="flex items-start sm:items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="mt-0.5 sm:mt-0 h-4 w-4 rounded border-amber-400 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={importOnlyValid}
                      onChange={e => setImportOnlyValid(e.target.checked)}
                    />
                    <div className="flex-1 text-xs">
                      <span className="font-bold">
                        ข้ามแถวที่ผิดพลาด ({invalidRows.length} แถว)
                      </span>
                      <span className="text-slate-600 ml-1">
                        และยืนยันนำเข้าเฉพาะแถวที่ข้อมูลถูกต้อง ({validRows.length} แถว)
                      </span>
                    </div>
                  </label>

                  {!importOnlyValid ? (
                    <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-amber-100/80 px-3 py-2 text-[11px] font-semibold text-amber-900">
                      <AlertTriangle size={15} className="shrink-0 text-amber-700" />
                      <span>
                        คุณยังไม่ได้เลือกข้ามแถวที่ผิดพลาด: ระบบจะ<strong>ระงับการนำเข้า</strong>ไว้ชั่วคราว (กรุณาติ๊กถูกที่ช่องด้านบนเพื่อยินยอมข้าม หรือแก้ไขไฟล์แล้วนำมาอัปโหลดใหม่)
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-emerald-100/80 px-3 py-2 text-[11px] font-semibold text-emerald-800">
                      <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                      <span>
                        เปิดใช้งานการข้ามแถวแล้ว: พร้อมนำเข้าเฉพาะพนักงานที่มีข้อมูลถูกต้องจำนวน <strong>{validRows.length} คน</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Confirm */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 text-blue-900 space-y-2">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-blue-600" />
                  สรุปรายการเตรียมนำเข้าพนักงาน
                </h3>
                <p className="text-xs text-blue-800 leading-relaxed">
                  ระบบพร้อมนำเข้าพนักงานที่ถูกต้องจำนวน <strong>{validRows.length} คน</strong> เข้าสู่ฐานข้อมูลปีปัจจุบัน โดยพนักงานใหม่ทุกคนจะเริ่มต้นด้วยสกิลระดับ Level 0 ของแต่ละแผนก
                </p>
                {invalidRows.length > 0 && (
                  <p className="text-xs text-amber-800 font-semibold">
                    * ข้ามรายการที่พบข้อผิดพลาดจำนวน {invalidRows.length} รายการ (ไม่ถูกบันทึก)
                  </p>
                )}
              </div>

              {/* Department distribution */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">แยกตามแผนกที่จะนำเข้า:</h4>
                <div className="grid gap-2 sm:grid-cols-3">
                  {SKILL_DEPARTMENTS.map(d => {
                    const count = validRows.filter(r => r.department === d).length;
                    if (count === 0) return null;
                    return (
                      <div key={d} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                        <span className="text-slate-500 block">{d}</span>
                        <strong className="text-base font-bold text-blue-800">{count} คน</strong>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Roster preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">รายชื่อพนักงานที่จะนำเข้า ({validRows.length} คน):</h4>
                <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {validRows.map(row => (
                    <div key={row.id} className="flex items-center justify-between p-3 text-xs bg-white">
                      <div className="flex items-center gap-3">
                        <Avatar src={row.avatarUrl} name={row.name} size="sm" />
                        <div>
                          <p className="font-bold text-slate-800">{row.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{row.id} · {row.position}</p>
                        </div>
                      </div>
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700 text-[11px]">
                        {row.department}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Summary */}
          {step === 4 && (
            <div className="py-8 text-center space-y-5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">นำเข้าข้อมูลพนักงานสำเร็จ!</h3>
                <p className="mt-1 text-sm text-slate-500">บันทึกข้อมูลเข้าสู่ฐานข้อมูลระบบ Skill Matrix เรียบร้อยแล้ว</p>
              </div>

              <div className="mx-auto max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-700">
                  <span>นำเข้าสำเร็จ:</span>
                  <strong className="text-emerald-700 font-bold text-sm">{importedCount} คน</strong>
                </div>
                {skippedCount > 0 && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span>ข้ามแถวที่พบข้อผิดพลาด:</span>
                    <strong className="text-amber-700 font-bold text-sm">{skippedCount} คน</strong>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-700 border-t border-slate-200 pt-2 font-bold">
                  <span>แถวข้อมูลทั้งหมดในไฟล์:</span>
                  <span>{rows.length} แถว</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 flex items-center justify-between">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={rows.length === 0}
                onClick={() => setStep(2)}
                className={`${buttonClass} disabled:opacity-50`}
              >
                <span>ถัดไป: ตรวจสอบข้อมูล</span>
                <ArrowRight size={14} />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft size={14} />
                ย้อนกลับ
              </button>
              <button
                type="button"
                disabled={!canProceedFromStep2}
                onClick={() => setStep(3)}
                className={`${buttonClass} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <span>
                  {invalidRows.length > 0 && !importOnlyValid
                    ? 'ไม่อนุญาตให้นำเข้า (มีแถวที่ผิดพลาด)'
                    : validRows.length === 0
                    ? 'ไม่มีแถวข้อมูลที่ถูกต้อง'
                    : `ถัดไป: ยืนยันข้อมูล (${validRows.length})`}
                </span>
                <ArrowRight size={14} />
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft size={14} />
                ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Check size={15} />
                ยืนยันการนำเข้าข้อมูล ({validRows.length} คน)
              </button>
            </>
          )}

          {step === 4 && (
            <div className="w-full flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className={buttonClass}
              >
                ปิดหน้าต่างและดูรายชื่อพนักงาน
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
