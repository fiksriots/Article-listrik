import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.dummy import DummyClassifier
from sklearn.metrics import confusion_matrix, recall_score, precision_score

def data_latihan(seed=42):
    rng=np.random.default_rng(seed)
    X=np.column_stack([rng.uniform(10,180,500),rng.uniform(0,20,500),rng.uniform(0,1,500)])
    logit=-5+0.025*X[:,0]+0.08*X[:,1]+2*X[:,2]
    p=1/(1+np.exp(-logit))
    y=rng.binomial(1,p)
    return X,y

def evaluasi(seed=42):
    X,y=data_latihan(seed)
    train,test=X[:350],X[350:]
    a,b=y[:350],y[350:]
    model=Pipeline([('skala',StandardScaler()),('model',LogisticRegression(max_iter=500,random_state=42))]).fit(train,a)
    dasar=DummyClassifier(strategy='most_frequent').fit(train,a)
    pred=(model.predict_proba(test)[:,1]>=0.5).astype(int)  # Ambang ditetapkan sebelum test.
    return b,pred,dasar.predict(test)

if __name__ == '__main__':
    aktual,pred,dasar=evaluasi()
    print('Data sintetis, train/test: 350/150; ambang: 0.5')
    print('Matriks model:', confusion_matrix(aktual,pred,labels=[0,1]).tolist())
    print('Precision/recall:', round(precision_score(aktual,pred,zero_division=0),3), round(recall_score(aktual,pred,zero_division=0),3))
    print('Recall baseline:', round(recall_score(aktual,dasar,zero_division=0),3))
    print('Tidak mengendalikan perangkat atau membuktikan akurasi lapangan.')
