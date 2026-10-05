import io
import re

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Change from 3-columns to 1-column stack
old_grid = '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">'
new_grid = '<div className="flex flex-col gap-6">'

text = text.replace(old_grid, new_grid)

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)

