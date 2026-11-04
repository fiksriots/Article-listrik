import hashlib,json
rilis={'versi':'0.1.0','python':'3.12','kontrak':'ringkasan-v1'}
digest=hashlib.sha256(json.dumps(rilis,sort_keys=True).encode()).hexdigest()
print('Versi:',rilis['versi'])
print('Digest manifest:',digest[:12])
print('Urutan: uji staging, periksa API, rilis, pantau, pulihkan jika perlu')
# Digest ini milik manifest contoh, bukan digest image Docker.
