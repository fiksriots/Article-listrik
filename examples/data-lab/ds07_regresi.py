import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error
if __name__ == '__main__':
    X=np.arange(1,11,dtype=float).reshape(-1,1)
    y=2*X[:,0]+3  # Data fiktif sengaja linear sempurna.
    trainX,testX=X[:8],X[8:]
    trainY,testY=y[:8],y[8:]
    dasar=DummyRegressor(strategy='median').fit(trainX,trainY)
    model=LinearRegression().fit(trainX,trainY)
    print('MAE baseline:', round(mean_absolute_error(testY,dasar.predict(testX)),2))
    print('MAE model:', round(mean_absolute_error(testY,model.predict(testX)),2))
