import io

with io.open("src/pages/SkillEvaluation.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

lines[0] = "import React, { useState } from 'react';\n"

with io.open("src/pages/SkillEvaluation.tsx", "w", encoding="utf-8") as f:
    f.writelines(lines)
