import io

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Imports
import_str = "import { GraduationCap, Search, Filter, Calendar, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, AlertCircle, FileText, Play } from 'lucide-react';"
new_import = import_str + "\nimport Pagination from '../components/Pagination';"
text = text.replace(import_str, new_import)

# 2. Add more mock data
mock_start = text.find("const mockTraining: TrainingRecord[] = [")
mock_end = text.find("];", mock_start) + 2

larger_mock = """const mockTraining: TrainingRecord[] = Array.from({ length: 60 }).map((_, i) => {
  const employees = ['นายสมชาย ใจดี', 'นางสาวแนน สุขใจ', 'นายกฤต พร้อมใจ', 'นายสมศักดิ์ มั่นคง', 'นางสมศรี มีสุข'];
  const emp = employees[i % employees.length];
  
  const statuses: ('PENDING_CHIEF' | 'REJECTED_CHIEF' | 'OJT_EXECUTION' | 'COMPLETED' | 'FAILED')[] = ['PENDING_CHIEF', 'OJT_EXECUTION', 'COMPLETED', 'COMPLETED', 'REJECTED_CHIEF', 'COMPLETED', 'COMPLETED'];
  const status = statuses[i % statuses.length];
  
  return {
    id: `OJT-2609-${(100+i).toString()}`,
    employee: emp,
    department: i % 2 === 0 ? 'QC Section' : 'Engineering',
    wi: `QCW00${(i%5)+1}-001`,
    skillType: ['A - Circuit Connecting', 'B - Machine Operator', 'C - Inspection Report'][i % 3],
    currentLevel: 0,
    targetLevel: 1,
    status: status,
    requestDate: `2026-09-${(10 + (i%15)).toString().padStart(2, '0')}`,
    scheduledDate: status === 'PENDING_CHIEF' || status === 'REJECTED_CHIEF' ? undefined : `2026-10-${(1 + (i%10)).toString().padStart(2, '0')}`,
    score: status === 'COMPLETED' ? (85 + (i%10)) : (status === 'FAILED' ? 50 : undefined),
    rejectReason: status === 'REJECTED_CHIEF' ? 'คิวฝึกอบรมเต็มสัปดาห์นี้' : undefined
  };
});
"""
text = text[:mock_start] + larger_mock + text[mock_end:]

# 3. Add Pagination States
state_str = "  const [searchQuery, setSearchQuery] = useState('');"
new_state = state_str + """
  const [pendingPage, setPendingPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const ITEMS_PER_PAGE = 5; // Smaller chunks for multi-table page
"""
text = text.replace(state_str, new_state)

# 4. Slicing logic
group_logic = """  const pendingRequests = filteredTraining.filter(r => r.status === 'PENDING_CHIEF');
  const rejectedRequests = filteredTraining.filter(r => r.status === 'REJECTED_CHIEF');
  const activeTraining = filteredTraining.filter(r => r.status === 'OJT_EXECUTION');
  const completedTraining = filteredTraining.filter(r => r.status === 'COMPLETED' || r.status === 'FAILED');"""

new_group_logic = """  const pendingRequestsAll = filteredTraining.filter(r => r.status === 'PENDING_CHIEF');
  const rejectedRequests = filteredTraining.filter(r => r.status === 'REJECTED_CHIEF');
  const activeTrainingAll = filteredTraining.filter(r => r.status === 'OJT_EXECUTION');
  const completedTrainingAll = filteredTraining.filter(r => r.status === 'COMPLETED' || r.status === 'FAILED');

  const paginate = (array: any[], page: number) => {
    const totalPages = Math.ceil(array.length / ITEMS_PER_PAGE);
    const safePage = Math.min(page, Math.max(1, totalPages));
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return {
      items: array.slice(start, start + ITEMS_PER_PAGE),
      safePage,
      totalPages,
      totalItems: array.length
    };
  };

  const pending = paginate(pendingRequestsAll, pendingPage);
  const active = paginate(activeTrainingAll, activePage);
  const completed = paginate(completedTrainingAll, completedPage);
  
  const pendingRequests = pending.items;
  const activeTraining = active.items;
  const completedTraining = completed.items;
"""
text = text.replace(group_logic, new_group_logic)

# Replace the closing </div> of each table with Pagination
table_close_1 = """              )}
            </tbody>
          </table>
        </div>
      </div>"""

new_table_close_pending = """              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={pending.safePage} totalPages={pending.totalPages} totalItems={pending.totalItems} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPendingPage} />
      </div>"""

new_table_close_active = """              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={active.safePage} totalPages={active.totalPages} totalItems={active.totalItems} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setActivePage} />
      </div>"""

new_table_close_completed = """              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={completed.safePage} totalPages={completed.totalPages} totalItems={completed.totalItems} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCompletedPage} />
      </div>"""

# Manually replace each one since they are identical visually but need different variables.
# Pending table is the first one.
text = text.replace(table_close_1, new_table_close_pending, 1)
# Active is the second one.
text = text.replace(table_close_1, new_table_close_active, 1)
# Completed is the third one.
text = text.replace(table_close_1, new_table_close_completed, 1)

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated Training.tsx")
