import React, { useState } from 'react';
import { CURRENT_USER_PROFILES, APPROVAL_STATS } from '../lib/sharedMockData';
import { User, Award, BookOpen, CheckCircle, Target, TrendingUp, Calendar, Send, FileText, ChevronRight, Check } from 'lucide-react';

interface StaffDashboardProps {
  onNavigatePage?: (page: string) => void;
}

export function StaffDashboard({ onNavigatePage, userRole = 'staff' }: StaffDashboardProps & { userRole?: string }) {
  const profile = CURRENT_USER_PROFILES[userRole] || CURRENT_USER_PROFILES.staff;
  const [requestSent, setRequestSent] = useState(false);
  const [selectedWiForRequest, setSelectedWiForRequest] = useState('QCW001-002');
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleSendOjtRequest = () => {
    setRequestSent(true);
    setShowRequestModal(false);
    setTimeout(() => setRequestSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {requestSent && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <Check size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">ส่งคำขออบรม OJT ({selectedWiForRequest}) ไปยัง Chief อรุณี เรียบร้อยแล้ว!</span>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0a2540] to-blue-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
              <User size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold bg-teal-500/30 text-teal-200 border border-teal-400/30 px-2.5 py-0.5 rounded-full">
                  พนักงานระดับปฏิบัติการ (Staff View)
                </span>
                <span className="text-xs text-blue-200">{profile.id}</span>
              </div>
              <h1 className="text-2xl font-bold">ยินดีต้อนรับกลับ, คุณ{profile.name} 👋</h1>
              <p className="text-blue-200 text-xs mt-1">
                ตำแหน่ง: {profile.position} · แผนก {profile.department} · หัวหน้าสายตรง: <strong className="text-white">{profile.chief}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/15 p-3.5 rounded-xl">
            <div className="text-right">
              <div className="text-xs text-blue-200 font-medium">ระดับความพร้อมทำงาน (Competency)</div>
              <div className="text-2xl font-bold text-teal-300">{profile.competencyPercent}% <span className="text-xs font-normal text-white">({profile.competencyPercent >= 75 ? 'Independent' : profile.competencyPercent >= 50 ? 'Under Supervision' : 'Learning'})</span></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{profile.skillsAssigned} WIs</div>
            <div className="text-xs text-slate-500">W/I ที่รับผิดชอบในสายงาน</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-700">2 สกิล</div>
            <div className="text-xs text-slate-500">ระดับ 3 (Trainer / วิทยากร)</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700">2 สกิล</div>
            <div className="text-xs text-slate-500">ระดับ 2 (Independent อิสระ)</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Target size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">1 สกิล</div>
            <div className="text-xs text-slate-500">รออัปเกรด (Level 1 ➔ 2)</div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Career Growth Goals & Next Milestones */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Skill Milestone Upgrade Goals */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="text-blue-600" size={18} />
                <h3 className="font-bold text-slate-800 text-base">เป้าหมายการพัฒนาทักษะ (Next Skill Goals)</h3>
              </div>
              <button 
                onClick={() => setShowRequestModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
              >
                <Send size={13} /> ยื่นขอรับการอบรม OJT
              </button>
            </div>

            <div className="space-y-3">
              {/* Goal 1 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 font-mono font-bold text-xs px-2.5 py-0.5 rounded">QCW001-002</span>
                    <span className="font-bold text-xs text-slate-800">การทดสอบพิกัดกำลังไฟฟ้าและแรงดันสูง</span>
                  </div>
                  <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                    เป้าหมายถัดไป
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-slate-500">ระดับปัจจุบัน:</span> <strong className="text-blue-700">Level 1 (Under Supervision)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">เป้าหมาย:</span> <strong className="text-emerald-700">Level 2 (Independent)</strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>ความพร้อมสอบ OJT (ชั่วโมงซ้อมสะสม 18/20 ชม.)</span>
                    <span className="font-bold text-blue-700">90%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button 
                    onClick={() => { setSelectedWiForRequest('QCW001-002'); setShowRequestModal(true); }}
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                  >
                    ขอรับการทดสอบประเมินผลกับ Chief &rarr;
                  </button>
                </div>
              </div>

              {/* Goal 2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 opacity-80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200 text-slate-700 font-mono font-bold text-xs px-2.5 py-0.5 rounded">QCW002-001</span>
                    <span className="font-bold text-xs text-slate-800">การตรวจสอบรอยเชื่อมและจุดยึดโครงสร้างหม้อแปลง</span>
                  </div>
                  <span className="text-[11px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded">
                    เป้าหมายถัดไป (เฟส 2)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-slate-500">ระดับปัจจุบัน:</span> <strong className="text-blue-700">Level 1 (Under Supervision)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">เป้าหมาย:</span> <strong className="text-emerald-700">Level 2 (Independent)</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>ความพร้อมสอบ OJT (ชั่วโมงซ้อมสะสม 10/20 ชม.)</span>
                    <span className="font-bold text-slate-600">50%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links & Shortcut Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => onNavigatePage && onNavigatePage('individual')}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                  <Award size={14} /> ทักษะส่วนบุคคล
                </div>
                <div className="font-bold text-slate-800 text-base">ดูผัง Skill Matrix ของฉัน</div>
                <div className="text-xs text-slate-400">ตรวจสอบ Radar Chart และทักษะ A, B, C, D, E</div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>

            <div 
              onClick={() => onNavigatePage && onNavigatePage('wi-library')}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-purple-600 flex items-center gap-1">
                  <BookOpen size={14} /> คู่มือปฏิบัติงาน
                </div>
                <div className="font-bold text-slate-800 text-base">คลังเอกสาร W/I (Library)</div>
                <div className="text-xs text-slate-400">เปิดอ่านคู่มือและดาวน์โหลด PDF ก่อนสอบ OJT</div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): OJT Schedule & History Log */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upcoming OJT Calendar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="text-blue-600" size={18} />
              <h3 className="font-bold text-slate-800 text-sm">ตารางนัดอบรม OJT ถัดไป</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    10 ต.ค. 2026 (09:00 - 11:30)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.2 rounded">ยืนยันแล้ว</span>
                </div>
                <div className="font-bold text-xs text-slate-800 pt-1">อบรมสอบซ่อมปฏิบัติ QCW001-002</div>
                <div className="text-xs text-slate-500">วิทยากร/ผู้ประเมิน: นางสาวอรุณี รักดี (Chief)</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 opacity-70">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                    24 ต.ค. 2026 (13:30 - 15:00)
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">รอการยืนยัน</span>
                </div>
                <div className="font-bold text-xs text-slate-800 pt-1">ทดสอบวัดความต้านทานเบื้องต้น</div>
                <div className="text-xs text-slate-500">วิทยากร/ผู้ประเมิน: Chief เอกวิทย์</div>
              </div>
            </div>
          </div>

          {/* Recent Training History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="text-slate-600" size={18} />
                <h3 className="font-bold text-slate-800 text-sm">ประวัติการอบรมล่าสุด</h3>
              </div>
              <button 
                onClick={() => onNavigatePage && onNavigatePage('training')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                ดูทั้งหมด &rarr;
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs">
                <div>
                  <div className="font-bold text-slate-800">OJT-001 (QCW001-001)</div>
                  <div className="text-[11px] text-slate-400">10 ก.ย. 2026 · ผ่าน (Passed)</div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Level 1
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs">
                <div>
                  <div className="font-bold text-slate-800">OJT-002 (QCW001-002)</div>
                  <div className="text-[11px] text-slate-400">12 ก.ย. 2026 · ไม่ผ่าน (Failed)</div>
                </div>
                <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  Level 0
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Self-Nomination OJT Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Send size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">ยื่นคำขอรับการอบรม / สอบ OJT</h3>
                <p className="text-xs text-slate-500">ส่งการแจ้งเตือนไปยัง Chief อรุณี เพื่อขอนัดหมายทดสอบ</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">เลือก Work Instruction ที่ต้องการสอบ</label>
                <select 
                  value={selectedWiForRequest}
                  onChange={e => setSelectedWiForRequest(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg py-2 px-3 text-xs bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="QCW001-002">QCW001-002 - การทดสอบพิกัดกำลังไฟฟ้าและแรงดันสูง</option>
                  <option value="QCW002-001">QCW002-001 - การตรวจสอบรอยเชื่อมและจุดยึดโครงสร้างหม้อแปลง</option>
                  <option value="QCW004-001">QCW004-001 - การทดสอบวัดค่าการสูญเสียในสภาวะไร้ภาระ</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">วันที่สะดวกเข้ารับการสอบประเมิน</label>
                <input 
                  type="date"
                  defaultValue="2026-10-15"
                  className="w-full border border-slate-300 rounded-lg py-2 px-3 text-xs bg-slate-50 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">หมายเหตุเพิ่มเติมถึงหัวหน้างาน</label>
                <textarea 
                  rows={3}
                  placeholder="เช่น ฝึกซ้อมการทดสอบวัดแรงดันสะสมครบ 20 ชั่วโมงแล้ว พร้อมเข้ารับการทดสอบครับ"
                  className="w-full border border-slate-300 rounded-lg py-2 px-3 text-xs bg-slate-50 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button 
                onClick={() => setShowRequestModal(false)}
                className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleSendOjtRequest}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm"
              >
                ยืนยันส่งคำขอ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
