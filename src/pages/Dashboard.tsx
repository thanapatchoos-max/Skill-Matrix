import React from 'react';
import { WORKING_STATS, APPROVAL_STATS, DEFAULT_CAPACITY_DATA, CURRENT_USER_PROFILES } from '../lib/sharedMockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Activity, AlertTriangle, TrendingUp, BookOpen, Award, CheckCircle, Clock } from 'lucide-react';

const mockTrend = [
  { year: '2023', level1: 15, level2: 10, level3: 5 },
  { year: '2024', level1: 20, level2: 15, level3: 8 },
  { year: '2025', level1: 18, level2: 25, level3: 12 },
  { year: '2026', level1: 10, level2: 30, level3: 20 },
];

export default function Dashboard({ userRole = 'admin' }: { userRole?: string }) {
  const isChief = userRole === 'chief';
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';

  // For Chief: only show their department capacity
  const deptCapacity = DEFAULT_CAPACITY_DATA.find(d => d.section === 'QC Section');
  const totalCapacity = isChief && deptCapacity ? deptCapacity.capacity : WORKING_STATS.totalCapacityHours;
  const totalActual   = isChief && deptCapacity ? deptCapacity.actualLoad : WORKING_STATS.totalActualHours;
  const overallLoad   = ((totalActual / totalCapacity) * 100).toFixed(1);
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24 bg-slate-50 min-h-screen">
      {/* Header */}
      {isChief && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3 text-blue-800 text-sm font-semibold">
          <span>🏢</span> มุมมองหัวหน้างาน: แสดงข้อมูลเฉพาะแผนก <strong>QC Section</strong>
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="text-indigo-600" /> แดชบอร์ดผู้บริหาร (Executive Dashboard)
        </h1>
        <p className="text-slate-500 text-sm mt-1">ภาพรวมการบริหารจัดการทักษะและการผลิต (Overview of 8 Core Dashboards)</p>
      </div>

      {/* 8 Core Modules KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-indigo-600 mb-2"><Users size={16} /><span className="font-bold text-xs uppercase">กำลังการผลิตรวม (Capacity)</span></div>
          <h2 className="text-2xl font-black text-slate-800">{isChief ? (deptCapacity?.capacity ?? 0) : WORKING_STATS.totalCapacityHours} <span className="text-sm font-medium text-slate-500">Hrs/Day</span></h2>
          <p className="text-xs text-slate-400 mt-1">ชั่วโมงการทำงานสูงสุดของทุกแผนก</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-emerald-600 mb-2"><Activity size={16} /><span className="font-bold text-xs uppercase">เปรียบเทียบภาระงาน (Plan vs Actual)</span></div>
          <h2 className="text-2xl font-black text-slate-800">{overallLoad}%</h2>
          <p className="text-xs text-slate-400 mt-1">อัตราภาระงานจริงของทั้งโรงงาน</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-rose-600 mb-2"><AlertTriangle size={16} /><span className="font-bold text-xs uppercase">อัตรางานเสีย/งานแก้ (NC/Rework)</span></div>
          <h2 className="text-2xl font-black text-slate-800">{WORKING_STATS.avgNcReworkPercent}%</h2>
          <p className="text-xs text-slate-400 mt-1">อัตรางานแก้ (อยู่ในเกณฑ์น้อยกว่า 5%)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-amber-500 mb-2"><TrendingUp size={16} /><span className="font-bold text-xs uppercase">การประเมินทักษะ</span></div>
          <h2 className="text-2xl font-black text-slate-800">{APPROVAL_STATS.autoUpgradePending} <span className="text-sm font-medium text-slate-500">รอดำเนินการ</span></h2>
          <p className="text-xs text-slate-400 mt-1">รายการเลื่อนระดับอัตโนมัติจากระบบ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Development Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2"><Award size={16} className="text-indigo-500" /> แนวโน้มการพัฒนาทักษะรายปี (Yearly Trend)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTrend} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="level1" name="Level 1" fill="#94a3b8" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="level2" name="Level 2" fill="#818cf8" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="level3" name="Level 3" fill="#4f46e5" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Dashboard Placeholder */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2"><BookOpen size={16} className="text-emerald-500" /> การฝึกอบรมและการพัฒนา (Training & Development)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div><p className="text-xs font-bold text-slate-700">คำขอรับการฝึกอบรม OJT (Level 0 &rarr; 1)</p><p className="text-[10px] text-slate-500">รอหัวหน้างาน (Chief) ตรวจสอบ</p></div>
              <span className="font-black text-indigo-600 text-lg">{APPROVAL_STATS.pendingOJT}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div><p className="text-xs font-bold text-slate-700">รอการอนุมัติจากผู้จัดการ</p><p className="text-[10px] text-slate-500">รอดำเนินการ Final Approve</p></div>
              <span className="font-black text-amber-500 text-lg">{APPROVAL_STATS.pendingAnnual}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div><p className="text-xs font-bold text-slate-700">พนักงานที่ได้รับการเลื่อนระดับ (เดือนนี้)</p><p className="text-[10px] text-slate-500">พัฒนาทักษะสำเร็จแล้ว</p></div>
              <span className="font-black text-emerald-600 text-lg">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
