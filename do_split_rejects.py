import io
import re

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Fix the Submit Request button visibility. Make it visible for everyone except Manager (or just everyone for demo).
btn_old = """        <div>
          {isStaff && (
            <button 
              onClick={() => { setSelectedReq(null); setFormDate(''); setActiveModal('request'); }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 font-bold text-sm"
            >
              <Plus size={18} /> ยื่นคำขอฝึกอบรม
            </button>
          )}
        </div>"""

btn_new = """        <div>
          {(!isManager) && (
            <button 
              onClick={() => { setSelectedReq(null); setFormDate(''); setActiveModal('request'); }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 font-bold text-sm"
            >
              <Plus size={18} /> ยื่นคำขอฝึกอบรม (New Request)
            </button>
          )}
        </div>"""

text = text.replace(btn_old, btn_new)

# 2. Separate Rejected items into a distinct UI block.
# Currently we have requestTableData which includes pending and rejected.
table1_def = """  const requestTableData = requests.filter(r => r.status === 'pending_request' || r.status === 'rejected_request');
  const executionTableData = requests.filter(r => r.status !== 'pending_request' && r.status !== 'rejected_request');"""

table1_new_def = """  const pendingTableData = requests.filter(r => r.status === 'pending_request');
  const rejectedTableData = requests.filter(r => r.status === 'rejected_request');
  const executionTableData = requests.filter(r => r.status !== 'pending_request' && r.status !== 'rejected_request');"""

text = text.replace(table1_def, table1_new_def)

# Now, replace the entire TABLE 1 block to include a Rejected Section.
old_table1_block = """        {/* TABLE 1: REQUESTS */}
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-blue-200 bg-blue-50">
            <h3 className="font-bold text-blue-900 flex items-center gap-2"><ClipboardList size={18}/> 1. ตารางคำขอฝึกอบรม (Requests)</h3>
            <p className="text-xs text-blue-700 mt-1">รายการรอยืนยันวันอบรม หรือถูกปฏิเสธให้เปลี่ยนวัน</p>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wide">
                <tr><th className="px-4 py-3">ข้อมูลคำขอ</th><th className="px-4 py-3">สถานะ</th><th className="px-4 py-3 text-center">จัดการ</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requestTableData.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-8 text-slate-400">ไม่มีรายการคำขอ</td></tr>
                ) : requestTableData.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{r.employee}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{r.wi} &middot; {r.skillType}</div>
                      <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs mt-1.5"><Calendar size={12}/> เสนอวันที่: {r.requestedDate}</div>
                    </td>
                    <td className="px-4 py-3">
                      {r.status === 'pending_request' ? (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[11px] font-bold border border-amber-200">รออนุมัติวัน</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[11px] font-bold border border-rose-200">ถูกปฏิเสธ</span>
                          <span className="text-[10px] text-rose-500 leading-tight line-clamp-2" title={r.rejectReason}>{r.rejectReason}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {isStaff && r.status === 'rejected_request' && (
                          <button onClick={() => { setSelectedReq(r); setFormDate(r.requestedDate); setActiveModal('request'); }} className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold w-full transition-colors">แก้ไข / ส่งใหม่</button>
                        )}
                        {isChief && r.status === 'pending_request' && (
                          <>
                            <button onClick={() => handleAcceptSchedule(r.id)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold w-full transition-colors flex justify-center gap-1"><CheckCircle size={14}/> ยืนยัน</button>
                            <button onClick={() => { setSelectedReq(r); setFormRejectReason(''); setActiveModal('reject'); }} className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold w-full transition-colors flex justify-center gap-1"><XCircle size={14}/> เลื่อน</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>"""

new_table1_block = """        {/* TABLE 1: REQUESTS & REJECTS */}
        <div className="flex flex-col gap-6">
          
          {/* REJECTED SECTION (Only visible if there are rejected items) */}
          {rejectedTableData.length > 0 && (
            <div className="bg-rose-50 rounded-xl border border-rose-200 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-rose-200 bg-rose-100/50 flex items-center justify-between">
                <h3 className="font-bold text-rose-900 flex items-center gap-2"><AlertCircle size={16}/> รายการคำขอที่ถูกปฏิเสธ (ต้องแก้ไขวันใหม่)</h3>
              </div>
              <div className="p-3 space-y-3">
                {rejectedTableData.map(r => (
                  <div key={r.id} className="bg-white border border-rose-200 rounded-lg p-3 shadow-sm flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{r.employee}</div>
                      <div className="text-xs text-slate-500">{r.wi}</div>
                      <div className="mt-2 text-[11px] font-bold text-rose-600 bg-rose-50 p-1.5 rounded border border-rose-100">เหตุผล: {r.rejectReason}</div>
                    </div>
                    {(!isManager) && (
                      <button onClick={() => { setSelectedReq(r); setFormDate(r.requestedDate); setActiveModal('request'); }} className="flex-shrink-0 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold transition-colors">
                        แก้ไข / ส่งใหม่
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PENDING REQUESTS TABLE */}
          <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden flex flex-col flex-1">
            <div className="p-4 border-b border-blue-200 bg-blue-50">
              <h3 className="font-bold text-blue-900 flex items-center gap-2"><ClipboardList size={18}/> 1. ตารางคำขอฝึกอบรม (Pending Requests)</h3>
              <p className="text-xs text-blue-700 mt-1">รายการรอยืนยันวันอบรมจาก Chief</p>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wide">
                  <tr><th className="px-4 py-3">ข้อมูลคำขอ</th><th className="px-4 py-3 text-center">จัดการ (Chief)</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingTableData.length === 0 ? (
                    <tr><td colSpan={2} className="text-center py-8 text-slate-400">ไม่มีคำขอใหม่</td></tr>
                  ) : pendingTableData.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{r.employee}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{r.wi} &middot; {r.skillType}</div>
                        <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs mt-1.5"><Calendar size={12}/> เสนอวันที่: {r.requestedDate}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-2">
                          {isChief ? (
                            <>
                              <button onClick={() => handleAcceptSchedule(r.id)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold w-full transition-colors flex justify-center gap-1"><CheckCircle size={14}/> ยืนยันรับนัด</button>
                              <button onClick={() => { setSelectedReq(r); setFormRejectReason(''); setActiveModal('reject'); }} className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold w-full transition-colors flex justify-center gap-1"><XCircle size={14}/> ปฏิเสธ/เลื่อน</button>
                            </>
                          ) : (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[11px] font-bold border border-amber-200">รอ Chief อนุมัติ</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>"""

# Replace the block using standard python string replace
if old_table1_block in text:
    text = text.replace(old_table1_block, new_table1_block)
else:
    print("Could not find old table 1 block to replace")

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)

