"""Run the exact notebook cells in clean folders using installed dependencies."""
from concurrent.futures import ThreadPoolExecutor
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import nbformat

ROOT = Path(__file__).resolve().parents[1]
lessons = sum([json.loads((ROOT / f'lib/programming-{track}-lessons.json').read_text())
               for track in ['data-analysis', 'data-science']], [])


def check(lesson):
    path = ROOT / 'examples/colab' / (lesson['slug'] + '.ipynb')
    notebook = nbformat.read(path, as_version=4)
    nbformat.validate(notebook)
    assert all(not c.get('outputs') for c in notebook.cells)
    cells = [c.source for c in notebook.cells if c.cell_type == 'code']
    assert cells[0].startswith('%pip install')
    assert cells[2].endswith(lesson['blocks'][0]['code'])
    with tempfile.TemporaryDirectory() as folder:
        env = dict(os.environ, OPENBLAS_NUM_THREADS='1', OMP_NUM_THREADS='1', MPLCONFIGDIR=folder + '/mpl')
        result = subprocess.run([sys.executable, '-c', '\n'.join(cells[1:])],
                                cwd=folder, env=env, capture_output=True, text=True, timeout=60)
        assert result.returncode == 0, (lesson['slug'], result.stderr)
        assert lesson['blocks'][0]['output'].strip() in result.stdout, (lesson['slug'], result.stdout)
    return lesson['slug']


with ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(check, lessons))
assert len(results) == 40
print('PASS: all 40 notebooks validate and run in clean folders; article code and expected output match')
