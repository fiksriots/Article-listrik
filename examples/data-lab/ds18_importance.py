from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance
def ukur():
    X,y=make_regression(n_samples=120,n_features=3,n_informative=1,shuffle=False,noise=5,random_state=42)
    a,b,c,d=train_test_split(X,y,test_size=.25,random_state=42)
    model=RandomForestRegressor(n_estimators=50,min_samples_leaf=2,random_state=42,n_jobs=1).fit(a,c)
    return permutation_importance(model,b,d,n_repeats=5,random_state=42,scoring='neg_mean_absolute_error',n_jobs=1)
if __name__=='__main__':
    hasil=ukur()
    print('Penurunan skor mean:',[round(float(v),2) for v in hasil.importances_mean])
    print('Fitur teratas:',int(hasil.importances_mean.argmax()))
    print('Importance bukan bukti sebab-akibat.')
