import React, { useState } from 'react';
import { Settings as SettingsIcon, Building, Bell, Shield, Plus, Save, Check, RefreshCw, Edit2, ShieldCheck } from 'lucide-react';

interface DepartmentSetting {
  id: string;
  code: string;
  nameTh: string;
  nameEn: string;
  manager: string;
  employeeCount: number;
}

const initialDepartments: DepartmentSetting[] = [
  { id: 'dept-1', code: 'QC', nameTh: 'ฝ่ายตรวจสอบคุณภาพ', nameEn: 'QC Section', manager: 'นายกฤต พร้อมใจ (QC Manager)', employeeCount: 18 },
  { id: 'dept-2', code: 'PROD', nameTh: 'ฝ่ายการผลิตหม้อแปลง', nameEn: 'Production Section', manager: 'นายอนันต์ ศรีสุข (Production Manager)', employeeCount: 45 },
  { id: 'dept-3', code: 'ENG', nameTh: 'ฝ่ายวิศวกรรมและสอบเทียบ', nameEn: 'Engineering Section', manager: 'นายวิชัย เก่งดี (Engineering Manager)', employeeCount: 12 },
  { id: 'dept-4', code: 'HR', nameTh: 'ฝ่ายทรัพยากรบุคคลและฝึกอบรม', nameEn: 'HR & Training Section', manager: 'นายสมชาย วงศ์ไทย (HR Manager)', employeeCount: 6 },
];

export function SettingsPage({ onNavigateToPermissions }: { onNavigateToPermissions?: () => void }) {
  const [activeTab, setActiveTab] = useState<'general' | 'departments' | 'notifications'>('general');
  const [departments, setDepartments] = useState<DepartmentSetting[]>(initialDepartments);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [generalConfig, setGeneralConfig] = useState({
    companyNameTh: 'บริษัท ไดเฮ็น อิเล็คทริค จำกัด',
    companyNameEn: 'Thai Daihen Electric Co., Ltd.',
    isoDocPrefix: 'TDE-SKM',
    passScorePercentage: 80,
    annualReviewMonth: 'October',
    autoUpgradeLevel1: true,
    requireManagerApproval: true,
  });

  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [deptForm, setDeptForm] = useState({ code: '', nameTh: '', nameEn: '', manager: '' });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('บันทึกการตั้งค่าระบบทั่วไปสำเร็จ!');
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.code || !deptForm.nameTh) return;

    const newDept: DepartmentSetting = {
      id: `dept-${Date.now()}`,
      code: deptForm.code.toUpperCase(),
      nameTh: deptForm.nameTh,
      nameEn: deptForm.nameEn || deptForm.nameTh,
      manager: deptForm.manager || 'ยังไม่ระบุ',
      employeeCount: 0,
    };

    setDepartments([...departments, newDept]);
    setIsAddDeptOpen(false);
    setDeptForm({ code: '', nameTh: '', nameEn: '', manager: '' });
    showToast(`เพิ่มโครงสร้างแผนก (${newDept.nameEn}) สำเร็จ!`);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <Check size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <SettingsIcon className="text-[#0a2540]" /> ตั้งค่าระบบ (System Settings)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            ศูนย์กลางกำหนดค่าพารามิเตอร์ระบบ Skill Matrix, โครงสร้างแผนก, ระบบแจ้งเตือน และสิทธิ์การใช้งาน (Admin Only)
          </p>
        </div>

        {onNavigateToPermissions && (
          <button
            onClick={onNavigateToPermissions}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg transition-colors font-semibold shadow-md text-xs"
          >
            <ShieldCheck size={16} /> จัดการสิทธิ์ & บทบาทผู้ใช้ (Role & Permissions) &rarr;
          </button>
        )}
      </div>

      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto bg-white p-2 rounded-xl border shadow-xs">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'general' ? 'bg-[#0a2540] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <SettingsIcon size={16} /> การตั้งค่าทั่วไป (General)
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'departments' ? 'bg-[#0a2540] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building size={16} /> จัดการโครงสร้างแผนก ({departments.length})
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'notifications' ? 'bg-[#0a2540] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell size={16} /> การแจ้งเตือน (Notifications)
        </button>

        {onNavigateToPermissions && (
          <button
            onClick={onNavigateToPermissions}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 ml-auto"
          >
            <Shield size={16} /> กำหนด Role & Permissions &rarr;
          </button>
        )}
      </div>

      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-800">ตั้งค่าพารามิเตอร์ทั่วไป (General System Configuration)</h2>
            <p className="text-xs text-slate-500">กำหนดเกณฑ์การประเมิน OJT, ชื่อองค์กรสำหรับ ISO Audit และเงื่อนไขการปรับ Level</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">ชื่อองค์กร (ภาษาไทย)</label>
              <input
                type="text"
                value={generalConfig.companyNameTh}
                onChange={e => setGeneralConfig({ ...generalConfig, companyNameTh: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">ชื่อองค์กร (English - ISO Standard)</label>
              <input
                type="text"
                value={generalConfig.companyNameEn}
                onChange={e => setGeneralConfig({ ...generalConfig, companyNameEn: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">เกณฑ์คะแนนสอบผ่าน OJT (Pass Score %)</label>
              <div className="relative">
                <input
                  type="number"
                  value={generalConfig.passScorePercentage}
                  onChange={e => setGeneralConfig({ ...generalConfig, passScorePercentage: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-800 pr-10"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">รหัสขึ้นต้นเอกสารรายงาน ISO (Doc Prefix)</label>
              <input
                type="text"
                value={generalConfig.isoDocPrefix}
                onChange={e => setGeneralConfig({ ...generalConfig, isoDocPrefix: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg font-bold text-xs shadow-md transition-colors"
            >
              <Save size={16} /> บันทึกการตั้งค่าระบบ
            </button>
          </div>
        </form>
      )}

      {activeTab === 'departments' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">จัดการโครงสร้างแผนก (Department Structure)</h2>
              <p className="text-xs text-slate-500">กำหนดแผนกในสังกัดโรงงาน เพื่อใช้จัดกลุ่ม Skill Matrix</p>
            </div>
            <button
              onClick={() => setIsAddDeptOpen(!isAddDeptOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              <Plus size={16} /> เพิ่มแผนกใหม่
            </button>
          </div>

          {isAddDeptOpen && (
            <form onSubmit={handleAddDepartment} className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-4">
              <h3 className="text-xs font-bold text-blue-900 uppercase">เพิ่มแผนกใหม่ในระบบ</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700">รหัสแผนก</label>
                  <input
                    type="text"
                    placeholder="เช่น QC"
                    value={deptForm.code}
                    onChange={e => setDeptForm({ ...deptForm, code: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-bold uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700">ชื่อแผนก (ภาษาไทย)</label>
                  <input
                    type="text"
                    placeholder="ฝ่ายตรวจสอบคุณภาพ"
                    value={deptForm.nameTh}
                    onChange={e => setDeptForm({ ...deptForm, nameTh: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700">ชื่อแผนก (English)</label>
                  <input
                    type="text"
                    placeholder="QC Section"
                    value={deptForm.nameEn}
                    onChange={e => setDeptForm({ ...deptForm, nameEn: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700">ผู้จัดการแผนก (Manager)</label>
                  <select
                    value={deptForm.manager}
                    onChange={e => setDeptForm({ ...deptForm, manager: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- เลือกผู้จัดการแผนกในระบบ --</option>
                    <option value="นายกฤต พร้อมใจ (QC Manager)">นายกฤต พร้อมใจ (EMP003 - QC Manager)</option>
                    <option value="นางสาวอรุณี รักดี (QC Supervisor)">นางสาวอรุณี รักดี (EMP002 - QC Supervisor)</option>
                    <option value="นายอนันต์ ศรีสุข (Production Manager)">นายอนันต์ ศรีสุข (EMP007 - Production Manager)</option>
                    <option value="นายวิชัย เก่งดี (Engineering Manager)">นายวิชัย เก่งดี (EMP004 - Engineering Manager)</option>
                    <option value="นายสมชาย วงศ์ไทย (HR Manager)">นายสมชาย วงศ์ไทย (EMP000 - HR Manager)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDeptOpen(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded text-xs font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 text-white rounded text-xs font-bold"
                >
                  บันทึกแผนก
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold text-slate-700 uppercase">
                <tr>
                  <th className="p-3">รหัส</th>
                  <th className="p-3">ชื่อแผนก (ภาษาไทย)</th>
                  <th className="p-3">ชื่อแผนก (English)</th>
                  <th className="p-3">ผู้จัดการแผนก (Manager)</th>
                  <th className="p-3 text-center">จำนวนบุคลากร</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {departments.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-blue-900">{d.code}</td>
                    <td className="p-3 font-bold text-slate-800">{d.nameTh}</td>
                    <td className="p-3 text-slate-600 font-medium">{d.nameEn}</td>
                    <td className="p-3 text-slate-700">{d.manager}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{d.employeeCount} คน</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-800">ตั้งค่าการแจ้งเตือน (System Notification Rules)</h2>
            <p className="text-xs text-slate-500">กำหนดช่องทางและเงื่อนไขการส่งการแจ้งเตือนเกี่ยวกับ Approval</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
                <Bell size={16} className="text-amber-500" /> แจ้งเตือนคำขออนุมัติใหม่ (Pending Approvals Notification)
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                  <span>ส่งการแจ้งเตือนในระบบทันทีเมื่อ Chief ยื่นคำขอปรับเกรด Skill</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
