import io
import re

with io.open("src/pages/WorkingRecord.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Add states for W/I filters
state_str = """  // KPI Specific Filter (Only affects KPI cards)
  const [kpiSkillFilter, setKpiSkillFilter] = useState('ALL');"""
new_state_str = """  const [selectedWI, setSelectedWI] = useState('ALL');

  // KPI Specific Filter (Only affects KPI cards)
  const [kpiSkillFilter, setKpiSkillFilter] = useState('ALL');
  const [kpiWIFilter, setKpiWIFilter] = useState('ALL');"""

text = text.replace(state_str, new_state_str)

# Update filteredRecords logic
filtered_logic = """    if (!isStaff && selectedEmp !== 'ALL' && r.employee !== selectedEmp) return false;"""
new_filtered_logic = """    if (!isStaff && selectedEmp !== 'ALL' && r.employee !== selectedEmp) return false;
    if (selectedWI !== 'ALL' && r.wi !== selectedWI) return false;"""

text = text.replace(filtered_logic, new_filtered_logic)

# Update kpiRecords logic
kpi_logic = """  // Logic: Filter records for KPIs ONLY
  const kpiRecords = filteredRecords.filter(r => {
    if (kpiSkillFilter === 'ALL') return true;
    return r.skillType.startsWith(kpiSkillFilter);
  });"""
new_kpi_logic = """  // Logic: Filter records for KPIs ONLY
  const kpiRecords = filteredRecords.filter(r => {
    let match = true;
    if (kpiSkillFilter !== 'ALL' && !r.skillType.startsWith(kpiSkillFilter)) match = false;
    if (kpiWIFilter !== 'ALL' && r.wi !== kpiWIFilter) match = false;
    return match;
  });"""

text = text.replace(kpi_logic, new_kpi_logic)

# Extract unique WIs from records for the dropdowns
# Since we render dynamically, we can just compute it in the component.
compute_wis = """  const reworkCount = kpiRecords.filter(r => r.type !== 'Normal').length;"""
new_compute_wis = """  const reworkCount = kpiRecords.filter(r => r.type !== 'Normal').length;
  
  // Get unique WIs from the current dataset for dropdowns
  const uniqueWIs = Array.from(new Set(records.map(r => r.wi))).sort();"""

text = text.replace(compute_wis, new_compute_wis)

# Add KPI W/I Filter UI
kpi_ui = """              <option value="E">E - Safety Control</option>
            </select>
          </div>"""
new_kpi_ui = """              <option value="E">E - Safety Control</option>
            </select>
            <select 
              value={kpiWIFilter} 
              onChange={(e) => setKpiWIFilter(e.target.value)}
              className="border border-indigo-200 text-indigo-700 bg-indigo-50/50 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">รวมทุก W/I</option>
              {uniqueWIs.map(wi => <option key={wi} value={wi}>{wi}</option>)}
            </select>
          </div>"""

text = text.replace(kpi_ui, new_kpi_ui)

# Add Table W/I Filter UI
table_ui = """                  {selectedDept === 'Production' || selectedDept === 'ALL' ? (
                    <option value="นายสมศักดิ์ มั่นคง">นายสมศักดิ์ มั่นคง</option>
                  ) : null}
                </select>
              </div>
            </div>
          )}"""
new_table_ui = """                  {selectedDept === 'Production' || selectedDept === 'ALL' ? (
                    <option value="นายสมศักดิ์ มั่นคง">นายสมศักดิ์ มั่นคง</option>
                  ) : null}
                </select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-slate-600">กรอง W/I:</span>
                <select 
                  value={selectedWI}
                  onChange={e => setSelectedWI(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 font-bold outline-none bg-white text-indigo-700 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ALL">ทุก W/I</option>
                  {uniqueWIs.map(wi => <option key={wi} value={wi}>{wi}</option>)}
                </select>
              </div>
            </div>
          )}"""

text = text.replace(table_ui, new_table_ui)

with io.open("src/pages/WorkingRecord.tsx", "w", encoding="utf-8") as f:
    f.write(text)

