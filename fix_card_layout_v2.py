import io

with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    text = f.read()

def get_card_template(color_name):
    ref_badge = "{req.ojtRef && <div className=\"mt-1.5\"><span className=\"text-[10px] font-mono text-" + color_name + "-600 bg-" + color_name + "-50 border border-" + color_name + "-200 px-2 py-0.5 rounded\">อ้างอิง: {req.ojtRef}</span></div>}" if color_name == 'blue' else ""
    reason_title = "ผลประเมินผลงาน (ส่งตรงจากระบบ)" if color_name == 'emerald' else ("เหตุผล / หลักฐานประกอบ (ANNUAL)" if color_name == 'purple' else "เหตุผล / หลักฐานประกอบ")
    reject_text = "Reject"
    return_btn = f"""<button onClick={{() => setActionModal({{ request: req, action: 'return' }})}} className="flex items-center justify-center gap-1 px-2 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold transition-colors">
                        <RotateCcw size={{14}} />
                      </button>""" if color_name != 'emerald' else ""

    return f"""<div key={{req.id}} className="bg-white rounded-xl border border-{color_name}-200 shadow-sm p-4 hover:border-{color_name}-400 hover:shadow-md transition-all relative overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-1 h-full bg-{color_name}-500"></div>
                  
                  <div className="flex items-start justify-between gap-3 mb-3 ml-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <User size={{14}} className="text-slate-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-sm truncate">{{req.employee}}</div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-slate-400">{{req.employeeId}}</span>
                          <span className="text-[9px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate">{{req.department}}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 text-[10px] text-slate-500">
                      <div className="font-bold text-slate-700">{{req.submittedAt}}</div>
                      <div className="mt-0.5 truncate max-w-[80px]">{{req.submittedBy.split(' ')[0]}}</div>
                    </div>
                  </div>

                  <div className="mb-3 ml-2">
                    <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{{req.wi}} · {{req.skillType}}</div>
                    {ref_badge}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100 justify-center ml-2">
                    <LevelBadge level={{req.currentLevel}} />
                    <span className="text-slate-400 font-bold text-[10px]">→</span>
                    <LevelBadge level={{req.proposedLevel}} />
                  </div>

                  <div className="bg-{color_name}-50/40 rounded-lg p-3 border border-{color_name}-100 mb-4 flex-grow ml-2 flex flex-col">
                    <div className="text-[10px] font-bold text-{color_name}-800 uppercase mb-1">{reason_title}</div>
                    <div className="text-[11px] text-slate-700 font-medium leading-relaxed">{{req.reason}}</div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-auto ml-2">
                    <button onClick={{() => setActionModal({{ request: req, action: 'approve' }})}} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors shadow-xs">
                      <CheckCircle size={{14}} /> Approve
                    </button>
                    <button onClick={{() => setActionModal({{ request: req, action: 'reject' }})}} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors shadow-xs">
                      <XCircle size={{14}} /> {reject_text}
                    </button>
                    {return_btn}
                  </div>
                </div>"""

start_ojt = text.find("{filteredPending.filter(r => r.flowType === 'ojt').map(req => (")
end_ojt = text.find("            </div>", start_ojt)
new_ojt = "{filteredPending.filter(r => r.flowType === 'ojt').map(req => (\n" + get_card_template('blue') + "\n              ))}\n"
text = text[:start_ojt] + new_ojt + text[end_ojt:]

start_auto = text.find("{filteredPending.filter(r => r.flowType === 'auto_upgrade').map(req => (")
end_auto = text.find("            </div>", start_auto)
new_auto = "{filteredPending.filter(r => r.flowType === 'auto_upgrade').map(req => (\n" + get_card_template('emerald') + "\n              ))}\n"
text = text[:start_auto] + new_auto + text[end_auto:]

start_annual = text.find("{filteredPending.filter(r => r.flowType === 'annual').map(req => (")
end_annual = text.find("            </div>", start_annual)
new_annual = "{filteredPending.filter(r => r.flowType === 'annual').map(req => (\n" + get_card_template('purple') + "\n              ))}\n"
text = text[:start_annual] + new_annual + text[end_annual:]

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Updated Approvals cards layout correctly")
