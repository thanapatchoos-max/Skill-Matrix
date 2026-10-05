import io
import re

with io.open("src/App.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Update Role options
role_options_old = """  const roles = [
    { id: 'admin', label: 'System Admin', dept: 'IT / System' },
    { id: 'manager', label: 'Plant Manager', dept: 'Production' },
    { id: 'chief', label: 'Chief / Supervisor', dept: 'QC Section' },
    { id: 'staff', label: 'Staff / Operator', dept: 'QC Section' }
  ];"""

role_options_new = """  const roles = [
    { id: 'admin', label: 'Administrator', dept: 'IT / System' },
    { id: 'manager', label: 'Manager', dept: 'Production' },
    { id: 'chief', label: 'Chief / Supervisor', dept: 'QC Section' },
    { id: 'clerk', label: 'Clerk', dept: 'Production' },
    { id: 'staff', label: 'Staff', dept: 'QC Section' },
    { id: 'viewer', label: 'Management Viewer', dept: 'Executive' }
  ];"""

text = text.replace(role_options_old, role_options_new)

# Add Skill Evaluation Route
imports = """import WorkingRecord from './pages/WorkingRecord';
import CapacityDashboard from './pages/CapacityDashboard';
import SkillEvaluation from './pages/SkillEvaluation';"""

text = text.replace("import WorkingRecord from './pages/WorkingRecord';\nimport CapacityDashboard from './pages/CapacityDashboard';", imports)

routes = """          {currentPage === 'working-record' && <WorkingRecord />}
          {currentPage === 'capacity' && <CapacityDashboard />}
          {currentPage === 'evaluation' && <SkillEvaluation />}"""

text = text.replace("{currentPage === 'working-record' && <WorkingRecord />}\n          {currentPage === 'capacity' && <CapacityDashboard />}", routes)

with io.open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(text)

