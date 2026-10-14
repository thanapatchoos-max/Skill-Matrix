import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  ChevronDown, BarChart2, Layers, TrendingUp, AlertCircle, CheckCircle2, Award, Download, 
  ArrowUpRight, ArrowDownRight, History, Calendar, User, Search, Check, ChevronRight, Clock, 
  ShieldCheck, ArrowRight, BookOpen, Users, Sparkles
} from 'lucide-react';

// ==========================================
// 1. DATA MODELS & MOCKUPS
// ==========================================

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

// ------------------------------------------
// 2. MOCKUP: EMPLOYEE SKILL HISTORY (2023 - 2026)
// ------------------------------------------
interface SkillYearHistory {
  year: number;
  level: number;
  scorePercent: number;
  evaluatedAt: string;
  evaluatedBy: string;
  remark: string;
}

interface EmployeeSkillRecord {
  wiCode: string;
  wiName: string;
  skillType: string;
  history: SkillYearHistory[];
}

interface EmployeeYearlyProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: EmployeeSkillRecord[];
}

const LEVEL_LABEL: Record<number, string> = {
  0: 'Cannot (ทำไม่ได้)',
  1: 'Under Supervision (มีพี่เลี้ยง)',
  2: 'Independent (ทำได้เอง)',
  3: 'Trainer (สอนผู้อื่นได้)'
};

const LEVEL_COLOR: Record<number, { bg: string; text: string; border: string }> = {
  0: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
  1: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  2: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  3: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' }
};

const mockEmployeeYearlyProfiles: EmployeeYearlyProfile[] = [
  {
    id: 'EMP001',
    name: 'นายสมชาย ใจดี',
    role: 'Quality Inspector',
    department: 'QC Section',
    skills: [
      {
        wiCode: 'QCW001-001',
        wiName: 'การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น',
        skillType: 'A - Circuit Connecting',
        history: [
          { year: 2023, level: 1, scorePercent: 72, evaluatedAt: '2023-08-15', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'เริ่มงานหลังผ่าน OJT รอบแรก ปฏิบัติงานตามคำแนะนำ' },
          { year: 2024, level: 2, scorePercent: 85, evaluatedAt: '2024-09-10', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'สามารถต่อสายวงจรได้เองอย่างถูกต้องสมบูรณ์ ไม่พบจุดหลวม' },
          { year: 2025, level: 2, scorePercent: 88, evaluatedAt: '2025-09-12', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'ปฏิบัติงานได้อย่างสม่ำเสมอ เป็นพี่เลี้ยงให้พนักงานใหม่บางช่วง' },
          { year: 2026, level: 3, scorePercent: 96, evaluatedAt: '2026-09-20', evaluatedBy: 'นายกฤต พร้อมใจ (Manager)', remark: 'ผ่านการประเมินเป็น Trainer สามารถสอนงานและรับรองผลการทดสอบได้' }
        ]
      },
      {
        wiCode: 'QCW001-002',
        wiName: 'การทดสอบพิกัดกำลังไฟฟ้าและแรงดันสูง',
        skillType: 'B - Machine Operator',
        history: [
          { year: 2023, level: 0, scorePercent: 45, evaluatedAt: '2023-08-20', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'ยังไม่ได้รับมอบหมายให้ควบคุมสถานีทดสอบแรงดันสูง' },
          { year: 2024, level: 1, scorePercent: 78, evaluatedAt: '2024-09-12', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'ผ่านการทดสอบ OJT ควบคุมเครื่องจักรภายใต้การกำกับดูแล' },
          { year: 2025, level: 2, scorePercent: 86, evaluatedAt: '2025-09-15', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'สามารถควบคุมเครื่องทดสอบและปรับพิกัดแรงดันได้ด้วยตนเอง' },
          { year: 2026, level: 2, scorePercent: 89, evaluatedAt: '2026-09-22', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'ปฏิบัติงานได้อย่างต่อเนื่อง เตรียมเสนอประเมินเป็น Trainer ในรอบถัดไป' }
        ]
      },
      {
        wiCode: 'QCW002-001',
        wiName: 'การตรวจสอบรอยเชื่อมและจุดยึดโครงสร้างหม้อแปลง',
        skillType: 'C - Inspection Report',
        history: [
          { year: 2023, level: 0, scorePercent: 50, evaluatedAt: '2023-08-25', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'ยังไม่เคยผ่านการอบรมการตรวจโครงสร้าง' },
          { year: 2024, level: 1, scorePercent: 80, evaluatedAt: '2024-09-15', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'ช่วยจดบันทึกผลการตรวจสอบรอยเชื่อม' },
          { year: 2025, level: 2, scorePercent: 85, evaluatedAt: '2025-09-18', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'ตรวจสอบและจัดทำรายงานผลการตรวจโครงสร้างได้เอง' },
          { year: 2026, level: 2, scorePercent: 88, evaluatedAt: '2026-09-25', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'ตรวจโครงสร้างตามมาตรฐาน ISO ได้ครบถ้วนถูกต้อง' }
        ]
      }
    ]
  },
  {
    id: 'EMP005',
    name: 'นางสาวแนน สุขใจ',
    role: 'Calibration Eng',
    department: 'Engineering',
    skills: [
      {
        wiCode: 'ENG-M-002',
        wiName: 'การสอบเทียบเครื่องมือวัดไฟฟ้ามาตรฐาน ISO/IEC 17025',
        skillType: 'D - Data Analysis & Calibration',
        history: [
          { year: 2023, level: 1, scorePercent: 78, evaluatedAt: '2023-07-10', evaluatedBy: 'นายวิชัย เก่งดี (Chief)', remark: 'เริ่มฝึกสอบเทียบเครื่องวัดความต้านทาน' },
          { year: 2024, level: 2, scorePercent: 88, evaluatedAt: '2024-08-15', evaluatedBy: 'นายวิชัย เก่งดี (Chief)', remark: 'คำนวณค่า Uncertainty และออกใบรับรองการสอบเทียบได้' },
          { year: 2025, level: 2, scorePercent: 91, evaluatedAt: '2025-08-20', evaluatedBy: 'นายวิชัย เก่งดี (Chief)', remark: 'ร่วมตรวจประเมินภายในระบบ ISO/IEC 17025' },
          { year: 2026, level: 3, scorePercent: 98, evaluatedAt: '2026-09-15', evaluatedBy: 'นายกฤต พร้อมใจ (Manager)', remark: 'ได้รับการแต่งตั้งเป็น Calibration Trainer ประจำห้องปฏิบัติการ' }
        ]
      },
      {
        wiCode: 'ENG-M-001',
        wiName: 'การบำรุงรักษาเชิงป้องกันเครื่องจักรทดสอบ',
        skillType: 'B - Machine Operator',
        history: [
          { year: 2023, level: 1, scorePercent: 70, evaluatedAt: '2023-07-15', evaluatedBy: 'นายวิชัย เก่งดี (Chief)', remark: 'ทำ PM เครื่องจักรตาม Check Sheet' },
          { year: 2024, level: 2, scorePercent: 84, evaluatedAt: '2024-08-18', evaluatedBy: 'นายวิชัย เก่งดี (Chief)', remark: 'แก้ไขปัญหาขัดข้องเบื้องต้นของเครื่องทดสอบได้' },
          { year: 2025, level: 2, scorePercent: 88, evaluatedAt: '2025-08-22', evaluatedBy: 'นายวิชัย เก่งดี (Chief)', remark: 'จัดทำแผน PM ประจำเดือน' },
          { year: 2026, level: 2, scorePercent: 92, evaluatedAt: '2026-09-18', evaluatedBy: 'นายวิชัย เก่งดี (Chief)', remark: 'สามารถวิเคราะห์ความผิดปกติของมอเตอร์และไฮดรอลิกได้' }
        ]
      }
    ]
  },
  {
    id: 'EMP008',
    name: 'นายสมศักดิ์ มั่นคง',
    role: 'Production Tech',
    department: 'Production',
    skills: [
      {
        wiCode: 'PROD-010-01',
        wiName: 'การพันคอยล์และประกอบแกนเหล็กหม้อแปลง',
        skillType: 'A - Core & Coil Assembly',
        history: [
          { year: 2023, level: 0, scorePercent: 40, evaluatedAt: '2023-06-15', evaluatedBy: 'Chief เอกวิทย์', remark: 'พนักงานเข้าใหม่ประจำสายการผลิต' },
          { year: 2024, level: 1, scorePercent: 74, evaluatedAt: '2024-07-20', evaluatedBy: 'Chief เอกวิทย์', remark: 'ประกอบแกนเหล็กตามขั้นตอนการทำงาน' },
          { year: 2025, level: 2, scorePercent: 86, evaluatedAt: '2025-08-10', evaluatedBy: 'Chief เอกวิทย์', remark: 'ประกอบคอยล์และแกนเหล็กได้ตามสเปกโดยไม่พบของเสีย' },
          { year: 2026, level: 2, scorePercent: 89, evaluatedAt: '2026-09-10', evaluatedBy: 'Chief เอกวิทย์', remark: 'ความเร็วในการประกอบได้ตาม Cycle Time ที่กำหนด' }
        ]
      }
    ]
  },
  {
    id: 'EMP003',
    name: 'นายกฤต พร้อมใจ',
    role: 'QC Technician',
    department: 'QC Section',
    skills: [
      {
        wiCode: 'QCW001-001',
        wiName: 'การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น',
        skillType: 'A - Circuit Connecting',
        history: [
          { year: 2023, level: 0, scorePercent: 35, evaluatedAt: '2023-09-01', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'บรรจุเข้าทำงานใหม่' },
          { year: 2024, level: 1, scorePercent: 70, evaluatedAt: '2024-09-10', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'ผ่านการทดสอบ OJT ทฤษฎีและปฏิบัติ' },
          { year: 2025, level: 1, scorePercent: 78, evaluatedAt: '2025-09-15', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'ปฏิบัติงานได้อย่างระมัดระวัง' },
          { year: 2026, level: 2, scorePercent: 86, evaluatedAt: '2026-09-22', evaluatedBy: 'นางสาวอรุณี รักดี (Chief)', remark: 'ผ่านการประเมินเป็น Independent ในรอบปี 2026' }
        ]
      }
    ]
  }
];

// ------------------------------------------
// 3. MOCKUP: SECTION YEARLY ANALYTICS (2023 - 2026)
// ------------------------------------------
interface SectionYearlyStat {
  year: number;
  avgLevel: number;
  level0: number; // Cannot
  level1: number; // Under Supervision
  level2: number; // Independent
  level3: number; // Trainer
  totalStaff: number;
  growthYoY: number; // percentage
  readinessRate: number; // % Level 2 + 3
}

const mockSectionYearlyData: Record<string, SectionYearlyStat[]> = {
  'QC Section': [
    { year: 2023, avgLevel: 1.45, level0: 7, level1: 11, level2: 5, level3: 1, totalStaff: 24, growthYoY: 0.0, readinessRate: 25.0 },
    { year: 2024, avgLevel: 1.85, level0: 4, level1: 9,  level2: 8, level3: 3, totalStaff: 24, growthYoY: 27.6, readinessRate: 45.8 },
    { year: 2025, avgLevel: 2.10, level0: 2, level1: 6,  level2: 11, level3: 5, totalStaff: 24, growthYoY: 13.5, readinessRate: 66.7 },
    { year: 2026, avgLevel: 2.45, level0: 1, level1: 3,  level2: 12, level3: 8, totalStaff: 24, growthYoY: 16.7, readinessRate: 83.3 },
  ],
  'Production': [
    { year: 2023, avgLevel: 1.35, level0: 10, level1: 14, level2: 4, level3: 1, totalStaff: 29, growthYoY: 0.0, readinessRate: 17.2 },
    { year: 2024, avgLevel: 1.70, level0: 6,  level1: 12, level2: 8, level3: 3, totalStaff: 29, growthYoY: 25.9, readinessRate: 37.9 },
    { year: 2025, avgLevel: 2.00, level0: 3,  level1: 8,  level2: 13, level3: 5, totalStaff: 29, growthYoY: 17.6, readinessRate: 62.1 },
    { year: 2026, avgLevel: 2.30, level0: 1,  level1: 5,  level2: 15, level3: 8, totalStaff: 29, growthYoY: 15.0, readinessRate: 79.3 },
  ],
  'Engineering': [
    { year: 2023, avgLevel: 1.65, level0: 4, level1: 7,  level2: 5, level3: 2, totalStaff: 18, growthYoY: 0.0, readinessRate: 38.9 },
    { year: 2024, avgLevel: 2.05, level0: 2, level1: 5,  level2: 8, level3: 3, totalStaff: 18, growthYoY: 24.2, readinessRate: 61.1 },
    { year: 2025, avgLevel: 2.25, level0: 1, level1: 3,  level2: 9, level3: 5, totalStaff: 18, growthYoY: 9.8, readinessRate: 77.8 },
    { year: 2026, avgLevel: 2.60, level0: 0, level1: 2,  level2: 9, level3: 7, totalStaff: 18, growthYoY: 15.6, readinessRate: 88.9 },
  ],
};

// ==========================================
// 4. MAIN COMPONENT
// ==========================================

export function CompareSkillMatrix({ userRole = 'admin' }: { userRole?: string }) {
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager' || userRole === 'admin';

  // Modes:
  // 'year' = 2025 vs 2026 WI comparison
  // 'history' = Employee Skill History Timeline (2023 -> 2026)
  // 'section_yearly' = Section Yearly Stats (Average, Headcount by Level, Growth)
  // 'department' = Cross-Department Benchmark
  const [compareMode, setCompareMode] = useState<'year' | 'history' | 'section_yearly' | 'department'>('year');
  const [selectedDept, setSelectedDept] = useState(isChief ? 'QC Section' : 'QC Section');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('EMP001');
  const [selectedWiForHistory, setSelectedWiForHistory] = useState('ALL');

  // Filter Data for WI Comparison Mode
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

  // Selected Employee History Data
  const currentProfile = mockEmployeeYearlyProfiles.find(p => p.id === selectedEmployeeId) || mockEmployeeYearlyProfiles[0];
  const displayedSkills = selectedWiForHistory === 'ALL'
    ? currentProfile.skills
    : currentProfile.skills.filter(s => s.wiCode === selectedWiForHistory);

  // Section Yearly Stats for chosen dept
  const currentSectionHistory = mockSectionYearlyData[selectedDept] || mockSectionYearlyData['QC Section'];
  const latestStat = currentSectionHistory[currentSectionHistory.length - 1];
  const baseStat = currentSectionHistory[0];
  const overallSectionGrowth = (((latestStat.avgLevel - baseStat.avgLevel) / baseStat.avgLevel) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header & Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="text-[#0a2540]" /> เปรียบเทียบ Skill Matrix (Competency Analytics)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            เครื่องมือวิเคราะห์การเติบโตของสมรรถนะบุคลากร (Year-over-Year), ประวัติทักษะ (Skill History) และประเมินความเสี่ยง OJT
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors shadow-xs text-xs font-bold">
            <Download size={15} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Growth Rate */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
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
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
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
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
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
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
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
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Mode Switcher */}
          <div className="space-y-1 overflow-hidden">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">เลือกโหมดการวิเคราะห์ (ANALYTICS VIEW)</label>
            <div className="flex flex-nowrap overflow-x-auto bg-slate-200/70 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setCompareMode('year')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  compareMode === 'year' ? 'bg-white text-[#0a2540] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp size={14} /> แนวโน้ม W/I รายปี (2025 vs 2026)
              </button>
              <button
                type="button"
                onClick={() => setCompareMode('history')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  compareMode === 'history' ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-300' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History size={14} className="text-blue-600" /> ประวัติสกิลรายบุคคล (Skill History)
              </button>
              <button
                type="button"
                onClick={() => setCompareMode('section_yearly')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  compareMode === 'section_yearly' ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-300' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar size={14} className="text-emerald-600" /> สถิติระดับ Section รายปี
              </button>
              <button
                type="button"
                onClick={() => setCompareMode('department')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  compareMode === 'department' ? 'bg-white text-[#0a2540] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers size={14} /> เปรียบเทียบระหว่างแผนก (Cross-Dept)
              </button>
            </div>
          </div>

          {/* Sub-Filters depending on mode */}
          <div className="flex items-center gap-3 flex-shrink-0">
          {(compareMode === 'year' || compareMode === 'section_yearly') && (
            <div className="space-y-1 w-full lg:w-auto">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">กรองเฉพาะแผนก</label>
              <div className="relative">
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="w-full lg:w-56 appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="QC Section">QC Section (ฝ่ายตรวจสอบคุณภาพ)</option>
                  <option value="Production">Production (ฝ่ายการผลิต)</option>
                  <option value="Engineering">Engineering (ฝ่ายวิศวกรรม)</option>
                  {compareMode === 'year' && <option value="ALL">รวมทุกแผนก ({masterCompareData.length} WIs)</option>}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          {compareMode === 'history' && (
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Employee Selector */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">เลือกพนักงาน (Employee)</label>
                <div className="relative">
                  <select
                    value={selectedEmployeeId}
                    onChange={e => setSelectedEmployeeId(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[210px]"
                  >
                    {mockEmployeeYearlyProfiles.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id}) · {p.department}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* WI Filter */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">กรอง W/I</label>
                <div className="relative">
                  <select
                    value={selectedWiForHistory}
                    onChange={e => setSelectedWiForHistory(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2 pl-3 pr-9 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px] truncate"
                  >
                    <option value="ALL">ทุก W/I ที่รับผิดชอบ ({currentProfile.skills.length})</option>
                    {currentProfile.skills.map(s => (
                      <option key={s.wiCode} value={s.wiCode}>
                        {s.wiCode}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* ========================================================= */}
      {/* VIEW 1: W/I YEAR-OVER-YEAR COMPARISON (2025 vs 2026)      */}
      {/* ========================================================= */}
      {compareMode === 'year' && (
        <>
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="text-blue-600" size={20} />
                <h2 className="text-base font-bold text-slate-800">
                  กราฟแสดงแนวโน้มพัฒนาการทักษะข้ามปี: {selectedDept === 'ALL' ? 'ทุกแผนก' : selectedDept} (ปี 2025 เทียบกับ ปี 2026)
                </h2>
              </div>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded">
                Scale: 0.0 - 3.0 Max Score
              </span>
            </div>

            <div className="h-[380px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
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
              </ResponsiveContainer>
            </div>
          </div>

          {/* DETAILED TABLE */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
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
        </>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: 6. SKILL HISTORY & YEARLY SKILL (EMPLOYEE LEVEL)  */}
      {/* ========================================================= */}
      {compareMode === 'history' && (
        <div className="space-y-6">
          {/* Header Banner - Matching Section 6 Spec */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-blue-500/30 text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30 mb-3">
                <Sparkles size={14} className="text-yellow-400" /> 6. Skill History & Yearly Skill
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-2">
                ระบบจัดเก็บประวัติ Skill เพื่อเปรียบเทียบการพัฒนาความสามารถแบบรายปี
              </h2>
              <p className="text-blue-100 text-sm max-w-3xl leading-relaxed">
                ติดตามพัฒนาการของบุคลากรรายบุคคลแบบต่อเนื่อง (เช่น 2023 → 2024 → 2025 → 2026) พร้อมบันทึกประวัติ Audit Trail ตามเกณฑ์ ISO 17025
              </p>

              {/* Employee Summary Card inside banner */}
              <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{currentProfile.name}</div>
                    <div className="text-xs text-blue-200">
                      รหัส: <span className="font-mono font-bold text-white">{currentProfile.id}</span> · แผนก: {currentProfile.department} · ตำแหน่ง: {currentProfile.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/20 text-xs">
                  <div>
                    <span className="text-blue-200 block">จำนวน W/I ที่บันทึกประวัติ</span>
                    <strong className="text-lg font-bold text-white">{currentProfile.skills.length} ทักษะ</strong>
                  </div>
                  <div className="h-8 w-px bg-white/20 mx-1"></div>
                  <div>
                    <span className="text-blue-200 block">ปีที่บันทึกข้อมูล</span>
                    <strong className="text-sm font-mono text-emerald-300">2023 → 2026 (4 ปี)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LIST OF SKILL TIMELINES */}
          <div className="space-y-4">
            {displayedSkills.map((skill) => {
              const currentYearData = skill.history[skill.history.length - 1];
              const firstYearData = skill.history[0];
              const levelGrowth = currentYearData.level - firstYearData.level;

              // Format chart data
              const chartData = skill.history.map(h => ({
                year: h.year.toString(),
                level: h.level,
                scorePercent: h.scorePercent
              }));

              return (
                <div key={skill.wiCode} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5 hover:border-blue-300 transition-colors">
                  {/* Skill Card Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-bold bg-[#0a2540] text-white px-2.5 py-0.5 rounded">
                          {skill.wiCode}
                        </span>
                        <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                          {skill.skillType}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-base">{skill.wiName}</h3>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-center">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">ระดับปัจจุบัน (2026)</span>
                        <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full border ${LEVEL_COLOR[currentYearData.level].bg} ${LEVEL_COLOR[currentYearData.level].text} ${LEVEL_COLOR[currentYearData.level].border}`}>
                          Level {currentYearData.level} · {LEVEL_LABEL[currentYearData.level].split(' ')[0]}
                        </span>
                      </div>
                      <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-center">
                        <span className="text-[10px] block font-bold uppercase">พัฒนาการรวม</span>
                        <strong className="text-sm font-bold">+{levelGrowth} Level</strong>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL TIMELINE STEPPER (Matching User Spec Directly: 2023 -> L1 -> 2024 -> L2 ...) */}
                  <div>
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <History size={14} className="text-blue-600" /> เส้นทางพัฒนาการข้ามปี (Progression Pathway):
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {skill.history.map((h, idx) => {
                        const prev = idx > 0 ? skill.history[idx - 1] : null;
                        const diff = prev ? h.level - prev.level : 0;
                        const isCurrent = h.year === 2026;

                        return (
                          <div 
                            key={h.year} 
                            className={`p-4 rounded-xl border relative transition-all ${
                              isCurrent 
                                ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/20' 
                                : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono font-bold text-sm text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                                ปี {h.year}
                              </span>
                              {diff > 0 ? (
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                                  +{diff} Level ↗
                                </span>
                              ) : idx === 0 ? (
                                <span className="text-[10px] text-slate-400 font-semibold">จุดเริ่มต้น</span>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-semibold">คงที่ =</span>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center text-white ${
                                  h.level === 3 ? 'bg-indigo-600' :
                                  h.level === 2 ? 'bg-emerald-600' :
                                  h.level === 1 ? 'bg-amber-500' : 'bg-slate-400'
                                }`}>
                                  {h.level}
                                </span>
                                <span className="font-bold text-slate-800 text-xs">
                                  {LEVEL_LABEL[h.level].split(' ')[0]}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">
                                {LEVEL_LABEL[h.level]}
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 flex justify-between items-center">
                              <span>ผลประเมิน: <strong>{h.scorePercent}%</strong></span>
                              <span className="font-mono text-slate-400">{h.evaluatedAt.slice(0, 7)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SPARKLINE CHART & AUDIT LOG */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
                    {/* Level Curve Chart */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
                      <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                        <span>กราฟแนวโน้มระดับทักษะ (Skill Growth Curve)</span>
                        <span className="text-[10px] text-slate-400 font-mono">Max Level 3</span>
                      </div>
                      <div className="h-28 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id={`grad-${skill.wiCode}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                            <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} formatter={(val: any) => [`Level ${val}`, 'ระดับ']} />
                            <Area type="monotone" dataKey="level" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill={`url(#grad-${skill.wiCode})`} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Audit Trail List */}
                    <div className="lg:col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-600" /> บันทึกประวัติและเหตุผลการปรับระดับ (ISO 17025 Audit Trail):
                      </div>
                      <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                        {skill.history.slice().reverse().map(item => (
                          <div key={item.year} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded text-[10px]">
                                  ปี {item.year}
                                </span>
                                <span className="font-bold text-slate-700">Level {item.level}</span>
                                <span className="text-[11px] text-slate-400">· วันที่ {item.evaluatedAt}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-1">{item.remark}</p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap self-start sm:self-center bg-slate-100 px-2 py-0.5 rounded">
                              ผู้ประเมิน: {item.evaluatedBy}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: SECTION YEARLY ANALYTICS (GROWTH, HEADCOUNT, AVG) */}
      {/* ========================================================= */}
      {compareMode === 'section_yearly' && (
        <div className="space-y-6">
          {/* Section KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Average Skill Level (2026)</div>
              <div className="text-3xl font-black text-blue-900 mt-1 flex items-baseline gap-2">
                {latestStat.avgLevel.toFixed(2)} <span className="text-sm font-normal text-slate-400">/ 3.0</span>
              </div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                ↗ เพิ่มขึ้นจากปี 2023 ({baseStat.avgLevel.toFixed(2)}) +{overallSectionGrowth}%
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">จำนวนวิทยากร (Level 3 - Trainer)</div>
              <div className="text-3xl font-black text-indigo-700 mt-1 flex items-baseline gap-2">
                {latestStat.level3} คน <span className="text-sm font-normal text-slate-400">จากทั้งหมด {latestStat.totalStaff} คน</span>
              </div>
              <p className="text-xs text-indigo-600 font-semibold mt-1">
                สร้าง Trainer เพิ่มขึ้น +{latestStat.level3 - baseStat.level3} คนในรอบ 4 ปี
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">ความพร้อมทำงานอิสระ (Level 2 + 3)</div>
              <div className="text-3xl font-black text-emerald-600 mt-1">
                {latestStat.readinessRate}%
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                บุคลากร {latestStat.level2 + latestStat.level3} / {latestStat.totalStaff} คน ทำงานได้เองโดยไม่ต้องพี่เลี้ยง
              </p>
            </div>
          </div>

          {/* TWO ANALYTICS CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Stacked Bar Chart of Headcount by Level */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Users size={16} className="text-blue-600" /> จำนวนพนักงานในแต่ละ Level รายปี ({selectedDept}: 2023 - 2026)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">แสดงการกระจายตัวของระดับความสามารถเพื่อลดช่องว่างทักษะ</p>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentSectionHistory} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
                    <Bar dataKey="level0" name="Level 0 (Cannot)" stackId="a" fill="#cbd5e1" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="level1" name="Level 1 (Supervision)" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="level2" name="Level 2 (Independent)" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="level3" name="Level 3 (Trainer)" stackId="a" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Average Skill Level & Growth YoY Line Chart */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-600" /> คะแนนเฉลี่ย & อัตราเติบโต (Average Level & Growth YoY)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">การเติบโตของสมรรถนะเฉลี่ย (Skill Growth Trend)</p>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentSectionHistory} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" domain={[1.0, 3.0]} ticks={[1.0, 1.5, 2.0, 2.5, 3.0]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="avgLevel" name="Average Skill Level (0-3)" stroke="#0a2540" strokeWidth={3} dot={{ r: 5 }} />
                    <Line yAxisId="right" type="monotone" dataKey="readinessRate" name="% ความพร้อมปฏิบัติงานอิสระ" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* SECTION YEARLY SUMMARY TABLE */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={16} className="text-slate-500" /> ตารางสรุปสถิติสมรรถนะรายปี (Section Yearly Competency Breakdown: {selectedDept})
              </h3>
              <span className="text-xs text-slate-500 font-semibold">ข้อมูลเปรียบเทียบ 2023 - 2026</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wide">
                    <th className="px-4 py-3.5">ปี (Year)</th>
                    <th className="px-4 py-3.5 text-center">คะแนนเฉลี่ย (Avg Level)</th>
                    <th className="px-4 py-3.5 text-center">L0 (Cannot)</th>
                    <th className="px-4 py-3.5 text-center">L1 (Supervision)</th>
                    <th className="px-4 py-3.5 text-center">L2 (Independent)</th>
                    <th className="px-4 py-3.5 text-center">L3 (Trainer)</th>
                    <th className="px-4 py-3.5 text-center">ความพร้อม (L2+L3)</th>
                    <th className="px-4 py-3.5 text-center">อัตราเติบโต YoY</th>
                    <th className="px-4 py-3.5">การวิเคราะห์และข้อเสนอแนะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {currentSectionHistory.map(row => (
                    <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-800">{row.year}</td>
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-blue-900 text-base">{row.avgLevel.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-center font-mono text-slate-500">{row.level0} คน</td>
                      <td className="px-4 py-3.5 text-center font-mono text-amber-700 font-semibold">{row.level1} คน</td>
                      <td className="px-4 py-3.5 text-center font-mono text-emerald-700 font-semibold">{row.level2} คน</td>
                      <td className="px-4 py-3.5 text-center font-mono text-indigo-700 font-bold">{row.level3} คน</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          {row.readinessRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-xs">
                        {row.growthYoY > 0 ? (
                          <span className="text-emerald-600">+{row.growthYoY}%</span>
                        ) : (
                          <span className="text-slate-400">ฐานปีแรก</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600">
                        {row.year === 2026 ? 'สมรรถนะผ่านเกณฑ์มาตรฐาน ISO 17025 มี Trainer เพียงพอกระจายทุกสถานี' :
                         row.year === 2025 ? 'พัฒนาการเติบโตต่อเนื่อง เริ่มปรับพนักงานส่วนใหญ่เป็น Independent' :
                         row.year === 2024 ? 'จัดทำ OJT Intensive ปรับลดพนักงานในกลุ่ม Cannot ได้เกินกึ่งหนึ่ง' :
                         'ปีเริ่มต้นบันทึกข้อมูลสมรรถนะในระบบดิจิทัล'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 4: CROSS-DEPARTMENT BENCHMARKING                     */}
      {/* ========================================================= */}
      {compareMode === 'department' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="text-blue-600" size={20} />
                <h2 className="text-base font-bold text-slate-800">
                  กราฟเปรียบเทียบคะแนนเฉลี่ยสมรรถนะรวมข้ามแผนก: QC Section vs Production vs Engineering
                </h2>
              </div>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded">
                Scale: 0.0 - 3.0 Max Score
              </span>
            </div>

            <div className="h-[380px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
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
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
