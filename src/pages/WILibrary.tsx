import React, { useState } from 'react';
import { BookOpen, Search, Filter, Download, FileText, CheckCircle, Award, ChevronDown, Layers, Check, Upload, X, Building2, Calendar, User, Shield, AlignLeft, Plus } from 'lucide-react';
import { MASTER_WIS, DEPARTMENT_LABELS } from '../data/masterData';
import type { MasterWI } from '../data/masterData';

// Map masterData WI to card data (currentStaffLevel mocked per WI code)
const STAFF_LEVELS: Record<string, number> = {
  'QCW001-001': 1, 'QCW001-002': 1, 'QCW002-001': 1, 'QCW004-001': 2,
  'PROD-010-01': 3, 'PROD-010-02': 1, 'ENG-M-001': 2, 'ENG-M-002': 1,
  'MNT001-001': 1, 'WHS002-001': 2,
};

interface UploadForm {
  wiCode: string;
  purpose: string;
  effectiveDate: string;
  author: string;
  standard: string;
  department: string;
  fileName: string;
}

const BLANK_FORM: UploadForm = {
  wiCode: '', purpose: '', effectiveDate: '', author: '',
  standard: 'ISO/IEC 17025', department: '', fileName: '',
};

export function WILibrary({ userRole = 'staff' }: { userRole?: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [activeReadingWI, setActiveReadingWI] = useState<MasterWI | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadForm>({ ...BLANK_FORM });

  const isAdmin = userRole === 'admin';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // When WI code is selected, auto-fill other fields
  const handleWICodeChange = (code: string) => {
    const wi = MASTER_WIS.find(w => w.code === code);
    if (wi) {
      setUploadForm(f => ({
        ...f,
        wiCode: code,
        department: wi.department,
        effectiveDate: wi.effectiveDate,
        author: wi.author,
        standard: wi.standard,
        purpose: wi.purpose,
        fileName: `${wi.code}_Official_Manual.pdf`,
      }));
    } else {
      setUploadForm({ ...BLANK_FORM, wiCode: code });
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowUploadModal(false);
    showToast(`บันทึกคู่มือ ${uploadForm.wiCode} สำเร็จ! ไฟล์: ${uploadForm.fileName}`);
    setUploadForm({ ...BLANK_FORM });
  };

  // Derived filter options
  const categories = ['ALL', ...Array.from(new Set(MASTER_WIS.map(w => w.category)))];
  const depts = ['ALL', ...DEPARTMENT_LABELS.filter(d => MASTER_WIS.some(w => w.department === d))];

  const filteredWIs = MASTER_WIS.filter(wi => {
    const q = searchQuery.toLowerCase();
    const matchSearch = wi.code.toLowerCase().includes(q) || wi.name.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'ALL' || wi.category === selectedCategory;
    const matchDept = selectedDept === 'ALL' || wi.department === selectedDept;
    return matchSearch && matchCat && matchDept;
  });

  const levelLabel = (lvl: number) =>
    lvl === 3 ? 'Level 3 (Trainer)' : lvl === 2 ? 'Level 2 (Independent)' : 'Level 1 (Supervision)';
  const levelClass = (lvl: number) =>
    lvl === 3 ? 'bg-purple-50 text-purple-700 border-purple-200' :
    lvl === 2 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    'bg-blue-50 text-blue-700 border-blue-200';

  const deptColor = (dept: string) => {
    if (dept.includes('QC')) return 'bg-purple-100 text-purple-800';
    if (dept.includes('Production')) return 'bg-orange-100 text-orange-800';
    if (dept.includes('Engineering')) return 'bg-blue-100 text-blue-800';
    if (dept.includes('Maintenance')) return 'bg-yellow-100 text-yellow-800';
    if (dept.includes('Warehouse')) return 'bg-green-100 text-green-800';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700">
          <Check size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-purple-700" /> คลังคู่มือปฏิบัติงานมาตรฐาน (W/I Library)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            คลังเอกสารมาตรฐาน W/I ครบทุกแผนก — ทบทวนก่อนสอบ OJT หรือปฏิบัติงานจริง
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => { setUploadForm({ ...BLANK_FORM }); setShowUploadModal(true); }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Plus size={16} /> สร้าง / อัปโหลดคู่มือ W/I
            </button>
          )}
          <div className="flex items-center gap-2 bg-purple-50 text-purple-800 border border-purple-200 px-3.5 py-2 rounded-xl text-xs font-bold">
            <Layers size={16} /> {filteredWIs.length} / {MASTER_WIS.length} ฉบับ
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ค้นหารหัส W/I หรือชื่อคู่มือ..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="relative">
          <Building2 size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-8 text-sm text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {depts.map(d => <option key={d} value={d}>{d === 'ALL' ? 'ทุกแผนก' : d}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-8 text-sm text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'ทุกหมวดหมู่' : c}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* W/I Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWIs.map(wi => {
          const lvl = STAFF_LEVELS[wi.code] ?? 0;
          return (
            <div key={wi.code} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-purple-100 text-purple-900 font-mono font-bold text-xs px-2.5 py-1 rounded-md border border-purple-200">{wi.code}</span>
                  <span className="bg-slate-100 text-slate-700 font-mono text-[11px] font-bold px-2 py-0.5 rounded">{wi.version}</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{wi.name}</h3>
                  <div className="text-[11px] text-slate-400 mt-1.5 flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${deptColor(wi.department)}`}>{wi.department}</span>
                    <span className="text-slate-300">|</span>
                    <span>{wi.category}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div>ปรับปรุง: <span className="font-semibold text-slate-700">{wi.effectiveDate}</span></div>
                  <div>ผู้อนุมัติ: <span className="font-semibold text-slate-700">{wi.author}</span></div>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="text-[11px] text-slate-400 font-medium">ประเภททักษะที่เกี่ยวข้อง:</div>
                  <div className="flex flex-wrap gap-1">
                    {wi.types.map(t => (
                      <span key={t.code} className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        {t.code} - {t.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                {!isAdmin && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">ระดับของคุณปัจจุบัน:</span>
                    <span className={`font-bold px-2.5 py-0.5 rounded border ${levelClass(lvl)}`}>{levelLabel(lvl)}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveReadingWI(wi)}
                    className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-purple-200"
                  >
                    <BookOpen size={14} /> อ่านคู่มือ
                  </button>
                  <button
                    onClick={() => showToast(`กำลังดาวน์โหลด ${wi.code}.pdf...`)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors border border-slate-200"
                    title="ดาวน์โหลด PDF"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredWIs.length === 0 && (
          <div className="col-span-3 text-center py-16 text-slate-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">ไม่พบคู่มือที่ตรงกับเงื่อนไขการค้นหา</p>
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {activeReadingWI && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-purple-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-purple-800 px-2 py-0.5 rounded">{activeReadingWI.code}</span>
                    <span className="text-xs text-purple-200">{activeReadingWI.version}</span>
                  </div>
                  <h3 className="font-bold text-base text-white">{activeReadingWI.name}</h3>
                </div>
              </div>
              <button onClick={() => setActiveReadingWI(null)} className="text-purple-200 hover:text-white text-xl font-bold p-1">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
              {/* Metadata grid */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-purple-600 block font-semibold mb-1">หน่วยงานที่รับผิดชอบ</span>
                  <span className="font-bold text-slate-800">{activeReadingWI.department}</span>
                </div>
                <div>
                  <span className="text-purple-600 block font-semibold mb-1">วันที่มีผลบังคับใช้</span>
                  <span className="font-bold text-slate-800">{activeReadingWI.effectiveDate}</span>
                </div>
                <div>
                  <span className="text-purple-600 block font-semibold mb-1">ผู้อนุมัติเอกสาร</span>
                  <span className="font-bold text-slate-800">{activeReadingWI.author}</span>
                </div>
                <div>
                  <span className="text-purple-600 block font-semibold mb-1">มาตรฐานที่เกี่ยวข้อง</span>
                  <span className="font-bold text-slate-800">{activeReadingWI.standard}</span>
                </div>
                <div className="col-span-2 md:col-span-4 bg-purple-100/50 p-3 rounded-lg flex items-center justify-between border border-purple-200/50">
                  <div>
                    <span className="text-purple-600 block font-semibold mb-0.5">แหล่งที่มาของเอกสาร (Source)</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText size={13} className="text-purple-600" />
                      {activeReadingWI.code}_Official_Manual.pdf
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded border border-emerald-200 font-bold flex items-center gap-1">
                    <CheckCircle size={12} /> ไฟล์ต้นฉบับในระบบ
                  </span>
                </div>
              </div>

              {/* Section 1: Purpose */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <CheckCircle className="text-purple-600" size={18} /> 1. วัตถุประสงค์และขอบเขต (Purpose & Scope)
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">{activeReadingWI.purpose}</p>
              </div>

              {/* Section 2: Evaluation Standard */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Award className="text-purple-600" size={18} /> 2. เกณฑ์การประเมินทักษะ OJT (Evaluation Standard)
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-800 border-b border-slate-200 pb-2">
                    <span>ระดับ (Level)</span><span>เกณฑ์ความสามารถ (Competency Criterion)</span>
                  </div>
                  <div className="flex justify-between text-slate-600 py-1">
                    <span className="font-semibold text-slate-700">Level 1 (Under Supervision)</span>
                    <span>ปฏิบัติงานได้ถูกต้องภายใต้การชี้แนะของ Chief (คะแนนภาคปฏิบัติ &gt; 80%)</span>
                  </div>
                  <div className="flex justify-between text-slate-600 py-1 border-t border-slate-200/60">
                    <span className="font-semibold text-emerald-700">Level 2 (Independent)</span>
                    <span>ปฏิบัติงานคนเดียวได้อิสระโดยไม่ต้องมีผู้ควบคุม แก้ไขปัญหาเบื้องต้นได้</span>
                  </div>
                  <div className="flex justify-between text-slate-600 py-1 border-t border-slate-200/60">
                    <span className="font-semibold text-purple-700">Level 3 (Trainer)</span>
                    <span>เชี่ยวชาญสูง สอนงาน อบรมผู้อื่น และทำหน้าที่เป็นผู้ประเมิน OJT ได้</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => showToast(`ดาวน์โหลด ${activeReadingWI.code}.pdf สำเร็จ`)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Download size={14} /> ดาวน์โหลด PDF
              </button>
              <button onClick={() => setActiveReadingWI(null)} className="px-5 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg text-xs font-bold">
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload / Create Manual Modal (Admin only) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 bg-purple-600 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Plus size={20} /> สร้าง / อัปโหลดคู่มือ W/I
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-purple-200 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-5 overflow-y-auto">

              {/* Step 1: Select WI Code */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5">1</span>
                  รหัสมาตรฐาน W/I <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={uploadForm.wiCode}
                  onChange={e => handleWICodeChange(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">-- เลือก W/I Code เพื่อดึงข้อมูลอัตโนมัติ --</option>
                  {MASTER_WIS.map(wi => (
                    <option key={wi.code} value={wi.code}>{wi.code} — {wi.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1">หากเลือกรหัสที่มีอยู่ ระบบจะดึงข้อมูลมาเติมให้อัตโนมัติ</p>
              </div>

              {/* Form Fields - Always Visible */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    <Building2 size={14} className="inline mr-1 text-purple-600" />
                    หน่วยงานที่รับผิดชอบ
                  </label>
                  <select
                    value={uploadForm.department}
                    onChange={e => setUploadForm(f => ({ ...f, department: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                  >
                    <option value="">-- เลือกหน่วยงาน --</option>
                    {DEPARTMENT_LABELS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    <Calendar size={14} className="inline mr-1 text-purple-600" />
                    วันที่มีผลบังคับใช้
                  </label>
                  <input
                    type="date"
                    required
                    value={uploadForm.effectiveDate}
                    onChange={e => setUploadForm(f => ({ ...f, effectiveDate: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    <User size={14} className="inline mr-1 text-purple-600" />
                    ผู้อนุมัติเอกสาร
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น Chief วิศวะ ซ่อมสร้าง"
                    value={uploadForm.author}
                    onChange={e => setUploadForm(f => ({ ...f, author: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    <Shield size={14} className="inline mr-1 text-purple-600" />
                    มาตรฐานที่เกี่ยวข้อง
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ISO/IEC 17025"
                    value={uploadForm.standard}
                    onChange={e => setUploadForm(f => ({ ...f, standard: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Purpose & Scope */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5">2</span>
                  <AlignLeft size={13} className="inline mr-1 text-purple-600" />
                  วัตถุประสงค์และขอบเขต (Purpose & Scope)
                </label>
                <textarea
                  required
                  rows={4}
                  value={uploadForm.purpose}
                  onChange={e => setUploadForm(f => ({ ...f, purpose: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                  placeholder="ระบุวัตถุประสงค์และขอบเขตของคู่มือ..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5">3</span>
                  ไฟล์เอกสาร PDF
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <Upload size={24} className="text-slate-400 mb-2" />
                  <span className="text-sm text-slate-600 font-medium">
                    {uploadForm.fileName || 'คลิกเพื่อเลือกไฟล์ PDF'}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">ขนาดสูงสุด 10 MB</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 text-sm"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={!uploadForm.wiCode || !uploadForm.department || !uploadForm.effectiveDate || !uploadForm.author || !uploadForm.standard || !uploadForm.purpose}
                  className="px-5 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  อัปโหลดและบันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
