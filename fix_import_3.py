import io

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("import { CheckCircle, Clock, Search, GraduationCap } from 'lucide-react';", "import { CheckCircle, Clock, Search, GraduationCap, AlertCircle } from 'lucide-react';")

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)
