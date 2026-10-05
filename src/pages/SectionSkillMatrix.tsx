import React, { useState } from 'react';
import { Download, Search, Filter, ChevronDown, Users, Award, TrendingUp, AlertTriangle, Eye, Grid, ChevronLeft, ChevronRight } from 'lucide-react';

interface WIMaster {
  code: string;
  name: string;
  department: string;
  category: string;
  version: string;
  types: string[];
}

interface EmployeeSkill {
  id: string;
  name: string;
  role: string;
  department: string;
  scores: Record<string, number>;
}

// Full 12 WIs matching MasterData exactly
const masterWIs: WIMaster[] = [
  // QC Section (5 WIs)
  { code: 'QCW001-001', name: 'การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น (Initial Resistance Test)', department: 'QC Section', category: 'Testing & Quality', version: 'v2.1', types: ['A', 'B', 'C', 'D'] },
  { code: 'QCW001-002', name: 'การทดสอบพิกัดกำลังไฟฟ้าและแรงดันสูง (High Voltage Breakdown Test)', department: 'QC Section', category: 'Testing & Quality', version: 'v3.0', types: ['A', 'B', 'C', 'D'] },
  { code: 'QCW002-001', name: 'การตรวจสอบรอยเชื่อมและจุดยึดโครงสร้างหม้อแปลง (Structural Inspection)', department: 'QC Section', category: 'Mechanical & Structure', version: 'v1.4', types: ['C', 'D'] },
  { code: 'QCW004-001', name: 'การทดสอบวัดค่าการสูญเสียในสภาวะไร้ภาระ (No-Load Loss Measurement)', department: 'QC Section', category: 'Testing & Quality', version: 'v1.5', types: ['A', 'C', 'D'] },
  { code: 'QCW005-001', name: 'การตรวจสอบฉลาก รหัสสี และสเปกบรรจุภัณฑ์ก่อนจัดส่ง (Final Product Audit)', department: 'QC Section', category: 'Final Inspection & Audit', version: 'v1.1', types: ['C', 'E'] },

  // Production (4 WIs)
  { code: 'PROD-010-01', name: 'การพันคอยล์และประกอบแกนเหล็กหม้อแปลง (Core & Coil Assembly)', department: 'Production', category: 'Assembly Line', version: 'v2.0', types: ['A', 'B', 'E'] },
  { code: 'PROD-010-02', name: 'การเติมน้ำมันฉนวนสูญญากาศ (Vacuum Oil Filling Process)', department: 'Production', category: 'Assembly Line', version: 'v1.8', types: ['B', 'C', 'E'] },
  { code: 'PROD-020-01', name: 'การประกอบตัวถังภายนอกและติดตั้งซีลกันรั่ว (Tank Assembly & Sealing)', department: 'Production', category: 'Assembly Line', version: 'v2.2', types: ['B', 'E'] },
  { code: 'PROD-030-01', name: 'การพ่นสีอบความร้อนรองพื้นและเคลือบเงา (Surface Coating & Painting)', department: 'Production', category: 'Assembly Line', version: 'v1.3', types: ['B', 'E'] },

  // Engineering (3 WIs)
  { code: 'ENG-M-001', name: 'การบำรุงรักษาเชิงป้องกันเครื่องจักรทดสอบประจำเดือน (Preventive Maintenance)', department: 'Engineering', category: 'Maintenance & Safety', version: 'v1.2', types: ['B', 'D', 'E'] },
  { code: 'ENG-M-002', name: 'การสอบเทียบเครื่องมือวัดไฟฟ้ามาตรฐาน ISO/IEC 17025 (Calibration Procedure)', department: 'Engineering', category: 'Calibration & Measurement', version: 'v4.1', types: ['C', 'D'] },
  { code: 'ENG-D-003', name: 'การจำลองและวิเคราะห์ความร้อนหม้อแปลงด้วยวงจรทดสอบ (Thermal Run Test)', department: 'Engineering', category: 'Calibration & Measurement', version: 'v2.0', types: ['B', 'D'] },
];

const skillTypeNameMap: Record<string, string> = {
  'A': 'Circuit Connecting',
  'B': 'Machine Operator',
  'C': 'Inspection Report',
  'D': 'Data Analysis',
  'E': 'Safety Control'
};

const mockEmployees: EmployeeSkill[] = [
  // QC Section
  {
    id: 'EMP001', name: 'นายสมชาย ใจดี', role: 'Quality Inspector', department: 'QC Section',
    scores: {
      'QCW001-001_A': 3, 'QCW001-001_B': 2, 'QCW001-001_C': 2, 'QCW001-001_D': 1,
      'QCW001-002_A': 3, 'QCW001-002_B': 2, 'QCW001-002_C': 2, 'QCW001-002_D': 1,
      'QCW002-001_C': 2, 'QCW002-001_D': 1,
      'QCW004-001_A': 2, 'QCW004-001_C': 2, 'QCW004-001_D': 1,
      'QCW005-001_C': 3, 'QCW005-001_E': 2
    }
  },
  {
    id: 'EMP002', name: 'นางสาวอรุณี รักดี', role: 'QC Supervisor (Chief)', department: 'QC Section',
    scores: {
      'QCW001-001_A': 2, 'QCW001-001_B': 3, 'QCW001-001_C': 3, 'QCW001-001_D': 2,
      'QCW001-002_A': 2, 'QCW001-002_B': 3, 'QCW001-002_C': 3, 'QCW001-002_D': 2,
      'QCW002-001_C': 3, 'QCW002-001_D': 2,
      'QCW004-001_A': 3, 'QCW004-001_C': 3, 'QCW004-001_D': 2,
      'QCW005-001_C': 3, 'QCW005-001_E': 3
    }
  },
  {
    id: 'EMP003', name: 'นายกฤต พร้อมใจ', role: 'QC Technician', department: 'QC Section',
    scores: {
      'QCW001-001_A': 1, 'QCW001-001_B': 1, 'QCW001-001_C': 2, 'QCW001-001_D': 0,
      'QCW001-002_A': 1, 'QCW001-002_B': 1, 'QCW001-002_C': 2, 'QCW001-002_D': 0,
      'QCW002-001_C': 1, 'QCW002-001_D': 0,
      'QCW004-001_A': 1, 'QCW004-001_C': 1, 'QCW004-001_D': 0,
      'QCW005-001_C': 2, 'QCW005-001_E': 1
    }
  },
  {
    id: 'EMP004', name: 'นางสมศรี มีสุข', role: 'Senior Inspector', department: 'QC Section',
    scores: {
      'QCW001-001_A': 3, 'QCW001-001_B': 3, 'QCW001-001_C': 2, 'QCW001-001_D': 3,
      'QCW001-002_A': 3, 'QCW001-002_B': 3, 'QCW001-002_C': 2, 'QCW001-002_D': 3,
      'QCW002-001_C': 3, 'QCW002-001_D': 2,
      'QCW004-001_A': 3, 'QCW004-001_C': 3, 'QCW004-001_D': 3,
      'QCW005-001_C': 3, 'QCW005-001_E': 2
    }
  },
  {
    id: 'EMP011', name: 'นายกฤษณะ แสงทอง', role: 'Junior Inspector', department: 'QC Section',
    scores: {
      'QCW001-001_A': 1, 'QCW001-001_B': 0, 'QCW001-001_C': 1, 'QCW001-001_D': 0,
      'QCW001-002_A': 0, 'QCW001-002_B': 0, 'QCW001-002_C': 1, 'QCW001-002_D': 0,
      'QCW002-001_C': 1, 'QCW002-001_D': 0,
      'QCW004-001_A': 0, 'QCW004-001_C': 1, 'QCW004-001_D': 0,
      'QCW005-001_C': 1, 'QCW005-001_E': 0
    }
  },

  // Production
  {
    id: 'EMP008', name: 'นายสมศักดิ์ มั่นคง', role: 'Production Tech', department: 'Production',
    scores: {
      'PROD-010-01_A': 2, 'PROD-010-01_B': 2, 'PROD-010-01_E': 1,
      'PROD-010-02_B': 2, 'PROD-010-02_C': 1, 'PROD-010-02_E': 2,
      'PROD-020-01_B': 2, 'PROD-020-01_E': 1,
      'PROD-030-01_B': 1, 'PROD-030-01_E': 2
    }
  },
  {
    id: 'EMP009', name: 'นายสุรชัย สายชล', role: 'Assembly Operator', department: 'Production',
    scores: {
      'PROD-010-01_A': 1, 'PROD-010-01_B': 2, 'PROD-010-01_E': 2,
      'PROD-010-02_B': 1, 'PROD-010-02_C': 1, 'PROD-010-02_E': 1,
      'PROD-020-01_B': 1, 'PROD-020-01_E': 1,
      'PROD-030-01_B': 2, 'PROD-030-01_E': 1
    }
  },

  // Engineering
  {
    id: 'EMP005', name: 'นางสาวแนน สุขใจ', role: 'Calibration Eng', department: 'Engineering',
    scores: {
      'ENG-M-001_B': 2, 'ENG-M-001_D': 3, 'ENG-M-001_E': 2,
      'ENG-M-002_C': 3, 'ENG-M-002_D': 2,
      'ENG-D-003_B': 2, 'ENG-D-003_D': 3
    }
  },
  {
    id: 'EMP010', name: 'นางสาวอรทัย ใฝ่รู้', role: 'Assistant Eng', department: 'Engineering',
    scores: {
      'ENG-M-001_B': 1, 'ENG-M-001_D': 1, 'ENG-M-001_E': 2,
      'ENG-M-002_C': 2, 'ENG-M-002_D': 1,
      'ENG-D-003_B': 1, 'ENG-D-003_D': 1
    }
  }
];

const ITEMS_PER_PAGE = 8;

export default function SectionSkillMatrix({ userRole = 'admin' }: { userRole?: string }) {
  const [department, setDepartment] = useState('QC Section');
  const [year, setYear] = useState('2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWiFilter, setSelectedWiFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'focused'>('grid');
  const [teamScope, setTeamScope] = useState<'all' | 'my_team'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter WIs based on active department and selected W/I filter
  const departmentWIs = masterWIs.filter(w => w.department === department);
  const activeWIs = selectedWiFilter === 'ALL'
    ? departmentWIs
    : departmentWIs.filter(w => w.code === selectedWiFilter);

  // Subordinates of Chief Aruni (EMP002)
  const myTeamIds = ['EMP001', 'EMP003', 'EMP011'];

  // Filter Employees based on department and search query
  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesDept = emp.department === department;
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = teamScope === 'all' || myTeamIds.includes(emp.id);
    return matchesDept && matchesSearch && matchesTeam;
  });

  // Pagination for Employees
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Department Stats Calculations
  let totalSkillsEvaluated = 0;
  let totalScoreSum = 0;
  let trainerCount = 0;
  let gapCount = 0;

  filteredEmployees.forEach(emp => {
    activeWIs.forEach(wi => {
      wi.types.forEach(t => {
        const key = `${wi.code}_${t}`;
        const score = emp.scores[key] || 0;
        totalSkillsEvaluated++;
        totalScoreSum += score;
        if (score === 3) trainerCount++;
        if (score === 0) gapCount++;
      });
    });
  });

  const departmentAverage = totalSkillsEvaluated > 0 ? (totalScoreSum / totalSkillsEvaluated).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Grid className="text-[#0a2540]" /> ภาพรวม Skill Matrix (Section Competency Overview)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            ตารางแสดงระดับความสามารถพนักงานรายบุคคล แยกตาม Work Instruction (ซิงก์ 12 WIs จาก Master Data)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors shadow-sm text-sm font-semibold">
            <Download size={16} /> Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-md text-sm font-semibold">
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{filteredEmployees.length} คน</div>
            <div className="text-xs text-slate-500">บุคลากรใน {department}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">{departmentAverage} / 3.0</div>
            <div className="text-xs text-slate-500">คะแนนเฉลี่ยระดับแผนก</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Award size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-700">{trainerCount} สกิล</div>
            <div className="text-xs text-slate-500">จำนวน Skill Level 3 (Trainer)</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">{gapCount} สกิล</div>
            <div className="text-xs text-slate-500">จุดที่ขาดแคลน (Level 0 - Cannot)</div>
          </div>
        </div>
      </div>

      {/* FILTER & VIEW CONTROLS BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Main Filters: Dept, Year, Search */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Department */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">แผนก (Section)</label>
              <div className="relative">
                <select 
                  value={department}
                  onChange={(e) => { setDepartment(e.target.value); setSelectedWiFilter('ALL'); setCurrentPage(1); }}
                  className="appearance-none bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="QC Section">QC Section ({masterWIs.filter(w => w.department === 'QC Section').length} WIs)</option>
                  <option value="Production">Production ({masterWIs.filter(w => w.department === 'Production').length} WIs)</option>
                  <option value="Engineering">Engineering ({masterWIs.filter(w => w.department === 'Engineering').length} WIs)</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Filter by Specific W/I */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">กรองเฉพาะ W/I</label>
              <div className="relative">
                <select 
                  value={selectedWiFilter}
                  onChange={(e) => { setSelectedWiFilter(e.target.value); setCurrentPage(1); }}
                  className="appearance-none bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[220px] truncate"
                >
                  <option value="ALL">ดูทุก W/I ในแผนก ({departmentWIs.length})</option>
                  {departmentWIs.map(w => (
                    <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Year */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">ปี (Year)</label>
              <div className="relative">
                <select 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Team Scope Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">ขอบเขตบุคลากร</label>
              <div className="flex bg-slate-200/70 p-1 rounded-xl">
                <button
                  onClick={() => { setTeamScope('all'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    teamScope === 'all' ? 'bg-white text-[#0a2540] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🌐 ทั้งหมด
                </button>
                <button
                  onClick={() => { setTeamScope('my_team'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    teamScope === 'my_team' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users size={13} /> ลูกทีมในดูแลของฉัน
                </button>
              </div>
            </div>

            {/* Search Employee */}
            <div className="space-y-1 flex-1 min-w-[180px]">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">ค้นหาบุคลากร</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="รหัส หรือ ชื่อ-นามสกุล..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-800 py-2 pl-8 pr-3 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="space-y-1 w-full lg:w-auto">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">รูปแบบการแสดงผล</label>
            <div className="flex bg-slate-200/70 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'grid' ? 'bg-white text-[#0a2540] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid size={14} /> เมทริกซ์รวมแผนก
              </button>
              <button
                onClick={() => setViewMode('focused')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'focused' ? 'bg-white text-[#0a2540] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye size={14} /> วิเคราะห์เจาะจง W/I
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: MATRIX GRID TABLE */}
      {viewMode === 'grid' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-max">
              <thead>
                <tr>
                  <th rowSpan={2} className="p-4 border-b border-r border-slate-200 bg-slate-100/90 font-bold text-slate-800 align-bottom w-72 shadow-xs">
                    พนักงาน / ตำแหน่งงาน
                  </th>
                  {activeWIs.map(wi => (
                    <th key={wi.code} colSpan={wi.types.length} className="px-3 py-3 border-b border-r border-slate-200 bg-[#0a2540] text-white text-center font-bold">
                      <div className="text-xs font-mono tracking-wide flex items-center justify-center gap-1.5">
                        <span>{wi.code}</span>
                        <span className="text-[10px] bg-blue-800/80 text-blue-200 px-1 rounded font-normal">{wi.version}</span>
                      </div>
                      <div className="text-[11px] font-normal text-blue-200 truncate max-w-[220px] mx-auto" title={wi.name}>
                        {wi.name}
                      </div>
                    </th>
                  ))}
                  <th rowSpan={2} className="px-4 py-4 border-b border-slate-200 bg-slate-100 font-bold text-slate-800 text-center align-bottom shadow-[inset_1px_0_0_#e2e8f0] w-24">
                    คะแนนรวม
                  </th>
                </tr>
                <tr>
                  {activeWIs.map(wi => (
                    wi.types.map(typeCode => (
                      <th 
                        key={`${wi.code}-${typeCode}`} 
                        className="px-2 py-2 border-b border-r border-slate-200 bg-slate-50 font-bold text-slate-700 text-center w-12 text-xs"
                        title={`${typeCode} - ${skillTypeNameMap[typeCode] || ''}`}
                      >
                        {typeCode}
                      </th>
                    ))
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={50} className="text-center py-12 text-slate-400">
                      ไม่พบข้อมูลพนักงานในเงื่อนไขการกรองนี้
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp) => {
                    let totalEmpScore = 0;
                    return (
                      <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors border-b border-slate-100 group">
                        <td className="p-4 border-r border-slate-200 bg-white group-hover:bg-blue-50/20">
                          <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{emp.name}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">{emp.id} · <span className="text-slate-500">{emp.role}</span></div>
                        </td>

                        {activeWIs.map(wi => (
                          wi.types.map(typeCode => {
                            const key = `${wi.code}_${typeCode}`;
                            const score = emp.scores[key] || 0;
                            totalEmpScore += score;
                            return (
                              <td key={`${emp.id}-${key}`} className="p-2 border-r border-slate-100 text-center">
                                <SkillBadge level={score} />
                              </td>
                            );
                          })
                        ))}

                        <td className="p-4 bg-slate-50/50 font-bold text-slate-800 text-center shadow-[inset_1px_0_0_#e2e8f0]">
                          <span className="bg-slate-200 text-slate-800 px-2.5 py-1 rounded-full text-xs font-mono font-bold">
                            {totalEmpScore}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Department Averages Footer */}
              <tfoot>
                <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold">
                  <td className="p-4 border-r border-slate-200 text-slate-700 text-right text-xs uppercase tracking-wide">
                    ค่าเฉลี่ยแผนก (Section Average)
                  </td>
                  {activeWIs.map(wi => (
                    wi.types.map(typeCode => {
                      const key = `${wi.code}_${typeCode}`;
                      const totalForType = filteredEmployees.reduce((sum, emp) => sum + (emp.scores[key] || 0), 0);
                      const avg = filteredEmployees.length > 0 ? (totalForType / filteredEmployees.length).toFixed(1) : '0.0';
                      return (
                        <td key={`avg-${key}`} className="p-2 border-r border-slate-200 text-center text-xs font-mono text-blue-900 bg-blue-50/50">
                          {avg}
                        </td>
                      );
                    })
                  ))}
                  <td className="p-4 text-center font-bold text-slate-800 shadow-[inset_1px_0_0_#e2e8f0] text-xs">
                    {departmentAverage}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Partition Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-slate-200 text-xs text-slate-500 bg-slate-50/50">
            <div>
              แสดงผล {filteredEmployees.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredEmployees.length)} จากทั้งหมด {filteredEmployees.length} คน (8 คนต่อหน้า)
            </div>

            <div className="inline-flex items-center bg-white border border-slate-300 rounded-full px-3 py-1 shadow-xs gap-3">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1 hover:bg-slate-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 transition-colors"
              >
                <ChevronLeft size={16} className="text-red-500 font-bold" />
              </button>

              <span className="font-mono font-bold text-slate-800 tracking-wider text-xs select-none">
                {currentPage} OF {totalPages || 1}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1 hover:bg-slate-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 transition-colors"
              >
                <ChevronRight size={16} className="text-red-500 font-bold" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: SKILL FOCUSED ANALYSIS */}
      {viewMode === 'focused' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeWIs.map(wi => (
            <div key={wi.code} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-[#0a2540] text-white px-2 py-0.5 rounded">
                      {wi.code}
                    </span>
                    <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                      {wi.version}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{wi.name}</h3>
                </div>
                <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{wi.category}</span>
              </div>

              <div className="space-y-3">
                {wi.types.map(tCode => {
                  const typeFullName = skillTypeNameMap[tCode] || tCode;
                  const key = `${wi.code}_${tCode}`;
                  const scores = filteredEmployees.map(e => e.scores[key] || 0);
                  const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0.0';
                  const trainerCountForSkill = scores.filter(s => s === 3).length;

                  return (
                    <div key={tCode} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                            {tCode}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{typeFullName}</span>
                        </div>
                        <div className="text-xs font-bold text-blue-900">
                          เฉลี่ย: <span className="font-mono text-sm">{avg}</span> / 3.0
                        </div>
                      </div>

                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${(parseFloat(avg) / 3) * 100}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>ผู้เป็นวิทยากร (Level 3): <strong className="text-indigo-700">{trainerCountForSkill} คน</strong></span>
                        <span>ประเมินแล้ว {scores.length} คน</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SKILL LEVEL LEGEND */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          นิยามระดับความสามารถ (Skill Level Legend):
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <SkillBadge level={0} /> <span className="text-slate-500">0 · Cannot (ทำไม่ได้)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <SkillBadge level={1} /> <span className="text-amber-700">1 · Under Supervision (ทำตามคำสั่ง)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <SkillBadge level={2} /> <span className="text-emerald-700">2 · Independent (ทำได้เองอิสระ)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <SkillBadge level={3} /> <span className="text-indigo-700">3 · Trainer (สอนผู้อื่นได้)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillBadge({ level }: { level: number }) {
  if (level === 0) return <div className="mx-auto w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 font-bold text-xs border border-slate-200">0</div>;
  if (level === 1) return <div className="mx-auto w-6 h-6 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-xs border border-amber-300 shadow-xs">1</div>;
  if (level === 2) return <div className="mx-auto w-6 h-6 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-300 shadow-xs">2</div>;
  if (level === 3) return <div className="mx-auto w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-300 shadow-xs ring-1 ring-indigo-300">3</div>;
  return null;
}
