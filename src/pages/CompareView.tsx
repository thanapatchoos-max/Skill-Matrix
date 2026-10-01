import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, BarChart2, Layers, TrendingUp, AlertCircle, CheckCircle2, Award, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface WIMaster {
  code: string;
  name: string;
  department: string;
  year25Score: number;
  year26Score: number;
  trainerCount: number;
  riskStatus: 'low' | 'medium' | 'high';
  actionRecommendation: string;
}

const masterCompareData: WIMaster[] = [
  // QC Section WIs
  { code: 'QCW001-001', name: 'การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น', department: 'QC Section', year25Score: 1.9, year26Score: 2.3, trainerCount: 2, riskStatus: 'low', actionRecommendation: 'อยู่ในเกณฑ์มาตรฐาน มีวิทยากรเพียงพอ' },
  { code: 'QCW001-002', name: 'การทดสอบพิกัดกำลังไฟฟ้าและแรงดันสูง', department: 'QC Section', year25Score: 1.8, year26Score: 2.3, trainerCount: 2, riskStatus: 'low', actionRecommendation: 'พัฒนาการดีขึ้นอย่างต่อเนื่อง' },
  { code: 'QCW002-001', name: 'การตรวจสอบรอยเชื่อมและจุดยึดโครงสร้างหม้อแปลง', department: 'QC Section', year25Score: 1.7, year26Score: 2.2, trainerCount: 1, riskStatus: 'medium', actionRecommendation: 'ควรเสนอเลื่อนระดับเป็น Trainer เพิ่ม 1 คน' },
  { code: 'QCW004-001', name: 'การทดสอบวัดค่าการสูญเสียในสภาวะไร้ภาระ', department: 'QC Section', year25Score: 1.5, year26Score: 2.0, trainerCount: 1, riskStatus: 'medium', actionRecommendation: 'จัดสอบซ่อม OJT ทฤษฎีเพิ่มเติม' },
  { code: 'QCW005-001', name: 'การตรวจสอบฉลาก รหัสสี และสเปกบรรจุภัณฑ์', department: 'QC Section', year25Score: 2.2, year26Score: 2.7, trainerCount: 3, riskStatus: 'low', actionRecommendation: 'ระดับทักษะสูงมาก พร้อมขยายผล' },

  // Production WIs
  { code: 'PROD-010-01', name: 'การพันคอยล์และประกอบแกนเหล็กหม้อแปลง', department: 'Production', year25Score: 2.1, year26Score: 2.7, trainerCount: 2, riskStatus: 'low', actionRecommendation: 'ปฏิบัติงานได้อิสระ ไม่พบของเสีย' },
  { code: 'PROD-010-02', name: 'การเติมน้ำมันฉนวนสูญญากาศ', department: 'Production', year25Score: 2.0, year26Score: 2.5, trainerCount: 1, riskStatus: 'medium', actionRecommendation: 'เฝ้าระวังพนักงานใหม่ในสเตชันนี้' },
  { code: 'PROD-020-01', name: 'การประกอบตัวถังภายนอกและติดตั้งซีลกันรั่ว', department: 'Production', year25Score: 1.6, year26Score: 2.1, trainerCount: 1, riskStatus: 'medium', actionRecommendation: 'จัดคอร์สฝึกอบรม OJT ซ้ำประจำไตรมาส' },
  { code: 'PROD-030-01', name: 'การพ่นสีอบความร้อนรองพื้นและเคลือบเงา', department: 'Production', year25Score: 1.4, year26Score: 1.8, trainerCount: 0, riskStatus: 'high', actionRecommendation: '🚨 ขาดแคลน Trainer เร่งด่วน ต้องอนุมัติปรับ Skill' },

  // Engineering WIs
  { code: 'ENG-M-001', name: 'การบำรุงรักษาเชิงป้องกันเครื่องจักรทดสอบ', department: 'Engineering', year25Score: 2.3, year26Score: 2.8, trainerCount: 2, riskStatus: 'low', actionRecommendation: 'ความพร้อมในการบำรุงรักษาสูง' },
  { code: 'ENG-M-002', name: 'การสอบเทียบเครื่องมือวัดไฟฟ้ามาตรฐาน ISO 17025', department: 'Engineering', year25Score: 2.1, year26Score: 2.6, trainerCount: 2, riskStatus: 'low', actionRecommendation: 'ผ่านมาตรฐานการตรวจสอบ ISO/IEC 17025' },
  { code: 'ENG-D-003', name: 'การจำลองและวิเคราะห์ความร้อนหม้อแปลง', department: 'Engineering', year25Score: 1.5, year26Score: 2.0, trainerCount: 1, riskStatus: 'medium', actionRecommendation: 'ส่งตัวแทนเข้าอบรมวิเคราะห์ความร้อนขั้นสูง' }
];

export function CompareSkillMatrix() {
  const [compareMode, setCompareMode] = useState<'year' | 'department'>('year');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Filter Data based on selected department
  const filteredData = selectedDept === 'ALL'
    ? masterCompareData
    : masterCompareData.filter(d => d.department === selectedDept);

  // Department Aggregates for Cross-Dept Mode
  const deptSummaryData = [
    {
      department: 'QC Section',
      avg2025: (masterCompareData.filter(d => d.department === 'QC Section').reduce((a, b) => a + b.year25Score, 0) / 5).toFixed(2),
      avg2026: (masterCompareData.filter(d => d.department === 'QC Section').reduce((a, b) => a + b.year26Score, 0) / 5).toFixed(2),
    },
    {
      department: 'Production',
      avg2025: (masterCompareData.filter(d => d.department === 'Production').reduce((a, b) => a + b.year25Score, 0) / 4).toFixed(2),
      avg2026: (masterCompareData.filter(d => d.department === 'Production').reduce((a, b) => a + b.year26Score, 0) / 4).toFixed(2),
    },
    {
      department: 'Engineering',
      avg2025: (masterCompareData.filter(d => d.department === 'Engineering').reduce((a, b) => a + b.year25Score, 0) / 3).toFixed(2),
      avg2026: (masterCompareData.filter(d => d.department === 'Engineering').reduce((a, b) => a + b.year26Score, 0) / 3).toFixed(2),
    }
  ];

  // Executive Metric Calculations
  const overall25Avg = (masterCompareData.reduce((a, b) => a + b.year25Score, 0) / masterCompareData.length).toFixed(2);
  const overall26Avg = (masterCompareData.reduce((a, b) => a + b.year26Score, 0) / masterCompareData.length).toFixed(2);
  const growthRatePercentage = (((parseFloat(overall26Avg) - parseFloat(overall25Avg)) / parseFloat(overall25Avg)) * 100).toFixed(1);

  const highRiskCount = masterCompareData.filter(d => d.riskStatus === 'high').length;
  const mediumRiskCount = masterCompareData.filter(d => d.riskStatus === 'medium').length;

  return (
    <div className="space-y-6">
      {/* Header & Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="text-[#0a2540]" /> เปรียบเทียบ Skill Matrix (Competency Analytics)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            เครื่องมือวิเคราะห์การเติบโตของสมรรถนะบุคลากร (Year-over-Year) และประเมินความเสี่ยงเพื่อวางแผนจัดอบรม OJT
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors shadow-sm text-xs font-bold">
            <Download size={15} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Growth Rate */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">อัตราการเติบโตทักษะรวม</div>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
              +{growthRatePercentage}% <span className="text-xs font-normal text-slate-400">(2025 → 2026)</span>
            </div>
          </div>
        </div>

        {/* Current Avg Score */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">คะแนนเฉลี่ยรวมทุก W/I</div>
            <div className="text-2xl font-bold text-slate-800 mt-0.5">
              {overall26Avg} <span className="text-xs font-normal text-slate-400">/ 3.0</span>
            </div>
          </div>
        </div>

        {/* High Performing Dept */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Award size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">แผนกที่มีคะแนนสูงสุด</div>
            <div className="text-xl font-bold text-indigo-900 mt-0.5">
              Engineering <span className="text-xs font-normal text-slate-500">(2.47/3.0)</span>
            </div>
          </div>
        </div>

        {/* High Risk WIs */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">จุดเสี่ยงต้องจัด OJT ด่วน</div>
            <div className="text-2xl font-bold text-red-600 mt-0.5">
              {highRiskCount} <span className="text-xs font-normal text-slate-500">W/I (ขาด Trainer)</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & ANALYTICS MODE CONTROL BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Mode Switcher */}
        <div className="space-y-1 w-full md:w-auto">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">เลือกโหมดการวิเคราะห์ (Analytics View)</label>
          <div className="flex bg-slate-200/70 p-1 rounded-xl">
            <button
              onClick={() => setCompareMode('year')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                compareMode === 'year' ? 'bg-white text-[#0a2540] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp size={14} /> แนวโน้มการเติบโตรายปี (2025 vs 2026)
            </button>
            <button
              onClick={() => setCompareMode('department')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                compareMode === 'department' ? 'bg-white text-[#0a2540] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={14} /> เปรียบเทียบระหว่างแผนก (Cross-Dept)
            </button>
          </div>
        </div>

        {/* Department Filter */}
        {compareMode === 'year' && (
          <div className="space-y-1 w-full md:w-auto">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">กรองเฉพาะแผนก</label>
            <div className="relative">
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="w-full md:w-56 appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">รวมทุกแผนก ({masterCompareData.length} WIs)</option>
                <option value="QC Section">QC Section (ฝ่ายตรวจสอบคุณภาพ)</option>
                <option value="Production">Production (ฝ่ายการผลิต)</option>
                <option value="Engineering">Engineering (ฝ่ายวิศวกรรม)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* CHART SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="text-blue-600" size={20} />
            <h2 className="text-base font-bold text-slate-800">
              {compareMode === 'year'
                ? `กราฟแสดงแนวโน้มพัฒนาการทักษะข้ามปี: ${selectedDept === 'ALL' ? 'ทุกแผนก' : selectedDept} (ปี 2025 เทียบกับ ปี 2026)`
                : 'กราฟเปรียบเทียบคะแนนเฉลี่ยสมรรถนะรวมข้ามแผนก: QC Section vs Production vs Engineering (ปี 2026)'}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded">
            Scale: 0.0 - 3.0 Max Score
          </span>
        </div>

        <div className="h-[380px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {compareMode === 'year' ? (
              <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="code" tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`${value} / 3.0 คะแนน`, 'คะแนนเฉลี่ย']}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="year25Score" name="ปี 2025" fill="#94a3b8" radius={[6, 6, 0, 0]} barSize={26} />
                <Bar dataKey="year26Score" name="ปี 2026 (ปัจจุบัน)" fill="#10b981" radius={[6, 6, 0, 0]} barSize={26} />
              </BarChart>
            ) : (
              <BarChart data={deptSummaryData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fill: '#475569', fontSize: 12, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="avg2025" name="คะแนนเฉลี่ยปี 2025" fill="#94a3b8" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="avg2026" name="คะแนนเฉลี่ยปี 2026" fill="#0a2540" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* DETAILED COMPARISON & RISK ANALYSIS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Layers size={16} className="text-slate-500" /> ตารางวิเคราะห์เปรียบเทียบเชิงลึกและประเมินความเสี่ยง (Detailed Competency & Risk Matrix)
          </h2>
          <span className="text-xs text-slate-500 font-medium">รวมทั้งหมด {filteredData.length} รายการ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wide">
                <th className="px-4 py-3.5">รหัส W/I</th>
                <th className="px-4 py-3.5">ชื่อมาตรฐาน Work Instruction</th>
                <th className="px-4 py-3.5">แผนก</th>
                <th className="px-3 py-3.5 text-center">ปี 2025</th>
                <th className="px-3 py-3.5 text-center">ปี 2026</th>
                <th className="px-3 py-3.5 text-center">อัตราเติบโต</th>
                <th className="px-3 py-3.5 text-center">จำนวน Trainer</th>
                <th className="px-4 py-3.5 text-center">ระดับความเสี่ยง</th>
                <th className="px-4 py-3.5">ข้อเสนอแนะในการวางแผน OJT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredData.map(d => {
                const diff = (d.year26Score - d.year25Score).toFixed(1);
                const isPositive = parseFloat(diff) >= 0;

                return (
                  <tr key={d.code} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-800 text-xs whitespace-nowrap">{d.code}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 leading-snug">{d.name}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {d.department}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono font-semibold text-slate-500">{d.year25Score}</td>
                    <td className="px-3 py-3.5 text-center font-mono font-bold text-emerald-600">{d.year26Score}</td>
                    <td className="px-3 py-3.5 text-center font-mono text-xs font-bold whitespace-nowrap">
                      <span className={`inline-flex items-center gap-0.5 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{diff}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center font-bold text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${d.trainerCount === 0 ? 'bg-red-100 text-red-700 font-bold' : 'bg-indigo-50 text-indigo-700'}`}>
                        {d.trainerCount} คน
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      {d.riskStatus === 'high' && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200 animate-pulse">
                          <AlertCircle size={12} /> เสี่ยงสูง (High)
                        </span>
                      )}
                      {d.riskStatus === 'medium' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
                          เฝ้าระวัง (Medium)
                        </span>
                      )}
                      {d.riskStatus === 'low' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 size={12} /> ปกติ (Low)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700 font-medium">{d.actionRecommendation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
