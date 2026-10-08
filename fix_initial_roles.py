import io

with io.open("src/pages/PermissionsPage.tsx", "r", encoding="utf-8") as f:
    text = f.read()

bad_str = """    permissions: { ...roleForm.permissions }
  },
  {
    id: 'role-manager',"""

good_str = """    permissions: pagePermissionSchema.reduce((acc, p) => {
      p.actions.forEach(a => acc[a.key] = true);
      return acc;
    }, {} as Record<string, boolean>)
  },
  {
    id: 'role-manager',"""

text = text.replace(bad_str, good_str)

with io.open("src/pages/PermissionsPage.tsx", "w", encoding="utf-8") as f:
    f.write(text)
