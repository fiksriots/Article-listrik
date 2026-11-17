# Article: pembaruan tampilan bersama

## Cakupan

Lapisan tampilan bersama diterapkan pada beranda, lima akademi, katalog, artikel, halaman pencarian, akun, serta halaman simulator. Kontrol simulator, kuis, konten, URL, dan penyimpanan progres tetap menggunakan implementasi yang sudah ada.

- Beranda: pilihan berdasarkan tujuan, ringkasan jumlah materi, kartu akademi, progres, dan pintasan praktik.
- Navigasi: akademi utama terpisah dari jalur/materi. Jalur yang panjang memakai baris horizontal; pada layar kecil tersedia menu buka/tutup dengan dukungan Escape.
- Pencarian cepat: dialog native, Ctrl/Cmd+K, pencarian lintas akademi, tautan ke pencarian lengkap, status memuat/gagal/kosong, dan tombol coba lagi. Tab menelusuri hasil, Escape menutup dialog, fokus dikembalikan ke tombol pemicu.
- Pembaca: indikator posisi membaca, teks lebih besar yang diingat di browser, serta mode fokus untuk menyembunyikan sidebar. Daftar isi, perbesar gambar, dan navigasi materi tetap tersedia.
- Tampilan bersama: warna, tipografi sistem, radius, kartu, hover/fokus, filter, progres, dan footer. Pergerakan singkat memakai transform/border; prefers-reduced-motion mematikannya.

## Menjaga beban halaman

Tidak menambah paket, font eksternal, video latar, carousel, atau library animasi. Endpoint `/api/search` dibangun statis dan mengembalikan metadata saja, termasuk jalur NOC dan Ubiquiti. Katalog 693 materi baru diminta setelah dialog pencarian dibuka, dibatasi delapan hasil tampilan, dan dicache browser. Ukuran payload katalog sekitar 37,8 KB gzip; stylesheet tambahan sekitar 4,8 KB gzip. Interaksi scroll pembaca dijadwalkan dengan requestAnimationFrame dan memperbarui elemen progress tanpa render React pada setiap scroll.

Perbandingan daftar script awal halaman beranda: versi situs sebelum perubahan sekitar 158.035 byte gzip; build baru sekitar 159.479 byte gzip, selisih 1.444 byte (sekitar 0,9%). Katalog pencarian tidak termasuk dalam muatan awal karena diminta saat dialog dibuka.

Angka gzip merupakan ukuran aset hasil build lokal, bukan pengukuran Lighthouse atau waktu muat pada perangkat pengguna. Hasil bergantung pada cache, jaringan, dan perangkat.

## Pemeriksaan yang dapat diulang

```sh
npm ci
npm run typecheck
npm run build
node scripts/check-site-refresh.cjs
node scripts/check-learning-dashboard.cjs
node scripts/check-learning-directory.cjs
npm run check:content
```

Pemeriksaan produksi memvalidasi navigasi bersama pada seluruh HTML statis, h1 tunggal dan respons 200 pada sampel lintas halaman, serta skema katalog pencarian yang unik dan tidak membawa isi artikel. Pemeriksaan lama memastikan cakupan lima akademi, perhitungan progres, dan materi listrik tetap valid.

