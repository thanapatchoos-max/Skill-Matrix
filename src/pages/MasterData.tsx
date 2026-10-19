import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings, ShieldAlert, Check, RefreshCw, Layers, ArrowLeft, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FilterBar, FilterToggle } from '../components/FilterBar';
import { Field, inputClass } from '../components/Phase1Shared';
import { Pagination } from '../components/Pagination';

interface SkillType {
  code: string;
  name: string;
  description?: string;
  status: 'active' | 'archived';
}

interface WorkInstruction {
  id: string;
  code: string;
  name: string;
  department: string;
  category: string;
  version: string;
  types: string[];
  status: 'active' | 'archived';
  updatedAt: string;
  updatedBy: string;
}

const CATEGORY_OPTIONS = [
  'Testing & Quality (งานทดสอบและคุณภาพ)',
  'Assembly Line (งานประกอบและขึ้นรูป)',
  'Mechanical & Structure (งานโครงสร้างและกลการ)',
  'Calibration & Measurement (งานสอบเทียบและเครื่องมือวัด)',
  'Maintenance & Safety (งานบำรุงรักษาและความปลอดภัย)',
  'Final Inspection & Audit (งานตรวจสอบขั้นสุดท้าย)'
];

const initialTypes: SkillType[] = [
  { code: 'A', name: 'Circuit Connecting / Wire Harnessing', description: 'การต่อวงจรไฟฟ้า รัดสายไฟ และตรวจสอบความถูกต้องของระบบสายสัญญาณ', status: 'active' },
  { code: 'B', name: 'Machine Operator / Testing Station Control', description: 'การควบคุมเครื่องจักรในกระบวนการทดสอบและประกอบอุปกรณ์หลัก', status: 'active' },
  { code: 'C', name: 'Inspection Report & Data Recording', description: 'การบันทึกรายงานผลการทดสอบคุณภาพและการลงบันทึกในระบบ ISO', status: 'active' },
  { code: 'D', name: 'Data Analysis & Troubleshooting', description: 'การวิเคราะห์ผลทดสอบ หาข้อบกพร่อง และแก้ปัญหางานที่ชำรุด', status: 'active' },
  { code: 'E', name: 'Safety & Environmental Control', description: 'การควบคุมความปลอดภัยและการจัดการสิ่งแวดล้อมในสถานีปฏิบัติงาน', status: 'active' }
];

const mockWIs: WorkInstruction[] = [
  { id: 'wi-001', code: 'QCW001-001', name: 'การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น (Initial Resistance Test)', department: 'QC Section', category: 'Testing & Quality (งานทดสอบและคุณภาพ)', version: 'v2.1', types: ['A', 'B', 'C', 'D'], status: 'active', updatedAt: '2026-09-15', updatedBy: 'Admin (คุณสมชาย)' },
  { id: 'wi-002', code: 'QCW001-002', name: 'การทดสอบพิกัดกำลังไฟฟ้าและแรงดันสูง (High Voltage Breakdown Test)', department: 'QC Section', category: 'Testing & Quality (งานทดสอบและคุณภาพ)', version: 'v3.0', types: ['A', 'B', 'C', 'D'], status: 'active', updatedAt: '2026-09-18', updatedBy: 'Admin (คุณสมชาย)' },
  { id: 'wi-003', code: 'QCW002-001', name: 'การตรวจสอบรอยเชื่อมและจุดยึดโครงสร้างหม้อแปลง (Structural Inspection)', department: 'QC Section', category: 'Mechanical & Structure (งานโครงสร้างและกลการ)', version: 'v1.4', types: ['C', 'D'], status: 'active', updatedAt: '2026-09-10', updatedBy: 'Admin (คุณสมชาย)' },
  { id: 'wi-004', code: 'PROD-010-01', name: 'การพันคอยล์และประกอบแกนเหล็กหม้อแปลง (Core & Coil Assembly)', department: 'Production', category: 'Assembly Line (งานประกอบและขึ้นรูป)', version: 'v2.0', types: ['A', 'B', 'E'], status: 'active', updatedAt: '2026-08-22', updatedBy: 'Chief เอกวิทย์' },
  { id: 'wi-005', code: 'PROD-010-02', name: 'การเติมน้ำมันฉนวนสูญญากาศ (Vacuum Oil Filling Process)', department: 'Production', category: 'Assembly Line (งานประกอบและขึ้นรูป)', version: 'v1.8', types: ['B', 'C', 'E'], status: 'active', updatedAt: '2026-09-01', updatedBy: 'Chief เอกวิทย์' },
  { id: 'wi-006', code: 'ENG-M-001', name: 'การบำรุงรักษาเชิงป้องกันเครื่องจักรทดสอบประจำเดือน (Preventive Maintenance)', department: 'Engineering', category: 'Maintenance & Safety (งานบำรุงรักษาและความปลอดภัย)', version: 'v1.2', types: ['B', 'D', 'E'], status: 'active', updatedAt: '2026-07-14', updatedBy: 'Admin (คุณสมชาย)' },
  { id: 'wi-007', code: 'ENG-M-002', name: 'การสอบเทียบเครื่องมือวัดไฟฟ้ามาตรฐาน ISO/IEC 17025 (Calibration Procedure)', department: 'Engineering', category: 'Calibration & Measurement (งานสอบเทียบและเครื่องมือวัด)', version: 'v4.1', types: ['C', 'D'], status: 'active', updatedAt: '2026-09-20', updatedBy: 'Admin (คุณสมชาย)' },
  { id: 'wi-008', code: 'PROD-020-01', name: 'การประกอบตัวถังภายนอกและติดตั้งซีลกันรั่ว (Tank Assembly & Sealing)', department: 'Production', category: 'Assembly Line (งานประกอบและขึ้นรูป)', version: 'v2.2', types: ['B', 'E'], status: 'active', updatedAt: '2026-09-12', updatedBy: 'Chief เอกวิทย์' },
  { id: 'wi-009', code: 'QCW004-001', name: 'การทดสอบวัดค่าการสูญเสียในสภาวะไร้ภาระ (No-Load Loss Measurement)', department: 'QC Section', category: 'Testing & Quality (งานทดสอบและคุณภาพ)', version: 'v1.5', types: ['A', 'C', 'D'], status: 'active', updatedAt: '2026-09-22', updatedBy: 'Admin (คุณสมชาย)' },
  { id: 'wi-010', code: 'ENG-D-003', name: 'การจำลองและวิเคราะห์ความร้อนหม้อแปลงด้วยวงจรทดสอบ (Thermal Run Test)', department: 'Engineering', category: 'Calibration & Measurement (งานสอบเทียบและเครื่องมือวัด)', version: 'v2.0', types: ['B', 'D'], status: 'active', updatedAt: '2026-09-24', updatedBy: 'Admin (คุณสมชาย)' },
  { id: 'wi-011', code: 'QCW005-001', name: 'การตรวจสอบฉลาก รหัสสี และสเปกบรรจุภัณฑ์ก่อนจัดส่ง (Final Product Audit)', department: 'QC Section', category: 'Final Inspection & Audit (งานตรวจสอบขั้นสุดท้าย)', version: 'v1.1', types: ['C', 'E'], status: 'active', updatedAt: '2026-09-25', updatedBy: 'Admin (คุณสมชาย)' },
  { id: 'wi-012', code: 'PROD-030-01', name: 'การพ่นสีอบความร้อนรองพื้นและเคลือบเงา (Surface Coating & Painting)', department: 'Production', category: 'Assembly Line (งานประกอบและขึ้นรูป)', version: 'v1.3', types: ['B', 'E'], status: 'active', updatedAt: '2026-08-30', updatedBy: 'Chief เอกวิทย์' },
  { id: 'wi-013', code: 'QCW003-001', name: 'การตรวจสอบสเปกส่วนประกอบภายนอกฉบับยกเลิก (Legacy Inspection Standard)', department: 'QC Section', category: 'Final Inspection & Audit (งานตรวจสอบขั้นสุดท้าย)', version: 'v1.0', types: ['C'], status: 'archived', updatedAt: '2026-05-10', updatedBy: 'Admin (คุณสมชาย)' }
];

const ITEMS_PER_PAGE = 10;

export function MasterData({ userRole = 'admin' }: { userRole?: string }) {
  const [wis, setWis] = useState<WorkInstruction[]>(mockWIs);
  const [skillTypes, setSkillTypes] = useState<SkillType[]>(initialTypes);
  
  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [showArchived, setShowArchived] = useState(false);
  const [activeTab, setActiveTab] = useState<'wis' | 'skillTypes'>('wis');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Inline Form State (No Popup Modal!)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWiId, setEditingWiId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '',
    name: '',
    department: 'QC Section',
    category: CATEGORY_OPTIONS[0],
    version: 'v1.0',
    types: ['A', 'B', 'C', 'D'] as string[]
  });

  // Skill Type Inline Form State
  const [editingSkillCode, setEditingSkillCode] = useState<string | null>(null);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [typeForm, setTypeForm] = useState({ code: '', name: '', description: '' });

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered WIs
  const filteredWIs = wis.filter(wi => {
    const matchesSearch = wi.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          wi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wi.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || wi.department === deptFilter;
    const matchesArchived = showArchived ? true : wi.status === 'active';
    return matchesSearch && matchesDept && matchesArchived;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredWIs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedWIs = filteredWIs.slice(startIndex, startIndex + pageSize);

  // Handlers for Work Instruction
  const handleOpenAddForm = () => {
    setEditingWiId(null);
    setForm({
      code: `WI-${new Date().getFullYear()}-${String(wis.length + 1).padStart(3, '0')}`,
      name: '',
      department: 'QC Section',
      category: CATEGORY_OPTIONS[0],
      version: 'v1.0',
      types: ['A', 'B']
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (wi: WorkInstruction) => {
    setEditingWiId(wi.id);
    setForm({
      code: wi.code,
      name: wi.name,
      department: wi.department,
      category: wi.category,
      version: wi.version,
      types: [...wi.types]
    });
    setIsFormOpen(true);
  };

  const handleSaveWI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.name.trim()) return;

    if (editingWiId) {
      setWis(prev => prev.map(item => item.id === editingWiId ? {
        ...item,
        code: form.code,
        name: form.name,
        department: form.department,
        category: form.category,
        version: form.version,
        types: form.types,
        updatedAt: new Date().toISOString().slice(0, 10),
        updatedBy: 'Admin (คุณสมชาย)'
      } : item));
      showToast(`แก้ไขข้อมูลมาตรฐาน W/I (${form.code}) เรียบร้อยแล้ว`);
    } else {
      const newWI: WorkInstruction = {
        id: `wi-${Date.now()}`,
        code: form.code,
        name: form.name,
        department: form.department,
        category: form.category,
        version: form.version,
        types: form.types,
        status: 'active',
        updatedAt: new Date().toISOString().slice(0, 10),
        updatedBy: 'Admin (คุณสมชาย)'
      };
      setWis([newWI, ...wis]);
      showToast(`สร้างมาตรฐาน W/I (${form.code}) ใหม่สำเร็จ`);
    }

    setIsFormOpen(false);
  };

  const handleToggleArchiveWI = (id: string, currentStatus: 'active' | 'archived') => {
    const nextStatus = currentStatus === 'active' ? 'archived' : 'active';
    setWis(prev => prev.map(w => w.id === id ? { ...w, status: nextStatus } : w));
    showToast(nextStatus === 'archived' ? 'ย้ายมาตรฐาน W/I ไปยังคลังจัดเก็บ (Soft-deleted)' : 'คืนค่ามาตรฐาน W/I สมบูรณ์');
  };

  // Handlers for Skill Types
  const handleSaveSkillType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeForm.code.trim() || !typeForm.name.trim()) return;

    if (editingSkillCode) {
      setSkillTypes(prev => prev.map(t => t.code === editingSkillCode ? { ...t, name: typeForm.name, description: typeForm.description } : t));
      showToast(`แก้ไข Skill Type (${typeForm.code}) เรียบร้อยแล้ว`);
    } else {
      if (skillTypes.some(t => t.code.toUpperCase() === typeForm.code.toUpperCase())) {
        alert('รหัส Skill Type นี้มีอยู่ในระบบแล้ว');
        return;
      }
      setSkillTypes([...skillTypes, { code: typeForm.code.toUpperCase(), name: typeForm.name, description: typeForm.description, status: 'active' }]);
      showToast(`เพิ่ม Skill Type (${typeForm.code.toUpperCase()}) สำเร็จ`);
    }
    setShowTypeForm(false);
    setEditingSkillCode(null);
    setTypeForm({ code: '', name: '', description: '' });
  };

  const handleToggleArchiveType = (code: string) => {
    setSkillTypes(prev => prev.map(t => t.code === code ? { ...t, status: t.status === 'active' ? 'archived' : 'active' } : t));
    showToast('ปรับสถานะ Skill Type เรียบร้อยแล้ว');
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
            <Settings className="text-[#0a2540]" /> จัดการข้อมูลพื้นฐาน (Master Data)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            ศูนย์กลางกำหนดมาตรฐานคู่มือปฏิบัติงาน (Work Instruction) และสเปก Skill Types ย่อย (เฉพาะ Admin)
          </p>
        </div>

        {!isFormOpen && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddForm}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg transition-colors font-semibold shadow-md text-sm"
            >
              <Plus size={18} /> เพิ่ม Work Instruction ใหม่
            </button>
          </div>
        )}
      </div>

      {/* Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <div className="text-amber-500 mt-0.5 flex-shrink-0"><ShieldAlert size={20} /></div>
        <div className="text-sm text-amber-900 space-y-0.5">
          <div className="font-bold">พื้นที่เฉพาะผู้ดูแลระบบ (Admin Only - Full Control)</div>
          <div className="text-amber-800 text-xs">
            ข้อมูลโครงสร้างมาตรฐาน W/I ในหน้านี้จะถูกดึงไปใช้ประเมินทักษะใน Skill Matrix, OJT Form และการประมวลผลประจำปี การ Soft-delete จะไม่กระทบประวัติย้อนหลังใน Audit Trail
          </div>
        </div>
      </div>

      {/* INLINE FORM: Add / Edit Work Instruction (No Popup Modal!) */}
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
                  {editingWiId ? `แก้ไขมาตรฐาน W/I (${form.code})` : 'สร้าง Work Instruction ใหม่ (Inline Form)'}
                </h2>
                <p className="text-xs text-blue-200">กรอกข้อมูลและเลือก Skill Types ที่ใช้ประเมินพนักงานตามมาตรฐาน W/I นี้</p>
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

          <form onSubmit={handleSaveWI} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  รหัส W/I (Code) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น QCW001-003"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-mono font-bold text-slate-800"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  ชื่อคู่มือปฏิบัติงาน (Work Instruction) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ระบุชื่อขั้นตอนหรือกระบวนการทำงาน..."
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">แผนกที่สังกัด (Section)</label>
                <select
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium text-slate-700"
                >
                  <option value="QC Section">QC Section</option>
                  <option value="Production">Production</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Assembly Line">Assembly Line</option>
                </select>
              </div>

              {/* DROPDOWN SELECT FOR CATEGORY */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  หมวดหมู่งาน (Category) <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium text-slate-700"
                >
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">เวอร์ชัน W/I (Version)</label>
                <input
                  type="text"
                  placeholder="v1.0"
                  value={form.version}
                  onChange={e => setForm({ ...form, version: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-mono text-slate-700"
                />
              </div>
            </div>

            {/* Skill Types Selector */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    กำหนด Skill Types ที่ประเมินใน W/I นี้ <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500">ติ๊กเลือกประเภททักษะย่อยที่จะแสดงเป็นคอลัมน์ประเมินในตาราง Skill Matrix</p>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  เลือกไว้แล้ว {form.types.length} ประเภท
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {skillTypes.filter(st => st.status === 'active').map(st => {
                  const isChecked = form.types.includes(st.code);
                  return (
                    <label
                      key={st.code}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-blue-50/80 border-blue-500 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          if (e.target.checked) {
                            setForm({ ...form, types: [...form.types, st.code] });
                          } else {
                            setForm({ ...form, types: form.types.filter(c => c !== st.code) });
                          }
                        }}
                        className="mt-1 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-800 shadow-xs">
                            {st.code}
                          </span>
                          <span className="font-bold text-sm text-slate-800 truncate">{st.name}</span>
                        </div>
                        {st.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{st.description}</p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
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
                type="submit"
                disabled={form.types.length === 0}
                className="px-6 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg font-semibold text-sm transition-colors shadow-md flex items-center gap-2 disabled:opacity-40"
              >
                <Save size={16} /> {editingWiId ? 'บันทึกการแก้ไข W/I' : 'บันทึกสร้าง W/I ใหม่'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MAIN LAYOUT: Split Proportionally (70% W/I Table, 30% Skill Types Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT / MAIN SECTION (8 Columns): Work Instructions List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
            
            <FilterBar title="ค้นหามาตรฐานงาน W/I" onReset={()=>{setSearchQuery('');setDeptFilter('ALL');setShowArchived(false);setCurrentPage(1);}} footer={<FilterToggle checked={showArchived} onChange={checked=>{setShowArchived(checked);setCurrentPage(1);}}>รวมรายการที่เก็บเข้าคลัง</FilterToggle>}>
              <Field label="ค้นหามาตรฐานงาน"><input placeholder="รหัส W/I ชื่อขั้นตอน หรือหมวดหมู่" value={searchQuery} onChange={e=>{setSearchQuery(e.target.value);setCurrentPage(1);}} className={inputClass}/></Field>
              <Field label="แผนก"><select value={deptFilter} onChange={e=>{setDeptFilter(e.target.value);setCurrentPage(1);}} className={inputClass}>
                <option value="ALL">ทุกแผนก</option><option value="QC Section">QC Section</option><option value="Production">Production</option><option value="Engineering">Engineering</option>
              </select></Field>
            </FilterBar>

            {/* W/I Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wide">
                    <th className="px-4 py-3.5">W/I Code & Version</th>
                    <th className="px-4 py-3.5">ชื่อขั้นตอนการทำงาน (Work Instruction)</th>
                    <th className="px-4 py-3.5">แผนก / หมวดหมู่</th>
                    <th className="px-4 py-3.5 text-center">Skill Types ที่ผูก</th>
                    <th className="px-4 py-3.5 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedWIs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400">
                        ไม่พบข้อมูลรายการ Work Instruction ที่ตรงกับเงื่อนไข
                      </td>
                    </tr>
                  ) : (
                    paginatedWIs.map(wi => {
                      const isArchived = wi.status === 'archived';
                      return (
                        <tr 
                          key={wi.id} 
                          className={`hover:bg-blue-50/40 transition-colors ${
                            isArchived ? 'bg-slate-50/70 text-slate-400 opacity-65' : ''
                          }`}
                        >
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="font-mono font-bold text-slate-800 text-xs flex items-center gap-2">
                              {wi.code}
                              <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.2 rounded">
                                {wi.version}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">อัปเดต: {wi.updatedAt}</div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-slate-800 leading-snug">{wi.name}</div>
                            {isArchived && (
                              <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                                Soft-deleted (Archived)
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                              {wi.department}
                            </span>
                            <div className="text-[11px] text-slate-500 mt-0.5 max-w-[180px] truncate" title={wi.category}>
                              {wi.category}
                            </div>
                          </td>

                          <td className="px-4 py-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              {wi.types.map(code => (
                                <span 
                                  key={code} 
                                  className="w-5 h-5 rounded bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center shadow-xs"
                                >
                                  {code}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="px-4 py-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditForm(wi)}
                                title="แก้ไข W/I"
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                              >
                                <Edit size={16} />
                              </button>

                              <button
                                onClick={() => handleToggleArchiveWI(wi.id, wi.status)}
                                title={isArchived ? "คืนค่า W/I" : "Soft-delete (ย้ายเข้าคลัง)"}
                                className={`p-1.5 rounded-lg transition-colors border ${
                                  isArchived 
                                    ? 'text-emerald-600 hover:bg-emerald-50 border-emerald-200' 
                                    : 'text-red-500 hover:bg-red-50 border-transparent hover:border-red-200'
                                }`}
                              >
                                {isArchived ? <RefreshCw size={16} /> : <Trash2 size={16} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredWIs.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[5, 10, 25, 50]}
              itemLabel="รายการ"
            />

          </div>
        </div>

        {/* RIGHT SECTION (4 Columns): Skill Types Master Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800">Skill Types Master</h2>
                <p className="text-xs text-slate-500">ประเภททักษะย่อยมาตรฐานที่ดึงไปผูก W/I</p>
              </div>
              <button
                onClick={() => {
                  setEditingSkillCode(null);
                  setTypeForm({ code: '', name: '', description: '' });
                  setShowTypeForm(!showTypeForm);
                }}
                className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-bold text-xs flex items-center gap-1 border border-blue-200"
              >
                <Plus size={14} /> เพิ่ม
              </button>
            </div>

            {/* Add/Edit Skill Type Form */}
            {showTypeForm && (
              <form onSubmit={handleSaveSkillType} className="bg-slate-50 p-4 rounded-xl border border-blue-200 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between font-bold text-xs text-blue-900 border-b border-slate-200 pb-2">
                  <span>{editingSkillCode ? `แก้ไข Skill Type (${editingSkillCode})` : 'เพิ่ม Skill Type ย่อยใหม่'}</span>
                  <button type="button" onClick={() => setShowTypeForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">รหัสตัวอักษร (Code)</label>
                  <input
                    type="text"
                    maxLength={3}
                    disabled={!!editingSkillCode}
                    placeholder="เช่น E, F"
                    value={typeForm.code}
                    onChange={e => setTypeForm({ ...typeForm, code: e.target.value.toUpperCase() })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">ชื่อประเภททักษะ (Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น Inspection, Calibration"
                    value={typeForm.name}
                    onChange={e => setTypeForm({ ...typeForm, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">คำอธิบายงานย่อย</label>
                  <textarea
                    rows={2}
                    placeholder="อธิบายรายละเอียดการปฏิบัติงาน..."
                    value={typeForm.description}
                    onChange={e => setTypeForm({ ...typeForm, description: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowTypeForm(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-600 bg-white"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0a2540] text-white rounded text-xs font-semibold hover:bg-[#0d3060]"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            )}

            {/* List of Master Skill Types */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {skillTypes.map(st => {
                const isArchived = st.status === 'archived';
                return (
                  <div
                    key={st.code}
                    className={`p-3 rounded-xl border transition-all space-y-1.5 ${
                      isArchived 
                        ? 'bg-slate-50 border-slate-200 opacity-60' 
                        : 'bg-slate-50/80 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#0a2540] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {st.code}
                        </span>
                        <span className="font-bold text-xs text-slate-800">{st.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingSkillCode(st.code);
                            setTypeForm({ code: st.code, name: st.name, description: st.description || '' });
                            setShowTypeForm(true);
                          }}
                          className="p-1 text-slate-500 hover:text-blue-600 rounded"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => handleToggleArchiveType(st.code)}
                          className="p-1 text-slate-500 hover:text-red-500 rounded"
                        >
                          {isArchived ? <RefreshCw size={13} /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </div>

                    {st.description && (
                      <p className="text-[11px] text-slate-500 leading-snug pl-9">{st.description}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              สามารถเพิ่ม Skill Type ย่อยใหม่ (เช่น E, F...) เพื่อนำไปใช้กับ W/I ใหม่ได้ตลอดเวลา
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
