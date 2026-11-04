import json
from urllib.request import build_opener,ProxyHandler
from lab_web import server_lab

def baca_api(root):
    opener=build_opener(ProxyHandler({}))
    with opener.open(root+'/api/observasi',timeout=2) as response:
        if response.headers.get_content_type()!='application/json':raise ValueError('Butuh JSON.')
        raw=response.read(4097)
        if len(raw)>4096:raise ValueError('Respons melebihi batas.')
        data=json.loads(raw)
        if not isinstance(data,list) or any(not isinstance(x,dict) or set(x)!={'id','layanan','hasil'} for x in data):
            raise ValueError('Skema daftar tidak sesuai.')
        if any(type(x['id']) is not int or x['id']<1 or not isinstance(x['layanan'],str) or not x['layanan'].strip() or len(x['layanan'])>40 or x['hasil'] not in ('ok','timeout','refused') for x in data):raise ValueError('Nilai respons tidak sesuai.')
        return data

if __name__=='__main__':
    with server_lab() as root:
        print('Observasi dari API lokal:',len(baca_api(root)))
    print('Koneksi HTTP benar-benar terjadi pada loopback')
