import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge

def buat_pipeline():
    numerik=Pipeline([('isi',SimpleImputer(strategy='median')),('skala',StandardScaler())])
    kategori=OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    olah=ColumnTransformer([('num',numerik,['antrean']),('kat',kategori,['lokasi'])])
    return Pipeline([('olah',olah),('model',Ridge(alpha=1.0))])

if __name__ == '__main__':
    train=pd.DataFrame({'antrean':[1.,2.,np.nan,4.], 'lokasi':['A','B','A','B']})
    test=pd.DataFrame({'antrean':[100.,np.nan], 'lokasi':['C','A']})
    model=buat_pipeline().fit(train,[10.,20.,15.,40.])
    isi=model.named_steps['olah'].named_transformers_['num'].named_steps['isi']
    print('Median train:', isi.statistics_.tolist())
    print('Bentuk prediksi:', model.predict(test).shape)
