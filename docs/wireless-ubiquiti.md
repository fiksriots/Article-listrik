# Wireless Ubiquiti

Jalur baru `/jaringan/ubiquiti` berisi sembilan artikel berurutan. Pembaca mendapatkan konsep, analogi, penjelasan enam bagian per artikel, diagram, praktik dengan pembahasan, cek pemahaman, rujukan resmi, serta tautan fondasi jaringan. Lab utama dibatasi pada dua LBE-5AC-GEN2/airMAX AC dengan airOS 8; menu model atau keluarga lain tidak digeneralisasi.

## Cakupan

1. Wireless, PtP/PtMP, AP/station/CPE, dan keluarga Ubiquiti.
2. Survey, LOS, Fresnel, kebutuhan layanan, dan link budget sederhana.
3. Identitas model, passive PoE, bench, IP manajemen, dan pemulihan akses.
4. Lab bridge PtP airMAX AC dan validasi PC ke PC.
5. PtMP, sektor, airtime bersama, kapasitas, dan isolasi layanan.
6. Spektrum, kanal, lebar kanal, daya, alignment, dan dampak scan.
7. Metrik dashboard, Ethernet, dan iperf3 dua arah.
8. Troubleshooting daya, asosiasi, IP/VLAN, dan layanan.
9. UISP, baseline, keamanan, backup, firmware, dan proyek serah terima.

## Integrasi

- Kartu jalur Learn Networking dan direktori belajar.
- Grup progres `jaringan/ubiquiti`, sembilan slug unik dengan awalan `ubiquiti-`.
- Pencarian memakai metadata, tanpa mengirim teks artikel penuh ke client.
- Katalog publik `/api/articles` memuat sembilan materi dan diagramnya.
- Tujuh SVG asli; seluruh artikel dibuat statis, daftar isi dapat dilipat, tabel dapat digeser dengan keyboard, navigasi menjadi satu kolom pada mobile.

## Akurasi dan batas

Rujukan primer diperiksa pada 7 November 2026, termasuk spesifikasi LBE-5AC-GEN2, panduan resmi PtP/PtMP, LTU FAQ, alignment, troubleshooting, airView M, UISP, dan ESnet iperf3. Daftar URL tersedia pada masing-masing artikel. Tidak menyalin nilai kanal negara lain atau kredensial bawaan sebagai aturan semua perangkat. Scan airView M dijelaskan dapat memutus link; spesifikasi passive PoE hanya dinyatakan untuk model contoh. Angka hasil adalah fiktif; lab meja tidak membuktikan kapasitas jarak lapangan. Belum dilakukan pengujian radio fisik atau pemeriksaan browser mobile.

## Validasi

- `npm run build`: berhasil, 739 halaman statis dihasilkan.
- `node scripts/check-ubiquiti.cjs`: rute, navigasi, diagram, pencarian, feed publik, dan progres.
- `node scripts/check-learning-dashboard.cjs`: lima akademi; jaringan menjadi 193 materi unik.
- `node scripts/check-learning-directory.cjs`: kontrak direktori tetap valid.
- `node scripts/check-noc.cjs`: roadmap dan delapan artikel NOC tetap valid.
- `python scripts/check-site-links.py`: 734 HTML, 64.054 referensi internal, tidak ada masalah.
- Tujuh SVG divalidasi sebagai XML, dirender, dan diperiksa secara visual.
