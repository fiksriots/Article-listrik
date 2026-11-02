# Dataset fiktif: satu baris mewakili satu tiket.
tiket = [{'lokasi': 'A', 'menit': 20}, {'lokasi': 'A', 'menit': 40},
         {'lokasi': 'B', 'menit': 15}]
if __name__ == '__main__':
    total = sum(t['menit'] for t in tiket)
    print('Unit analisis: satu tiket')
    print('Jumlah tiket:', len(tiket))
    print('Rata-rata menit:', total / len(tiket))
