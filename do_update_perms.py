import io
import re

with io.open("src/pages/PermissionsPage.tsx", "r", encoding="utf-8") as f:
    text = f.read()

start_idx = text.find("const pagePermissionSchema: PageFeature[] = [")
end_idx = text.find("export function PermissionsPage")

if start_idx != -1 and end_idx != -1:
    new_data = """const pagePermissionSchema: PageFeature[] = [
  {
    pageId: 'page_dashboard',
    pageName: '1. แดชบอร์ด (Dashboard)',
    description: 'ภาพรวมระบบ, สถิติกำลังคน, สถานะ OJT',
    actions: [
      { key: 'dashboard_view', label: 'เข้าดูแดชบอร์ด (View)', shortCode: 'view' },
      { key: 'dashboard_export', label: 'Export ข้อมูล (Export)', shortCode: 'export' },
    ]
  },
  {
    pageId: 'page_working_record',
    pageName: '2. บันทึกการทำงาน (Working Record)',
    description: 'บันทึกการปฏิบัติงานรายวัน, ชั่วโมงการทำงาน, ของเสีย',
    actions: [
      { key: 'working_view', label: 'ดูประวัติบันทึก (View)', shortCode: 'view' },
      { key: 'working_create', label: 'เพิ่มบันทึกงาน (Create)', shortCode: 'create' },
      { key: 'working_edit', label: 'แก้ไขบันทึก (Edit)', shortCode: 'edit' },
    ]
  },
  {
    pageId: 'page_evaluation',
    pageName: '3. ระบบประเมินทักษะ (Skill Evaluation)',
    description: 'ประเมินระดับทักษะอัตโนมัติจากข้อมูลปฏิบัติงาน',
    actions: [
      { key: 'eval_view', label: 'ดูผลประเมิน (View)', shortCode: 'view' },
      { key: 'eval_submit', label: 'ส่งคำขออนุมัติทักษะ (Submit)', shortCode: 'submit' },
      { key: 'eval_manage', label: 'จัดการผลประเมิน (Manage)', shortCode: 'manage' },
    ]
  },
  {
    pageId: 'page_training',
    pageName: '4. ระบบจัดการการฝึกอบรม (Training)',
    description: 'บันทึกคะแนนสอบ OJT ทฤษฎี/ปฏิบัติ',
    actions: [
      { key: 'ojt_view', label: 'ดูประวัติ OJT (View)', shortCode: 'view' },
      { key: 'ojt_create', label: 'สร้างการประเมิน (Create)', shortCode: 'create' },
      { key: 'ojt_edit', label: 'แก้ไข/ให้คะแนน (Edit)', shortCode: 'edit' },
      { key: 'ojt_delete', label: 'ลบประวัติ (Delete)', shortCode: 'delete' },
    ]
  },
  {
    pageId: 'page_approvals',
    pageName: '5. ระบบการอนุมัติ (Approval)',
    description: 'อนุมัติคำขอเลื่อนระดับทักษะ และผลสอบ OJT',
    actions: [
      { key: 'approval_view', label: 'ดูรายการคำขอ (View)', shortCode: 'view' },
      { key: 'approval_approve', label: 'อนุมัติ/ปฏิเสธ (Approve)', shortCode: 'approve' },
    ]
  },
  {
    pageId: 'page_overview_matrix',
    pageName: '6. ภาพรวม Skill Matrix (Section Matrix)',
    description: 'ตารางสรุปทักษะภาพรวมแผนก',
    actions: [
      { key: 'section_matrix_view', label: 'เข้าดูภาพรวม (View)', shortCode: 'view' },
      { key: 'section_matrix_export', label: 'Export ข้อมูล (Export)', shortCode: 'export' },
    ]
  },
  {
    pageId: 'page_individual_matrix',
    pageName: '7. ทักษะรายบุคคล (Individual Matrix)',
    description: 'รายละเอียดทักษะรายบุคคล, Radar Chart',
    actions: [
      { key: 'individual_view', label: 'เข้าดูทักษะ (View)', shortCode: 'view' },
      { key: 'individual_export', label: 'Export โปรไฟล์ (Export)', shortCode: 'export' },
    ]
  },
  {
    pageId: 'page_compare',
    pageName: '8. เปรียบเทียบ (Compare Matrix)',
    description: 'เปรียบเทียบคะแนนทักษะรายแผนก แบบข้ามปี',
    actions: [
      { key: 'compare_view', label: 'เข้าดูเปรียบเทียบ (View)', shortCode: 'view' },
      { key: 'compare_export', label: 'Export ข้อมูล (Export)', shortCode: 'export' },
    ]
  },
  {
    pageId: 'page_capacity',
    pageName: '9. Workload & Capacity',
    description: 'ตรวจสอบกำลังการผลิตตามทักษะพนักงาน',
    actions: [
      { key: 'capacity_view', label: 'เข้าดูกำลังคน (View)', shortCode: 'view' },
    ]
  },
  {
    pageId: 'page_wi_library',
    pageName: '10. คลังคู่มือ W/I (W/I Library)',
    description: 'เอกสารคู่มือปฏิบัติงานมาตรฐาน',
    actions: [
      { key: 'wi_view', label: 'เข้าอ่านคู่มือ (View)', shortCode: 'view' },
      { key: 'wi_manage', label: 'จัดการคู่มือ (Manage)', shortCode: 'manage' },
    ]
  },
  {
    pageId: 'page_employees',
    pageName: '11. จัดการพนักงาน (Employee Management)',
    description: 'เพิ่ม/แก้ไข ข้อมูลประวัติพนักงาน',
    actions: [
      { key: 'emp_view', label: 'ดูประวัติ (View)', shortCode: 'view' },
      { key: 'emp_create', label: 'เพิ่มพนักงาน (Create)', shortCode: 'create' },
      { key: 'emp_edit', label: 'แก้ไข (Edit)', shortCode: 'edit' },
      { key: 'emp_delete', label: 'ลบ (Delete)', shortCode: 'delete' },
    ]
  },
  {
    pageId: 'page_master_data',
    pageName: '12. จัดการข้อมูลพื้นฐาน (Master Data)',
    description: 'กำหนดรหัส W/I, Skill Types',
    actions: [
      { key: 'master_view', label: 'ดูข้อมูล (View)', shortCode: 'view' },
      { key: 'master_manage', label: 'จัดการข้อมูล (Manage)', shortCode: 'manage' },
    ]
  },
  {
    pageId: 'page_settings',
    pageName: '13. ตั้งค่าระบบ (Settings & Permissions)',
    description: 'กำหนดสิทธิ์, ตั้งค่า UI, นโยบายความปลอดภัย',
    actions: [
      { key: 'settings_view', label: 'เข้าดูตั้งค่า (View)', shortCode: 'view' },
      { key: 'settings_manage', label: 'จัดการตั้งค่า (Manage)', shortCode: 'manage' },
      { key: 'permissions_manage', label: 'จัดการสิทธิ์ Role (Permissions)', shortCode: 'approve' },
    ]
  }
];

interface PermissionRole {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
  isSystemRole: boolean;
  permissions: Record<string, boolean>;
}

const initialRoles: PermissionRole[] = [
  {
    id: 'role-admin',
    name: 'ผู้ดูแลระบบ (System Admin)',
    code: 'ADMIN',
    description: 'สิทธิ์สูงสุด เข้าถึงและจัดการได้ทุกส่วนของระบบ (Create, View, Edit, Delete, Approve)',
    userCount: 2,
    isSystemRole: true,
    permissions: pagePermissionSchema.reduce((acc, p) => {
      p.actions.forEach(a => acc[a.key] = true);
      return acc;
    }, {} as Record<string, boolean>)
  },
  {
    id: 'role-manager',
    name: 'ผู้จัดการแผนก (Department Manager)',
    code: 'MANAGER',
    description: 'อนุมัติการเลื่อนระดับทักษะ, ดูรายงาน, วิเคราะห์ Capacity, ดูภาพรวมได้ทุกแผนก',
    userCount: 4,
    isSystemRole: true,
    permissions: {
      dashboard_view: true, dashboard_export: true,
      working_view: true, working_create: false, working_edit: false,
      eval_view: true, eval_submit: false, eval_manage: false,
      ojt_view: true, ojt_create: false, ojt_edit: false, ojt_delete: false,
      approval_view: true, approval_approve: true,
      section_matrix_view: true, section_matrix_export: true,
      individual_view: true, individual_export: true,
      compare_view: true, compare_export: true,
      capacity_view: true,
      wi_view: true, wi_manage: false,
      emp_view: true, emp_create: false, emp_edit: false, emp_delete: false,
      master_view: true, master_manage: false,
      settings_view: false, settings_manage: false, permissions_manage: false
    }
  },
  {
    id: 'role-chief',
    name: 'หัวหน้างาน (Section Chief)',
    code: 'CHIEF',
    description: 'จัดการพนักงานในแผนก, ประเมินและให้คะแนน OJT, ดูสรุปการทำงานของทีม',
    userCount: 8,
    isSystemRole: true,
    permissions: {
      dashboard_view: true, dashboard_export: true,
      working_view: true, working_create: true, working_edit: true,
      eval_view: true, eval_submit: true, eval_manage: true,
      ojt_view: true, ojt_create: true, ojt_edit: true, ojt_delete: false,
      approval_view: false, approval_approve: false,
      section_matrix_view: true, section_matrix_export: true,
      individual_view: true, individual_export: true,
      compare_view: true, compare_export: true,
      capacity_view: true,
      wi_view: true, wi_manage: true,
      emp_view: true, emp_create: true, emp_edit: true, emp_delete: false,
      master_view: true, master_manage: true,
      settings_view: false, settings_manage: false, permissions_manage: false
    }
  },
  {
    id: 'role-staff',
    name: 'พนักงานทั่วไป (Staff)',
    code: 'STAFF',
    description: 'สิทธิ์ดูเฉพาะข้อมูลส่วนตัว (My Profile), บันทึกการทำงานของตนเอง, ดูคู่มือ W/I',
    userCount: 65,
    isSystemRole: true,
    permissions: {
      dashboard_view: true, dashboard_export: false,
      working_view: true, working_create: true, working_edit: false,
      eval_view: true, eval_submit: true, eval_manage: false,
      ojt_view: true, ojt_create: false, ojt_edit: false, ojt_delete: false,
      approval_view: false, approval_approve: false,
      section_matrix_view: false, section_matrix_export: false,
      individual_view: true, individual_export: false,
      compare_view: false, compare_export: false,
      capacity_view: false,
      wi_view: true, wi_manage: false,
      emp_view: false, emp_create: false, emp_edit: false, emp_delete: false,
      master_view: false, master_manage: false,
      settings_view: false, settings_manage: false, permissions_manage: false
    }
  }
];

"""
    new_text = text[:start_idx] + new_data + text[end_idx:]
    with io.open("src/pages/PermissionsPage.tsx", "w", encoding="utf-8") as f:
        f.write(new_text)
    print("PermissionsPage successfully updated.")
else:
    print("Markers not found.")
