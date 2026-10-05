import io

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('import { BookOpen, Search, Calendar, Edit, CheckCircle, Plus, Send, XCircle, Save, X, ArrowRight, User, ClipboardList, CheckSquare } from \'lucide-react\';', 'import { BookOpen, Search, Calendar, Edit, CheckCircle, Plus, Send, XCircle, Save, X, ArrowRight, User, ClipboardList, CheckSquare, AlertCircle } from \'lucide-react\';')

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)
