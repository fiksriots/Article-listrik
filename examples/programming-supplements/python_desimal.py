from decimal import Decimal, InvalidOperation, ROUND_HALF_UP


def nilai_uang(teks: str) -> Decimal:
    if not isinstance(teks, str) or not 1 <= len(teks) <= 40:
        raise ValueError('Gunakan teks angka dengan panjang 1..40.')
    try:
        nilai = Decimal(teks)
        if not nilai.is_finite() or not Decimal('0') <= nilai <= Decimal('1000000000'):
            raise ValueError('Nilai harus terbatas dan berada pada 0..1 miliar.')
        return nilai.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    except InvalidOperation as exc:
        raise ValueError('Angka desimal tidak valid.') from exc


def total_baris(harga: str, jumlah: int) -> Decimal:
    if type(jumlah) is not int or not 1 <= jumlah <= 1000:
        raise ValueError('Jumlah harus integer 1..1000.')
    return nilai_uang(harga) * jumlah


if __name__ == '__main__':
    print(Decimal('0.1') + Decimal('0.2'))
    print(nilai_uang('12.345'))
    print(total_baris('12.345', 2))
