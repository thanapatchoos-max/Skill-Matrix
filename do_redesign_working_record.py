import io

new_code = """import React, { useState } from 'react';
import { Plus, Search, Filter, Play, CheckCircle, AlertTriangle, Clock, Calendar, Download, Activity, Briefcase } from 'lucide-react';

interface WorkRecord {
  id: string;
  date: string;
  sn: string;
  employee: string;
  department: string;
  wi: string;
  skillType: string;
  type: 'Normal' | 'Rework QC' | 'Rework Mfg';
  startTime: string;
  finishTime: string;
  actualHrs: number;
  standardHrs: number;
  status: 'เสร็จสมบูรณ์' | 'กำลังดำเนินการ';
  nc: string | null;
}

const mockWorkingRecords: WorkRecord[] = [
  { id: 'JOB-260908-01', date: '2026-10-05', sn: 'PP0600A01', employee: 'นายสมชาย ใจดี', department: 'QC Section', wi: 'QCW001-001', skillType: 'A - Circuit Connecting', type: 'Normal', startTime: '08:00', finishTime: '10:00', actualHrs: 2.0, standardHrs: 1.8, status: 'เสร็จสมบูรณ์', nc: null },
  { id: 'JOB-260908-02', date: '2026-10-05', sn: 'PP0600A02', employee: 'นางสาวแนน สุขใจ', department: 'Engineering', wi: 'ENG-M-001', skillType: 'B - Operator', type: 'Normal', startTime: '10:15', finishTime: '12:00', actualHrs: 1.75, standardHrs: 2.0, status: 'เสร็จสมบูรณ์', nc: null },
  { id: 'JOB-260908-03', date: '2026-10-05', sn: 'PP0600A03', employee: 'นายกฤต พร้อมใจ', department: 'QC Section', wi: 'QCW002-001', skillType: 'C - Report', type: 'Rework QC', startTime: '13:00', finishTime: '15:00', actualHrs: 2.0, standardHrs: 0, status: 'เสร็จสมบูรณ์', nc: 'NC-2609-012' },
  { id: 'JOB-260908-04', date: '2026-10-05', sn: 'นายสมศักดิ์ มั่นคง', employee: 'นายสมศักดิ์ มั่นคง', department: 'Production', wi: 'PROD-010-01', skillType: 'A - Circuit Connecting', type: 'Normal', startTime: '15:15', finishTime: '', actualHrs: 0, standardHrs: 1.5, status: 'กำลังดำเนินการ', nc: null },
  { id: 'JOB-260907-01', date: '2026-10-04', sn: 'PP0600A05', employee: 'นายสมชาย ใจดี', department: 'QC Section', wi: 'QCW001-002', skillType: 'A - Circuit Connecting', type: 'Normal', startTime: '08:00', finishTime: '11:00', actualHrs: 3.0, standardHrs: 2.8, status: 'เสร็จสมบูรณ์', nc: null },
  { id: 'JOB-260907-02', date: '2026-10-04', sn: 'PP0600A06', employee: 'นางสาวแนน สุขใจ', department: 'Engineering', wi: 'ENG-D-003', skillType: 'D - Data Analysis', type: 'Normal', startTime: '13:00', finishTime: '16:00', actualHrs: 3.0, standardHrs: 3.0, status: 'เสร็จสมบูรณ์', nc: null },
];

export default function WorkingRecord({ userRole = 'admin' }: { userRole?: string }) {
  const isStaff = userRole === 'staff' || userRole === 'clerk';
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager' || userRole === 'admin';

  const [records, setRecords] = useState(mockWorkingRecords);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState('2026-10-05');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Role-based Defaults
  const [selectedDept, setSelectedDept] = useState(isManager ? 'ALL' : (isChief ? 'QC Section' : 'QC Section'));
  const [selectedEmp, setSelectedEmp] = useState(isStaff ? 'นายสมชาย ใจดี' : 'ALL');

  // Filter Logic
  const filteredRecords = records.filter(r => {
    // 1. Role-based enforcement
    if (isStaff && r.employee !== 'นายสมชาย ใจดี') return false;
    if (isChief && r.department !== 'QC Section') return false;
    
    // 2. State filters
    if (filterDate && r.date !== filterDate) return false;
    if (!isStaff && selectedDept !== 'ALL' && r.department !== selectedDept) return false;
    if (!isStaff && selectedEmp !== 'ALL' && r.employee !== selectedEmp) return false;
    
    // 3. Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.sn.toLowerCase().includes(q) && !r.employee.toLowerCase().includes(q) && !r.wi.toLowerCase().includes(q)) {
        return false;
      }
    }
    
    return true;
  });

  const totalActual = filteredRecords.reduce((sum, r) => sum + r.actualHrs, 0);
  const totalStandard = filteredRecords.reduce((sum, r) => sum + r.standardHrs, 0);
  const productivity = totalActual > 0 ? (totalStandard / totalActual * 100).toFixed(1) : 0;
  const reworkCount = filteredRecords.filter(r => r.type !== 'Normal').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-indigo-600" /> บันทึกการทำงาน (Daily Working Record)
          </h1>
          <p className="text-slate-500 text-sm mt-1">บันทึกข้อมูลงาน Assignment, เวลาทำงานจริง (Actual Hours) และ NC/Rework ประจำวัน</p>
        </div>
        {(isStaff || isChief) && (
          <button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold shadow-sm text-sm">
            <Plus size={18} /> {isFormOpen ? 'ยกเลิก' : 'บันทึกข้อมูลงาน ใหม่'}
          </button>
        )}
      </div>

      {/* Summary Cards (Dynamic based on filters) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div><p className="text-sm text-slate-500 font-medium">เวลาทำงานจริง (Actual)</p><h3 className="text-2xl font-bold text-slate-800 mt-1">{totalActual} hrs</h3></div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Clock size={20} /></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div><p className="text-sm text-slate-500 font-medium">เวลามาตรฐาน (Standard)</p><h3 className="text-2xl font-bold text-slate-800 mt-1">{totalStandard} hrs</h3></div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle size={20} /></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div><p className="text-sm text-slate-500 font-medium">ประสิทธิภาพ (Productivity)</p><h3 className="text-2xl font-bold text-indigo-700 mt-1">{productivity}%</h3></div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Activity size={20} /></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div><p className="text-sm text-slate-500 font-medium">งานแก้และเสีย (Rework/NC)</p><h3 className="text-2xl font-bold text-rose-600 mt-1">{reworkCount} Jobs</h3></div>
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600"><AlertTriangle size={20} /></div>
        </div>
      </div>

      {/* Inline Form */}
      {isFormOpen && (
        <div className="bg-white p-5 rounded-xl border border-indigo-200 shadow-lg mb-6">
          <h2 className="text-lg font-bold text-indigo-900 mb-4 border-b pb-2">แบบฟอร์มบันทึกมอบหมายงาน (Job Assignment)</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job S/N</label>
              <input type="text" placeholder="e.g. PP0600A05" className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
            </div>
            {!isStaff && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">พนักงาน</label>
                <select className="w-full border border-slate-300 rounded-lg p-2 text-sm"><option>นายสมชาย ใจดี</option><option>นางสาวแนน สุขใจ</option></select>
              </div>
            )}
            <div className={isStaff ? 'col-span-2' : ''}>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">W/I</label>
              <select className="w-full border border-slate-300 rounded-lg p-2 text-sm"><option>QCW001-001</option><option>PROD-010-01</option></select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">ประเภทงาน (Job Type)</label>
              <select className="w-full border border-slate-300 rounded-lg p-2 text-sm"><option>Normal</option><option>Rework QC</option><option>Rework Mfg</option></select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">เริ่ม (Start)</label>
              <input type="time" defaultValue="08:00" className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">เสร็จ (Finish)</label>
              <input type="time" className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">NC Number (Optional)</label>
              <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white">
                <option value="">-- ไม่ระบุ (งานปกติ) --</option>
                <option value="NC-001">NC-001 : รอยขีดข่วนตัวถัง</option>
                <option value="NC-002">NC-002 : สีหลุดร่อน</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-indigo-700">บันทึกข้อมูลงาน</button>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="ค้นหา Job S/N, พนักงาน, หรือ W/I..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Calendar size={16} className="text-slate-500" />
              <input 
                type="date" 
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {!isStaff && (
            <div className="flex flex-col md:flex-row gap-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase size={16} className="text-slate-400" />
                <span className="font-bold text-slate-600">กรองแผนก:</span>
                <select 
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  disabled={!isManager}
                  className={`border border-slate-300 rounded-lg px-3 py-1.5 font-bold outline-none ${!isManager ? 'bg-slate-100 text-slate-500' : 'bg-white text-indigo-700'}`}
                >
                  <option value="ALL">รวมทุกแผนก</option>
                  <option value="QC Section">QC Section</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Production">Production</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Filter size={16} className="text-slate-400" />
                <span className="font-bold text-slate-600">กรองพนักงาน:</span>
                <select 
                  value={selectedEmp}
                  onChange={e => setSelectedEmp(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 font-bold outline-none bg-white text-indigo-700"
                >
                  <option value="ALL">ทุกคนในแผนก</option>
                  <option value="นายสมชาย ใจดี">นายสมชาย ใจดี</option>
                  <option value="นางสาวแนน สุขใจ">นางสาวแนน สุขใจ</option>
                  <option value="นายกฤต พร้อมใจ">นายกฤต พร้อมใจ</option>
                </select>
              </div>
            </div>
          )}

        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wide">
                <th className="px-4 py-3">Job S/N</th>
                <th className="px-4 py-3">วันที่</th>
                {!isStaff && <th className="px-4 py-3">พนักงาน</th>}
                <th className="px-4 py-3">W/I & Skill</th>
                <th className="px-4 py-3">ประเภทงาน & NC</th>
                <th className="px-4 py-3">เวลา (เริ่ม - เสร็จ)</th>
                <th className="px-4 py-3 text-center">เวลาจริง (มาตรฐาน)</th>
                <th className="px-4 py-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr><td colSpan={isStaff ? 7 : 8} className="text-center py-8 text-slate-500">ไม่มีประวัติการทำงานในเงื่อนไขที่เลือก</td></tr>
              ) : filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-700">{r.sn}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-bold">{r.date}</td>
                  {!isStaff && <td className="px-4 py-3 font-semibold text-slate-800">{r.employee}</td>}
                  <td className="px-4 py-3">
                    <div className="text-xs font-bold text-slate-700">{r.wi}</div>
                    <div className="text-[10px] text-slate-500">{r.skillType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${r.type === 'Normal' ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-700'}`}>{r.type}</span>
                    {r.nc && <div className="text-[10px] text-rose-500 font-mono mt-0.5">{r.nc}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    <span className="font-bold">{r.startTime}</span> - <span className="font-bold">{r.finishTime || 'Now'}</span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className={r.actualHrs > r.standardHrs ? 'text-rose-600' : 'text-emerald-600'}>{r.actualHrs}</span> 
                    <span className="text-slate-400 text-xs font-normal"> ({r.standardHrs})</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.status === 'เสร็จสมบูรณ์' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700"><CheckCircle size={12}/> เสร็จสมบูรณ์</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"><Play size={12}/> ดำเนินการ</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"""

with io.open("src/pages/WorkingRecord.tsx", "w", encoding="utf-8") as f:
    f.write(new_code)

