import numpy as np
if __name__ == '__main__':
    # Keduanya mengikuti tren waktu fiktif, bukan bukti sebab-akibat.
    waktu=np.arange(1,6)
    tiket=3*waktu+2
    penjualan_payung=5*waktu+10
    print('Korelasi:', round(float(np.corrcoef(tiket,penjualan_payung)[0,1]), 3))
    print('Sebab-akibat terbukti:', False)
