const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('src/pages/SectionSkillMatrix.tsx', 'utf8');
const match = source.match(/const mockEmployees: EmployeeSkill\[\] = (\[[\s\S]*?\n\]);/);
if (!match) throw new Error('Employee seed not found');
const employees = vm.runInNewContext(match[1]).map(employee => ({
  ...employee,
  position: employee.role,
  assignedSkills: Object.keys(employee.scores),
}));
fs.writeFileSync('src/data/phase1Seed.ts', "// Existing demo employees, consolidated for Phase 1.\nimport type { Employee } from './phase1Core';\nexport const INITIAL_EMPLOYEES: Employee[] = " + JSON.stringify(employees, null, 2) + ';\n');
