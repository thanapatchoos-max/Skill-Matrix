import io
import re

with io.open("src/pages/IndividualSkillMatrix.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Update signature is already done via string parsing, but let's confirm the isStaff part
old_isStaff = "const isStaff = userRole === 'staff';"
new_isStaff = """  const isStaff = userRole === 'staff' || userRole === 'clerk';
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager' || userRole === 'admin';
"""
if old_isStaff in text:
    text = text.replace(old_isStaff, new_isStaff)

# Find the dropdowns for Dept and Employee
old_dept_select = """<select 
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setSelectedEmpId(mockEmployeesProfiles.find(emp => emp.department === e.target.value)?.id || '');
              setCurrentPage(1);
            }}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0a2540]"
          >"""
new_dept_select = """<select 
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setSelectedEmpId(mockEmployeesProfiles.find(emp => emp.department === e.target.value)?.id || '');
              setCurrentPage(1);
            }}
            disabled={!isManager}
            className={`w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold outline-none ${!isManager ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-700 focus:ring-2 focus:ring-[#0a2540]'}`}
          >"""
text = text.replace(old_dept_select, new_dept_select)

old_emp_select = """<select
            value={selectedEmpId}
            onChange={(e) => {
              setSelectedEmpId(e.target.value);
              setCurrentPage(1);
            }}
            disabled={isStaff}
            className={`w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold outline-none ${isStaff ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-700 focus:ring-2 focus:ring-[#0a2540]'}`}
          >"""
new_emp_select = """<select
            value={selectedEmpId}
            onChange={(e) => {
              setSelectedEmpId(e.target.value);
              setCurrentPage(1);
            }}
            disabled={isStaff}
            className={`w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold outline-none ${isStaff ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-700 focus:ring-2 focus:ring-[#0a2540]'}`}
          >"""
# Seems emp selector already has disabled={isStaff}, let's make sure!
if "disabled={isStaff}" not in text:
    print("WARNING: isStaff disable not found in emp selector")

with io.open("src/pages/IndividualSkillMatrix.tsx", "w", encoding="utf-8") as f:
    f.write(text)

