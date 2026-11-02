import base64
import binascii
import hashlib
import hmac
from typing import Annotated
from fastapi import FastAPI, HTTPException, Query
from fastapi.testclient import TestClient

DATA = tuple({'id': i, 'nama': f'Materi {i}'} for i in range(1, 6))


def create_app(secret: bytes):
    if not isinstance(secret, bytes) or len(secret) < 32:
        raise ValueError('Kunci minimal 32 byte; konfigurasi server, bukan input client.')
    app = FastAPI()

    def encode(last_id):
        payload = f'v1:{last_id}'.encode('ascii')
        signature = hmac.digest(secret, payload, hashlib.sha256)
        return base64.urlsafe_b64encode(payload + b'.' + signature).decode('ascii')

    def decode(token):
        try:
            raw = base64.b64decode(token, altchars=b'-_', validate=True)
            if len(raw) < 36 or raw[-33:-32] != b'.':
                raise ValueError('Format')
            payload, signature = raw[:-33], raw[-32:]
            if not hmac.compare_digest(hmac.digest(secret, payload, hashlib.sha256), signature):
                raise ValueError('Signature')
            versi, angka = payload.decode('ascii').split(':')
            if versi != 'v1' or not angka.isdecimal() or not 0 <= int(angka) <= 1000000000:
                raise ValueError('Isi')
            return int(angka)
        except (ValueError, UnicodeError, binascii.Error):
            raise HTTPException(status_code=400, detail='Cursor tidak valid') from None

    @app.get('/materi')
    def materi(limit: Annotated[int, Query(ge=1, le=3)] = 2,
               cursor: Annotated[str | None, Query(max_length=256)] = None):
        after = decode(cursor) if cursor is not None else 0
        kandidat = [item for item in DATA if item['id'] > after][:limit + 1]
        items = kandidat[:limit]
        lanjut = encode(items[-1]['id']) if len(kandidat) > limit else None
        return {'items': items, 'next_cursor': lanjut}

    return app


if __name__ == '__main__':
    # Hanya fixture lokal. Server nyata membaca secret dari konfigurasi rahasia.
    with TestClient(create_app(b'kunci-latihan-lokal-bukan-produksi-123456')) as client:
        ids = []
        cursor = None
        while True:
            params = {'limit': 2}
            if cursor is not None:
                params['cursor'] = cursor
            data = client.get('/materi', params=params).json()
            ids.extend(item['id'] for item in data['items'])
            cursor = data['next_cursor']
            if cursor is None:
                break
        assert client.get('/materi', params={'cursor': 'rusak'}).status_code == 400
        assert client.get('/materi', params={'limit': 0}).status_code == 422
        print(ids)
        print('Cursor akhir:', cursor)
