import io
import re

with io.open("src/pages/WorkingRecord.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Add Pagination Import
import_str = "import { Plus, Search, Filter, Play, CheckCircle, AlertTriangle, Clock, Calendar, Activity, Briefcase, BarChart2 } from 'lucide-react';"
new_import = import_str + "\nimport Pagination from '../components/Pagination';"
text = text.replace(import_str, new_import)

# 2. Add larger mock dataset
mock_start = text.find("const mockWorkingRecords: WorkRecord[] = [")
mock_end = text.find("];", mock_start) + 2

larger_mock = """const mockWorkingRecords: WorkRecord[] = Array.from({ length: 45 }).map((_, i) => {
  const departments = ['QC Section', 'Engineering', 'Production'];
  const employeesByDept: Record<string, string[]> = {
    'QC Section': ['นายสมชาย ใจดี', 'นายกฤต พร้อมใจ', 'นางสมศรี มีสุข'],
    'Engineering': ['นางสาวแนน สุขใจ'],
    'Production': ['นายสมศักดิ์ มั่นคง']
  };
  const dept = departments[i % 3];
  const empList = employeesByDept[dept];
  const emp = empList[i % empList.length];
  
  const wiList = ['QCW001-001', 'QCW001-002', 'QCW002-001', 'QCW004-001', 'QCW005-001', 'ENG-M-001', 'ENG-D-003', 'PROD-010-01', 'PROD-020-01'];
  const wi = wiList[i % wiList.length];
  
  const skillTypes = ['A - Circuit Connecting', 'B - Machine Operator', 'C - Inspection Report', 'D - Data Analysis', 'E - Safety Control'];
  const skill = skillTypes[i % skillTypes.length];
  
  // Distribute dates over a week
  const dateObj = new Date(2026, 9, 5 - (i % 7)); // Oct 5, 2026 backwards
  const dateStr = dateObj.toISOString().split('T')[0];

  const isRework = i % 8 === 0;
  
  return {
    id: `JOB-${261005 - i}-${i.toString().padStart(2, '0')}`,
    date: dateStr,
    sn: `PP${(600 - i).toString().padStart(3, '0')}A${(i+1).toString().padStart(2, '0')}`,
    employee: emp,
    department: dept,
    wi: wi,
    skillType: skill,
    type: isRework ? 'Rework QC' : 'Normal',
    startTime: '08:00',
    finishTime: i % 5 === 0 ? '' : '12:00',
    actualHrs: i % 5 === 0 ? 0 : 4.0,
    standardHrs: 3.5 + (i % 2),
    status: i % 5 === 0 ? 'กำลังดำเนินการ' : 'เสร็จสมบูรณ์',
    nc: isRework ? `NC-2609-${(100+i).toString()}` : null
  };
});
"""
text = text[:mock_start] + larger_mock + text[mock_end:]

# 3. Add Pagination State
state_str = "  const [selectedWI, setSelectedWI] = useState('ALL');"
new_state = state_str + "\n\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 10;"
text = text.replace(state_str, new_state)

# 4. Filter logic - reset page on filter change
# Instead of adding complex useEffect, let's just make sure we slice after filtering.
# We don't really have to reset currentPage manually here for a quick mock, but ideally we should.
# We will just slice the filteredRecords.
slice_str = """  const kpiRecords = filteredRecords.filter(r => {"""
new_slice = """  // Pagination logic
  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  // Ensure current page is valid
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const kpiRecords = filteredRecords.filter(r => {"""
text = text.replace(slice_str, new_slice)

# 5. Use paginatedRecords in table rendering
text = text.replace("filteredRecords.map((r) => (", "paginatedRecords.map((r) => (")

# 6. Inject Pagination component below the table
table_end = """        </div>
      </div>
    </div>
  );
}"""
new_table_end = """        </div>
        
        {/* Pagination */}
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

# Also fix the Date filter to default to '' instead of '2026-10-05' so users see more data immediately.
text = text.replace("const [filterDate, setFilterDate] = useState('2026-10-05');", "const [filterDate, setFilterDate] = useState('');")

with io.open("src/pages/WorkingRecord.tsx", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated WorkingRecord.tsx with Pagination")
