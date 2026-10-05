import io

with io.open("src/pages/WorkingRecord.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Replace the text input with a select dropdown for NC Number
old_nc_input = """            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">NC Number (Optional)</label>
              <input type="text" placeholder="NC-xxxx-xxx" className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
            </div>"""

new_nc_input = """            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">NC Number (Optional)</label>
              <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white">
                <option value="">-- ไม่ระบุ (งานปกติ) --</option>
                <option value="NC-001">NC-001 : รอยขีดข่วนบนตัวถัง</option>
                <option value="NC-002">NC-002 : ขนาดคอยล์ไม่ได้ตามสเปก</option>
                <option value="NC-003">NC-003 : เชื่อมจุดซีลรั่ว</option>
                <option value="NC-004">NC-004 : ค่าความต้านทานต่ำกว่าเกณฑ์</option>
              </select>
            </div>"""

text = text.replace(old_nc_input, new_nc_input)

with io.open("src/pages/WorkingRecord.tsx", "w", encoding="utf-8") as f:
    f.write(text)

