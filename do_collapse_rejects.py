import io
import re

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Add state for toggling rejected list
state_str = "const [practical, setPractical] = useState('');\n  const [showRejected, setShowRejected] = useState(false);"
if "const [showRejected, setShowRejected]" not in text:
    text = text.replace("const [practical, setPractical] = useState('');", state_str)

# Replace the rejected block with a collapsible one
old_rejected_block = """          {/* REJECTED SECTION (Only visible if there are rejected items) */}
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
          )}"""

new_rejected_block = """          {/* REJECTED SECTION (Collapsible) */}
          {rejectedTableData.length > 0 && (
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setShowRejected(!showRejected)}
                className="self-start px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <AlertCircle size={16}/> มีรายการที่ถูกเลื่อน/ปฏิเสธจำนวน {rejectedTableData.length} รายการ (คลิกเพื่อดู/แก้ไข)
              </button>
              
              {showRejected && (
                <div className="bg-rose-50 rounded-xl border border-rose-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 space-y-3">
                    {rejectedTableData.map(r => (
                      <div key={r.id} className="bg-white border border-rose-200 rounded-lg p-3 shadow-sm flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{r.employee}</div>
                          <div className="text-xs text-slate-500">{r.wi}</div>
                          <div className="mt-2 text-[11px] font-bold text-rose-600 bg-rose-50 p-1.5 rounded border border-rose-100">เหตุผล: {r.rejectReason}</div>
                        </div>
                        {(!isManager) && (
                          <button onClick={() => { setSelectedReq(r); setFormDate(r.requestedDate); setActiveModal('request'); setShowRejected(false); }} className="flex-shrink-0 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold transition-colors">
                            แก้ไข / ส่งใหม่
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}"""

text = text.replace(old_rejected_block, new_rejected_block)

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)

