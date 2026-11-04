"""Check exact lesson sources, archive, and socket behavior without external targets."""
import ast
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import subprocess
import sys
import tempfile
from zipfile import ZipFile
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
lessons=json.loads((ROOT/'lib/programming-network-lessons.json').read_text())
order=json.loads((ROOT/'lib/programming-order.json').read_text())
quizzes=json.loads((ROOT/'lib/programming-quizzes.json').read_text())
assert len(lessons)==16
assert [l['slug'] for l in lessons]==[s for g in order if g['title'].startswith('Pemrograman Jaringan ·') for s in g['slugs']]
for lesson in lessons:
    assert len(lesson['explain'])>=4 and len(lesson['practice'])>=2
    assert lesson['warning'] and lesson['check'] and lesson['answer']
    assert lesson['source'].startswith('https://docs.python.org/')
    assert all(len(row)==len(lesson['table']['headers']) for row in lesson['table']['rows'])
    assert len(quizzes[lesson['slug']])==4
    for q in quizzes[lesson['slug']]:
        assert len(q['options'])==len(set(q['options']))==3 and 0<=q['answer']<3 and q['explanation']
    for block in lesson['blocks']:
        ast.parse(block['code'])
        assert block['language']=='python'
        assert block['code']==(ROOT/'examples/network-programming-lab'/block['filename']).read_text()
    if lesson['diagram']:ET.parse(ROOT/'public/programming'/(lesson['diagram']+'.svg'))
with tempfile.TemporaryDirectory() as temp:
    with ZipFile(ROOT/'public/programming/lab/network/network-programming-lab.zip') as archive:
        names=archive.namelist()
        assert len(names)==len(set(names))==20
        for name in names:
            p=Path(name)
            assert not p.is_absolute() and '..' not in p.parts and name.startswith('network-programming-lab/')
            assert not any(x in {'.venv','__pycache__','hasil-latihan'} for x in p.parts) and p.suffix!='.pyc'
            assert archive.read(name)==(ROOT/'examples'/name).read_bytes()
        archive.extractall(temp)
    project=Path(temp)/'network-programming-lab'
    def check(lesson):
        block=lesson['blocks'][0]
        with tempfile.TemporaryDirectory() as work:
            result=subprocess.run([sys.executable,str(project/block['filename'])],cwd=work,text=True,capture_output=True,timeout=15)
            assert result.returncode==0,(lesson['slug'],result.stderr)
            assert result.stdout.strip()==block['output'].strip(),(lesson['slug'],result.stdout)
            if lesson['slug']=='netprog-kasus-monitor':
                import csv
                with (Path(work)/'hasil-latihan/cek-layanan.csv').open() as file:
                    assert list(csv.DictReader(file))==[{'layanan':'lab-aktif','hasil':'tcp_terhubung'},{'layanan':'lab-tutup','hasil':'refused'}]
    with ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(check,lessons))
    result=subprocess.run([sys.executable,'-m','unittest','test_lab.py','-v'],cwd=project,capture_output=True,text=True,timeout=15)
    assert result.returncode==0,result.stdout+result.stderr
    assert 'Ran 14 tests' in result.stderr and 'OK' in result.stderr
print('PASS: 16 ordered lessons / 64 questions; 20-file ZIP; 16 exact program outputs; 14 protocol and loopback tests; 3 diagrams')
