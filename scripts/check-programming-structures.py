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
assert len(lessons) == 36
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

# Depth lessons: compare results with independent standard-library references.
from collections import deque
from copy import deepcopy
from math import factorial

for n in range(9):
    assert namespaces['struktur-rekursi']['faktorial'](n) == factorial(n)
for invalid in [-1, 1.5, True]:
    try:
        namespaces['struktur-rekursi']['faktorial'](invalid)
    except ValueError:
        pass
    else:
        raise AssertionError('Invalid factorial input accepted')

ring = namespaces['struktur-deque-circular']
for capacity in range(1, 5):
    actual, reference = ring['buat_queue'](capacity), deque()
    for step in range(40):
        if step % 3:
            value = None if step % 4 == 0 else step
            before = deepcopy(actual)
            accepted = ring['masukkan'](actual, value)
            assert accepted == (len(reference) < capacity)
            if accepted:
                reference.append(value)
            else:
                assert actual == before
        elif reference:
            assert ring['keluarkan'](actual) == reference.popleft()
        else:
            try:
                ring['keluarkan'](actual)
            except IndexError:
                pass
            else:
                raise AssertionError('Empty queue accepted')
        logical = [actual['data'][(actual['head'] + i) % capacity] for i in range(actual['jumlah'])]
        assert logical == list(reference)
        assert 0 <= actual['jumlah'] <= capacity

bst = namespaces['struktur-bst']
traverse = namespaces['struktur-traversal-tree']['traversal']
for size in range(5):
    for values in itertools.product([-1, 0, 1], repeat=size):
        original = list(values)
        for algorithm in ['selection_sort', 'merge_sort']:
            assert namespaces['struktur-sort-lanjutan'][algorithm](original) == sorted(values)
            assert original == list(values)
        tree = None
        for value in values:
            tree = bst['tambah'](tree, value)
        assert traverse(tree, 'in') == sorted(set(values))
        for target in [-2, -1, 0, 1, 2]:
            assert bst['cari'](tree, target) == (target in values)
assert namespaces['struktur-traversal-tree']['level_order'](None) == []

graph = namespaces['struktur-graph-lanjutan']
assert graph['jalur_bfs'](graph['graph'], 'A', 'A') == ['A']
assert graph['jalur_bfs'](graph['graph'], 'A', 'D') == ['A', 'B', 'D']
assert graph['jalur_bfs'](graph['graph'], 'A', 'E') is None
assert graph['jalur_bfs'](graph['graph'], 'A', 'missing') is None
cyclic = {'A': ['B', 'C'], 'B': ['A', 'C'], 'C': ['A', 'B'], 'D': []}
assert set(graph['dfs'](cyclic, 'A')) == {'A', 'B', 'C'}
assert sorted(sorted(c) for c in graph['komponen'](cyclic)) == [['A', 'B', 'C'], ['D']]

hash_table = namespaces['struktur-hash-lanjutan']
table, reference = hash_table['buat_tabel'](1), {}
for key, value in [('ab', 1), ('ba', 2), ('ab', 3), ('x', 4)]:
    hash_table['simpan'](table, key, value)
    reference[key] = value
    assert table['jumlah'] == len(reference)
    for expected_key, expected_value in reference.items():
        assert hash_table['ambil'](table, expected_key) == expected_value
assert hash_table['ambil'](table, 'missing', 'absent') == 'absent'

brackets = namespaces['struktur-kasus-kurung']['periksa_kurung']
for text, expected in [('', True), ('abc', True), ('[]()', True), ('([]{})', True), ('(', False), ('[)', False), ('([)]', False), ('{[()]}', True), (']', False)]:
    assert brackets(text)[0] is expected, text
assert 'posisi 3' in brackets('([)]')[1]

scheduler = namespaces['struktur-kasus-prioritas']
for priorities in itertools.product([1, 2, 3], repeat=4):
    state = scheduler['buat_penjadwal']()
    # Reverse alphabetic IDs must still preserve arrival on equal priority.
    ids = ['Z', 'Y', 'X', 'W']
    for task, priority in zip(ids, priorities):
        assert scheduler['tambah_tugas'](state, task, priority)
    before = deepcopy(state)
    assert scheduler['tambah_tugas'](state, ids[0], priorities[0]) is False
    assert state == before
    expected = [ids[i] for i in sorted(range(4), key=lambda i: (priorities[i], i))]
    actual = [scheduler['layani'](state)['id'] for _ in range(4)]
    assert actual == expected
    assert scheduler['layani'](state) is None
    assert state['menunggu'] == set()
    assert scheduler['tambah_tugas'](state, ids[0], 1)
for task, priority in [('', 1), ('A', 0), ('A', -1), ('A', True), (None, 1)]:
    state = scheduler['buat_penjadwal']()
    before = deepcopy(state)
    try:
        scheduler['tambah_tugas'](state, task, priority)
    except ValueError:
        pass
    else:
        raise AssertionError('Invalid task accepted')
    assert state == before
print('PASS: 36 structure lessons; algorithm boundaries, circular wraparound, BST duplicates, graph cycles, hash collisions, brackets, and stable priority ties')
