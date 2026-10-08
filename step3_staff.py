import io

with io.open("src/pages/StaffDashboard.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Add import for shared data
old_import = "import React, { useState } from 'react';"
new_import = """import React, { useState } from 'react';
import { CURRENT_USER_PROFILES, APPROVAL_STATS } from '../lib/sharedMockData';"""
text = text.replace(old_import, new_import)

# Change function signature
text = text.replace("export function StaffDashboard({ onNavigatePage }: StaffDashboardProps) {", """export function StaffDashboard({ onNavigatePage, userRole = 'staff' }: StaffDashboardProps & { userRole?: string }) {
  const profile = CURRENT_USER_PROFILES[userRole] || CURRENT_USER_PROFILES.staff;""")

# Replace hardcoded name
text = text.replace("ยินดีต้อนรับกลับ, คุณสมชาย ใจดี 👋", "ยินดีต้อนรับกลับ, คุณ{profile.name} 👋")
text = text.replace("{profile.name}", "{profile.name}")

# Replace hardcoded EMP001
text = text.replace("<span className=\"text-xs text-blue-200\">EMP001</span>", "<span className=\"text-xs text-blue-200\">{profile.id}</span>")

# Replace hardcoded position/dept/chief
text = text.replace("ตำแหน่ง: Quality Inspector · แผนก QC Section · หัวหน้าสายตรง: <strong className=\"text-white\">นางสาวอรุณี รักดี (Chief)</strong>", 
    "ตำแหน่ง: {profile.position} · แผนก {profile.department} · หัวหน้าสายตรง: <strong className=\"text-white\">{profile.chief}</strong>")

# Replace competency %
text = text.replace(">78% <span className=\"text-xs font-normal text-white\">(Independent)</span>",
    ">{profile.competencyPercent}% <span className=\"text-xs font-normal text-white\">({profile.competencyPercent >= 75 ? 'Independent' : profile.competencyPercent >= 50 ? 'Under Supervision' : 'Learning'})</span>")

# Replace 5 WIs stat card
text = text.replace(">5 WIs<", ">{profile.skillsAssigned} WIs<")

# Replace pending OJT count
text = text.replace(">1 รายการ<", ">{profile.pendingOJT} รายการ<")

with io.open("src/pages/StaffDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("StaffDashboard.tsx updated")
