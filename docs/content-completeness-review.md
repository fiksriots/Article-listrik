# Tinjauan kelengkapan materi Article

Tujuan: membantu pembaca menyelesaikan satu alur pemahaman, dari konsep dan contoh hingga pemeriksaan hasil. Ringkas tidak otomatis tidak lengkap; contoh kode, keluaran, simulator, pembahasan dan lab terkait ikut dipertimbangkan.

## Cakupan tinjauan

Katalog yang ditinjau mencakup 64 materi Listrik, 184 sumber belajar unik Jaringan (termasuk 8 NOC), 84 IoT, 48 Git, dan 304 Programming. Peninjauan mencakup struktur serta contoh pada sumber dan renderer, bukan penilaian hanya dari jumlah kata pada field `explain`.

## Perbaikan yang dipilih

110 materi mendapat pemaparan tambahan yang ditulis khusus untuk topiknya: penjelasan mekanisme, contoh yang ditelusuri langkah demi langkah, dan pembahasan hasil latihan. Kode contoh yang ada, urutan kurikulum, URL, slug progres, dan nilai kuis tidak diubah. Estimasi waktu ditambah sesuai panjang bacaan tambahan.

| Akademi | Materi diperluas | Fokus |
|---|---:|---|
| Jaringan | 46 | Fondasi, perjalanan paket, pengukuran, switching, routing dan diagnosis |
| Git | 23 | Keadaan file, riwayat, sinkronisasi, kolaborasi dan pemulihan |
| IoT | 20 | Alur sensor-ke-layar, validitas data, koneksi, kendali dan rancangan perangkat |
| Listrik | 9 | Fungsi komponen, batas model hitungan dan pembacaan spesifikasi |
| Programming | 12 | Penelusuran nilai, alur program, masukan batas dan hasil fungsi |

## Materi yang tidak diperpanjang secara seragam

- Ringkasan MTCNA/MTCRE dibaca bersama panduan, tabel alamat, pengujian, skenario gangguan, pemulihan dan tautan lab lengkap yang sudah disediakan.

- Winbox serta artikel NOC sudah mempunyai pembahasan lebih panjang. Penambahan paragraf generik pada semua halaman tidak dipakai.

- Materi Programming lanjutan dinilai bersama blok kode, keluaran, penjelasan, paket praktik, petunjuk jalur dan kuisnya. Penambahan pada perubahan ini difokuskan ke fondasi.

- IoT dengan wiring, blok program, hasil dan troubleshooting diperlakukan sebagai materi praktik, bukan dinilai hanya dari empat paragraf pembukanya.

Ini merupakan catatan keputusan editorial untuk perubahan ini; panjang bacaan bukan jaminan ketuntasan semua kebutuhan pembaca.

## Daftar materi yang diperluas

### Jaringan

- [Apa itu jaringan komputer?](https://article.fikss.site/jaringan/apa-itu-jaringan)
- [LAN, WAN, dan internet](https://article.fikss.site/jaringan/lan-wan-internet)
- [Router, switch, AP, dan ONT](https://article.fikss.site/jaringan/perangkat-jaringan)
- [NIC, port, dan bentuk hardware jaringan](https://article.fikss.site/jaringan/hardware-nic-port)
- [Topologi star, mesh, dan diagram fisik/logis](https://article.fikss.site/jaringan/topologi-jaringan)
- [Client–server, peer-to-peer, dan layanan jaringan](https://article.fikss.site/jaringan/client-server-p2p)
- [Layer OSI dan TCP/IP](https://article.fikss.site/jaringan/osi-tcp-ip)
- [Kecepatan port, duplex, dan auto-negotiation](https://article.fikss.site/jaringan/ethernet-speed-duplex)
- [IP address dan MAC address](https://article.fikss.site/jaringan/ip-mac)
- [Switch dan ARP](https://article.fikss.site/jaringan/switch-arp)
- [TCP, UDP, dan port](https://article.fikss.site/jaringan/tcp-udp-port)
- [Subnet mask dan prefix /24](https://article.fikss.site/jaringan/subnet-mask)
- [Gateway dan DNS](https://article.fikss.site/jaringan/gateway-dns)
- [DHCP dan IP statis](https://article.fikss.site/jaringan/dhcp-ip-statis)
- [Kabel UTP: Cat5e, Cat6, solid, dan stranded](https://article.fikss.site/jaringan/kabel-utp-kategori)
- [RJ45, T568A/T568B, crimping, dan cable tester](https://article.fikss.site/jaringan/crimping-tester)
- [Fiber, SFP, LC/SC, dan single-mode](https://article.fikss.site/jaringan/fiber-sfp-konektor)
- [Kabel UTP, fiber optik, dan PoE](https://article.fikss.site/jaringan/kabel-fiber-poe)
- [Rack, patch panel, keystone, dan manajemen kabel](https://article.fikss.site/jaringan/rack-patch-panel)
- [Wi-Fi, sinyal, dan channel](https://article.fikss.site/jaringan/wifi-sinyal-channel)
- [VLAN, access, dan trunk](https://article.fikss.site/jaringan/vlan-access-trunk)
- [Routing statis dan jalur balasan](https://article.fikss.site/jaringan/routing-statis)
- [IP privat, NAT, dan CGNAT](https://article.fikss.site/jaringan/nat-ip-publik)
- [Firewall dan keamanan dasar](https://article.fikss.site/jaringan/firewall-dasar)
- [Mengenal MikroTik dan Winbox](https://article.fikss.site/jaringan/mikrotik-winbox)
- [Lab: satu router dan dua klien](https://article.fikss.site/jaringan/lab-jaringan-rumah)
- [Ping dan traceroute](https://article.fikss.site/jaringan/monitoring-ping)
- [Bandwidth, latency, dan jitter](https://article.fikss.site/jaringan/bandwidth-latency)
- [Troubleshooting secara runtut](https://article.fikss.site/jaringan/troubleshooting-runtut)
- [VPN dan akses remote](https://article.fikss.site/jaringan/vpn-akses-remote)
- [Failover dua ISP](https://article.fikss.site/jaringan/failover-dua-isp)
- [Proyek akhir: kantor kecil](https://article.fikss.site/jaringan/proyek-kantor)
- [VLSM: membagi IP sesuai jumlah perangkat](https://article.fikss.site/jaringan/vlsm-perencanaan-ip)
- [DNS record, TTL, dan perubahan domain](https://article.fikss.site/jaringan/dns-record-ttl)
- [DHCP relay untuk beberapa subnet](https://article.fikss.site/jaringan/dhcp-relay)
- [Loop, broadcast storm, dan RSTP](https://article.fikss.site/jaringan/loop-rstp)
- [LACP dan bonding: beberapa kabel menjadi satu grup](https://article.fikss.site/jaringan/lacp-bonding)
- [MTU, MSS, dan kasus situs hanya terbuka sebagian](https://article.fikss.site/jaringan/mtu-mss-pmtud)
- [Bufferbloat dan antrean: cepat tetapi terasa lambat](https://article.fikss.site/jaringan/qos-bufferbloat)
- [Wireshark: membaca paket untuk pemula](https://article.fikss.site/jaringan/wireshark-dasar)
- [Radio PTP: LOS, Fresnel, alignment, dan link budget](https://article.fikss.site/jaringan/radio-ptp-los-fresnel)
- [Monitoring: SNMP, baseline, dan alarm yang berguna](https://article.fikss.site/jaringan/monitoring-snmp-baseline)
- [IPAM, label port, dan dokumentasi perubahan](https://article.fikss.site/jaringan/ipam-dokumentasi)
- [Keamanan LAN: rogue DHCP, ARP, dan port pengguna](https://article.fikss.site/jaringan/keamanan-lan-dhcp-arp)
- [WireGuard: peer, kunci, alamat, dan rute](https://article.fikss.site/jaringan/wireguard-dasar)
- [Pengenalan OSPF: belajar rute secara dinamis](https://article.fikss.site/jaringan/ospf-pengenalan)

### Git

- [Apa itu Git dan mengapa kita membutuhkannya?](https://article.fikss.site/git/apa-itu-git)
- [Git, GitHub, repository, dan istilah dasar](https://article.fikss.site/git/git-dan-github)
- [Instal Git di Windows, Ubuntu, dan macOS](https://article.fikss.site/git/instalasi-git)
- [Terminal, folder kerja, dan identitas commit](https://article.fikss.site/git/terminal-dan-identitas)
- [Membuat repository latihan pertama](https://article.fikss.site/git/repo-pertama)
- [Working tree, staging area, dan repository](https://article.fikss.site/git/tiga-area)
- [Add dan commit pertama](https://article.fikss.site/git/commit-pertama)
- [Membaca status, diff, dan log](https://article.fikss.site/git/status-diff-log)
- [Memilih file dengan .gitignore](https://article.fikss.site/git/gitignore)
- [Branch dan HEAD: jalur percobaan](https://article.fikss.site/git/branch)
- [Menggabungkan branch dengan merge](https://article.fikss.site/git/merge)
- [Memahami konflik saat merge](https://article.fikss.site/git/konflik)
- [Membuat GitHub dan menghubungkan remote](https://article.fikss.site/git/github-remote)
- [HTTPS, token, SSH, dan akses GitHub](https://article.fikss.site/git/autentikasi)
- [Push pertama dan clone ke folder baru](https://article.fikss.site/git/push-clone)
- [Fetch, pull, upstream, dan sinkronisasi](https://article.fikss.site/git/fetch-pull)
- [Workflow tim dan pull request](https://article.fikss.site/git/pull-request)
- [Fork, origin, upstream, dan kontribusi](https://article.fikss.site/git/fork)
- [Undo aman: unstage, restore, dan revert](https://article.fikss.site/git/restore-revert)
- [Stash: menyimpan pekerjaan sementara](https://article.fikss.site/git/stash)
- [Reset, reflog, dan penyelamatan commit](https://article.fikss.site/git/reset-reflog)
- [Rebase dan cherry-pick setelah paham merge](https://article.fikss.site/git/rebase-cherry-pick)
- [Tag rilis dan pemecahan masalah umum](https://article.fikss.site/git/tag-dan-troubleshooting)

### IoT

- [Apa itu Internet of Things?](https://article.fikss.site/iot/apa-itu-iot)
- [Perjalanan data: dari sensor ke layar](https://article.fikss.site/iot/cara-kerja-iot)
- [Sensor dan aktuator: mata dan tangan](https://article.fikss.site/iot/sensor-aktuator)
- [Mengenal ESP32 dan papan pengembangan](https://article.fikss.site/iot/mengenal-esp32)
- [Tegangan, GND, dan breadboard](https://article.fikss.site/iot/listrik-breadboard)
- [Menyiapkan Arduino IDE untuk ESP32](https://article.fikss.site/iot/persiapan-arduino-ide)
- [Praktik pertama: LED berkedip](https://article.fikss.site/iot/led-pertama)
- [Membaca sensor: analog dan digital](https://article.fikss.site/iot/membaca-sensor)
- [Wi-Fi, IP, dan koneksi ke internet](https://article.fikss.site/iot/wifi-ip)
- [HTTP dan JSON: mengirim laporan](https://article.fikss.site/iot/http-json)
- [Dashboard dan data yang bisa dipercaya](https://article.fikss.site/iot/dashboard-data)
- [Otomatisasi dan histeresis](https://article.fikss.site/iot/otomatisasi-histeresis)
- [Keamanan, privasi, dan perangkat offline](https://article.fikss.site/iot/keamanan-iot)
- [Proyek terpandu: pemantau suhu ruangan](https://article.fikss.site/iot/proyek-monitor-suhu)
- [Troubleshooting dan arah belajar berikutnya](https://article.fikss.site/iot/troubleshooting-lanjutan)
- [Merancang proyek IoT dari kebutuhan](https://article.fikss.site/iot/merancang-proyek-iot)
- [Membaca datasheet dan pinout sebelum merangkai](https://article.fikss.site/iot/datasheet-pinout)
- [Menghitung daya, adaptor, dan perkiraan baterai](https://article.fikss.site/iot/daya-adaptor-baterai)
- [OTA: memperbarui program melalui jaringan](https://article.fikss.site/iot/ota-pembaruan-firmware)
- [Dari breadboard ke perangkat yang lebih rapi](https://article.fikss.site/iot/perakitan-kotak-perangkat)

### Listrik

- [Komponen AC: Fungsi dan Kapan Digunakan](https://article.fikss.site/materi/komponen-ac-penggunaan)
- [Proteksi Motor: Kontaktor, Overload, dan Pengaman](https://article.fikss.site/materi/proteksi-motor)
- [Penyearah, Regulator, Buck, Boost, dan Inverter](https://article.fikss.site/materi/penyearah-regulator)
- [Komponen DC: Fungsi dan Kapan Digunakan](https://article.fikss.site/materi/komponen-dc-penggunaan)
- [Saklar, Push Button, dan Kontak NO/NC](https://article.fikss.site/materi/saklar-no-nc)
- [Sekering dan Pemilihan Pengaman DC](https://article.fikss.site/materi/sekering-proteksi-dc)
- [Hukum Ohm dan Perhitungan Daya](https://article.fikss.site/materi/hukum-ohm-daya)
- [Konektor, Terminal, dan Sambungan Kabel](https://article.fikss.site/materi/terminal-sambungan-kabel)
- [Daya AC dan Faktor Daya: W, VA, dan var](https://article.fikss.site/materi/daya-ac-faktor-daya)

### Programming

- [Apa itu pemrograman terstruktur?](https://article.fikss.site/programming/pemrograman-terstruktur)
- [Menyiapkan dan menjalankan Python](https://article.fikss.site/programming/menjalankan-python)
- [Variabel dan tipe data](https://article.fikss.site/programming/variabel-tipe-data)
- [Input, output, dan perhitungan](https://article.fikss.site/programming/input-output-operator)
- [Percabangan if, elif, else dan logika](https://article.fikss.site/programming/percabangan-logika)
- [Perulangan for dan range](https://article.fikss.site/programming/perulangan-for)
- [Perulangan while dan kondisi berhenti](https://article.fikss.site/programming/perulangan-while)
- [List: menyimpan dan mengolah banyak data](https://article.fikss.site/programming/list-kumpulan-data)
- [Fungsi, parameter, dan return](https://article.fikss.site/programming/fungsi-parameter-return)
- [Merancang algoritma sebelum menulis kode](https://article.fikss.site/programming/algoritma-pseudocode)
- [Membaca error dan memvalidasi input](https://article.fikss.site/programming/kesalahan-validasi)
- [Proyek akhir: kasir sederhana](https://article.fikss.site/programming/proyek-kasir-sederhana)

