import React from 'react';
import { Users, BarChart2, Award, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { clsx } from 'clsx';

const barData = [
  { name: 'Level 0', count: 22 },
  { name: 'Level 1', count: 48 },
  { name: 'Level 2', count: 58 },
  { name: 'Level 3', count: 28 },
];

const lineData = [
  { year: '2023', score: 1.32 },
  { year: '2024', score: 1.55 },
  { year: '2025', score: 1.72 },
  { year: '2026', score: 1.82 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard — ภาพรวมระบบ</h1>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard 
          title="จำนวนพนักงานทั้งหมด" 
          value="156" 
          unit="คน" 
          subtitle="ข้อมูล ณ วันที่ 23 พฤษภาคม 2567" 
          icon={Users} 
          iconColor="bg-blue-100 text-blue-600"
        />
        <KPICard 
          title="เฉลี่ย Skill Level" 
          value="1.82" 
          subtitle="จากระดับ 0 - 3" 
          icon={BarChart2} 
          iconColor="bg-teal-100 text-teal-600"
        />
        <KPICard 
          title="พนักงานระดับ 3" 
          value="28" 
          unit="คน" 
          subtitle="คิดเป็น 17.95% ของพนักงานทั้งหมด" 
          icon={Award} 
          iconColor="bg-purple-100 text-purple-600"
        />
        <KPICard 
          title="Capacity Utilization" 
          value="72%" 
          subtitle="เทียบกับ Capacity ทั้งหมด" 
          icon={Activity} 
          iconColor="bg-emerald-100 text-emerald-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-base font-bold text-slate-700">Skill Distribution by Level</h3>
            <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 cursor-help">i</div>
          </div>
          <div className="text-xs text-slate-500 mb-2">จำนวน (คน)</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="count" fill="#1d4ed8" barSize={40} radius={[4, 4, 0, 0]}>
                  {/* labels on top of bars are usually rendered with a customized label, but keeping it simple here */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3 h-3 bg-blue-700 rounded-sm"></span> จำนวนพนักงาน (คน)
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-base font-bold text-slate-700">Skill Growth Trend 2023-2026</h3>
            <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 cursor-help">i</div>
          </div>
          <div className="text-xs text-slate-500 mb-2">เฉลี่ย Skill Level</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 3]} ticks={[0, 0.5, 1, 1.5, 2, 2.5, 3]} />
                <Tooltip />
                <Line type="linear" dataKey="score" stroke="#0d9488" strokeWidth={3} dot={{r: 5, fill: '#0d9488', strokeWidth: 0}} label={{ position: 'top', fill: '#475569', fontSize: 12, dy: -10 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3 h-3 bg-teal-600 rounded-sm"></span> เฉลี่ย Skill Level
            </div>
          </div>
        </div>

      </div>

      {/* Table: สถานะ Capacity ของแต่ละแผนก */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-700">สถานะ Capacity ของแต่ละแผนก</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-center">แผนก</th>
                <th className="px-6 py-4 text-center">Under Capacity ( &gt; -10% )</th>
                <th className="px-6 py-4 text-center">Normal Capacity ( -10% ถึง +10% )</th>
                <th className="px-6 py-4 text-center">Over Capacity ( &gt; +10% )</th>
                <th className="px-6 py-4 text-center">Capacity Utilization</th>
                <th className="px-6 py-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <CapacityRow 
                dept="QC" 
                under={8} underPct="-11.4%" 
                normal={56} normalPct="80.0%" 
                over={6} overPct="+8.6%" 
                utilization={88.6} 
                status="ปกติ" statusType="normal" iconColor="text-blue-500"
              />
              <CapacityRow 
                dept="Production" 
                under={12} underPct="-15.0%" 
                normal={68} normalPct="85.0%" 
                over={0} overPct="0.0%" 
                utilization={85.0} 
                status="ปกติ" statusType="normal" iconColor="text-blue-500"
              />
              <CapacityRow 
                dept="Engineering" 
                under={5} underPct="-7.8%" 
                normal={30} normalPct="46.9%" 
                over={29} overPct="+45.3%" 
                utilization={145.3} 
                status="เกิน Capacity" statusType="over" iconColor="text-blue-500"
              />
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50/50 text-xs text-slate-400 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">i</div>
          หมายเหตุ: คำนวณจากจำนวนพนักงานเทียบกับ Capacity ที่กำหนด
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, unit, subtitle, icon: Icon, iconColor }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center mb-4", iconColor)}>
            <Icon size={24} />
          </div>
        </div>
        <div className="text-sm font-semibold text-slate-700 mb-1">{title}</div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-slate-800">{value}</span>
          {unit && <span className="text-base font-semibold text-slate-600">{unit}</span>}
        </div>
      </div>
      <div className="text-xs text-slate-400">{subtitle}</div>
    </div>
  );
}

function CapacityRow({ dept, under, underPct, normal, normalPct, over, overPct, utilization, status, statusType, iconColor }: any) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={clsx("w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center", iconColor)}>
            <Users size={16} />
          </div>
          <span className="font-bold text-slate-700">{dept}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="font-semibold">{under} คน</span> <span className="text-emerald-500 text-xs">({underPct})</span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="font-semibold">{normal} คน</span> <span className="text-emerald-500 text-xs">({normalPct})</span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="font-semibold">{over} คน</span> <span className={over > 0 ? "text-red-500 text-xs" : "text-emerald-500 text-xs"}>({overPct})</span>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center gap-3 justify-center">
          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={clsx("h-full rounded-full", utilization > 100 ? "bg-red-500" : "bg-emerald-500")}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            ></div>
          </div>
          <span className="font-semibold">{utilization}%</span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        {statusType === 'normal' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
            <CheckCircle2 size={14} /> {status}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
            <AlertCircle size={14} /> {status}
          </span>
        )}
      </td>
    </tr>
  );
}
