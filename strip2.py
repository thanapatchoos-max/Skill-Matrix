import io
with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

out = []
skip = False
for line in lines:
    if "{!isFormOpen && (" in line:
        skip = True
        continue
    if skip and ")}    " in line or (skip and line.strip() == ")}"):
        skip = False
        continue
    if skip:
        continue
    out.append(line)

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.writelines(out)
