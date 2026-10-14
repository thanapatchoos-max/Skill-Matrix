from pathlib import Path
import json
import pdfplumber
from pypdf import PdfReader

root = Path('review/assessment-pdf')
checks = {
    'individual': ['EMP001', 'QCW001-001', 'QCW004-001'],
    'department-qc': ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP011', 'EMP012', 'EMP013'],
    'departments-all': ['EMP001', 'EMP008', 'EMP009', 'EMP005', 'EMP010'],
    'department-long-roster': [f'LONG-{index:03d}' for index in range(1, 61)],
}
results = []
for name, expected in checks.items():
    reader = PdfReader(root / f'{name}.pdf')
    with pdfplumber.open(root / f'{name}.pdf') as document:
        texts = [(page.extract_text(use_text_flow=True) or '').replace('\u200b', '') for page in document.pages]
        text = '\n'.join(texts)
        for identifier in expected:
            assert identifier in text, (name, identifier)
        assert 'รายงานประเมินคะแนน' in text, name
        assert 'ผู้พิจารณา' in text, name
        for index, page in enumerate(document.pages):
            assert f'หน้า {index + 1} / {len(document.pages)}' in texts[index], (name, index, 'page number')
            assert all(0 <= char['x0'] <= char['x1'] <= page.width + 1 and 0 <= char['top'] < page.height for char in page.chars if char['text'].strip()), (name, index, 'text outside page')
        if name == 'department-long-roster':
            for text in texts[1:]:
                if 'LONG-' in text:
                    assert 'Type A' in text and 'Type B' in text, 'repeated header missing'
        results.append({'file': name, 'pages': len(reader.pages), 'characters': len(text), 'verified_ids': len(expected)})
print(json.dumps(results, ensure_ascii=False))
