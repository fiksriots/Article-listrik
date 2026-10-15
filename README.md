# Akademi Listrik & Elektronika

Website edukasi gratis berbahasa Indonesia untuk pemula. Next.js App Router, TypeScript, Tailwind CSS, dan 32 artikel MDX dalam delapan tahap.

## Menjalankan

Gunakan Node.js yang mendukung Next.js 15 (Node 22 atau 24 direkomendasikan).

```bash
npm ci
npm run dev
```

Buka http://localhost:3000. Dependensi dikunci dalam `package-lock.json` agar build lokal dan Vercel konsisten.

## Pemeriksaan sebelum push

```bash
npm run check:content
npm run build
npm run typecheck
npx playwright install chromium
npm start
# Terminal kedua:
npm run test:smoke
```

Smoke test mengunjungi 36 halaman pada lebar 390px dan 1440px, menjawab dan mengulang kuis 32 modul, menguji progress setelah reload, sidebar mobile, lima simulator, kondisi localStorage ditolak, serta halaman 404. Untuk deployment, jalankan `BASE_URL=https://article.fikss.site npm run test:smoke`. Jika memakai instalasi Chromium lain, isi `CHROMIUM_PATH` dengan executable yang sesuai.

## Fitur

- 32 materi dengan studi kasus, analogi, latihan, dan pembahasan
- 64 soal khusus topik, masing-masing dua soal per modul
- Kotak rumus dengan asumsi dan contoh perhitungan
- 10 foto perangkat asli dengan atribusi dan lisensi di `public/devices/ATTRIBUTION.md`
- Ilustrasi SVG (dapat dibuka di artikel): multimeter, PLC, saklar, relay/kontaktor, MCB/RCCB/SPD, resistor, kapasitor, motor
- Diagram seri, paralel, pengukuran, LED, AC/DC, tiga phase, distribusi, grounding, dan instalasi konseptual
- Simulator Hukum Ohm, seri/paralel, AC satu/tiga phase, multimeter, dan logika PLC
- Progress lokal, tautan lanjut belajar, sidebar, serta navigasi materi sebelumnya/berikutnya
- Metadata artikel, navigasi keyboard, dan tata letak responsif

Progress memakai key lama `lesson-<slug>` sehingga progress browser yang sudah ada tetap terbaca. Tidak ada akun, sinkronisasi antarperangkat, atau database; kuis dan simulator bekerja di browser.

## Struktur

- `lib/course.ts`: urutan kurikulum
- `content/materi/*.mdx`: materi; daftar slug harus sama dengan kurikulum
- `lib/quiz-bank.ts`: pertanyaan, indeks jawaban benar, dan alasan
- `components/`: visual, simulator, navigasi, dan progress
- `scripts/`: pemeriksaan integritas dan browser

MDX adalah source tepercaya di repository dan harus ditinjau seperti kode sebelum deploy. Jangan menerima MDX langsung dari input publik untuk dirender.

## Deployment Vercel

Repository `fiksriots/Article-listrik`, branch produksi `main`, project `article-listrik`. Push memicu integrasi Git Vercel. Periksa SHA deployment, tunggu `READY`, dan uji domain publik; push atau build lokal saja belum membuktikan deployment berhasil.

Commit `0f2d5e7` sudah memperbaiki penutupan komponen PhaseLab dan deployment-nya tercatat READY. Commit berikutnya `14dcb9a` memperbaiki respons slider frekuensi. Pengembangan ini melanjutkan commit terbaru tersebut, bukan mengembalikan source ke commit lama.

## Referensi teknis

- [ABB: prinsip proteksi surja transien](https://new.abb.com/low-voltage/products/surge-protective-devices/spd-t2)
- [ABB: rating circuit breaker dan koordinasi proteksi](https://new.abb.com/news/detail/11829/defining-short-circuit-values-for-circuit-breakers)
- [Siemens S7-1200: siklus scan](https://docs.tia.siemens.cloud/r/simatic_s7_1200_manual_collection_enus_20/plc-concepts/execution-of-the-user-program/processing-the-scan-cycle-in-run-mode)

Semua gambar dan simulasi merupakan model pendidikan. Pengawatan nyata, pemilihan proteksi, dan pekerjaan PLN memerlukan rancangan serta tenaga yang kompeten.

## Learn Jaringan

Akademi jaringan tersedia di `/jaringan`, dengan 24 bacaan pada enam tahap dan ilustrasi SVG lokal. Konten terstruktur: `lib/network-lessons.json`; daftar tahap dan tipe: `lib/network-course.ts`; aset: `public/network/`. Setiap materi mempunyai analogi, pembahasan, contoh, latihan, koreksi miskonsepsi, dan cek pemahaman.

Katalog `/api/articles` menggabungkan materi listrik dan jaringan dengan ID, kategori, URL, serta thumbnail masing-masing. Portofolio mengonsumsi katalog ini; materi baru yang ditambahkan akan ikut pada deployment berikutnya. Cache HTTP katalog 5 menit; browser portofolio mengambil ulang saat halaman artikel dimuat. Progres jaringan menggunakan localStorage `fiks-network-progress-v1`, terpisah dari progres listrik; tidak tersinkron antarperangkat.
