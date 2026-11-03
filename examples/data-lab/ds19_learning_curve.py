import numpy as np
from sklearn.datasets import make_regression
from sklearn.model_selection import KFold,learning_curve
from sklearn.tree import DecisionTreeRegressor
if __name__=='__main__':
    X,y=make_regression(n_samples=120,n_features=4,noise=15,random_state=42)
    ukuran,train,val=learning_curve(DecisionTreeRegressor(random_state=42),X,y,
        cv=KFold(n_splits=3,shuffle=True,random_state=42),train_sizes=[.3,.6,1.],
        scoring='neg_mean_absolute_error',shuffle=True,random_state=42,n_jobs=1)
    print('Ukuran train per fold:',ukuran.tolist())
    print('MAE train:',np.round(np.abs(train.mean(axis=1)),2).tolist())
    print('MAE validasi:',np.round(-val.mean(axis=1),2).tolist())
