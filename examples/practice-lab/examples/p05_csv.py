from pathlib import Path
from tempfile import TemporaryDirectory
from praktik_layanan.io import baca_csv
with TemporaryDirectory() as work:
    source=Path(work)/'input.csv'
    source.write_text('layanan,hasil\na,ok\nb,asing\nc,timeout\n',encoding='utf-8')
    accepted,rejected=baca_csv(source)
    print('Diterima:',len(accepted))
    print('Nomor baris ditolak:',rejected)
    print('Sumber tetap:',len(source.read_text().splitlines()),'baris')
