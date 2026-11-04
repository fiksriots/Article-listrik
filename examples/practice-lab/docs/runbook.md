# Runbook lab: verifikasi, rilis, dan pemulihan

1. Simpan identitas commit, versi Python, versi dependensi, kontrak data, serta hash artefak yang benar. Digest manifest pada examples/r06_rilis.py bukan digest image Docker.
2. Jalankan pytest dan build wheel. Jika memakai Docker, build image dan catat digest aktual; jika memakai Actions, periksa run yang sesuai commit. Jangan menyebut konfigurasi CI sebagai run yang lulus.
3. Buat laporan dari dataset fiktif. Periksa total 4, ditolak 1, rasio_ok 0.5 pada JSON dan SQLite.
4. Jalankan versi kandidat pada staging lokal/port berbeda. Buka dashboard, uji /api/ringkasan, 404, database tidak tersedia, dan penutupan proses. Jangan menimpa file database ketika server latihan masih membaca saat uji rilis; hentikan server dahulu.
5. Pindahkan trafik hanya setelah pemeriksaan sesuai kebutuhan. Lab ini tidak menyediakan load balancer atau script switch trafik; langkah perpindahan merupakan rancangan untuk lingkungan yang dikelola sendiri.
6. Pantau respons API, error, durasi, dan kesesuaian data. Satu HTTP 200 tidak membuktikan semua kebutuhan terpenuhi.
7. Jika kandidat gagal, hentikan kandidat dan jalankan kembali artefak versi sebelumnya dengan konfigurasi yang sesuai kontrak data. Uji endpoint lagi. Simpan log yang sudah dibersihkan dari secret.
8. Rollback kode tidak otomatis membatalkan migrasi atau mengembalikan data. Untuk perubahan skema, rancang kompatibilitas, backup, dan uji pemulihan terpisah.

## Scheduler

examples/p07_jadwal.py menghitung jadwal 08:00 UTC berikutnya dan ledger idempotensi. Ia tidak memasang cron atau menunggu jadwal. Pada Linux yang memakai cron, contoh berikut adalah TEMPLATE: ganti seluruh /path/lab dengan path absolut yang benar, pastikan timezone daemon, akses file, environment, dan pencatatan output. Jadwal lima kolom ini dibaca menurut timezone cron setempat, bukan otomatis UTC.

```cron
0 8 * * * /path/lab/.venv/bin/python -m praktik_layanan.cli build-report --input /path/lab/datasets/layanan.csv --db /path/lab/hasil/laporan.sqlite --output /path/lab/hasil/ringkasan.json >> /path/lab/hasil/job.log 2>&1
```

Buat folder output dahulu. Cegah job bertumpuk dengan mekanisme locking yang sesuai platform sebelum penggunaan berulang. Ledger contoh hanya mendeteksi kunci/payload yang sama pada SQLite, bukan mengunci semua efek eksternal. Windows Task Scheduler mempunyai konfigurasi berbeda.

## Latihan pemulihan SQLite

Jalankan python examples/r09_pemulihan.py. Database dan backup dibuat pada folder sementara; backup menyimpan total 2, database aktif kemudian menjadi 99, dan pemulihan ke file baru tetap 2. Periksa struktur dengan PRAGMA integrity_check sekaligus isi laporan. Helper menolak file tujuan yang sudah ada. Latihan tidak memindahkan trafik atau menimpa database aktif. Rencana pemulihan nyata juga perlu menguji akses, versi aplikasi, cakupan kehilangan data, waktu pemulihan, dan prosedur pergantian yang sesuai lingkungan.
