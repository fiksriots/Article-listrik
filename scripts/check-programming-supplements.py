"""Verify new examples against results and independent boundary cases."""
import ast
from decimal import Decimal
from html.parser import HTMLParser
import importlib.util
from itertools import product
import json
import re
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
EX = ROOT / 'examples/programming-supplements'
WEB = ROOT / 'public/programming/lab/web'
lessons = json.loads((ROOT / 'lib/programming-supplement-lessons.json').read_text())
quizzes = json.loads((ROOT / 'lib/programming-quizzes.json').read_text())
assert len(lessons) == 14
for l in lessons:
    assert len(l['explain']) >= 3 and len(l['practice']) >= 2 and len(l['steps']) >= 3
    assert l['check'] and l['answer'] and l['warning'] and l['source'].startswith('https://')
    assert all(len(row) == len(l['table']['headers']) for row in l['table']['rows'])
    assert len(quizzes[l['slug']]) == 4
    for q in quizzes[l['slug']]:
        assert len(q['options']) == len(set(q['options'])) == 3
        assert 0 <= q['answer'] < 3 and q['explanation']
    for b in l['blocks']:
        if b['language'] == 'python':
            ast.parse(b['code'])
        f = EX / b['filename']
        if f.is_file():
            assert f.read_text() == b['code']
            args = [sys.executable, str(f)]
            if f.name == 'python_cli.py':
                args += ['--nama', 'Router lab', '--jumlah', '3']
            with tempfile.TemporaryDirectory() as folder:
                result = subprocess.run(args, cwd=folder, capture_output=True, text=True)
            assert result.returncode == 0, result.stderr
            assert result.stdout.strip() == b['output'].strip(), (l['slug'], result.stdout)

def module(name):
    spec = importlib.util.spec_from_file_location(name, EX / (name + '.py'))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m

def rejects(call):
    try:
        call()
    except ValueError:
        return
    raise AssertionError('Expected ValueError')

money = module('python_desimal')
assert money.total_baris('12.345', 2) == Decimal('24.70')
assert money.nilai_uang('0') == Decimal('0.00')
for value in ['NaN', 'Infinity', '-1', '1000000001', '', 'abc', 0.1]:
    rejects(lambda: money.nilai_uang(value))
for count in [0, 1001, True, 1.5]:
    rejects(lambda: money.total_baris('1.00', count))
for args in [[], ['--nama', 'A', '--jumlah', '0'], ['--nama', 'A', '--jumlah', 'abc'], ['--nama', '   ']]:
    p = subprocess.run([sys.executable, str(EX / 'python_cli.py'), *args], capture_output=True, text=True)
    assert p.returncode == 2 and p.stderr
p = subprocess.run([sys.executable, str(EX / 'python_cli.py'), '--help'], capture_output=True, text=True)
assert p.returncode == 0 and '--jumlah' in p.stdout

prefix = module('struktur_prefix')
window = module('struktur_window')
for n in range(5):
    for values in product([-2, 0, 3], repeat=n):
        data = list(values)
        sums = prefix.buat_prefix(data)
        for l in range(n + 1):
            for h in range(l, n + 1):
                assert prefix.jumlah_rentang(sums, l, h) == sum(data[l:h])
        for k in range(1, n + 1):
            brute = [(i, sum(data[i:i+k])) for i in range(n-k+1)]
            expected = max(brute, key=lambda item: item[1])
            assert window.maksimum_jendela(data, k) == expected
rejects(lambda: prefix.jumlah_rentang([0], -1, 0))
rejects(lambda: window.maksimum_jendela([], 1))
rejects(lambda: window.maksimum_jendela([1], True))
protocol = module('oop_protocol')
class Bad:
    def __init__(self, value): self.value = value
    def baca(self): return self.value
for v in [True, '28', float('nan'), float('inf')]:
    rejects(lambda: protocol.laporan(Bad(v)))
context = module('oop_context')
manager = context.CatatanSementara()
try:
    with manager as buffer:
        raise RuntimeError('latihan')
except RuntimeError:
    pass
else:
    raise AssertionError('Exception was suppressed')
assert buffer.closed
save = module('db_savepoint')
con = sqlite3.connect(':memory:', isolation_level=None)
try:
    con.execute('CREATE TABLE stok(kode TEXT PRIMARY KEY, jumlah INTEGER CHECK(jumlah>=0))')
    assert save.impor_baris(con, [('A', 2), ('A', 3), ('B', -1)]) == ['A', 'B']
    assert con.execute('SELECT * FROM stok').fetchall() == [('A', 2)]
    try:
        save.impor_baris(con, [('C', 3), ('broken',)])
    except ValueError:
        pass
    else:
        raise AssertionError('Expected malformed row failure')
    assert con.execute('SELECT * FROM stok').fetchall() == [('A', 2)]
finally:
    con.close()
from fastapi.testclient import TestClient
etag = module('api_etag')
with TestClient(etag.create_app()) as c:
    tag = c.get('/katalog').headers['etag']
    for header in [tag, 'W/' + tag, '*', '"lama", W/' + tag]:
        r = c.get('/katalog', headers={'If-None-Match': header})
        assert r.status_code == 304 and r.content == b''
    assert c.get('/katalog', headers={'If-None-Match': '"bukan-versi-ini"'}).status_code == 200
cursor = module('api_cursor')
with TestClient(cursor.create_app(b'a' * 32)) as c:
    for limit in [1, 2, 3]:
        seen = []; token = None
        while True:
            params = {'limit': limit}
            if token is not None: params['cursor'] = token
            response = c.get('/materi', params=params)
            assert response.status_code == 200
            body = response.json(); seen += [i['id'] for i in body['items']]
            token = body['next_cursor']
            if token is None: break
        assert seen == [1, 2, 3, 4, 5]
    token = c.get('/materi').json()['next_cursor']
    with TestClient(cursor.create_app(b'b' * 32)) as other:
        assert other.get('/materi', params={'cursor': token}).status_code == 400
    assert c.get('/materi', params={'cursor': token[:-2] + 'AA'}).status_code == 400
    assert c.get('/materi', params={'cursor': 'a' * 257}).status_code == 422
    assert c.get('/materi', params={'limit': 4}).status_code == 422

class DemoHTML(HTMLParser):
    def __init__(self): super().__init__(); self.ids=[]; self.labels=[]; self.sources=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag=='label' and 'for' in a: self.labels.append(a['for'])
        if tag=='script' and 'src' in a: self.sources.append(a['src'])
for l in lessons:
    if not l['slug'].startswith('web-'): continue
    html = next(b['code'] for b in l['blocks'] if b['language']=='html')
    assert html == (WEB / (l['slug'] + '.html')).read_text()
    for source in re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>', html):
        if source.strip():
            parsed_js = subprocess.run(['node', '--check', '--input-type=module'], input=source, text=True, capture_output=True)
            assert parsed_js.returncode == 0, parsed_js.stderr
    parsed=DemoHTML();parsed.feed(html)
    assert len(parsed.ids)==len(set(parsed.ids))
    assert set(parsed.labels)<=set(parsed.ids)
    assert all((WEB / s).is_file() for s in parsed.sources)
    for b in l['blocks']:
        if b['language']=='javascript':
            assert b['code']==(WEB / b['filename']).read_text()
            p=subprocess.run(['node','--check','--input-type=module'],input=b['code'],text=True,capture_output=True)
            assert p.returncode==0,p.stderr
code=f"import {{ringkasan}} from {json.dumps((WEB / 'web-modul-format.mjs').as_uri())}; if(ringkasan(' Router ',3)!=='Router: 3 unit') throw Error('hasil'); for(const args of [[' ',1],['A',0],['A',1.5]]) {{ let rejected=false; try{{ringkasan(...args)}}catch{{rejected=true}} if(!rejected)throw Error('validasi'); }}"
p=subprocess.run(['node','--input-type=module','-e',code],capture_output=True,text=True)
assert p.returncode==0,p.stderr
print('PASS: 14 supplements / 56 questions; exact outputs; exhaustive small prefix/window cases; CLI, Decimal, resource cleanup, savepoint rollback, conditional GET, signed cursor, module logic and HTML sources')
