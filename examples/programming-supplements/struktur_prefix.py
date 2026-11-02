def buat_prefix(data):
    prefix = [0]
    for nilai in data:
        prefix.append(prefix[-1] + nilai)
    return prefix


def jumlah_rentang(prefix, kiri, kanan):
    # Prefix berasal dari buat_prefix; interval [kiri, kanan).
    if type(kiri) is not int or type(kanan) is not int:
        raise ValueError('Batas harus integer.')
    if not 0 <= kiri <= kanan < len(prefix):
        raise ValueError('Rentang di luar data.')
    return prefix[kanan] - prefix[kiri]


if __name__ == '__main__':
    prefix = buat_prefix([4, 2, -1, 5])
    print(prefix)
    print(jumlah_rentang(prefix, 1, 4))
    print(jumlah_rentang(prefix, 2, 2))
