import { useState } from 'react';
import { ShieldCheck, RotateCcw, Check } from 'lucide-react';
import { buttonClass, panelClass } from '../components/Phase1Shared';
import { resetSkillDemoState } from '../data/phase1Store';
import { resetTrainingDemoState } from '../data/trainingStore';

export default function PhaseOneSettings({onPermissions,permissions=false}:{onPermissions:()=>void;permissions?:boolean}) {
  const [resetMessage, setResetMessage] = useState('');
  const roles=[
    ['Staff','ข้อมูลของตนเอง','ยื่นคำขอ · ติดตาม · ดูผล','ดูคะแนนที่อนุมัติแล้ว'],
    ['Section Chief','ทีมในแผนกของตนเอง','ตรวจคำขอ · นัดอบรม · บันทึกผล','แก้ไขแบบแมนนวลในหน้ารายบุคคล แล้วส่งให้ผู้จัดการยืนยัน'],
    ['Department Manager','ภาพรวมทุกแผนก','รับรองหรือปฏิเสธผลฝึกอบรม','ยืนยันคะแนน · ประเมินรายบุคคล / รายแผนก · ส่งออกผลรวม'],
    ['System Admin','ดูแลข้อมูลหลักและพนักงาน','ตรวจประวัติแบบอ่านอย่างเดียว','ตรวจประวัติแบบอ่านอย่างเดียว'],
  ];

  function handleReset() {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้น (300 คน) ใช่หรือไม่?')) {
      resetSkillDemoState();
      resetTrainingDemoState();
      setResetMessage('รีเซ็ตข้อมูลตัวอย่างเป็นค่าเริ่มต้น 300 คนเรียบร้อยแล้ว');
      setTimeout(() => setResetMessage(''), 4000);
    }
  }

  return <div className="space-y-6">
    <div className="flex items-center justify-between gap-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800"><ShieldCheck/>{permissions?'สิทธิ์และบทบาท':'ตั้งค่าระบบ'}</h1>
      {!permissions && (
        <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs">
          <RotateCcw size={14}/>
          รีเซ็ตข้อมูลระบบเป็นค่าเริ่มต้น (300 คน)
        </button>
      )}
    </div>
    {resetMessage && (
      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
        <Check size={18} className="text-emerald-600"/>
        {resetMessage}
      </div>
    )}
    <div className={`${panelClass} space-y-4 p-6`}><h2 className="font-bold text-slate-800">พื้นที่ผู้ใช้งานตามบทบาท</h2><p className="text-sm leading-6 text-slate-600">Staff, Chief, Manager และ Admin มีหน้าและเมนูของตนเอง หน้าที่การยื่นคำขอ ตรวจคำขอ ประเมินผล รับรอง และดูประวัติแยกเป็นคนละหน้าจอ</p><p className="rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-800">คะแนนสกิลเปลี่ยนเมื่อผู้จัดการอนุมัติข้อเสนอจากหัวหน้างาน ผลฝึกอบรมใช้เป็นหลักฐานประกอบการประเมิน โดยไม่เปลี่ยนคะแนนสกิลอัตโนมัติ</p>{!permissions&&<button className={buttonClass} onClick={onPermissions}>ดูสิทธิ์และบทบาท</button>}</div><div className={`${panelClass} overflow-x-auto`}><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-4">บทบาท</th><th className="p-4">ขอบเขตข้อมูล</th><th className="p-4">หน้าที่ฝึกอบรม</th><th className="p-4">หน้าที่คะแนนสกิล</th></tr></thead><tbody>{roles.map(row=><tr key={row[0]} className="border-t border-slate-100">{row.map((value,index)=><td key={index} className="p-4 leading-6">{value}</td>)}</tr>)}</tbody></table></div><p className="text-xs text-slate-500">ข้อมูลจำลองสำหรับสาธิต · ใช้ปุ่มเปลี่ยนบทบาทด้านบนเพื่อเปิดพื้นที่ของผู้ใช้งานแต่ละแบบ</p></div>;
}
