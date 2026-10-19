import type { Role } from './phase1Core';
export interface RolePage { id:string; title:string; purpose:string; group:string; icon:'home'|'skills'|'yearly'|'request'|'approve'|'training'|'people'|'report'|'documents'|'settings'|'permissions'|'master'|'assessment' }
const page=(id:string,title:string,purpose:string,group:string,icon:RolePage['icon']):RolePage=>({id,title,purpose,group,icon});
export const ROLE_NAMES:Record<Role,string>={staff:'พื้นที่พนักงาน',chief:'พื้นที่หัวหน้างาน',manager:'พื้นที่ผู้จัดการ',admin:'พื้นที่ผู้ดูแลระบบ'};
export const ROLE_PAGES:Record<Role,RolePage[]>={
  staff:[
    page('staff-home','หน้าหลักของฉัน','ติดตามทักษะและคำขอฝึกอบรมของตนเอง','งานของฉัน','home'),
    page('staff-my-skills','ดูคะแนนของฉัน','ดูคะแนนที่ยืนยันแล้วและคะแนนรวมเพื่อทบทวนทักษะของตนเอง','ดูคะแนนสกิล','people'),
    page('staff-yearly','พัฒนาการของฉัน','ดูคะแนนและประวัติการพัฒนารายปีของตนเอง','ทักษะของฉัน','yearly'),
    page('staff-training-request','ยื่นขอฝึกอบรม','เลือกงานที่ต้องการพัฒนาและส่งคำขอให้หัวหน้า','การฝึกอบรมของฉัน','request'),
    page('staff-training-tracking','ติดตามคำขอของฉัน','ดูการตอบรับจากหัวหน้าและวันนัดอบรม','การฝึกอบรมของฉัน','training'),
    page('staff-training-results','ผลฝึกอบรมของฉัน','ดูผลประเมินและการรับรองจากผู้จัดการ','การฝึกอบรมของฉัน','report'),
  ],
  chief:[
    page('chief-home','งานที่หัวหน้าต้องดำเนินการ','ตรวจคำขอ ประเมินผล และดูทักษะทีม','งานหัวหน้างาน','home'),
    page('chief-training-requests','ตรวจคำขอฝึกอบรม','อนุมัติหรือปฏิเสธคำขอของพนักงาน พร้อมนัดหมาย','การฝึกอบรมของทีม','approve'),
    page('chief-training-evaluation','บันทึกผลฝึกอบรม','กรอกผลประเมินและส่งให้ผู้จัดการรับรอง','การฝึกอบรมของทีม','training'),
    page('chief-individual-scores','ดูคะแนนรายบุคคล','ดูคะแนน Staff และแก้ไขแบบแมนนวลเพื่อส่งให้ผู้จัดการยืนยัน','ดูคะแนนสกิล','people'),
    page('chief-team-skills','ดูคะแนนรายแผนก','ดูระดับสกิลพนักงานในแผนกแบบอ่านอย่างเดียว','ดูคะแนนสกิล','skills'),
    page('chief-yearly','พัฒนาการของทีม','ติดตามแนวโน้มคะแนนและประวัติรายปี','ทักษะของทีม','yearly'),
    page('chief-job-summary','สรุปความสามารถทีมตามงาน','ตรวจความสามารถพนักงานแยกตาม W/I และ Type','ทักษะของทีม','report'),
    page('chief-team-directory','รายชื่อพนักงานในทีม','ตรวจข้อมูลพนักงานในแผนกของตนเอง','ข้อมูลทีม','people'),
  ],
  manager:[
    page('manager-home','ภาพรวมสำหรับผู้จัดการ','วิเคราะห์ความพร้อมบุคลากร แนวโน้มคะแนน และรายการที่ควรติดตาม','งานผู้จัดการ','home'),
    page('manager-skill-approvals','ยืนยันการแก้ไขคะแนน','ตรวจและยืนยันคะแนนที่หัวหน้าแก้ไขจากหน้ารายบุคคล','รายการรอพิจารณา','approve'),
    page('manager-training-approvals','รับรองผลฝึกอบรม','พิจารณาผลประเมินที่หัวหน้าส่งมา','รายการรอพิจารณา','approve'),
    page('manager-individual-scores','ดูคะแนนรายบุคคล','ดูคะแนนรายบุคคลที่ยืนยันแล้วแบบอ่านอย่างเดียว','ดูคะแนนสกิล','people'),
    page('manager-section-skills','ดูคะแนนรายแผนก','ดูระดับสกิลของพนักงานในแผนกแบบอ่านอย่างเดียว','ดูคะแนนสกิล','skills'),
    page('manager-assessment-individual','ประเมินคะแนนรายบุคคล','รวมและสรุปคะแนนรายบุคคล พร้อมส่งออกเพื่อประกอบการประเมิน','ประเมินและสรุปคะแนน','assessment'),
    page('manager-assessment-section','ประเมินคะแนนรายแผนก','รวมคะแนนพนักงานและค่าเฉลี่ยรายแผนก พร้อมส่งออก','ประเมินและสรุปคะแนน','assessment'),
    page('manager-yearly','แนวโน้มทักษะรายแผนก','เปรียบเทียบพัฒนาการและประวัติรายปี','ภาพรวมและรายงาน','yearly'),
    page('manager-job-summary','รายงานความสามารถตามงาน','ดูรายงาน W/I และประเภทสกิล','ภาพรวมและรายงาน','report'),
    page('manager-people-directory','ข้อมูลบุคลากรประกอบการพิจารณา','อ่านข้อมูลบุคลากรทุกแผนก','ข้อมูลประกอบ','people'),
  ],
  admin:[
    page('admin-home','ภาพรวมการดูแลระบบ','จัดการข้อมูลหลักและตรวจประวัติการดำเนินงาน','ดูแลระบบ','home'),
    page('admin-employees','จัดการข้อมูลพนักงาน','เพิ่มหรือแก้ไขข้อมูลและงานที่มอบหมาย','ข้อมูลหลัก','people'),
    page('admin-master-data','จัดการข้อมูลพื้นฐาน','ดูแล Work Instruction และประเภทสกิล','ข้อมูลหลัก','master'),
    page('admin-skill-audit','ตรวจประวัติการปรับคะแนน','ตรวจคำขอและผลพิจารณาโดยไม่อนุมัติแทนผู้จัดการ','ตรวจสอบและรายงาน','report'),
    page('admin-training-audit','ตรวจประวัติฝึกอบรม','ตรวจรายการฝึกอบรมทุกขั้นตอนแบบอ่านอย่างเดียว','ตรวจสอบและรายงาน','report'),
    page('admin-reports','รายงานข้อมูลสกิล','ส่งออกรายงานความสามารถตามงาน','ตรวจสอบและรายงาน','report'),
    page('admin-settings','ตั้งค่าระบบ','ดูขอบเขตและขั้นตอนการทำงาน','ตั้งค่า','settings'),
    page('admin-permissions','สิทธิ์และบทบาท','ตรวจหน้าที่ของแต่ละบทบาท','ตั้งค่า','permissions'),
  ],
};
export function roleCanVisit(id:string,role:string) {return Object.hasOwn(ROLE_PAGES,role) && ROLE_PAGES[role as Role].some(p=>p.id===id);}
export function roleHome(role:string) {return Object.hasOwn(ROLE_PAGES,role) ? ROLE_PAGES[role as Role][0].id : 'staff-home';}
export function rolePage(id:string,role:string) {return Object.hasOwn(ROLE_PAGES,role) ? ROLE_PAGES[role as Role].find(p=>p.id===id) : undefined;}
