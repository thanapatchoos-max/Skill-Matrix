import React, { useState } from 'react';
import { Search, Download, Target, History, Maximize2 } from 'lucide-react';
import { employees, skillsMaster, skillTypesMaster } from '../mockData';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { clsx } from 'clsx';

export default function Skills() {
  const [selectedEmp, setSelectedEmp] = useState<any>(null);

  const renderScore = (score: number) => {
    switch(score) {
      case 3: return <div className="w-8 h-8 rounded-full bg-[var(--color-level-3-bg)] text-[var(--color-level-3-text)] flex items-center justify-center font-bold text-sm mx-auto shadow-sm">3</div>;
      case 2: return <div className="w-8 h-8 rounded-full bg-[var(--color-level-2-bg)] text-[var(--color-level-2-text)] flex items-center justify-center font-bold text-sm mx-auto shadow-sm">2</div>;
      case 1: return <div className="w-8 h-8 rounded-full bg-[var(--color-level-1-bg)] text-[var(--color-level-1-text)] flex items-center justify-center font-bold text-sm mx-auto shadow-sm">1</div>;
      default: return <div className="w-8 h-8 rounded-full bg-[var(--color-level-0-bg)] text-[var(--color-level-0-text)] flex items-center justify-center font-bold text-sm mx-auto shadow-sm">-</div>;
    }
  };

  const radarData = [
    { subject: 'Type A', A: 80, fullMark: 100 },
    { subject: 'Type B', A: 90, fullMark: 100 },
    { subject: 'Type C', A: 60, fullMark: 100 },
    { subject: 'Type D', A: 40, fullMark: 100 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Skill Matrix Database</h2>
          <p className="text-slate-500 font-medium">Detailed view of all work instructions and employee competencies.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search matrix..." 
              className="bg-white border border-white/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 w-64 shadow-sm backdrop-blur-md transition-all"
            />
          </div>
          <button className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm border border-slate-100 transition-all flex items-center gap-2 text-sm">
            <Download size={16} />
            Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Full Matrix Grid (Left) */}
        <div className={clsx("bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-500", selectedEmp ? "xl:col-span-2" : "xl:col-span-3")}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Department Grid</h3>
            {!selectedEmp && (
              <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Click on any employee to view their detailed profile</span>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b-2 border-slate-100 bg-white font-semibold text-slate-700 sticky left-0 z-10 w-64">
                    Employee
                  </th>
                  {skillsMaster.map(wi => (
                    <th key={wi.id} colSpan={4} className="p-4 border-b-2 border-l border-slate-100 bg-white font-semibold text-slate-700 text-center">
                      <div className="text-sm">{wi.id}</div>
                      <div className="text-xs font-normal text-slate-500 mt-1">{wi.name}</div>
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="p-2 border-b border-slate-100 bg-white sticky left-0 z-10"></th>
                  {skillsMaster.map((wi, wIdx) => (
                    skillTypesMaster.map((st, sIdx) => (
                      <th key={`${wi.id}_${st.id}`} className={clsx("p-2 border-b border-slate-100 bg-white text-xs font-medium text-slate-400 text-center", sIdx === 0 && wIdx > 0 && "border-l")}>
                        {st.id}
                      </th>
                    ))
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr 
                    key={emp.id} 
                    onClick={() => setSelectedEmp(emp)}
                    className={clsx(
                      "hover:bg-slate-50/70 transition-colors cursor-pointer group",
                      selectedEmp?.id === emp.id && "bg-blue-50/50"
                    )}
                  >
                    <td className="p-4 border-b border-slate-50 bg-white group-hover:bg-transparent sticky left-0 z-10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm", i % 2 === 0 ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700")}>
                          {emp.initials}
                        </div>
                        <div>
                          <div className={clsx("font-bold text-sm transition-colors", selectedEmp?.id === emp.id ? "text-blue-600" : "text-slate-800")}>{emp.name}</div>
                          <div className="text-xs text-slate-500">{emp.position}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Mock scores generation for display */}
                    {skillsMaster.map((wi, wIdx) => (
                      skillTypesMaster.map((st, sIdx) => {
                        // Generate randomish looking consistent scores based on employee index and type
                        const score = Math.max(0, 3 - ((i + sIdx) % 4));
                        return (
                          <td key={`${wi.id}_${st.id}`} className={clsx("p-2 border-b border-slate-50 text-center", sIdx === 0 && wIdx > 0 && "border-l border-slate-100")}>
                            {renderScore(score)}
                          </td>
                        );
                      })
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Individual Profile Pop-out (Right) */}
        {selectedEmp && (
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-right-8 duration-500 xl:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative">
              <button 
                onClick={() => setSelectedEmp(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm transition-colors"
              >
                <Maximize2 size={14} className="rotate-45" />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg mb-4 ring-4 ring-white/20">
                  {selectedEmp.initials}
                </div>
                <h3 className="text-xl font-bold">{selectedEmp.name}</h3>
                <p className="text-blue-200 text-sm">{selectedEmp.position}</p>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-800">
                <Target size={16} className="text-blue-500" />
                Skill Radar Analysis
              </div>
              
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} dot={{r: 4, fill: '#3b82f6'}} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-800">
                <History size={16} className="text-blue-500" />
                Recent Development
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">↑</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Level 2 in Reporting (Type C)</div>
                    <div className="text-xs text-slate-500">Completed 20 jobs independently</div>
                    <div className="text-[10px] font-semibold text-slate-400 mt-1">Oct 2026</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">+</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Passed OJT: QCW002-001</div>
                    <div className="text-xs text-slate-500">Certified by Chief Engineer</div>
                    <div className="text-[10px] font-semibold text-slate-400 mt-1">Aug 2026</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
