import argparse


def jumlah_valid(teks):
    try:
        nilai = int(teks)
    except ValueError as exc:
        raise argparse.ArgumentTypeError('Harus berupa integer.') from exc
    if not 1 <= nilai <= 100:
        raise argparse.ArgumentTypeError('Jumlah harus 1..100.')
    return nilai


def buat_parser():
    parser = argparse.ArgumentParser(description='Ringkasan perangkat latihan.')
    parser.add_argument('--nama', required=True, help='Nama perangkat, bukan secret.')
    parser.add_argument('--jumlah', type=jumlah_valid, default=1)
    return parser


def main(argv=None):
    args = buat_parser().parse_args(argv)
    nama = args.nama.strip()
    if not nama:
        buat_parser().error('Nama tidak boleh kosong.')
    print(f'{nama}: {args.jumlah} unit')


if __name__ == '__main__':
    main()
