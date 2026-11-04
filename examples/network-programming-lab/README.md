# Pemrograman Jaringan · Python

Materi: https://article.fikss.site/programming/pemrograman-jaringan

Gunakan Python 3.12 atau lebih baru pada komputer sendiri. Semua paket merupakan pustaka bawaan Python; tidak perlu pip install. Ekstrak ZIP lengkap, lalu buka terminal di folder network-programming-lab.

```sh
python np01_endpoint.py
python np05_tcp.py
python np06_framing.py
python np07_udp.py
python np10_http.py
python np13_asyncio.py
python np15_monitor.py
python np16_status.py
python -m unittest test_lab.py -v
```

Jalankan file lain sesuai label di artikel. Di sebagian komputer, perintah Python adalah python3 atau py. Website menyajikan materi dan kuis, sedangkan socket dijalankan di komputer latihan. Contoh socket sudah membuat server dan client pada satu program; tidak perlu menyalakan server terpisah sebelum menjalankan demo.

## Urutan

1. np01–np04: endpoint, IPv4/IPv6 dan port, resolusi alamat, bytes dan UTF-8.
2. np05–np09: TCP echo, framing, UDP, timeout, protokol JSON.
3. np10–np14: HTTP lokal, konfigurasi TLS, thread pool, asyncio, logging.
4. np15–np16: pemeriksa layanan dengan CSV dan layanan status perangkat fiktif.

lab_common.py menyediakan server TCP loopback dan framing: header unsigned empat byte network byte order, payload maksimal 4096 byte. Baca helper ini bersama artikel framing. np15 juga mengimpor klasifikasi dari np14_logging.py; gunakan paket lengkap.

Semua koneksi demo hanya ke 127.0.0.1. Server bind pada port 0 sehingga OS memilih port kosong; port dibaca setelah bind. Contoh ditutup setelah selesai, diberi batas waktu, dan memakai jumlah pekerjaan kecil. np03 memakai AI_NUMERICHOST: ia mengenalkan getaddrinfo tanpa kueri DNS luar. np11 hanya memeriksa konfigurasi konteks TLS, belum melakukan handshake. np14 memakai error buatan untuk menjelaskan klasifikasi log.

HTTP demo memakai http.server untuk praktik lokal. Server contoh belum mencakup kebutuhan produksi. Sebelum penggunaan jaringan nyata, rancang batas koneksi/antrean, deadline keseluruhan, autentikasi, otorisasi, TLS, logging, shutdown, dan penanganan error yang sesuai.

## Batas kesimpulan

TCP terhubung bukan jaminan aplikasi sehat, ping ICMP berhasil, pelanggan dapat internet, atau SLA terpenuhi. Timeout bukan diagnosis perangkat mati. Alamat sumber UDP atau ID JSON bukan autentikasi. Data BTS-LAB pada np16 adalah dictionary fiktif; tidak ada akses router, password, atau perubahan konfigurasi perangkat.

np15 menyimpan hasil-latihan/cek-layanan.csv pada direktori kerja. Menjalankan ulang memperbarui file tersebut. Simpan salinan jika ingin membandingkan hasil. Semua percobaan mengikuti endpoint lab yang ditentukan; tidak ada pemindaian subnet atau rentang port.

## Pengembangan mandiri

Pisahkan bagian server dan client np05 ke dua file untuk dua terminal setelah memahami alurnya. Untuk percobaan itu, pilih satu port lab yang sama dan tetap bind di loopback; jalankan server dahulu. Jangan menggunakan port 0 pada server terpisah tanpa menyampaikan port pilihannya ke client. Model EOF pada np05 berbeda dari beberapa frame dalam satu koneksi di np06.

Paket dibuat dengan python scripts/package-network-lab.py dari akar repositori. Pemeriksaan isi, keluaran program dari ZIP, serta pengujian protokol menggunakan python scripts/check-network-programming.py.
