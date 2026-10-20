import type { ReactNode } from 'react';
import { ArrowRight, BarChart3, ClipboardList, ShieldAlert, Users, GitCompare } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ACTORS, bangkokYear } from '../../data/phase1Core';
import { chiefAnalytics } from '../../data/chiefAnalytics';
import { useSkillState } from '../../data/phase1Store';
import { useTrainingRequests } from '../../data/trainingStore';
import { buttonClass, EmptyState, Metric, panelClass } from '../../components/Phase1Shared';
import { RolePageIntro } from '../../components/RolePageIntro';
import { Avatar } from '../../components/Avatar';

function ChartCard({ title, description, children, action, onAction }: { title: string; description: string; children: ReactNode; action: string; onAction: () => void }) {
  return <section className={`${panelClass} p-5`}><div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-bold text-slate-800">{title}</h2><p className="mt-1 max-w-lg text-xs leading-5 text-slate-500">{description}</p></div><button onClick={onAction} className="flex items-center gap-1 text-xs font-semibold text-blue-700">{action}<ArrowRight size={14}/></button></div>{children}</section>;
}

export default function ChiefDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const data = chiefAnalytics(useSkillState(), useTrainingRequests());
  return <div className="space-y-6">
    <RolePageIntro title="งานที่หัวหน้าต้องดำเนินการ" description={`แดชบอร์ดทีม ${ACTORS.chief.department} · ปี ${bangkokYear()} · ${ACTORS.chief.name}`}/>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="คำขออบรมรอตรวจ" value={data.awaitingReview.length} note="ตรวจเหตุผลและจัดผู้สอน"/>
      <Metric label="ถึงวันอบรม / รอประเมิน" value={data.readyToEvaluate.length} note={`${data.upcoming.length} รายการนัดหมายล่วงหน้า`}/>
      <Metric label="สกิลทำงานได้ด้วยตนเอง" value={data.readiness === null ? '—' : `${data.readiness.toFixed(1)}%`} note={`${data.independent} จาก ${data.cells} สกิลที่ได้รับมอบหมาย`}/>
      <Metric label="สกิลเสี่ยงขาดคนทดแทน" value={data.risk.length} note="ไม่มีคนทำเอง / พึ่งคนเดียว / ขาดผู้สอน"/>
    </div>
    <div className="flex flex-wrap gap-3"><button className={buttonClass} onClick={()=>onNavigate('chief-training-requests')}><ClipboardList size={16}/>ตรวจคำขอฝึกอบรม</button><button className={buttonClass} onClick={()=>onNavigate('chief-training-evaluation')}>บันทึกผลฝึกอบรม</button><button className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-800" onClick={()=>onNavigate('chief-individual-scores')}>ดู / แก้ไขคะแนนรายบุคคล</button><button className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100" onClick={()=>onNavigate('chief-compare')}><GitCompare size={15}/>เปรียบเทียบทักษะ</button></div>
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartCard title="ความพร้อมของพนักงานในทีม" description="จำนวนสกิลที่มอบหมายต่อคน · ใช้เลือกผู้สอนและพนักงานที่ควรพัฒนาก่อน" action="ดูคะแนนทีม" onAction={()=>onNavigate('chief-team-skills')}>
        {data.cells ? <div className="h-80" role="img" aria-label="กราฟความพร้อมรายบุคคล แยกสกิลที่ต้องพัฒนา ทำเองได้ และสอนได้"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.people} layout="vertical" margin={{left: 0, right: 20, bottom: 5}}><CartesianGrid strokeDasharray="3 3" horizontal={false}/><XAxis type="number" allowDecimals={false}/><YAxis type="category" dataKey="name" width={120} tick={{fontSize:11}}/><Tooltip/><Legend wrapperStyle={{fontSize:11}}/><Bar dataKey="needsTraining" name="ต้องพัฒนา (0–1)" fill="#f59e0b" stackId="skills" isAnimationActive={false}/><Bar dataKey="independent" name="ทำเองได้ (2)" fill="#3b82f6" stackId="skills" isAnimationActive={false}/><Bar dataKey="trainers" name="สอนได้ (3)" fill="#10b981" stackId="skills" isAnimationActive={false}/></BarChart></ResponsiveContainer></div> : <EmptyState>ยังไม่มีสกิลที่ได้รับมอบหมายในทีม</EmptyState>}
      </ChartCard>
      <ChartCard title="สถานะงานฝึกอบรมของทีม" description="รวมรายการในแผนกทุกปี · แยกรายการที่ถึงวันประเมินจากนัดหมายล่วงหน้า" action="จัดการงานอบรม" onAction={()=>onNavigate('chief-training-evaluation')}>
        <div className="h-80" role="img" aria-label="กราฟจำนวนงานฝึกอบรมในแต่ละขั้นตอน"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.stages} layout="vertical" margin={{left:0,right:20,bottom:5}}><CartesianGrid strokeDasharray="3 3" horizontal={false}/><XAxis type="number" allowDecimals={false}/><YAxis type="category" dataKey="stage" width={130} tick={{fontSize:11}}/><Tooltip formatter={value=>[`${value} รายการ`,'จำนวน']}/><Bar dataKey="count" name="รายการฝึกอบรม" radius={[0,5,5,0]} isAnimationActive={false}>{data.stages.map(row=><Cell key={row.stage} fill={row.color}/>)}</Bar></BarChart></ResponsiveContainer></div>
        <p className="text-xs text-slate-500">ผลที่ควรทบทวน {data.followUp.length} รายการ · เตรียมหลักฐานเพิ่มหรือวางแผนอบรมซ้ำ</p>
      </ChartCard>
      <ChartCard title="สกิลที่ควรเตรียมคนทดแทน" description="แสดง 6 สกิลที่ควรติดตามก่อน · ผู้ทำเองได้รวมระดับ 2–3 และผู้สอนคือระดับ 3" action="ดูความสามารถตามงาน" onAction={()=>onNavigate('chief-job-summary')}>
        {data.coverage.length ? <div className="h-80" role="img" aria-label="กราฟเปรียบเทียบผู้ได้รับมอบหมาย ผู้ทำงานเองได้ และผู้สอนต่อสกิล"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.coverage} layout="vertical" margin={{left:0,right:20,bottom:5}}><CartesianGrid strokeDasharray="3 3" horizontal={false}/><XAxis type="number" allowDecimals={false}/><YAxis type="category" dataKey="label" width={140} tick={{fontSize:10}}/><Tooltip/><Legend wrapperStyle={{fontSize:11}}/><Bar dataKey="assigned" name="มอบหมาย" fill="#cbd5e1" isAnimationActive={false}/><Bar dataKey="independent" name="ทำเองได้" fill="#3b82f6" isAnimationActive={false}/><Bar dataKey="trainers" name="ผู้สอน" fill="#10b981" isAnimationActive={false}/></BarChart></ResponsiveContainer></div> : <EmptyState>ทุกสกิลมีผู้ทำงานเองหลายคนและมีผู้สอนแล้ว</EmptyState>}
      </ChartCard>
      <ChartCard title="แนวโน้มแผนก: คะแนนเฉลี่ยต่อคน" description="คะแนนรวมของสกิลที่มอบหมาย ÷ จำนวนพนักงาน · ใช้ติดตามผลการพัฒนาทีมรายปี" action="ดูพัฒนาการทีม" onAction={()=>onNavigate('chief-yearly')}>
        <div className="h-80" role="img" aria-label="กราฟแนวโน้มคะแนนเฉลี่ยต่อคนของแผนกย้อนหลังสี่ปี"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.trend} margin={{left:0,right:20,bottom:5}}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="year"/><YAxis/><Tooltip formatter={value=>[Number(value).toFixed(2),'คะแนนเฉลี่ยต่อคน']}/><Legend/><Line dataKey="average" name="คะแนนเฉลี่ยต่อคน" stroke="#6366f1" strokeWidth={3} dot={{r:5}} connectNulls={false} isAnimationActive={false}/></LineChart></ResponsiveContainer></div>
        <p className="text-xs text-slate-500">เทียบปีก่อน: {data.growth === null ? 'ยังไม่มีข้อมูลเปรียบเทียบ' : `${data.growth > 0 ? '+' : ''}${data.growth.toFixed(2)} คะแนนต่อคน`} · {data.employees.length} คนในทีม</p>
      </ChartCard>
    </div>
    <section className={`${panelClass} overflow-hidden`}><div className="flex items-center gap-2 border-b border-slate-100 p-5"><ShieldAlert size={18} className="text-amber-600"/><h2 className="font-bold">ลำดับงานที่ควรดำเนินการ</h2></div>{data.waiting.length ? <div className="divide-y divide-slate-100">{data.waiting.map(request=><div key={request.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div className="flex items-center gap-3"><Avatar src={data.employees.find(e=>e.id===request.employeeId)?.avatarUrl} name={request.employeeName} size="sm"/><div><p className="text-sm font-semibold text-slate-800">{request.employeeName} · {request.wiCode} / {request.skillType}</p><p className="mt-0.5 text-xs text-slate-500">{request.status === 'requested' ? `รอตรวจคำขอ · ยื่น ${request.submittedAt.slice(0,10)}` : `วันอบรม ${request.scheduledDate} · ${data.readyToEvaluate.some(r=>r.id===request.id) ? 'ถึงวันอบรมแล้ว รอบันทึกผล' : 'เตรียมผู้สอนและอุปกรณ์'}`}</p></div></div><button className="flex items-center gap-1 text-sm font-semibold text-blue-700" onClick={()=>onNavigate(request.status==='requested'?'chief-training-requests':'chief-training-evaluation')}>{request.status==='requested'?'ตรวจคำขอ':'ดูรายการประเมิน'}<ArrowRight size={14}/></button></div>)}</div> : <div className="p-5 text-sm text-slate-500">ไม่มีคำขอหรืองานประเมินค้างในทีม</div>}</section>
    <p className="flex items-center gap-2 text-xs text-slate-500"><Users size={14}/>{data.employees.length} คน · <BarChart3 size={14}/>กราฟคะแนนอ้างอิงระดับที่ผู้จัดการยืนยันแล้ว</p>
  </div>;
}
