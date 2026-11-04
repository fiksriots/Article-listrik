from praktik_layanan.core import ringkas
# Core dapat diuji tanpa file, database, atau server.
rows=[{'layanan':'a','hasil':'refused'}]
print('Aturan murni:',ringkas(rows))
print('Adapter terpisah: io.py, store.py, web.py')
