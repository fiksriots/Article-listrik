import numpy as np
from scipy.stats import permutation_test
def uji_selisih(a,b):
    a,b=np.asarray(a,dtype=float),np.asarray(b,dtype=float)
    if a.ndim!=1 or b.ndim!=1 or min(len(a),len(b))<2 or not np.isfinite(a).all() or not np.isfinite(b).all():
        raise ValueError('Dua sampel finite, masing-masing minimal dua observasi.')
    return permutation_test((a,b),lambda x,y:np.mean(x)-np.mean(y),
        permutation_type='independent',vectorized=False,alternative='two-sided',n_resamples=999,rng=np.random.default_rng(42))
if __name__=='__main__':
    hasil=uji_selisih([10,11,12,13,14,15],[13,14,15,16,17,18])
    print('Selisih mean A-B:',round(float(hasil.statistic),2))
    print('P-value ilustrasi:',round(float(hasil.pvalue),3))
    print('Desain kelompok harus mendukung asumsi pertukaran label.')
