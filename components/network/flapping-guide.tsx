import Link from 'next/link';
import CodeBlock from '@/components/code-block';

function Table({caption, headers, rows}: {caption: string; headers: string[]; rows: string[][]}) {
  return <div className="net-table-wrap"><table><caption>{caption}</caption><thead><tr>{headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

export default function FlappingGuide() {
  return <section className="flapping-guide" aria-label="Pembahasan lengkap flapping jaringan">
    <p><small>Artikel · Diperbarui 27 Oktober 2026 · Acuan menu Winbox 4 dan RouterOS v7</small></p>
    <details className="flapping-toc"><summary>Daftar isi artikel</summary><ol>
      <li><a href="#flap-jenis">Empat jenis flapping yang perlu dibedakan</a></li>
      <li><a href="#flap-penyebab">Penyebab dan petunjuk awal</a></li>
      <li><a href="#flap-winbox">Urutan pemeriksaan di Winbox</a></li>
      <li><a href="#flap-log">Membaca log dan perubahan counter</a></li>
      <li><a href="#flap-ospf">Mendalami OSPF flapping</a></li>
      <li><a href="#flap-terminal">Perintah pemeriksaan opsional</a></li>
      <li><a href="#flap-kasus">Tiga studi kasus</a></li>
      <li><a href="#flap-pemulihan">Pemulihan dan bukti perbaikan</a></li>
      <li><a href="#flap-sumber">Sumber teknis</a></li>
    </ol></details>

    <h2 id="flap-jenis">Empat jenis flapping yang perlu dibedakan</h2>
    <p>Kata <em>flapping</em> menjelaskan pola perubahan yang berulang. Sebutkan objeknya agar diagnosis tidak rancu: port fisik, MAC address, rute, atau neighbor OSPF. Satu kejadian putus ketika kabel sengaja dicabut adalah perubahan status; pengulangan yang tidak diharapkan perlu diselidiki.</p>
    <Table caption="Objek yang berubah menentukan pemeriksaan pertama" headers={['Jenis', 'Yang berulang', 'Bukti yang dicari']} rows={[
      ['Link/interface flapping', 'Port atau link berganti up → down → up.', 'Log interface dan pertambahan link-downs pada port terkait.'],
      ['MAC flapping', 'MAC sumber yang sama pada VLAN yang sama dipelajari melalui port berbeda secara cepat.', 'Bridge Hosts / tabel MAC, port asal, VLAN, dan pola perpindahan.'],
      ['Route flapping', 'Rute ditarik, muncul kembali, berubah keterjangkauan, atau berulang kali berganti jalur terpilih.', 'Perubahan route/gateway pada waktu yang sama dengan gejala.'],
      ['OSPF neighbor flapping', 'Hubungan neighbor yang sebelumnya terbentuk berulang kali turun lalu dibangun kembali.', 'Riwayat state, uptime adjacency, interface OSPF, dan log kedua router.'],
    ]}/>
    <p>MAC berpindah belum tentu merupakan gangguan: klien Wi-Fi dapat berpindah AP, atau sistem redundansi melakukan perpindahan yang memang direncanakan. Sebaliknya, perpindahan cepat yang tidak diharapkan dapat mengarah ke loop Layer 2, rancangan redundant link yang salah, atau MAC duplikat. Cocokkan dengan topologi sebelum memutus kabel.</p>
    <aside className="net-warning"><strong>Ping putus-putus belum membuktikan link flapping.</strong><p>Packet loss atau latency dapat naik saat antrean penuh, radio terganggu, CPU sibuk, atau ICMP dibatasi meskipun port Ethernet tetap running. Traceroute yang menunjukkan next hop berbeda antarpercobaan juga dapat berasal dari ECMP (beberapa jalur dengan biaya setara); periksa perubahan tabel route sebelum menyebutnya flapping.</p></aside>

    <h2 id="flap-penyebab">Penyebab umum: cari petunjuk, jangan langsung menyimpulkan</h2>
    <Table caption="Dugaan awal dan bukti pembanding" headers={['Petunjuk', 'Kemungkinan', 'Pemeriksaan pembanding']} rows={[
      ['Satu port berulang link down/up', 'Kabel/konektor, port lawan, daya perangkat lawan, modul optik, atau negosiasi link.', 'Catat counter kedua sisi; bandingkan menggunakan satu kabel/port lab yang diketahui baik.'],
      ['Beberapa link turun bersama dan uptime router mulai lagi', 'Router atau perangkat lawan reboot; catu daya dan kejadian sistem perlu diperiksa.', 'Cocokkan uptime, log, waktu listrik/PoE, dan perangkat yang sebenarnya restart.'],
      ['Ethernet tetap up, tetapi jalur radio tidak lewat', 'Masalah RF, asosiasi radio, kapasitas, atau konfigurasi pada jalur wireless.', 'Periksa status RF (sinyal radio) dan log radio dan loss antarujung; jangan hanya membaca port Ethernet MikroTik.'],
      ['MAC/VLAN yang sama bolak-balik port', 'Loop, perpindahan klien yang sah, redundansi, atau alamat MAC duplikat.', 'Petakan dua port, arah ke switch/AP, kondisi STP/RSTP, serta waktu roaming.'],
      ['OSPF reset tetapi port tidak mengalami link-down baru', 'Hello terlewat, loss, beban CPU, BFD bila dipakai, konfigurasi/proses OSPF, atau jalur transport.', 'Lihat log kedua ujung, uptime adjacency, CPU, dan link/tunnel yang dilalui.'],
      ['Default route bolak-balik ketika port tetap up', 'Probe/check-gateway atau routing dinamis berubah, termasuk target pemeriksaan yang tidak stabil.', 'Cocokkan route probe, gateway yang dipakai, dan hasil pemeriksaan masing-masing WAN.'],
    ]}/>
    <p>Cuaca atau pemasangan luar ruangan dapat menjadi konteks penting untuk radio dan kabel, tetapi bukan diagnosis tunggal. Catat apakah yang mati adalah daya perangkat, link Ethernet, atau sambungan radio. Jangan memaksa speed/duplex atau menaikkan daya radio sebagai percobaan pertama tanpa mengetahui kondisi kedua sisi.</p>

    <h2 id="flap-winbox">Urutan pemeriksaan di Winbox</h2>
    <p>Mulai dari membaca kondisi. Gunakan akses pengelolaan yang stabil dan perangkat yang memang boleh kamu kelola. Nama tab atau kolom dapat berbeda menurut versi, model, paket, serta hak akun.</p>
    <ol>
      <li><strong>Catat waktu dan cakupan gangguan.</strong> Apakah satu pelanggan, satu sektor, satu switch, atau seluruh jaringan? Tulis interface, tetangga, versi RouterOS, dan durasi gejala. Cocokkan jam kedua router sebelum membandingkan log.</li>
      <li><strong>Log → cari kejadian pada waktu yang sama.</strong> Periksa kategori interface, system, ospf, atau layanan yang terkait. Simpan bukti sebelum reboot karena log di memori dapat hilang. Log hanya memuat kejadian yang memang dikonfigurasi untuk dicatat; tidak ada pesan bukan bukti bahwa jalur pasti sehat.</li>
      <li><strong>Interfaces → buka port yang dicurigai.</strong> Catat running, negotiated rate, counter link-down, dan waktu link up/down bila tersedia. Baca hasil negosiasi aktual. Bandingkan dengan sisi lawan dan jangan reset counter sebelum nilai awal tersimpan.</li>
      <li><strong>System → Resources, kemudian Tools → Profile bila diperlukan.</strong> Catat uptime router dan CPU pada saat gejala. Uptime router yang tidak berubah tetapi uptime neighbor OSPF mulai lagi menunjukkan dua hal yang berbeda.</li>
      <li><strong>Tools → Ping dan Traceroute.</strong> Bandingkan gateway lokal, tetangga transit, dan tujuan yang melewati jalur bermasalah. Uji dari router serta klien; sumber dan jalur ping router belum tentu sama dengan trafik pelanggan. Amati saat sepi dan saat ramai.</li>
      <li><strong>Periksa objek yang sesuai bukti.</strong> Untuk perpindahan MAC, buka Bridge → Hosts dan status port/RSTP. Untuk OSPF, buka Routing → OSPF → Neighbors serta Interfaces; konfigurasi v7 umumnya diperiksa di Interface Templates. Untuk rute, buka IP → Routes dan catat destination, gateway, status, serta routing table.</li>
    </ol>
    <p>Jika port fisik memang sering turun, selesaikan link atau daya terlebih dahulu. Mengubah parameter routing pada jalur yang masih putus-nyambung dapat menambah variasi gejala tanpa memperbaiki penyebab dasarnya.</p>

    <h2 id="flap-log">Contoh membaca log dan perubahan counter</h2>
    <p>Berikut catatan simulasi untuk latihan membaca waktu, bukan hasil pemeriksaan router nyata. Format pesan dan detailnya dapat berbeda pada perangkatmu.</p>
    <CodeBlock label="Contoh simulasi · kejadian interface" language="text" code={'10:12:01  interface,info  ether5 link down\n10:12:04  interface,info  ether5 link up\n10:13:19  interface,info  ether5 link down\n10:13:22  interface,info  ether5 link up'}/>
    <p>Catatan ini menunjukkan link ether5 berubah beberapa kali. Catatan ini belum menyebut penyebabnya: kabel dicabut, perangkat lawan kehilangan daya, perubahan konfigurasi, atau masalah media bisa menghasilkan perubahan link.</p>
    <Table caption="Contoh pengamatan dua waktu pada periode counter yang sama" headers={['Waktu', 'Link-downs', 'Uptime router', 'Kesimpulan terbatas']} rows={[
      ['10.10', '8', '5 hari', 'Nilai awal tersimpan. Angka 8 dapat berasal dari kejadian sebelumnya.'],
      ['10.15', '10', '5 hari 5 menit', 'Bertambah dua kali dalam interval ini; router tidak terlihat reboot dari catatan uptime tersebut.'],
    ]}/>
    <p>Gunakan selisih counter dalam periode yang sama, bukan totalnya saja. Reboot, reset counter, perubahan driver/interface, atau tindakan administrasi dapat mengubah dasar perbandingan. Simpan juga error/CRC bila perangkat menampilkannya: error yang bertambah merupakan petunjuk media/link, tetapi tidak sama dengan hitungan link-down.</p>

    <h2 id="flap-ospf">OSPF flapping: neighbor berubah, belum tentu port ikut turun</h2>
    <p>OSPF membangun hubungan antarrouter untuk bertukar informasi routing. Pada adjacency yang memang diharapkan Full, pola berulang seperti <strong>Full → Down → Init/ExStart/Exchange → Full</strong>, dengan riwayat dan uptime yang mendukung, patut diperiksa. Beberapa state dapat terlewat dari pengamatan karena prosesnya cepat.</p>
    <Table caption="Jangan menyamakan semua state OSPF dengan flapping" headers={['Yang terlihat', 'Makna yang perlu dipertimbangkan']} rows={[
      ['Full stabil', 'Adjacency tersinkron pada pasangan itu; tetap uji forwarding dan layanan jika ada keluhan.'],
      ['2-Way stabil pada jaringan broadcast', 'Dapat normal antara dua router DROther, yaitu keduanya bukan DR/BDR pada segmen broadcast. Tidak semua pasangan neighbor harus menjadi Full.'],
      ['ExStart/Exchange berulang atau tertahan', 'Periksa proses sinkronisasi, MTU, loss, dan parameter terkait. MTU mismatch dapat menghambat adjacency; bukan otomatis penjelasan untuk setiap flap.'],
      ['Full berulang turun dan terbentuk kembali', 'Cocokkan waktu putus, alasan log, uptime adjacency, link fisik/tunnel, CPU, dan keadaan kedua ujung.'],
      ['Cost/rute berubah tetapi adjacency tetap Full', 'Dapat merupakan perubahan keputusan jalur, bukan neighbor flapping.'],
    ]}/>
    <p>Periksa dengan urutan yang masuk akal:</p>
    <ol>
      <li><strong>Transport terlebih dahulu:</strong> link fisik, radio atau tunnel yang membawa OSPF, loss, daya, serta kemungkinan reboot. Port lokal yang up tidak menjamin seluruh jalur di tengah sehat.</li>
      <li><strong>Kecocokan konfigurasi kedua sisi:</strong> area, network type, autentikasi, alamat/mask yang relevan, Router ID yang unik, serta Hello/Dead interval. Perbedaan parameter dapat membuat adjacency gagal terbentuk, bukan selalu naik-turun.</li>
      <li><strong>Kontrol trafik dan beban:</strong> periksa apakah firewall mengizinkan OSPF pada link yang direncanakan dan apakah CPU/loss meningkat ketika neighbor terputus. OSPF IPv4 memakai IP protocol 89, bukan TCP atau UDP port 89.</li>
      <li><strong>MTU dan BFD bila digunakan:</strong> periksa bukti ketidakcocokan MTU terutama saat ExStart/Exchange. BFD merupakan mekanisme deteksi keterjangkauan cepat. Jika diaktifkan, korelasikan status BFD dengan reset adjacency; jangan menaikkan atau menurunkan timer secara acak.</li>
    </ol>
    <p>Memperpanjang Dead Interval dapat mengubah toleransi terhadap Hello yang hilang, tetapi juga mengubah deteksi gangguan. Tindakan itu bukan pengganti perbaikan kabel, loss, daya, atau CPU. Jangan mengubah timer/cost pada router layanan hanya untuk menghilangkan gejala di layar.</p>
    <p>Pendalaman konfigurasi tersedia pada <Link href="/jaringan/mtcre">jalur MTCRE</Link>. Untuk pemula, memahami beda port turun dan adjacency turun sudah menjadi fondasi diagnosis yang penting.</p>

    <h2 id="flap-terminal">Perintah pemeriksaan opsional · RouterOS v7</h2>
    <p>Winbox tetap dapat digunakan. Perintah berikut membantu mengumpulkan informasi yang sama melalui Terminal; ganti ether5 dengan nama port yang sebenarnya. Ini perintah baca/monitor, bukan perintah perbaikan otomatis.</p>
    <CodeBlock label="Terminal · status port dan kejadian terkait" language="routeros" code={'/interface/print stats-detail where name="ether5"\n/interface/ethernet/monitor ether5 once\n/log/print where topics~"interface|ospf"\n/system/resource/print'}/>
    <CodeBlock label="Terminal · pendalaman OSPF dan route" language="routeros" code={'/routing/ospf/neighbor/print detail\n/routing/ospf/interface/print detail\n/ip/route/print detail'}/>
    <p>Pilih waktu pengamatan yang sama pada kedua ujung. Keluaran dapat memuat informasi jaringan internal; samarkan sebelum dibagikan kepada pihak yang tidak memerlukannya.</p>

    <h2 id="flap-kasus">Tiga studi kasus: gejala mirip, pemeriksaan berbeda</h2>
    <p><strong>Kasus A — Radio sulit diakses ketika hujan.</strong> Port Ethernet switch berulang link down/up, sementara uptime radio mulai lagi. Dugaan awal mengarah ke restart radio atau sambungan daya/link, bukan langsung ke OSPF. Periksa adaptor/PoE sesuai spesifikasi, konektor, kabel luar ruangan, dan bukti perangkat yang reboot. Jika Ethernet serta uptime radio stabil tetapi asosiasi RF terputus, pindahkan pemeriksaan ke radio dan jalur wireless. Kondisi hujan memberi konteks; bukti tetap menentukan kesimpulan.</p>
    <p><strong>Kasus B — Neighbor OSPF turun ketika trafik ramai.</strong> Link-downs tidak bertambah dan uptime router tetap berjalan, tetapi adjacency dibangun ulang. Bandingkan loss pada transit, CPU/Profile, log kedua router, serta status BFD jika digunakan. Beban atau loss merupakan hipotesis yang perlu dibuktikan pada waktu kejadian. Jangan menyimpulkan kabel pasti baik hanya dari counter satu sisi, atau langsung memperpanjang timer OSPF.</p>
    <p><strong>Kasus C — MAC bolak-balik pada dua uplink switch.</strong> Semua port tetap running. Petakan MAC dan VLAN, kedua uplink, serta perubahan STP/RSTP; cocokkan pula perpindahan klien/AP atau sistem redundansi. Bila ada jalur loop yang tidak direncanakan, isolasi hanya jalur yang sudah teridentifikasi dan berizin, sambil menjaga akses pengelolaan. Jangan mencabut dua uplink sekaligus atau mematikan RSTP untuk mencoba-coba.</p>

    <h2 id="flap-pemulihan">Pemulihan dan bukti bahwa perbaikan membantu</h2>
    <p>Sesudah dugaan cukup kuat, ubah satu hal dalam ruang lingkup yang disetujui. Misalnya, ganti satu kabel uji pada port cadangan, koreksi satu parameter yang tidak cocok, atau perbaiki satu jalur redundansi yang telah dipetakan. Catat nilai awal dan cara mengembalikannya.</p>
    <ol>
      <li>Bandingkan kondisi sebelum–sesudah pada rentang pengamatan dan beban yang relevan. Gangguan yang biasanya muncul saat ramai perlu diuji lagi pada kondisi ramai yang dapat dikendalikan.</li>
      <li>Periksa apakah link-down berhenti bertambah, adjacency bertahan sesuai rancangan, route tidak lagi berulang berubah tanpa sebab, serta layanan klien membaik.</li>
      <li>Jangan menyatakan selesai hanya karena ikon hijau sesaat. Lima menit tenang belum cukup membuktikan gangguan yang sebelumnya hanya muncul beberapa jam sekali sudah hilang.</li>
      <li>Bila belum pasti, eskalasi dengan waktu kejadian, topologi, model/versi, port kedua sisi, log, selisih counter, hasil uji, dan perubahan terakhir. Bedakan fakta dari dugaan.</li>
    </ol>
    <aside className="net-warning"><strong>Hindari menghapus bukti sebelum memahami masalah.</strong><p>Reboot, reset counter, membersihkan seluruh tabel koneksi, menonaktifkan firewall, atau mengganti banyak parameter sekaligus dapat mengganggu layanan dan menyulitkan pembandingan. Perubahan MTU/L2MTU juga dapat memicu reload interface pada kondisi tertentu; catat tindakan administrasi saat membaca peristiwa link-down.</p></aside>
    <Table caption="Template catatan singkat untuk tim atau eskalasi" headers={['Bagian', 'Isi yang dicatat']} rows={[
      ['Gejala dan waktu', 'Apa yang berubah, mulai kapan, durasi, serta siapa yang terdampak.'],
      ['Perangkat dan jalur', 'Router/switch/radio, versi, interface lokal, perangkat lawan, VLAN atau tunnel.'],
      ['Bukti', 'Log yang relevan, uptime, counter awal–akhir, status neighbor/route, hasil uji klien.'],
      ['Dugaan dan pengujian', 'Satu hipotesis yang diuji, hasil pembanding, serta temuan yang belum pasti.'],
      ['Tindakan dan pemulihan', 'Perubahan yang dilakukan, hasil sesudahnya, dan cara kembali ke kondisi awal.'],
    ]}/>
    <p><Link href="/jaringan/troubleshooting">Lihat semua artikel di menu Troubleshooting →</Link></p><p><Link href="/jaringan/winbox/troubleshooting-kasus-nyata">Lanjutkan latihan troubleshooting melalui Winbox →</Link></p>

    <h2 id="flap-sumber">Sumber teknis artikel</h2>
    <ul>
      <li><a href="https://manual.mikrotik.com/docs/wired-connections/ethernet/">MikroTik — Ethernet: link dan negosiasi</a></li>
      <li><a href="https://manual.mikrotik.com/docs/cli-reference/interface/">MikroTik — Interface: counter link-downs</a></li>
      <li><a href="https://manual.mikrotik.com/docs/diagnostics-monitoring-and-troubleshooting/log/">MikroTik — Log dan pencatatan kejadian</a></li>
      <li><a href="https://help.mikrotik.com/docs/spaces/ROS/pages/9863229/OSPF">MikroTik — OSPF dan hubungan neighbor</a></li>
      <li><a href="https://manual.mikrotik.com/docs/hardware/mtu-in-routeros/">MikroTik — MTU in RouterOS</a></li>
      <li><a href="https://www.cisco.com/c/en/us/support/docs/ip/syslog/221140-troubleshoot-mac-address-flap-notificati.html">Cisco — Troubleshoot MAC Address Flap Notification</a></li>
    </ul>
    <p>Penjelasan, contoh waktu, dan studi kasus disusun untuk pembelajaran. Cocokkan nama menu dan keluaran dengan versi perangkat; contoh kasus bukan klaim hasil diagnosis jaringan tertentu.</p>
  </section>;
}
