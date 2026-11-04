from praktik_layanan.core import konfigurasi
print('Batas default:',konfigurasi({}))
print('Batas konfigurasi:',konfigurasi({'LAB_MAX_ROWS':'50'}))
try:
    konfigurasi({'LAB_MAX_ROWS':'0'})
except ValueError:
    print('Konfigurasi invalid ditolak sebelum pekerjaan dimulai')
