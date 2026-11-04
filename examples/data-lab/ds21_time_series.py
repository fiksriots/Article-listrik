import numpy as np

def walk_forward(values,start,lag):
    values=np.asarray(values,dtype=float)
    if values.ndim!=1 or not np.isfinite(values).all() or type(lag) is not int or lag<1 or not lag<=start<len(values):
        raise ValueError('Deret finite; start dan lag harus sesuai.')
    # Forecast satu langkah. Observasi sebelumnya sudah tersedia pada setiap langkah.
    predicted=np.array([values[t-lag] for t in range(start,len(values))])
    return predicted,float(np.abs(values[start:]-predicted).mean())

if __name__=='__main__':
    weekly=np.array([10,12,14,16,18,15,11],dtype=float)
    series=np.tile(weekly,6)+np.arange(42)*.2
    _,mae1=walk_forward(series,start=28,lag=1)
    _,mae7=walk_forward(series,start=28,lag=7)
    print('MAE lag 1:',round(mae1,3))
    print('MAE lag 7:',round(mae7,3))
    print('14 evaluasi satu langkah, bukan satu forecast 14 langkah')
