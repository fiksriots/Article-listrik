# Praktik Pengujian, Proyek Python, dan Delivery

Proyek belajar dengan CSV layanan fiktif. Runtime memakai pustaka bawaan Python; pengujian memakai pytest 8.4.2. Gunakan Python 3.12 atau lebih baru.

## Persiapan pada komputer sendiri

Ekstrak paket lengkap. Buka terminal pada folder practice-lab.

```sh
python -m venv .venv
```

Aktifkan pada Linux/macOS: `source .venv/bin/activate`. Pada Windows PowerShell: `.venv\Scripts\Activate.ps1`. Jika aktivasi dibatasi, jalankan `.venv\Scripts\python.exe` secara langsung; tidak perlu mengubah kebijakan komputer.

```sh
python -m pip install -e ".[dev]"
python -m pytest -q
python examples/p05_csv.py
python examples/r07_proyek_data.py
python -m praktik_layanan.cli build-report --input datasets/layanan.csv --db hasil/laporan.sqlite --output hasil/ringkasan.json
python -m praktik_layanan.cli serve --db hasil/laporan.sqlite --port 8000
```

Buka http://127.0.0.1:8000 pada komputer yang menjalankan server. API: http://127.0.0.1:8000/api/ringkasan. Hentikan server dengan Ctrl+C. Port 8000 harus kosong; pilih port lab lain bila sedang digunakan.

Contoh pada examples membuat direktori sementara dan membersihkannya. Perintah build-report di atas sengaja menyimpan hasil pada folder hasil. Mengulangnya mengganti ringkasan bernama terbaru dan file JSON. CSV sumber tetap. Batas baris default 1000; LAB_MAX_ROWS menerima 1..10000. SQLite dan JSON bukan satu transaksi lintas resource: jika penulisan file gagal sesudah commit database, periksa lalu jalankan ulang dari sumber yang sama.

## Isi dan hubungan materi

- tests/test_t01–t06: kontrak, unit test, fixture/parametrize, kasus batas, mock, dan integrasi SQLite.
- examples/t07–t08: traceback, debugging, dan logging.
- examples/p01–p08: konfigurasi, packaging, filesystem, proses, CSV, laporan, jadwal/idempotensi, serta client API.
- examples/r01–r03 dan r06–r08: kebutuhan, modularisasi, dokumentasi/review, rilis, pipeline data, dan dashboard.
- src/praktik_layanan: implementasi bersama, supaya contoh tidak menjadi potongan kode yang terputus.
- Dockerfile dan .github/workflows/lab.yml: contoh container dan CI untuk repositori lab tersendiri. Menyimpan YAML dalam ZIP tidak menjalankan GitHub Actions.
- docs/runbook.md: langkah verifikasi dan pemulihan; docs/kebutuhan.md: kriteria penerimaan.

Materi terkait di Learn Programming: Pemrograman Terstruktur, Basis Data, Backend/API, Pemrograman Web, serta Pemrograman Jaringan. Jalur Learn Git tetap menjadi rujukan commit, branch, dan pull request.

## Membangun wheel

```sh
python -m pip wheel . --no-deps --wheel-dir dist
```

Pyproject menyatakan build backend, metadata, paket src, dan entry point CLI. .venv dan direktori hasil tidak ikut sumber. Catat versi Python serta dependensi pengujian saat mengulang verifikasi. Dependensi transitif instalasi dev belum merupakan lock penuh seluruh platform.

## Docker untuk lab lokal

Siapkan database melalui build-report lokal di atas. Contoh perintah berikut untuk Linux/macOS, dari folder practice-lab. Docker harus tersedia dan dapat menarik image dasar. Pengguna container UID 10001 perlu izin baca pada folder hasil dan file database; berikan izin hanya pada data fiktif yang dibutuhkan. Pada Windows, sesuaikan sintaks path bind mount.

```sh
docker build -t praktik-layanan:0.1.0 .
docker run --rm --name praktik-lab -p 127.0.0.1:8080:8000 --mount type=bind,source="$(pwd)/hasil",target=/data,readonly praktik-layanan:0.1.0
```

Buka http://127.0.0.1:8080. 0.0.0.0 pada CMD adalah bind di dalam container; port host dipublikasikan hanya pada loopback. Database dipasang baca-saja; image tidak memuat data laporan dan perlu volume tersebut. Tag python:3.12-slim dapat berubah: catat/pin digest yang benar saat merancang rilis berulang. Server stdlib ini hanya lab, belum menjadi deployment produksi.

## CI dan rilis

Untuk menjalankan contoh CI, jadikan isi practice-lab sebagai akar repositori lab baru sehingga .github/workflows/lab.yml berada di lokasi yang benar. Workflow melakukan instalasi, pytest, pembuatan wheel, dan docker build. Tidak ada push registry, secret, atau deployment otomatis. Membuat workflow berbeda dari berhasil menjalankannya; periksa log run pada repositori sendiri.

Prosedur staging, pemeriksaan API, rollout dan rollback ada pada docs/runbook.md. Rollback aplikasi tidak otomatis membalik perubahan database; latihan API hanya membaca ringkasan dengan kontrak tetap.

## Batas proyek

Data lima observasi: empat diterima (dua ok, satu timeout, satu refused), satu hasil asing ditolak. Rasio ok data diterima = 0,5; ini proporsi sampel, bukan SLA/uptime kontinu atau ukuran internet pelanggan. Tidak ada polling router, data pelanggan, autentikasi pengguna, maupun perubahan konfigurasi perangkat.

Scheduler contoh hanya menghitung jadwal UTC dan mencatat ledger lokal. Ledger bukan jaminan exactly-once untuk pekerjaan eksternal. Jangan menjalankan source asing, memasukkan secret ke log, atau mengubah tujuan menjadi perangkat operasional saat mengikuti latihan.
