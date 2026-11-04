from pathlib import Path
from tempfile import TemporaryDirectory
from contextlib import closing
import sqlite3
from praktik_layanan.pipeline import buat_laporan
from praktik_layanan.store import baca
with TemporaryDirectory() as work:
    folder=Path(work);source=folder/'layanan.csv'
    source.write_text('layanan,hasil\na,ok\nb,timeout\na,ok\nc,refused\nd,asing\n',encoding='utf-8')
    result=buat_laporan(source,folder/'laporan.sqlite',folder/'hasil.json')
    with closing(sqlite3.connect(folder/'laporan.sqlite')) as conn:
        persisted=baca(conn)
    print('Diterima/ditolak:',result['total'],result['ditolak'])
    print('Rasio sampel:',result['rasio_ok'])
    print('Database sesuai:',persisted==result)
