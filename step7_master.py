import io

# ========= MasterData.tsx: Add userRole =========
with io.open("src/pages/MasterData.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Find the export function
text = text.replace("export function MasterData()", "export function MasterData({ userRole = 'admin' }: { userRole?: string })")
text = text.replace("export default function MasterData()", "export default function MasterData({ userRole = 'admin' }: { userRole?: string })")

with io.open("src/pages/MasterData.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("MasterData.tsx updated")
