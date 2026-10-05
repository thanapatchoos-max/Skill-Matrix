import io
import re

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Update Mock Data to include a completed status
old_mock = """  { id: 'OJT-004', employee: 'นายวิชัย เก่งดี', employeeId: 'EMP004', department: 'Engineering', wi: 'ENG-M-002', skillType: 'D - Data Analysis', requestedDate: '2026-09-28', status: 'pending_manager', theoryScore: 90, practicalScore: 85, testResult: 'passed' },
];"""

new_mock = """  { id: 'OJT-004', employee: 'นายวิชัย เก่งดี', employeeId: 'EMP004', department: 'Engineering', wi: 'ENG-M-002', skillType: 'D - Data Analysis', requestedDate: '2026-09-28', status: 'pending_manager', theoryScore: 90, practicalScore: 85, testResult: 'passed' },
  { id: 'OJT-005', employee: 'นายศรชัย สุดยอด', employeeId: 'EMP007', department: 'Production', wi: 'PROD-020-01', skillType: 'E - Safety', requestedDate: '2026-09-20', status: 'completed', theoryScore: 95, practicalScore: 92, testResult: 'passed' },
];"""

text = text.replace(old_mock, new_mock)

# 2. Update filtering
old_filter = """  const pendingTableData = requests.filter(r => r.status === 'pending_request');
  const rejectedTableData = requests.filter(r => r.status === 'rejected_request');
  const executionTableData = requests.filter(r => r.status !== 'pending_request' && r.status !== 'rejected_request');"""

new_filter = """  const pendingTableData = requests.filter(r => r.status === 'pending_request');
  const rejectedTableData = requests.filter(r => r.status === 'rejected_request');
  const executionTableData = requests.filter(r => r.status === 'waiting_for_test' || r.status === 'pending_manager');
  const completedTableData = requests.filter(r => r.status === 'completed');"""

text = text.replace(old_filter, new_filter)

# 3. Change grid to cols-3 and items-start
text = text.replace('<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">', '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">')

# 4. Add Table 3
# Find where Table 2 ends (the end of the second main div inside the grid)
# The grid starts with <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
# Let's just insert Table 3 before the closing </div> of that grid.

table3_str = """
        {/* TABLE 3: COMPLETED */}
        <div className="bg-white rounded-xl border border-purple-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-purple-200 bg-purple-50">
            <h3 className="font-bold text-purple-900 flex items-center gap-2"><CheckCircle size={18}/> 3. ผลการอนุมัติ (Completed)</h3>
            <p className="text-xs text-purple-700 mt-1">รายการที่ Manager อนุมัติปรับ Level แล้ว</p>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wide">
                <tr><th className="px-4 py-3">ข้อมูลการอบรม</th><th className="px-4 py-3 text-center">สถานะผลลัพธ์</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedTableData.length === 0 ? (
                  <tr><td colSpan={2} className="text-center py-8 text-slate-400">ยังไม่มีรายการที่เสร็จสิ้น</td></tr>
                ) : completedTableData.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{r.employee}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{r.wi}</div>
                      <div className="text-[11px] text-slate-500">{r.skillType}</div>
                      <div className="text-[10px] font-bold text-purple-600 mt-1">คะแนน: ทฤษฎี {r.theoryScore}% | ปฏิบัติ {r.practicalScore}%</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold border border-purple-200">
                          ผ่านการอนุมัติ
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">ปรับเป็น Level 1 แล้ว</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
"""

# Replace the closing </div> of the grid with Table 3 + </div>
text = text.replace('      </div>\n\n      {/* MODALS OVERLAY */}', table3_str + '\n      {/* MODALS OVERLAY */}')


with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)

