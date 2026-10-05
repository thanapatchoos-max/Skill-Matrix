import io

with io.open("src/pages/SkillEvaluation.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

original_lines = ['i' + lines[294][1:]] + lines[295:]

with io.open("src/pages/SkillEvaluation.tsx", "w", encoding="utf-8") as f:
    f.writelines(original_lines)

print("Restored SkillEvaluation.tsx")
