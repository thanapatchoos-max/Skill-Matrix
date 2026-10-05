import io

with io.open("src/pages/WorkingRecord.tsx", "r", encoding="utf-8") as f:
    text = f.read()

old_button = """        {(isStaff || isChief) && (
          <button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold shadow-sm text-sm">
            <Plus size={18} /> {isFormOpen ? 'ยกเลิก' : 'บันทึกข้อมูลงาน ใหม่'}
          </button>
        )}"""

new_button = """        <button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold shadow-sm text-sm">
          <Plus size={18} /> {isFormOpen ? 'ยกเลิก' : 'บันทึกข้อมูลงาน ใหม่'}
        </button>"""

text = text.replace(old_button, new_button)

with io.open("src/pages/WorkingRecord.tsx", "w", encoding="utf-8") as f:
    f.write(text)

