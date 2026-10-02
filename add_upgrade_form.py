import io
with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Add states for Upgrade Form
states = """  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Upgrade Form State
  const [isUpgradeFormOpen, setIsUpgradeFormOpen] = useState(false);
  const [upgradeForm, setUpgradeForm] = useState({
    employee: employeesList[0].name,
    employeeId: employeesList[0].id,
    department: employeesList[0].department,
    wi: masterWIs[0].code,
    skillType: masterSkillTypes[masterWIs[0].types[0]],
    currentLevel: '1',
    proposedLevel: '2',
    reason: '',
  });

  const handleUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upgradeForm.reason.trim()) return;
    setIsUpgradeFormOpen(false);
    showToast(`ส่งเรื่องขอเลื่อนระดับทักษะสำเร็จ (รอการอนุมัติ)`);
  };
"""
text = text.replace("  const [isFormOpen, setIsFormOpen] = useState(false);", states)

# 2. Add button
buttons = """            <div className="flex items-center gap-2">
              <button
                onClick={() => { setIsUpgradeFormOpen(true); setIsFormOpen(false); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-lg transition-colors font-semibold shadow-md text-sm"
              >
                <TrendingUp size={18} /> ขอเลื่อนระดับทักษะ (Level Upgrade)
              </button>
              <button
                onClick={() => { handleOpenAddForm(); setIsUpgradeFormOpen(false); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg transition-colors font-semibold shadow-md text-sm"
              >
                <Plus size={18} /> บันทึกผล OJT ใหม่
              </button>
            </div>"""

text = text.replace("""              <button
                onClick={handleOpenAddForm}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg transition-colors font-semibold shadow-md text-sm"
              >
                <Plus size={18} /> บันทึกผล OJT ใหม่
              </button>""", buttons)

# 3. Add the form JSX
form_jsx = """      {/* INLINE FORM: Level Upgrade */}
      {isUpgradeFormOpen && (
        <div className="bg-white rounded-xl border-2 border-purple-500 shadow-xl overflow-hidden transition-all duration-300">
          <div className="bg-purple-50 px-5 py-4 border-b border-purple-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2"><TrendingUp size={18} /> ยื่นเสนอเลื่อนระดับทักษะ (Level Upgrade)</h2>
              <p className="text-xs text-purple-700">Chief ยื่นเรื่องขอเลื่อนระดับ Skill Level ให้พนักงาน โดยอ้างอิงให้ Manager พิจารณา</p>
            </div>
          </div>

          <form onSubmit={handleUpgradeSubmit} className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Employee */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">พนักงาน <span className="text-red-500">*</span></label>
                <select
                  value={upgradeForm.employeeId}
                  onChange={e => {
                    const emp = employeesList.find(x => x.id === e.target.value);
                    if (emp) setUpgradeForm({ ...upgradeForm, employee: emp.name, employeeId: emp.id, department: emp.department });
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 font-semibold"
                >
                  {employeesList.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>

              {/* W/I */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">มาตรฐาน W/I <span className="text-red-500">*</span></label>
                <select
                  value={upgradeForm.wi}
                  onChange={e => {
                    const wi = masterWIs.find(w => w.code === e.target.value);
                    setUpgradeForm({ ...upgradeForm, wi: e.target.value, skillType: wi ? masterSkillTypes[wi.types[0]] : '' });
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 font-semibold"
                >
                  {masterWIs.map(w => <option key={w.code} value={w.code}>{w.code} — {w.name}</option>)}
                </select>
              </div>

              {/* Skill Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">ประเภททักษะ (Skill Type) <span className="text-red-500">*</span></label>
                <select
                  value={upgradeForm.skillType}
                  onChange={e => setUpgradeForm({ ...upgradeForm, skillType: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 font-semibold"
                >
                  {Object.values(masterSkillTypes).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Current Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Level ปัจจุบัน (Read-only)</label>
                <select
                  value={upgradeForm.currentLevel}
                  onChange={e => setUpgradeForm({ ...upgradeForm, currentLevel: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-100 font-bold text-slate-600"
                >
                  {[0, 1, 2, 3].map(l => <option key={l} value={l}>Level {l}</option>)}
                </select>
              </div>

              {/* Proposed Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Level ที่เสนอปรับ <span className="text-red-500">*</span></label>
                <select
                  value={upgradeForm.proposedLevel}
                  onChange={e => setUpgradeForm({ ...upgradeForm, proposedLevel: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 font-bold text-purple-900"
                >
                  {[0, 1, 2, 3].map(l => <option key={l} value={l}>Level {l}</option>)}
                </select>
              </div>

              {/* Reason */}
              <div className="space-y-2 md:col-span-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  เหตุผลและหลักฐานประกอบการเลื่อนระดับทักษะ <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="อธิบายเหตุผล เช่น ปฏิบัติงานอิสระครบ 12 เดือน สามารถสอนพนักงานใหม่ได้ พร้อมแนบผลงาน Q1-Q4..."
                  value={upgradeForm.reason}
                  onChange={e => setUpgradeForm({ ...upgradeForm, reason: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 resize-none text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 mt-4">
              <button
                type="button"
                onClick={() => setIsUpgradeFormOpen(false)}
                className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={!upgradeForm.reason.trim()}
                className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-lg font-semibold text-sm transition-colors shadow-md flex items-center gap-2 disabled:opacity-40"
              >
                <Save size={16} /> ส่งเรื่องขออนุมัติ
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* INLINE FORM: Add/Edit OJT */}
"""
text = text.replace("      {/* INLINE FORM: Add/Edit OJT */}", form_jsx)

# Add TrendingUp import
if "TrendingUp" not in text:
    text = text.replace("import { GraduationCap", "import { TrendingUp, GraduationCap")

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)

