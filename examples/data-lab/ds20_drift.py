import numpy as np
def profil(nilai):
    data=np.asarray(nilai,dtype=float)
    if data.ndim!=1 or not len(data):raise ValueError('Butuh array satu dimensi tidak kosong.')
    valid=data[~np.isnan(data)]
    if not len(valid) or not np.isfinite(valid).all() or (valid<0).any() or (valid>100).any():
        raise ValueError('Beban valid berada pada 0..100 dan minimal satu nilai tersedia.')
    count,_=np.histogram(valid,bins=[0,25,50,100])
    return count/count.sum(),float(np.isnan(data).mean())
def bandingkan(acuan,baru):
    a,ma=profil(acuan);b,mb=profil(baru)
    return float(np.abs(a-b).sum()/2),ma,mb
if __name__=='__main__':
    jarak,lama,baru=bandingkan([10,20,30,40,50,np.nan],[60,70,80,90,np.nan,np.nan])
    print('Jarak distribusi histogram:',round(jarak,3))
    print('Missing acuan/baru:',round(lama,3),round(baru,3))
    print('Tanpa label baru, penurunan akurasi belum dapat disimpulkan.')
