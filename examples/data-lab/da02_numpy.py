import numpy as np
if __name__ == '__main__':
    rtt = np.array([[20, 30, 40], [15, 20, 25]], dtype=float)
    print('Bentuk:', rtt.shape)
    print('Rata-rata per perangkat:', rtt.mean(axis=1).tolist())
    print('Jumlah sampel > 25 ms:', int((rtt > 25).sum()))
