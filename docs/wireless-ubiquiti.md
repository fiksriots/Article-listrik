# Wireless Ubiquiti

Jalur `/jaringan/ubiquiti` berisi sembilan artikel yang sekarang diperluas menjadi 8–10 bagian per artikel (81 bagian), sekitar 12.000 kata keseluruhan. Ada analogi, delapan SVG konsep asli, 21 langkah prosedural, praktik dengan pembahasan, cek pemahaman, dan rujukan resmi. Estimasi baca dihitung ulang; lab tetap terpisah dari durasi bacaan.

## Pendalaman

1. **Dasar dan perangkat:** perjalanan frame melalui radio; frekuensi, lebar kanal dan beamwidth; satuan; perbedaan keluarga; LiteBeam/NanoBeam/PowerBeam/NanoStation/Rocket; AP/station dibanding bridge/router.
2. **Survey:** kebutuhan dua arah, profil lintasan, LOS/Fresnel, tinggi/elevasi, ketidakpastian, link budget dan margin dengan angka fiktif.
3. **Persiapan:** peran adaptor/injector/radio/antena; passive PoE khusus model; subnet laptop; akses awal yang diverifikasi; perubahan IP; pemulihan adapter laptop dan pemisahan kredensial.
4. **Lab airMAX AC:** sembilan bagian, tujuh tahap praktik, sebelas langkah prosedural terstruktur, tabel IP dan peta menu, konfigurasi AP/station serta Bridge, keamanan, lebar kanal station Auto yang dapat berbeda dari label AP, pengujian, penyimpanan, backup dan recovery.
5. **PtMP:** tiga langkah setting dua station, airtime, kapasitas bersama, isolasi dan pengujian serentak.
6. **Optimasi:** fungsi tiap kolom, scan list, ACK/distance, kanal/lebar/daya/alignment dan contoh keputusan berdasarkan target layanan.
7. **Pengukuran:** sudut pandang TX/RX, host pembanding, Ethernet, iperf3, receiver, arah, satuan dan keterbatasan kesimpulan.
8. **Troubleshooting:** empat kasus berisi fakta, hipotesis, pengujian dan validasi: akses hilang setelah IP berubah, autentikasi gagal, batas sekitar 94 Mbps, serta putus malam tanpa reboot.
9. **Operasi:** tiga langkah UISP key, kesegaran telemetri, waktu/log, baseline/alarm, perubahan dan target penerimaan serta rollback.

Langkah prosedural menampilkan tindakan, alasan, hasil yang diharapkan, dan pemeriksaan jika gagal. Seluruh langkah terbaca langsung; tidak disembunyikan dalam tab. Diagram akses IP memperlihatkan laptop mengikuti subnet radio setelah alamat berubah.

## Akurasi dan cakupan

Lab utama tetap dua LBE-5AC-GEN2/airMAX AC dengan airOS 8. Kode model, firmware, tata menu, kebutuhan daya, akun/alamat awal, dan perilaku tombol diuji sementara versus simpan langsung tidak digeneralisasi. Dokumen airOS 8 adalah rujukan versi, bukan klaim antarmuka terbaru semua produk. Pengaturan frekuensi selalu mengikuti survey dan ketentuan lokasi; tidak ada angka kanal universal atau cara membuka pembatasan. Contoh hasil serta target layanan diberi label fiktif. Belum diuji pada radio fisik atau browser mobile.

Rujukan primer diperiksa pada 7 November 2026: spesifikasi LBE-5AC-GEN2 dan Rocket Prism 5AC, panduan PtP/PtMP, LTU FAQ, airOS 8 User Guide, dokumentasi airView M, troubleshooting dan pengelolaan UISP, serta ESnet iperf3. URL lengkap tersedia pada masing-masing artikel.

## Integrasi dan validasi

Slug, URL, dan identitas progres dipertahankan. Katalog publik, pencarian, dan progres membaca otomatis memakai metadata terbaru. Pembaca mempertahankan progres yang sudah tersimpan.

- `npm run build`: berhasil, 739 halaman statis.
- `node scripts/check-ubiquiti.cjs`: rute, navigasi, daftar isi, langkah prosedural, diagram, pencarian, feed publik dan progres lulus.
- `node scripts/check-learning-dashboard.cjs`: lima akademi dan 193 materi jaringan unik lulus.
- `node scripts/check-learning-directory.cjs`: kontrak direktori lulus.
- `node scripts/check-noc.cjs`: roadmap dan delapan artikel NOC lulus.
- `python scripts/check-site-links.py`: 734 HTML dan 64.081 referensi internal, tanpa masalah.
- SVG akses IP baru divalidasi sebagai XML, dirender, dan diperiksa secara visual.
