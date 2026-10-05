import io

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('import { BookOpen, Search, Filter, Calendar, Edit, CheckCircle, Plus, Send, XCircle, AlertCircle, Save, X, ArrowRight, User } from \'lucide-react\';', 'import { BookOpen, Search, Filter, Calendar, Edit, CheckCircle, Plus, Send, XCircle, AlertCircle, Save, X, ArrowRight, User, FileText } from \'lucide-react\';')

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)
