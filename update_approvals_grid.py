import io

with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Change the pending container
old_container = """      {/* PENDING CARDS LIST */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          {filteredPending.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <CheckCircle size={36} className="mx-auto mb-3 text-emerald-400" />
              <p className="font-semibold text-slate-600">ไม่มีรายการรออนุมัติในขณะนี้</p>
            </div>
          )}"""

new_container = """      {/* PENDING CARDS LIST */}
      {activeTab === 'pending' && (
        <div className={flowFilter === 'all' ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start" : "space-y-6"}>
          {filteredPending.length === 0 && (
            <div className={`bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 ${flowFilter === 'all' ? 'lg:col-span-2 xl:col-span-3' : ''}`}>
              <CheckCircle size={36} className="mx-auto mb-3 text-emerald-400" />
              <p className="font-semibold text-slate-600">ไม่มีรายการรออนุมัติในขณะนี้</p>
            </div>
          )}"""

text = text.replace(old_container, new_container)

# We also need to fix the buttons flex direction to wrap if narrow
# Current buttons: <div className="flex items-center gap-3 pt-1">
# Change to: <div className="flex flex-wrap items-center gap-2 pt-1">
text = text.replace('className="flex items-center gap-3 pt-1"', 'className="flex flex-wrap items-center gap-2 pt-1"')

# And the card header:
# <div className="flex items-start justify-between gap-4">
# Change to: <div className="flex flex-col gap-4">
text = text.replace('<div className="flex items-start justify-between gap-4">', '<div className="flex flex-col 2xl:flex-row items-start justify-between gap-4">')

# Also the text-right part for submitted date
# <div className="text-right text-xs text-slate-400 flex-shrink-0">
# Change to: <div className="text-left 2xl:text-right text-xs text-slate-400 flex-shrink-0">
text = text.replace('<div className="text-right text-xs text-slate-400 flex-shrink-0">', '<div className="text-left 2xl:text-right text-xs text-slate-400 flex-shrink-0">')

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Approvals grid layout applied")
