from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread
from urllib.request import build_opener,ProxyHandler
import json
from praktik_layanan.pipeline import buat_laporan
from praktik_layanan.web import buat_server
with TemporaryDirectory() as work:
    folder=Path(work);source=folder/'input.csv'
    source.write_text('layanan,hasil\na,ok\n',encoding='utf-8')
    buat_laporan(source,folder/'db.sqlite',folder/'hasil.json')
    with buat_server(folder/'db.sqlite') as server:
        worker=Thread(target=server.serve_forever,kwargs={'poll_interval':.02});worker.start()
        try:
            url='http://127.0.0.1:'+str(server.server_port)+'/api/ringkasan'
            opener=build_opener(ProxyHandler({}))
            with opener.open(url,timeout=2) as response:
                raw=response.read(4097)
                if len(raw)>4096:raise ValueError('Respons terlalu besar.')
                data=json.loads(raw)
                if type(data.get('total')) is not int:raise ValueError('Skema total salah.')
                print('HTTP:',response.status)
                print('Total dari API:',data['total'])
        finally:server.shutdown();worker.join(timeout=3)
