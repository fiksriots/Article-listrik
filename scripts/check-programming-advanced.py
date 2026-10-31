"""Exercise advanced examples against invariants and independent references."""
import contextlib
from copy import deepcopy
from itertools import permutations
import io
import json
from math import inf, isfinite
from pathlib import Path
import random
import runpy
import tempfile

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT/'lib/programming-data-structure-lessons.json').read_text())
slugs = ['struktur-doubly-linked','struktur-bst-hapus','struktur-avl','struktur-dijkstra','struktur-trie','struktur-topological-sort','struktur-union-find','struktur-benchmark','struktur-kasus-kontak','struktur-kasus-rute']
ns = {}
with tempfile.TemporaryDirectory() as temp:
    for lesson in data:
        if lesson['slug'] not in slugs:
            continue
        path = Path(temp)/(lesson['slug']+'.py')
        path.write_text(lesson['blocks'][0]['code'],encoding='utf-8')
        with contextlib.redirect_stdout(io.StringIO()):
            ns[lesson['slug']] = runpy.run_path(str(path))
assert set(ns) == set(slugs)

dll = ns['struktur-doubly-linked']
state = dll['buat_daftar']()
reference = []
for value in [None,'A','A',2]:
    dll['tambah_belakang'](state,value)
    reference.append(value)
    assert dll['baca'](state) == reference
    assert dll['baca'](state,True) == reference[::-1]
    node, previous, count = state['head'], None, 0
    while node is not None:
        assert node['prev'] is previous
        previous, node = node, node['next']
        count += 1
        assert count <= state['jumlah']
    assert count == state['jumlah'] and previous is state['tail']
while reference:
    assert dll['ambil_depan'](state) == reference.pop(0)
    assert dll['baca'](state) == reference
    assert dll['baca'](state,True) == reference[::-1]
assert state == {'head':None,'tail':None,'jumlah':0}
try:
    dll['ambil_depan'](state)
except IndexError:
    pass
else:
    raise AssertionError('Empty doubly list accepted')

bst = ns['struktur-bst-hapus']
for size in range(5):
    for insertion in permutations(range(size)):
        for deletion in permutations(range(size)):
            root = None
            remaining = set(insertion)
            for value in insertion:
                root = bst['tambah'](root,value)
            root = bst['hapus'](root,99)
            assert bst['inorder'](root) == sorted(remaining)
            for value in deletion:
                root = bst['hapus'](root,value)
                remaining.remove(value)
                assert bst['inorder'](root) == sorted(remaining)
            assert root is None

avl = ns['struktur-avl']
def audit(node):
    if node is None:
        return 0, []
    lh, left = audit(node['kiri'])
    rh, right = audit(node['kanan'])
    assert abs(lh-rh) <= 1
    assert node['tinggi'] == 1+max(lh,rh)
    assert not left or max(left)<node['nilai']
    assert not right or min(right)>node['nilai']
    return node['tinggi'], left+[node['nilai']]+right
for values in list(permutations(range(5))) + [tuple(range(100)),tuple(reversed(range(100))), (2,2,1,3)]:
    root, expected = None,set()
    for value in values:
        root = avl['tambah'](root,value)
        expected.add(value)
        assert audit(root)[1] == sorted(expected)

rng=random.Random(17)
dij=ns['struktur-dijkstra']['dijkstra']
route=ns['struktur-kasus-rute']['rute_terpendek']
for _ in range(60):
    nodes=['A','B','C','D']
    graph={a:{b:rng.randrange(6) for b in nodes if rng.random()<0.35} for a in nodes}
    before=deepcopy(graph)
    for start in nodes:
        expected={node:inf for node in nodes}; expected[start]=0
        # Bellman-Ford is an independent small-graph reference.
        for iteration in range(len(nodes)-1):
            for a in nodes:
                for b,weight in graph[a].items():
                    expected[b]=min(expected[b],expected[a]+weight)
        actual,parent=dij(graph,start)
        assert actual==expected
        for end in nodes:
            result=route(graph,start,end)
            if expected[end]==inf:
                assert result is None
            else:
                path=result['jalur']
                assert path[0]==start and path[-1]==end
                assert sum(graph[a][b] for a,b in zip(path,path[1:]))==expected[end]==result['biaya']
    assert graph==before
for bad in [{'A':{'B':1}}, {'A':{'A':-1}}, {'A':{'A':True}}, {'A':{'A':1.5}}, {'A':[]}, None]:
    try:
        dij(bad,'A')
    except ValueError:
        pass
    else:
        raise AssertionError(('Invalid graph accepted',bad))
for graph,start,end in [({},'A','A'),({'A':{}},'A','B'),({'A':{}},'B','A')]:
    try:
        route(graph,start,end)
    except ValueError:
        pass
    else:
        raise AssertionError('Missing route node accepted')

topo=ns['struktur-topological-sort']['urutan_tugas']
for _ in range(60):
    graph={str(i):[str(j) for j in range(i+1,6) if rng.random()<0.4] for i in range(6)}
    order=topo(graph);position={node:i for i,node in enumerate(order)}
    assert set(order)==set(graph) and len(order)==len(graph)
    assert all(position[a]<position[b] for a in graph for b in graph[a])
assert topo({})==[]
for cyclic in [{'A':['A']},{'A':['B'],'B':['C'],'C':['A']}]:
    try:
        topo(cyclic)
    except ValueError:
        pass
    else:
        raise AssertionError('Cycle accepted')

trie=ns['struktur-trie'];root=trie['buat_node']()
for word in ['Ana','Ani','An','Budi']:
    trie['tambah'](root,word)
    assert trie['ada_kata'](root,word.upper())
assert trie['ada_awalan'](root,'a') and not trie['ada_kata'](root,'a')
contacts=ns['struktur-kasus-kontak'];root=contacts['buat_node']();reference={}
for name in ['Ana','Ananda','Andi','Budi','Änne','ßa','Ssa',' ana ']:
    key=name.strip().casefold()
    assert contacts['tambah_kontak'](root,name)==(key not in reference)
    reference.setdefault(key,name.strip())
for prefix in ['', 'an',' ANA ', 'bu','zz','ß']:
    normalized=prefix.strip().casefold()
    expected=[reference[key] for key in sorted(reference) if key.startswith(normalized)]
    for limit in [0,1,2,100]:
        assert contacts['saran'](root,prefix,limit)==expected[:limit]
for name in ['', '  ',None]:
    try:
        contacts['tambah_kontak'](root,name)
    except ValueError:
        pass
    else:
        raise AssertionError('Invalid contact accepted')

uf=ns['struktur-union-find'];nodes=list('ABCDEF');state=uf['buat_kelompok'](nodes)
graph={node:set() for node in nodes}
def reachable(a,b):
    stack,seen=[a],{a}
    while stack:
        node=stack.pop()
        if node==b:return True
        for neighbor in graph[node]-seen:
            seen.add(neighbor);stack.append(neighbor)
    return False
for _ in range(40):
    a,b=rng.choice(nodes),rng.choice(nodes)
    connected=reachable(a,b)
    assert uf['union'](state,a,b)==(not connected)
    graph[a].add(b);graph[b].add(a)
    for x in nodes:
        for y in nodes:
            assert (uf['find'](state,x)==uf['find'](state,y))==reachable(x,y)
        representative=uf['find'](state,x)
        assert state['ukuran'][representative]==sum(reachable(x,y) for y in nodes)

measure=ns['struktur-benchmark']['ukur'](100)
assert all(isfinite(value) and value>=0 for value in measure)
print('PASS: doubly links, BST deletion permutations, AVL invariants, Dijkstra vs Bellman-Ford, DAG cycles, trie prefixes, union-find connectivity and measurement output')
