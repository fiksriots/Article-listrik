"""Check added curriculum dependencies and runnable project contracts."""
import contextlib
import copy
import io
import json
import os
from pathlib import Path
import runpy
import subprocess
import sys
import tempfile

root = Path(__file__).resolve().parents[1]
source = [json.loads((root / 'lib' / name).read_text()) for name in
          ('programming-extended-lessons.json', 'programming-oop-lessons.json', 'programming-data-structure-lessons.json')]
by_slug = {item['slug']: item for group in source for item in group}
order = json.loads((root / 'lib/programming-order.json').read_text())
ordered = [slug for group in order for slug in group['slugs']]
for earlier, later in [('menjalankan-python', 'lingkungan-python'), ('fungsi-lanjutan', 'type-hint-dasar'),
                       ('debugging-pengujian', 'traceback-debugger'), ('struktur-array-list-lanjutan', 'struktur-iterator-generator'),
                       ('struktur-pemilihan', 'struktur-kasus-pemilihan'), ('oop-enkapsulasi', 'oop-merancang-class'),
                       ('oop-komposisi', 'oop-relasi-uml'), ('oop-pengujian', 'oop-mock'),
                       ('oop-json-objek', 'oop-modul-package'), ('oop-modul-package', 'oop-refactoring'),
                       ('oop-refactoring', 'oop-solid'), ('oop-solid', 'oop-strategy'),
                       ('oop-strategy', 'oop-factory'), ('oop-factory', 'oop-observer'),
                       ('oop-observer', 'oop-proyek-tiket')]:
    assert ordered.index(earlier) < ordered.index(later), (earlier, later)

def reject(operation, kind=ValueError):
    try:
        operation()
    except kind:
        return
    raise AssertionError('Expected rejection')

with tempfile.TemporaryDirectory() as temp:
    folder = Path(temp)
    def load(slug):
        path = folder / (slug + '.py')
        path.write_text(by_slug[slug]['blocks'][0]['code'])
        with contextlib.redirect_stdout(io.StringIO()):
            return runpy.run_path(str(path), run_name='test_lesson')

    # Package is tested in a fresh interpreter to match user import/discovery behavior.
    package = folder / 'package-example'
    package.mkdir()
    for block in by_slug['oop-modul-package']['blocks']:
        path = package / block['filename']
        path.parent.mkdir(exist_ok=True, parents=True)
        path.write_text(block['code'])
    result = subprocess.run([sys.executable, 'main.py'], cwd=package, text=True, capture_output=True, check=True)
    assert result.stdout.strip() == 'Nilai: 2'
    result = subprocess.run([sys.executable, '-m', 'unittest', 'discover', '-v'], cwd=package, text=True, capture_output=True, check=True)
    assert 'Ran 2 tests' in result.stderr and result.stderr.rstrip().endswith('OK')
    result = subprocess.run([sys.executable, '-c', 'import main'], cwd=package, text=True, capture_output=True, check=True)
    assert result.stdout == ''

    # No external installation is needed to verify venv interpreter selection.
    venv = folder / 'venv-check'
    subprocess.run([sys.executable, '-m', 'venv', '--without-pip', str(venv)], check=True, capture_output=True)
    interpreter = venv / ('Scripts/python.exe' if os.name == 'nt' else 'bin/python')
    result = subprocess.run([str(interpreter), '-c', 'import sys; print(sys.prefix != sys.base_prefix)'], text=True, capture_output=True, check=True)
    assert result.stdout.strip() == 'True'

    debug = folder / 'debug_latihan.py'
    debug.write_text(by_slug['traceback-debugger']['blocks'][1]['code'])
    result = subprocess.run([sys.executable, '-m', 'pdb', str(debug)], input='c\nq\n', text=True, capture_output=True, timeout=10)
    assert result.returncode == 0 and '80.0' in result.stdout
    typed = load('type-hint-dasar')
    assert typed['rata_rata']([0, 100]) == 50.0
    for values in ([], [True], [101], [-1], [2.5], '80'):
        reject(lambda: typed['rata_rata'](values))
    assert typed['cari_nama']('missing', {}) is None

    refactor = load('oop-refactoring')
    for prices in ([], [0], [1, 2, 3], [99999, 100001]):
        old, new = {'harga': []}, refactor['Keranjang']()
        for price in prices:
            refactor['tambah_lama'](old, price)
            new.tambah(price)
        assert refactor['total_lama'](old) == new.total() == sum(prices)
        for bad in (-1, True, 2.5, '3'):
            before = new.total()
            reject(lambda: new.tambah(bad))
            reject(lambda: refactor['tambah_lama'](old, bad))
            assert refactor['total_lama'](old) == new.total() == before

    strategy = load('oop-strategy')
    for subtotal in (0, 1, 9, 10, 99999, 105000):
        assert strategy['Tagihan'](strategy['TanpaDiskon']()).total(subtotal) == subtotal
        assert strategy['Tagihan'](strategy['DiskonSepuluh']()).total(subtotal) == subtotal - subtotal // 10
    class BadStrategy:
        def hitung(self, subtotal):
            return subtotal + 1
    reject(lambda: strategy['Tagihan'](BadStrategy()).total(10))
    for bad in (-1, True, 1.5, '10'):
        reject(lambda: strategy['Tagihan'](strategy['TanpaDiskon']()).total(bad))
    factory = load('oop-factory')['buat_pengirim']
    assert factory('layar') is not factory('layar')
    reject(lambda: factory('sms'))

    Kanal = load('oop-observer')['Kanal']
    events, channel = [], Kanal()
    def late(message):
        events.append(('late', message))
    def first(message):
        events.append(('first', message))
        channel.daftar(late)
    channel.daftar(first)
    channel.daftar(first)
    channel.emit('a')
    assert events == [('first', 'a')]
    channel.emit('b')
    assert events == [('first', 'a'), ('first', 'b'), ('late', 'b')]
    channel.lepas(first)
    channel.emit('c')
    assert events[-1] == ('late', 'c')
    reject(lambda: channel.daftar(8))
    channel = Kanal()
    def fail(message):
        raise RuntimeError('Stop')
    channel.daftar(fail)
    channel.daftar(late)
    before = list(events)
    reject(lambda: channel.emit('x'), RuntimeError)
    assert events == before

    generator = load('struktur-iterator-generator')['suhu_tinggi']
    stream = generator([34, 35, 36], 35)
    assert next(stream) == 35 and list(stream) == [36] and list(stream) == []
    assert list(generator([], 35)) == []
    assert list(generator([35, 35], 35)) == [35, 35]

    project = load('oop-proyek-tiket')
    Service = project['LayananTiket']
    service = Service()
    service.tambah_teknisi(' N01 ', ' Ana ')
    service.buat(' T01 ', ' Link putus ')
    ticket = service.ambil('T01')
    for operation in (lambda: service.buat('T01', 'Duplikat'),
                      lambda: service.tambah_teknisi('N01', 'Duplikat'),
                      lambda: service.tugaskan('T01', 'missing'),
                      lambda: service.proses('T01'), lambda: service.selesaikan('T01'),
                      lambda: service.ambil('missing')):
        before = service.to_dict()
        reject(operation)
        assert service.to_dict() == before
    # Each legal prefix round-trips and history is a protected snapshot.
    for step in (None, lambda: service.tugaskan('T01', 'N01'), lambda: service.proses('T01'), lambda: service.selesaikan('T01')):
        if step:
            step()
        restored = Service.from_dict(service.to_dict())
        assert restored.to_dict() == service.to_dict()
        assert restored.ambil('T01') is not ticket
        assert isinstance(ticket.riwayat, tuple)
    assert ticket.status == 'SELESAI'
    for operation in (lambda: service.tugaskan('T01', 'N01'), lambda: service.proses('T01'), lambda: service.selesaikan('T01')):
        before = service.to_dict()
        reject(operation)
        assert service.to_dict() == before
    valid = service.to_dict()
    invalid = [{}, [], {**valid, 'versi': True}, {**valid, 'versi': 2}, {**valid, 'x': 1}, {**valid, 'tiket': {}}]
    for change in ({'riwayat': ['BARU', 'SELESAI']}, {'riwayat': []}, {'teknisi': 'missing'},
                   {'riwayat': ['BARU'], 'teknisi': 'N01'}, {'judul': ''}, {'nomor': None}):
        data = copy.deepcopy(valid)
        data['tiket'][0].update(change)
        invalid.append(data)
    for key in ('teknisi', 'tiket'):
        data = copy.deepcopy(valid)
        data[key].append(copy.deepcopy(data[key][0]))
        invalid.append(data)
    for data in invalid:
        reject(lambda: Service.from_dict(data))
    path = folder / 'project.json'
    project['simpan'](path, service)
    assert project['muat'](path).to_dict() == valid
    for bad in ('{broken', json.dumps(invalid[-1])):
        path.write_text(bad)
        before = path.read_bytes()
        reject(lambda: project['muat'](path))
        assert path.read_bytes() == before
    empty = Service()
    assert Service.from_dict(empty.to_dict()).to_dict() == empty.to_dict()
print('PASS: ordered prerequisites, package imports/discovery, venv and pdb, refactoring equivalence, strategies, factory, observer contract, generator consumption, ticket transitions and validated persistence')
