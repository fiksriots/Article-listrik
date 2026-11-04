# Kebutuhan dan kriteria penerimaan

Tujuan: pembaca mengolah CSV layanan fiktif menjadi ringkasan yang dapat dilacak ke sumber, menyimpan hasil ke SQLite, lalu menampilkan API dan dashboard lokal baca-saja.

| Masukan/kejadian | Hasil yang diterima |
|---|---|
| Dataset bawaan lima observasi | Empat diterima, satu ditolak |
| Dua ok dari empat diterima | rasio_ok = 0.5; tidak disebut SLA |
| Tidak ada observasi diterima | total 0, rasio_ok null |
| Kolom CSV salah atau batas baris terlampaui | Proses gagal sebelum menyimpan ringkasan baru |
| Baris dengan hasil asing | Baris ditolak dan dihitung |
| API /api/ringkasan setelah build-report | JSON sesuai database |
| Database belum tersedia | API 503, tidak membuat database baru |
| GET path lain | 404 |
| POST | Tidak ada operasi tulis; 501 dari handler dasar |

Batas: laporan terbaru mengganti laporan bernama terbaru; file JSON dan database tidak memiliki transaksi bersama. Tidak ada autentikasi, TLS terminator, service manager, atau readiness untuk produksi. Kebutuhan tersebut harus dibahas sebelum mengubah lingkup aplikasi.

Review perubahan: cocokkan kasus penerimaan, periksa invalid input, I/O dan pembersihan resource, bukti test, dokumentasi, dampak data, serta rencana pemulihan. Hindari hanya membahas gaya nama variabel.
