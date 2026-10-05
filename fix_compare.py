import io
import re

with io.open("src/pages/CompareView.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Update signature
old_sig = "export function CompareSkillMatrix() {"
new_sig = "export function CompareSkillMatrix({ userRole = 'admin' }: { userRole?: string }) {"
text = text.replace(old_sig, new_sig)

# Add role logic
state_old = """  const [compareMode, setCompareMode] = useState<'year' | 'department'>('year');
  const [selectedDept, setSelectedDept] = useState('ALL');"""
state_new = """  const isStaff = userRole === 'staff' || userRole === 'clerk';
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager' || userRole === 'admin';

  const [compareMode, setCompareMode] = useState<'year' | 'department'>('year');
  const [selectedDept, setSelectedDept] = useState(isManager ? 'ALL' : 'QC Section');"""
text = text.replace(state_old, state_new)

# Hide toggle for non-managers
toggle_old = """            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setCompareMode('year')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${compareMode === 'year' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                <TrendingUp size={16} /> แนวโน้มการพัฒนาข้ามปี (2025 vs 2026)
              </button>
              <button
                onClick={() => setCompareMode('department')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${compareMode === 'department' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                <Layers size={16} /> เปรียบเทียบระหว่างแผนก (Cross-Dept)
              </button>
            </div>"""
            
toggle_new = """            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setCompareMode('year')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${compareMode === 'year' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                <TrendingUp size={16} /> แนวโน้มการพัฒนาข้ามปี (2025 vs 2026)
              </button>
              {isManager && (
                <button
                  onClick={() => setCompareMode('department')}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${compareMode === 'department' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <Layers size={16} /> เปรียบเทียบระหว่างแผนก (Cross-Dept)
                </button>
              )}
            </div>"""
text = text.replace(toggle_old, toggle_new)

with io.open("src/pages/CompareView.tsx", "w", encoding="utf-8") as f:
    f.write(text)

