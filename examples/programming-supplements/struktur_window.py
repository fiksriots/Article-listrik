def maksimum_jendela(data, k):
    if type(k) is not int or not 1 <= k <= len(data):
        raise ValueError('K harus 1..panjang data.')
    total = sum(data[:k])
    terbaik = total  # Bukan 0: semua jumlah bisa negatif.
    posisi = 0
    for kanan in range(k, len(data)):
        total += data[kanan] - data[kanan - k]
        if total > terbaik:
            terbaik, posisi = total, kanan - k + 1
    return posisi, terbaik


if __name__ == '__main__':
    print(maksimum_jendela([4, 2, -1, 5], 2))
    print(maksimum_jendela([-5, -2, -4], 2))
