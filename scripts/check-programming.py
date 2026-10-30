"""Run lesson examples and test the cashier rules with independent expected values."""
import ast
import contextlib
import io
import json
from pathlib import Path
from unittest.mock import patch

root = Path(__file__).resolve().parents[1]
lessons = json.loads((root / 'lib/programming-lessons.json').read_text())
assert len({lesson['slug'] for lesson in lessons}) == len(lessons)

for lesson in lessons:
    table = lesson['table']
    assert all(len(row) == len(table['headers']) for row in table['rows'])
    if lesson['diagram']:
        assert (root / 'public/programming' / (lesson['diagram'] + '.svg')).exists()
    for block in lesson['blocks']:
        if block.get('language') == 'text':
            continue
        code = block['code']
        ast.parse(code)
        output = io.StringIO()

        def example_input(prompt):
            value = 'abc' if lesson['slug'] == 'kesalahan-validasi' else '3'
            print(prompt + value)
            return value

        with contextlib.redirect_stdout(output), patch('builtins.input', example_input):
            exec(compile(code, lesson['slug'], 'exec'), {})
        assert output.getvalue().strip() == block['output'].strip(), lesson['slug']

cashier = lessons[-1]['blocks'][0]['code']
namespace = {}
with contextlib.redirect_stdout(io.StringIO()):
    exec(cashier, namespace)
for prices, subtotal, discount, total in [
    ([], 0, 0, 0),
    ([99999], 99999, 0, 99999),
    ([100000], 100000, 10000, 90000),
    ([100001], 100001, 10000, 90001),
    ([20000, 35000, 50000], 105000, 10500, 94500),
]:
    actual_subtotal = namespace['hitung_subtotal'](prices)
    actual_discount = namespace['hitung_diskon'](actual_subtotal)
    assert (actual_subtotal, actual_discount, actual_subtotal-actual_discount) == (subtotal, discount, total)

validation = next(l for l in lessons if l['slug'] == 'kesalahan-validasi')['blocks'][0]['code']
for value, expected in [('abc', 'Masukkan bilangan bulat'), ('-2', 'Jumlah minimal 1.'), ('0', 'Jumlah minimal 1.'), ('3', 'Total: 30000')]:
    output = io.StringIO()
    with contextlib.redirect_stdout(output), patch('builtins.input', return_value=value):
        exec(validation, {})
    assert expected in output.getvalue(), value

print(f'PASS: {len(lessons)} lessons, executable examples, expected outputs, input validation, and cashier boundary cases')
