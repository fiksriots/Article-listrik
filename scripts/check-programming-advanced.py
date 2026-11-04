"""Check extracted advanced examples and API; browser runner is a separate exercise."""
import ast
import json
import os
from pathlib import Path
import pstats
import re
import subprocess
import sys
import tempfile
from zipfile import ZipFile
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
lessons=json.loads((ROOT/'lib/programming-advanced-lessons.json').read_text())
quizzes=json.loads((ROOT/'lib/programming-quizzes.json').read_text())
order=json.loads((ROOT/'lib/programming-order.json').read_text())
assert len(lessons)==15
slugs={l['slug'] for l in lessons}
assert [l['slug'] for l in lessons]==[s for g in order for s in g['slugs'] if s in slugs]
for l in lessons:
    assert len(l['explain'])>=4 and len(l['practice'])>=2 and l['warning'] and l['answer']
    assert len(quizzes[l['slug']])==4
    for q in quizzes[l['slug']]:assert len(q['options'])==len(set(q['options']))==3 and 0<=q['answer']<3 and q['explanation']
    assert all(len(row)==len(l['table']['headers']) for row in l['table']['rows'])
    for b in l['blocks']:
        assert b['code']==(ROOT/'examples/advanced-programming-lab'/b['filename']).read_text()
        if b['language']=='python':ast.parse(b['code'])
    if l['diagram']:ET.parse(ROOT/'public/programming'/f"{l['diagram']}.svg")
assert (ROOT/'examples/advanced-programming-lab/web/index.html').read_bytes()==(ROOT/'public/programming/lab/advanced/index.html').read_bytes()
with tempfile.TemporaryDirectory() as temp:
    with ZipFile(ROOT/'public/programming/lab/advanced/advanced-programming-lab.zip') as z:
        names=z.namelist();assert len(names)==len(set(names))==25,len(names)
        for n in names:
            p=Path(n);assert n.startswith('advanced-programming-lab/') and not p.is_absolute() and '..' not in p.parts
            assert not {'.venv','__pycache__','node_modules','hasil-latihan','.mypy_cache'}.intersection(p.parts)
            assert z.read(n)==(ROOT/'examples'/n).read_bytes()
        z.extractall(temp)
    lab=Path(temp)/'advanced-programming-lab'
    for l in lessons:
        b=l['blocks'][0]
        if b['language']!='python':
            result=subprocess.run(['node','--check',str(lab/b['filename'])],capture_output=True,text=True,timeout=10)
            assert result.returncode==0,result.stderr
            continue
        with tempfile.TemporaryDirectory() as work:
            result=subprocess.run([sys.executable,str(lab/b['filename'])],cwd=work,capture_output=True,text=True,timeout=15)
            assert result.returncode==0,(l['slug'],result.stderr)
            if b.get('measurement'):
                lines=result.stdout.strip().splitlines()
                assert lines[0]=='Permintaan/berhasil: 12 12' and len(lines)==4
                p50=float(lines[1].split(': ')[1]);p95=float(lines[2].split(': ')[1]);assert 0<=p50<=p95
            else:assert result.stdout.strip()==b['output'].strip(),(l['slug'],result.stdout)
            if b['filename']=='a12_profile.py':assert pstats.Stats(str(Path(work)/'hasil-latihan/profil.prof')).total_calls>0
    result=subprocess.run([sys.executable,'-m','unittest','test_lab.py','-v'],cwd=lab,capture_output=True,text=True,timeout=30)
    assert result.returncode==0,result.stdout+result.stderr
    assert 'Ran 15 tests' in result.stderr
    for file in ['playwright.config.cjs']:
        result=subprocess.run(['node','--check',str(lab/file)],capture_output=True,text=True,timeout=10);assert result.returncode==0,result.stderr
    html=(lab/'web/index.html').read_text();js=re.search(r'<script>(.*?)</script>',html,re.S).group(1)
    script=Path(temp)/'frontend.js';script.write_text(js)
    assert subprocess.run(['node','--check',str(script)],capture_output=True).returncode==0
    if os.environ.get('ADV_MYPY_PYTHON'):
        python=os.environ['ADV_MYPY_PYTHON']
        for file,expected in [('a06_typing.py',0),('fixtures/bad_types.py',1)]:
            result=subprocess.run([python,'-m','mypy','--config-file',str(lab/'mypy.ini'),str(lab/file)],capture_output=True,text=True,timeout=30)
            assert result.returncode==expected,result.stdout+result.stderr
            if expected:assert '[assignment]' in result.stdout and 'import-not-found' not in result.stdout
print('PASS: 15 advanced lessons / 60 questions; 25-file ZIP; 13 runnable Python examples; 15 algorithm/cache/worker/HTTP tests; JavaScript syntax (browser runner not executed)')
