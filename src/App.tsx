import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import IndividualSkillMatrix from './pages/IndividualSkillMatrix';
import SectionSkillMatrix from './pages/SectionSkillMatrix';
import Training from './pages/Training';
import Approvals from './pages/Approvals';
import { EmployeeManagement } from './pages/Employees';
import { MasterData } from './pages/MasterData';
import { Reports } from './pages/Reports';
import { CompareSkillMatrix } from './pages/CompareView';
import { Settings } from './pages/Placeholders';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Top Header / Header right area */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Skill Matrix & Workforce Competency Management System
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">3</span>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <div className="font-bold text-slate-700 text-sm">สมชาย วงศ์ไทย</div>
                <div className="text-xs text-slate-500">ผู้จัดการฝ่ายทรัพยากรบุคคล</div>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'overview' && <SectionSkillMatrix />}
        {currentPage === 'individual' && <IndividualSkillMatrix />}
        {currentPage === 'compare' && <CompareSkillMatrix />}
        {currentPage === 'approvals' && <Approvals />}
        {currentPage === 'employees' && <EmployeeManagement />}
        {currentPage === 'master-data' && <MasterData />}
        {currentPage === 'training' && <Training />}
        {currentPage === 'reports' && <Reports />}
        {currentPage === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default App;
