import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

def model_pca(train):
    train=np.asarray(train,dtype=float)
    if train.ndim!=2 or min(train.shape)<2 or not np.isfinite(train).all():
        raise ValueError('Matriks finite, minimal dua sampel dan fitur.')
    return make_pipeline(StandardScaler(),PCA(n_components=2,svd_solver='full')).fit(train)

if __name__=='__main__':
    train=np.array([[1,10,2],[2,18,5],[3,31,5],[4,39,9],[5,48,10],[6,62,11]],dtype=float)
    test=np.array([[7,70,14],[8,80,17]],dtype=float)
    model=model_pca(train)
    reduced=model.transform(test)
    print('Bentuk hasil test:',reduced.shape)
    print('Rasio varians train:',np.round(model[-1].explained_variance_ratio_,4).tolist())
    print('Mean scaler hanya train:',np.round(model[0].mean_,3).tolist())
    print('Varians besar bukan jaminan fitur terbaik untuk target')
