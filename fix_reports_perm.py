import io
import re

with io.open("src/pages/PermissionsPage.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# I will insert page_reports before page_settings

new_reports = """  {
    pageId: 'page_reports',
    pageName: '13. รายงาน (Reports)',
    description: 'ออกรายงานสถิติแบบ Excel และ PDF',
    actions: [
      { key: 'reports_view', label: 'ดูรายงาน (View)', shortCode: 'view' },
      { key: 'reports_export', label: 'Export ข้อมูล (Export)', shortCode: 'export' },
    ]
  },
  {
    pageId: 'page_settings',
    pageName: '14. ตั้งค่าระบบ (Settings & Permissions)"""

text = text.replace("""  {
    pageId: 'page_settings',
    pageName: '13. ตั้งค่าระบบ (Settings & Permissions)""", new_reports)

manager_perms = """      master_view: true, master_manage: false,
      settings_view: false,"""
new_manager_perms = """      master_view: true, master_manage: false,
      reports_view: true, reports_export: true,
      settings_view: false,"""
text = text.replace(manager_perms, new_manager_perms)

chief_perms = """      master_view: true, master_manage: true,
      settings_view: false,"""
new_chief_perms = """      master_view: true, master_manage: true,
      reports_view: true, reports_export: true,
      settings_view: false,"""
text = text.replace(chief_perms, new_chief_perms)

staff_perms = """      master_view: false, master_manage: false,
      settings_view: false,"""
new_staff_perms = """      master_view: false, master_manage: false,
      reports_view: false, reports_export: false,
      settings_view: false,"""
text = text.replace(staff_perms, new_staff_perms)

with io.open("src/pages/PermissionsPage.tsx", "w", encoding="utf-8") as f:
    f.write(text)

