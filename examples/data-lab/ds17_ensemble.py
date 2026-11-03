import numpy as np
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split,KFold,cross_val_score
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.dummy import DummyRegressor
from sklearn.base import clone
from sklearn.metrics import mean_absolute_error
if __name__=='__main__':
    X,y=make_regression(n_samples=140,n_features=4,n_informative=3,noise=5,random_state=42)
    y=y+20*X[:,0]**2
    a,b,c,d=train_test_split(X,y,test_size=.2,random_state=42)
    calon={'baseline':DummyRegressor(strategy='median'),'tree':DecisionTreeRegressor(max_depth=3,random_state=42),
           'forest':RandomForestRegressor(n_estimators=50,max_depth=5,min_samples_leaf=3,random_state=42,n_jobs=1)}
    cv=KFold(n_splits=3,shuffle=True,random_state=42)
    skor={n:-cross_val_score(m,a,c,cv=cv,scoring='neg_mean_absolute_error',n_jobs=1).mean() for n,m in calon.items()}
    terbaik=min(skor,key=skor.get)
    print('MAE CV:',{n:round(float(v),2) for n,v in skor.items()})
    model=clone(calon[terbaik]).fit(a,c)
    print('Terpilih dari CV:',terbaik)
    print('MAE test akhir:',round(mean_absolute_error(d,model.predict(b)),2))
