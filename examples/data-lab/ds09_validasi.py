from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split, KFold, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error
if __name__ == '__main__':
    X,y=make_regression(n_samples=100,n_features=3,noise=10,random_state=42)
    a,b,c,d=train_test_split(X,y,test_size=.2,random_state=42)
    pipe=Pipeline([('skala',StandardScaler()),('model',Ridge())])
    cv=KFold(n_splits=4,shuffle=True,random_state=42)
    cari=GridSearchCV(pipe,{'model__alpha':[0.1,1.,10.]},cv=cv,scoring='neg_mean_absolute_error',n_jobs=1,error_score='raise')
    cari.fit(a,c)
    print('Alpha terpilih:', cari.best_params_['model__alpha'])
    print('MAE validasi:', round(-cari.best_score_,2))
    print('MAE test akhir:', round(mean_absolute_error(d,cari.predict(b)),2))
