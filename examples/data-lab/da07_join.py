import pandas as pd
if __name__ == '__main__':
    tiket = pd.DataFrame({'id':[1,2,3], 'lokasi':['A','B','C']})
    lokasi = pd.DataFrame({'lokasi':['A','B'], 'wilayah':['Utara','Selatan']})
    hasil = tiket.merge(lokasi, on='lokasi', how='left', validate='many_to_one', indicator=True)
    print('Baris sebelum/sesudah:', len(tiket), len(hasil))
    print('Tidak cocok:', hasil.loc[hasil['_merge']=='left_only','lokasi'].tolist())
    try:
        tiket.merge(pd.concat([lokasi, lokasi.iloc[[0]]]), on='lokasi', validate='many_to_one')
    except pd.errors.MergeError:
        print('Master duplikat ditolak')
