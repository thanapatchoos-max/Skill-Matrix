import React, { useState } from 'react';
import { User, Award, BookOpen, Download, ChevronDown, CheckCircle, Search, Layers, ChevronLeft, ChevronRight, FileSpreadsheet, BarChart2, Compass, Target } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip as RechartsTooltip } from 'recharts';

interface WIMaster {
  code: string;
  name: string;
  department: string;
  version?: string;
  types: string[];
}

interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  position: string;
  supervisor: string;
  joinedDate: string;
  scores: Record<string, number>; // "QCW001-001_A": 3
}

// Master Data Alignment (Matching exact 12 WIs from MasterData)
const masterWIs: WIMaster[] = [
  // QC Section (5 WIs)
  { code: 'QCW001-001', name: 'การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น (Initial Resistance Test)', department: 'QC Section', version: 'v2.1', types: ['A', 'B', 'C', 'D'] },
  { code: 'QCW001-002', name: 'การทดสอบพิกัดกำลังไฟฟ้าและแรงดันสูง (High Voltage Breakdown Test)', department: 'QC Section', version: 'v3.0', types: ['A', 'B', 'C', 'D'] },
  { code: 'QCW002-001', name: 'การตรวจสอบรอยเชื่อมและจุดยึดโครงสร้างหม้อแปลง (Structural Inspection)', department: 'QC Section', version: 'v1.4', types: ['C', 'D'] },
  { code: 'QCW004-001', name: 'การทดสอบวัดค่าการสูญเสียในสภาวะไร้ภาระ (No-Load Loss Measurement)', department: 'QC Section', version: 'v1.5', types: ['A', 'C', 'D'] },
  { code: 'QCW005-001', name: 'การตรวจสอบฉลาก รหัสสี และสเปกบรรจุภัณฑ์ก่อนจัดส่ง (Final Product Audit)', department: 'QC Section', version: 'v1.1', types: ['C', 'E'] },

  // Production (4 WIs)
  { code: 'PROD-010-01', name: 'การพันคอยล์และประกอบแกนเหล็กหม้อแปลง (Core & Coil Assembly)', department: 'Production', version: 'v2.0', types: ['A', 'B', 'E'] },
  { code: 'PROD-010-02', name: 'การเติมน้ำมันฉนวนสูญญากาศ (Vacuum Oil Filling Process)', department: 'Production', version: 'v1.8', types: ['B', 'C', 'E'] },
  { code: 'PROD-020-01', name: 'การประกอบตัวถังภายนอกและติดตั้งซีลกันรั่ว (Tank Assembly & Sealing)', department: 'Production', version: 'v2.2', types: ['B', 'E'] },
  { code: 'PROD-030-01', name: 'การพ่นสีอบความร้อนรองพื้นและเคลือบเงา (Surface Coating & Painting)', department: 'Production', version: 'v1.3', types: ['B', 'E'] },

  // Engineering (3 WIs)
  { code: 'ENG-M-001', name: 'การบำรุงรักษาเชิงป้องกันเครื่องจักรทดสอบประจำเดือน (Preventive Maintenance)', department: 'Engineering', version: 'v1.2', types: ['B', 'D', 'E'] },
  { code: 'ENG-M-002', name: 'การสอบเทียบเครื่องมือวัดไฟฟ้ามาตรฐาน ISO/IEC 17025 (Calibration Procedure)', department: 'Engineering', version: 'v4.1', types: ['C', 'D'] },
  { code: 'ENG-D-003', name: 'การจำลองและวิเคราะห์ความร้อนหม้อแปลงด้วยวงจรทดสอบ (Thermal Run Test)', department: 'Engineering', version: 'v2.0', types: ['B', 'D'] },
];

const skillTypesHeader = [
  { code: 'A', name: 'Circuit Connecting' },
  { code: 'B', name: 'Machine Operator' },
  { code: 'C', name: 'Inspection Report' },
  { code: 'D', name: 'Data Analysis' },
  { code: 'E', name: 'Safety Control' }
];

const mockEmployeesProfiles: EmployeeProfile[] = [
  {
    id: 'EMP001',
    name: 'นายสมชาย ใจดี',
    role: 'Staff',
    department: 'QC Section',
    position: 'Quality Inspector',
    supervisor: 'นางสาวอรุณี รักดี (Chief)',
    joinedDate: '2024-03-15',
    scores: {
      'QCW001-001_A': 3, 'QCW001-001_B': 2, 'QCW001-001_C': 1, 'QCW001-001_D': 2,
      'QCW001-002_A': 2, 'QCW001-002_B': 3, 'QCW001-002_C': 2, 'QCW001-002_D': 1,
      'QCW002-001_C': 1, 'QCW002-001_D': 2,
      'QCW004-001_A': 2, 'QCW004-001_C': 2, 'QCW004-001_D': 1,
      'QCW005-001_C': 3, 'QCW005-001_E': 2
    }
  },
  {
    id: 'EMP002',
    name: 'นางสาวอรุณี รักดี',
    role: 'Chief',
    department: 'QC Section',
    position: 'QC Supervisor (Chief)',
    supervisor: 'นายกฤต พร้อมใจ (Manager)',
    joinedDate: '2022-01-10',
    scores: {
      'QCW001-001_A': 3, 'QCW001-001_B': 3, 'QCW001-001_C': 3, 'QCW001-001_D': 2,
      'QCW001-002_A': 3, 'QCW001-002_B': 3, 'QCW001-002_C': 3, 'QCW001-002_D': 2,
      'QCW002-001_C': 3, 'QCW002-001_D': 3,
      'QCW004-001_A': 3, 'QCW004-001_C': 3, 'QCW004-001_D': 2,
      'QCW005-001_C': 3, 'QCW005-001_E': 3
    }
  },
  {
    id: 'EMP003',
    name: 'นายกฤต พร้อมใจ',
    role: 'Manager',
    department: 'QC Section',
    position: 'QC Manager',
    supervisor: 'ผู้จัดการฝ่ายผลิต',
    joinedDate: '2020-05-01',
    scores: {
      'QCW001-001_A': 1, 'QCW001-001_B': 1, 'QCW001-001_C': 2, 'QCW001-001_D': 0,
      'QCW001-002_A': 1, 'QCW001-002_B': 1, 'QCW001-002_C': 2, 'QCW001-002_D': 0,
      'QCW002-001_C': 1, 'QCW002-001_D': 0
    }
  },
  {
    id: 'EMP005',
    name: 'นางสาวแนน สุขใจ',
    role: 'Staff',
    department: 'Engineering',
    position: 'Calibration Engineer',
    supervisor: 'นายวิชัย เก่งดี (Chief)',
    joinedDate: '2023-09-01',
    scores: {
      'ENG-M-001_B': 2, 'ENG-M-001_D': 3, 'ENG-M-001_E': 2,
      'ENG-M-002_C': 3, 'ENG-M-002_D': 2,
      'ENG-D-003_B': 2, 'ENG-D-003_D': 3
    }
  },
  {
    id: 'EMP008',
    name: 'นายสมศักดิ์ มั่นคง',
    role: 'Staff',
    department: 'Production',
    position: 'Production Technician',
    supervisor: 'Chief เอกวิทย์ (Chief)',
    joinedDate: '2023-02-15',
    scores: {
      'PROD-010-01_A': 2, 'PROD-010-01_B': 2, 'PROD-010-01_E': 1,
      'PROD-010-02_B': 2, 'PROD-010-02_C': 1, 'PROD-010-02_E': 2,
      'PROD-020-01_B': 2, 'PROD-020-01_E': 1,
      'PROD-030-01_B': 1, 'PROD-030-01_E': 2
    }
  }
];

const ITEMS_PER_PAGE = 6;

export default function IndividualSkillMatrix() {
  const [selectedDept, setSelectedDept] = useState('QC Section');
  const [selectedEmpId, setSelectedEmpId] = useState('EMP001');
  const [selectedWiFilter, setSelectedWiFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [radarCategory, setRadarCategory] = useState<'overall' | 'hard' | 'soft'>('overall');

  // Department Employees List
  const deptEmployees = mockEmployeesProfiles.filter(e => e.department === selectedDept);
  
  // Current Selected Employee Profile
  const emp = mockEmployeesProfiles.find(e => e.id === selectedEmpId) || deptEmployees[0] || mockEmployeesProfiles[0];

  // WIs for selected department
  const deptWIs = masterWIs.filter(w => w.department === emp.department);
  const activeWIs = selectedWiFilter === 'ALL'
    ? deptWIs
    : deptWIs.filter(w => w.code === selectedWiFilter);

  // Filter skills based on Radar category pill selection
  const activeSkillHeaders = skillTypesHeader.filter(st => {
    if (radarCategory === 'hard') return ['A', 'B', 'C'].includes(st.code);
    if (radarCategory === 'soft') return ['D', 'E'].includes(st.code);
    return true; // overall
  });

  // Calculate scores for active radar category
  const radarData = activeSkillHeaders.map(st => {
    let total = 0;
    let count = 0;
    deptWIs.forEach(w => {
      const key = `${w.code}_${st.code}`;
      if (emp.scores[key] !== undefined) {
        total += emp.scores[key];
        count++;
      }
    });
    const avg = count > 0 ? Number((total / count).toFixed(1)) : 0;
    // Score out of 3 scaled to 100
    const scaledDone = Math.min(100, Math.round((avg / 3) * 100));
    return {
      subject: st.name,
      code: `${st.code} - ${st.name.split(' ')[0]}`,
      currentDone: scaledDone,
      targetToBe: 100,
      actualAvg: avg
    };
  });

  // Pagination for WIs
  const totalPages = Math.ceil(activeWIs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedWIs = activeWIs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Metrics Calculations
  let evaluatedSkillCount = 0;
  let totalScoreSum = 0;
  let trainerCount = 0; // Level 3
  let independentCount = 0; // Level 2

  activeWIs.forEach(wi => {
    wi.types.forEach(tCode => {
      const key = `${wi.code}_${tCode}`;
      if (emp.scores[key] !== undefined) {
        const score = emp.scores[key];
        evaluatedSkillCount++;
        totalScoreSum += score;
        if (score === 3) trainerCount++;
        if (score === 2) independentCount++;
      }
    });
  });

  const avgPerWi = evaluatedSkillCount > 0 ? (totalScoreSum / evaluatedSkillCount).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            <span>หน้าหลัก</span>
            <span>&rsaquo;</span>
            <span>Skill Matrix</span>
            <span>&rsaquo;</span>
            <span className="text-blue-600 font-semibold">Individual Skill Matrix</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <User className="text-[#0a2540]" /> Individual Skill Matrix — ทักษะรายบุคคล
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            ตารางแสดงและวิเคราะห์ระดับความเชี่ยวชาญรายบุคลากร ซิงก์รหัสมาตรฐาน W/I และประเภทสกิลย่อย A, B, C, D, E
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors shadow-sm text-xs font-bold">
            <Download size={15} /> Export PDF Profile
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-md text-xs font-bold">
            <FileSpreadsheet size={15} /> Export Excel
          </button>
        </div>
      </div>

      {/* TOP FILTERS BAR: Select Employee, Select Department, Select Work Instruction */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Select Department */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">เลือกแผนก (Section)</label>
            <div className="relative">
              <select
                value={selectedDept}
                onChange={e => {
                  const newDept = e.target.value;
                  setSelectedDept(newDept);
                  const firstEmpInDept = mockEmployeesProfiles.find(emp => emp.department === newDept);
                  if (firstEmpInDept) setSelectedEmpId(firstEmpInDept.id);
                  setSelectedWiFilter('ALL');
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2.5 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="QC Section">QC Section (ฝ่ายตรวจสอบคุณภาพ)</option>
                <option value="Production">Production (ฝ่ายการผลิต)</option>
                <option value="Engineering">Engineering (ฝ่ายวิศวกรรม)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Select Employee */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">เลือกพนักงาน (Employee)</label>
            <div className="relative">
              <select
                value={selectedEmpId}
                onChange={e => { setSelectedEmpId(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2.5 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {deptEmployees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.id}) - {e.position}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Select Work Instruction Filter */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">เลือก Work Instruction</label>
            <div className="relative">
              <select
                value={selectedWiFilter}
                onChange={e => { setSelectedWiFilter(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2.5 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
              >
                <option value="ALL">ดูทุก W/I ในแผนก ({deptWIs.length})</option>
                {deptWIs.map(w => (
                  <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID: Left Employee Profile Card, Right Skill Matrix Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT CARD: EMPLOYEE PROFILE (3.5 Columns) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="text-center space-y-3">
            {/* Avatar Circle */}
            <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-slate-100 mx-auto flex items-center justify-center text-slate-400 shadow-inner">
              <User size={48} />
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-slate-800">{emp.name}</h2>
              <span className="inline-block mt-1 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-3 py-0.5 rounded-full">
                {emp.role}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <User size={13} className="text-slate-400" /> ตำแหน่งงาน
              </span>
              <span className="font-bold text-slate-800">{emp.position}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Layers size={13} className="text-slate-400" /> แผนกที่สังกัด
              </span>
              <span className="font-bold text-blue-900">{emp.department}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Award size={13} className="text-slate-400" /> รหัสพนักงาน
              </span>
              <span className="font-mono font-bold text-slate-800">{emp.id}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">หัวหน้างาน (Chief):</span>
              <span className="font-semibold text-slate-700">{emp.supervisor}</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 font-medium">วันที่เริ่มงาน:</span>
              <span className="font-semibold text-slate-700">{emp.joinedDate}</span>
            </div>
          </div>

          {/* MY SKILLS RADAR CHART (ดีไซน์ตามตัวอย่างรูปภาพภาพอ้างอิง) */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Compass size={16} className="text-blue-600" /> Radar Chart วิเคราะห์ทักษะ (My Skills)
              </h3>
            </div>

            {/* Interactive Filter Pills: Overall / Hard Skills / Soft Skills */}
            <div className="flex items-center justify-center gap-1 bg-slate-100 p-1 rounded-full text-[11px] font-semibold">
              <button
                onClick={() => setRadarCategory('overall')}
                className={`px-3 py-1 rounded-full transition-all ${radarCategory === 'overall' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Overall
              </button>
              <button
                onClick={() => setRadarCategory('hard')}
                className={`px-3 py-1 rounded-full transition-all ${radarCategory === 'hard' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Hards skills
              </button>
              <button
                onClick={() => setRadarCategory('soft')}
                className={`px-3 py-1 rounded-full transition-all ${radarCategory === 'soft' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Soft skills
              </button>
            </div>

            {/* Legend Markers */}
            <div className="flex items-center justify-around text-[10px] text-slate-600 font-semibold pt-1">
              <span className="flex items-center gap-1 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block shadow-sm"></span> Current Done (ทักษะปัจจุบัน)
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800 inline-block shadow-sm"></span> Target (เป้าหมาย 3.0)
              </span>
            </div>

            {/* Chart Graphic Area: Render Radar Chart for Overall/Hard skills, and Circular Progress Ring Gauge Cards for Soft Skills */}
            {radarCategory === 'soft' ? (
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {radarData.map(st => (
                    <div key={st.code} className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center space-y-2 flex flex-col items-center justify-between shadow-xs">
                      <div className="text-xs font-bold text-slate-800 tracking-tight">{st.code}</div>
                      
                      {/* Circular Gauge Ring */}
                      <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-200"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-indigo-600 transition-all duration-1000 ease-out"
                            strokeDasharray={`${st.currentDone}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-xs font-black text-slate-800">{st.actualAvg}</span>
                          <span className="text-[9px] font-medium text-slate-500">/ 3.0</span>
                        </div>
                      </div>

                      <div className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                        {st.currentDone}% Of Target
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                    <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="code"
                      tick={{ fill: '#334155', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: '#64748b' }} />
                    <Radar
                      name="Target (เป้าหมาย 3.0)"
                      dataKey="targetToBe"
                      stroke="#475569"
                      fill="#94a3b8"
                      fillOpacity={0.15}
                      strokeDasharray="4 4"
                    />
                    <Radar
                      name="Current Done (ทักษะจริง)"
                      dataKey="currentDone"
                      stroke="#4338ca"
                      fill="#6366f1"
                      fillOpacity={0.45}
                    />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#818cf8', fontSize: '11px', fontWeight: 'bold' }}
                      formatter={(value: any, name: any, item: any) => [
                        `${item.payload.actualAvg} / 3.0 (คิดเป็น ${value}%)`,
                        name
                      ]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="text-[10px] text-slate-400 text-center italic">
              *แสดงค่าเฉลี่ยทักษะ A-E ของ {emp.name} เปรียบเทียบเป้าหมายระดับ 3.0 (Master/Trainer)
            </p>
          </div>
        </div>

        {/* RIGHT MATRIX TABLE: Skill Types A, B, C, D, E (8.5 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-[#0a2540] text-white">
                    <th className="p-4 font-bold text-xs uppercase tracking-wide w-56 border-r border-blue-900">
                      Work Instruction
                    </th>
                    {skillTypesHeader.map(st => (
                      <th key={st.code} className="p-3 text-center border-r border-blue-900 last:border-r-0 min-w-[100px]">
                        <div className="font-bold text-xs">ทักษะประเภท {st.code}</div>
                        <div className="text-[10px] font-normal text-blue-200">({st.name})</div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedWIs.map(wi => (
                    <tr key={wi.code} className="hover:bg-blue-50/40 transition-colors">
                      {/* W/I Code & Name */}
                      <td className="p-4 border-r border-slate-200">
                        <div className="font-mono font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          <span>{wi.code}</span>
                          <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-1 py-0.2 rounded font-normal">
                            {wi.version}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2" title={wi.name}>
                          {wi.name}
                        </div>
                      </td>

                      {/* Skill Types A, B, C, D, E Cells */}
                      {skillTypesHeader.map(st => {
                        const isApplicable = wi.types.includes(st.code);
                        const key = `${wi.code}_${st.code}`;
                        const score = emp.scores[key] ?? 0;

                        if (!isApplicable) {
                          return (
                            <td key={st.code} className="p-3 text-center border-r border-slate-100 bg-slate-50/50 text-slate-300 text-xs font-mono">
                              -
                            </td>
                          );
                        }

                        return (
                          <td key={st.code} className="p-3 text-center border-r border-slate-100">
                            <div className="flex flex-col items-center justify-center gap-1">
                              <span className="text-[11px] text-slate-400 font-medium">
                                ระดับ <span className="font-bold text-slate-700">{score}</span>
                              </span>
                              <IndividualSkillPill level={score} />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Partition Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-slate-200 text-xs text-slate-500 bg-slate-50/50">
              <div>
                แสดงผล {activeWIs.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, activeWIs.length)} จากทั้งหมด {activeWIs.length} WIs (6 รายการต่อหน้า)
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
        </div>

      </div>

      {/* BOTTOM SUMMARY CARDS (ผลรวมคะแนนรวม & เฉลี่ยต่อ Work Instruction) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">ผลรวมคะแนนรวม</div>
            <div className="text-2xl font-bold text-slate-800 mt-0.5">
              {totalScoreSum} <span className="text-xs font-normal text-slate-500">คะแนน</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BarChart2 size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">เฉลี่ยต่อ Work Instruction</div>
            <div className="text-2xl font-bold text-blue-900 mt-0.5">
              {avgPerWi} <span className="text-xs font-normal text-slate-500">คะแนน</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Award size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">ทักษะระดับ Trainer (Level 3)</div>
            <div className="text-2xl font-bold text-indigo-900 mt-0.5">
              {trainerCount} <span className="text-xs font-normal text-slate-500">ทักษะ</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Layers size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">ทักษะระดับ Independent (Level 2)</div>
            <div className="text-2xl font-bold text-amber-700 mt-0.5">
              {independentCount} <span className="text-xs font-normal text-slate-500">ทักษะ</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// Level Badge with Score Bar and Grade Level Name matching Approvals page
function IndividualSkillPill({ level }: { level: number }) {
  const levelLabels: Record<number, { text: string; grade: string; color: string; bg: string }> = {
    3: { text: 'Trainer', grade: 'Level 3', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
    2: { text: 'Independent', grade: 'Level 2', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    1: { text: 'Supervision', grade: 'Level 1', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    0: { text: 'Cannot', grade: 'Level 0', color: 'text-slate-400', bg: 'bg-slate-50 border-slate-200' },
  };

  const info = levelLabels[level] || levelLabels[0];

  if (level === 3) {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="w-7 h-7 rounded-lg bg-indigo-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
          3
        </span>
        <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-900 h-full w-full rounded-full" />
        </div>
        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${info.bg} ${info.color}`}>
          {info.text}
        </span>
      </div>
    );
  }

  if (level === 2) {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
          2
        </span>
        <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-600 h-full w-2/3 rounded-full" />
        </div>
        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${info.bg} ${info.color}`}>
          {info.text}
        </span>
      </div>
    );
  }

  if (level === 1) {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
          1
        </span>
        <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full w-1/3 rounded-full" />
        </div>
        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${info.bg} ${info.color}`}>
          {info.text}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 font-bold text-xs border border-slate-200 flex items-center justify-center">
        0
      </span>
      <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div className="bg-slate-300 h-full w-0" />
      </div>
      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${info.bg} ${info.color}`}>
        {info.text}
      </span>
    </div>
  );
}
