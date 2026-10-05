import io

with io.open("src/pages/Approvals.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('ojtRef: ', 'refCode: ')
text = text.replace('ref: ', 'refCode: ')
text = text.replace('{req.ref || req.ojtRef}', '{req.refCode}')

with io.open("src/pages/Approvals.tsx", "w", encoding="utf-8") as f:
    f.write(text)
