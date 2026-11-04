from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread
from urllib.request import build_opener,ProxyHandler
import json
from praktik_layanan.pipeline import buat_laporan
from praktik_layanan.web import buat_server
with TemporaryDirectory() as work:
    folder=Path(work);source=folder/'input.csv'
    source.write_text('layanan,hasil\na,ok\nb,refused\n',encoding='utf-8')
    expected=buat_laporan(source,folder/'db.sqlite',folder/'hasil.json')
    with buat_server(folder/'db.sqlite') as server:
        worker=Thread(target=server.serve_forever,kwargs={'poll_interval':.02});worker.start()
        opener=build_opener(ProxyHandler({}));root='http://127.0.0.1:'+str(server.server_port)
        try:
            with opener.open(root+'/',timeout=2) as response:
                html=response.read().decode('utf-8')
                print('Halaman:',response.status,'Dashboard Layanan Fiktif' in html)
            with opener.open(root+'/api/ringkasan',timeout=2) as response:
                print('API sesuai database:',json.load(response)==expected)
        finally:server.shutdown();worker.join(timeout=3)
# Untuk membuka dashboard yang tetap hidup di browser, ikuti perintah serve di README.
