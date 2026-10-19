import { FilterBar, FilterToggle } from '../../components/FilterBar';
import { useState } from 'react';
import { User } from 'lucide-react';
import { ACTORS, bangkokYear, employeesForYear, LEVEL_LABELS } from '../../data/phase1Core';
import { useSkillState } from '../../data/phase1Store';
import { individualAssessment } from '../../data/skillAssessment';
import { EmptyState, Field, inputClass, LevelBadge, Metric, panelClass } from '../../components/Phase1Shared';
import { Avatar } from '../../components/Avatar';

export default function MyScoresPage() {
  const state = useSkillState();
  const [wi, setWi] = useState('ALL');
  const [type, setType] = useState('ALL');
  const [level, setLevel] = useState('ALL');
  const [onDuty, setOnDuty] = useState(false);
  const employee = employeesForYear(state, bangkokYear()).find(person => person.id === ACTORS.staff.employeeId);
  if (!employee) return <EmptyState>ยังไม่มีข้อมูลคะแนนของฉันในปีนี้</EmptyState>;

  const assessment = individualAssessment(employee);
  const workInstructions = [...new Map(assessment.rows.map(row => [row.wiCode, row.wiName])).entries()];
  const availableTypes = [...new Set(assessment.rows.filter(row => wi === 'ALL' || row.wiCode === wi).map(row => row.type))].sort();
  const rows = assessment.rows.filter(row =>
    (wi === 'ALL' || row.wiCode === wi) &&
    (type === 'ALL' || row.type === type) &&
    (level === 'ALL' || row.level === Number(level)) &&
    (!onDuty || employee.assignedSkills.includes(row.key))
  );
  const groups = [...new Set(rows.map(row => row.type))].sort().map(code => {
    const members = rows.filter(row => row.type === code);
    return { code, rows: members, total: members.reduce((sum, row) => sum + row.level, 0) };
  });
  const total = rows.reduce((sum, row) => sum + row.level, 0);
  const filtered = wi !== 'ALL' || type !== 'ALL' || level !== 'ALL' || onDuty;
  const independent = assessment.rows.filter(row => row.level >= 2).length;

  return <div className="space-y-5">
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800"><User/>ดูคะแนนของฉัน</h1>
      <p className="mt-1 text-sm text-slate-500">ดูคะแนนที่ยืนยันแล้วและทบทวนทักษะของตนเอง · ปี {bangkokYear()}</p>
    </div>
    <div className={`${panelClass} flex flex-wrap items-center justify-between gap-4 p-5`}>
      <div className="flex items-center gap-4">
        <Avatar src={employee.avatarUrl} name={employee.name} size="lg" className="ring-2 ring-white shadow-xs" />
        <div>
          <h2 className="text-lg font-bold text-slate-800">{employee.name}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{employee.id} · {employee.department} · {employee.position}</p>
        </div>
      </div>
      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">คะแนนที่ยืนยันแล้ว</span>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <Metric label="คะแนนรวมทั้งหมด" value={`${assessment.total} / ${assessment.maximum}`} note={`รวมทุก ${assessment.rows.length} สกิล · สกิลละ 3 คะแนน`}/>
      <Metric label="สกิลที่ทำได้ด้วยตนเอง" value={`${independent} / ${assessment.rows.length}`} note="ระดับ 2–3: ทำงานเองได้ หรือสอนผู้อื่นได้"/>
      <Metric label="สกิลที่ต้องพัฒนา" value={assessment.rows.length - independent} note="ระดับ 0–1: ยังทำไม่ได้ หรือต้องมีผู้ดูแล"/>
    </div>
    <FilterBar title="ตัวกรองสกิลของฉัน" onReset={filtered?()=>{setWi('ALL');setType('ALL');setLevel('ALL');setOnDuty(false);}:undefined} resetLabel="แสดงทุกสกิล" footer={<><FilterToggle checked={onDuty} onChange={setOnDuty}>เฉพาะสกิลที่ได้รับมอบหมาย</FilterToggle><span className="text-xs text-slate-500">แสดง {rows.length} จาก {assessment.rows.length} สกิล</span></>}>
      <Field label="Work Instruction"><select className={inputClass} value={wi} onChange={event => { setWi(event.target.value); setType('ALL'); }}><option value="ALL">ทุก W/I</option>{workInstructions.map(([code, name]) => <option key={code} value={code}>{code} · {name}</option>)}</select></Field>
      <Field label="ประเภทสกิล"><select className={inputClass} value={type} onChange={event => setType(event.target.value)}><option value="ALL">ทุกประเภท</option>{availableTypes.map(code => <option key={code} value={code}>Skill Type {code}</option>)}</select></Field>
      <Field label="ระดับสกิล"><select className={inputClass} value={level} onChange={event => setLevel(event.target.value)}><option value="ALL">ทุกระดับ</option>{LEVEL_LABELS.map((label, value) => <option key={value} value={value}>{value} · {label}</option>)}</select></Field>
    </FilterBar>
    <div className="flex flex-wrap gap-4 text-xs text-slate-500">{LEVEL_LABELS.map((label, value) => <span key={value} className="flex items-center gap-2"><LevelBadge level={value}/>{label}</span>)}</div>
    <div className={`${panelClass} overflow-x-auto`}>
      <div className="border-b border-slate-100 p-5"><h2 className="font-bold text-slate-800">คะแนนของฉันแยกตาม Skill Type</h2><p className="mt-1 text-xs text-slate-500">แสดง {rows.length} จาก {assessment.rows.length} สกิล · รวมคะแนนปัจจุบันของแต่ละรายการ คะแนนเต็มรายการละ 3</p>{filtered && <p className="mt-2 text-xs font-medium text-blue-700">ยอดรวมในตารางคำนวณเฉพาะรายการที่แสดง ส่วนคะแนนรวมทั้งหมดด้านบนรวมทุกสกิล</p>}</div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">W/I</th><th className="p-4">ชื่องาน</th><th className="p-4">ประเภทสกิล</th><th className="p-4 text-center">คะแนนปัจจุบัน</th></tr></thead>
        {groups.map(group => <tbody key={group.code}>
          <tr className="border-t border-slate-200 bg-slate-50"><th scope="rowgroup" colSpan={4} className="px-4 py-3 text-blue-900">Skill Type {group.code} · {group.rows.length} สกิล</th></tr>
          {group.rows.map(row => <tr key={row.key} data-skill-key={row.key} className="border-t border-slate-100"><td className="p-4 font-mono">{row.wiCode}</td><td className="p-4">{row.wiName}</td><td className="p-4">{row.type} · {row.typeName}</td><td className="p-4 text-center"><LevelBadge level={row.level}/></td></tr>)}
          <tr data-type-total={group.code} className="border-t border-blue-100 bg-blue-50/60 font-semibold"><th scope="row" colSpan={3} className="p-4">รวม Skill Type {group.code}</th><td className="p-4 text-center text-blue-800">{group.total} / {group.rows.length * 3}</td></tr>
        </tbody>)}
        {!rows.length && <tbody><tr><td colSpan={4} className="p-8 text-center text-slate-500">ไม่พบสกิลตามตัวกรองที่เลือก ลองเลือกทุกประเภทหรือทุกระดับ</td></tr></tbody>}
        <tfoot className="border-t-2 border-blue-200 bg-blue-100/70 font-bold text-blue-900"><tr data-score-total><th scope="row" colSpan={3} className="p-4">{filtered ? 'รวมคะแนนตามตัวกรอง' : 'รวมคะแนนทั้งหมด'} · {rows.length} สกิล</th><td className="p-4 text-center">{total} / {rows.length * 3}</td></tr></tfoot>
      </table>
    </div>
    <p className="text-xs leading-6 text-slate-500">ใช้ระดับสกิลและคะแนนรวมเพื่อทบทวนตนเอง หากต้องการพัฒนาสกิลที่ยังทำไม่ได้หรือต้องมีผู้ดูแล สามารถยื่นขอฝึกอบรมได้ คะแนนจะแสดงตามผลที่ผู้จัดการยืนยันแล้ว</p>
  </div>;
}
