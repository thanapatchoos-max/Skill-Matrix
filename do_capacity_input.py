import io

# 1. Update App.tsx
with io.open("src/App.tsx", "r", encoding="utf-8") as f:
    app_text = f.read()

app_text = app_text.replace("<CapacityDashboard />", "<CapacityDashboard userRole={userRole} />")

with io.open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(app_text)

# 2. Update CapacityDashboard.tsx
with io.open("src/pages/CapacityDashboard.tsx", "r", encoding="utf-8") as f:
    cap_text = f.read()

# Replace imports to include useState and missing lucide icons
cap_text = cap_text.replace("import React from 'react';", "import React, { useState } from 'react';")
cap_text = cap_text.replace("import { Activity, Users, Clock, AlertTriangle, TrendingUp, Briefcase } from 'lucide-react';", "import { Activity, Users, Clock, AlertTriangle, TrendingUp, Briefcase, Settings, X, Save, Edit3 } from 'lucide-react';")

# Change static constant to initial state array
old_const = """const capacityData = [
  { section: 'Production', staff: 25, capacity: 200, planLoad: 180, actualLoad: 195, planPercent: 90, actualPercent: 97.5 },
  { section: 'QC Section', staff: 15, capacity: 120, planLoad: 130, actualLoad: 110, planPercent: 108, actualPercent: 91.6 },
  { section: 'Engineering', staff: 10, capacity: 80, planLoad: 70, actualLoad: 75, planPercent: 87.5, actualPercent: 93.7 },
  { section: 'Maintenance', staff: 8, capacity: 64, planLoad: 60, actualLoad: 60, planPercent: 93.7, actualPercent: 93.7 },
  { section: 'Warehouse', staff: 12, capacity: 96, planLoad: 100, actualLoad: 90, planPercent: 104, actualPercent: 93.7 },
];"""
new_const = """const initialCapacityData = [
  { section: 'Production', staff: 25, capacity: 200, planLoad: 180, actualLoad: 195, planPercent: 90, actualPercent: 97.5 },
  { section: 'QC Section', staff: 15, capacity: 120, planLoad: 130, actualLoad: 110, planPercent: 108, actualPercent: 91.6 },
  { section: 'Engineering', staff: 10, capacity: 80, planLoad: 70, actualLoad: 75, planPercent: 87.5, actualPercent: 93.7 },
  { section: 'Maintenance', staff: 8, capacity: 64, planLoad: 60, actualLoad: 60, planPercent: 93.7, actualPercent: 93.7 },
  { section: 'Warehouse', staff: 12, capacity: 96, planLoad: 100, actualLoad: 90, planPercent: 104, actualPercent: 93.7 },
];"""

cap_text = cap_text.replace(old_const, new_const)

# Update component signature and add state/handlers
old_sig = "export default function CapacityDashboard() {"
new_sig = """export default function CapacityDashboard({ userRole = 'admin' }: { userRole?: string }) {
  const isAdmin = userRole === 'admin';
  const [capacityData, setCapacityData] = useState(initialCapacityData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState([...capacityData]);

  const handleSave = () => {
    // Recalculate percentages and capacities based on standard 8 hours per staff
    const updated = editData.map(d => {
      const newCapacity = d.staff * 8; // Assuming 8 standard hours
      return {
        ...d,
        capacity: newCapacity,
        planPercent: Number(((d.planLoad / newCapacity) * 100).toFixed(1)) || 0,
        actualPercent: Number(((d.actualLoad / newCapacity) * 100).toFixed(1)) || 0
      };
    });
    setCapacityData(updated);
    setIsModalOpen(false);
  };"""

cap_text = cap_text.replace(old_sig, new_sig)

# Add the admin button to the header
header_start = cap_text.find("      {/* Header */}")
header_end = cap_text.find("      {/* Summary Metrics */}")

old_header = cap_text[header_start:header_end]
new_header = """      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-indigo-600" /> การจัดการภาระงานและกำลังคน (Workload & Capacity)
          </h1>
          <p className="text-slate-500 text-sm mt-1">วิเคราะห์กำลังคน (Capacity) เปรียบเทียบกับภาระงานที่วางแผนไว้ (Plan Load) และที่เกิดขึ้นจริง (Actual Load) ของแต่ละแผนก</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => {
              setEditData([...capacityData]);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold shadow-md text-sm whitespace-nowrap"
          >
            <Settings size={18} /> จัดการแผนกำลังคน (Admin)
          </button>
        )}
      </div>

"""
cap_text = cap_text.replace(old_header, new_header)

# Add the modal to the bottom of the component
modal_code = """      {/* Edit Data Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Edit3 className="text-indigo-600" /> กรอกข้อมูลแผนกำลังคนและภาระงานประจำวัน
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6 text-sm text-indigo-800 flex items-start gap-3">
                <Activity className="mt-0.5 flex-shrink-0" size={18} />
                <p>
                  <strong>จำลองการเชื่อมต่อข้อมูล:</strong> ในระบบจริง (Production) ข้อมูลจำนวนพนักงานจะถูกดึงผ่าน API จากระบบ HR (เวลาเข้างาน) 
                  และงานตามแผนจะดึงจาก ERP (แผนผลิตประจำวัน) ส่วนงานทำจริงดึงจากโมดูล Working Record. 
                  สำหรับฟอร์มนี้ แอดมินสามารถกรอกตัวเลขเพื่อจำลองสถานการณ์ต่างๆ และดูผลลัพธ์บน Dashboard ทันที
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-xs text-slate-700 font-bold uppercase tracking-wide">
                      <th className="px-4 py-3">แผนก (Section)</th>
                      <th className="px-4 py-3">จำนวนพนักงาน (คน)</th>
                      <th className="px-4 py-3">งานตามแผน (ชม.)</th>
                      <th className="px-4 py-3">งานทำจริง (ชม.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editData.map((row, index) => (
                      <tr key={row.section} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-800">{row.section}</td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            value={row.staff} 
                            onChange={(e) => {
                              const newData = [...editData];
                              newData[index].staff = Number(e.target.value) || 0;
                              setEditData(newData);
                            }}
                            className="w-24 border border-slate-300 rounded-lg p-2 text-center"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            value={row.planLoad} 
                            onChange={(e) => {
                              const newData = [...editData];
                              newData[index].planLoad = Number(e.target.value) || 0;
                              setEditData(newData);
                            }}
                            className="w-24 border border-slate-300 rounded-lg p-2 text-center"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            value={row.actualLoad} 
                            onChange={(e) => {
                              const newData = [...editData];
                              newData[index].actualLoad = Number(e.target.value) || 0;
                              setEditData(newData);
                            }}
                            className="w-24 border border-slate-300 rounded-lg p-2 text-center"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-3">* กำลังคนสูงสุด (Max Capacity) จะถูกคำนวณอัตโนมัติโดยใช้เกณฑ์ทำงาน 8 ชม./คน</p>
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-2xl sticky bottom-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-sm transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition-colors shadow-md"
              >
                <Save size={18} /> บันทึกและจำลองผล
              </button>
            </div>
          </div>
        </div>
      )}"""

# Replace the closing div of the component to include the modal
cap_text = cap_text.replace("    </div>\n  );\n}", modal_code + "\n    </div>\n  );\n}")

with io.open("src/pages/CapacityDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(cap_text)
print("Updated CapacityDashboard and App.tsx")
