import io
import re

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Remove upgrade forms and state
text = re.sub(r'  // Upgrade Form State.*?};\n', '', text, flags=re.DOTALL)

# Remove mockUpgradeRecords
text = re.sub(r'const mockUpgradeRecords = \[.*?\];\n', '', text, flags=re.DOTALL)

# Remove upgradeRecords state
text = re.sub(r'  const \[upgradeRecords, setUpgradeRecords\] = useState\(mockUpgradeRecords\);\n', '', text)

# Remove the Upgrade button
text = re.sub(r'              <button\n                onClick=\{\(\) => \{ setIsUpgradeFormOpen\(true\); setIsFormOpen\(false\); \}\}.*?</button>\n', '', text, flags=re.DOTALL)

# Remove the Upgrade form JSX
text = re.sub(r'      \{\/\* INLINE FORM: Level Upgrade \*\/\}.*?      \{\/\* INLINE FORM: Add / Edit OJT \(No Popup Modal!\) \*\/\}', '      {/* INLINE FORM: Add / Edit OJT (No Popup Modal!) */}', text, flags=re.DOTALL)

# Remove the Upgrade Table JSX
text = re.sub(r'      \{\/\* UPGRADE TABLE SECTION \*\/\}.*?(?=\s*</div>\s*</div>\s*\)\;\s*\}\s*$)', '', text, flags=re.DOTALL)

# Add RBAC to Training.tsx
rbac_props = "export default function Training({ userRole }: { userRole: string }) {\n  const isStaff = userRole === 'staff';\n  const isChief = userRole === 'chief';\n  const isManager = userRole === 'manager';\n"
text = text.replace("export default function Training() {", rbac_props)

# Only Chief and Admin can see the "+ บันทึกผล OJT ใหม่" button. Staff sees "Request Training"
add_btn_old = """              <button
                onClick={() => { handleOpenAddForm(); setIsUpgradeFormOpen(false); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg transition-colors font-semibold shadow-md text-sm"
              >
                <Plus size={18} /> บันทึกผล OJT ใหม่
              </button>"""

add_btn_new = """              {/* Staff Request Button */}
              {isStaff && (
                <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold shadow-md text-sm">
                  <Plus size={18} /> ยื่นคำขอฝึกอบรม
                </button>
              )}
              {/* Chief / Admin Add Button */}
              {(!isStaff && !isManager) && (
                <button
                  onClick={handleOpenAddForm}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg transition-colors font-semibold shadow-md text-sm"
                >
                  <Plus size={18} /> บันทึกผลสอบ OJT (Chief Check)
                </button>
              )}"""
text = text.replace(add_btn_old, add_btn_new)

# Make the table conditionally render buttons
# Replace "onClick={() => handleOpenAddForm(r)}" or the edit button logic
# I will use a simple replace for the Action column text to make it read-only for Staff and Manager
text = re.sub(r'<button\s+onClick=\{\(\) => \{ setEditingId\(r\.id\).*?</button>', 
              '{(!isStaff && !isManager) && (<button onClick={() => { setEditingId(r.id); setIsFormOpen(true); }} className="px-3 py-1.5 text-xs bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all"><Edit size={14} /> แก้ไข</button>)}', text, flags=re.DOTALL)

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)

