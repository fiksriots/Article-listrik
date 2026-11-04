# Latihan pemrograman lanjutan

Pendamping 15 materi Learn Programming. Semua data fiktif. Ekstrak seluruh folder, buka terminal di dalamnya, gunakan Python 3.12 atau lebih baru. Contoh inti memakai pustaka bawaan, tanpa instalasi pip.

```sh
python a01_ssh.py
python a02_api.py
python a03_snmp.py
python a04_closure.py
python a05_decorator.py
python a06_typing.py
python a07_greedy.py
python a08_backtracking.py
python a09_dp.py
python a12_profile.py
python a13_load.py
python a14_cache.py
python a15_queue.py
python -m unittest test_lab.py -v
```

15 pengujian mencakup algoritma dibandingkan oracle independen, validasi, TTL/LRU, retry, kebijakan SSH dengan mock, dan API HTTP loopback nyata. Jalankan contoh dari folder ini; hasil profil disimpan dalam hasil-latihan/. Program beban membuat server sendiri, mengirim 12 GET dengan paling banyak 3 worker, lalu menutupnya. p50/p95 berubah setiap eksekusi; sampel ini bukan ukuran kapasitas produksi.

## Python dan algoritma

Closure menyimpan lingkungan fungsi; default argumen n=n mengikat nilai tiap iterasi. Decorator meneruskan argumen, hasil, dan exception serta menjaga metadata dengan wraps. TypeVar menghubungkan tipe input dan output; anotasi tidak menambahkan validasi runtime.

Untuk pemeriksaan tipe opsional, buat virtual environment dan pasang requirements:

```sh
python -m venv .venv
# Linux/macOS:
. .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m mypy --config-file mypy.ini a06_typing.py
python -m mypy --config-file mypy.ini fixtures/bad_types.py
```

Perintah terakhir **harus gagal dengan error [assignment]**: hasil str ditampung dalam variabel int. Error import bukan bukti pemeriksaan tipe yang dimaksud. mypy_path pada konfigurasi menunjuk folder paket.

Greedy memberi contoh tandingan koin [1,3,4], target 6. Backtracking memakai setiap indeks paling banyak sekali (maksimum 16 elemen); nilainya positif agar pemangkasan valid. DP memakai koin tanpa batas, target maksimum 10000, dan None untuk target yang tak terjangkau. Batas tersebut membatasi latihan; bukan klaim semua masalah optimasi terselesaikan oleh satu strategi.

## SSH, API, dan SNMP

- a01_ssh.py secara default **simulasi**, tanpa koneksi SSH. Fungsi hubungkan_lab tersedia bagi lab sendiri: hanya alamat literal 127.0.0.1 atau ::1, perintah tetap uname -s untuk VM Linux. Jika memakai port-forward ke VM OpenSSH milik sendiri, verifikasi fingerprint melalui kanal administrasi tepercaya lebih dahulu dan siapkan berkas known_hosts yang benar (host pada port nonstandar memakai [host]:port). Jangan menganggap hasil ssh-keyscan saja sebagai verifikasi identitas. Berikan key_filename, username, dan known_hosts lewat pemanggilan fungsi; jangan masukkan private key ke repositori. Paramiko menolak host yang tidak dikenal, tidak memakai agent atau pencarian key otomatis. Koneksi nyata dan kredensial tidak diperlukan untuk menjalankan contoh dan pengujian bawaan.
- a02_api.py membuat server HTTP loopback sendiri dan benar-benar meminta /api/observasi, memeriksa Content-Type, ukuran respons, serta skema. Tidak menghubungi perangkat jaringan.
- a03_snmp.py hanya membaca **varbind fiktif yang sudah didekode**, bukan mengirim GET/WALK dan bukan client SNMP. Gunakan dokumentasi perangkat dan SNMPv3 pada lab berizin jika melanjutkan sendiri. sysName dan ifOperStatus berbeda OID; status operasional tidak sama dengan admin state. Selisih Counter32 memakai asumsi paling banyak satu wrap dan tanpa reset tersembunyi. Uptime turun membuat delta tidak dipakai, tetapi tidak membuktikan penyebab restart; uptime juga dapat wrap.

## Browser, formulir, dan API lokal

web/index.html defaultnya mode simulasi: data hanya di memori halaman dan hilang saat reload. Versi publik dapat dibuka dari artikel. lab_web.py menyajikan halaman yang sama dalam **mode API**: data ada di memori proses server, tetap tersedia saat halaman reload, dan hilang saat server berhenti. Tidak ada login maupun penyimpanan persisten. Server hanya mendengarkan loopback.

Untuk mencoba manual:

```sh
python lab_web.py --port 8020
```

Buka http://127.0.0.1:8020. Kirim nama layanan ASCII yang valid (huruf, angka, spasi, tanda hubung, atau garis bawah; maksimum 40 karakter) dan hasil ok/timeout/refused. API maksimum 20 baris. Server menolak format, ukuran, dan jumlah data yang melampaui batas.

Untuk menjalankan suite browser, pasang Node.js yang didukung Playwright serta Python pada PATH, hentikan server manual agar port 8020 kosong, lalu:

```sh
npm install
npx playwright install chromium
npm run test:e2e
```

Pada Linux, ikuti petunjuk dependensi sistem dari Playwright jika browser belum bisa dijalankan. Konfigurasi menjalankan server Python sendiri, workers=1, retries=0, reuseExistingServer=false. Locator memakai label/role dan assertion kondisi, bukan jeda tetap. Test formulir memeriksa input spasi, simpan, dan navigasi. Test API membuat data melalui HTTP lalu memeriksa UI. Test kegagalan **memock POST menjadi 503**: itu menguji respons UI terhadap kegagalan yang disimulasikan, bukan membuktikan backend menghasilkan 503 nyata. Berkas suite merupakan latihan yang perlu dijalankan pada lingkungan browser lengkap; pemeriksaan sintaks saja tidak membuktikan suite lulus.

## Profiling, cache, dan antrean

Buka profil dengan `python -m pstats hasil-latihan/profil.prof`, lalu coba `sort cumulative` dan `stats 10`. cProfile menambah overhead dan memeriksa waktu/call Python; tracemalloc melacak alokasi Python, bukan seluruh RSS proses. Bandingkan perubahan dengan workload yang sama dan ulangi pengukuran. Uji beban hanya mengukur lab sendiri: 12 sampel, concurrency maksimum 3, timeout 2 detik, persentil nearest rank. Konkurensi tidak sama dengan request per detik.

Cache memakai jam monotonic, kapasitas LRU, TTL, dan invalidasi eksplisit. None berarti miss sehingga tidak boleh disimpan sebagai nilai. Cache ini tidak thread-safe, tidak dibagikan antarproses, dan tidak persisten. Data otoritatif tetap ada di sumbernya.

Antrean memakai Queue berkapasitas 2, satu worker, maksimum 20 tugas unik, dan maksimal 3 percobaan (default 2). Hanya RetryableError yang dicoba ulang; error lain langsung dicatat sebagai dead letter. Callback harus selesai; tidak ada penghentian paksa untuk callback yang macet. Memori proses dapat hilang; contoh ini bukan broker persisten dan tidak menjanjikan exactly-once. Hindari efek samping berulang dengan idempotensi saat mengembangkan worker sendiri.
