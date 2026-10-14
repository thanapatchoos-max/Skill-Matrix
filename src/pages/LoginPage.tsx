import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, BarChart3, Check, ClipboardCheck, GraduationCap, ShieldCheck, UserCheck, Users, Briefcase, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { ACTORS } from '../data/phase1Core';
import type { Role } from '../data/phase1Core';

const roles = [
  { id: 'staff', name: 'Staff', title: 'พนักงาน', description: 'ดูคะแนนของฉันและยื่นขอฝึกอบรม', icon: Users, color: 'text-blue-600', background: 'bg-blue-50' },
  { id: 'chief', name: 'Section Chief', title: 'หัวหน้างาน', description: 'ดูแลทักษะทีมและจัดการฝึกอบรม', icon: UserCheck, color: 'text-blue-600', background: 'bg-blue-50' },
  { id: 'manager', name: 'Department Manager', title: 'ผู้จัดการ', description: 'วิเคราะห์ภาพรวมและยืนยันคะแนน', icon: Briefcase, color: 'text-blue-600', background: 'bg-blue-50' },
  { id: 'admin', name: 'System Admin', title: 'ผู้ดูแลระบบ', description: 'จัดการข้อมูลและตรวจประวัติระบบ', icon: ShieldCheck, color: 'text-blue-600', background: 'bg-blue-50' },
] as const;

export function LoginPage({ onLoginSuccess }: { onLoginSuccess: (role: string) => void }) {
  const [selectedRole, setSelectedRole] = useState<Role>('staff');
  const [username,setUsername] = useState('staff.demo');
  const [password,setPassword] = useState('Demo@2026');
  const [showPassword,setShowPassword] = useState(false);
  const actor = ACTORS[selectedRole];
  const roleTitle = roles.find(role => role.id === selectedRole)!.title;
  function handleLogin(event: FormEvent) {
    event.preventDefault();
    onLoginSuccess(selectedRole);
  }
  return <main className="login-screen grid min-h-svh bg-white md:grid-cols-[0.42fr_0.58fr] print:hidden">
    <section className="flex flex-col border-b border-blue-100 bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100/50 px-5 py-4 md:border-b-0 md:border-r md:px-8 md:py-6 xl:px-12">
      <div className="flex items-center gap-4"><div className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-xl font-bold tracking-tight text-blue-800">DAIHEN</div><div><p className="text-base font-bold text-slate-800">Skill Matrix</p><p className="mt-0.5 text-xs text-slate-500">ระบบพัฒนาทักษะบุคลากร</p></div></div>
      <div className="mx-auto hidden w-full max-w-md flex-1 flex-col justify-center py-8 md:flex">
        <span className="mb-3 self-start text-xs font-semibold tracking-widest text-blue-700">PEOPLE & SKILLS</span>
        <h1 className="text-2xl font-bold leading-snug tracking-tight text-slate-900 xl:text-4xl">พัฒนาทักษะของทีม<br/><span className="text-blue-700">อย่างเป็นระบบ</span></h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">เห็นความสามารถของบุคลากร วางแผนฝึกอบรม และติดตามการพัฒนาในพื้นที่เดียว</p>
        <div className="mt-6 space-y-4">
          {[
            { icon: BarChart3, title: 'เห็นทักษะและคะแนนอย่างชัดเจน', detail: 'ดูคะแนนรายบุคคล รายแผนก และแนวโน้มการพัฒนา' },
            { icon: GraduationCap, title: 'พัฒนาทักษะผ่านการฝึกอบรม', detail: 'ยื่นคำขอ นัดหมาย และติดตามผลการฝึกอบรม' },
            { icon: ClipboardCheck, title: 'ใช้ข้อมูลประกอบการประเมิน', detail: 'สรุปคะแนนและรายงานสำหรับผู้จัดการ' },
          ].map(feature => <div key={feature.title} className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white bg-white/80 text-blue-600"><feature.icon size={21}/></span><div><h2 className="text-sm font-semibold text-slate-800">{feature.title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{feature.detail}</p></div></div>)}
        </div>
      </div>
      <p className="hidden text-xs text-slate-500 md:block">Skill Matrix · เชื่อมการเรียนรู้กับความสามารถในการทำงาน</p>
    </section>
    <section className="flex items-center justify-center px-5 py-5 md:px-8 md:py-6 xl:px-12" aria-labelledby="login-title">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between gap-3"><h2 id="login-title" className="text-2xl font-bold tracking-tight text-slate-900">เข้าสู่ระบบ</h2><span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"><span className="h-1.5 w-1.5 rounded-full bg-blue-500"/>โหมดสาธิต</span></div>
        <p className="mt-2 text-sm leading-6 text-slate-500">เลือกบทบาทที่ต้องการใช้งาน แต่ละบทบาทมีเมนูและงานที่รับผิดชอบของตนเอง</p>
        <form onSubmit={handleLogin} className="mt-4">
          <fieldset><legend className="mb-3 text-sm font-semibold text-slate-700">เลือกบทบาทของคุณ</legend>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(role => {
                const selected = selectedRole === role.id; const Icon = role.icon;
                return <button key={role.id} type="button" aria-label={role.name} aria-pressed={selected} onClick={() => {setSelectedRole(role.id);setUsername(`${role.id}.demo`);}} className={`relative rounded-xl border p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${selected ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'}`}>
                  <span className="flex items-center gap-3 pr-5"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${role.background} ${role.color}`}><Icon size={17}/></span><span className="min-w-0"><span className="block text-sm font-semibold text-slate-800">{role.title}</span><span className="mt-1 block text-xs text-slate-500">{role.name}</span></span></span>
                  {selected && <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white"><Check size={13}/></span>}
                  <span className="mt-2 block text-xs leading-5 text-slate-600">{role.description}</span>
                </button>;
              })}
            </div>
          </fieldset>
          <div className="mt-4 grid grid-cols-1 gap-3"><div><label htmlFor="login-username" className="mb-1.5 block text-sm font-semibold text-slate-700">Username</label><div className="relative"><Users size={16} className="absolute left-3 top-3 text-slate-400"/><input id="login-username" name="username" autoComplete="username" maxLength={100} value={username} onChange={event=>setUsername(event.target.value)} placeholder="กรอกชื่อผู้ใช้" className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div></div><div><label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label><div className="relative"><LockKeyhole size={16} className="absolute left-3 top-3 text-slate-400"/><input id="login-password" name="password" type={showPassword?'text':'password'} autoComplete="current-password" maxLength={100} value={password} onChange={event=>setPassword(event.target.value)} placeholder="กรอกรหัสผ่าน" className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/><button type="button" aria-label={showPassword?'ซ่อนรหัสผ่าน':'แสดงรหัสผ่าน'} aria-pressed={showPassword} onClick={()=>setShowPassword(!showPassword)} className="absolute right-2 top-2 rounded-lg p-1 text-slate-400 hover:bg-slate-100">{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></div></div>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-blue-50/70 px-4 py-2" aria-live="polite"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500"><Users size={18}/></span><div className="min-w-0"><p className="text-xs text-slate-500">บัญชีตัวอย่าง · {roleTitle}</p><p className="mt-0.5 text-sm font-semibold text-slate-700">{actor.name}</p></div></div>
          <button type="submit" className="mt-4 flex min-h-11 w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">เข้าสู่ระบบ <ArrowRight size={18}/></button>
          <p className="mt-3 text-center text-xs leading-5 text-slate-500">ช่องบัญชีเป็นตัวอย่างสำหรับแสดงหน้าจอ · โหมดสาธิตเข้าใช้งานตามบทบาทที่เลือก</p>
        </form>
      </div>
    </section>
  </main>;
}
