"""Verify extracted practice sources and Python flows; Docker/Actions require their own runners."""
import ast
from concurrent.futures import ThreadPoolExecutor
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import tomllib
from zipfile import ZipFile
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
lessons=json.loads((ROOT/'lib/programming-practice-lessons.json').read_text())
quizzes=json.loads((ROOT/'lib/programming-quizzes.json').read_text())
order=json.loads((ROOT/'lib/programming-order.json').read_text())
assert len(lessons)==27
for prefix,start in [('Pengujian & Debugging ·',0),('Proyek & Otomasi ·',9),('Rekayasa & Deployment ·',18)]:
    assert [l['slug'] for l in lessons[start:start+9]]==[s for g in order if g['title'].startswith(prefix) for s in g['slugs'] if s in {l['slug'] for l in lessons}]
for l in lessons:
    assert len(l['explain'])>=4 and len(l['practice'])>=2 and l['warning'] and l['check'] and l['answer']
    assert all(len(row)==len(l['table']['headers']) for row in l['table']['rows'])
    assert len(quizzes[l['slug']])==4
    for q in quizzes[l['slug']]:assert len(q['options'])==len(set(q['options']))==3 and 0<=q['answer']<3 and q['explanation']
    for b in l['blocks']:
        assert b['code']==(ROOT/'examples/practice-lab'/b['filename']).read_text()
        if b['language']=='python':ast.parse(b['code'])
    if l['diagram']:ET.parse(ROOT/'public/programming'/(l['diagram']+'.svg'))
with tempfile.TemporaryDirectory() as folder:
    with ZipFile(ROOT/'public/programming/lab/practice/practice-lab.zip') as archive:
        names=archive.namelist();assert len(names)==len(set(names))==45
        for name in names:
            p=Path(name)
            assert name.startswith('practice-lab/') and not p.is_absolute() and '..' not in p.parts
            assert not any(part in {'.venv','__pycache__','.pytest_cache','build','dist','hasil','.git'} or part.endswith('.egg-info') for part in p.parts)
            assert p.suffix!='.pyc' and p.name!='.env'
            assert archive.read(name)==(ROOT/'examples'/name).read_bytes()
        archive.extractall(folder)
    project=Path(folder)/'practice-lab'
    env=dict(os.environ,PYTHONPATH=str(project/'src'),PYTEST_DISABLE_PLUGIN_AUTOLOAD='1')
    result=subprocess.run([sys.executable,'-c','import praktik_layanan;print(praktik_layanan.__file__)'],cwd=project,env=env,text=True,capture_output=True,timeout=10)
    assert str(project/'src') in result.stdout
    def check(l):
        b=l['blocks'][0]
        if b['language']!='python' or b['filename'].startswith('tests/'):return
        with tempfile.TemporaryDirectory() as work:
            result=subprocess.run([sys.executable,str(project/b['filename'])],cwd=work,env=env,text=True,capture_output=True,timeout=15)
            assert result.returncode==0,(l['slug'],result.stderr)
            assert result.stdout.strip()==b['output'].strip(),(l['slug'],result.stdout,b['output'])
    with ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(check,lessons))
    result=subprocess.run([sys.executable,'-m','pytest','-q'],cwd=project,env=env,text=True,capture_output=True,timeout=30)
    assert result.returncode==0,result.stdout+result.stderr
    assert '43 passed' in result.stdout
    metadata=tomllib.loads((project/'pyproject.toml').read_text())
    assert metadata['project']['version']=='0.1.0'
    assert metadata['project']['scripts']['praktik-layanan']=='praktik_layanan.cli:main'
    docker=(project/'Dockerfile').read_text();assert 'USER 10001:10001' in docker and '--host' in docker
    workflow=(project/'.github/workflows/lab.yml').read_text();assert 'python -m pytest -q' in workflow and 'docker build' in workflow
print('PASS: 27 ordered lessons / 108 questions; 45-file ZIP; 18 exact Python example outputs; 43 pytest cases; package metadata and 4 diagrams')
print('Docker and GitHub Actions configurations supplied; no container build or cloud workflow execution claimed by this check.')
