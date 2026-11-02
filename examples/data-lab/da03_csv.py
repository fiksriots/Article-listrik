from pathlib import Path
import pandas as pd
if __name__ == '__main__':
    path = Path(__file__).resolve().parent / 'datasets/penjualan.csv'
    df = pd.read_csv(path, dtype={'id': 'string'})
    print('Baris:', len(df))
    print('Kolom:', len(df.columns))
    print('Jumlah kosong:', int(df['jumlah'].isna().sum()))
    print('ID pertama:', df.loc[0, 'id'])
