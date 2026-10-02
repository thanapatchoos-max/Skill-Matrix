import io, re
with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

buttons_html = """            <div className="flex items-center gap-2">
              <button
                onClick={() => { setIsUpgradeFormOpen(true); setIsFormOpen(false); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-lg transition-colors font-semibold shadow-md text-sm"
              >
                <TrendingUp size={18} /> ขอเลื่อนระดับทักษะ (Level Upgrade)
              </button>
              <button
                onClick={() => { handleOpenAddForm(); setIsUpgradeFormOpen(false); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg transition-colors font-semibold shadow-md text-sm"
              >
                <Plus size={18} /> บันทึกผล OJT ใหม่
              </button>
            </div>"""

text = re.sub(r"            <button\s+onClick=\{handleOpenAddForm\}.*?บันทึกผล OJT ใหม่\s*</button>", buttons_html, text, flags=re.DOTALL)

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)

