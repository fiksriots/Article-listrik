from concurrent.futures import ThreadPoolExecutor
from time import perf_counter
from urllib.request import build_opener,ProxyHandler
from lab_web import server_lab

def ukur(url):
    from urllib.parse import urlsplit
    parts=urlsplit(url)
    if parts.scheme!='http' or parts.hostname!='127.0.0.1' or parts.username or parts.password or parts.path!='/api/observasi':raise ValueError('Hanya endpoint loopback lab.')
    start=perf_counter()
    opener=build_opener(ProxyHandler({}))
    with opener.open(url,timeout=2) as response:
        response.read(4096)
        status=response.status
    return status,(perf_counter()-start)*1000

def nearest_rank(data,p):
    from math import ceil
    if not data or not 0<p<=1:raise ValueError('Data tidak kosong dan p pada (0,1].')
    return sorted(data)[ceil(len(data)*p)-1]

if __name__=='__main__':
    # Tepat 12 GET, maksimal 3 worker, hanya server yang dibuat oleh demo.
    with server_lab() as root,ThreadPoolExecutor(max_workers=3) as pool:
        results=list(pool.map(ukur,[root+'/api/observasi']*12))
    delays=[value for _,value in results]
    print('Permintaan/berhasil:',len(results),sum(status==200 for status,_ in results))
    print('p50_ms:',round(nearest_rank(delays,.5),3))
    print('p95_ms:',round(nearest_rank(delays,.95),3))
    print('Sampel lokal kecil, bukan kapasitas produksi')
