import io

with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    text = f.read()

start_block = text.find("{/* PENDING CARDS LIST */}")
end_block = text.find("{/* HISTORY / AUDIT TRAIL TABLE WITH PAGINATION */}")

if start_block == -1 or end_block == -1:
    print("Markers not found")
else:
    new_pending_block = """      {/* PENDING CARDS LIST */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          {filteredPending.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <CheckCircle size={36} className="mx-auto mb-3 text-emerald-400" />
              <p className="font-semibold text-slate-600">ไม่มีรายการรออนุมัติในขณะนี้</p>
            </div>
          )}

          {/* OJT APPROVALS SECTION */}
          {(flowFilter === 'all' || flowFilter === 'ojt') && filteredPending.filter(r => r.flowType === 'ojt').length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-blue-200 pb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                  <GraduationCap size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-800">คำขออนุมัติผ่าน OJT (Level 0 → 1)</h3>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs font-bold">{filteredPending.filter(r => r.flowType === 'ojt').length} รายการ</span>
              </div>
              
              {filteredPending.filter(r => r.flowType === 'ojt').map(req => (
                <div key={req.id} className="bg-white rounded-xl border border-blue-200 shadow-sm p-5 space-y-4 hover:border-blue-400 hover:shadow-md transition-all relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
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
                          {req.ojtRef && <span className="text-xs font-mono text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">อ้างอิง: {req.ojtRef}</span>}
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
                      <div className="mt-1 text-slate-400">{req.submittedBy}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                    <div className="text-xs font-bold text-slate-600 uppercase mb-1">เหตุผล / หลักฐานประกอบ</div>
                    <div className="text-xs text-slate-700 font-medium leading-relaxed">{req.reason}</div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button onClick={() => setActionModal({ request: req, action: 'approve' })} className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs">
                      <CheckCircle size={15} /> Approve (อนุมัติ)
                    </button>
                    <button onClick={() => setActionModal({ request: req, action: 'reject' })} className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors shadow-xs">
                      <XCircle size={15} /> Reject (ปฏิเสธ)
                    </button>
                    <button onClick={() => setActionModal({ request: req, action: 'return' })} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                      <RotateCcw size={15} /> ส่งกลับแก้ไข
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ANNUAL UPGRADES SECTION */}
          {(flowFilter === 'all' || flowFilter === 'annual') && filteredPending.filter(r => r.flowType === 'annual').length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-purple-200 pb-2 mt-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                  <TrendingUp size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-800">คำขอเลื่อนระดับทักษะประจำปี (Level Upgrade)</h3>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs font-bold">{filteredPending.filter(r => r.flowType === 'annual').length} รายการ</span>
              </div>
              
              {filteredPending.filter(r => r.flowType === 'annual').map(req => (
                <div key={req.id} className="bg-white rounded-xl border border-purple-200 shadow-sm p-5 space-y-4 hover:border-purple-400 hover:shadow-md transition-all relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
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
                      <div className="mt-1 text-slate-400">{req.submittedBy}</div>
                    </div>
                  </div>

                  <div className="bg-purple-50/50 rounded-lg p-3.5 border border-purple-100">
                    <div className="text-xs font-bold text-purple-800 uppercase mb-1">เหตุผล / หลักฐานประกอบ (Annual)</div>
                    <div className="text-xs text-slate-700 font-medium leading-relaxed">{req.reason}</div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button onClick={() => setActionModal({ request: req, action: 'approve' })} className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs">
                      <CheckCircle size={15} /> Approve (อนุมัติ)
                    </button>
                    <button onClick={() => setActionModal({ request: req, action: 'reject' })} className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors shadow-xs">
                      <XCircle size={15} /> Reject (ปฏิเสธ)
                    </button>
                    <button onClick={() => setActionModal({ request: req, action: 'return' })} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                      <RotateCcw size={15} /> ส่งกลับแก้ไข
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      """
    
    new_text = text[:start_block] + new_pending_block + text[end_block:]

    with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
        f.write(new_text)
    print("Approvals UI updated successfully")
