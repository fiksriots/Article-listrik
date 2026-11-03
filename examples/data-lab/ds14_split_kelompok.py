import numpy as np
from sklearn.model_selection import GroupKFold,TimeSeriesSplit
if __name__=='__main__':
    X=np.arange(18).reshape(-1,1);grup=np.repeat(np.arange(6),3)
    for i,(train,val) in enumerate(GroupKFold(n_splits=3).split(X,groups=grup),1):
        print(f'Group fold {i}: terpisah',set(grup[train]).isdisjoint(grup[val]))
    for i,(train,val) in enumerate(TimeSeriesSplit(n_splits=3,gap=1).split(np.arange(12)),1):
        print(f'Time fold {i}: train terakhir {train[-1]}, validasi pertama {val[0]}')
