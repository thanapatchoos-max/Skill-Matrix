import io

with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Imports
import_str = "import { CheckCircle, XCircle, Search, Filter, AlertTriangle, ChevronDown, Clock, ShieldCheck, GraduationCap, Award, UserCheck, Play } from 'lucide-react';"
new_import = import_str + "\nimport Pagination from '../components/Pagination';"
text = text.replace(import_str, new_import)

# 2. Add more mock data
mock_start = text.find("const mockApprovals: ApprovalRequest[] = [")
mock_end = text.find("];", mock_start) + 2

larger_mock = """const mockApprovals: ApprovalRequest[] = Array.from({ length: 45 }).map((_, i) => {
  const types: ('OJT' | 'EVAL_AUTO' | 'EVAL_MANUAL')[] = ['OJT', 'OJT', 'EVAL_AUTO', 'EVAL_MANUAL', 'OJT'];
  const type = types[i % types.length];
  
  const employees = ['นายสมชาย ใจดี', 'นางสาวแนน สุขใจ', 'นายกฤต พร้อมใจ', 'นายสมศักดิ์ มั่นคง', 'นางสมศรี มีสุข'];
  const emp = employees[i % employees.length];
  
  const currentLevels = [0, 1, 2, 0, 1];
  const curLvl = currentLevels[i % currentLevels.length];
  
  const statuses: ('PENDING' | 'APPROVED' | 'REJECTED')[] = ['PENDING', 'PENDING', 'APPROVED', 'PENDING', 'REJECTED'];
  
  return {
    id: `REQ-2609-${(100+i).toString()}`,
    type: type,
    employee: emp,
    department: i % 2 === 0 ? 'QC Section' : 'Engineering',
    wi: `QCW00${(i%5)+1}-001`,
    skillType: ['A - Circuit Connecting', 'B - Machine Operator', 'C - Inspection Report'][i % 3],
    currentLevel: curLvl,
    requestedLevel: curLvl + 1,
    status: statuses[i % statuses.length],
    requestDate: `2026-09-${(10 + (i%15)).toString().padStart(2, '0')}`,
    requestedBy: type === 'EVAL_MANUAL' ? 'นายหัวหน้า รักทีม (Chief)' : 'ระบบประเมินอัตโนมัติ',
    score: type === 'OJT' ? undefined : (80 + (i % 15)),
    reason: type === 'EVAL_MANUAL' ? 'ทำงานดีมาก ควรได้ปรับ' : undefined,
    trainingDate: type === 'OJT' ? `2026-10-${(1 + (i%5)).toString().padStart(2, '0')}` : undefined
  };
});
"""
text = text[:mock_start] + larger_mock + text[mock_end:]

# 3. Add Pagination State
state_str = "  const [searchQuery, setSearchQuery] = useState('');"
new_state = state_str + "\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 10;"
text = text.replace(state_str, new_state)

# reset page on tab change
tab_logic = "  const [activeTab, setActiveTab] = useState<'OJT' | 'EVAL_AUTO' | 'EVAL_MANUAL'>('OJT');"
new_tab_logic = """  const [activeTab, setActiveTab] = useState<'OJT' | 'EVAL_AUTO' | 'EVAL_MANUAL'>('OJT');
  
  const handleTabChange = (tab: 'OJT' | 'EVAL_AUTO' | 'EVAL_MANUAL') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };"""
text = text.replace(tab_logic, new_tab_logic)
text = text.replace("onClick={() => setActiveTab('OJT')}", "onClick={() => handleTabChange('OJT')}")
text = text.replace("onClick={() => setActiveTab('EVAL_AUTO')}", "onClick={() => handleTabChange('EVAL_AUTO')}")
text = text.replace("onClick={() => setActiveTab('EVAL_MANUAL')}", "onClick={() => handleTabChange('EVAL_MANUAL')}")

# 4. Filter logic & Pagination logic
slice_str = "  // Filter logic"
new_slice = """  // Filter logic & Pagination
"""
text = text.replace(slice_str, new_slice)

filtered_logic = """  const filteredRequests = mockApprovals.filter(req => {
    if (req.type !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!req.employee.toLowerCase().includes(q) && !req.wi.toLowerCase().includes(q)) return false;
    }
    return true;
  });"""
new_filtered_logic = """  const filteredRequests = mockApprovals.filter(req => {
    if (req.type !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!req.employee.toLowerCase().includes(q) && !req.wi.toLowerCase().includes(q)) return false;
    }
    return true;
  });
  
  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);"""
text = text.replace(filtered_logic, new_filtered_logic)

# Replace mapping
text = text.replace("filteredRequests.map((req) => (", "paginatedRequests.map((req) => (")
text = text.replace("filteredRequests.length === 0", "paginatedRequests.length === 0")

# Inject Pagination UI
table_end = """        </div>
      </div>

    </div>
  );
}"""
new_table_end = """        </div>
        <Pagination 
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

    </div>
  );
}"""
text = text.replace(table_end, new_table_end)

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated Approvals.tsx")
