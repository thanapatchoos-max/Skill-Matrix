import re, io
with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    c = f.read()

# Remove inline form state
c = re.sub(r"  // Inline Form State.*?\n  \}\);\n", "", c, flags=re.DOTALL)

# Remove handleNewSubmit
c = re.sub(r"  const handleNewSubmit = \(e: React\.FormEvent\) => \{.*?\n  \};\n", "", c, flags=re.DOTALL)

# Remove the button
c = re.sub(r"          <button[^>]*onClick=\{[^}]*setIsFormOpen.*?</button>", "", c, flags=re.DOTALL)

# Remove the inline form itself
c = re.sub(r"      \{\/\* INLINE FORM.*?\n      \}\)\}\n", "", c, flags=re.DOTALL)

# Replace "Grade" text
c = c.replace("ปรับ Grade ประจำปี", "เลื่อนระดับทักษะ (Level Upgrade)")
c = c.replace("ปรับ Grade", "เลื่อนระดับทักษะ")

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(c)

with io.open("src/pages/Reports.tsx", "r", encoding="utf-8") as f:
    cr = f.read()
cr = cr.replace("Annual Grade", "Skill Upgrade")
with io.open("src/pages/Reports.tsx", "w", encoding="utf-8") as f:
    f.write(cr)

