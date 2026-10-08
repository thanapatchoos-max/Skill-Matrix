import React, { useState } from 'react';
import { ShieldCheck, Plus, Check, Shield, Lock, Users, Key, Save, Info, ChevronRight, Eye, Edit3, Trash2, CheckCircle2, FileSpreadsheet, Send, FileCheck } from 'lucide-react';

interface PageFeature {
  pageId: string;
  pageName: string;
  description: string;
  actions: {
    key: string;
    label: string;
    shortCode: 'create' | 'view' | 'edit' | 'delete' | 'export' | 'approve' | 'submit';
  }[];
}

const pagePermissionSchema: PageFeature[] = [
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
      { key: 'eval_manage', label: 'จัดการผลประเมิน (Manage)', shortCode: 'edit' },
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
      { key: 'wi_manage', label: 'จัดการคู่มือ (Manage)', shortCode: 'edit' },
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
      { key: 'master_manage', label: 'จัดการข้อมูล (Manage)', shortCode: 'edit' },
    ]
  },
  {
    pageId: 'page_reports',
    pageName: '13. รายงาน (Reports)',
    description: 'ออกรายงานสถิติแบบ Excel และ PDF',
    actions: [
      { key: 'reports_view', label: 'ดูรายงาน (View)', shortCode: 'view' },
      { key: 'reports_export', label: 'Export ข้อมูล (Export)', shortCode: 'export' },
    ]
  },
  {
    pageId: 'page_settings',
    pageName: '14. ตั้งค่าระบบ (Settings & Permissions)',
    description: 'กำหนดสิทธิ์, ตั้งค่า UI, นโยบายความปลอดภัย',
    actions: [
      { key: 'settings_view', label: 'เข้าดูตั้งค่า (View)', shortCode: 'view' },
      { key: 'settings_manage', label: 'จัดการตั้งค่า (Manage)', shortCode: 'edit' },
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
      reports_view: true, reports_export: true,
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
      reports_view: true, reports_export: true,
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
      reports_view: false, reports_export: false,
      settings_view: false, settings_manage: false, permissions_manage: false
    }
  }
];

export function PermissionsPage({ onBackToSettings }: { onBackToSettings?: () => void }) {
  const [roles, setRoles] = useState<PermissionRole[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-admin');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [roleForm, setRoleForm] = useState<{name: string, code: string, description: string, permissions: Record<string, boolean>}>({ 
    name: '', 
    code: '', 
    description: '',
    permissions: pagePermissionSchema.reduce((acc, p) => {
      p.actions.forEach(a => acc[a.key] = (a.shortCode === 'view'));
      return acc;
    }, {} as Record<string, boolean>)
  });

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTogglePermission = (key: string) => {
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRoleId) {
        return {
          ...r,
          permissions: {
            ...r.permissions,
            [key]: !r.permissions[key]
          }
        };
      }
      return r;
    }));
  };

  // Toggle All Permissions for a Page
  const handleToggleAllForPage = (page: PageFeature, enable: boolean) => {
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRoleId) {
        const nextPerms = { ...r.permissions };
        page.actions.forEach(a => {
          nextPerms[a.key] = enable;
        });
        return { ...r, permissions: nextPerms };
      }
      return r;
    }));
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name || !roleForm.code) return;

    const newRole: PermissionRole = {
      id: `role-${Date.now()}`,
      name: roleForm.name,
      code: roleForm.code.toUpperCase(),
      description: roleForm.description || 'บทบาทผู้ใช้ที่กำหนดขึ้นใหม่',
      userCount: 0,
      isSystemRole: false,
      permissions: { ...roleForm.permissions }
    };

    setRoles([...roles, newRole]);
    setSelectedRoleId(newRole.id);
    setIsAddRoleOpen(false);
    setRoleForm({ name: '', code: '', description: '', permissions: pagePermissionSchema.reduce((acc, p) => {
        p.actions.forEach(a => acc[a.key] = (a.shortCode === 'view'));
        return acc;
      }, {} as Record<string, boolean>) });
    showToast(`สร้างบทบาทผู้ใช้ใหม่ (${newRole.name}) เรียบร้อยแล้ว!`);
  };

  const handleSavePermissions = () => {
    showToast(`บันทึกสิทธิ์แบบละเอียดสำหรับบทบาท ${selectedRole.name} เรียบร้อยแล้ว`);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <Check size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            {onBackToSettings && (
              <button onClick={onBackToSettings} className="hover:text-slate-600 underline">
                ตั้งค่าระบบ
              </button>
            )}
            {onBackToSettings && <span>&rsaquo;</span>}
            <span className="text-indigo-600 font-semibold">การจัดการสิทธิ์ & บทบาท (Role & Granular Permissions)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> ตารางจัดการสิทธิ์แบบละเอียดแยกรายหน้า (Granular Page Permissions)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            กำหนดสิทธิ์การใช้งานแต่ละหน้าแบบละเอียดรายฟังก์ชัน: <strong>Create (สร้าง)</strong>, <strong>View (ดู)</strong>, <strong>Edit (แก้ไข)</strong>, <strong>Delete (ลบ)</strong>, <strong>Export (ส่งออก)</strong>, <strong>Approve (อนุมัติ)</strong>
          </p>
        </div>

        <button
          onClick={() => setIsAddRoleOpen(!isAddRoleOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold shadow-md text-xs"
        >
          <Plus size={16} /> + สร้าง Role / บทบาทใหม่
        </button>
      </div>

            {/* CREATE NEW ROLE INLINE FORM */}
      {isAddRoleOpen && (
        <form onSubmit={handleCreateRole} className="bg-indigo-50/60 p-5 rounded-xl border-2 border-indigo-200 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
              <Shield size={16} className="text-indigo-600" /> สร้างบทบาทใหม่ (Create Custom Role)
            </h3>
            <span className="text-xs text-indigo-700 font-medium">*กรุณากำหนดสิทธิ์การเข้าถึงให้เรียบร้อยก่อนบันทึก</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">ชื่อบทบาท (Role Name) <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="เช่น ISO Auditor, Supervisor"
                value={roleForm.name}
                onChange={e => setRoleForm({ ...roleForm, name: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold mt-1 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">รหัส (Role Code) <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="เช่น AUDITOR, SUP"
                value={roleForm.code}
                onChange={e => setRoleForm({ ...roleForm, code: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold uppercase mt-1 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">คำอธิบายขอบเขตการทำงาน (Description)</label>
              <input
                type="text"
                placeholder="รายละเอียดสิทธิ์อย่างย่อ..."
                value={roleForm.description}
                onChange={e => setRoleForm({ ...roleForm, description: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-medium mt-1 text-slate-800"
              />
            </div>
          </div>
          
          {/* PERMISSIONS SELECTOR FOR CREATION */}
          <div className="mt-4 bg-white border border-indigo-200 rounded-xl p-4 max-h-[400px] overflow-y-auto space-y-4 shadow-inner">
            <h4 className="text-sm font-bold text-indigo-900 border-b border-indigo-100 pb-2 mb-2 sticky top-0 bg-white z-10">กำหนดสิทธิ์การใช้งาน (Permissions)</h4>
            {pagePermissionSchema.map(page => {
              return (
                <div key={`create-${page.pageId}`} className="bg-slate-50/60 rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">{page.pageName}</h3>
                      <p className="text-[11px] text-slate-500">{page.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const nextPerms = { ...roleForm.permissions };
                          page.actions.forEach(a => nextPerms[a.key] = true);
                          setRoleForm({ ...roleForm, permissions: nextPerms });
                        }}
                        className="text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded border border-indigo-200 transition-colors"
                      >
                        เลือกทั้งหมด
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const nextPerms = { ...roleForm.permissions };
                          page.actions.forEach(a => nextPerms[a.key] = false);
                          setRoleForm({ ...roleForm, permissions: nextPerms });
                        }}
                        className="text-[10px] font-bold text-slate-500 bg-white hover:bg-slate-100 px-2 py-1 rounded border border-slate-200 transition-colors"
                      >
                        ยกเลิกทั้งหมด
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                    {page.actions.map(action => {
                      const isChecked = roleForm.permissions[action.key] ?? false;
                      const actionBadgeStyle = 
                        action.shortCode === 'create' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                        action.shortCode === 'view' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                        action.shortCode === 'edit' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                        action.shortCode === 'delete' ? 'text-red-700 bg-red-50 border-red-200' :
                        action.shortCode === 'export' ? 'text-purple-700 bg-purple-50 border-purple-200' :
                        'text-indigo-700 bg-indigo-50 border-indigo-200';

                      return (
                        <label
                          key={`create-${action.key}`}
                          className={`p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-white border-indigo-400 shadow-xs ring-1 ring-indigo-200'
                              : 'bg-slate-100/70 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setRoleForm({
                                  ...roleForm,
                                  permissions: { ...roleForm.permissions, [action.key]: !isChecked }
                                });
                              }}
                              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                            />
                            <span className="text-xs font-semibold text-slate-800">{action.label}</span>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${actionBadgeStyle}`}>
                            {action.shortCode.toUpperCase()}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-indigo-200 mt-4">
            <button
              type="button"
              onClick={() => setIsAddRoleOpen(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
            >
              บันทึกสร้าง Role ใหม่
            </button>
          </div>
        </form>
      )}

      {/* MAIN TWO-COLUMN LAYOUT: Left Roles List, Right Detailed Page-by-Page Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ROLES SELECTOR (3.5 COLUMNS) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-1">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Shield size={16} className="text-indigo-600" /> เลือกรบทบาทเพื่อตั้งค่า ({roles.length})
            </h2>
          </div>

          <div className="space-y-2">
            {roles.map(role => {
              const isSelected = role.id === selectedRoleId;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-500 shadow-xs ring-1 ring-indigo-400'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        role.code === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        role.code === 'MANAGER' ? 'bg-emerald-100 text-emerald-800' :
                        role.code === 'CHIEF' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {role.code}
                      </span>
                      <h3 className="text-xs font-bold text-slate-800">{role.name}</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{role.description}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <Users size={11} /> พนักงานที่ถือสิทธิ์นี้: <strong className="text-slate-700">{role.userCount} คน</strong>
                    </div>
                  </div>

                  <ChevronRight size={16} className={isSelected ? 'text-indigo-600' : 'text-slate-300'} />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: GRANULAR PAGE PERMISSION MATRIX (8.5 COLUMNS) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                  {selectedRole.code}
                </span>
                <h2 className="text-base font-bold text-slate-800">
                  กำหนดสิทธิ์แต่ละหน้าแบบละเอียด: {selectedRole.name}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">{selectedRole.description}</p>
            </div>

            <button
              onClick={handleSavePermissions}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-bold text-xs shadow-md transition-colors whitespace-nowrap"
            >
              <Save size={15} /> บันทึกการตั้งค่าสิทธิ์สำหรับ Role นี้
            </button>
          </div>

          {/* ACTION CODES LEGEND */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">สัญลักษณ์ฟังก์ชัน (Action Badges):</span>
            <div className="flex flex-wrap items-center gap-3 font-semibold text-[11px]">
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"><Plus size={12} /> Create (สร้าง)</span>
              <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"><Eye size={12} /> View (เข้าดู)</span>
              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200"><Edit3 size={12} /> Edit (แก้ไข)</span>
              <span className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200"><Trash2 size={12} /> Delete (ลบ)</span>
              <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200"><FileSpreadsheet size={12} /> Export (ส่งออก)</span>
              <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200"><FileCheck size={12} /> Approve / Submit</span>
            </div>
          </div>

          {/* PAGE BY PAGE PERMISSION CHECKLIST CARDS */}
          <div className="space-y-4">
            {pagePermissionSchema.map(page => {
              const allEnabled = page.actions.every(a => selectedRole.permissions[a.key]);
              const noneEnabled = page.actions.every(a => !selectedRole.permissions[a.key]);

              return (
                <div key={page.pageId} className="bg-slate-50/60 rounded-xl border border-slate-200 p-4 space-y-3 hover:border-indigo-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        {page.pageName}
                      </h3>
                      <p className="text-[11px] text-slate-500">{page.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAllForPage(page, true)}
                        className="text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded border border-indigo-200 transition-colors"
                      >
                        เลือกทั้งหมด (Allow All)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleAllForPage(page, false)}
                        className="text-[10px] font-bold text-slate-500 bg-white hover:bg-slate-100 px-2 py-1 rounded border border-slate-200 transition-colors"
                      >
                        ยกเลิกทั้งหมด (Clear All)
                      </button>
                    </div>
                  </div>

                  {/* ACTION CHECKBOXES GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                    {page.actions.map(action => {
                      const isChecked = selectedRole.permissions[action.key] ?? false;

                      const actionBadgeStyle = 
                        action.shortCode === 'create' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                        action.shortCode === 'view' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                        action.shortCode === 'edit' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                        action.shortCode === 'delete' ? 'text-red-700 bg-red-50 border-red-200' :
                        action.shortCode === 'export' ? 'text-purple-700 bg-purple-50 border-purple-200' :
                        'text-indigo-700 bg-indigo-50 border-indigo-200';

                      return (
                        <label
                          key={action.key}
                          className={`p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-white border-indigo-400 shadow-xs ring-1 ring-indigo-200'
                              : 'bg-slate-100/70 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePermission(action.key)}
                              disabled={selectedRole.code === 'ADMIN' && action.key === 'permissions_manage'}
                              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                            />
                            <span className="text-xs font-semibold text-slate-800">{action.label}</span>
                          </div>

                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${actionBadgeStyle}`}>
                            {action.shortCode.toUpperCase()}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-indigo-950">
            <Info size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold">ระบบควบคุมสิทธิ์ระดับฟังก์ชัน (Granular Access Enforcement):</span> เมื่อบันทึก สิทธิ์แต่ละฟังก์ชัน (Create, View, Edit, Delete, Export, Approve) จะถูกบังคับใช้จริงในปุ่มกดและเมนูของทุกหน้าสำหรับพนักงาน {selectedRole.userCount} คนที่สวมบทบาท <strong className="underline">{selectedRole.name}</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
