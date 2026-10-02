import re, io
with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Remove isFormOpen state block
text = re.sub(r"\s*// Inline Form State.*?reason: '',\s*\}\);\s*", "\n", text, flags=re.DOTALL)

# 2. Remove handleNewSubmit block
text = re.sub(r"\s*const handleNewSubmit.*?showToast.*?;\s*\}\s*", "\n", text, flags=re.DOTALL)

# 3. Remove the button
text = re.sub(r"\s*\{\!isFormOpen.*?เสนอปรับ Grade.*?</button>\s*\}\)\s*", "\n", text, flags=re.DOTALL)

# 4. Remove the inline form JSX block
text = re.sub(r"\s*\{\/\* INLINE FORM.*?ส่งคำขอเสนอปรับ Grade\s*</button>\s*</div>\s*</form>\s*</div>\s*\)\}\s*", "\n", text, flags=re.DOTALL)

# 5. Replace Grade texts
text = text.replace("ปรับ Grade ประจำปี", "เลื่อนระดับทักษะ (Level Upgrade)")
text = text.replace("ปรับ Grade", "เลื่อนระดับทักษะ")

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(text)

with io.open("src/pages/Reports.tsx", "r", encoding="utf-8") as f:
    text = f.read()
text = text.replace("Annual Grade", "Skill Upgrade")
with io.open("src/pages/Reports.tsx", "w", encoding="utf-8") as f:
    f.write(text)

