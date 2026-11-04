from importlib.metadata import version
from praktik_layanan.core import ringkas
print('Versi distribusi:',version('praktik-layanan-lab'))
print('Nama import: praktik_layanan')
print('Ringkasan kosong:',ringkas([])['total'])
# Distribusi memakai tanda hubung; import Python memakai underscore.
