"""Exercise published OOP examples against independent state and boundary expectations."""
import contextlib
import io
import json
import random
import runpy
import tempfile
from pathlib import Path
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[1]
lessons = json.loads((root / 'lib/programming-oop-lessons.json').read_text())
assert len(lessons) == 28
with tempfile.TemporaryDirectory() as directory:
    modules = {}
    for lesson in lessons:
        if lesson['slug'] == 'oop-modul-package':
            continue
        target = Path(directory) / (lesson['slug'] + '.py')
        target.write_text(lesson['blocks'][0]['code'])
        with contextlib.redirect_stdout(io.StringIO()):
            modules[lesson['slug']] = runpy.run_path(str(target), run_name='lesson')
        if lesson['diagram']:
            ET.parse(root / 'public/programming' / (lesson['diagram'] + '.svg'))

    def rejects(operation, error=ValueError):
        try:
            operation()
        except error:
            return
        raise AssertionError('Invalid operation accepted')

    Lampu = modules['oop-pengantar']['Lampu']
    a, b = Lampu('A'), Lampu('B')
    a.nyalakan()
    assert a.aktif and not b.aktif
    Buku = modules['oop-class-object']['Buku']
    a, b = Buku(), Buku()
    alias = a
    alias.judul = 'Berubah'
    assert a.judul == 'Berubah' and a is alias and a is not b
    Anggota = modules['oop-atribut']['Anggota']
    a, b = Anggota('A'), Anggota('B')
    a.pinjaman.append('Buku')
    assert b.pinjaman == []
    Barang = modules['oop-enkapsulasi']['Barang']
    a = Barang(0)
    for bad in (-1, True, 1.5, '3', None):
        rejects(lambda: setattr(a, 'stok', bad))
        rejects(lambda: Barang(bad))
        assert a.stok == 0
    a.stok = 10
    assert a.stok == 10

    m = modules['oop-inheritance']
    a = m['TeknisiJaringan']('Uji', 'Timur')
    assert isinstance(a, m['Teknisi']) and a.ringkasan() == 'Teknisi Uji / Timur'
    m = modules['oop-polymorphism']
    class PengirimUji:
        def kirim(self, pesan):
            return pesan.upper()
    assert m['kirim_semua']([PengirimUji(), m['Layar']()], 'uji') == ['UJI', 'Layar: uji']
    m = modules['oop-abstraksi']
    rejects(lambda: m['PembacaSensor'](), TypeError)
    class BelumLengkap(m['PembacaSensor']):
        pass
    rejects(BelumLengkap, TypeError)
    assert m['SensorSimulasi']().baca() == 28.5
    m = modules['oop-komposisi']
    assert m['Dashboard'](m['PembacaTetap'](0)).tampilkan() == 'Suhu: 0.0 C'

    Pelanggan = modules['oop-jenis-method']['Pelanggan']
    for bad in ('', 'A', '|Home', 'A|', 'A|B|C', None):
        rejects(lambda: Pelanggan.dari_teks(bad))
    class Turunan(Pelanggan):
        pass
    a = Turunan.dari_teks(' Ana | Home ')
    assert isinstance(a, Turunan) and a.label() == 'Ana / Home'
    Keranjang = modules['oop-dunder']['Keranjang']
    source = ['X']
    a = Keranjang('A', source)
    source.append('Y')
    assert len(a) == 1 and str(a) == 'Keranjang A: 1 item'
    assert len(Keranjang('B', [])) == 0
    Catatan = modules['oop-dataclass']['Catatan']
    a, b = Catatan('A'), Catatan('A')
    assert a == b
    a.temuan.append('X')
    assert b.temuan == [] and a != b
    assert modules['oop-pengujian']['hasil'].wasSuccessful()

    Barang = modules['oop-kasus-inventaris']['Barang']
    for kode, harga, stok in [('', 0, 0), ('  ', 0, 0), (None, 0, 0), ('A', -1, 0), ('A', True, 0), ('A', 0, -1), ('A', 0, True), ('A', 0, 1.5)]:
        rejects(lambda: Barang(kode, harga, stok))
    a, b = Barang(' A ', 5000, 0), Barang('B', 0, 2)
    assert a.kode == 'A' and a.nilai_persediaan() == 0
    expected = 0
    rng = random.Random(91)
    for _ in range(200):
        amount = rng.randrange(1, 12)
        if rng.choice((True, False)):
            a.tambah(amount)
            expected += amount
        elif amount <= expected:
            a.keluarkan(amount)
            expected -= amount
        else:
            rejects(lambda: a.keluarkan(amount))
        assert a.stok == expected and a.nilai_persediaan() == expected * 5000
        assert b.stok == 2
    a.keluarkan(a.stok) if a.stok else None
    assert a.stok == 0
    for invalid in (0, -1, True, 2.5, '2', None):
        rejects(lambda: a.tambah(invalid))
        rejects(lambda: a.keluarkan(invalid))
        assert a.stok == 0
    for name in ('kode', 'harga', 'stok'):
        rejects(lambda: setattr(a, name, 99), AttributeError)

    m = modules['oop-kasus-monitoring']
    Monitor, Reader = m['Monitor'], m['PembacaSimulasi']
    a = Monitor(Reader([34.9, 35, 35.1]), 35)
    assert [a.periksa() for _ in range(3)] == [(34.9, 'NORMAL'), (35, 'WASPADA'), (35.1, 'WASPADA')]
    rejects(a.periksa, StopIteration)
    rejects(Monitor(Reader([])).periksa, StopIteration)
    for bad in (True, '35', None, float('nan'), float('inf'), -float('inf')):
        rejects(lambda: Monitor(Reader([]), bad))
        a = Monitor(Reader([bad, 20]))
        rejects(a.periksa)
        assert a.periksa() == (20, 'NORMAL')  # Invalid sample was consumed.
    class OtherReader:
        def baca(self):
            return -2
    assert Monitor(OtherReader(), 0).periksa() == (-2, 'NORMAL')
print('PASS: 28 OOP lessons; identity, isolation, validation, factories, ABCs, composition, dataclasses, inventory state model, monitor boundaries and failures')
