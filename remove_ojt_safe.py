import io
import re

with io.open("src/pages/IndividualSkillMatrix.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "{/* OJT ASSESSMENT HISTORY LOG TABLE" in line:
        start_idx = i
        break

end_idx = -1
if start_idx != -1:
    for i in range(start_idx, len(lines)):
        if "  );\n" == lines[i] and "}\n" == lines[i+1]:
            # The closing </div> of the main container is at i-1
            # We want to remove from start_idx up to i-2
            end_idx = i - 1
            break

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + lines[end_idx:]
    with io.open("src/pages/IndividualSkillMatrix.tsx", "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print("Successfully removed OJT table safely.")
else:
    print("Failed to find boundaries.")
