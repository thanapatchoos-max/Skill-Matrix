import io
import re

with io.open("src/pages/MasterData.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# I will just write a full replacement for MasterData.tsx to support Tabs cleanly.
# Since it's large, I'll generate a new one.

new_master_data = """import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings, FileText, LayoutList, Building2, AlertTriangle, Search, Save, X } from 'lucide-react';
import { DEPARTMENTS, SKILL_TYPES, MASTER_WIS } from '../data/masterData';

export function MasterData() {
  const [activeTab, setActiveTab] = useState<'wi' | 'skills' | 'departments' | 'nc'>('wi');

  return (
    <div className="p-6 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="text-slate-500" /> จัดการข้อมูลพื้นฐาน (Master Data)
        </h1>
        <p className="text-slate-500 text-sm mt-1">บริหารจัดการโครงสร้างข้อมูลหลักของระบบที่สามารถปรับเปลี่ยนได้ (Dynamic Data)</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-6">
        <button onClick={() => setActiveTab('wi')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'wi' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}>
          <FileText size={18} /> 1. มาตรฐาน W/I
        </button>
        <button onClick={() => setActiveTab('skills')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'skills' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}>
          <LayoutList size={18} /> 2. ประเภททักษะ (Skill Types)
        </button>
        <button onClick={() => setActiveTab('departments')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'departments' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}>
          <Building2 size={18} /> 3. แผนก (Departments)
        </button>
        <button onClick={() => setActiveTab('nc')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'nc' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}>
          <AlertTriangle size={18} /> 4. รหัสของเสีย (NC Codes)
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {activeTab === 'wi' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">จัดการมาตรฐานคู่มือปฏิบัติงาน (Work Instructions)</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0a2540] text-white rounded-lg font-semibold text-sm hover:bg-[#0d3060]"><Plus size={16}/> เพิ่ม W/I ใหม่</button>
            </div>
            <p className="text-sm text-slate-500 mb-4">ข้อมูลเหล่านี้ถูกดึงมาจากไฟล์ `+ "`" + `masterData.ts` + "`" + ` ส่วนนี้จำลองการแก้ไขข้อมูล</p>
            <table className="w-full text-sm text-left border">
              <thead className="bg-slate-50 border-b">
                <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">ชื่อ W/I</th><th className="px-4 py-3">แผนก</th><th className="px-4 py-3 text-center">จัดการ</th></tr>
              </thead>
              <tbody>
                {MASTER_WIS.slice(0, 5).map(wi => (
                  <tr key={wi.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-blue-700">{wi.code}</td>
                    <td className="px-4 py-3">{wi.name}</td>
                    <td className="px-4 py-3">{wi.department}</td>
                    <td className="px-4 py-3 text-center"><button className="text-slate-400 hover:text-blue-600"><Edit size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">จัดการประเภททักษะ (Skill Types)</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700"><Plus size={16}/> เพิ่ม Skill Type</button>
            </div>
            <table className="w-full text-sm text-left border">
              <thead className="bg-slate-50 border-b">
                <tr><th className="px-4 py-3">ประเภท</th><th className="px-4 py-3">คำอธิบาย</th><th className="px-4 py-3 text-center">จัดการ</th></tr>
              </thead>
              <tbody>
                {SKILL_TYPES.map(st => (
                  <tr key={st.code} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-800">{st.code} - {st.name}</td>
                    <td className="px-4 py-3 text-slate-500">{st.description}</td>
                    <td className="px-4 py-3 text-center"><button className="text-slate-400 hover:text-blue-600"><Edit size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'departments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">จัดการแผนกและหน่วยงาน (Departments)</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700"><Plus size={16}/> เพิ่มแผนกใหม่</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEPARTMENTS.map(dept => (
                <div key={dept} className="p-4 border rounded-xl flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="font-bold text-slate-700">{dept}</span>
                  <button className="text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'nc' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">จัดการรหัสของเสียและงานแก้ (NC Codes & Job Types)</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold text-sm hover:bg-rose-700"><Plus size={16}/> เพิ่มรหัส NC</button>
            </div>
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-sm mb-6">
              รหัสของเสียเหล่านี้จะถูกนำไปใช้เป็นตัวเลือกในหน้า <b>"บันทึกการทำงานรายวัน (Working Record)"</b> เมื่อพนักงานรายงานงานแก้ (Rework)
            </div>
            <table className="w-full text-sm text-left border">
              <thead className="bg-slate-50 border-b">
                <tr><th className="px-4 py-3">รหัส NC Code</th><th className="px-4 py-3">หมวดหมู่</th><th className="px-4 py-3">คำอธิบายข้อบกพร่อง</th><th className="px-4 py-3 text-center">สถานะ</th></tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-rose-600">NC-001</td><td className="px-4 py-3">QC Reject</td><td className="px-4 py-3">รอยขีดข่วนบนตัวถัง (Scratch on tank)</td><td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">Active</span></td>
                </tr>
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-rose-600">NC-002</td><td className="px-4 py-3">Design Error</td><td className="px-4 py-3">ขนาดคอยล์ไม่ได้ตามสเปก (Coil dimension mismatch)</td><td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">Active</span></td>
                </tr>
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-rose-600">NC-003</td><td className="px-4 py-3">Mfg Defect</td><td className="px-4 py-3">เชื่อมจุดซีลรั่ว (Seal welding leak)</td><td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
"""

with io.open("src/pages/MasterData.tsx", "w", encoding="utf-8") as f:
    f.write(new_master_data)

