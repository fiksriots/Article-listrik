import socket
# AI_NUMERICHOST memastikan contoh ini tidak bergantung pada DNS luar.
hasil = socket.getaddrinfo('127.0.0.1', 50501,
    family=socket.AF_INET, type=socket.SOCK_STREAM, flags=socket.AI_NUMERICHOST)
alamat = sorted({item[4][0] for item in hasil})
print('Alamat kandidat:', alamat)
print('Resolusi bukan pemeriksaan layanan')
# Untuk nama domain lab sendiri, hapus AI_NUMERICHOST dan tangani socket.gaierror.
