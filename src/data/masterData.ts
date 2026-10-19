// ============================================================
// MASTER DATA - Single Source of Truth for the entire system
// ============================================================

// -----------------------------------------------------------
// แผนก (Departments)
// -----------------------------------------------------------
export const DEPARTMENTS = [
  { id: 'QC',   label: 'QC Section',          short: 'QC' },
  { id: 'PROD', label: 'Production Section',   short: 'PROD' },
  { id: 'ENG',  label: 'Engineering Section',  short: 'ENG' },
  { id: 'MNT',  label: 'Maintenance Section',  short: 'MNT' },
  { id: 'WHS',  label: 'Warehouse Section',    short: 'WHS' },
  { id: 'IT',   label: 'IT Section',           short: 'IT' },
] as const;

export type DepartmentLabel = typeof DEPARTMENTS[number]['label'];
export const DEPARTMENT_LABELS = DEPARTMENTS.map(d => d.label);

// -----------------------------------------------------------
// ประเภทย่อยของทักษะ (Skill Sub-Types)
// -----------------------------------------------------------
export const SKILL_TYPES: Record<string, string> = {
  'A': 'A - Circuit Connecting / Wire Harnessing',
  'B': 'B - Machine Operator / Testing Station Control',
  'C': 'C - Inspection Report & Data Recording',
  'D': 'D - Data Analysis & Troubleshooting',
  'E': 'E - Safety & Environmental Control',
};

// -----------------------------------------------------------
// มาตรฐาน W/I ทั้งระบบ (Master W/I List)
// -----------------------------------------------------------
export interface MasterWI {
  code: string;
  name: string;
  department: DepartmentLabel;
  category: string;
  version: string;
  effectiveDate: string;
  author: string;
  types: { code: string; label: string }[];
  standard: string;
  purpose: string;
}

export const MASTER_WIS: MasterWI[] = [
  // QC Section
  {
    code: 'QCW001-001',
    name: 'การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น (Initial Resistance Test)',
    department: 'QC Section',
    category: 'Testing & Quality',
    version: 'v2.1',
    effectiveDate: '2025-01-15',
    author: 'Chief อรุณี รักดี',
    types: [
      { code: 'A', label: 'Circuit Connecting' },
      { code: 'B', label: 'Machine Operator' },
      { code: 'C', label: 'Inspection Report' },
      { code: 'D', label: 'Data Analysis' },
    ],
    standard: 'ISO/IEC 17025',
    purpose: 'คู่มือฉบับนี้จัดทำขึ้นเพื่อกำหนดขั้นตอนมาตรฐานในการปฏิบัติงาน การทดสอบวัดความต้านทานและฉนวนไฟฟ้าเบื้องต้น เพื่อให้มั่นใจว่ากระบวนการทดสอบเป็นไปตามเกณฑ์มาตรฐานความปลอดภัย ISO และข้อกำหนดลูกค้าอย่างเคร่งครัด',
  },
  {
    code: 'QCW001-002',
    name: 'การทดสอบพิกัดกำลังไฟฟ้าและแรงดันสูง (High Voltage Breakdown Test)',
    department: 'QC Section',
    category: 'Testing & Quality',
    version: 'v3.0',
    effectiveDate: '2025-03-20',
    author: 'Chief อรุณี รักดี',
    types: [
      { code: 'A', label: 'Circuit Connecting' },
      { code: 'B', label: 'Machine Operator' },
      { code: 'C', label: 'Inspection Report' },
      { code: 'D', label: 'Data Analysis' },
    ],
    standard: 'ISO/IEC 17025',
    purpose: 'กำหนดขั้นตอนการทดสอบความทนทานของฉนวนไฟฟ้าภายใต้แรงดันสูง สำหรับหม้อแปลงไฟฟ้า เพื่อให้มั่นใจว่าผลิตภัณฑ์มีความปลอดภัยตามมาตรฐาน IEC 60076',
  },
  {
    code: 'QCW002-001',
    name: 'การตรวจสอบรอยเชื่อมและจุดยึดโครงสร้างหม้อแปลง (Structural Inspection)',
    department: 'QC Section',
    category: 'Mechanical & Structure',
    version: 'v1.4',
    effectiveDate: '2024-11-05',
    author: 'Chief อรุณี รักดี',
    types: [
      { code: 'C', label: 'Inspection Report' },
      { code: 'D', label: 'Data Analysis' },
    ],
    standard: 'ISO/IEC 17025',
    purpose: 'ระบุวิธีการตรวจสอบคุณภาพรอยเชื่อมและจุดยึดโครงสร้างตัวถังหม้อแปลงตามเกณฑ์ภาพ (Visual Inspection) และการทดสอบแบบไม่ทำลาย (NDT) เพื่อป้องกันการรั่วซึมและการยุบตัวในการใช้งาน',
  },
  {
    code: 'QCW004-001',
    name: 'การทดสอบวัดค่าการสูญเสียในสภาวะไร้ภาระ (No-Load Loss Measurement)',
    department: 'QC Section',
    category: 'Testing & Quality',
    version: 'v1.5',
    effectiveDate: '2025-05-10',
    author: 'Manager กฤต พร้อมใจ',
    types: [
      { code: 'A', label: 'Circuit Connecting' },
      { code: 'C', label: 'Inspection Report' },
      { code: 'D', label: 'Data Analysis' },
    ],
    standard: 'ISO/IEC 17025',
    purpose: 'อธิบายขั้นตอนการต่อวงจรและการตั้งค่าพารามิเตอร์ของเครื่องวัดพลังงาน เพื่อหาค่าความสูญเสียแกนเหล็ก (No-Load Loss) ของหม้อแปลงให้อยู่ในเกณฑ์มาตรฐานที่ยอมรับได้',
  },
  // Production Section
  {
    code: 'PROD-010-01',
    name: 'การพันคอยล์และประกอบแกนเหล็กหม้อแปลง (Core & Coil Assembly)',
    department: 'Production Section',
    category: 'Assembly Process',
    version: 'v4.0',
    effectiveDate: '2024-11-20',
    author: 'Chief พิเชษฐ์ ผลิตเก่ง',
    types: [
      { code: 'A', label: 'Circuit Connecting' },
      { code: 'B', label: 'Machine Operator' },
      { code: 'E', label: 'Safety Control' },
    ],
    standard: 'IEC 60076',
    purpose: 'กำหนดมาตรฐานและวิธีการพันคอยล์แรงสูง/แรงต่ำ และการเรียงแผ่นเหล็กซิลิคอนเพื่อประกอบเป็นแกนเหล็ก (Core Assembly) สำหรับหม้อแปลงไฟฟ้า เพื่อลดความสูญเสียทางแม่เหล็กและเพิ่มประสิทธิภาพการจ่ายไฟ',
  },
  {
    code: 'PROD-010-02',
    name: 'การเติมน้ำมันฉนวนสูญญากาศ (Vacuum Oil Filling Process)',
    department: 'Production Section',
    category: 'Assembly Process',
    version: 'v2.3',
    effectiveDate: '2025-01-10',
    author: 'Chief พิเชษฐ์ ผลิตเก่ง',
    types: [
      { code: 'B', label: 'Machine Operator' },
      { code: 'C', label: 'Inspection Report' },
      { code: 'E', label: 'Safety Control' },
    ],
    standard: 'IEC 60296',
    purpose: 'กำหนดขั้นตอนการเติมน้ำมันฉนวนภายใต้สภาวะสุญญากาศ เพื่อกำจัดฟองอากาศและความชื้นภายในตัวหม้อแปลง ซึ่งอาจทำให้ระดับฉนวนลดลงและเกิดความเสียหายในระยะยาว',
  },
  // Engineering Section
  {
    code: 'ENG-M-001',
    name: 'การบำรุงรักษาเชิงป้องกันเครื่องจักรทดสอบประจำเดือน (Monthly PM)',
    department: 'Engineering Section',
    category: 'Equipment Maintenance',
    version: 'v1.8',
    effectiveDate: '2025-02-01',
    author: 'Chief วิชัย เก่งดี',
    types: [
      { code: 'B', label: 'Machine Operator' },
      { code: 'D', label: 'Data Analysis' },
      { code: 'E', label: 'Safety Control' },
    ],
    standard: 'ISO 9001',
    purpose: 'ระบุรายการตรวจสอบ (Checklist) และวิธีการบำรุงรักษาเชิงป้องกันประจำเดือนสำหรับเครื่องจักรในฝ่ายวิศวกรรม เพื่อรักษาความแม่นยำในการวัดและยืดอายุการใช้งานของอุปกรณ์',
  },
  {
    code: 'ENG-M-002',
    name: 'การสอบเทียบเครื่องมือวัดไฟฟ้ามาตรฐาน ISO/IEC 17025 (Calibration)',
    department: 'Engineering Section',
    category: 'Calibration',
    version: 'v2.0',
    effectiveDate: '2025-04-01',
    author: 'Chief วิชัย เก่งดี',
    types: [
      { code: 'C', label: 'Inspection Report' },
      { code: 'D', label: 'Data Analysis' },
    ],
    standard: 'ISO/IEC 17025',
    purpose: 'กำหนดขั้นตอนการสอบเทียบ (Calibration) เครื่องมือวัดทางไฟฟ้า เช่น Multimeter, Power Analyzer ตามมาตรฐาน ISO/IEC 17025 เพื่อให้มั่นใจในความถูกต้องของผลการวัดที่ใช้ในกระบวนการทดสอบผลิตภัณฑ์',
  },
  // Maintenance Section
  {
    code: 'MNT001-001',
    name: 'การบำรุงรักษาเครื่องจักรพันคอยล์ (Coil Winding Machine Maintenance)',
    department: 'Maintenance Section',
    category: 'Equipment Maintenance',
    version: 'v1.2',
    effectiveDate: '2025-02-15',
    author: 'Chief วิศวะ ซ่อมสร้าง',
    types: [
      { code: 'B', label: 'Machine Operator' },
      { code: 'E', label: 'Safety Control' },
    ],
    standard: 'ISO 9001',
    purpose: 'กำหนดรอบเวลาและวิธีการบำรุงรักษาเชิงป้องกัน (Preventive Maintenance) สำหรับเครื่องจักรพันคอยล์ เพื่อยืดอายุการใช้งานและป้องกันเครื่องจักรหยุดทำงานฉุกเฉิน (Breakdown) ที่ส่งผลต่อสายการผลิต',
  },
  // Warehouse Section
  {
    code: 'WHS002-001',
    name: 'การตรวจสอบและรับเข้าวัตถุดิบ (Raw Material Receiving & Inspection)',
    department: 'Warehouse Section',
    category: 'Logistics & Storage',
    version: 'v2.0',
    effectiveDate: '2024-09-10',
    author: 'Manager จัดซื้อ',
    types: [
      { code: 'C', label: 'Inspection Report' },
    ],
    standard: 'ISO 9001',
    purpose: 'ระบุขั้นตอนการตรวจสอบความถูกต้องของใบกำกับสินค้า การตรวจสภาพวัตถุดิบเบื้องต้น และการจัดเก็บในพื้นที่ที่กำหนด เพื่อป้องกันการนำวัตถุดิบที่ไม่ผ่านมาตรฐานเข้าสู่กระบวนการผลิต',
  },
];

// Convenience lookup
export const WI_BY_CODE: Record<string, MasterWI> = Object.fromEntries(MASTER_WIS.map(w => [w.code, w]));

// -----------------------------------------------------------
// พนักงาน (Employees)
// -----------------------------------------------------------
export interface Employee {
  id: string;
  name: string;
  department: DepartmentLabel;
  position: string;
  role: 'Staff' | 'Chief' | 'Manager' | 'Admin';
  status: 'Active' | 'Archived';
  supervisorId?: string;
  supervisorName?: string;
  initialSkillsSet: boolean;
  assignedWIs: string[];
  skills: Record<string, number>;
}

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP003',
    name: 'นายกฤต พร้อมใจ',
    department: 'QC Section',
    position: 'QC Manager',
    role: 'Manager',
    status: 'Active',
    supervisorId: '',
    supervisorName: '- (Top Manager)',
    initialSkillsSet: true,
    assignedWIs: ['QCW001-001', 'QCW002-001'],
    skills: { 'QCW001-001_A': 2, 'QCW001-001_B': 3, 'QCW002-001_C': 2 },
  },
  {
    id: 'EMP002',
    name: 'นางสาวอรุณี รักดี',
    department: 'QC Section',
    position: 'QC Supervisor (Chief)',
    role: 'Chief',
    status: 'Active',
    supervisorId: 'EMP003',
    supervisorName: 'นายกฤต พร้อมใจ (Manager)',
    initialSkillsSet: true,
    assignedWIs: ['QCW001-001', 'QCW001-002'],
    skills: { 'QCW001-001_A': 3, 'QCW001-001_B': 3, 'QCW001-001_C': 3, 'QCW001-001_D': 2 },
  },
  {
    id: 'EMP001',
    name: 'นายสมชาย ใจดี',
    department: 'QC Section',
    position: 'Quality Inspector',
    role: 'Staff',
    status: 'Active',
    supervisorId: 'EMP002',
    supervisorName: 'นางสาวอรุณี รักดี (Chief)',
    initialSkillsSet: true,
    assignedWIs: ['QCW001-001', 'QCW001-002'],
    skills: { 'QCW001-001_A': 1, 'QCW001-001_B': 2, 'QCW001-001_C': 1, 'QCW001-002_A': 1 },
  },
  {
    id: 'EMP006',
    name: 'นายพิเชษฐ์ ผลิตเก่ง',
    department: 'Production Section',
    position: 'Production Supervisor (Chief)',
    role: 'Chief',
    status: 'Active',
    supervisorId: '',
    supervisorName: '- (Top Manager)',
    initialSkillsSet: true,
    assignedWIs: ['PROD-010-01', 'PROD-010-02'],
    skills: { 'PROD-010-01_A': 3, 'PROD-010-01_B': 3, 'PROD-010-02_B': 2 },
  },
  {
    id: 'EMP007',
    name: 'นายสุรชัย สายชล',
    department: 'Production Section',
    position: 'Assembly Operator',
    role: 'Staff',
    status: 'Active',
    supervisorId: 'EMP006',
    supervisorName: 'นายพิเชษฐ์ ผลิตเก่ง (Chief)',
    initialSkillsSet: true,
    assignedWIs: ['PROD-010-01'],
    skills: { 'PROD-010-01_A': 2, 'PROD-010-01_B': 1 },
  },
  {
    id: 'EMP004',
    name: 'นายวิชัย เก่งดี',
    department: 'Engineering Section',
    position: 'Engineering Supervisor (Chief)',
    role: 'Chief',
    status: 'Active',
    supervisorId: 'EMP003',
    supervisorName: 'นายกฤต พร้อมใจ (Manager)',
    initialSkillsSet: true,
    assignedWIs: ['ENG-M-001', 'ENG-M-002'],
    skills: { 'ENG-M-001_B': 3, 'ENG-M-001_D': 2, 'ENG-M-002_C': 3 },
  },
  {
    id: 'EMP005',
    name: 'นางสาวแนน สุขใจ',
    department: 'Engineering Section',
    position: 'Maintenance Engineer',
    role: 'Staff',
    status: 'Active',
    supervisorId: 'EMP004',
    supervisorName: 'นายวิชัย เก่งดี (Chief)',
    initialSkillsSet: true,
    assignedWIs: ['ENG-M-001'],
    skills: { 'ENG-M-001_B': 2, 'ENG-M-001_D': 1 },
  },
  {
    id: 'EMP008',
    name: 'Chief วิศวะ ซ่อมสร้าง',
    department: 'Maintenance Section',
    position: 'Maintenance Supervisor (Chief)',
    role: 'Chief',
    status: 'Active',
    supervisorId: '',
    supervisorName: '- (Top Manager)',
    initialSkillsSet: true,
    assignedWIs: ['MNT001-001'],
    skills: { 'MNT001-001_B': 3, 'MNT001-001_E': 3 },
  },
  {
    id: 'EMP999',
    name: 'แอดมิน ระบบ',
    department: 'IT Section',
    position: 'System Administrator',
    role: 'Admin',
    status: 'Active',
    supervisorId: '',
    supervisorName: '-',
    initialSkillsSet: false,
    assignedWIs: [],
    skills: {},
  },
];

const MOCK_DEPARTMENTS = [
  {
    name: 'QC Section' as DepartmentLabel,
    prefix: 'QCW',
    wis: ['QCW001-001', 'QCW001-002', 'QCW002-001'],
    chiefId: 'EMP002',
    chiefName: 'นางสาวอรุณี รักดี',
    managerId: 'EMP003',
    managerName: 'นายกฤต พร้อมใจ',
  },
  {
    name: 'Production Section' as DepartmentLabel,
    prefix: 'PROD',
    wis: ['PROD-010-01', 'PROD-010-02'],
    chiefId: 'EMP006',
    chiefName: 'นายพิเชษฐ์ ผลิตเก่ง',
    managerId: '',
    managerName: '',
  },
  {
    name: 'Engineering Section' as DepartmentLabel,
    prefix: 'ENG',
    wis: ['ENG-M-001', 'ENG-M-002'],
    chiefId: 'EMP004',
    chiefName: 'นายวิชัย เก่งดี',
    managerId: 'EMP003',
    managerName: 'นายกฤต พร้อมใจ',
  },
  {
    name: 'Maintenance Section' as DepartmentLabel,
    prefix: 'MNT',
    wis: ['MNT001-001'],
    chiefId: 'EMP008',
    chiefName: 'Chief วิศวะ ซ่อมสร้าง',
    managerId: '',
    managerName: '',
  },
];

const FIRST_NAMES = [
  'ธนกร', 'ณัฐพล', 'กิตติ', 'พงศกร', 'วรพล',
  'ภัทรพล', 'สิรภพ', 'ปกรณ์', 'ธีรภัทร', 'อนุชา',
  'สมศักดิ์', 'วิทยา', 'สุชาติ', 'เอกชัย', 'ชัยวัฒน์',
  'อรทัย', 'กนกวรรณ', 'สุภาวดี', 'ปวีณา', 'ศิริพร',
  'พรทิพย์', 'นภัสสร', 'ชลธิชา', 'พิมพ์ชนก', 'วราภรณ์',
];

const LAST_NAMES = [
  'ใจมั่น', 'แสงทอง', 'รุ่งเรือง', 'มีสุข', 'ตั้งใจ',
  'พัฒนกิจ', 'บุญช่วย', 'วงศ์ดี', 'ศรีสมบัติ', 'มั่นคง',
  'เจริญผล', 'สุขสำราญ', 'ประเสริฐ', 'ทองดี', 'เกียรติไพศาล',
  'วัฒนา', 'รักษาดี', 'ศรีสวัสดิ์', 'เพิ่มพูน', 'โชคดี',
];

const EMPLOYEE_POSITIONS: Record<string, string> = {
  'QC Section': 'Quality Inspector',
  'Production Section': 'Production Operator',
  'Engineering Section': 'Maintenance Engineer',
  'Maintenance Section': 'Maintenance Technician',
};

// สร้างพนักงานเพิ่มจากข้อมูลเดิมจนมีทั้งหมด 300 คน
const GENERATED_EMPLOYEES: Employee[] = Array.from(
  { length: Math.max(0, 300 - MOCK_EMPLOYEES.length) },
  (_, index) => {
    const employeeNumber = index + 1;
    const id = `EMP${String(employeeNumber + 8).padStart(3, '0')}`;

    const department =
      MOCK_DEPARTMENTS[index % MOCK_DEPARTMENTS.length];

    const isChief = employeeNumber % 15 === 0;
    const role: Employee['role'] = isChief ? 'Chief' : 'Staff';

    const firstName =
      FIRST_NAMES[index % FIRST_NAMES.length];

    const lastName =
      LAST_NAMES[
        Math.floor(index / FIRST_NAMES.length) %
        LAST_NAMES.length
      ];

    const isFemale =
      FIRST_NAMES.indexOf(firstName) >= 15;

    const name = `${isFemale ? 'นางสาว' : 'นาย'}${firstName} ${lastName}`;

    const supervisorId = isChief
      ? department.managerId
      : department.chiefId;

    const supervisorName = isChief
      ? department.managerId
        ? `${department.managerName} (Manager)`
        : '- (Top Manager)'
      : `${department.chiefName} (Chief)`;

    const assignedWIs = department.wis.slice(
      0,
      1 + (index % department.wis.length),
    );

    const skills: Record<string, number> = {};

    assignedWIs.forEach((wi, wiIndex) => {
      ['A', 'B', 'C', 'D'].forEach((skill, skillIndex) => {
        // สร้างระดับทักษะตัวอย่าง 1–3
        if ((index + wiIndex + skillIndex) % 3 !== 0) {
          skills[`${wi}_${skill}`] =
            ((index + wiIndex + skillIndex) % 3) + 1;
        }
      });
    });

    return {
      id,
      name,
      department: department.name,
      position: isChief
        ? `${department.name.replace(' Section', '')} Supervisor (Chief)`
        : EMPLOYEE_POSITIONS[department.name],
      role,
      status: 'Active',
      supervisorId,
      supervisorName,
      initialSkillsSet: true,
      assignedWIs,
      skills,
    };
  },
);

// รวมข้อมูลเดิมกับข้อมูลที่สร้างเพิ่ม
MOCK_EMPLOYEES.push(...GENERATED_EMPLOYEES);
