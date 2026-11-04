from pathlib import Path
from tempfile import TemporaryDirectory
from praktik_layanan.pipeline import buat_laporan
with TemporaryDirectory() as work:
    folder=Path(work);source=folder/'input.csv'
    source.write_text('layanan,hasil\na,ok\nb,timeout\n',encoding='utf-8')
    result=buat_laporan(source,folder/'laporan.sqlite',folder/'ringkasan.json')
    print('Ringkasan:',result)
    print('Dua keluaran:',(folder/'laporan.sqlite').exists(),(folder/'ringkasan.json').exists())
