import io

with io.open("src/pages/SkillEvaluation.tsx", "r", encoding="utf-8") as f:
    text = f.read()

import_str = "import { Award, Search, Filter, AlertTriangle, CheckCircle, ChevronRight, Clock, Star, Users } from 'lucide-react';"
new_import = import_str + "\nimport Pagination from '../components/Pagination';"
text = text.replace(import_str, new_import)

mock_start = text.find("const teamOverview = [")
mock_end = text.find("];", mock_start) + 2

larger_mock = """const teamOverview = Array.from({ length: 35 }).map((_, i) => {
  const employees = ['นายสมชาย ใจดี', 'นายกฤต พร้อมใจ', 'นางสมศรี มีสุข', 'นายวิชัย เก่งกาจ'];
  return {
    id: `EMP00${(i%4)+1}-${i}`,
    employee: employees[i % employees.length] + ` ${i}`,
    department: 'QC Section',
    wi: `QCW00${(i%5)+1}-001`,
    skillType: ['A - Circuit Connecting', 'B - Machine Operator', 'C - Inspection Report'][i % 3],
    currentLevel: i % 4,
    jobsCompleted: 150 + (i * 10),
    targetJobs: 200,
    reworkPercent: (0.5 + (i % 3)).toFixed(1)
  };
});
"""
text = text[:mock_start] + larger_mock + text[mock_end:]

state_str = "  const [searchQuery, setSearchQuery] = useState('');"
new_state = state_str + "\n  const [teamPage, setTeamPage] = useState(1);\n  const ITEMS_PER_PAGE = 5;"
text = text.replace(state_str, new_state)

filter_str = "  const filteredTeamOverview = teamOverview.filter(t => {"
new_filter_str = """  const filteredTeamOverviewAll = teamOverview.filter(t => {"""
text = text.replace(filter_str, new_filter_str)

logic_end = "  });"
new_logic_end = """  });
  
  const totalItems = filteredTeamOverviewAll.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(teamPage, Math.max(1, totalPages));
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const filteredTeamOverview = filteredTeamOverviewAll.slice(startIndex, startIndex + ITEMS_PER_PAGE);"""
text = text.replace(logic_end, new_logic_end, 1)

table_end = """                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}"""
new_table_end = """                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination currentPage={safeCurrentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setTeamPage} />
              </div>
            </div>
          )}"""
text = text.replace(table_end, new_table_end, 1)

with io.open("src/pages/SkillEvaluation.tsx", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated SkillEvaluation.tsx")
