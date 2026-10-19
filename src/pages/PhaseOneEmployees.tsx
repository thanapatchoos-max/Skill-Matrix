import { FilterBar } from '../components/FilterBar';
import { useState, useRef } from 'react';
import { Users, Plus, X, Upload, Trash2 } from 'lucide-react';
import { bangkokYear, employeesForYear, SKILL_DEPARTMENTS, SKILL_WIS, sumSkills, visibleEmployees } from '../data/phase1Core';
import { saveSkillEmployee, useSkillState } from '../data/phase1Store';
import { buttonClass, Field, inputClass, panelClass } from '../components/Phase1Shared';
import { Pagination } from '../components/Pagination';
import { Avatar, compressImage } from '../components/Avatar';

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
    } catch (e) {
      setError((e as Error).message);
    }
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
        )}
      </div>

      <p className="text-sm text-slate-500">
        คะแนนพนักงานปรับผ่านหัวหน้างานและการอนุมัติ · พนักงานใหม่เริ่มที่ Level 0
      </p>

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
              <th className="p-4"></th>
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
                  <td className="p-4">{e.position}</td>
                  <td className="p-4">{e.department}</td>
                  <td className="p-4 text-right font-bold text-blue-800">{sumSkills(e)}</td>
                  <td className="p-4">
                    {userRole === 'admin' && (
                      <button
                        className="text-blue-700 hover:underline font-medium"
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
                        แก้ไขข้อมูล
                      </button>
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
    </div>
  );
}
