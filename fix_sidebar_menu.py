import io
import re

with io.open("src/components/Sidebar.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# I will replace everything from {/* Main Navigation Items */} to {/* Sidebar Footer */}
start_marker = "{/* Main Navigation Items */}"
end_marker = "{/* Sidebar Footer */}"

new_menu = """{/* Main Navigation Items */}
      <div className="flex-1 py-3 overflow-y-auto flex flex-col gap-0.5 custom-scrollbar">
        
        {/* ============================== */}
        {/* 1. OPERATIONS (ระบบปฏิบัติการรายวัน) */}
        {/* ============================== */}
        <div className="mt-2 mb-1 px-6 text-[10px] font-bold text-[#8fb4d8] uppercase tracking-wider">
          ระบบปฏิบัติการ (Operations)
        </div>

        {/* Dashboard */}
        {isStaff ? (
          <NavItem icon={Home} label="แดชบอร์ดส่วนตัว" active={currentPage === 'staff-dashboard'} onClick={() => setCurrentPage('staff-dashboard')} />
        ) : (
          <NavItem icon={LayoutDashboard} label="แดชบอร์ด" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
        )}

        {/* Working Record (All roles can view depending on visibility logic inside) */}
        <NavItem icon={ClipboardList} label="บันทึกการทำงาน" active={currentPage === 'working-record'} onClick={() => setCurrentPage('working-record')} />

        {/* Skill Evaluation (All roles) */}
        <NavItem icon={Award} label="ระบบประเมินทักษะ" active={currentPage === 'evaluation'} onClick={() => setCurrentPage('evaluation')} />

        {/* Training (Chief, Admin, Staff might need to see requests if we allowed, let's keep it available) */}
        <NavItem icon={GraduationCap} label="ระบบจัดการการฝึกอบรม" active={currentPage === 'training'} onClick={() => setCurrentPage('training')} />

        {/* Approvals (Manager, Admin) */}
        {(isAdmin || isManager) && (
          <NavItem icon={CheckSquare} label="การอนุมัติ (Approval)" active={currentPage === 'approvals'} onClick={() => setCurrentPage('approvals')} badge={6} />
        )}

        {/* ============================== */}
        {/* 2. ANALYTICS (การวิเคราะห์ผล) */}
        {/* ============================== */}
        <div className="mt-4 mb-1 px-6 text-[10px] font-bold text-[#8fb4d8] uppercase tracking-wider">
          การวิเคราะห์ (Analytics)
        </div>

        {/* Skill Matrix Submenu */}
        <div>
          <button 
            onClick={() => setSkillMatrixOpen(!skillMatrixOpen)}
            className={clsx(
              "w-full flex items-center justify-between px-6 py-2.5 text-sm transition-colors",
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
            <div className="bg-black/20 py-1.5 flex flex-col">
              {!isStaff && (
                <SubNavItem label="ภาพรวม Skill Matrix" active={currentPage === 'overview'} onClick={() => setCurrentPage('overview')} />
              )}
              <SubNavItem label={isStaff ? "ทักษะของฉัน (My Skills)" : "ทักษะรายบุคคล (Individual)"} active={currentPage === 'individual'} onClick={() => setCurrentPage('individual')} />
              {(isAdmin || isManager || isChief) && (
                <SubNavItem label="เปรียบเทียบ Skill Matrix" active={currentPage === 'compare'} onClick={() => setCurrentPage('compare')} />
              )}
            </div>
          )}
        </div>

        {/* Workload & Capacity */}
        {(isAdmin || isManager || isChief) && (
          <NavItem icon={Activity} label="Workload & Capacity" active={currentPage === 'capacity'} onClick={() => setCurrentPage('capacity')} />
        )}

        {/* Reports */}
        {(isAdmin || isManager || isChief) && (
          <NavItem icon={BarChart2} label="รายงาน (Reports)" active={currentPage === 'reports'} onClick={() => setCurrentPage('reports')} />
        )}

        {/* ============================== */}
        {/* 3. MANAGEMENT (จัดการระบบ) */}
        {/* ============================== */}
        <div className="mt-4 mb-1 px-6 text-[10px] font-bold text-[#8fb4d8] uppercase tracking-wider">
          จัดการระบบ (Management)
        </div>

        <NavItem icon={BookOpen} label="คลังคู่มือ W/I" active={currentPage === 'wi-library'} onClick={() => setCurrentPage('wi-library')} />

        {(isAdmin || isChief || isManager) && (
          <NavItem icon={Users} label="จัดการพนักงาน" active={currentPage === 'employees'} onClick={() => setCurrentPage('employees')} />
        )}

        {(isAdmin || isManager || isChief) && (
          <NavItem icon={Database} label="จัดการข้อมูลพื้นฐาน" active={currentPage === 'master-data'} onClick={() => setCurrentPage('master-data')} />
        )}

        {(isAdmin) && (
          <>
            <NavItem icon={Settings} label="ตั้งค่าระบบ" active={currentPage === 'settings'} onClick={() => setCurrentPage('settings')} />
            <NavItem icon={ShieldCheck} label="สิทธิ์ & บทบาทผู้ใช้" active={currentPage === 'permissions'} onClick={() => setCurrentPage('permissions')} />
          </>
        )}
      </div>

      {/* Sidebar Footer */}"""

idx1 = text.find(start_marker)
idx2 = text.find(end_marker)

if idx1 != -1 and idx2 != -1:
    new_text = text[:idx1] + new_menu + text[idx2 + len(end_marker):]
    with io.open("src/components/Sidebar.tsx", "w", encoding="utf-8") as f:
        f.write(new_text)
    print("Replaced sidebar menus")
else:
    print("Could not find markers")
