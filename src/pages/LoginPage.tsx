import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, UserCheck, Users, Briefcase } from 'lucide-react';
import clsx from 'clsx';

export function LoginPage({ onLoginSuccess }: { onLoginSuccess: (role: string) => void }) {
  const [selectedRole, setSelectedRole] = useState('admin');
  
  const roles = [
    { id: 'admin', name: 'System Admin', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'manager', name: 'Department Manager', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'chief', name: 'Section Chief', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'staff', name: 'Staff', icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 print:hidden">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Branding */}
        <div className="w-full md:w-5/12 bg-blue-600 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">Skill Matrix Sys.</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Competency &<br/>Workforce Management</h1>
            <p className="text-blue-100 text-sm leading-relaxed mb-8">
              ระบบจัดการทักษะและความสามารถของพนักงาน เพื่อการวางแผนกำลังคนและการพัฒนาบุคลากรอย่างมีประสิทธิภาพ
            </p>
          </div>
          
          <div className="text-sm text-blue-200">
            &copy; 2026 Skill Matrix System. All rights reserved.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">เข้าสู่ระบบ</h2>
          <p className="text-slate-500 text-sm mb-8">กรุณาเลือกบทบาทผู้ใช้งานเพื่อทดสอบระบบ</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">เลือกบทบาท (Demo Role)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={clsx(
                        "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                        selectedRole === role.id 
                          ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20" 
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center", role.bg, role.color)}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-700 text-sm">{role.name}</div>
                        <div className="text-xs text-slate-500">จำลองสิทธิ์การใช้งาน</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">รหัสพนักงาน / Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="demo_user"
                    defaultValue="demo_user"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">รหัสผ่าน / Password</label>
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">ลืมรหัสผ่าน?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="password" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                    defaultValue="password"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm shadow-blue-200"
            >
              เข้าสู่ระบบ <ArrowRight size={18} />
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
