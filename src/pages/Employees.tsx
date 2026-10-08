import React, { useState } from 'react';
import { UserPlus, Search, Filter, Edit, Trash2, Shield, CheckCircle, XCircle, ChevronDown, Settings, Award, Plus, Layers, Users, GitMerge, UserCheck, Briefcase } from 'lucide-react';
import { MASTER_WIS, SKILL_TYPES as masterSkillTypes, DEPARTMENT_LABELS, MOCK_EMPLOYEES } from '../data/masterData';
import type { Employee } from '../data/masterData';

// Adapt masterWIs to format used by this component's dropdowns
const masterWIs = MASTER_WIS.map(w => ({
  code: w.code,
  name: w.name,
  department: w.department,
  types: w.types.map(t => t.code),
}));


const mockEmployees = [...MOCK_EMPLOYEES];

export function EmployeeManagement({ userRole = 'admin' }: { userRole?: string }) {
  const isAdmin = userRole === 'admin';
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager';
  const CHIEF_DEPT = 'QC Section'; // Chief is locked to this department
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [viewDisplayMode, setViewDisplayMode] = useState<'list' | 'org'>('list');
  
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'skills'>('info');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [supervisorFilter, setSupervisorFilter] = useState('ALL');

  // Form State
  const [form, setForm] = useState({ 
    id: '', 
    name: '', 
    department: 'QC Section' as Employee['department'], 
    position: '', 
    role: 'Staff' as Employee['role'],
    supervisorId: '',
    assignedWIs: [] as string[],
    skills: {} as Record<string, number>
  });

  // Dynamic Add W/I Input inside Tab 2
  const [selectedWiToAdd, setSelectedWiToAdd] = useState(masterWIs[0].code);

  // Available Supervisors (Chiefs & Managers) matching current department in form
  const availableSupervisors = employees.filter(e => 
    e.status === 'Active' && 
    (e.role === 'Chief' || e.role === 'Manager') && 
    (e.department === form.department || form.department === 'IT Section') &&
    e.id !== form.id
  );

  const handleOpenAddForm = () => {
    setSelectedEmp(null);
    setActiveTab('info');

    // Default assigned WIs based on QC Section
    const defaultWIs = masterWIs.filter(w => w.department === 'QC Section').map(w => w.code);
    const defaultSuper = employees.find(e => e.department === 'QC Section' && e.role === 'Chief');

    setForm({
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      name: '',
      department: 'QC Section',
      position: 'Staff Inspector',
      role: 'Staff',
      supervisorId: defaultSuper ? defaultSuper.id : '',
      assignedWIs: defaultWIs,
      skills: {}
    });
    setSelectedWiToAdd(masterWIs[0].code);
    setShowModal(true);
  };

  const handleOpenEditForm = (emp: Employee, defaultTab: 'info' | 'skills' = 'info') => {
    setSelectedEmp(emp);
    setActiveTab(defaultTab);

    const empWIs = emp.assignedWIs.length > 0 
      ? emp.assignedWIs 
      : masterWIs.filter(w => w.department === emp.department).map(w => w.code);

    setForm({
      id: emp.id,
      name: emp.name,
      department: emp.department,
      position: emp.position,
      role: emp.role,
      supervisorId: emp.supervisorId || '',
      assignedWIs: empWIs,
      skills: { ...emp.skills }
    });

    setSelectedWiToAdd(masterWIs[0].code);
    setShowModal(true);
  };

  const handleAddDynamicWI = () => {
    if (!selectedWiToAdd) return;
    if (form.assignedWIs.includes(selectedWiToAdd)) {
      alert(`W/I รหัส ${selectedWiToAdd} ถูกเพิ่มในรายการของพนักงานคนนี้อยู่แล้ว`);
      return;
    }
    setForm(prev => ({
      ...prev,
      assignedWIs: [...prev.assignedWIs, selectedWiToAdd]
    }));
  };

  const handleRemoveDynamicWI = (wiCode: string) => {
    setForm(prev => ({
      ...prev,
      assignedWIs: prev.assignedWIs.filter(code => code !== wiCode)
    }));
  };

  const handleSkillChange = (wiCode: string, typeCode: string, level: number) => {
    setForm(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [`${wiCode}_${typeCode}`]: level
      }
    }));
  };

  const handleSave = () => {
    if (!form.name || !form.id) {
      alert('กรุณากรอกรหัสพนักงานและชื่อ-นามสกุลให้ครบถ้วน');
      return;
    }

    const superObj = employees.find(e => e.id === form.supervisorId);
    const supervisorName = superObj ? `${superObj.name} (${superObj.role})` : '-';
    const hasSetSkills = Object.values(form.skills).some(lvl => lvl > 0);

    if (selectedEmp) {
      setEmployees(prev => prev.map(e => e.id === selectedEmp.id ? { 
        ...e, 
        name: form.name,
        department: form.department,
        position: form.position,
        role: form.role,
        supervisorId: form.supervisorId,
        supervisorName: supervisorName,
        assignedWIs: form.assignedWIs,
        skills: form.skills,
        initialSkillsSet: hasSetSkills || e.initialSkillsSet
      } : e));
    } else {
      setEmployees([
        ...employees, 
        { 
          id: form.id,
          name: form.name,
          department: form.department,
          position: form.position,
          role: form.role,
          status: 'Active', 
          supervisorId: form.supervisorId,
          supervisorName: supervisorName,
          initialSkillsSet: hasSetSkills,
          assignedWIs: form.assignedWIs,
          skills: form.skills
        }
      ]);
    }
    setShowModal(false);
  };

  const handleArchive = (id: string) => {
    if (confirm('ต้องการ Soft-delete พนักงานรหัส ' + id + ' หรือไม่?')) {
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: 'Archived' } : e));
    }
  };

  // Filter calculation
  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || e.department === deptFilter;
    const matchesSuper = supervisorFilter === 'ALL' || e.supervisorId === supervisorFilter;
    return matchesSearch && matchesDept && matchesSuper;
  });

  // Chiefs List for Org View Grouping
  const chiefsList = employees.filter(e => e.role === 'Chief' || e.role === 'Manager');

  return (
    <div className="space-y-6">
      {/* Page Title & Main Action Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-[#0a2540]" /> จัดการพนักงาน & สายการดูแล (Employee & Team Management)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            กำหนดข้อมูลพนักงาน หัวหน้างานสายตรง (Supervisor) และตั้งค่าระดับความสามารถเริ่มต้น (Initial Skill Phase 0)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Display Mode Toggle */}
          <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewDisplayMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewDisplayMode === 'list' 
                  ? 'bg-white text-[#0a2540] shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={14} /> ตารางทั้งหมด
            </button>
            <button
              onClick={() => setViewDisplayMode('org')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewDisplayMode === 'org' 
                  ? 'bg-white text-[#0a2540] shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitMerge size={14} /> ผังสายการดูแล (Org Team View)
            </button>
          </div>

          <button
            onClick={handleOpenAddForm}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            <UserPlus size={18} /> เพิ่มพนักงานใหม่
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
         <div className="text-blue-500 mt-0.5 flex-shrink-0">ℹ️</div>
         <div className="text-sm text-blue-700 space-y-0.5">
           <div className="font-semibold">โครงสร้างสายงานและการประเมิน (Hierarchy & Evaluation)</div>
           <div className="text-blue-600">
             พนักงานแต่ละคนมี **หัวหน้างานสายตรง (Chief / Evaluator)** ทำหน้าที่ดูแล รับผิดชอบการอบรม OJT และกำหนด Initial Skill (Phase 0) โดยผู้จัดการแผนก (Manager) จะทำหน้าที่ตรวจสอบอนุมัติในภาพรวม
           </div>
         </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ค้นหารหัส หรือ ชื่อพนักงาน..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        
        <div className="flex gap-2">
          {/* Department Filter */}
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-3 text-slate-400" />
            <select 
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">ทุกแผนก</option>
              {DEPARTMENT_LABELS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Supervisor Filter */}
          <div className="relative">
            <UserCheck size={16} className="absolute left-3 top-3 text-slate-400" />
            <select 
              value={supervisorFilter}
              onChange={e => setSupervisorFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">ทุกหัวหน้างาน</option>
              {chiefsList.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* MODE 1: Table List View */}
      {viewDisplayMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                  <th className="px-5 py-3.5">รหัสพนักงาน</th>
                  <th className="px-5 py-3.5">ชื่อ - นามสกุล</th>
                  <th className="px-5 py-3.5">แผนก & ตำแหน่ง</th>
                  <th className="px-5 py-3.5">หัวหน้างานสายตรง (Supervisor)</th>
                  <th className="text-center px-4 py-3.5">Role</th>
                  <th className="text-center px-4 py-3.5">สถานะ</th>
                  <th className="text-center px-4 py-3.5">INITIAL SKILL</th>
                  <th className="text-center px-4 py-3.5">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className={`hover:bg-slate-50 transition-colors ${emp.status === 'Archived' ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-4 font-mono text-xs font-bold text-slate-600">{emp.id}</td>
                    <td className="px-5 py-4 font-bold text-slate-800">{emp.name}</td>
                    <td className="px-5 py-4">
                      <div className="text-slate-700 font-semibold">{emp.department}</div>
                      <div className="text-xs text-slate-400">{emp.position}</div>
                    </td>
                    
                    {/* Supervisor Column */}
                    <td className="px-5 py-4">
                      {emp.supervisorName && emp.supervisorName !== '-' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                            <UserCheck size={12} />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{emp.supervisorName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium italic">- ไม่มีหัวหน้าสายตรง -</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        emp.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                        emp.role === 'Manager' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                        emp.role === 'Chief' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {emp.role === 'Admin' && <Shield size={10} />} {emp.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {emp.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                          <XCircle size={12} /> Archived
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {emp.initialSkillsSet ? (
                        <button 
                          onClick={() => handleOpenEditForm(emp, 'skills')} 
                          className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full font-semibold transition-colors"
                          title="คลิกเพื่อกำหนด W/I และแก้ไขสกิลพนักงาน"
                        >
                          <CheckCircle size={13} /> ตั้งค่าแล้ว ({emp.assignedWIs.length} W/I) <Edit size={12} className="ml-1 opacity-70" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleOpenEditForm(emp, 'skills')} 
                          className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 px-3 py-1 rounded-full font-semibold transition-colors"
                        >
                          <Settings size={13} /> ตั้งค่า Skill เริ่มต้น
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center items-center gap-1.5">

                        <button 
                          onClick={() => handleOpenEditForm(emp, 'info')} 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200"
                          title="แก้ไขข้อมูลพนักงาน"
                        >
                          <Edit size={16} />
                        </button>
                        {emp.status === 'Active' && (
                          <button 
                            onClick={() => handleArchive(emp.id)} 
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200"
                            title="Soft delete"
                          >
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
        </div>
      )}

      {/* MODE 2: Org Team View (ผังสายการดูแลแยกตามทีม) */}
      {viewDisplayMode === 'org' && (
        <div className="space-y-6">
          {chiefsList.map(chief => {
            const teamMembers = employees.filter(e => e.supervisorId === chief.id);

            return (
              <div key={chief.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Team Card Header */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-xs">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-base">{chief.name}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                          chief.role === 'Manager' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-blue-100 text-blue-800 border-blue-200'
                        }`}>
                          {chief.role}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">({chief.id})</span>
                      </div>
                      <div className="text-xs text-slate-500">{chief.department} · {chief.position}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Users size={14} className="text-blue-600" />
                      ลูกทีมในดูแล: <span className="font-bold text-blue-700">{teamMembers.length} คน</span>
                    </div>
                  </div>
                </div>

                {/* Team Subordinates Grid */}
                <div className="p-4 bg-slate-50/30">
                  {teamMembers.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 italic">
                      ยังไม่มีพนักงานในสังกัดของหัวหน้างานท่านนี้
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {teamMembers.map(sub => (
                        <div key={sub.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <span className="font-bold text-slate-800 text-sm">{sub.name}</span>
                                <div className="text-xs text-slate-400 font-mono">{sub.id} · {sub.position}</div>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {sub.role}
                              </span>
                            </div>

                            {/* W/I Assigned count */}
                            <div className="text-xs text-slate-600 mt-2 flex items-center justify-between">
                              <span className="text-slate-400">W/I ที่มอบหมาย:</span>
                              <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-mono text-[11px]">
                                {sub.assignedWIs.length} รายการ
                              </span>
                            </div>
                          </div>

                          {/* Action Button inside Subordinate Card */}
                          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                            {sub.initialSkillsSet ? (
                              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle size={12} /> ตั้งค่า Initial Skill แล้ว
                              </span>
                            ) : (
                              <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
                                <Settings size={12} /> รอตั้งค่า Skill เริ่มต้น
                              </span>
                            )}


                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header & Tabs */}
            <div className="p-6 pb-0 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800 mb-1">
                {selectedEmp ? `แก้ไขข้อมูลพนักงาน: ${selectedEmp.name}` : 'เพิ่มพนักงานใหม่'}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                กำหนดข้อมูลทั่วไป หัวหน้างานสายตรง และตั้งค่าระดับความสามารถ (Initial Skill Level) ประจำตัวพนักงาน
              </p>

              {/* Navigation Tabs */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('info')}
                  className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
                    activeTab === 'info'
                      ? 'bg-white text-blue-600 border-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 border-transparent'
                  }`}
                >
                  <UserPlus size={15} /> 1. ข้อมูลทั่วไป & หัวหน้างาน
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('skills')}
                  className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
                    activeTab === 'skills'
                      ? 'bg-white text-blue-600 border-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 border-transparent'
                  }`}
                >
                  <Award size={15} /> 2. ตั้งค่า Skill เริ่มต้น (Initial Skills Phase 0)
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* TAB 1: General Info & Supervisor Selection */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">รหัสพนักงาน <span className="text-red-500">*</span></label>
                      <input 
                        value={form.id} 
                        onChange={e => setForm({...form, id: e.target.value})} 
                        disabled={!!selectedEmp} 
                        placeholder="เช่น EMP006"
                        className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">ชื่อ - นามสกุล <span className="text-red-500">*</span></label>
                      <input 
                        value={form.name} 
                        onChange={e => setForm({...form, name: e.target.value})} 
                        placeholder="เช่น นายกฤษณะ แสงทอง"
                        className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">แผนก (Department)</label>
                      <select 
                        value={form.department} 
                        onChange={e => setForm({...form, department: e.target.value as Employee['department']})} 
                        className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {DEPARTMENT_LABELS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">ตำแหน่ง (Position)</label>
                      <input 
                        value={form.position} 
                        onChange={e => setForm({...form, position: e.target.value})} 
                        placeholder="เช่น Senior Quality Inspector"
                        className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">สิทธิ์การใช้งาน (Role)</label>
                      <select 
                        value={form.role} 
                        onChange={e => setForm({...form, role: e.target.value as Employee['role']})} 
                        className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Staff">Staff (พนักงานทั่วไป)</option>
                        <option value="Chief">Chief (หัวหน้างาน / ผู้ประเมิน OJT)</option>
                        <option value="Manager">Manager (ผู้จัดการฝ่าย / ผู้อนุมัติ)</option>
                        <option value="Admin">Admin (ผู้ดูแลระบบ)</option>
                      </select>
                    </div>

                    {/* Direct Supervisor Selection */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">หัวหน้างานสายตรง (Supervisor)</label>
                      <select 
                        value={form.supervisorId} 
                        onChange={e => setForm({...form, supervisorId: e.target.value})} 
                        className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm bg-blue-50/50 font-semibold text-blue-900 border-blue-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">-- ไม่ระบุ (Top Manager) --</option>
                        {availableSupervisors.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.role} - {s.department})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Initial Skills with Dynamic Add W/I */}
              {activeTab === 'skills' && (
                <div className="space-y-5">
                  
                  {/* Dynamic Add W/I Section */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Plus className="text-blue-600" size={16} /> 
                        เพิ่ม W/I Code ที่พนักงานรับผิดชอบ
                      </label>
                      <span className="text-[11px] text-slate-500">เลือกแล้ว {form.assignedWIs.length} รายการ</span>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <select 
                          value={selectedWiToAdd}
                          onChange={e => setSelectedWiToAdd(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg py-2 px-3 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-slate-800"
                        >
                          {masterWIs.map(w => (
                            <option key={w.code} value={w.code}>
                              {w.code} - {w.name} ({w.department})
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddDynamicWI}
                        className="py-2 px-4 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                      >
                        <Plus size={14} /> เพิ่ม W/I นี้
                      </button>
                    </div>
                  </div>

                  {/* List of Assigned W/Is for this Employee */}
                  {form.assignedWIs.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 bg-slate-50/50 space-y-2">
                      <Layers size={32} className="mx-auto text-slate-300" />
                      <div className="text-sm font-semibold text-slate-600">ยังไม่ได้เพิ่ม W/I ให้พนักงานคนนี้</div>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        โปรดเลือก W/I Code จากเมนูด้านบน แล้วกดปุ่ม <strong>"+ เพิ่ม W/I นี้"</strong> เพื่อตั้งค่าทักษะเบื้องต้น
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                      {form.assignedWIs.map(code => {
                        const wiObj = masterWIs.find(w => w.code === code) || { code, name: 'Work Instruction', department: form.department, types: ['A', 'B', 'C', 'D'] };

                        return (
                          <div key={code} className="p-4 bg-white hover:bg-slate-50/50 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="bg-blue-100 text-blue-800 font-mono font-bold text-xs px-2.5 py-1 rounded-md border border-blue-200">
                                  {wiObj.code}
                                </span>
                                <span className="font-bold text-xs text-slate-800">{wiObj.name}</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveDynamicWI(code)}
                                className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                title="ถอน W/I ออกจากพนักงานคนนี้"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            {/* Skill Types grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                              {wiObj.types.map(tCode => {
                                const key = `${wiObj.code}_${tCode}`;
                                const currentLvl = form.skills[key] || 0;
                                const typeLabel = masterSkillTypes[tCode] || tCode;

                                return (
                                  <div key={key} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 flex items-center justify-between gap-2">
                                    <div className="text-xs font-semibold text-slate-700 truncate" title={typeLabel}>
                                      {typeLabel}
                                    </div>
                                    <select 
                                      value={currentLvl}
                                      onChange={e => handleSkillChange(wiObj.code, tCode, parseInt(e.target.value))}
                                      className={`text-xs font-bold border rounded-md py-1 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                        currentLvl === 3 ? 'bg-purple-50 text-purple-700 border-purple-300' :
                                        currentLvl === 2 ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                                        currentLvl === 1 ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                        'bg-white text-slate-500 border-slate-300'
                                      }`}
                                    >
                                      <option value={0}>0 - Cannot</option>
                                      <option value={1}>1 - Under Supervision</option>
                                      <option value={2}>2 - Independent</option>
                                      <option value={3}>3 - Trainer</option>
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              {activeTab === 'info' ? (
                <button 
                  type="button" 
                  onClick={() => setActiveTab('skills')}
                  className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  ถัดไป: เพิ่ม W/I & กำหนด Initial Skill &rarr;
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setActiveTab('info')}
                  className="text-xs text-slate-500 font-bold hover:underline flex items-center gap-1"
                >
                  &larr; ย้อนกลับไปข้อมูลทั่วไป
                </button>
              )}

              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="button" 
                  onClick={handleSave} 
                  className="px-5 py-2 bg-[#0a2540] hover:bg-[#0d3060] text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
                >
                  บันทึกข้อมูลทั้งหมด
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
