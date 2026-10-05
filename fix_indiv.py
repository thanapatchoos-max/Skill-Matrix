import io

with io.open("src/pages/IndividualSkillMatrix.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Fix isStaff
old_isStaff = "const isStaff = userRole === 'staff';"
new_isStaff = """  const isStaff = userRole === 'staff' || userRole === 'clerk';
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager' || userRole === 'admin';
"""
if old_isStaff in text:
    text = text.replace(old_isStaff, new_isStaff)

# Replace dept select
old_dept = """                <select
                  value={selectedDept}
                  onChange={e => {
                    const newDept = e.target.value;
                    setSelectedDept(newDept);
                    setSelectedEmpId(mockEmployeesProfiles.find(emp => emp.department === newDept)?.id || '');
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2.5 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >"""

new_dept = """                <select
                  value={selectedDept}
                  onChange={e => {
                    const newDept = e.target.value;
                    setSelectedDept(newDept);
                    setSelectedEmpId(mockEmployeesProfiles.find(emp => emp.department === newDept)?.id || '');
                    setCurrentPage(1);
                  }}
                  disabled={!isManager}
                  className={`w-full appearance-none border border-slate-300 py-2.5 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none ${!isManager ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-800 focus:ring-2 focus:ring-blue-500'}`}
                >"""
text = text.replace(old_dept, new_dept)

# Replace emp select
old_emp = """                <select
                  value={selectedEmpId}
                  onChange={e => { setSelectedEmpId(e.target.value); setCurrentPage(1); }}
                  className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2.5 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >"""

new_emp = """                <select
                  value={selectedEmpId}
                  onChange={e => { setSelectedEmpId(e.target.value); setCurrentPage(1); }}
                  disabled={isStaff}
                  className={`w-full appearance-none border border-slate-300 py-2.5 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none ${isStaff ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-800 focus:ring-2 focus:ring-blue-500'}`}
                >"""
text = text.replace(old_emp, new_emp)

with io.open("src/pages/IndividualSkillMatrix.tsx", "w", encoding="utf-8") as f:
    f.write(text)

