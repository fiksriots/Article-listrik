import numpy as np

def interval_bootstrap(data, seed=42):
    data=np.asarray(data, dtype=float)
    if data.ndim!=1 or len(data)<2 or not np.isfinite(data).all():
        raise ValueError('Butuh minimal dua observasi numerik terbatas.')
    rng=np.random.default_rng(seed)
    rerata=rng.choice(data, size=(2000,len(data)), replace=True).mean(axis=1)
    return np.percentile(rerata,[2.5,97.5])

if __name__ == '__main__':
    batas=interval_bootstrap([10,12,15,18,20,25])
    print('Interval ilustrasi:', [round(float(x),2) for x in batas])
    print('Asumsi: sampel cukup mewakili dan observasi independen.')
