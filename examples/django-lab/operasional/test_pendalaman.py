from io import StringIO
from django.contrib.auth import get_user_model
from django.core.management import call_command, CommandError
from django.test import TestCase, override_settings
from .models import Perangkat, Tiket


class QueryRelasiTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        User = get_user_model()
        cls.ani = User.objects.create_user('ani-query')
        cls.budi = User.objects.create_user('budi-query')
        for i in range(3):
            Tiket.objects.create(pemilik=cls.ani, judul=f'Tiket {i}', deskripsi='Latihan')

    def test_n_plus_one_dan_select_related(self):
        with self.assertNumQueries(4):
            biasa = [(t.judul, t.pemilik.username) for t in Tiket.objects.order_by('pk')]
        with self.assertNumQueries(1):
            efisien = [(t.judul, t.pemilik.username) for t in Tiket.objects.select_related('pemilik').order_by('pk')]
        self.assertEqual(biasa, efisien)

    def test_prefetch_relasi_balik(self):
        with self.assertNumQueries(2):
            hasil = [(u.username, [t.judul for t in u.tiket_set.all()])
                     for u in get_user_model().objects.order_by('pk').prefetch_related('tiket_set')]
        self.assertEqual(len(hasil), 2)
        self.assertEqual(len(hasil[0][1]), 3)
        self.assertEqual(hasil[1][1], [])

    def test_optimasi_tidak_menghapus_filter_pemilik(self):
        with self.assertNumQueries(1):
            hasil = list(Tiket.objects.filter(pemilik=self.budi).select_related('pemilik'))
        self.assertEqual(hasil, [])


class SeedCommandTest(TestCase):
    @override_settings(DEBUG=True)
    def test_flag_wajib(self):
        with self.assertRaises(CommandError):
            call_command('seed_perangkat', stdout=StringIO())
        self.assertEqual(Perangkat.objects.count(), 0)

    @override_settings(DEBUG=False)
    def test_produksi_ditolak(self):
        with self.assertRaises(CommandError):
            call_command('seed_perangkat', latihan=True, stdout=StringIO())
        self.assertEqual(Perangkat.objects.count(), 0)

    @override_settings(DEBUG=True)
    def test_dua_kali_tanpa_duplikasi(self):
        out = StringIO()
        call_command('seed_perangkat', latihan=True, stdout=out)
        call_command('seed_perangkat', latihan=True, stdout=out)
        self.assertEqual(Perangkat.objects.count(), 2)
        self.assertIn('Dibuat: 2;', out.getvalue())
        self.assertIn('Dibuat: 0;', out.getvalue())

    @override_settings(DEBUG=True)
    def test_data_lama_tidak_ditimpa(self):
        p = Perangkat.objects.create(kode='DEMO-001', nama='Nama lama', lokasi='Meja lama')
        call_command('seed_perangkat', latihan=True, stdout=StringIO())
        p.refresh_from_db()
        self.assertEqual(p.nama, 'Nama lama')
        self.assertEqual(p.lokasi, 'Meja lama')
