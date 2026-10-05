import io
import re

with io.open("src/pages/IndividualSkillMatrix.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Find the section to remove. It starts with something like:
# <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
#           <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
#             <h3 className="font-bold text-slate-800 flex items-center gap-2">
#               <BookOpen size={18} className="text-blue-600" /> ประวัติการทดสอบและประเมินผล OJT (OJT Assessment History Log)
#             </h3>

# I'll just use regex to remove the whole div containing OJT Assessment History Log
# The safest way is to find the index of "ประวัติการทดสอบและประเมินผล OJT" and trace back to its parent <div>, 
# then find the matching closing </div>.

# Let's see the context first.
