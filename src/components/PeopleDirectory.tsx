import { FilterBar } from './FilterBar';
import { useState } from 'react';
import { Field, inputClass, panelClass } from './Phase1Shared';
import type { Employee } from '../data/phase1Core';
import { sumSkills } from '../data/phase1Core';
export default function PeopleDirectory({employees}:{employees:Employee[]}) {
  const [search,setSearch]=useState('');
  const people=employees.filter(e=>`${e.name} ${e.id} ${e.department}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="space-y-4"><FilterBar title="ค้นหาบุคลากร" onReset={()=>setSearch('')}><Field label="ค้นหาบุคลากร"><input className={inputClass} value={search} onChange={e=>setSearch(e.target.value)} placeholder="รหัส ชื่อ หรือแผนก"/></Field></FilterBar><div className={`${panelClass} overflow-x-auto`}><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-4">พนักงาน</th><th className="p-4">แผนก</th><th className="p-4">ตำแหน่ง</th><th className="p-4 text-right">คะแนนรวม</th></tr></thead><tbody>{people.map(e=><tr key={e.id} className="border-t border-slate-100"><td className="p-4"><div className="font-semibold">{e.name}</div><span className="text-xs text-slate-500">{e.id}</span></td><td className="p-4">{e.department}</td><td className="p-4">{e.position}</td><td className="p-4 text-right font-bold text-blue-800">{sumSkills(e)}</td></tr>)}</tbody></table>{!people.length&&<p className="p-6 text-center text-sm text-slate-500">ไม่พบพนักงาน</p>}</div></div>;
}
