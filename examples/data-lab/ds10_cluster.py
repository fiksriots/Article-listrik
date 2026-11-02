import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.pipeline import Pipeline
if __name__ == '__main__':
    X=np.array([[20,0.],[22,0.1],[18,0.2],[120,8.],[125,9.],[115,7.]])
    model=Pipeline([('skala',StandardScaler()),('kelompok',KMeans(n_clusters=2,n_init=10,random_state=42))])
    label=model.fit_predict(X)
    print('Ukuran kelompok:', sorted(np.bincount(label).tolist()))
    print('Label cluster bukan diagnosis gangguan.')
