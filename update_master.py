import io

with io.open("src/pages/MasterData.tsx", "r", encoding="utf-8") as f:
    text = f.read()

import_str = "import { Database, Search, Plus, Edit2, Trash2, Filter, FolderTree, BookOpen } from 'lucide-react';"
new_import = import_str + "\nimport Pagination from '../components/Pagination';"
text = text.replace(import_str, new_import)

mock_start = text.find("const masterWIs: MasterWI[] = [")
mock_end = text.find("];", mock_start) + 2

larger_mock = """const masterWIs: MasterWI[] = Array.from({ length: 42 }).map((_, i) => {
  const depts = ['QC Section', 'Production', 'Engineering', 'Maintenance'];
  const types = ['A - Circuit Connecting', 'B - Machine Operator', 'C - Inspection Report', 'D - Data Analysis'];
  const baseCodes = ['QCW', 'PROD', 'ENG', 'MNT'];
  
  const dIndex = i % 4;
  
  return {
    id: `WI-00${i+1}`,
    wiCode: `${baseCodes[dIndex]}00${(i%5)+1}-00${(i%3)+1}`,
    wiName: `มาตรฐานการปฏิบัติงาน ${i+1}`,
    skillType: types[i % 4],
    department: depts[dIndex],
    version: `1.${i%5}`,
    lastUpdated: `2026-09-${(10 + (i%20)).toString().padStart(2, '0')}`,
    status: i % 15 === 0 ? 'Obsolete' : 'Active'
  };
});
"""
text = text[:mock_start] + larger_mock + text[mock_end:]

state_str = "  const [activeTab, setActiveTab] = useState<'WI' | 'SKILL_TYPE'>('WI');"
new_state = state_str + """
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const handleTabChange = (tab: 'WI' | 'SKILL_TYPE') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };
"""
text = text.replace(state_str, new_state)
text = text.replace("onClick={() => setActiveTab('WI')}", "onClick={() => handleTabChange('WI')}")
text = text.replace("onClick={() => setActiveTab('SKILL_TYPE')}", "onClick={() => handleTabChange('SKILL_TYPE')}")

filter_str = "  const filteredWIs = masterWIs.filter(wi => {"
new_filter_str = """  const filteredWIsAll = masterWIs.filter(wi => {"""
text = text.replace(filter_str, new_filter_str)

filter_end = "  });"
new_filter_end = """  });
  
  const totalItems = filteredWIsAll.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const filteredWIs = filteredWIsAll.slice(startIndex, startIndex + ITEMS_PER_PAGE);"""
text = text.replace(filter_end, new_filter_end, 1)

table_end = """                  )}
                </tbody>
              </table>
            </div>
          </div>"""
new_table_end = """                  )}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={safeCurrentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
          </div>"""
text = text.replace(table_end, new_table_end, 1)

with io.open("src/pages/MasterData.tsx", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated MasterData.tsx")
