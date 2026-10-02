import io, re

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Update title text
text = text.replace("แผนการฝึกอบรม (OJT)", "ประเมินทักษะ & OJT")
text = text.replace("Chief บันทึกผลการทดสอบหลังอบรม ดึงโครงสร้างมาตรฐาน W/I จาก Master Data ส่งให้ Manager เลื่อน Skill Level 0 → 1", "จัดการข้อมูล OJT (Level 0 → 1) และ ส่งเสนอขอเลื่อนระดับทักษะ (Level 1 → 3)")

# 2. Add mock upgrade records
mock_upgrade_records = """const mockUpgradeRecords = [
  {
    id: 'APR-001', flowType: 'annual',
    employee: 'นายสมชาย ใจดี', employeeId: 'EMP001', department: 'QC Section',
    wi: 'QCW001-001', skillType: 'A - Circuit Connecting / Wire Harnessing',
    currentLevel: 1, proposedLevel: 2,
    reason: 'ปฏิบัติงานอิสระครบ 6 เดือน ไม่มีข้อบกพร่อง',
    submittedBy: 'Chief เอกวิทย์',
    submittedAt: '2026-10-01', status: 'pending',
  },
  {
    id: 'APR-002', flowType: 'annual',
    employee: 'นางสาวแนน สุขใจ', employeeId: 'EMP005', department: 'Engineering',
    wi: 'ENG-M-001', skillType: 'B - Machine Operator / Testing Station Control',
    currentLevel: 2, proposedLevel: 3,
    reason: 'สามารถสอนพนักงานใหม่ OJT ได้ และช่วยแก้ปัญหาเครื่องจักร',
    submittedBy: 'Admin (คุณสมชาย)',
    submittedAt: '2026-10-02', status: 'pending',
  }
];
"""

if "const mockUpgradeRecords" not in text:
    text = text.replace("const expandedOJTRecords: OJTRecord[] = [", mock_upgrade_records + "\nconst expandedOJTRecords: OJTRecord[] = [")

# 3. Add state
if "const [upgradeRecords, setUpgradeRecords]" not in text:
    text = text.replace("const [records, setRecords] = useState<OJTRecord[]>(expandedOJTRecords);", 
        "const [records, setRecords] = useState<OJTRecord[]>(expandedOJTRecords);\n  const [upgradeRecords, setUpgradeRecords] = useState(mockUpgradeRecords);")

# 4. Duplicate table block for Upgrade Records
# The existing table block starts at {/* TABLE SECTION */} and ends before {/* Pagination */}
# We will just write a new JSX string for the Upgrade Table and inject it.

upgrade_table_jsx = """
      {/* UPGRADE TABLE SECTION */}
      <div className="bg-white rounded-xl border border-purple-200 shadow-sm overflow-hidden mt-8">
        <div className="p-4 border-b border-purple-200 bg-purple-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-600" />
            <span className="text-sm font-bold text-purple-900">
              รายการขอเลื่อนระดับทักษะ (Level Upgrade 1 → 3) ที่รออนุมัติ
            </span>
          </div>
          <span className="text-xs font-semibold text-purple-700">รวมทั้งหมด {upgradeRecords.filter(r => r.status === 'pending').length} รายการ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-purple-50/50 border-b border-purple-100 text-purple-800 font-bold text-xs uppercase tracking-wide">
                <th className="px-4 py-3.5">รหัสคำขอ</th>
                <th className="px-4 py-3.5">พนักงาน</th>
                <th className="px-4 py-3.5 min-w-[280px]">W/I & Skill Type</th>
                <th className="px-4 py-3.5 text-center">Level ปัจจุบัน → เสนอปรับ</th>
                <th className="px-4 py-3.5">เหตุผล</th>
                <th className="px-4 py-3.5 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {upgradeRecords.filter(r => r.status === 'pending').map(req => (
                <tr key={req.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{req.id}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    <div>{req.employee}</div>
                    <div className="text-xs text-slate-400 font-normal">{req.employeeId} · {req.department}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#0a2540] text-xs bg-slate-100 px-2 py-0.5 rounded inline-block mb-1">{req.wi}</div>
                    <div className="text-xs text-slate-600 font-medium truncate max-w-[250px]">{req.skillType}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">{req.currentLevel}</span>
                      <span className="text-slate-400 font-bold">→</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">{req.proposedLevel}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 truncate max-w-[200px]" title={req.reason}>
                    {req.reason}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                      รออนุมัติจาก Manager
                    </span>
                  </td>
                </tr>
              ))}
              {upgradeRecords.filter(r => r.status === 'pending').length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-slate-500">ไม่มีรายการรออนุมัติ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
"""

# Insert right after the pagination div ends
if "{/* UPGRADE TABLE SECTION */}" not in text:
    # We find the end of the Pagination block
    #   {/* Pagination */}
    #   <div className="flex ...">...</div>
    # </div>
    # Which corresponds to the end of the TABLE SECTION div.
    # Let's just append it before the final `</div>\n    </div>\n  );`
    
    text = re.sub(r"(\s*</div>\s*</div>\s*\)\;\s*\}\s*)$", upgrade_table_jsx + r"\1", text)


with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)

