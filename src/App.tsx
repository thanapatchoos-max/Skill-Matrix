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
import WorkingRecord from './pages/WorkingRecord';
import CapacityDashboard from './pages/CapacityDashboard';
import SkillEvaluation from './pages/SkillEvaluation';
import { CompareSkillMatrix } from './pages/CompareView';
import { SettingsPage } from './pages/SettingsPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { LoginPage } from './pages/LoginPage';
import { StaffDashboard } from './pages/StaffDashboard';
import { WILibrary } from './pages/WILibrary';
import { Bell, LogOut, Settings as SettingsIcon } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLoginSuccess = (role: string) => {
    setUserRole(role);
    setIsLoggedIn(true);
    if (role === 'staff') {
      setCurrentPage('staff-dashboard');
    } else if (role === 'manager') {
      setCurrentPage('approvals');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex print:bg-white print:block">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} userRole={userRole} />
      
      <main className="flex-1 ml-64 p-8 print:ml-0 print:p-0 print:block">
        {/* Top Header / Header right area */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Skill Matrix & Workforce Competency Management System
          </div>
          <div className="flex items-center gap-4">
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-100 font-semibold text-sm text-slate-700 flex justify-between items-center">
                    การแจ้งเตือน
                    <span className="text-xs text-blue-600 cursor-pointer hover:underline">อ่านทั้งหมด</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                      <div className="text-sm font-semibold text-slate-700">มีรายการประเมินใหม่ที่ต้องอนุมัติ</div>
                      <div className="text-xs text-slate-500 mt-1">สมชาย ขอรับการประเมินทักษะ React (Level 2)</div>
                      <div className="text-xs text-slate-400 mt-1">10 นาทีที่แล้ว</div>
                    </div>
                    <div className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                      <div className="text-sm font-semibold text-slate-700">มีพนักงานเข้าใหม่ในแผนก</div>
                      <div className="text-xs text-slate-500 mt-1">กรุณากำหนดเป้าหมายทักษะให้พนักงานใหม่</div>
                      <div className="text-xs text-slate-400 mt-1">2 ชั่วโมงที่แล้ว</div>
                    </div>
                  </div>
                  <div className="p-2 text-center border-t border-slate-100">
                    <button className="text-xs text-blue-600 font-medium hover:underline">ดูการแจ้งเตือนทั้งหมด</button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 relative">
              <div className="text-right">
                <div className="font-bold text-slate-700 text-sm">สมชาย วงศ์ไทย</div>
                <div className="text-xs text-slate-500">
                  {userRole === 'admin' ? 'System Admin' : 
                   userRole === 'manager' ? 'Department Manager' : 
                   userRole === 'chief' ? 'Section Chief' : 'Staff'}
                </div>
              </div>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all focus:outline-none"
              >
                <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                  <div className="py-1">
                    <button onClick={() => { setCurrentPage('settings'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <SettingsIcon size={16} className="text-slate-400" />
                      ตั้งค่าบัญชีผู้ใช้
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        {currentPage === 'staff-dashboard' && <StaffDashboard userRole={userRole} onNavigatePage={(page) => setCurrentPage(page)} />}
        {currentPage === 'wi-library' && <WILibrary userRole={userRole} />}
        {currentPage === 'dashboard' && <Dashboard userRole={userRole} />}
        {currentPage === 'overview' && <SectionSkillMatrix userRole={userRole} />}
        {currentPage === 'individual' && <IndividualSkillMatrix userRole={userRole} />}
        {currentPage === 'compare' && <CompareSkillMatrix userRole={userRole} />}
        {currentPage === 'approvals' && <Approvals userRole={userRole} />}
        {currentPage === 'employees' && <EmployeeManagement userRole={userRole} />}
        {currentPage === 'master-data' && <MasterData userRole={userRole} />}
        {currentPage === 'training' && <Training userRole={userRole} />}
        {currentPage === 'reports' && <Reports userRole={userRole} />}
                    {currentPage === 'working-record' && <WorkingRecord userRole={userRole} />}
          {currentPage === 'capacity' && <CapacityDashboard userRole={userRole} />}
          {currentPage === 'evaluation' && <SkillEvaluation userRole={userRole} />}

        {currentPage === 'settings' && (
          <SettingsPage onNavigateToPermissions={() => setCurrentPage('permissions')} />
        )}
        {currentPage === 'permissions' && (
          <PermissionsPage onBackToSettings={() => setCurrentPage('settings')} />
        )}
      </main>
    </div>
  );
}

export default App;
