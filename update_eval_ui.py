import io
import re

with io.open("src/pages/SkillEvaluation.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Make the table more data-driven looking and clarify the source.
new_auto_evaluations = """const autoEvaluations = [
  { id: 'EVAL-001', employee: 'นายสมชาย ใจดี', employeeId: 'EMP001', dept: 'QC Section', wi: 'QCW001-001', skillType: 'A - Circuit Connecting', currentLevel: 1, proposedLevel: 2, jobsDone: 24, jobTarget: 20, reworkPercent: 0, reworkTarget: 5, status: 'System Proposed' },
  { id: 'EVAL-002', employee: 'นางสาวแนน สุขใจ', employeeId: 'EMP005', dept: 'Engineering', wi: 'ENG-M-001', skillType: 'B - Machine Operator', currentLevel: 2, proposedLevel: 3, jobsDone: 35, jobTarget: 20, reworkPercent: 0.5, reworkTarget: 1, status: 'System Proposed' },
  { id: 'EVAL-003', employee: 'นายกฤต พร้อมใจ', employeeId: 'EMP003', dept: 'QC Section', wi: 'QCW001-002', skillType: 'C - Report', currentLevel: 1, proposedLevel: 1, jobsDone: 22, jobTarget: 20, reworkPercent: 8, reworkTarget: 5, status: 'Not Qualified' }
];"""

text = re.sub(r'const autoEvaluations = \[.*?\];', new_auto_evaluations, text, flags=re.DOTALL)

# Modify Section 1 Header
old_sec1_header = """          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" /> 1. รายการแนะนำเลื่อนระดับอัตโนมัติ (System Auto Proposed)
          </h3>
          <span className="text-xs font-semibold text-slate-500">พบ {autoEvaluations.filter(e => e.status === 'System Proposed').length} รายการที่เข้าเกณฑ์</span>"""

new_sec1_header = """          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" /> 1. สรุปผลประเมินอัตโนมัติจากข้อมูลการทำงาน (Auto-Evaluated from Working Records)
            </h3>
            <p className="text-xs text-slate-500 mt-1 ml-6">ระบบดึงข้อมูลจาก "บันทึกการทำงานรายวัน" มาคำนวณยอดสะสม Job และอัตรางานแก้ (Rework) เพื่อหาผู้ที่เข้าเกณฑ์เลื่อนระดับ</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">พบ {autoEvaluations.filter(e => e.status === 'System Proposed').length} รายการที่เข้าเกณฑ์</span>"""

text = text.replace(old_sec1_header, new_sec1_header)

# Modify Table Row for Auto Evaluations
old_tr = """                  <td className="px-4 py-3 text-xs">
                    <span className={ev.status === 'System Proposed' ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                      {ev.criteria}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {ev.status === 'System Proposed' ? (
                      isManager ? (
                        <span className="text-xs font-bold text-slate-500">รอ Chief ตรวจสอบ</span>
                      ) : (
                        <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-1">
                          <CheckCircle size={14} /> ส่งให้ผู้จัดการอนุมัติ
                        </button>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded bg-rose-50 text-rose-600 border border-rose-200">
                        <AlertCircle size={12} /> ยังไม่ผ่านเกณฑ์
                      </span>
                    )}
                  </td>"""

new_tr = """                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">สะสมงาน (Target: {ev.jobTarget}):</span>
                        <span className={`font-bold ${ev.jobsDone >= ev.jobTarget ? 'text-emerald-600' : 'text-rose-600'}`}>{ev.jobsDone} Jobs</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${ev.jobsDone >= ev.jobTarget ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min((ev.jobsDone/ev.jobTarget)*100, 100)}%` }}></div></div>
                      
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-slate-600">อัตรางานแก้ (Target: <{ev.reworkTarget}%):</span>
                        <span className={`font-bold ${ev.reworkPercent < ev.reworkTarget ? 'text-emerald-600' : 'text-rose-600'}`}>{ev.reworkPercent}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {ev.status === 'System Proposed' ? (
                      isManager ? (
                        <span className="text-xs font-bold text-slate-500">รอ Chief ยืนยันผล</span>
                      ) : (
                        <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-1 w-full justify-center">
                          <CheckCircle size={14} /> ยืนยัน & ส่งอนุมัติ
                        </button>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1.5 w-full justify-center rounded bg-slate-100 text-slate-500 border border-slate-200">
                        <AlertCircle size={12} /> ข้อมูลยังไม่ถึงเกณฑ์
                      </span>
                    )}
                  </td>"""

text = text.replace(old_tr, new_tr)

with io.open("src/pages/SkillEvaluation.tsx", "w", encoding="utf-8") as f:
    f.write(text)

