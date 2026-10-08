import io

# ==========================================
# 1. Update SkillEvaluation.tsx
# ==========================================
with io.open("src/pages/SkillEvaluation.tsx", "r", encoding="utf-8") as f:
    eval_text = f.read()

# Add toast state
old_state = "  const [isFormOpen, setIsFormOpen] = useState(false);"
new_state = """  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };"""
eval_text = eval_text.replace(old_state, new_state)

# Add toast UI just inside the root div
old_root = """    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
      <div className="mb-8">"""
new_root = """    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
      <div className="mb-8">"""
eval_text = eval_text.replace(old_root, new_root)

# Update handleChiefApprove
old_approve = """  const handleChiefApprove = (id: string) => {
    setEvaluations(evals => evals.map(e => e.id === id ? { ...e, status: 'pending_manager' } : e));
  };"""
new_approve = """  const handleChiefApprove = (id: string) => {
    setEvaluations(evals => evals.map(e => e.id === id ? { ...e, status: 'pending_manager' } : e));
    showToast('ตรวจสอบผลสำเร็จ! ส่งคำขอเลื่อนระดับอัตโนมัติไปยัง Manager เรียบร้อยแล้ว');
  };"""
eval_text = eval_text.replace(old_approve, new_approve)

with io.open("src/pages/SkillEvaluation.tsx", "w", encoding="utf-8") as f:
    f.write(eval_text)
print("SkillEvaluation updated")

# ==========================================
# 2. Update Approvals.tsx
# ==========================================
with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    appr_text = f.read()

# FlowType
appr_text = appr_text.replace("type FlowType = 'ojt' | 'annual';", "type FlowType = 'ojt' | 'annual' | 'auto_upgrade';")

# expandedApprovalRequests injection
mock_insert = """const expandedApprovalRequests: ApprovalRequest[] = [
  {
    id: 'APR-AUTO-001', flowType: 'auto_upgrade',
    employee: 'นายสมชาย ใจดี', employeeId: 'EMP001', department: 'QC Section',
    wi: 'QCW001-001', skillType: 'A - Circuit Connecting',
    currentLevel: 1, proposedLevel: 2,
    reason: 'จำนวนงาน 24/20, ของเสีย 0% (เป้า <5%) — ผ่านเกณฑ์อัตโนมัติ',
    submittedBy: 'นางสาวอรุณี รักดี (Chief)',
    submittedAt: new Date().toISOString().slice(0, 10), status: 'pending',
  },
  {
    id: 'APR-AUTO-002', flowType: 'auto_upgrade',
    employee: 'นางสาวแนน สุขใจ', employeeId: 'EMP002', department: 'QC Section',
    wi: 'ENG-M-001', skillType: 'B - Machine Operator',
    currentLevel: 2, proposedLevel: 3,
    reason: 'จำนวนงาน 35/20, ของเสีย 0.5% (เป้า <1%) — ผ่านเกณฑ์อัตโนมัติ',
    submittedBy: 'นางสาวอรุณี รักดี (Chief)',
    submittedAt: new Date().toISOString().slice(0, 10), status: 'pending',
  },"""
appr_text = appr_text.replace("const expandedApprovalRequests: ApprovalRequest[] = [", mock_insert)

# FlowTypeBadge
old_badge = """  const FlowTypeBadge = ({ type }: { type: FlowType }) => (
    type === 'ojt'
      ? <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full border border-blue-200"><GraduationCap size={12} /> OJT (Level 0→1)</span>
      : <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-full border border-purple-200"><TrendingUp size={12} /> เลื่อนระดับทักษะ (Level Upgrade)</span>
  );"""
new_badge = """  const FlowTypeBadge = ({ type }: { type: FlowType }) => {
    if (type === 'ojt') return <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full border border-blue-200"><GraduationCap size={12} /> OJT (Level 0→1)</span>;
    if (type === 'annual') return <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-full border border-purple-200"><TrendingUp size={12} /> เลื่อนระดับทักษะ (Level Upgrade)</span>;
    return <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200"><TrendingUp size={12} /> อัตโนมัติ (Auto Upgrade)</span>;
  };"""
appr_text = appr_text.replace(old_badge, new_badge)

# filter buttons
old_buttons = """        <div className="flex gap-1.5 w-full md:w-auto">
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
        </div>"""
new_buttons = """        <div className="flex gap-1.5 w-full md:w-auto">
          {(['all', 'ojt', 'annual', 'auto_upgrade'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFlowFilter(f); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                flowFilter === f 
                  ? 'bg-[#0a2540] text-white border-[#0a2540]' 
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {f === 'all' ? 'ทุกประเภท' : f === 'ojt' ? '🎓 OJT' : f === 'annual' ? '📈 ประจำปี' : '⚡ อัตโนมัติ'}
            </button>
          ))}
        </div>"""
appr_text = appr_text.replace(old_buttons, new_buttons)

# Add the AUTO UPGRADE section below OJT
old_annual = "          {/* ANNUAL UPGRADES SECTION */}"
new_auto_section = """          {/* AUTO UPGRADES SECTION */}
          {(flowFilter === 'all' || flowFilter === 'auto_upgrade') && filteredPending.filter(r => r.flowType === 'auto_upgrade').length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-emerald-200 pb-2 mt-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <TrendingUp size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-800">คำขอเลื่อนระดับอัตโนมัติ (Auto Upgrade L1 → L3)</h3>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs font-bold">{filteredPending.filter(r => r.flowType === 'auto_upgrade').length} รายการ</span>
              </div>
              
              {filteredPending.filter(r => r.flowType === 'auto_upgrade').map(req => (
                <div key={req.id} className="bg-white rounded-xl border border-emerald-200 shadow-sm p-5 space-y-4 hover:border-emerald-400 hover:shadow-md transition-all relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
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
                      <div className="mt-1 text-slate-400">ตรวจสอบโดย: {req.submittedBy}</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 rounded-lg p-3.5 border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-800 uppercase mb-1">ผลประเมินผลงาน (ส่งตรงจากระบบ)</div>
                    <div className="text-xs text-slate-700 font-medium leading-relaxed">{req.reason}</div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button onClick={() => setActionModal({ request: req, action: 'approve' })} className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs">
                      <CheckCircle size={15} /> Approve (อนุมัติ)
                    </button>
                    <button onClick={() => setActionModal({ request: req, action: 'reject' })} className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors shadow-xs">
                      <XCircle size={15} /> Reject (ไม่อนุมัติ)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ANNUAL UPGRADES SECTION */}"""
appr_text = appr_text.replace(old_annual, new_auto_section)

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(appr_text)
print("Approvals updated")
