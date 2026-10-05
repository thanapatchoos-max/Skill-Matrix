import io

with io.open("src/pages/CompareView.tsx", "r", encoding="utf-8") as f:
    text = f.read()

old_select = """              <div className="relative">
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="w-full md:w-56 appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >"""
new_select = """              <div className="relative">
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  disabled={!isManager}
                  className={`w-full md:w-56 appearance-none border border-slate-300 py-2 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none ${!isManager ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-800 focus:ring-2 focus:ring-blue-500'}`}
                >"""
text = text.replace(old_select, new_select)

with io.open("src/pages/CompareView.tsx", "w", encoding="utf-8") as f:
    f.write(text)

