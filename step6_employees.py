import io

# ========= Employees.tsx: Add userRole =========
with io.open("src/pages/Employees.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("export function EmployeeManagement() {", """export function EmployeeManagement({ userRole = 'admin' }: { userRole?: string }) {
  const isAdmin = userRole === 'admin';
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager';
  const CHIEF_DEPT = 'QC Section'; // Chief is locked to this department""")

# Lock Chief to their department: add filter after main data state
old_emp_state = "  const mockEmployees = [...MOCK_EMPLOYEES];"
new_emp_state = """  const _allEmployees = [...MOCK_EMPLOYEES];
  // Chief can only see their own department
  const mockEmployees = isChief ? _allEmployees.filter(e => e.department === CHIEF_DEPT) : _allEmployees;"""
text = text.replace(old_emp_state, new_emp_state)

with io.open("src/pages/Employees.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Employees.tsx updated")
