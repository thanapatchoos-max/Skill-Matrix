import io

with io.open("src/pages/PermissionsPage.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Add missing import if needed for rendering the form actions
# Actually, wait, it already imports what it needs.

# Let's locate the CREATE NEW ROLE INLINE FORM block
start_form = text.find("{/* CREATE NEW ROLE INLINE FORM */}")
end_form = text.find("      {/* MAIN TWO-COLUMN LAYOUT:", start_form)

if start_form == -1 or end_form == -1:
    print("Markers not found")
else:
    new_form_content = """      {/* CREATE NEW ROLE INLINE FORM */}
      {isAddRoleOpen && (
        <form onSubmit={handleCreateRole} className="bg-indigo-50/60 p-5 rounded-xl border-2 border-indigo-200 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
              <Shield size={16} className="text-indigo-600" /> สร้างบทบาทใหม่ (Create Custom Role)
            </h3>
            <span className="text-xs text-indigo-700 font-medium">*กรุณากำหนดสิทธิ์การเข้าถึงให้เรียบร้อยก่อนบันทึก</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">ชื่อบทบาท (Role Name) <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="เช่น ISO Auditor, Supervisor"
                value={roleForm.name}
                onChange={e => setRoleForm({ ...roleForm, name: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold mt-1 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">รหัส (Role Code) <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="เช่น AUDITOR, SUP"
                value={roleForm.code}
                onChange={e => setRoleForm({ ...roleForm, code: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold uppercase mt-1 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">คำอธิบายขอบเขตการทำงาน (Description)</label>
              <input
                type="text"
                placeholder="รายละเอียดสิทธิ์อย่างย่อ..."
                value={roleForm.description}
                onChange={e => setRoleForm({ ...roleForm, description: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-medium mt-1 text-slate-800"
              />
            </div>
          </div>
          
          {/* PERMISSIONS SELECTOR FOR CREATION */}
          <div className="mt-4 bg-white border border-indigo-200 rounded-xl p-4 max-h-[400px] overflow-y-auto space-y-4 shadow-inner">
            <h4 className="text-sm font-bold text-indigo-900 border-b border-indigo-100 pb-2 mb-2 sticky top-0 bg-white z-10">กำหนดสิทธิ์การใช้งาน (Permissions)</h4>
            {pagePermissionSchema.map(page => {
              return (
                <div key={`create-${page.pageId}`} className="bg-slate-50/60 rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">{page.pageName}</h3>
                      <p className="text-[11px] text-slate-500">{page.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const nextPerms = { ...roleForm.permissions };
                          page.actions.forEach(a => nextPerms[a.key] = true);
                          setRoleForm({ ...roleForm, permissions: nextPerms });
                        }}
                        className="text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded border border-indigo-200 transition-colors"
                      >
                        เลือกทั้งหมด
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const nextPerms = { ...roleForm.permissions };
                          page.actions.forEach(a => nextPerms[a.key] = false);
                          setRoleForm({ ...roleForm, permissions: nextPerms });
                        }}
                        className="text-[10px] font-bold text-slate-500 bg-white hover:bg-slate-100 px-2 py-1 rounded border border-slate-200 transition-colors"
                      >
                        ยกเลิกทั้งหมด
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                    {page.actions.map(action => {
                      const isChecked = roleForm.permissions[action.key] ?? false;
                      const actionBadgeStyle = 
                        action.shortCode === 'create' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                        action.shortCode === 'view' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                        action.shortCode === 'edit' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                        action.shortCode === 'delete' ? 'text-red-700 bg-red-50 border-red-200' :
                        action.shortCode === 'export' ? 'text-purple-700 bg-purple-50 border-purple-200' :
                        'text-indigo-700 bg-indigo-50 border-indigo-200';

                      return (
                        <label
                          key={`create-${action.key}`}
                          className={`p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-white border-indigo-400 shadow-xs ring-1 ring-indigo-200'
                              : 'bg-slate-100/70 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setRoleForm({
                                  ...roleForm,
                                  permissions: { ...roleForm.permissions, [action.key]: !isChecked }
                                });
                              }}
                              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                            />
                            <span className="text-xs font-semibold text-slate-800">{action.label}</span>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${actionBadgeStyle}`}>
                            {action.shortCode.toUpperCase()}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-indigo-200 mt-4">
            <button
              type="button"
              onClick={() => setIsAddRoleOpen(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
            >
              บันทึกสร้าง Role ใหม่
            </button>
          </div>
        </form>
      )}

"""
    new_text = text[:start_form] + new_form_content + text[end_form:]
    
    # We also need to update handleCreateRole so it uses roleForm.permissions!
    old_handle = """    const newRole: PermissionRole = {
      id: `role-${Date.now()}`,
      name: roleForm.name,
      code: roleForm.code.toUpperCase(),
      description: roleForm.description || 'ไม่มีคำอธิบาย',
      userCount: 0,
      isSystemRole: false,
      permissions: pagePermissionSchema.reduce((acc, p) => {
        p.actions.forEach(a => acc[a.key] = (a.shortCode === 'view'));
        return acc;
      }, {} as Record<string, boolean>)
    };"""
    new_handle = """    const newRole: PermissionRole = {
      id: `role-${Date.now()}`,
      name: roleForm.name,
      code: roleForm.code.toUpperCase(),
      description: roleForm.description || 'ไม่มีคำอธิบาย',
      userCount: 0,
      isSystemRole: false,
      permissions: { ...roleForm.permissions }
    };"""
    # Note: text contains Thai characters that might have gotten mangled in powershell earlier, so I'll just use regex or robust replacement.
    import re
    # We can match `permissions: pagePermissionSchema.reduce(...)`
    new_text = re.sub(r'permissions:\s*pagePermissionSchema\.reduce\([\s\S]*?\} as Record<string, boolean>\)', 'permissions: { ...roleForm.permissions }', new_text)

    # We also need to reset `roleForm.permissions` after save.
    old_reset = "setRoleForm({ name: '', code: '', description: '' });"
    new_reset = """setRoleForm({ name: '', code: '', description: '', permissions: pagePermissionSchema.reduce((acc, p) => {
        p.actions.forEach(a => acc[a.key] = (a.shortCode === 'view'));
        return acc;
      }, {} as Record<string, boolean>) });"""
    new_text = new_text.replace(old_reset, new_reset)

    with io.open("src/pages/PermissionsPage.tsx", "w", encoding="utf-8") as f:
        f.write(new_text)
    print("Permissions form updated successfully")
