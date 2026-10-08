import io

with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Add userRole prop
text = text.replace("export default function Approvals() {", "export default function Approvals({ userRole = 'admin' }: { userRole?: string }) {")

# 2. Add Chief dept logic and filter
old_filter = "  const pending = requests.filter(r => r.status === 'pending');"
new_filter = """  const isChief = userRole === 'chief';
  const CHIEF_DEPT = 'QC Section';
  const visibleRequests = isChief 
    ? requests.filter(r => r.department === CHIEF_DEPT)
    : requests;
  const pending = visibleRequests.filter(r => r.status === 'pending');"""
text = text.replace(old_filter, new_filter)

old_history = "  const history = requests.filter(r => r.status !== 'pending');"
text = text.replace(old_history, "  const history = visibleRequests.filter(r => r.status !== 'pending');")

# 3. FlowType & Mock Data
text = text.replace("type FlowType = 'ojt' | 'annual';", "type FlowType = 'ojt' | 'annual' | 'auto_upgrade';")

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
text = text.replace("const expandedApprovalRequests: ApprovalRequest[] = [", mock_insert)

# 4. Badge
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
text = text.replace(old_badge, new_badge)

# 5. Filter Buttons
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
text = text.replace(old_buttons, new_buttons)

# 6. Insert Auto Section
old_annual = "          {/* ANNUAL UPGRADES SECTION */}"
new_auto_section = """          {/* AUTO UPGRADES SECTION */}
          {(flowFilter === 'all' || flowFilter === 'auto_upgrade') && filteredPending.filter(r => r.flowType === 'auto_upgrade').length > 0 && (
            <div className="space-y-3 h-full">
              <div className="flex items-center gap-2 border-b border-emerald-200 pb-2 mt-4 lg:mt-0">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <TrendingUp size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-800">คำขออัตโนมัติ (L1 → L3)</h3>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs font-bold">{filteredPending.filter(r => r.flowType === 'auto_upgrade').length}</span>
              </div>
              
              {filteredPending.filter(r => r.flowType === 'auto_upgrade').map(req => (
                <div key={req.id} className="bg-white rounded-xl border border-emerald-200 shadow-sm p-4 hover:border-emerald-400 hover:shadow-md transition-all relative overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                  
                  <div className="flex items-start justify-between gap-2 mb-3 ml-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User size={14} className="text-slate-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-sm truncate w-full">{req.employee}</div>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className="text-[10px] font-mono text-slate-400">{req.employeeId}</span>
                          <span className="text-[9px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate">{req.department}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-slate-500 flex-shrink-0">
                      <div className="font-bold text-slate-700">{req.submittedAt}</div>
                      <div className="mt-0.5 truncate max-w-[80px]">{req.submittedBy.split(' ')[0]}</div>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-700 mt-2 mb-1 line-clamp-2 leading-snug ml-2">{req.wi} · {req.skillType}</div>

                  <div className="flex items-center gap-1.5 mt-2 flex-wrap justify-center bg-slate-50 border border-slate-100 rounded-lg p-2 mb-3 ml-2">
                    <LevelBadge level={req.currentLevel} />
                    <span className="text-slate-400 font-bold text-[10px]">→</span>
                    <LevelBadge level={req.proposedLevel} />
                  </div>

                  <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100 flex-grow mb-4 flex flex-col ml-2">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase mb-1">ผลประเมินผลงาน</div>
                    <div className="text-[11px] text-slate-700 font-medium leading-relaxed">{req.reason}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-auto ml-2">
                    <button onClick={() => setActionModal({ request: req, action: 'approve' })} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors shadow-xs">
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button onClick={() => setActionModal({ request: req, action: 'reject' })} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors shadow-xs">
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ANNUAL UPGRADES SECTION */}"""
text = text.replace(old_annual, new_auto_section)

# 7. Add Banner for Chief
old_header = "      {/* Header */}"
new_header = """      {/* Header */}
      {isChief && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3 text-blue-800 text-sm font-semibold">
          <span>🏢</span> มุมมอง Chief: แสดงเฉพาะคำขออนุมัติจากแผนก <strong>{CHIEF_DEPT}</strong>
        </div>
      )}"""
text = text.replace(old_header, new_header)


with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Restored functionality and fixed layout")
