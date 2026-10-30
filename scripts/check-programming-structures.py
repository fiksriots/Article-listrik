"""Exercise the algorithms in the lessons, including empty data and duplicates."""
import contextlib
import io
import itertools
import json
from pathlib import Path
import runpy
import tempfile

root = Path(__file__).resolve().parents[1]
lessons = json.loads((root / 'lib/programming-data-structure-lessons.json').read_text())
assert len(lessons) == 12
namespaces = {}
with tempfile.TemporaryDirectory() as folder:
    for lesson in lessons:
        source = Path(folder) / (lesson['slug'] + '.py')
        source.write_text(lesson['blocks'][0]['code'], encoding='utf-8')
        with contextlib.redirect_stdout(io.StringIO()):
            namespaces[lesson['slug']] = runpy.run_path(str(source))

binary = namespaces['struktur-binary-search']['cari_biner']
sort = namespaces['struktur-insertion-sort']['insertion_sort']
cases = 0
for size in range(5):
    for values in itertools.product([-1, 0, 1], repeat=size):
        original = list(values)
        ordered = sort(original)
        assert ordered == sorted(values)
        assert original == list(values), 'sorting must preserve the input list'
        for target in [-2, -1, 0, 1, 2]:
            index = binary(ordered, target)
            if target in ordered:
                assert index is not None and ordered[index] == target
            else:
                assert index is None
        cases += 1

prepend = namespaces['struktur-linked-list']['tambah_depan']
head = prepend(None, 'B')
new_head = prepend(head, 'A')
assert new_head['berikut'] is head
assert head['berikut'] is None

graph = namespaces['struktur-graph']
assert graph['visited'] == set(graph['graph'])
assert len(graph['antrean']) == 0

selection = namespaces['struktur-pemilihan']
assert not selection['antrean'] and not selection['menunggu']
assert selection['selesai'] == {'T1': 1, 'T2': 1}
assert selection['jadwalkan']('T1') is True, 'served IDs may be scheduled again'
assert selection['jadwalkan']('T1') is False, 'waiting IDs cannot be duplicated'
assert list(selection['antrean']) == ['T1']
assert selection['menunggu'] == {'T1'}
print(f'PASS: 12 lessons, {cases} sorting/search cases, linked references, BFS visitation, and queue/set consistency')
