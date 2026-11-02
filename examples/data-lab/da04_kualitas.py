from pathlib import Path
import numpy as np
import pandas as pd

def bersihkan_penjualan(raw):
    wajib = {'id', 'tanggal', 'kota', 'produk', 'jumlah', 'harga_rupiah'}
    if not wajib <= set(raw.columns):
        raise ValueError('Kolom wajib belum lengkap.')
    data = raw.drop_duplicates().copy()
    duplikat_identik = len(raw) - len(data)
    data['tanggal'] = pd.to_datetime(data['tanggal'], format='%Y-%m-%d', errors='coerce')
    for col in ['id', 'kota', 'produk']:
        data[col] = data[col].astype('string').str.strip()
    for col in ['jumlah', 'harga_rupiah']:
        data[col] = pd.to_numeric(data[col], errors='coerce')
    valid = data['tanggal'].notna() & ~data['id'].duplicated(keep=False)
    for col in ['id', 'kota', 'produk']:
        valid &= data[col].notna() & data[col].ne('')
    valid &= np.isfinite(data['jumlah']) & data['jumlah'].between(1, 10000) & data['jumlah'].mod(1).eq(0)
    valid &= np.isfinite(data['harga_rupiah']) & data['harga_rupiah'].between(0, 1000000000) & data['harga_rupiah'].mod(1).eq(0)
    valid = valid.fillna(False)
    diterima = data.loc[valid].copy()
    ditolak = data.loc[~valid].copy()
    for col in ['jumlah', 'harga_rupiah']:
        diterima[col] = diterima[col].astype('int64')
    diterima['omzet_rupiah'] = diterima['jumlah'] * diterima['harga_rupiah']
    return diterima, ditolak, duplikat_identik

if __name__ == '__main__':
    raw = pd.read_csv(Path(__file__).resolve().parent / 'datasets/penjualan.csv', dtype={'id':'string'})
    baik, buruk, duplikat = bersihkan_penjualan(raw)
    print('Mentah:', len(raw))
    print('Duplikat identik:', duplikat)
    print('Ditolak:', len(buruk))
    print('Diterima:', len(baik))
