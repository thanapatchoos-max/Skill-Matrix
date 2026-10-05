import io

with io.open("src/pages/SkillEvaluation.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('Target: <{ev.reworkTarget}%', 'Target: &lt;{ev.reworkTarget}%')

with io.open("src/pages/SkillEvaluation.tsx", "w", encoding="utf-8") as f:
    f.write(text)
