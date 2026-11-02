import pandas as pd
if __name__ == '__main__':
    data = pd.DataFrame({'produk':['Router','Kabel','Switch'], 'jumlah':[2,5,1], 'harga':[500000,20000,300000]})
    pilihan = data.loc[(data['jumlah'] >= 2) & (data['harga'] > 0)].copy()
    pilihan['total'] = pilihan['jumlah'] * pilihan['harga']
    print(pilihan['produk'].tolist())
    print(pilihan['total'].tolist())
    print('Kolom sumber tetap:', data.columns.tolist())
