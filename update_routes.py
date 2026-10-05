import io, re

# UPDATE SIDEBAR
with io.open("src/components/Sidebar.tsx", "r", encoding="utf-8") as f:
    text = f.read()

ops_menu_jsx = """
        {/* Operations & Production (Admin Only For Now) */}
        {isAdmin && (
          <>
            <div className="mt-4 mb-2 px-6 text-xs font-bold text-[#8fb4d8] uppercase tracking-wider">
              Operations & Production
            </div>
            <NavItem icon={ClipboardList} label="บันทึกการทำงาน (Working Record)" active={currentPage === 'working-record'} onClick={() => setCurrentPage('working-record')} />
            <NavItem icon={Activity} label="Workload & Capacity" active={currentPage === 'capacity'} onClick={() => setCurrentPage('capacity')} />
          </>
        )}
"""

# Insert it before Reports
text = text.replace("        {/* Reports (Admin, Manager) */}", ops_menu_jsx + "\n        {/* Reports (Admin, Manager) */}")

# Add icon imports
if "ClipboardList" not in text:
    text = text.replace("import { Home,", "import { Home, ClipboardList, Activity,")

with io.open("src/components/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(text)

# UPDATE APP.TSX
with io.open("src/App.tsx", "r", encoding="utf-8") as f:
    app_text = f.read()

app_imports = """
import WorkingRecord from './pages/WorkingRecord';
import CapacityDashboard from './pages/CapacityDashboard';
"""

if "WorkingRecord" not in app_text:
    app_text = app_text.replace("import Reports from './pages/Reports';", "import Reports from './pages/Reports';" + app_imports)

app_routes = """
          {currentPage === 'working-record' && <WorkingRecord />}
          {currentPage === 'capacity' && <CapacityDashboard />}
"""

if "working-record" not in app_text:
    app_text = app_text.replace("{currentPage === 'reports' && <Reports />}", "{currentPage === 'reports' && <Reports />}" + app_routes)

with io.open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(app_text)

