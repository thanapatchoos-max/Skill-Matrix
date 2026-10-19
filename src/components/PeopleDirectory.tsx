import { FilterBar } from './FilterBar';
import { useState } from 'react';
import { Field, inputClass, panelClass } from './Phase1Shared';
import type { Employee } from '../data/phase1Core';
import { sumSkills } from '../data/phase1Core';
import { Pagination } from './Pagination';
import { Avatar } from './Avatar';

export default function PeopleDirectory({employees}:{employees:Employee[]}) {
  const [search,setSearch]=useState('');
  const [currentPage,setCurrentPage]=useState(1);
  const [pageSize,setPageSize]=useState(10);

  const people=employees.filter(e=>`${e.name} ${e.id} ${e.department} ${e.position}`.toLowerCase().includes(search.trim().toLowerCase()));

  const totalPeople = people.length;
  const totalPages = Math.max(1, Math.ceil(totalPeople / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedPeople = people.slice(startIndex, startIndex + pageSize);

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  return <div className="space-y-4">
    <div className="flex items-center justify-between">
      <FilterBar title="ค้นหาบุคลากร" onReset={()=>{setSearch('');setCurrentPage(1);}}>
        <Field label="ค้นหาบุคลากร"><input className={inputClass} value={search} onChange={e=>handleSearchChange(e.target.value)} placeholder="รหัส ชื่อ แผนก หรือตำแหน่ง"/></Field>
      </FilterBar>
    </div>
    <div className="flex items-center justify-between px-1 text-xs text-slate-500">
      <span>{search.trim() ? `ผลการค้นหา: ` : `บุคลากรทั้งหมด: `}<strong className="font-semibold text-slate-800">{totalPeople}</strong> คน{search.trim() ? ` (จาก ${employees.length} คน)` : ''}</span>
    </div>
    <div className={`${panelClass} overflow-x-auto`}>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr><th className="p-4">พนักงาน</th><th className="p-4">แผนก</th><th className="p-4">ตำแหน่ง</th><th className="p-4 text-right">คะแนนรวม</th></tr>
        </thead>
        <tbody>
          {paginatedPeople.length ? paginatedPeople.map(e=><tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
            <td className="p-4">
              <div className="flex items-center gap-3">
                <Avatar src={e.avatarUrl} name={e.name} size="sm" />
                <div>
                  <div className="font-semibold text-slate-800">{e.name}</div>
                  <span className="text-xs font-mono text-slate-500">{e.id}</span>
                </div>
              </div>
            </td>
            <td className="p-4">{e.department}</td>
            <td className="p-4">{e.position}</td>
            <td className="p-4 text-right font-bold text-blue-800">{sumSkills(e)}</td>
          </tr>) : <tr><td colSpan={4} className="p-6 text-center text-sm text-slate-500">ไม่พบข้อมูลพนักงานที่ตรงกับเงื่อนไขการค้นหา</td></tr>}
        </tbody>
      </table>
      <Pagination
        currentPage={safeCurrentPage}
        totalItems={totalPeople}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 25, 50]}
        itemLabel="คน"
      />
    </div>
  </div>;
}
