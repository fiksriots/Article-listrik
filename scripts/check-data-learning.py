"""Verify two data paths and the exact downloadable examples in isolation."""
import ast
from concurrent.futures import ThreadPoolExecutor
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
from zipfile import ZipFile
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
analysis=json.loads((ROOT/'lib/programming-data-analysis-lessons.json').read_text())
science=json.loads((ROOT/'lib/programming-data-science-lessons.json').read_text())
quizzes=json.loads((ROOT/'lib/programming-quizzes.json').read_text())
order=json.loads((ROOT/'lib/programming-order.json').read_text())
assert len(analysis)==len(science)==12
for prefix,lessons in [('Data Analysis ·',analysis),('Data Science ·',science)]:
    assert [l['slug'] for l in lessons]==[s for g in order if g['title'].startswith(prefix) for s in g['slugs']]
for l in analysis+science:
    assert len(l['explain'])>=3 and len(l['steps'])>=3 and len(l['practice'])>=2
    assert l['warning'] and l['check'] and l['answer']
    assert all(len(row)==len(l['table']['headers']) for row in l['table']['rows'])
    assert len(quizzes[l['slug']])==4
    for q in quizzes[l['slug']]:
        assert len(q['options'])==len(set(q['options']))==3 and 0<=q['answer']<3 and q['explanation']
    for b in l['blocks']:
        ast.parse(b['code'])
        assert b['language']=='python'
        assert b['code']==(ROOT/'examples/data-lab'/b['filename']).read_text()
    if l['diagram']:ET.parse(ROOT/'public/programming'/f"{l['diagram']}.svg")

with tempfile.TemporaryDirectory(prefix='data-learning-') as temp:
    with ZipFile(ROOT/'public/programming/lab/data/data-lab.zip') as z:
        assert len(z.namelist())==len(set(z.namelist()))==31
        for n in z.namelist():
            p=Path(n);assert not p.is_absolute() and '..' not in p.parts and n.startswith('data-lab/')
            assert not any(x in {'.venv','__pycache__','hasil-latihan'} for x in p.parts) and p.suffix!='.pyc'
            assert z.read(n)==(ROOT/'examples'/n).read_bytes()
        z.extractall(temp)
    project=Path(temp)/'data-lab'
    def run_example(l):
        b=l['blocks'][0]
        with tempfile.TemporaryDirectory() as work:
            env=dict(os.environ,OMP_NUM_THREADS='1',OPENBLAS_NUM_THREADS='1',MKL_NUM_THREADS='1',MPLCONFIGDIR=work+'/mpl')
            result=subprocess.run([sys.executable,str(project/b['filename'])],cwd=work,env=env,capture_output=True,text=True,timeout=60)
            assert result.returncode==0,(l['slug'],result.stderr)
            assert result.stdout.strip()==b['output'].strip(),(l['slug'],result.stdout,b['output'])
    with ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(run_example,analysis+science))
    env=dict(os.environ,OMP_NUM_THREADS='1',OPENBLAS_NUM_THREADS='1',MKL_NUM_THREADS='1',MPLCONFIGDIR=temp+'/test-mpl')
    result=subprocess.run([sys.executable,'-m','unittest','test_lab.py','-v'],cwd=project,env=env,capture_output=True,text=True,timeout=60)
    assert result.returncode==0,result.stdout+result.stderr
    assert 'Ran 12 tests' in result.stderr and 'OK' in result.stderr
print('PASS: 24 ordered lessons / 96 questions; 31-file source ZIP; all extracted programs match outputs; 12 independent data/model/artifact tests; diagrams parse')
