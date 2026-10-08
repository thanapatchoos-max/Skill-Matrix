import io

# ========= App.tsx: Pass userRole to Dashboard + StaffDashboard =========
with io.open("src/App.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Dashboard and StaffDashboard need userRole too
text = text.replace("<Dashboard />", "<Dashboard userRole={userRole} />")
text = text.replace("<StaffDashboard onNavigatePage", "<StaffDashboard userRole={userRole} onNavigatePage")

with io.open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("App.tsx finalized")
