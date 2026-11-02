import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error

def data_latihan(seed=42):
    rng=np.random.default_rng(seed)
    X=pd.DataFrame({'antrean_awal':rng.integers(0,15,250),'jenis':rng.choice(['radio','kabel'],250)})
    y=20+4*X['antrean_awal'].to_numpy()+15*(X['jenis']=='radio').to_numpy()+rng.normal(0,6,250)
    return X,y

def evaluasi(seed=42):
    X,y=data_latihan(seed)
    train,test=X.iloc[:200],X.iloc[200:]
    target_train,target_test=y[:200],y[200:]
    olah=ColumnTransformer([('num',StandardScaler(),['antrean_awal']),('kat',OneHotEncoder(handle_unknown='ignore',sparse_output=False),['jenis'])])
    model=Pipeline([('olah',olah),('model',Ridge(alpha=1.0))]).fit(train,target_train)
    dasar=DummyRegressor(strategy='median').fit(train,target_train)
    return mean_absolute_error(target_test,dasar.predict(test)),mean_absolute_error(target_test,model.predict(test))

if __name__ == '__main__':
    dasar,model=evaluasi()
    print('Data sintetis, train/test: 200/50')
    print('MAE baseline/model (menit):', round(dasar,2), round(model,2))
    print('Belum merupakan estimasi SLA lapangan.')
