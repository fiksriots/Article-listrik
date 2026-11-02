import hashlib
from pathlib import Path
import tempfile
import unittest
import numpy as np
import pandas as pd
from da04_kualitas import bersihkan_penjualan
from da08_grafik import buat_grafik
from da10_laporan import buat_laporan
from da11_kasus_penjualan import analisis_penjualan
from da12_kasus_jaringan import ringkas_monitoring
from ds03_bootstrap import interval_bootstrap
from ds06_pipeline import buat_pipeline
from ds11_kasus_durasi import evaluasi as regresi
from ds12_kasus_risiko import evaluasi as klasifikasi

ROOT=Path(__file__).resolve().parent

class DataLabTest(unittest.TestCase):
    def sales(self): return pd.read_csv(ROOT/'datasets/penjualan.csv',dtype={'id':'string'})
    def monitoring(self): return pd.read_csv(ROOT/'datasets/monitoring.csv')

    def test_rekonsiliasi_penjualan(self):
        raw=self.sales();baik,buruk,duplikat=bersihkan_penjualan(raw)
        self.assertEqual((len(baik),len(buruk),duplikat),(5,2,1))
        self.assertEqual(len(raw),len(baik)+len(buruk)+duplikat)
        self.assertEqual(int(baik.omzet_rupiah.sum()),1960000)
        self.assertEqual(str(baik.omzet_rupiah.dtype),'int64')
        self.assertNotIn('omzet_rupiah',raw.columns)

    def test_id_berkonflik_dikarantina(self):
        raw=self.sales();ubah=raw.iloc[[0]].copy();ubah['jumlah']=9
        baik,buruk,_=bersihkan_penjualan(pd.concat([raw,ubah],ignore_index=True))
        self.assertNotIn('T001',baik['id'].tolist())
        self.assertEqual(int(buruk['id'].eq('T001').sum()),2)

    def test_nilai_invalid_ditolak(self):
        raw=self.sales().iloc[[0]].copy()
        for col,value in [('jumlah',1.5),('jumlah',np.inf),('harga_rupiah',-1),('tanggal','bukan-tanggal'),('id','   ')]:
            with self.subTest(col=col,value=value):
                data=raw.copy();data[col]=value
                baik,buruk,_=bersihkan_penjualan(data)
                self.assertEqual(len(baik),0);self.assertEqual(len(buruk),1)

    def test_skema_wajib(self):
        with self.assertRaises(ValueError):bersihkan_penjualan(pd.DataFrame({'id':['A']}))

    def test_monitoring_penyebut_terpisah(self):
        hasil=ringkas_monitoring(self.monitoring()).set_index('perangkat')
        self.assertAlmostEqual(hasil.loc['BTS-A','coverage_pct'],75.)
        self.assertAlmostEqual(hasil.loc['BTS-A','up_teramati_pct'],200/3)
        self.assertAlmostEqual(hasil.loc['BTS-A','rtt_rata_ms'],22.5)
        self.assertAlmostEqual(hasil.loc['BTS-B','coverage_pct'],100.)

    def test_monitoring_duplikat_ditolak(self):
        data=self.monitoring()
        with self.assertRaises(ValueError):ringkas_monitoring(pd.concat([data,data.iloc[[0]]]))

    def test_monitoring_status_dan_rtt_invalid(self):
        for col,value in [('up',2),('rtt_ms',-1),('rtt_ms',np.inf),('perangkat',' ')]:
            with self.subTest(col=col,value=value):
                data=self.monitoring();data[col]=data[col].astype('object');data.loc[0,col]=value
                with self.assertRaises(ValueError):ringkas_monitoring(data)

    def test_monitoring_tanpa_status_tidak_jadi_nol(self):
        data=self.monitoring();data.loc[data.perangkat.eq('BTS-A'),'up']=np.nan
        hasil=ringkas_monitoring(data).set_index('perangkat')
        self.assertEqual(hasil.loc['BTS-A','coverage_pct'],0)
        self.assertTrue(pd.isna(hasil.loc['BTS-A','up_teramati_pct']))

    def test_bootstrap_berulang(self):
        a=interval_bootstrap([10,12,15,18,20,25]);b=interval_bootstrap([10,12,15,18,20,25])
        np.testing.assert_array_equal(a,b)
        self.assertTrue(10<=a[0]<=a[1]<=25)
        for nilai in [[1],[1,np.nan]]:
            with self.assertRaises(ValueError):interval_bootstrap(nilai)

    def test_pipeline_tidak_belajar_test(self):
        train=pd.DataFrame({'antrean':[1.,2.,np.nan,4.],'lokasi':['A','B','A','B']})
        test=pd.DataFrame({'antrean':[100.,np.nan],'lokasi':['C','A']})
        model=buat_pipeline().fit(train,[10,20,15,40]);olah=model.named_steps['olah']
        before=olah.named_transformers_['num'].named_steps['isi'].statistics_.copy()
        pred=model.predict(test)
        np.testing.assert_array_equal(before,[2.])
        np.testing.assert_array_equal(before,olah.named_transformers_['num'].named_steps['isi'].statistics_)
        self.assertEqual(pred.shape,(2,));self.assertTrue(np.isfinite(pred).all())

    def test_artefak_dan_sumber_tetap(self):
        src=ROOT/'datasets/penjualan.csv';awal=hashlib.sha256(src.read_bytes()).hexdigest()
        with tempfile.TemporaryDirectory() as folder:
            _,_,_,ringkas=analisis_penjualan(src,folder)
            self.assertEqual(int(ringkas.omzet_rupiah.sum()),1960000)
            self.assertTrue((Path(folder)/'penjualan.png').read_bytes().startswith(b'\x89PNG'))
            self.assertTrue(buat_grafik(folder).read_bytes().startswith(b'\x89PNG'))
            self.assertEqual(buat_laporan(src,folder)['sha256'],awal)
        self.assertEqual(hashlib.sha256(src.read_bytes()).hexdigest(),awal)

    def test_model_sintetis_dan_baseline(self):
        dasar,mae=regresi();self.assertTrue(0<=mae<dasar)
        aktual,pred,baseline=klasifikasi()
        self.assertEqual(len(aktual),150)
        self.assertEqual(len(pred),len(baseline))
        self.assertEqual(set(np.unique(aktual)),{0,1})
        self.assertTrue(set(np.unique(pred))<={0,1})
        self.assertTrue(np.any(pred!=aktual))  # Jangan menyamakan simulasi dengan model sempurna.

if __name__=='__main__':unittest.main()
