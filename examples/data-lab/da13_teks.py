import pandas as pd
def normalisasi_kota(nilai):
    asal=pd.Series(nilai,dtype='string')
    bersih=asal.str.normalize('NFKC').str.strip().str.casefold()
    bersih=bersih.mask(bersih.eq(''),pd.NA)
    kamus={'sby':'surabaya','surabaya':'surabaya','malang':'malang'}
    kota=bersih.map(kamus).astype('string')
    belum_dikenal=bersih.notna() & kota.isna()
    return kota,bersih.loc[belum_dikenal].tolist(),int(bersih.isna().sum())
if __name__=='__main__':
    kota,asing,kosong=normalisasi_kota([' Surabaya ','SBY','MALANG',None,'Kota Baru'])
    print('Surabaya:',int(kota.eq('surabaya').sum()))
    print('Belum dikenal:',asing)
    print('Kosong:',kosong)
