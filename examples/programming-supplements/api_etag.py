import hashlib
import json
from typing import Annotated
from fastapi import FastAPI, Header, Response
from fastapi.testclient import TestClient


def create_app():
    app = FastAPI()

    @app.get('/katalog')
    def katalog(if_none_match: Annotated[str | None, Header()] = None):
        body = json.dumps({'materi': ['Python', 'Web']}, ensure_ascii=False, separators=(',', ':')).encode()
        etag = '"' + hashlib.sha256(body).hexdigest() + '"'
        headers = {'ETag': etag, 'Cache-Control': 'private, max-age=0, must-revalidate'}
        # Nilai ETag server ini hanya hash heksadesimal, tanpa koma.
        cocok = if_none_match is not None and any(
            item.strip() == '*' or item.strip().removeprefix('W/') == etag
            for item in if_none_match.split(',')
        )
        if cocok:
            return Response(status_code=304, headers=headers)
        return Response(content=body, media_type='application/json', headers=headers)

    return app


if __name__ == '__main__':
    with TestClient(create_app()) as client:
        pertama = client.get('/katalog')
        ulang = client.get('/katalog', headers={'If-None-Match': pertama.headers['etag']})
        lemah = client.get('/katalog', headers={'If-None-Match': 'W/' + pertama.headers['etag']})
        assert pertama.json() == {'materi': ['Python', 'Web']}
        assert ulang.content == b''
        assert lemah.status_code == 304
        assert client.get('/katalog', headers={'If-None-Match': '"lama"'}).status_code == 200
        print(pertama.status_code)
        print(ulang.status_code)
        print('Body 304 kosong:', not ulang.content)
