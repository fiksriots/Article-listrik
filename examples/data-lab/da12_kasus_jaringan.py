from pathlib import Path
import pandas as pd
import numpy as np

def ringkas_monitoring(data, sampel_diharapkan=4):
    if type(sampel_diharapkan) is not int or sampel_diharapkan < 1:
        raise ValueError('Jumlah sampel yang diharapkan harus positif.')
    if not {'waktu','perangkat','up','rtt_ms'} <= set(data.columns) or data.empty:
        raise ValueError('Data harus mempunyai kolom monitoring dan minimal satu sampel.')
    data = data.copy()
    data['perangkat'] = data['perangkat'].astype('string').str.strip()
    for col in ['up','rtt_ms']:
        data[col] = pd.to_numeric(data[col], errors='raise')
    data['waktu'] = pd.to_datetime(data['waktu'], utc=True, errors='raise')
    if data[['perangkat','waktu']].isna().any().any() or data['perangkat'].eq('').any() or data.duplicated(['perangkat','waktu']).any():
        raise ValueError('Identitas sampel kosong atau duplikat.')
    if not data['up'].dropna().isin([0,1]).all() or not np.isfinite(data['rtt_ms'].dropna()).all() or (data['rtt_ms'].dropna()<0).any():
        raise ValueError('Status atau RTT tidak valid.')
    hasil=[]
    for nama, grup in data.groupby('perangkat', sort=True):
        valid=int(grup['up'].notna().sum())
        if len(grup)>sampel_diharapkan:
            raise ValueError('Jadwal sampel tidak sesuai.')
        up=int(grup['up'].eq(1).sum())
        hasil.append({'perangkat':nama, 'sampel_valid':valid, 'coverage_pct':100*valid/sampel_diharapkan,
                      'up_teramati_pct':100*up/valid if valid else float('nan'),
                      'rtt_rata_ms':grup.loc[grup['up'].eq(1),'rtt_ms'].mean()})
    return pd.DataFrame(hasil)

if __name__ == '__main__':
    data=pd.read_csv(Path(__file__).resolve().parent/'datasets/monitoring.csv')
    hasil=ringkas_monitoring(data)
    for row in hasil.itertuples():
        print(f'{row.perangkat}: coverage {row.coverage_pct:.1f}%; up teramati {row.up_teramati_pct:.1f}%; RTT {row.rtt_rata_ms:.1f} ms')
