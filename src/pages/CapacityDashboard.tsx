import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { Activity, Users, Clock, AlertTriangle, TrendingUp, Briefcase, Settings, X, Save, Edit3 } from 'lucide-react';

const initialCapacityData = [
  { section: 'Production', staff: 25, capacity: 200, planLoad: 180, actualLoad: 195, planPercent: 90, actualPercent: 97.5 },
  { section: 'QC Section', staff: 15, capacity: 120, planLoad: 130, actualLoad: 110, planPercent: 108, actualPercent: 91.6 },
  { section: 'Engineering', staff: 10, capacity: 80, planLoad: 70, actualLoad: 75, planPercent: 87.5, actualPercent: 93.7 },
  { section: 'Maintenance', staff: 8, capacity: 64, planLoad: 60, actualLoad: 60, planPercent: 93.7, actualPercent: 93.7 },
  { section: 'Warehouse', staff: 12, capacity: 96, planLoad: 100, actualLoad: 90, planPercent: 104, actualPercent: 93.7 },
];

export default function CapacityDashboard({ userRole = 'admin' }: { userRole?: string }) {
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
  };
  const totalCapacity = capacityData.reduce((sum, d) => sum + d.capacity, 0);
  const totalActual = capacityData.reduce((sum, d) => sum + d.actualLoad, 0);
  const overallLoad = ((totalActual / totalCapacity) * 100).toFixed(1);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
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

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Users size={18} /> <span className="text-sm font-semibold">จำนวนพนักงานรวม</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-800">70 <span className="text-sm font-medium text-slate-500">Staff</span></h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-indigo-500 mb-2">
            <Briefcase size={18} /> <span className="text-sm font-semibold">กำลังการผลิตสูงสุดรวม</span>
          </div>
          <h2 className="text-3xl font-bold text-indigo-700">560 <span className="text-sm font-medium text-indigo-400">Hours/Day</span></h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-500 mb-2">
            <Clock size={18} /> <span className="text-sm font-semibold">ภาระงานที่ทำจริงรวม</span>
          </div>
          <h2 className="text-3xl font-bold text-emerald-700">530 <span className="text-sm font-medium text-emerald-500">Hours/Day</span></h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm bg-rose-50/30">
          <div className="flex items-center gap-3 text-rose-500 mb-2">
            <TrendingUp size={18} /> <span className="text-sm font-semibold">อัตราภาระงานรวม (%)</span>
          </div>
          <h2 className="text-3xl font-bold text-rose-600">{overallLoad}%</h2>
          <p className="text-xs text-rose-500 mt-1 font-medium">ค่ามาตรฐานอยู่ที่ 85-95%</p>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Plan vs Actual vs Capacity (Hours) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Plan vs ภาระงานที่ทำจริงรวม vs Capacity (Hours)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={capacityData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="section" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="planLoad" name="งานตามแผน (ชม.)" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="actualLoad" name="งานทำจริง (ชม.)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="capacity" name="กำลังคนสูงสุด (ชม.)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Load Percentage */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6">สัดส่วนภาระงานรายแผนก (ร้อยละ)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="section" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="planPercent" name="Plan Load (%)" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="actualPercent" name="Actual Load (%)" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20}>
                </Bar>
                {/* 100% Reference Line */}
                <Line type="step" dataKey={() => 100} name="100% Capacity" stroke="#ef4444" strokeDasharray="5 5" dot={false} strokeWidth={1} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800">รายละเอียดกำลังคนแยกตามแผนก</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wide">
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3 text-center">จำนวนพนักงาน</th>
                <th className="px-4 py-3 text-center">กำลังคนสูงสุด (ชม.)</th>
                <th className="px-4 py-3 text-center">งานตามแผน (ชม.)</th>
                <th className="px-4 py-3 text-center">งานทำจริง (ชม.)</th>
                <th className="px-4 py-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {capacityData.map((d, i) => {
                const isOver = d.actualPercent > 100;
                const isUnder = d.actualPercent < 80;
                return (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-800">{d.section}</td>
                    <td className="px-4 py-3 text-center text-slate-600">{d.staff}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-600">{d.capacity}</td>
                    <td className="px-4 py-3 text-center font-medium text-slate-500">{d.planLoad} <span className="text-[10px]">({d.planPercent}%)</span></td>
                    <td className="px-4 py-3 text-center font-bold text-indigo-600">{d.actualLoad} <span className="text-[10px]">({d.actualPercent}%)</span></td>
                    <td className="px-4 py-3 text-center">
                      {isOver ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700"><AlertTriangle size={12}/> ภาระงานเกินกำลัง</span>
                      ) : isUnder ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">ภาระงานต่ำกว่าเกณฑ์</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">ภาระงานอยู่ในเกณฑ์ปกติ</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Data Modal */}
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
      )}
    </div>
  );
}
