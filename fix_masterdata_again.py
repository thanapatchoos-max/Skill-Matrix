import io
import re

with io.open("src/pages/MasterData.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Fix MASTER_WIS.id -> code
text = text.replace('key={wi.id}', 'key={wi.code}')

# Fix SKILL_TYPES mapping (it's a Record<string, string>)
bad_skills = """                {SKILL_TYPES.map(st => (
                  <tr key={st.code} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-800">{st.code} - {st.name}</td>
                    <td className="px-4 py-3 text-slate-500">{st.description}</td>
                    <td className="px-4 py-3 text-center"><button className="text-slate-400 hover:text-blue-600"><Edit size={16}/></button></td>
                  </tr>
                ))}"""

good_skills = """                {Object.entries(SKILL_TYPES).map(([code, name]) => (
                  <tr key={code} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-800">{code}</td>
                    <td className="px-4 py-3 text-slate-700">{name}</td>
                    <td className="px-4 py-3 text-center"><button className="text-slate-400 hover:text-blue-600"><Edit size={16}/></button></td>
                  </tr>
                ))}"""

text = text.replace(bad_skills, good_skills)

# Fix DEPARTMENTS mapping (it's an array of objects {id, label})
bad_depts = """              {DEPARTMENTS.map(dept => (
                <div key={dept} className="p-4 border rounded-xl flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="font-bold text-slate-700">{dept}</span>
                  <button className="text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
                </div>
              ))}"""

good_depts = """              {DEPARTMENTS.map(dept => (
                <div key={dept.id} className="p-4 border rounded-xl flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="font-bold text-slate-700">{dept.label}</span>
                  <button className="text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
                </div>
              ))}"""

text = text.replace(bad_depts, good_depts)

with io.open("src/pages/MasterData.tsx", "w", encoding="utf-8") as f:
    f.write(text)
