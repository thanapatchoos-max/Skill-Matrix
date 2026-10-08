import io

with io.open("src/pages/Dashboard.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Add import for shared data
old_import = "import React from 'react';"
new_import = """import React from 'react';
import { WORKING_STATS, APPROVAL_STATS, DEFAULT_CAPACITY_DATA, CURRENT_USER_PROFILES } from '../lib/sharedMockData';"""
text = text.replace(old_import, new_import)

# Change component signature to accept userRole
text = text.replace("export default function Dashboard() {", """export default function Dashboard({ userRole = 'admin' }: { userRole?: string }) {
  const isChief = userRole === 'chief';
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';

  // For Chief: only show their department capacity
  const deptCapacity = DEFAULT_CAPACITY_DATA.find(d => d.section === 'QC Section');
  const totalCapacity = isChief && deptCapacity ? deptCapacity.capacity : WORKING_STATS.totalCapacityHours;
  const totalActual   = isChief && deptCapacity ? deptCapacity.actualLoad : WORKING_STATS.totalActualHours;
  const overallLoad   = ((totalActual / totalCapacity) * 100).toFixed(1);""")

# Replace hardcoded KPI values with dynamic values
text = text.replace(">560 <", ">{isChief ? (deptCapacity?.capacity ?? 0) : WORKING_STATS.totalCapacityHours} <")
text = text.replace(">94.6%<", ">{overallLoad}%<")
text = text.replace(">1.2%<", ">{WORKING_STATS.avgNcReworkPercent}%<")
text = text.replace(">3 <span", ">{APPROVAL_STATS.autoUpgradePending} <span")
text = text.replace(">7<", ">{APPROVAL_STATS.pendingOJT}<")
text = text.replace(">4<", ">{APPROVAL_STATS.pendingAnnual}<")

# Add chief view banner
old_header = "      {/* Header */}"
new_header = """      {/* Header */}
      {isChief && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3 text-blue-800 text-sm font-semibold">
          <span>🏢</span> มุมมองหัวหน้างาน: แสดงข้อมูลเฉพาะแผนก <strong>QC Section</strong>
        </div>
      )}"""
text = text.replace(old_header, new_header)

with io.open("src/pages/Dashboard.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Dashboard.tsx updated")
