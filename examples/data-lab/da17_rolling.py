import pandas as pd
if __name__=='__main__':
    data=pd.Series([10.,20.,30.,100.,50.],index=pd.date_range('2026-10-01',periods=5,freq='D'))
    lalu=data.shift(1).rolling(window=3,min_periods=3).mean()
    print('Rerata tiga observasi sebelumnya:',[None if pd.isna(x) else float(x) for x in lalu])
    print('Rerata berjalan terakhir:',float(data.rolling(3,min_periods=3).mean().iloc[-1]))
    print('Urutan waktu:',data.index.is_monotonic_increasing)
