# Data Analysis & Data Science · lab pemula

Materi:
- https://article.fikss.site/programming/data-analysis
- https://article.fikss.site/programming/data-science

Seluruh data bersifat FIKTIF/SINTETIS. Tidak ada akses router, data pelanggan, layanan berbayar, atau API luar. Paket ini merupakan latihan, bukan sistem penilaian SLA atau pengendali perangkat.

## Menjalankan

Gunakan Python 3.12. Buka terminal pada folder data-lab hasil ekstraksi.

```sh
python -m venv .venv
```

Aktifkan pada macOS/Linux: `source .venv/bin/activate`.
Windows PowerShell: `.venv\Scripts\Activate.ps1`.
Jika aktivasi dibatasi, pakai `.venv\Scripts\python.exe` langsung sebagai pengganti python; tidak perlu mengubah kebijakan sistem.

```sh
python -m pip install -r requirements.lock.txt
python da01_pertanyaan.py
python da11_kasus_penjualan.py
python da12_kasus_jaringan.py
python ds11_kasus_durasi.py
python ds12_kasus_risiko.py
python -m unittest test_lab.py -v
```

Jalankan file lain sesuai label pada artikel. Lock memuat versi pengujian Python 3.12; requirements.txt hanya daftar paket utama jika ingin mencoba lingkungan lain. Pembaruan versi bisa mengubah angka pembulatan atau hasil model, sehingga uji ulang diperlukan. Tidak perlu Jupyter; bila memakai notebook, jalankan ulang dari awal dan sesuaikan path karena __file__ tidak tersedia di notebook.

## Isi

- da01–da12: pertanyaan, NumPy, CSV, kualitas data, filter, agregasi, join, grafik, waktu/coverage, laporan, dan dua studi kasus.
- ds01–ds12: definisi masalah, statistik, bootstrap, korelasi, split, pipeline, regresi, klasifikasi, validasi, clustering, dan dua studi kasus.
- datasets/penjualan.csv: 8 baris fiktif; 1 duplikat identik, 2 invalid, 5 diterima. Omzet data diterima Rp1.960.000, bukan laba atau omzet lengkap semua transaksi.
- datasets/monitoring.csv: dua perangkat fiktif dan empat jadwal polling per perangkat. Coverage serta proporsi up teramati tidak sama dengan durasi uptime atau SLA kontinu.
- test_lab.py: pengujian aturan data, indikator, pipeline, dan artefak.

Script memakai lokasi __file__ untuk menemukan dataset. da11 memakai helper da04_kualitas.py, sehingga gunakan paket lengkap. Banyak contoh kecil menyimpan datanya langsung di kode agar dapat dibaca tanpa mengunduh sumber lain.

File laporan dan grafik dibuat pada folder hasil-latihan di direktori kerja. Gunakan folder latihan terpisah; berkas keluaran dengan nama yang sama diperbarui jika script diulang. Data sumber tidak ditimpa. Jangan mengganti CSV latihan dengan data pelanggan tanpa meninjau akses, izin, identitas, retensi, serta tujuan analisis.

## Batas pemodelan

Regresi dan klasifikasi memakai data sintetis dengan seed. Tidak ada target atau informasi masa depan yang boleh dijadikan fitur ketika tidak tersedia pada waktu prediksi. Preprocessing dipelajari dari train, pemilihan model memakai validation, test akhir disimpan sampai keputusan dikunci.

Studi kasus memakai holdout bagian akhir dari data sintetis independen. Ini bukan pembuktian ketepatan temporal pada jaringan nyata. Data waktu, perangkat berulang, perubahan distribusi, dan label lapangan memerlukan rancangan split serta evaluasi tersendiri. Model risiko masih membuat banyak FP/FN; skor tidak diuji kalibrasinya dan tidak boleh diperlakukan sebagai peluang lapangan yang terjamin.

Untuk bootstrap sederhana, observasi diasumsikan independen dan cukup mewakili. Metode percentile kecil ini menjelaskan mekanisme, bukan resep inferensi universal. Clustering tidak menghasilkan diagnosis bawaan.
