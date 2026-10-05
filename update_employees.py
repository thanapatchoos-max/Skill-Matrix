import io

with io.open("src/pages/Employees.tsx", "r", encoding="utf-8") as f:
    text = f.read()

import_str = "import { Users, Search, Filter, Plus, Edit2, Trash2, ChevronDown, CheckCircle, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';"
new_import = import_str + "\nimport Pagination from '../components/Pagination';"
text = text.replace(import_str, new_import)

mock_start = text.find("const mockEmployees: Employee[] = [")
mock_end = text.find("];", mock_start) + 2

larger_mock = """const mockEmployees: Employee[] = Array.from({ length: 48 }).map((_, i) => {
  const departments = ['QC Section', 'Production', 'Engineering', 'Maintenance', 'Warehouse'];
  const dept = departments[i % departments.length];
  const role = i % 10 === 0 ? 'Chief' : (i % 25 === 0 ? 'Manager' : 'Staff');
  const levelNames = ['Level 0 (Cannot)', 'Level 1 (Supervision)', 'Level 2 (Independent)', 'Level 3 (Trainer)'];
  const curLvl = i % 4;
  
  return {
    id: `EMP${(i + 1).toString().padStart(3, '0')}`,
    name: ['นายสมชาย ใจดี', 'นางสาวอรุณี รักดี', 'นายกฤต พร้อมใจ', 'นางสมศรี มีสุข', 'นางสาวแนน สุขใจ', 'นายสมศักดิ์ มั่นคง', 'นายวิชัย เก่งกาจ'][i % 7] + ` ${i}`,
    department: dept,
    role: role,
    totalSkills: 10 + (i % 5),
    completedSkills: 2 + (i % 8),
    avgCompetency: 40 + (i % 50),
    levelName: levelNames[curLvl],
    status: i % 12 === 0 ? 'Inactive' : 'Active'
  };
});
"""
text = text[:mock_start] + larger_mock + text[mock_end:]

state_str = "  const [searchQuery, setSearchQuery] = useState('');"
new_state = state_str + "\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 10;"
text = text.replace(state_str, new_state)

slice_str = "  const filteredEmployees = mockEmployees.filter(emp => {"
new_slice_str = """  const filteredEmployeesAll = mockEmployees.filter(emp => {"""
text = text.replace(slice_str, new_slice_str)

logic_end = "  });"
new_logic_end = """  });
  
  const totalItems = filteredEmployeesAll.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const filteredEmployees = filteredEmployeesAll.slice(startIndex, startIndex + ITEMS_PER_PAGE);"""
text = text.replace(logic_end, new_logic_end, 1)

table_end = """              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}"""
new_table_end = """              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={safeCurrentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}"""
text = text.replace(table_end, new_table_end)

with io.open("src/pages/Employees.tsx", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated Employees.tsx")
