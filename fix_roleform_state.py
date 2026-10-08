import io

with io.open("src/pages/PermissionsPage.tsx", "r", encoding="utf-8") as f:
    text = f.read()

old_state = "const [roleForm, setRoleForm] = useState({ name: '', code: '', description: '' });"
new_state = """const [roleForm, setRoleForm] = useState<{name: string, code: string, description: string, permissions: Record<string, boolean>}>({ 
    name: '', 
    code: '', 
    description: '',
    permissions: pagePermissionSchema.reduce((acc, p) => {
      p.actions.forEach(a => acc[a.key] = (a.shortCode === 'view'));
      return acc;
    }, {} as Record<string, boolean>)
  });"""

text = text.replace(old_state, new_state)

with io.open("src/pages/PermissionsPage.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Updated initial state")
