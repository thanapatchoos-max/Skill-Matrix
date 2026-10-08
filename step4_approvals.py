import io

# ========= Approvals.tsx: Add userRole + Chief filter =========
with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Add userRole to function signature
text = text.replace("export default function Approvals() {", """export default function Approvals({ userRole = 'admin' }: { userRole?: string }) {
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager' || userRole === 'admin';
  const CHIEF_DEPT = 'QC Section'; // In production: comes from user session""")

# Add chief dept filter at the top of filtering
old_filter = "  const pending = requests.filter(r => r.status === 'pending');"
new_filter = """  // Role-based visibility: Chief sees only their department
  const visibleRequests = isChief 
    ? requests.filter(r => r.department === CHIEF_DEPT)
    : requests;
  
  const pending = visibleRequests.filter(r => r.status === 'pending');"""
text = text.replace(old_filter, new_filter)

old_history = "  const history = requests.filter(r => r.status !== 'pending');"
text = text.replace(old_history, "  const history = visibleRequests.filter(r => r.status !== 'pending');")

# Add department context banner in the JSX
old_header_section = "      {/* Header */}"
new_header_section = """      {/* Header */}
      {isChief && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3 text-blue-800 text-sm font-semibold">
          <span>🏢</span> มุมมอง Chief: แสดงเฉพาะคำขออนุมัติจากแผนก <strong>{CHIEF_DEPT}</strong>
        </div>
      )}"""
text = text.replace(old_header_section, new_header_section)

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Approvals.tsx updated")
