import numpy as np
import pandas as pd
def tandai_iqr(nilai):
    data=pd.Series(nilai,dtype=float)
    valid=data.dropna()
    if len(valid)<4 or not np.isfinite(valid).all():
        raise ValueError('Butuh minimal empat nilai finite untuk ilustrasi IQR.')
    q1,q3=valid.quantile([.25,.75]);iqr=q3-q1
    bawah,atas=q1-1.5*iqr,q3+1.5*iqr
    tanda=data.notna() & ((data<bawah)|(data>atas))
    return float(bawah),float(atas),tanda
if __name__=='__main__':
    data=[10,11,12,13,14,60]
    bawah,atas,tanda=tandai_iqr(data)
    print('Batas:',bawah,atas)
    print('Perlu ditinjau:',pd.Series(data).loc[tanda].tolist())
    print('Baris sumber tetap:',len(data))
