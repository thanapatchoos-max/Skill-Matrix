import io

with io.open("src/pages/PermissionsPage.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("shortCode: 'manage'", "shortCode: 'edit'")

with io.open("src/pages/PermissionsPage.tsx", "w", encoding="utf-8") as f:
    f.write(text)

