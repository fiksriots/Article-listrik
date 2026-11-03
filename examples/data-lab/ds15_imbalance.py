import numpy as np
from sklearn.metrics import f1_score,confusion_matrix,average_precision_score
def pilih_ambang(aktual,skor):
    return max([.3,.5,.7],key=lambda t:(f1_score(aktual,np.asarray(skor)>=t,zero_division=0),t))
if __name__=='__main__':
    yval=np.array([0,0,0,0,0,0,0,1,1,1]);pval=np.array([.1,.2,.3,.1,.2,.4,.5,.4,.6,.8])
    ambang=pilih_ambang(yval,pval)
    # Skor fiktif pada set test terpisah, dipakai setelah ambang dipilih.
    ytest=np.array([0,0,0,0,1,1]);ptest=np.array([.1,.2,.6,.1,.4,.9])
    print('Ambang dari validation:',ambang)
    print('Matriks test:',confusion_matrix(ytest,ptest>=ambang,labels=[0,1]).tolist())
    print('Average precision test:',round(average_precision_score(ytest,ptest),3))
