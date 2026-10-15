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

Akademi jaringan tersedia di `/jaringan`, dengan 60 bacaan pada 15 tahap dan ilustrasi SVG lokal. Konten terstruktur: `lib/network-lessons.json`; daftar tahap dan tipe: `lib/network-course.ts`; aset: `public/network/`. Setiap materi mempunyai analogi, pembahasan, contoh, latihan, koreksi miskonsepsi, dan cek pemahaman.

Katalog `/api/articles` menggabungkan materi listrik dan jaringan dengan ID, kategori, URL, serta thumbnail masing-masing. Portofolio mengonsumsi katalog ini; materi baru yang ditambahkan akan ikut pada deployment berikutnya. Cache HTTP katalog 5 menit; browser portofolio mengambil ulang saat halaman artikel dimuat. Progres jaringan menggunakan localStorage `fiks-network-progress-v1`, terpisah dari progres listrik; tidak tersinkron antarperangkat.

### Hardware jaringan dan persiapan MTCNA

Kurikulum jaringan kini berisi 60 materi: 32 fondasi, 12 materi persiapan MTCNA, dan 16 materi lanjutan pada 15 tahap. Materi dasar ditata sebelum konsep IP, routing, dan troubleshooting; identitas slug tetap sehingga progres sebelumnya masih dikenali di origin yang sama. Jalur `/jaringan/mtcna` memetakan 12 materi ke sembilan kelompok outline MikroTik, menyertakan prasyarat, kebutuhan lab, serta checklist kesiapan lokal (`fiks-mtcna-readiness-v1`). Materi merupakan persiapan mandiri, bukan kelas atau sertifikasi resmi. Outline yang ditautkan MikroTik bertanggal 22 Januari 2016; rujukan fitur RouterOS dicantumkan per materi.

Jalankan `npm run check:network` untuk memeriksa struktur materi, keutuhan rute lama, cakupan kelompok MTCNA, dan keberadaan ilustrasi.

## Pintu masuk akademi

`/` adalah dashboard umum dengan pilihan Learn Listrik dan Learn Jaringan. Beranda listrik berada di `/listrik`; semua rute materi listrik (`/materi/*`), modul, simulator, dan galeri tetap tersedia. Navbar mengikuti bagian yang dibuka dan menyediakan tautan kembali ke dashboard untuk mengganti akademi. Pada layar kecil, tombol Menu mengontrol navigasi yang dapat dibuka/tutup.

## Simulator jaringan

`/jaringan/simulator` adalah lab subnetting IPv4 lokal: input alamat dan prefix /0–/32, tampilan bit network/host, network/mask/broadcast/rentang host, perbandingan dua IP dengan prefix yang sama, pembagian FLSM (maksimal delapan baris untuk menjaga rendering tetap ringan), dan tiga latihan dengan pembahasan. /31 dimodelkan sebagai point-to-point RFC 3021; /32 sebagai satu alamat. Lab tidak mengirim paket atau membuktikan keterjangkauan perangkat.

Perhitungan murni ada di `lib/subnet.ts`. Jalankan `npm run check:subnet` untuk kasus batas, input tidak valid, /31–/32, pembagian blok, dan perbandingan subnet. Tautan lab tersedia pada navbar jaringan, beranda, jalur MTCNA, serta materi IP/subnet/gateway/routing terkait.

### Lab next hop dua router

`/jaringan/simulator/next-hop` menyediakan topologi tetap empat PC pada dua LAN /24, dua switch, serta dua router dengan transit 10.10.10.0/30. Pengguna memilih pasangan komputer, gateway tiap PC, status static route dan next hop R1/R2. Model mengikuti permintaan lalu balasan secara independen; IP tujuan paket tidak diganti oleh next hop. Playback langkah dan log menampilkan lokasi kegagalan. Semua link diasumsikan aktif, connected route tersedia, ICMP diizinkan, dan NAT tidak digunakan. Ini model pembelajaran, bukan emulator RouterOS.

`npm run check:routing` memverifikasi 12 pasangan PC, rute balik hilang, gateway salah, next hop sendiri/tak terjangkau, serta komunikasi satu LAN yang tidak membutuhkan router.


### Materi lanjutan jaringan

Empat tahap setelah jalur MTCNA menambah VLSM, alamat IPv6, RA/SLAAC/DHCPv6, DNS record/TTL, MTU/MSS, RSTP, LACP, bufferbloat, Wireshark, radio PTP, monitoring SNMP, IPAM, DHCP relay, WireGuard, pengantar OSPF, serta keamanan LAN. Topik ini merupakan pendalaman tersendiri dan tidak ditandai sebagai modul inti MTCNA. Seluruh slug lama tetap tersedia dan progres lama tetap merujuk slug yang sama. Katalog portofolio memperbarui materi dari feed pada deployment ini.
