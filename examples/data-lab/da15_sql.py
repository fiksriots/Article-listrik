from contextlib import closing
import sqlite3
import pandas as pd
def cari_lokasi(nama):
    with closing(sqlite3.connect(':memory:')) as con:
        data=pd.DataFrame({'lokasi':['A','A','B'],'menit':[10,30,15]})
        data.to_sql('tiket',con,index=False)
        return pd.read_sql_query('SELECT lokasi, COUNT(*) AS jumlah, AVG(menit) AS rerata FROM tiket WHERE lokasi=? GROUP BY lokasi',con,params=(nama,))
if __name__=='__main__':
    hasil=cari_lokasi('A')
    print('Jumlah tiket A:',int(hasil.loc[0,'jumlah']))
    print('Rerata menit:',float(hasil.loc[0,'rerata']))
    print('Input mirip SQL tetap nilai:',cari_lokasi("A' OR 1=1 --").empty)
