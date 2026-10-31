"""Verify curriculum coverage, runnable examples and case-study edge cases."""
import ast
import contextlib
import io
import json
import os
import re
from pathlib import Path
import runpy
import sys
import tempfile
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
base = json.loads((ROOT / 'lib/programming-lessons.json').read_text())
extra = json.loads((ROOT / 'lib/programming-extended-lessons.json').read_text())
structures = json.loads((ROOT / 'lib/programming-data-structure-lessons.json').read_text())
oop = json.loads((ROOT / 'lib/programming-oop-lessons.json').read_text())
order = json.loads((ROOT / 'lib/programming-order.json').read_text())
quizzes = json.loads((ROOT / 'lib/programming-quizzes.json').read_text())
slugs = [item['slug'] for item in base + extra + structures + oop]
ordered = [slug for group in order for slug in group['slugs']]
assert len(slugs) == len(set(slugs)) == len(ordered) == len(base + extra + structures + oop)
assert set(slugs) == set(ordered) == set(quizzes)
for lesson in base + extra + structures + oop:
    assert len(lesson['explain']) >= 3
    assert all(len(row) == len(lesson['table']['headers']) for row in lesson['table']['rows'])
    if lesson['diagram']:
        assert (ROOT / 'public/programming' / (lesson['diagram'] + '.svg')).exists()
    assert len(quizzes[lesson['slug']]) == 4
    for question in quizzes[lesson['slug']]:
        assert len(set(question['options'])) == len(question['options'])
        assert 0 <= question['answer'] < len(question['options'])
        assert question['explanation']
        if question.get('code'):
            ast.parse(question['code'])

previous_cwd = Path.cwd()
for lesson in extra + structures + oop:
    with tempfile.TemporaryDirectory() as temp:
        folder = Path(temp)
        # Multi-file module examples share this folder; each other lesson is isolated.
        for block in lesson['blocks']:
            if block.get('filename'):
                (folder / block['filename']).write_text(block['code'], encoding='utf-8')
        os.chdir(folder)
        sys.path.insert(0, str(folder))
        try:
            for index, block in enumerate(lesson['blocks']):
                if block.get('language') == 'text':
                    continue
                ast.parse(block['code'])
                target = folder / block.get('filename', f'example_{index}.py')
                target.write_text(block['code'], encoding='utf-8')
                values = iter(block.get('inputs', []))
                output = io.StringIO()
                def input_example(prompt):
                    value = next(values)
                    print(prompt + value)
                    return value
                with contextlib.redirect_stdout(output), patch('builtins.input', input_example):
                    runpy.run_path(str(target), run_name='__main__')
                if block.get('measurement'):
                    pattern = r'n=(1000|10000) \| list=\d+\.\d{9} \| set=\d+\.\d{9} \| peak_list=\d+ \| peak_set=\d+'
                    assert len(output.getvalue().strip().splitlines()) == 2
                    assert all(re.fullmatch(pattern, line) for line in output.getvalue().strip().splitlines())
                else:
                    assert output.getvalue().strip() == block['output'].strip(), (lesson['slug'], output.getvalue(), block['output'])
        finally:
            sys.path.pop(0)
            os.chdir(previous_cwd)

by_slug = {item['slug']: item for item in extra}
with tempfile.TemporaryDirectory() as temp:
    folder = Path(temp)
    grade_file = folder / 'nilai_siswa.py'
    grade_file.write_text(by_slug['studi-kasus-nilai-siswa']['blocks'][0]['code'])
    grade = runpy.run_path(str(grade_file))['olah_siswa']
    for score, status in [(0, 'Belum lulus'), (74, 'Belum lulus'), (75, 'Lulus'), (76, 'Lulus'), (100, 'Lulus')]:
        assert grade(' Ana ', [score]) == {'nama': 'Ana', 'rata_rata': float(score), 'status': status}
    for name, scores in [('', [80]), ('Ana', []), ('Ana', [101]), ('Ana', [-1]), ('Ana', [True]), ('Ana', ['80'])]:
        try:
            grade(name, scores)
        except ValueError:
            pass
        else:
            raise AssertionError(('Invalid student data accepted', name, scores))
    transactions_file = folder / 'pengeluaran.py'
    transactions_file.write_text(by_slug['studi-kasus-pencatat-pengeluaran']['blocks'][0]['code'])
    functions = runpy.run_path(str(transactions_file))
    location = folder / 'pengeluaran-latihan.json'
    assert functions['muat'](location) == []
    data = functions['tambah']([], ' Makan ', 15000)
    data = functions['tambah'](data, 'Transport', 10000)
    functions['simpan'](location, data)
    assert functions['muat'](location) == data
    assert sum(item['jumlah'] for item in data) == 25000
    for description, amount in [('', 1), ('Makan', 0), ('Makan', -1), ('Makan', True)]:
        before = location.read_bytes()
        try:
            functions['tambah'](data, description, amount)
        except ValueError:
            pass
        else:
            raise AssertionError('Invalid transaction accepted')
        assert location.read_bytes() == before
    for bad in ['not JSON', '{}', '[{"jumlah": 100}]']:
        location.write_text(bad)
        with contextlib.redirect_stdout(io.StringIO()) as output:
            functions['main']()
        assert 'File lama tidak ditimpa' in output.getvalue()
        assert location.read_text() == bad

print('PASS: 77 ordered lessons, 308 questions, extended example outputs, module files, student boundaries, JSON persistence and invalid-file preservation')
