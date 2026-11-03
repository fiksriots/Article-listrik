import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import FunctionTransformer,StandardScaler,OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge
def tambah_fitur(data):
    data=data.copy()
    if not np.isfinite(data[['antrean','teknisi']]).all().all() or (data['antrean']<0).any() or (data['teknisi']<1).any():
        raise ValueError('Antrean nonnegatif dan teknisi minimal satu, semuanya finite.')
    data['beban_per_teknisi']=data['antrean']/data['teknisi']
    return data
def buat_model():
    olah=ColumnTransformer([('num',StandardScaler(),['antrean','teknisi','beban_per_teknisi']),('kat',OneHotEncoder(handle_unknown='ignore',sparse_output=False),['jenis'])])
    return Pipeline([('fitur',FunctionTransformer(tambah_fitur,validate=False)),('olah',olah),('model',Ridge())])
if __name__=='__main__':
    train=pd.DataFrame({'antrean':[2,4,6,8],'teknisi':[1,2,2,4],'jenis':['radio','kabel','radio','kabel']})
    test=pd.DataFrame({'antrean':[10],'teknisi':[2],'jenis':['fiber']})
    model=buat_model().fit(train,[20,25,35,30])
    print('Beban test:',tambah_fitur(test)['beban_per_teknisi'].tolist())
    print('Bentuk prediksi:',model.predict(test).shape)
    print('Kolom sumber tetap:',test.columns.tolist())
