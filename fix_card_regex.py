import io
import re

with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Make cards stretch and use flex-col
text = text.replace('shadow-sm p-5 space-y-4 hover:', 'shadow-sm p-5 hover:border-blue-400 hover:shadow-md transition-all relative overflow-hidden h-full flex flex-col hover:')
text = text.replace('shadow-sm p-5 space-y-4 hover:', 'shadow-sm p-5 hover:border-emerald-400 hover:shadow-md transition-all relative overflow-hidden h-full flex flex-col hover:')
text = text.replace('shadow-sm p-5 space-y-4 hover:', 'shadow-sm p-5 hover:border-purple-400 hover:shadow-md transition-all relative overflow-hidden h-full flex flex-col hover:')

# Actually, I'll just use regex:
text = re.sub(r'shadow-sm p-5 space-y-4 hover:(border-[a-z]+-400) hover:shadow-md transition-all relative overflow-hidden',
              r'shadow-sm p-4 hover:\1 hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full', text)


# 2. Fix the header:
# `<div className="flex flex-col 2xl:flex-row items-start justify-between gap-4">`
# Change to: `<div className="flex items-start justify-between gap-3 mb-3">`
text = text.replace('<div className="flex flex-col 2xl:flex-row items-start justify-between gap-4">', '<div className="flex items-start justify-between gap-3 mb-3">')
text = text.replace('<div className="flex flex-col 2xl:flex-row items-start justify-between gap-4">', '<div className="flex items-start justify-between gap-3 mb-3">') # if multiple

# The avatar:
text = text.replace('<div className="flex items-start gap-4 flex-1 min-w-0">', '<div className="flex items-start gap-3 flex-1 min-w-0">')
text = text.replace('<div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">', 
                    '<div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">')
text = text.replace('<User size={18} className="text-slate-600" />', '<User size={16} className="text-slate-600" />')

# Submitter text container:
# `<div className="text-left 2xl:text-right text-xs text-slate-400 flex-shrink-0">`
# Change to: `<div className="text-right text-[10px] text-slate-500 flex-shrink-0">`
text = text.replace('<div className="text-left 2xl:text-right text-xs text-slate-400 flex-shrink-0">', '<div className="text-right text-[10px] text-slate-500 flex-shrink-0">')
text = text.replace('<div className="text-right text-xs text-slate-400 flex-shrink-0">', '<div className="text-right text-[10px] text-slate-500 flex-shrink-0">')

# Employee names and badges
text = text.replace('<span className="font-bold text-slate-800 text-base">{req.employee}</span>', '<div className="font-bold text-slate-800 text-sm truncate w-full">{req.employee}</div>')
text = text.replace('<div className="flex items-center gap-2 flex-wrap">', '<div className="flex items-center gap-1.5 flex-wrap">')

# Remove the dot separator between ID and department, and shrink badges
text = text.replace('<span className="text-xs text-slate-400">·</span>', '')
text = text.replace('<span className="text-xs font-mono text-slate-400">{req.employeeId}</span>', '<span className="text-[10px] font-mono text-slate-400">{req.employeeId}</span>')
text = text.replace('<span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{req.department}</span>', '<span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{req.department}</span>')

# WI & Skill type
text = text.replace('<div className="text-sm font-semibold text-slate-700 mt-1.5">{req.wi} · {req.skillType}</div>', '<div className="text-xs font-bold text-slate-700 mt-2 mb-1 line-clamp-2 leading-snug">{req.wi} · {req.skillType}</div>')

# Level badge gap
text = text.replace('<div className="flex items-center gap-3 mt-2 flex-wrap">', '<div className="flex items-center gap-1.5 mt-2 flex-wrap justify-center bg-slate-50 border border-slate-100 rounded-lg p-2 mb-3">')

# The reason box flex-grow:
# `<div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">`
# -> `<div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex-grow">`
text = text.replace('<div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">', '<div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex-grow mb-4">')
text = text.replace('<div className="bg-emerald-50/50 rounded-lg p-3.5 border border-emerald-100">', '<div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100 flex-grow mb-4">')
text = text.replace('<div className="bg-purple-50 rounded-lg p-3.5 border border-purple-100">', '<div className="bg-purple-50 rounded-lg p-3 border border-purple-100 flex-grow mb-4">')

# Move the reason section outside of the min-w-0 div if it is inside?
# Wait, the structure in the original file was:
# </div> (end of top flex)
# <div> (reason box)
# <div> (buttons)
# This means the reason box was already a sibling to the header.

# Shrink the buttons at the bottom:
text = text.replace('<div className="flex flex-wrap items-center gap-2 pt-1">', '<div className="flex flex-wrap items-center gap-1.5 mt-auto">')
text = text.replace('<div className="flex items-center gap-3 pt-1">', '<div className="flex flex-wrap items-center gap-1.5 mt-auto">')

text = text.replace('px-5 py-2', 'px-3 py-1.5')
text = text.replace('px-4 py-2', 'px-3 py-1.5')
text = text.replace('text-xs font-bold', 'text-[11px] font-bold')
text = text.replace('size={15}', 'size={14}')

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Regex replace applied")
