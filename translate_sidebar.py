import io

with io.open("src/components/Sidebar.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('Operations & Production', 'ระบบปฏิบัติการและการผลิต (Operations)')
text = text.replace('label="Skill Evaluation"', 'label="ระบบประเมินทักษะ"')
text = text.replace('label="Training Management"', 'label="ระบบจัดการการฝึกอบรม"')

with io.open("src/components/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(text)

