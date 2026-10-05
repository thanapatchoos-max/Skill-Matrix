import io
import re

with io.open("src/App.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("{currentPage === 'working-record' && <WorkingRecord />}", "{currentPage === 'working-record' && <WorkingRecord userRole={userRole} />}")

with io.open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(text)

