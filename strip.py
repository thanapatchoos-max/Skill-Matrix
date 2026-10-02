import io
with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

out = []
skip = False
for line in lines:
    if "// Inline Form State" in line:
        skip = True
    if skip and "});" in line:
        skip = False
        continue
    if skip:
        continue
    
    if "const handleNewSubmit" in line:
        skip = True
    if skip and "showToast" in line and "สำเร็จ" in line:
        skip = False
        continue
    if skip and "};" in line:
        skip = False
        continue
    if skip:
        continue

    if "<button" in line and "setIsFormOpen" in line:
        skip = True
    if skip and "</button>" in line:
        skip = False
        continue
    if skip:
        continue

    if "{/* INLINE FORM:" in line:
        skip = True
    if skip and "})}" in line:
        skip = False
        continue
    if skip:
        continue
        
    line = line.replace("ปรับ Grade ประจำปี", "เลื่อนระดับทักษะ (Level Upgrade)")
    line = line.replace("ปรับ Grade", "เลื่อนระดับทักษะ")
    
    out.append(line)

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.writelines(out)
