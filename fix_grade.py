import io
with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("ปรับ Grade ประจำปี", "เลื่อนระดับทักษะ (Level Upgrade)")
text = text.replace("ปรับ Grade", "เลื่อนระดับทักษะ")

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(text)
