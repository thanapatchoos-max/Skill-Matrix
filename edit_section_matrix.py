import io
import re

with io.open("src/pages/SectionSkillMatrix.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Update signature
old_sig = "export default function SectionSkillMatrix() {"
new_sig = "export default function SectionSkillMatrix({ userRole = 'admin' }: { userRole?: string }) {"
text = text.replace(old_sig, new_sig)

# Add role logic
# We need to find where state is initialized. Let's look for useState
state_old = """  const [selectedDept, setSelectedDept] = useState('QC Section (5 WIs)');
  const [selectedYear, setSelectedYear] = useState('2026');"""
state_new = """  const isStaff = userRole === 'staff' || userRole === 'clerk';
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager' || userRole === 'admin';

  const [selectedDept, setSelectedDept] = useState('QC Section (5 WIs)');
  const [selectedYear, setSelectedYear] = useState('2026');"""
text = text.replace(state_old, state_new)

# Dropdown disabling logic
old_select = """<select 
            value={selectedDept} 
            onChange={(e) => setSelectedDept(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm bg-slate-50 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0a2540]"
          >"""
new_select = """<select 
            value={selectedDept} 
            onChange={(e) => setSelectedDept(e.target.value)}
            disabled={!isManager}
            className={`border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 outline-none ${!isManager ? 'bg-slate-200 cursor-not-allowed text-slate-500' : 'bg-slate-50 focus:ring-2 focus:ring-[#0a2540]'}`}
          >"""
text = text.replace(old_select, new_select)

# Highlight row for staff
# We need to find the tr mapping
old_tr = """{mockEmployees.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50/50">"""
new_tr = """{mockEmployees.map(emp => (
              <tr key={emp.id} className={`hover:bg-slate-50/50 ${isStaff && emp.id === 'EMP001' ? 'bg-blue-50/80 border-l-4 border-blue-500' : ''}`}>"""
text = text.replace(old_tr, new_tr)

with io.open("src/pages/SectionSkillMatrix.tsx", "w", encoding="utf-8") as f:
    f.write(text)

