import io
import re

# ========== 1. App.tsx: Pass userRole to all pages ==========
with io.open("src/App.tsx", "r", encoding="utf-8") as f:
    app = f.read()

# Pages missing userRole
app = app.replace("<Approvals />", "<Approvals userRole={userRole} />")
app = app.replace("<EmployeeManagement />", "<EmployeeManagement userRole={userRole} />")
app = app.replace("<MasterData />", "<MasterData userRole={userRole} />")
app = app.replace("<Reports />", "<Reports userRole={userRole} />")

with io.open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(app)
print("App.tsx updated")
