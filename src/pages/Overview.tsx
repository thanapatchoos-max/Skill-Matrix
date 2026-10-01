import React from 'react';
import { Search, Download, ArrowUpRight, BarChart2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function Overview() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">QC Division • ISO 17025</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Workforce intelligence</h2>
          <p className="text-slate-500 font-medium">A clear view of capability, coverage, and development across your teams.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2.5 rounded-xl border border-white/50 shadow-sm flex items-center gap-2 backdrop-blur-md">
            <span className="text-slate-400 text-sm">Section</span>
            <select className="bg-transparent font-semibold text-slate-700 focus:outline-none text-sm cursor-pointer">
              <option>All sections</option>
              <option>Circuit Assembly</option>
            </select>
          </div>
          <div className="bg-white px-4 py-2.5 rounded-xl border border-white/50 shadow-sm flex items-center gap-2 backdrop-blur-md">
            <span className="text-slate-400 text-sm">Year</span>
            <select className="bg-transparent font-semibold text-slate-700 focus:outline-none text-sm cursor-pointer">
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 text-sm">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Large Card: Team Capability */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Individual Matrix</div>
              <h3 className="text-xl font-bold text-slate-800">Team capability</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search employee" 
                className="bg-slate-100/70 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 w-48 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="text-center">
                  <th className="text-left font-medium text-slate-500 text-xs pb-4 w-1/3">Employee</th>
                  <th className="font-semibold text-blue-600 text-sm pb-4">
                    <div className="mb-1">A</div>
                    <div className="text-[10px] font-medium text-slate-400">Circuit Connecting</div>
                  </th>
                  <th className="font-semibold text-blue-600 text-sm pb-4">
                    <div className="mb-1">B</div>
                    <div className="text-[10px] font-medium text-slate-400">Operator</div>
                  </th>
                  <th className="font-semibold text-blue-600 text-sm pb-4">
                    <div className="mb-1">C</div>
                    <div className="text-[10px] font-medium text-slate-400">Report</div>
                  </th>
                  <th className="font-semibold text-blue-600 text-sm pb-4">
                    <div className="mb-1">D</div>
                    <div className="text-[10px] font-medium text-slate-400">Analyze</div>
                  </th>
                  <th className="font-medium text-slate-500 text-xs pb-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <EmployeeRow initials="SC" name="Somchai Chaiyo" role="Senior Technician" scores={[3,2,2,1]} total={8} />
                <EmployeeRow initials="AK" name="Arunee Kittipong" role="Quality Engineer" scores={[2,3,3,2]} total={10} color="bg-blue-100 text-blue-700" />
                <EmployeeRow initials="KP" name="Krit Phonsri" role="Technician" scores={[2,2,1,2]} total={7} />
                <EmployeeRow initials="NL" name="Narin Lertchai" role="Junior Engineer" scores={[1,2,2,1]} total={6} />
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center gap-6 pt-4 border-t border-slate-50">
            <span className="text-xs font-semibold text-slate-400">Skill level</span>
            <LegendItem level={0} label="Level 0" />
            <LegendItem level={1} label="Level 1" />
            <LegendItem level={2} label="Level 2" />
            <LegendItem level={3} label="Level 3" />
          </div>
        </div>

        {/* Right Top Card: Organization Score */}
        <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 flex flex-col relative overflow-hidden">
          <div className="absolute top-6 right-6 text-blue-500">
            <ArrowUpRight size={24} />
          </div>
          
          <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">Organization Score</div>
          
          <div className="mb-8">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-slate-900 tracking-tighter">2.4</span>
              <span className="text-xl font-semibold text-slate-500">/ 3.0</span>
            </div>
            <p className="text-slate-500 text-sm mt-2 font-medium">Average skill level • All sections</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto">
            <MiniCard label="Employees" value="48" />
            <MiniCard label="Work instructions" value="12" />
            <MiniCard label="Advanced" value="6" valueColor="text-emerald-500" />
            <MiniCard label="Pending" value="1" valueColor="text-amber-500" />
          </div>
        </div>

        {/* Bottom Left Card: Yearly Progress */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Yearly Progress</div>
              <h3 className="text-lg font-bold text-slate-800">Skill growth</h3>
            </div>
            <div className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              <ArrowUpRight size={14} />
              +0.6
            </div>
          </div>
          <div className="h-48 flex items-end justify-between px-2 gap-2 mt-8">
            <div className="w-full bg-indigo-200/40 rounded-t-lg h-[40%] hover:bg-indigo-300 transition-colors cursor-pointer relative group">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">1.2</span>
            </div>
            <div className="w-full bg-indigo-300/50 rounded-t-lg h-[55%] hover:bg-indigo-400 transition-colors cursor-pointer relative group">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">1.5</span>
            </div>
            <div className="w-full bg-indigo-400/60 rounded-t-lg h-[75%] hover:bg-indigo-500 transition-colors cursor-pointer relative group">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">2.0</span>
            </div>
            <div className="w-full bg-blue-500 rounded-t-lg h-[90%] hover:bg-blue-600 transition-colors cursor-pointer relative group shadow-[0_-4px_10px_rgba(59,130,246,0.3)]">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 opacity-100">2.4</span>
            </div>
          </div>
        </div>

        {/* Bottom Right Card: Section Matrix */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Section Matrix</div>
              <h3 className="text-lg font-bold text-slate-800">Coverage by team</h3>
            </div>
            <div className="text-slate-400">
              <BarChart2 size={20} />
            </div>
          </div>
          
          <div className="space-y-5 mt-4">
            <ProgressBar label="Circuit Assembly" value={2.8} />
            <ProgressBar label="Operator Line 2" value={2.3} />
            <ProgressBar label="Reporting" value={1.9} />
            <ProgressBar label="Data & Analysis" value={2.5} />
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Sub Components ---

function EmployeeRow({ initials, name, role, scores, total, color = "bg-indigo-100 text-indigo-700" }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="py-4">
        <div className="flex items-center gap-3">
          <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm", color)}>
            {initials}
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{name}</div>
            <div className="text-xs text-slate-500">{role}</div>
          </div>
        </div>
      </td>
      {scores.map((score: number, idx: number) => (
        <td key={idx} className="text-center py-4">
          <ScorePill score={score} />
        </td>
      ))}
      <td className="text-right py-4">
        <span className="font-bold text-slate-800">{total}</span>
        <span className="text-xs text-slate-400 font-medium"> / 12</span>
      </td>
    </tr>
  );
}

function ScorePill({ score }: { score: number }) {
  const getStyle = (s: number) => {
    switch(s) {
      case 3: return { bg: 'var(--color-level-3-bg)', color: 'var(--color-level-3-text)', label: 'Can teach' };
      case 2: return { bg: 'var(--color-level-2-bg)', color: 'var(--color-level-2-text)', label: 'Independent' };
      case 1: return { bg: 'var(--color-level-1-bg)', color: 'var(--color-level-1-text)', label: 'Supervised' };
      default: return { bg: 'var(--color-level-0-bg)', color: 'var(--color-level-0-text)', label: 'Cannot' };
    }
  };
  const style = getStyle(score);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
        style={{ backgroundColor: style.bg, color: style.color }}
      >
        {score}
      </div>
      <div className="text-[10px] font-medium text-slate-400">{style.label}</div>
    </div>
  );
}

function LegendItem({ level, label }: { level: number, label: string }) {
  const getStyle = (s: number) => {
    switch(s) {
      case 3: return 'bg-[var(--color-level-3-bg)]';
      case 2: return 'bg-[var(--color-level-2-bg)]';
      case 1: return 'bg-[var(--color-level-1-bg)]';
      default: return 'bg-[var(--color-level-0-bg)]';
    }
  };
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
      <span className={clsx("w-2.5 h-2.5 rounded-full", getStyle(level))}></span>
      {label}
    </div>
  );
}

function MiniCard({ label, value, valueColor = "text-slate-800" }: any) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm shadow-blue-900/5 flex flex-col justify-between">
      <div className={clsx("text-2xl font-bold tracking-tight mb-2", valueColor)}>{value}</div>
      <div className="text-[11px] font-semibold text-slate-400 uppercase">{label}</div>
    </div>
  );
}

function ProgressBar({ label, value }: { label: string, value: number }) {
  const percentage = (value / 3) * 100;
  return (
    <div>
      <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
        <span>{label}</span>
        <span>{value} <span className="text-xs text-slate-400 font-medium">/ 3</span></span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
