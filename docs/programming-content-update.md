# Pendamping materi Learn Programming

Perubahan ini melengkapi kurikulum yang sudah ada, dengan tetap memakai gaya analogi, penjelasan bertahap, contoh, praktik, dan cek pemahaman.

## Cakupan

- Seluruh 13 beranda jalur menampilkan panduan bekal, tujuan, lima istilah, contoh yang ditelusuri, latihan bertahap, dan kriteria melanjutkan.
- Seluruh 304 halaman artikel menyediakan bekal dan glosarium jalur dalam panel yang dapat dibuka. Ini memberi konteks kepada pembaca yang masuk dari pencarian tanpa membaca beranda.
- 65 artikel terpilih mendapat dua penjelasan cara membaca contoh dan satu latihan tambahan dengan pembahasan. Materi dipilih dari fondasi yang masih singkat serta konsep penting pada semua jalur; ini bukan penulisan ulang seluruh 304 artikel.
- 21 artikel yang sebelumnya tidak memiliki diagram mendapat ilustrasi konsep spesifik berbentuk SVG. Gambar mempunyai teks alternatif, title, desc, serta tautan ukuran penuh.
- Empat artikel menampilkan tiga tangkapan layar nyata dari aplikasi lab. Semua isian fiktif; gambar API bukan pengukuran perangkat atau jaringan operasional.
- URL, urutan belajar, contoh program, paket lab, kunci progres, dan 1.216 soal pilihan ganda yang sudah ada dipertahankan.

## Sumber konten

`lib/programming-study-guides.json` menyimpan panduan per jalur. `lib/programming-reading-notes.json` menyimpan penjelasan, latihan, dan referensi ilustrasi baru dengan key slug artikel. Data materi asal tetap utuh. Komponen server merender data ini tanpa menambahkan JavaScript interaktif baru. Panel memakai details/summary bawaan browser.

Materi mengacu pada kontrak dan sumber resmi yang sudah tercantum di masing-masing artikel. Rujukan yang diperiksa saat penyusunan mencakup tutorial control flow Python, dokumentasi DOM MDN, dan pengantar Django 5.2. Versi lab yang sudah digunakan tetap diikuti.

## Asal gambar praktik

| Gambar | Sumber yang dijalankan | Keadaan yang dibuktikan |
| --- | --- | --- |
| `formulir-valid.png` | `public/programming/lab/web/web-formulir.html` | Judul dan email fiktif lolos validasi lokal; pesan menyatakan belum dikirim ke server |
| `daftar-tugas.png` | `public/programming/lab/web/web-kasus-tugas.html` | Tiga tugas, satu selesai; ketiganya beserta status tetap ada sesudah reload |
| `api-laporan-lokal.png` | `examples/advanced-programming-lab/lab_web.py` dan `web/index.html` | Dua POST memperoleh HTTP 201 dan hasil GET ditampilkan pada daftar |

Untuk menghasilkan ulang tangkapan layar, pasang dependensi proyek dan browser Playwright, lalu jalankan:

```sh
npx playwright install chromium
node scripts/capture-programming-labs.cjs
```

Script memulai server latihan sendiri pada loopback port 8766 dan 8021, memakai browser context baru, melakukan interaksi, memeriksa hasil, menyimpan PNG, lalu menutup browser dan server. Python harus tersedia melalui `python`; environment `PYTHON` dapat memilih executable lain. Jika menggunakan browser kompatibel yang sudah terpasang, environment `PROGRAMMING_BROWSER_EXECUTABLE` dapat menunjuk executable tersebut. Jangan menambahkan akun atau data operasional ke tangkapan layar.

## Pemeriksaan

```sh
npm run typecheck
python scripts/check-programming.py
python scripts/check-programming-editorial.py
npm run build
node scripts/check-programming-editorial-browser.cjs
```

Pemeriksaan editorial memvalidasi slug, urutan, tabel, ketersediaan diagram, referensi panduan dan latihan, gambar PNG, serta cakupan soal lama. Pemeriksaan Python dasar menjalankan contoh, membandingkan keluaran, dan memeriksa batas aturan kasir. Capture browser memeriksa jalur UI yang digambarkan; hal ini tidak menyatakan semua lab lanjutan, PostgreSQL, Docker, atau deployment produksi telah diuji.

Build produksi berhasil menghasilkan 720 halaman statis. Verifikasi browser melewati 13 beranda jalur dan 304 route artikel, lalu memeriksa sampel halaman pada lebar 390, 768, dan 1366 piksel: tidak ada overflow halaman atau runtime error, gambar dapat dimuat, serta panel bekal dan jawaban dapat dibuka melalui keyboard.
