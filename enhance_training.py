import io
import re

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Replace the boring blue hint box with a beautiful stepper UI
stepper_ui = """      {/* Training Workflow Diagram */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            13. Training Management <span className="text-blue-300 text-sm font-normal ml-2">(Workflow อ้างอิง Proposal)</span>
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full bg-white/10 border border-white/20 rounded-full p-6 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:h-32 hover:bg-white/20 transition-all hover:scale-105">
              <h3 className="font-bold text-lg">Request</h3>
              <p className="text-xs text-blue-200 mt-1">ยื่นคำขอฝึกอบรม</p>
            </div>
            
            <div className="text-blue-300 hidden md:block"><ChevronRight size={24} /></div>
            
            <div className="flex-1 w-full bg-white/10 border border-white/20 rounded-full p-6 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:h-32 hover:bg-white/20 transition-all hover:scale-105">
              <h3 className="font-bold text-lg">Training</h3>
              <p className="text-xs text-blue-200 mt-1">เข้ารับการฝึกอบรม</p>
            </div>
            
            <div className="text-blue-300 hidden md:block"><ChevronRight size={24} /></div>
            
            <div className="flex-1 w-full bg-white/10 border border-white/20 rounded-full p-6 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:h-32 hover:bg-white/20 transition-all hover:scale-105">
              <h3 className="font-bold text-lg">Chief Check</h3>
              <p className="text-xs text-blue-200 mt-1">หัวหน้าตรวจสอบผล</p>
            </div>
            
            <div className="text-blue-300 hidden md:block"><ChevronRight size={24} /></div>
            
            <div className="flex-1 w-full bg-white/10 border border-white/20 rounded-full p-6 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:h-32 hover:bg-white/20 transition-all hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/20"></div>
              <h3 className="font-bold text-lg relative z-10">Manager Approve</h3>
              <p className="text-xs text-blue-200 mt-1 relative z-10">ผู้จัดการอนุมัติ</p>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-blue-100 bg-black/20 p-3 rounded-lg">
            พนักงานหรือ Clerk สามารถ Request Training โดยเลือก W/I ที่ต้องการพัฒนา เมื่อผ่าน Training และได้รับการตรวจสอบ/อนุมัติ ระบบสามารถปรับ Skill จาก Level 0 &rarr; Level 1 โดยอัตโนมัติ
          </div>
        </div>
      </div>"""

# Remove the old Flow Hint box
text = re.sub(r'      \{\/\* Flow Hint \*\/\}.*?</div>\n        </div>\n      </div>', stepper_ui, text, flags=re.DOTALL)

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)
