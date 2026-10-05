import io
import re

with io.open("src/components/Sidebar.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Change "Individual Skill Matrix" to "ข้อมูลทักษะรายบุคคล" or similar
text = text.replace("'Individual Skill Matrix'", "'ทักษะรายบุคคล (Individual)'")

with io.open("src/components/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(text)

