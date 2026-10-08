import io
import re

with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# I will write a regex to replace each card template
# The cards start with:
# <div key={req.id} className="bg-white rounded-xl border ... overflow-hidden">
# and end with:
# </div>
# But regex matching HTML is tricky. I'll define a replacement function.

def get_card_template(color_name):
    # color_name: 'blue', 'emerald', 'purple'
    
    ref_badge = "{req.ojtRef && <div className=\"mt-1.5\"><span className=\"text-[10px] font-mono text-" + color_name + "-600 bg-" + color_name + "-50 border border-" + color_name + "-200 px-2 py-0.5 rounded\">อ้างอิง: {req.ojtRef}</span></div>}" if color_name == 'blue' else ""
    
    if color_name == 'emerald':
        reason_title = "ผลประเมินผลงาน (ส่งตรงจากระบบ)"
    elif color_name == 'purple':
        reason_title = "เหตุผล / หลักฐานประกอบ (ANNUAL)"
    else:
        reason_title = "เหตุผล / หลักฐานประกอบ"

    reject_text = "Reject (ไม่อนุมัติ)" if color_name == 'emerald' else "Reject (ปฏิเสธ)"
    return_btn = f"""<button onClick={{() => setActionModal({{ request: req, action: 'return' }})}} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                        <RotateCcw size={{14}} /> ส่งกลับ
                      </button>""" if color_name != 'emerald' else ""

    return f"""<div key={{req.id}} className="bg-white rounded-xl border border-{color_name}-200 shadow-sm p-4 hover:border-{color_name}-400 hover:shadow-md transition-all relative overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-{color_name}-500"></div>
                  
                  {/* Header: User & Date */}
                  <div className="flex items-start justify-between gap-3 mb-3 ml-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <User size={{16}} className="text-slate-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-sm truncate">{{req.employee}}</div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-mono text-slate-400">{{req.employeeId}}</span>
                          <span className="text-[9px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate">{{req.department}}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 text-[9px] text-slate-500">
                      <div className="font-bold text-slate-700">{{req.submittedAt}}</div>
                      <div className="mt-0.5 max-w-[90px] truncate">{{"ผู้ยื่น: " + req.submittedBy}}</div>
                    </div>
                  </div>

                  {/* WI & Skill */}
                  <div className="mb-3 ml-2">
                    <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{{req.wi}} · {{req.skillType}}</div>
                    {ref_badge}
                  </div>

                  {/* Level Change */}
                  <div className="flex flex-wrap items-center gap-2 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100 justify-center ml-2">
                    <LevelBadge level={{req.currentLevel}} />
                    <span className="text-slate-300 font-bold">→</span>
                    <LevelBadge level={{req.proposedLevel}} />
                  </div>

                  {/* Reason Block */}
                  <div className="bg-{color_name}-50/40 rounded-lg p-3 border border-{color_name}-100 mb-4 flex-grow ml-2">
                    <div className="text-[10px] font-bold text-{color_name}-800 uppercase mb-1">{reason_title}</div>
                    <div className="text-[11px] text-slate-700 font-medium leading-relaxed">{{req.reason}}</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-auto ml-2">
                    <button onClick={{() => setActionModal({{ request: req, action: 'approve' }})}} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs">
                      <CheckCircle size={{14}} /> Approve
                    </button>
                    <button onClick={{() => setActionModal({{ request: req, action: 'reject' }})}} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors shadow-xs">
                      <XCircle size={{14}} /> {reject_text}
                    </button>
                    {return_btn}
                  </div>
                </div>"""

# Replace the maps
# OJT
start_ojt = text.find("{filteredPending.filter(r => r.flowType === 'ojt').map(req => (")
end_ojt = text.find("            </div>", start_ojt)
new_ojt = "{filteredPending.filter(r => r.flowType === 'ojt').map(req => (\n" + get_card_template('blue') + "\n              ))}\n"
text = text[:start_ojt] + new_ojt + text[end_ojt:]

# Auto Upgrade
start_auto = text.find("{filteredPending.filter(r => r.flowType === 'auto_upgrade').map(req => (")
end_auto = text.find("            </div>", start_auto)
new_auto = "{filteredPending.filter(r => r.flowType === 'auto_upgrade').map(req => (\n" + get_card_template('emerald') + "\n              ))}\n"
text = text[:start_auto] + new_auto + text[end_auto:]

# Annual
start_annual = text.find("{filteredPending.filter(r => r.flowType === 'annual').map(req => (")
end_annual = text.find("            </div>", start_annual)
new_annual = "{filteredPending.filter(r => r.flowType === 'annual').map(req => (\n" + get_card_template('purple') + "\n              ))}\n"
text = text[:start_annual] + new_annual + text[end_annual:]

# Fix LevelBadge style to be slightly more compact if needed
text = text.replace("px-2.5 py-1", "px-2 py-0.5")

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Updated Approvals cards layout")
