import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
if __name__ == '__main__':
    train, test=train_test_split(np.arange(20),test_size=0.2,random_state=42)
    print('Train/test:', len(train), len(test))
    print('Tanpa indeks tumpang tindih:', set(train).isdisjoint(test))
    # Contoh terpisah: statistik preprocessing hanya dari train.
    scaler=StandardScaler().fit([[1.],[2.],[3.],[4.]])
    scaler.transform([[100.],[200.]])
    print('Mean yang dipelajari:', scaler.mean_.tolist())
