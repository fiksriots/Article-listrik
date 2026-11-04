from pathlib import Path
from tempfile import TemporaryDirectory
import json
import unittest
import numpy as np
from ds21_time_series import walk_forward
from ds22_pca import model_pca
from ds23_model_eksperimen import bangun

class DataLanjut(unittest.TestCase):
    def test_lag_hanya_masa_lalu(self):
        pred,mae=walk_forward([1,2,4,8],2,1)
        np.testing.assert_array_equal(pred,[2,4]);self.assertEqual(mae,3)
        future,_=walk_forward([1,2,4,999],2,1)
        self.assertEqual(pred[0],future[0])
    def test_lag_invalid(self):
        for values,start,lag in [([1,2],0,1),([1,np.nan],1,1),([1,2],1,0)]:
            with self.assertRaises(ValueError):walk_forward(values,start,lag)
    def test_scaler_tidak_fit_test(self):
        train=np.array([[1,2,3],[2,5,6],[3,5,8],[4,8,9]],dtype=float)
        model=model_pca(train);before=model[0].mean_.copy()
        self.assertEqual(model.transform([[1000,2000,3000]]).shape,(1,2))
        np.testing.assert_array_equal(model[0].mean_,before)
        np.testing.assert_allclose(before,train.mean(axis=0))
    def test_pca_invalid(self):
        with self.assertRaises(ValueError):model_pca([[1,np.nan],[2,3]])
    def test_persistensi_model_dan_manifest(self):
        with TemporaryDirectory() as folder:
            manifest,same,mae=bangun(folder)
            self.assertTrue(same);self.assertTrue(np.isfinite(mae))
            stored=json.loads((Path(folder)/'manifest.json').read_text())
            self.assertEqual(stored,manifest)
            self.assertEqual(manifest['fit_rows']+manifest['test_rows'],80)
            best=min(manifest['experiments'],key=lambda row:row['mae_validation'])
            self.assertEqual(manifest['selected_alpha'],best['alpha'])

if __name__=='__main__':unittest.main()
