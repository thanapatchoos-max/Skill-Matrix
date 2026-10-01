import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Shield, UserPlus, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  role: 'Staff' | 'Chief' | 'Manager' | 'Admin';
  status: 'Active' | 'Archived';
  initialSkillsSet: boolean;
}

const mockEmployees: Employee[] = [
  { id: 'EMP001', name: 'นายสมชาย ใจดี', department: 'QC Section', position: 'Quality Inspector', role: 'Staff', status: 'Active', initialSkillsSet: true },
  { id: 'EMP002', name: 'นางสาวอรุณี รักดี', department: 'QC Section', position: 'QC Supervisor', role: 'Chief', status: 'Active', initialSkillsSet: true },
  { id: 'EMP003', name: 'นายกฤต พร้อมใจ', department: 'QC Section', position: 'QC Manager', role: 'Manager', status: 'Active', initialSkillsSet: true },
  { id: 'EMP004', name: 'นายวิชัย เก่งดี', department: 'Engineering', position: 'Maintenance Engineer', role: 'Chief', status: 'Active', initialSkillsSet: false },
  { id: 'EMP005', name: 'นางสาวแนน สุขใจ', department: 'Engineering', position: 'Engineer', role: 'Staff', status: 'Active', initialSkillsSet: true },
  { id: 'EMP999', name: 'แอดมิน ระบบ', department: 'IT', position: 'System Administrator', role: 'Admin', status: 'Active', initialSkillsSet: false },
];

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [showModal, setShowModal] = useState(false);
  const [showInitialSkillModal, setShowInitialSkillModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  const [form, setForm] = useState({ id: '', name: '', department: 'QC Section', position: '', role: 'Staff' as Employee['role'] });

  const handleSave = () => {
    if (selectedEmp) {
      setEmployees(prev => prev.map(e => e.id === selectedEmp.id ? { ...e, ...form } : e));
    } else {
      setEmployees([...employees, { ...form, status: 'Active', initialSkillsSet: false }]);
    }
    setShowModal(false);
  };

  const handleArchive = (id: string) => {
    if(confirm('ต้องการ Soft-delete พนักงานรหัส ' + id + ' หรือไม่?')) {
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: 'Archived' } : e));
    }
  };

  const openInitialSkill = (emp: Employee) => {
    setSelectedEmp(emp);
    setShowInitialSkillModal(true);
  };

  const saveInitialSkill = () => {
    if(selectedEmp) {
      setEmployees(prev => prev.map(e => e.id === selectedEmp.id ? { ...e, initialSkillsSet: true } : e));
    }
    setShowInitialSkillModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">จัดการพนักงาน (Employee Management)</h1>
          <p className="text-slate-500 text-sm mt-1">เพิ่มข้อมูลผู้ใช้ และกำหนด Initial Skill (Phase 0)</p>
        </div>
        <button
          onClick={() => { setSelectedEmp(null); setForm({ id: '', name: '', department: 'QC Section', position: '', role: 'Staff' }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg transition-colors font-medium shadow-sm"
        >
          <UserPlus size={18} /> เพิ่มพนักงาน
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
         <div className="text-blue-500 mt-0.5 flex-shrink-0">ℹ️</div>
         <div className="text-sm text-blue-700 space-y-0.5">
           <div className="font-semibold">ขั้นตอน Phase 0: การนำข้อมูลเข้าระบบ (Feed Data)</div>
           <div className="text-blue-600">
             Admin/HR เป็นผู้เพิ่มรายชื่อพนักงาน และกำหนด "ค่า Skill เริ่มต้น" (Initial Stage) ได้โดยตรง เพื่อให้พนักงานเดิมมีระดับ Skill ในระบบโดยไม่ต้องเริ่มอบรม OJT ใหม่
           </div>
         </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input placeholder="ค้นหารหัส หรือ ชื่อพนักงาน..." className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-3 text-slate-400" />
          <select className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>ทุกแผนก</option>
            <option>QC Section</option>
            <option>Engineering</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wide">
              <th className="text-left px-5 py-3">รหัสพนักงาน</th>
              <th className="text-left px-5 py-3">ชื่อ - นามสกุล</th>
              <th className="text-left px-5 py-3">แผนก & ตำแหน่ง</th>
              <th className="text-center px-4 py-3">Role</th>
              <th className="text-center px-4 py-3">สถานะ</th>
              <th className="text-center px-4 py-3">Initial Skill</th>
              <th className="text-center px-4 py-3">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map(emp => (
              <tr key={emp.id} className={`hover:bg-slate-50 transition-colors ${emp.status === 'Archived' ? 'opacity-60' : ''}`}>
                <td className="px-5 py-4 font-mono text-xs text-slate-500">{emp.id}</td>
                <td className="px-5 py-4 font-medium text-slate-800">{emp.name}</td>
                <td className="px-5 py-4">
                  <div className="text-slate-700 font-medium">{emp.department}</div>
                  <div className="text-xs text-slate-400">{emp.position}</div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${emp.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : emp.role === 'Manager' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : emp.role === 'Chief' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {emp.role === 'Admin' && <Shield size={10} />} {emp.role}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  {emp.status === 'Active' ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><CheckCircle size={10} /> Active</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full"><XCircle size={10} /> Archived</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  {emp.initialSkillsSet ? (
                    <span className="text-emerald-500 text-xs font-medium"><CheckCircle size={14} className="inline mr-1" />ตั้งค่าแล้ว</span>
                  ) : (
                    <button onClick={() => openInitialSkill(emp)} className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold hover:bg-amber-200">
                      ตั้งค่า Skill เริ่มต้น
                    </button>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => { setSelectedEmp(emp); setForm({ id: emp.id, name: emp.name, department: emp.department, position: emp.position, role: emp.role }); setShowModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit size={16} />
                    </button>
                    {emp.status === 'Active' && (
                      <button onClick={() => handleArchive(emp.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-bold text-slate-800">{selectedEmp ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">รหัสพนักงาน</label>
                <input value={form.id} onChange={e => setForm({...form, id: e.target.value})} disabled={!!selectedEmp} className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm bg-slate-50 mt-1 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">ชื่อ - นามสกุล</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm bg-slate-50 mt-1 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">แผนก</label>
                <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm bg-slate-50 mt-1 focus:ring-2 focus:ring-blue-500">
                  <option>QC Section</option>
                  <option>Engineering</option>
                  <option>IT</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">ตำแหน่ง</label>
                <input value={form.position} onChange={e => setForm({...form, position: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm bg-slate-50 mt-1 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">สิทธิ์การใช้งาน (Role)</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value as Employee['role']})} className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm bg-slate-50 mt-1 focus:ring-2 focus:ring-blue-500">
                  <option value="Staff">Staff</option>
                  <option value="Chief">Chief</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50">ยกเลิก</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-[#0a2540] text-white rounded-lg font-medium hover:bg-[#0d3060]">บันทึก</button>
            </div>
          </div>
        </div>
      )}

      {showInitialSkillModal && selectedEmp && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
           <div>
             <h3 className="text-xl font-bold text-slate-800">ตั้งค่า Initial Skill (นำข้อมูลเข้าระบบ)</h3>
             <p className="text-sm text-slate-500 mt-1">พนักงาน: {selectedEmp.name} ({selectedEmp.id})</p>
           </div>
           
           <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-4 gap-4 items-center pb-2 border-b border-slate-200 font-semibold text-sm text-slate-600">
                <div className="col-span-2">Work Instruction / Skill Type</div>
                <div className="col-span-2 text-center">ระดับปัจจุบัน (Initial Level)</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="col-span-2 text-sm font-medium">QCW001-001 <br/><span className="text-xs text-slate-500">A - Circuit Connecting</span></div>
                <div className="col-span-2">
                  <select className="w-full border border-slate-300 rounded-lg py-1.5 px-3 text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="0">0 - Cannot</option>
                    <option value="1">1 - Under Supervision</option>
                    <option value="2">2 - Independent</option>
                    <option value="3">3 - Trainer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="col-span-2 text-sm font-medium">QCW001-001 <br/><span className="text-xs text-slate-500">B - Operator</span></div>
                <div className="col-span-2">
                  <select className="w-full border border-slate-300 rounded-lg py-1.5 px-3 text-sm focus:ring-2 focus:ring-blue-500" defaultValue="2">
                    <option value="0">0 - Cannot</option>
                    <option value="1">1 - Under Supervision</option>
                    <option value="2">2 - Independent</option>
                    <option value="3">3 - Trainer</option>
                  </select>
                </div>
              </div>

           </div>
           
           <div className="flex gap-3 pt-2">
             <button onClick={() => setShowInitialSkillModal(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50">ยกเลิก</button>
             <button onClick={saveInitialSkill} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">ยืนยันการตั้งค่า</button>
           </div>
         </div>
       </div>
      )}
    </div>
  );
}
