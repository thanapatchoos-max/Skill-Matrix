import React from 'react';
import { Building2, Users, FileText, ArrowRight } from 'lucide-react';

const sections = [
  { id: 'QC', name: 'Quality Control', employees: 48, wis: 12, avgScore: 2.4, status: 'Active' },
  { id: 'PROD', name: 'Production', employees: 156, wis: 45, avgScore: 1.8, status: 'Active' },
  { id: 'ENG', name: 'Engineering', employees: 32, wis: 18, avgScore: 2.7, status: 'Active' },
];

export default function Sections() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Organization Sections</h2>
          <p className="text-slate-500 font-medium">Manage departments, sections, and their master data configurations.</p>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-500/20 transition-all text-sm">
          + Add New Section
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(section => (
          <div key={section.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <Building2 size={24} />
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                {section.status}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{section.name}</h3>
            <p className="text-slate-400 text-sm font-medium mb-6">ID: {section.id}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Users size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Staff</span>
                </div>
                <div className="text-xl font-bold text-slate-700">{section.employees}</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <FileText size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">W/I</span>
                </div>
                <div className="text-xl font-bold text-slate-700">{section.wis}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Avg Score</div>
                <div className="text-lg font-bold text-blue-600">{section.avgScore} <span className="text-xs text-slate-400">/ 3.0</span></div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Master Data Section (Phase 1 conceptual) */}
      <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Master Data Management</h3>
          <p className="text-slate-500 max-w-lg">Configure Work Instructions (W/I), Skill Types (A, B, C, D) and Role Expectations for the entire organization.</p>
        </div>
        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-colors text-sm">
            Manage W/I
          </button>
          <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors text-sm">
            Skill Types
          </button>
        </div>
      </div>

    </div>
  );
}
