"""Validate the new lessons using independent state, copy, and persistence expectations."""
import contextlib
import io
import json
from pathlib import Path
import runpy
import tempfile

root = Path(__file__).resolve().parents[1]
lessons = json.loads((root / 'lib/programming-oop-lessons.json').read_text())
by_slug = {lesson['slug']: lesson for lesson in lessons}

def reject(operation, error=ValueError):
    try:
        operation()
    except error as caught:
        return caught
    raise AssertionError('Expected failure was not raised')

with tempfile.TemporaryDirectory() as folder:
    folder = Path(folder)
    modules = {}
    for slug in ('oop-merancang-class', 'oop-copy-objek', 'oop-exception-khusus', 'oop-json-objek'):
        path = folder / (slug + '.py')
        path.write_text(by_slug[slug]['blocks'][0]['code'])
        with contextlib.redirect_stdout(io.StringIO()):
            modules[slug] = runpy.run_path(str(path))

    Tiket = modules['oop-merancang-class']['Tiket']
    for args in [('', 'Judul'), ('   ', 'Judul'), (None, 'Judul'), ('T1', ''), ('T1', True)]:
        reject(lambda: Tiket(*args))
    tiket, lain = Tiket(' T1 ', ' Gangguan '), Tiket('T2', 'Lain')
    assert (tiket.nomor, tiket.judul, tiket.status) == ('T1', 'Gangguan', 'BARU')
    reject(tiket.selesaikan)
    assert tiket.status == 'BARU'
    tiket.mulai()
    reject(tiket.mulai)
    assert tiket.status == 'DIPROSES'
    tiket.selesaikan()
    reject(tiket.mulai)
    reject(tiket.selesaikan)
    assert tiket.status == 'SELESAI' and lain.status == 'BARU'
    reject(lambda: setattr(tiket, 'status', 'BARU'), AttributeError)

    m = modules['oop-copy-objek']
    Rak, copy, deepcopy = m['Rak'], m['copy'], m['deepcopy']
    original = Rak('A', [{'judul': 'Python'}])
    alias, shallow, deep = original, copy(original), deepcopy(original)
    assert alias is original and shallow is not original
    assert shallow.buku is original.buku
    assert deep.buku is not original.buku
    shallow.buku[0]['judul'] = 'Berubah'
    assert original.buku[0]['judul'] == 'Berubah'
    assert deep.buku[0]['judul'] == 'Python'
    shallow.buku = []
    assert len(original.buku) == 1
    alias.nama = 'Baru'
    assert original.nama == 'Baru' and shallow.nama == 'A'

    m = modules['oop-exception-khusus']
    Persediaan, DomainError, Shortage = m['Persediaan'], m['InventarisError'], m['StokTidakCukup']
    assert issubclass(Shortage, DomainError)
    for bad in (-1, True, 1.5, '2', None):
        reject(lambda: Persediaan(bad))
    barang = Persediaan(2)
    error = reject(lambda: barang.keluarkan(3), Shortage)
    assert isinstance(error, DomainError)
    assert (error.tersedia, error.diminta) == (2, 3) and barang.stok == 2
    for bad in (0, -1, True, 2.5, '2', None):
        reject(lambda: barang.keluarkan(bad))
        assert barang.stok == 2
    barang.keluarkan(2)
    assert barang.stok == 0
    reject(lambda: barang.keluarkan(1), Shortage)

    m = modules['oop-json-objek']
    Barang, save, load = m['Barang'], m['simpan'], m['muat']
    path = folder / 'roundtrip.json'
    for code, stock in [(' A ', 0), ('K01', 7), ('Kabel é', 99)]:
        original = Barang(code, stock)
        save(path, original)
        loaded = load(path)
        assert loaded.to_dict() == {'kode': code.strip(), 'stok': stock}
        assert loaded is not original
        assert isinstance(loaded, Barang)
    valid = {'versi': 1, 'barang': {'kode': 'K01', 'stok': 3}}
    invalid = [[], {}, {'versi': 1}, {**valid, 'tambahan': 1}]
    for version in (True, '1', 1.0, 0, 2, None):
        invalid.append({**valid, 'versi': version})
    for data in ([], {}, {'kode': 'K01'}, {'kode': 'K01', 'stok': 3, 'x': 1}):
        invalid.append({**valid, 'barang': data})
    for stock in (-1, True, 1.5, '3', None):
        invalid.append({**valid, 'barang': {'kode': 'K01', 'stok': stock}})
    for code in ('', '  ', None, 8):
        invalid.append({**valid, 'barang': {'kode': code, 'stok': 3}})
    for payload in invalid:
        path.write_text(json.dumps(payload))
        before = path.read_bytes()
        reject(lambda: load(path))
        assert path.read_bytes() == before
    path.write_text('{invalid JSON')
    before = path.read_bytes()
    reject(lambda: load(path), json.JSONDecodeError)
    assert path.read_bytes() == before
    reject(lambda: load(folder / 'missing.json'), FileNotFoundError)
    # Invalid object state cannot overwrite the destination before validation.
    path.write_text('Existing file')
    item = Barang('K01', 1)
    item._stok = -1
    reject(lambda: save(path, item))
    assert path.read_text() == 'Existing file'
print('PASS: ticket transitions, nested copy sharing, domain exceptions, JSON round-trips, schema rejection and failed-load file preservation')
