import io

# ========= Reports.tsx: Add userRole =========
with io.open("src/pages/Reports.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Change function signature
text = text.replace("export function Reports() {", """export function Reports({ userRole = 'admin' }: { userRole?: string }) {
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager' || userRole === 'admin';
  const CHIEF_DEPT = 'QC Section'; // In production: from user session""")

# Add dept context banner in JSX
old_inner = "  const [filters, setFilters] = useState<ReportFilterState>({"
new_inner = """  // Chief: pre-lock their department in all filters
  const initialDept = isChief ? 'QC Section' : 'ALL';
  const [filters, setFilters] = useState<ReportFilterState>({"""
text = text.replace(old_inner, new_inner)
text = text.replace("    matrixDept: 'ALL',", "    matrixDept: initialDept,")
text = text.replace("    gapDept: 'ALL',", "    gapDept: initialDept,")

with io.open("src/pages/Reports.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Reports.tsx updated")
