import { FilterBar } from '../components/FilterBar';
import { useState, useRef } from 'react';
import { Users, Plus, X, Upload, Trash2, ArrowRightLeft, History, Calendar, Check, Building2, ShieldCheck, Pencil, FileSpreadsheet } from 'lucide-react';
import { bangkokYear, employeesForYear, SKILL_DEPARTMENTS, SKILL_WIS, sumSkills, visibleEmployees } from '../data/phase1Core';
import type { Employee } from '../data/phase1Core';
import { saveSkillEmployee, transferSkillDepartment, useSkillState } from '../data/phase1Store';
import { buttonClass, Field, inputClass, LevelBadge, panelClass } from '../components/Phase1Shared';
import { Pagination } from '../components/Pagination';
import { Avatar, compressImage } from '../components/Avatar';
import { bangkokDate } from '../data/trainingCore';
import { ExcelImportModal } from '../components/ExcelImportModal';

const blank = {
  id: '',
  name: '',
  position: '',
  department: 'QC Section',
  assignedSkills: [] as string[],
  avatarUrl: '' as string | undefined,
};

export default function PhaseOneEmployees({ userRole }: { userRole: string }) {
  const state = useSkillState();
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<typeof blank | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Transfer Department States
  const [transferTarget, setTransferTarget] = useState<Employee | null>(null);
  const [targetDept, setTargetDept] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(bangkokDate());
  const [transferReason, setTransferReason] = useState('');
  const [transferError, setTransferError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Skill History Modal States
  const [historyTarget, setHistoryTarget] = useState<Employee | null>(null);

  // Excel Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);

  const allVisibleEmployees = visibleEmployees(employeesForYear(state, bangkokYear()), userRole);
  const employees = allVisibleEmployees.filter(e =>
    `${e.id} ${e.name} ${e.department} ${e.position}`.toLowerCase().includes(search.trim().toLowerCase())
  );

  const totalEmployees = employees.length;
  const totalPages = Math.max(1, Math.ceil(totalEmployees / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedEmployees = employees.slice(startIndex, startIndex + pageSize);

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      setError('');
      const compressed = await compressImage(file);
      setForm(prev => prev ? { ...prev, avatarUrl: compressed } : null);
    } catch (err) {
      setError((err as Error).message || 'เกิดข้อผิดพลาดในการประมวลผลไฟล์รูป');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    try {
      if (!editing && employeesForYear(state, bangkokYear()).some(e => e.id === form!.id)) {
        throw new Error('รหัสพนักงานนี้มีอยู่แล้ว');
      }
      saveSkillEmployee('admin', form!);
      setForm(null);
      setError('');
      setSuccessMessage(editing ? `แก้ไขข้อมูล ${form!.name} สำเร็จ` : `เพิ่มพนักงาน ${form!.name} สำเร็จ`);
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function openTransfer(emp: Employee) {
    setTransferTarget(emp);
    const available = SKILL_DEPARTMENTS.filter(d => d !== emp.department);
    setTargetDept(available[0] ?? '');
    setEffectiveDate(bangkokDate());
    setTransferReason('');
    setTransferError('');
  }

  function handleTransferSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!transferTarget) return;
    setTransferError('');
    try {
      transferSkillDepartment('admin', transferTarget.id, targetDept, effectiveDate, transferReason);
      setSuccessMessage(`โอนย้าย ${transferTarget.name} ไปยังแผนก ${targetDept} สำเร็จ (จัดเก็บประวัติสกิลเดิมเรียบร้อย)`);
      setTransferTarget(null);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setTransferError((err as Error).message || 'เกิดข้อผิดพลาดในการโอนย้าย');
    }
  }

  function openHistory(emp: Employee) {
    setHistoryTarget(emp);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <Users />จัดการข้อมูลพนักงาน
          </h1>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
            {search.trim() ? `ค้นพบ ${totalEmployees} จาก ${allVisibleEmployees.length} คน` : `ทั้งหมด ${totalEmployees} คน`}
          </span>
        </div>
        {userRole === 'admin' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-100 transition-colors"
              onClick={() => setShowImportModal(true)}
            >
              <FileSpreadsheet size={16} className="text-emerald-600" />
              <span>นำเข้าจาก Excel</span>
            </button>
            <button
              className={buttonClass}
              onClick={() => {
                setForm({ ...blank });
                setEditing(false);
                setError('');
              }}
            >
              <Plus size={16} />เพิ่มพนักงาน
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500">
        จัดการข้อมูลส่วนตัว โอนย้ายแผนก และตรวจประวัติสกิลเดิม · คะแนนพนักงานปรับผ่านหัวหน้างานและการอนุมัติ
      </p>

      {successMessage && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 flex items-center gap-2 shadow-xs">
          <Check size={18} className="text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <FilterBar title="ค้นหาพนักงาน" onReset={() => { setSearch(''); setCurrentPage(1); }}>
        <Field label="ค้นหาพนักงาน">
          <input
            className={inputClass}
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="รหัส / ชื่อ / แผนก / ตำแหน่ง"
          />
        </Field>
      </FilterBar>

      <div className={`${panelClass} overflow-x-auto`}>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">รหัส</th>
              <th className="p-4">พนักงาน</th>
              <th className="p-4">ตำแหน่ง</th>
              <th className="p-4">แผนก</th>
              <th className="p-4 text-right">คะแนนรวม</th>
              <th className="p-4 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.length ? (
              paginatedEmployees.map(e => (
                <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-500">{e.id}</td>
                  <td className="p-4 font-semibold">
                    <div className="flex items-center gap-3">
                      <Avatar src={e.avatarUrl} name={e.name} size="sm" />
                      <span>{e.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700">{e.position}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{e.department}</div>
                    {e.transferHistory && e.transferHistory.length > 0 && (
                      <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        เคยโอนย้าย {e.transferHistory.length} ครั้ง
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right font-bold text-blue-800">{sumSkills(e)}</td>
                  <td className="p-4 text-right">
                    {userRole === 'admin' && (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          title="แก้ไขข้อมูลทั่วไป"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          onClick={() => {
                            setForm({
                              id: e.id,
                              name: e.name,
                              position: e.position,
                              department: e.department,
                              assignedSkills: [...e.assignedSkills],
                              avatarUrl: e.avatarUrl ?? '',
                            });
                            setEditing(true);
                            setError('');
                          }}
                        >
                          <Pencil size={13} />
                          <span>แก้ไข</span>
                        </button>
                        <button
                          type="button"
                          title="ดูประวัติการโอนย้ายและสกิลของแผนกเดิม"
                          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-colors ${
                            e.transferHistory?.length
                              ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                              : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                          onClick={() => openHistory(e)}
                        >
                          <History size={13} />
                          <span>ประวัติ {e.transferHistory?.length ? `(${e.transferHistory.length})` : ''}</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-slate-500">
                  ไม่พบข้อมูลพนักงานที่ตรงกับเงื่อนไขการค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={safeCurrentPage}
          totalItems={totalEmployees}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 25, 50]}
          itemLabel="คน"
        />
      </div>

      {form && userRole === 'admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-2xs">
          <form onSubmit={save} className={`${panelClass} max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto p-6`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800">{editing ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงาน'}</h2>
              <button aria-label="ปิดหน้าข้อมูลพนักงาน" type="button" onClick={() => setForm(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</p>}

            {/* Profile Photo Upload & Preview Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="relative group shrink-0">
                <Avatar src={form.avatarUrl} name={form.name || 'พนักงาน'} size="xl" className="ring-2 ring-white shadow-md" />
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="text-sm font-semibold text-slate-800">รูปถ่ายพนักงาน</div>
                <p className="text-xs text-slate-500">
                  รองรับไฟล์รูปภาพ JPG, PNG, WEBP (ระบบจะปรับลดขนาดและบีบอัดให้อัตโนมัติ)
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-400 transition-colors disabled:opacity-50"
                  >
                    <Upload size={14} />
                    {uploadingImage ? 'กำลังประมวลผลรูปภาพ...' : (form.avatarUrl ? 'เปลี่ยนรูปถ่าย' : 'แนบไฟล์รูปถ่าย')}
                  </button>
                  {form.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setForm(prev => prev ? { ...prev, avatarUrl: '' } : null)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                      ลบรูป
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="รหัสพนักงาน">
                <input
                  required
                  disabled={editing}
                  maxLength={30}
                  pattern="[A-Za-z0-9_-]+"
                  className={inputClass}
                  value={form.id}
                  onChange={e => setForm({ ...form, id: e.target.value })}
                  placeholder="เช่น EMP001"
                />
              </Field>
              <Field label="ชื่อ - นามสกุล">
                <input
                  required
                  maxLength={150}
                  className={inputClass}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="เช่น สมชาย ใจดี"
                />
              </Field>
              <Field label="ตำแหน่ง">
                <input
                  required
                  maxLength={150}
                  className={inputClass}
                  value={form.position}
                  onChange={e => setForm({ ...form, position: e.target.value })}
                  placeholder="เช่น ช่างเทคนิคชำนาญการ"
                />
              </Field>
              {editing ? (
                <Field label="แผนก">
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-slate-400" />
                      <span className="font-semibold text-slate-800">{form.department}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const emp = employees.find(e => e.id === form.id);
                        if (emp) {
                          setForm(null);
                          openTransfer(emp);
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-2xs hover:bg-blue-50 transition-colors"
                    >
                      <ArrowRightLeft size={12} />
                      <span>โอนย้ายแผนก</span>
                    </button>
                  </div>
                </Field>
              ) : (
                <Field label="แผนก">
                  <select
                    className={inputClass}
                    value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value, assignedSkills: [] })}
                  >
                    {SKILL_DEPARTMENTS.map(d => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700">งานที่มอบหมาย (On-duty)</p>
              {SKILL_WIS.filter(w => w.department === form.department).map(w => (
                <div key={w.code} className="rounded-lg border border-slate-200 p-3 bg-white">
                  <div className="mb-2 text-sm font-semibold text-slate-800">{w.code} · {w.name}</div>
                  <div className="flex flex-wrap gap-4">
                    {w.types.map(t => {
                      const key = `${w.code}_${t.code}`;
                      return (
                        <label key={key} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            checked={form.assignedSkills.includes(key)}
                            onChange={e =>
                              setForm({
                                ...form,
                                assignedSkills: e.target.checked
                                  ? [...form.assignedSkills, key]
                                  : form.assignedSkills.filter(k => k !== key),
                              })
                            }
                          />
                          <span>{t.code} · {t.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button className={buttonClass}>บันทึกข้อมูลพนักงาน</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 1: โอนย้ายแผนก (Transfer Department) */}
      {transferTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs">
          <form onSubmit={handleTransferSubmit} className={`${panelClass} w-full max-w-lg space-y-5 p-6 animate-in fade-in zoom-in-95 duration-150`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                <ArrowRightLeft className="text-blue-600" size={20} />
                <h2>โอนย้ายแผนกพนักงาน</h2>
              </div>
              <button type="button" onClick={() => setTransferTarget(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {transferError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">{transferError}</p>}

            {/* Employee Preview */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <Avatar src={transferTarget.avatarUrl} name={transferTarget.name} size="md" />
              <div>
                <div className="font-bold text-slate-800">{transferTarget.name}</div>
                <div className="text-xs text-slate-500">{transferTarget.id} · {transferTarget.position}</div>
              </div>
            </div>

            {/* Transfer Route */}
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">แผนกเดิม (ดึงอัตโนมัติ)</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  <Building2 size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate">{transferTarget.department}</span>
                </div>
              </div>
              <div className="flex justify-center text-blue-600 pt-4">
                <ArrowRightLeft size={18} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">แผนกใหม่ที่ย้ายไป *</label>
                <select
                  required
                  className={inputClass}
                  value={targetDept}
                  onChange={e => setTargetDept(e.target.value)}
                >
                  {SKILL_DEPARTMENTS.filter(d => d !== transferTarget.department).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <Field label="วันที่มีผลบังคับใช้ *">
              <input
                required
                type="date"
                className={inputClass}
                value={effectiveDate}
                onChange={e => setEffectiveDate(e.target.value)}
              />
            </Field>

            <Field label="เหตุผลการโอนย้าย / หมายเหตุ">
              <textarea
                rows={3}
                maxLength={1000}
                className={inputClass}
                value={transferReason}
                onChange={e => setTransferReason(e.target.value)}
                placeholder="ระบุเหตุผล เช่น โอนย้ายเพื่อเสริมกำลังผลิตตามคำสั่ง บก.04/2026, ขอย้ายสายงานตามความเชี่ยวชาญ..."
              />
            </Field>

            {/* Policy Banner */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs leading-5 text-blue-900">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <ShieldCheck size={15} />
                การจัดการและบันทึกประวัติสกิลเดิม
              </div>
              <p>
                ระบบจะบันทึกคะแนนและสกิลทั้งหมดของแผนก <strong>{transferTarget.department}</strong> เก็บไว้ใน <strong>"ประวัติสกิลของแผนกเดิม"</strong> โดยอัตโนมัติ เพื่อให้ตรวจสอบย้อนหลังได้ตลอดเวลา และในแผนกใหม่ <strong>{targetDept}</strong> พนักงานจะเริ่มต้นด้วยชุดทักษะของแผนกใหม่
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTransferTarget(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button type="submit" className={buttonClass}>
                <Check size={16} />
                ยืนยันการโอนย้ายแผนก
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: ประวัติสกิลของแผนกเดิม (Skill & Transfer History Modal) */}
      {historyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs">
          <div className={`${panelClass} max-h-[90vh] w-full max-w-3xl space-y-5 overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                <History className="text-amber-600" size={20} />
                <h2>ประวัติการโอนย้ายและสกิลของแผนกเดิม</h2>
              </div>
              <button type="button" onClick={() => setHistoryTarget(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Employee Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center gap-3">
                <Avatar src={historyTarget.avatarUrl} name={historyTarget.name} size="lg" className="ring-2 ring-white shadow-xs" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{historyTarget.name}</h3>
                  <p className="text-xs text-slate-500">{historyTarget.id} · {historyTarget.position}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block mb-0.5">แผนกปัจจุบัน</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                  <Building2 size={13} />
                  {historyTarget.department}
                </span>
              </div>
            </div>

            {/* History Records List */}
            {!historyTarget.transferHistory || historyTarget.transferHistory.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                <History size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="font-medium text-slate-700">ยังไม่มีประวัติการโอนย้ายแผนก</p>
                <p className="text-xs text-slate-400 mt-1">พนักงานท่านนี้ยังไม่เคยเปลี่ยนสังกัดแผนก หรือเพิ่งเริ่มงานในแผนกปัจจุบัน</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ประวัติการโอนย้าย ({historyTarget.transferHistory.length} รายการ)
                  </span>
                </div>

                {/* Timeline of transfers */}
                <div className="space-y-5">
                  {historyTarget.transferHistory.slice().reverse().map((record, index) => {
                    const previousSkills = Object.entries(record.scoresSnapshot);
                    const totalScore = previousSkills.reduce((sum, [, score]) => sum + score, 0);

                    return (
                      <article key={record.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                        {/* Record Header */}
                        <div className="bg-slate-50/90 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                              ครั้งที่ {historyTarget.transferHistory!.length - index}
                            </span>
                            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                              <span>{record.fromDepartment}</span>
                              <ArrowRightLeft size={14} className="text-blue-600" />
                              <span className="text-blue-700">{record.toDepartment}</span>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <Calendar size={13} className="text-slate-400" />
                            วันที่มีผล: <strong className="text-slate-700 font-bold">{record.effectiveDate}</strong>
                          </div>
                        </div>

                        <div className="p-4 space-y-4">
                          {/* Reason / Remarks */}
                          <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5">
                            <strong className="text-slate-700">เหตุผล / บันทึก: </strong>
                            {record.reason || 'ไม่ได้ระบุ'}
                          </div>

                          {/* Archived Skills Table */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <ShieldCheck size={14} className="text-emerald-600" />
                                ประวัติสกิลแผนกเดิม ({record.fromDepartment})
                              </span>
                              <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                                คะแนนรวมเดิม: {totalScore} คะแนน
                              </span>
                            </div>

                            {previousSkills.length === 0 ? (
                              <p className="text-xs text-slate-400 italic">ไม่มีข้อมูลสกิลที่บันทึกไว้ในแผนกเดิม</p>
                            ) : (
                              <div className="overflow-x-auto rounded-lg border border-slate-200">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                    <tr>
                                      <th className="p-2.5">รหัส W/I</th>
                                      <th className="p-2.5">ชื่องาน</th>
                                      <th className="p-2.5">ประเภท</th>
                                      <th className="p-2.5 text-center">ระดับสกิลเดิม</th>
                                      <th className="p-2.5 text-center">สถานะ On-duty</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {previousSkills.map(([key, score]) => {
                                      const wiCode = key.slice(0, key.lastIndexOf('_'));
                                      const typeCode = key.slice(key.lastIndexOf('_') + 1);
                                      const wi = SKILL_WIS.find(w => w.code === wiCode);
                                      const typeObj = wi?.types.find(t => t.code === typeCode);
                                      const isOnDuty = record.assignedSkillsSnapshot?.includes(key);

                                      return (
                                        <tr key={key} className="hover:bg-slate-50/50">
                                          <td className="p-2.5 font-mono font-semibold text-slate-700">{wiCode}</td>
                                          <td className="p-2.5 text-slate-600 max-w-[200px] truncate" title={wi?.name}>{wi?.name ?? wiCode}</td>
                                          <td className="p-2.5 text-slate-600 font-medium">Type {typeCode} {typeObj ? `(${typeObj.label})` : ''}</td>
                                          <td className="p-2.5 text-center">
                                            <LevelBadge level={score} />
                                          </td>
                                          <td className="p-2.5 text-center">
                                            {isOnDuty ? (
                                              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                                มอบหมาย
                                              </span>
                                            ) : (
                                              <span className="text-[10px] text-slate-400">สำรอง</span>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setHistoryTarget(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel / CSV Employee Import Modal */}
      <ExcelImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={(count) => {
          setSuccessMessage(`นำเข้าพนักงานจากไฟล์สำเร็จ ${count} คน`);
          setTimeout(() => setSuccessMessage(''), 4500);
        }}
        existingEmployees={allVisibleEmployees}
      />
    </div>
  );
}
