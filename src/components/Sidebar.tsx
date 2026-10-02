import React, { useState } from 'react';
import { 
  LayoutDashboard, Database, FileText, Target, Users, 
  GraduationCap, Grid, BarChart2, Settings, ChevronDown, ChevronRight, CheckSquare, ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const [skillMatrixOpen, setSkillMatrixOpen] = useState(true);

  return (
    <div className="w-64 bg-[#0a2540] text-slate-300 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto print:hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#081e36]">
        <div className="bg-white text-blue-700 font-bold px-2 py-1 rounded text-lg tracking-tighter">
          DAIHEN
        </div>
        <div className="text-white text-xs font-semibold leading-tight">
          ไดเฮ็น อิเล็คทริค จำกัด<br/>Daihen Electric Co., Ltd.
        </div>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-1">
        <NavItem 
          icon={LayoutDashboard} 
          label="แดชบอร์ด" 
          active={currentPage === 'dashboard'} 
          onClick={() => setCurrentPage('dashboard')} 
        />
        
        {/* Skill Matrix Menu with Submenu */}
        <div>
          <button 
            onClick={() => setSkillMatrixOpen(!skillMatrixOpen)}
            className={clsx(
              "w-full flex items-center justify-between px-6 py-3 text-sm transition-colors",
              skillMatrixOpen || ['overview', 'individual', 'compare'].includes(currentPage) ? "text-teal-400 bg-white/5" : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <div className="flex items-center gap-3">
              <Grid size={18} />
              <span>Skill Matrix</span>
            </div>
            {skillMatrixOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {skillMatrixOpen && (
            <div className="bg-black/20 py-2 flex flex-col">
              <SubNavItem label="ภาพรวม Skill Matrix" active={currentPage === 'overview'} onClick={() => setCurrentPage('overview')} />
              <SubNavItem label="Individual Skill Matrix" active={currentPage === 'individual'} onClick={() => setCurrentPage('individual')} />
              <SubNavItem label="เปรียบเทียบ Skill Matrix" active={currentPage === 'compare'} onClick={() => setCurrentPage('compare')} />
            </div>
          )}
        </div>

        <NavItem icon={Users} label="จัดการพนักงาน" active={currentPage === 'employees'} onClick={() => setCurrentPage('employees')} />
        <NavItem icon={Database} label="จัดการข้อมูลพื้นฐาน" active={currentPage === 'master-data'} onClick={() => setCurrentPage('master-data')} />
        <NavItem icon={CheckSquare} label="การอนุมัติ (Approval)" active={currentPage === 'approvals'} onClick={() => setCurrentPage('approvals')} badge={6} />
        <NavItem icon={GraduationCap} label="แผนการฝึกอบรม (OJT)" active={currentPage === 'training'} onClick={() => setCurrentPage('training')} />
        <NavItem icon={BarChart2} label="รายงาน (Reports)" active={currentPage === 'reports'} onClick={() => setCurrentPage('reports')} />
        <NavItem icon={Settings} label="ตั้งค่าระบบ" active={currentPage === 'settings'} onClick={() => setCurrentPage('settings')} />
        <NavItem icon={ShieldCheck} label="สิทธิ์ & บทบาทผู้ใช้" active={currentPage === 'permissions'} onClick={() => setCurrentPage('permissions')} />
      </div>

      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-xs">
            <div className="text-white font-bold">Skill Matrix System</div>
            <div className="text-[10px]">Powered by Daihen Electric</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors",
        active 
          ? "border-l-4 border-teal-400 bg-white/5 text-teal-400" 
          : "border-l-4 border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon size={18} />
      <span className="flex-1 text-left">{label}</span>
      {badge != null && badge > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
          {badge}
        </span>
      )}
    </button>
  );
}

function SubNavItem({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-3 pl-14 pr-6 py-2.5 text-xs transition-colors relative",
        active ? "text-teal-400 font-semibold" : "text-slate-400 hover:text-white"
      )}
    >
      {active && <span className="absolute left-10 w-1.5 h-1.5 rounded-full bg-teal-400"></span>}
      {!active && <span className="absolute left-10 w-1 h-1 rounded-full bg-slate-600"></span>}
      {label}
    </button>
  );
}
