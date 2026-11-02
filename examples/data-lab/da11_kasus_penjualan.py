from pathlib import Path
import pandas as pd
from da04_kualitas import bersihkan_penjualan

def analisis_penjualan(sumber, folder):
    raw = pd.read_csv(sumber, dtype={'id':'string'})
    baik, buruk, duplikat = bersihkan_penjualan(raw)
    folder = Path(folder)
    folder.mkdir(parents=True, exist_ok=True)
    ringkas = baik.groupby('kota', as_index=False, sort=True)['omzet_rupiah'].sum()
    ringkas.to_csv(folder/'omzet-per-kota.csv', index=False)
    buruk.to_csv(folder/'baris-ditolak.csv', index=False)
    # Grafik memakai hasil aktual, bukan angka yang ditulis manual.
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(figsize=(6,4), layout='constrained')
    ax.bar(ringkas['kota'], ringkas['omzet_rupiah'])
    ax.set(title='Omzet data diterima — latihan', xlabel='Kota', ylabel='Rupiah')
    ax.ticklabel_format(axis='y', style='plain')
    fig.savefig(folder/'penjualan.png', dpi=150)
    plt.close(fig)
    return baik, buruk, duplikat, ringkas

if __name__ == '__main__':
    baik, buruk, duplikat, ringkas = analisis_penjualan(Path(__file__).resolve().parent/'datasets/penjualan.csv','hasil-latihan')
    print('Diterima/ditolak/duplikat:', len(baik), len(buruk), duplikat)
    print('Omzet data diterima:', int(baik['omzet_rupiah'].sum()))
    print(ringkas.set_index('kota')['omzet_rupiah'].to_dict())
