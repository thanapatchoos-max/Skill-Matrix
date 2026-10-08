import io
import re

with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Update FlowType & Mock Data (Restore from my previous turn)
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

# 2. Add Chief filter & auto_upgrade to components
old_badge = """  const FlowTypeBadge = ({ type }: { type: FlowType }) => (
    type === 'ojt'
      ? <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full border border-blue-200"><GraduationCap size={12} /> OJT (Level 0→1)</span>
      : <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-full border border-purple-200"><TrendingUp size={12} /> เลื่อนระดับทักษะ (Level Upgrade)</span>
  );"""
new_badge = """  const FlowTypeBadge = ({ type }: { type: FlowType }) => {
    if (type === 'ojt') return <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200"><GraduationCap size={10} /> OJT (L0→1)</span>;
    if (type === 'annual') return <span className="inline-flex items-center gap-1 text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-200"><TrendingUp size={10} /> ประจำปี</span>;
    return <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200"><TrendingUp size={10} /> อัตโนมัติ</span>;
  };"""
text = text.replace(old_badge, new_badge)

# Role check
text = text.replace("export default function Approvals() {", "export default function Approvals({ userRole = 'admin' }: { userRole?: string }) {")
text = text.replace("const [activeTab", "const isChief = userRole === 'chief';\n  const CHIEF_DEPT = 'QC Section';\n  const [activeTab")

old_pending = "const pending = requests.filter(r => r.status === 'pending');"
new_pending = """const visibleRequests = isChief ? requests.filter(r => r.department === CHIEF_DEPT) : requests;
  const pending = visibleRequests.filter(r => r.status === 'pending');"""
text = text.replace(old_pending, new_pending)
text = text.replace("const history = requests.filter(r => r.status !== 'pending');", "const history = visibleRequests.filter(r => r.status !== 'pending');")


# 3. Define the shared Card component outside the render
card_component = """
  const ApprovalCard = ({ req, theme }: { req: ApprovalRequest, theme: 'blue' | 'emerald' | 'purple' }) => {
    const isOjt = theme === 'blue';
    const isAuto = theme === 'emerald';
    const isAnnual = theme === 'purple';
    
    return (
      <div className={`bg-white rounded-xl border border-${theme}-200 shadow-sm p-4 hover:border-${theme}-400 hover:shadow-md transition-all relative overflow-hidden h-full flex flex-col`}>
        <div className={`absolute top-0 left-0 w-1.5 h-full bg-${theme}-500`}></div>
        <div className="flex items-start justify-between gap-2 ml-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <User size={14} className="text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-slate-800 text-sm truncate">{req.employee}</span>
                <span className="text-[10px] font-mono text-slate-400">{req.employeeId}</span>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{req.department}</span>
              </div>
              {req.ojtRef && <div className="mt-1"><span className={`text-[10px] font-mono text-${theme}-600 bg-${theme}-50 border border-${theme}-200 px-2 py-0.5 rounded`}>อ้างอิง: {req.ojtRef}</span></div>}
            </div>
          </div>
          <div className="text-right text-[10px] text-slate-500 flex-shrink-0">
            <div className="font-medium text-slate-600">{req.submittedAt}</div>
            <div className="mt-1 text-slate-400 truncate max-w-[80px]">{req.submittedBy}</div>
          </div>
        </div>

        <div className="text-[11px] font-bold text-slate-700 mt-3 mb-1 line-clamp-2 leading-snug ml-2">{req.wi} · {req.skillType}</div>
        
        <div className="flex items-center gap-1.5 mt-2 flex-wrap justify-center bg-slate-50 border border-slate-100 rounded-lg p-2 mb-3 ml-2">
          <LevelBadge level={req.currentLevel} />
          <span className="text-slate-400 font-bold text-[10px]">→</span>
          <LevelBadge level={req.proposedLevel} />
        </div>

        <div className={`bg-${theme}-50/50 rounded-lg p-3 border border-${theme}-100 flex-grow flex flex-col ml-2 mb-4`}>
          <div className={`text-[10px] font-bold text-${theme}-800 uppercase mb-1`}>
            {isAuto ? 'ผลประเมินผลงาน (ส่งตรงจากระบบ)' : isAnnual ? 'เหตุผล / หลักฐานประกอบ (ANNUAL)' : 'เหตุผล / หลักฐานประกอบ'}
          </div>
          <div className="text-[11px] text-slate-700 font-medium leading-relaxed">{req.reason}</div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-auto ml-2">
          <button onClick={() => setActionModal({ request: req, action: 'approve' })} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors shadow-xs">
            <CheckCircle size={14} /> Approve
          </button>
          <button onClick={() => setActionModal({ request: req, action: 'reject' })} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors shadow-xs">
            <XCircle size={14} /> Reject
          </button>
          {!isAuto && (
            <button onClick={() => setActionModal({ request: req, action: 'return' })} className="flex-none flex items-center justify-center gap-1 px-2 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold transition-colors">
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>
    );
  };
"""

# Insert ApprovalCard before return
text = text.replace("return (", card_component + "\n  return (")

# Fix Filter Buttons
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
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
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

# Rebuild Pending View with row-by-row Grid logic
old_pending_list = """      {/* PENDING CARDS LIST */}
      {activeTab === 'pending' && (
        <div className="space-y-4">"""

grid_logic = """      {/* PENDING CARDS LIST */}
      {activeTab === 'pending' && (() => {
        const ojtList = filteredPending.filter(r => r.flowType === 'ojt');
        const autoList = filteredPending.filter(r => r.flowType === 'auto_upgrade');
        const annualList = filteredPending.filter(r => r.flowType === 'annual');
        const maxRows = Math.max(ojtList.length, autoList.length, annualList.length);
        const gridRows = Array.from({ length: maxRows }, (_, i) => i);

        return (
          <div className="w-full">
            {filteredPending.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 mb-6">
                <CheckCircle size={36} className="mx-auto mb-3 text-emerald-400" />
                <p className="font-semibold text-slate-600">ไม่มีรายการรออนุมัติในขณะนี้</p>
              </div>
            )}
            
            {flowFilter === 'all' && filteredPending.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4">
                {/* Headers */}
                <div className="border-b border-blue-200 pb-2 mb-2 flex items-center gap-2 hidden lg:flex">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700"><GraduationCap size={16} /></div>
                  <h3 className="text-xs font-bold text-slate-800">คำขออนุมัติผ่าน OJT</h3>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold">{ojtList.length} รายการ</span>
                </div>
                <div className="border-b border-emerald-200 pb-2 mb-2 flex items-center gap-2 hidden lg:flex">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700"><TrendingUp size={16} /></div>
                  <h3 className="text-xs font-bold text-slate-800">คำขอเลื่อนระดับอัตโนมัติ</h3>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold">{autoList.length} รายการ</span>
                </div>
                <div className="border-b border-purple-200 pb-2 mb-2 flex items-center gap-2 hidden lg:flex">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700"><TrendingUp size={16} /></div>
                  <h3 className="text-xs font-bold text-slate-800">คำขอเลื่อนระดับทักษะประจำปี</h3>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold">{annualList.length} รายการ</span>
                </div>

                {/* Rows mapping - guarantees horizontal alignment! */}
                {gridRows.map(rowIndex => (
                  <React.Fragment key={rowIndex}>
                    <div className="h-full">{ojtList[rowIndex] ? <ApprovalCard req={ojtList[rowIndex]} theme="blue" /> : null}</div>
                    <div className="h-full">{autoList[rowIndex] ? <ApprovalCard req={autoList[rowIndex]} theme="emerald" /> : null}</div>
                    <div className="h-full">{annualList[rowIndex] ? <ApprovalCard req={annualList[rowIndex]} theme="purple" /> : null}</div>
                  </React.Fragment>
                ))}
              </div>
            )}

            {flowFilter !== 'all' && filteredPending.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPending.map(req => (
                  <ApprovalCard key={req.id} req={req} theme={req.flowType === 'ojt' ? 'blue' : req.flowType === 'auto_upgrade' ? 'emerald' : 'purple'} />
                ))}
              </div>
            )}
          </div>
        );
      })()}"""

# We must replace from {/* PENDING CARDS LIST */} down to the {activeTab === 'history'
start_idx = text.find("{/* PENDING CARDS LIST */}")
end_idx = text.find("{/* HISTORY / AUDIT TRAIL TABLE WITH PAGINATION */}")
text = text[:start_idx] + grid_logic + "\n\n      " + text[end_idx:]

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Row-by-row Grid applied perfectly")
