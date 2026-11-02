from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

def buat_grafik(folder):
    folder = Path(folder)
    folder.mkdir(parents=True, exist_ok=True)
    fig, ax = plt.subplots(figsize=(6, 4), layout='constrained')
    ax.bar(['Surabaya', 'Malang'], [1400000, 560000], color=['#357b73','#8b82af'])
    ax.set(title='Omzet latihan menurut kota', xlabel='Kota', ylabel='Rupiah')
    ax.ticklabel_format(axis='y', style='plain')
    target = folder / 'omzet-kota.png'
    fig.savefig(target, dpi=150)
    plt.close(fig)
    return target

if __name__ == '__main__':
    print('Grafik dibuat:', buat_grafik('hasil-latihan').name)
