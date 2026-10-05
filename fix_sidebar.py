import io
with io.open("src/components/Sidebar.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Add roles
roles_def_old = """  const isStaff = userRole === 'staff';
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager';
  const isAdmin = userRole === 'admin' || !userRole;"""

roles_def_new = """  const isStaff = userRole === 'staff';
  const isClerk = userRole === 'clerk';
  const isChief = userRole === 'chief';
  const isManager = userRole === 'manager';
  const isViewer = userRole === 'viewer';
  const isAdmin = userRole === 'admin' || !userRole;"""

text = text.replace(roles_def_old, roles_def_new)

# Modify Training menu to Training Management
text = text.replace('label="ประเมินทักษะ & OJT"', 'label="Training Management"')

# Insert Skill Evaluation menu after Training
eval_menu = """
        {/* Skill Evaluation (Admin, Chief) */}
        {(isAdmin || isChief) && (
          <NavItem icon={Award} label="Skill Evaluation" active={currentPage === 'evaluation'} onClick={() => setCurrentPage('evaluation')} />
        )}
"""
if "label=\"Skill Evaluation\"" not in text:
    text = text.replace("        {/* Reports (Admin, Manager) */}", eval_menu + "\n        {/* Reports (Admin, Manager) */}")

# Add icon import
if "Award" not in text:
    text = text.replace("BookOpen, Home, ClipboardList, Activity", "BookOpen, Home, ClipboardList, Activity, Award")

with io.open("src/components/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(text)

