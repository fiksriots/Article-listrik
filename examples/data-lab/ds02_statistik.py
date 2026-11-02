import numpy as np
if __name__ == '__main__':
    menit = np.array([10,12,13,15,100], dtype=float)
    print('Mean:', float(menit.mean()))
    print('Median:', float(np.median(menit)))
    print('Simpangan baku sampel:', round(float(menit.std(ddof=1)), 2))
    print('Proporsi > 20 menit:', float((menit>20).mean()))
