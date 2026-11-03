"""Uji aturan pendalaman dengan data baru, terpisah dari contoh artikel."""
import unittest
import numpy as np
import pandas as pd
from da13_teks import normalisasi_kota
from da15_sql import cari_lokasi
from da16_excel import contoh_workbook
from da18_outlier import tandai_iqr
from da19_kontrak import profil_kualitas
from da20_cohort import retensi
from ds13_hipotesis import uji_selisih
from ds15_imbalance import pilih_ambang
from ds16_fitur import tambah_fitur, buat_model
from ds20_drift import profil, bandingkan

class Pendalaman(unittest.TestCase):
    def test_teks_unicode_missing(self):
        hasil,asing,kosong=normalisasi_kota(pd.Series([' ＳＢＹ ',None,'Baru']))
        self.assertEqual(hasil.iloc[0],'surabaya')
        self.assertTrue(pd.isna(hasil.iloc[1]))
        self.assertTrue(pd.isna(hasil.iloc[2]))
        self.assertEqual((asing,kosong),(['baru'],1))
    def test_sql_parameter(self):
        self.assertTrue(cari_lokasi("A' OR 1=1 --").empty)
        self.assertEqual(cari_lokasi('A').loc[0,'jumlah'],2)
    def test_excel_identitas(self):
        sheets,data=contoh_workbook()
        self.assertEqual(sheets,['Transaksi','Metadata'])
        self.assertEqual(data['id'].tolist(),['001','002'])
    def test_iqr_tidak_menghapus(self):
        sumber=pd.Series([5,5,5,5,50])
        salinan=sumber.copy()
        _,_,flag=tandai_iqr(sumber)
        self.assertEqual(sumber[flag].tolist(),[50])
        pd.testing.assert_series_equal(sumber,salinan)
    def test_iqr_batas(self):
        for data in [[1,2,3],[1,2,3,np.inf]]:
            with self.assertRaises(ValueError):tandai_iqr(pd.Series(data))
        _,_,flag=tandai_iqr(pd.Series([7]*5))
        self.assertFalse(flag.any())
    def test_kualitas_aturan_bertumpuk(self):
        data=pd.DataFrame({'id':[' X ','X',''],'status':['up','up','asing'],'rtt_ms':[None,-2,'teks']})
        p=profil_kualitas(data)
        self.assertEqual((p['baris_id_ganda'],p['rtt_invalid'],p['rtt_wajib_kosong'],p['status_asing']),(2,2,1,1))
        with self.assertRaises(ValueError):profil_kualitas(data.drop(columns='id'))
    def test_cohort_penyebut_dan_duplikat(self):
        users=pd.DataFrame({'id':['a','b','c'],'daftar':['2026-01','2026-01','2026-03']})
        events=pd.DataFrame({'id':['a','a','a','c'],'bulan':['2026-01','2026-01','2026-02','2026-03']})
        result=retensi(users,events)
        self.assertEqual(result.loc['2026-01'].tolist(),[.5,.5,0])
        self.assertTrue(pd.isna(result.loc['2026-03',1]))
        self.assertEqual(result.loc['2026-03',0],1)
    def test_cohort_tolak_peristiwa(self):
        users=pd.DataFrame({'id':['a'],'daftar':['2026-02']})
        for identitas,bulan in [('asing','2026-02'),('a','2026-01'),('a','2026-04'),(None,'2026-02')]:
            with self.subTest(identitas=identitas,bulan=bulan):
                with self.assertRaises(ValueError):retensi(users,pd.DataFrame({'id':[identitas],'bulan':[bulan]}))
    def test_cohort_master_dan_tanpa_aktivitas(self):
        events=pd.DataFrame(columns=['id','bulan'])
        for ids in [['a',' a '],['a',None],['a',' ']]:
            with self.assertRaises(ValueError):retensi(pd.DataFrame({'id':ids,'daftar':['2026-01']*2}),events)
        result=retensi(pd.DataFrame({'id':['a'],'daftar':['2026-01']}),events)
        self.assertEqual(result.iloc[0].tolist(),[0,0,0])
    def test_permutasi_simetris_invalid(self):
        a=[1,2,3];b=[4,5,6]
        x,y=uji_selisih(a,b),uji_selisih(b,a)
        self.assertAlmostEqual(x.pvalue,y.pvalue)
        self.assertEqual(x.statistic,-y.statistic)
        for bad in [[1],[1,np.nan]]:
            with self.assertRaises(ValueError):uji_selisih(bad,b)
    def test_ambang_validation(self):
        ambang=pilih_ambang([0,0,1,1],[.1,.2,.35,.4])
        self.assertEqual(ambang,.3)
    def test_fitur_sumber_dan_kategori_baru(self):
        train=pd.DataFrame({'antrean':[2,4,6,8],'teknisi':[1,2,2,4],'jenis':['a','b','a','b']})
        before=train.copy(deep=True)
        self.assertEqual(tambah_fitur(train)['beban_per_teknisi'].tolist(),[2,2,3,2])
        model=buat_model().fit(train,[10,20,30,40])
        test=pd.DataFrame({'antrean':[3],'teknisi':[1],'jenis':['baru']})
        self.assertTrue(np.isfinite(model.predict(test)).all())
        pd.testing.assert_frame_equal(before,train)
        for bad in [0,np.nan]:
            with self.assertRaises(ValueError):tambah_fitur(test.assign(teknisi=bad))
    def test_drift_identitas_simetris_missing(self):
        a,b=[0,20,50,100],[60,80,np.nan]
        self.assertEqual(bandingkan(a,a),(0,0,0))
        x,y=bandingkan(a,b),bandingkan(b,a)
        self.assertEqual(x[0],y[0]);self.assertTrue(0<=x[0]<=1)
        self.assertEqual(x[1:],(0,1/3))
        self.assertEqual(bandingkan([20],[20,np.nan])[0],0)
    def test_drift_domain(self):
        for bad in [[],[np.nan],[np.inf],[-1],[101],[[1,2]]]:
            with self.subTest(bad=bad):
                with self.assertRaises(ValueError):profil(bad)

if __name__=='__main__':unittest.main()
