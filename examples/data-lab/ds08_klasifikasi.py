import numpy as np
from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score
if __name__ == '__main__':
    aktual=np.array([0,0,0,1,1,1])
    skor=np.array([0.1,0.6,0.2,0.4,0.8,0.9])  # Skor fiktif yang sudah disediakan.
    prediksi=(skor>=0.5).astype(int)
    print('Matriks [TN, FP; FN, TP]:', confusion_matrix(aktual,prediksi,labels=[0,1]).tolist())
    print('Precision/recall/F1:', [round(f(aktual,prediksi,zero_division=0),3) for f in [precision_score,recall_score,f1_score]])
