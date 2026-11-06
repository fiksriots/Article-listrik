import data from './noc-lessons.json';
import {networkLessons} from './network-course';
export type NocTable = {caption:string;headers:string[];rows:string[][]};
export type NocSection = {title:string;body:string;code?:string;codeLabel?:string;language?:string;output?:string;outputLabel?:string;table?:NocTable};
export type NocLesson = {
 slug:string;title:string;summary:string;minutes:number;
 intro:string;goals:string[];analogy:string;sections:NocSection[];
 practice:string[];practiceReview:string;check:string;answer:string;
 sources:{title:string;url:string}[];template?:string;
};
export const nocLessons:NocLesson[]=data;
export type NocResource={slug:string;title:string;href:string};
function network(slug:string):NocResource {
 const lesson=networkLessons.find(l=>l.slug===slug);
 if(!lesson)throw new Error(`Missing NOC network reference: ${slug}`);
 return {slug,title:lesson.title,href:'/jaringan/'+slug};
}
function noc(slug:string):NocResource {
 const lesson=nocLessons.find(l=>l.slug==='noc-'+slug);
 if(!lesson)throw new Error(`Missing NOC lesson: ${slug}`);
 return {slug:lesson.slug,title:lesson.title,href:'/jaringan/noc/'+lesson.slug};
}
export const nocWeeks=[
 {title:'Kenali pekerjaan dan jalur layanan',goal:'Bisa menjelaskan pekerjaan L1 dan menggambar jalur pelanggan sampai internet.',resources:[noc('peran-dan-alur-kerja'),network('apa-itu-jaringan'),network('perangkat-jaringan'),network('topologi-jaringan'),network('lan-wan-internet')],lab:'Gambar satu topologi ISP fiktif, label perangkat dan dependensi, lalu buat checklist awal shift.',pass:'Jelaskan dampak jika satu uplink pada topologi putus dan tunjukkan siapa yang perlu dihubungi.'},
 {title:'IP, subnet, dan perjalanan paket',goal:'Bisa membedakan masalah lokal, gateway, DNS, dan layanan.',resources:[network('osi-tcp-ip'),network('ip-mac'),network('switch-arp'),network('tcp-udp-port'),network('subnet-mask'),network('gateway-dns'),network('dhcp-ip-statis')],lab:'Catat IP dua klien, subnet, gateway, dan resolver; hitung network dan broadcast untuk tiga subnet /24, /26, dan /30.',pass:'Tentukan alamat satu subnet, host valid, serta alasan membutuhkan gateway untuk tujuan di luar subnet.'},
 {title:'Kabel, fiber, radio, dan switching',goal:'Bisa membaca status link, membedakan akses fisik dan VLAN, serta mengenali loop.',resources:[network('ethernet-speed-duplex'),network('fiber-sfp-konektor'),network('kabel-fiber-poe'),network('vlan-access-trunk'),network('loop-rstp'),network('radio-ptp-los-fresnel')],lab:'Buat tabel port–perangkat–VLAN pada topologi latihan dan daftar bukti saat uplink down.',pass:'Jelaskan mengapa link up belum menjamin VLAN dan layanan benar. Ambang optik selalu mengikuti spesifikasi perangkat.'},
 {title:'Routing, NAT, dan dasar MikroTik',goal:'Bisa menelusuri default route, rute balik, NAT, dan akses manajemen.',resources:[network('routing-statis'),network('nat-ip-publik'),network('mikrotik-winbox'),network('mtcna-routeros-cli'),network('lab-jaringan-rumah'),network('firewall-dasar')],lab:'Gunakan satu router dan dua klien pada lab terisolasi; catat jalur paket pergi dan balasan. Ikuti lab Winbox bila perlu.',pass:'Temukan gateway atau rute lab yang salah, jelaskan buktinya, lalu pulihkan sesuai kondisi awal.'},
 {title:'Linux dan alat pemeriksaan',goal:'Bisa membaca alamat, rute, socket, DNS, HTTP, dan log dari terminal.',resources:[noc('linux-terminal'),network('monitoring-ping'),network('dns-record-ttl')],lab:'Buat lembar hasil ip, ss, dig, curl, dan log unit yang tersedia di VM. Catat waktu serta titik uji.',pass:'Bedakan gagal DNS, timeout koneksi, dan respons HTTP; jelaskan keterbatasan ping dan traceroute.'},
 {title:'Monitoring dan triase alarm',goal:'Bisa membaca baseline, memeriksa usia data, dan memvalidasi alarm.',resources:[network('bandwidth-latency'),network('monitoring-snmp-baseline'),network('mtcna-tools-monitoring'),noc('monitoring-alarm')],lab:'Pantau satu host lab atau analisis data contoh; simulasikan problem dan recovery. Catat interval, severity, dan dependensi.',pass:'Bedakan traffic nol dengan polling berhenti serta acknowledge dengan pemulihan layanan.'},
 {title:'Tiket, prioritas, dan eskalasi',goal:'Bisa membuat tiket yang dapat dilanjutkan petugas lain.',resources:[noc('tiket-eskalasi'),network('ipam-dokumentasi')],lab:'Buat tiga tiket dengan dampak, timeline WIB, bukti, prioritas, pemilik, dan jadwal update; susun satu eskalasi.',pass:'Penerima dapat memahami masalah dan tindakan berikutnya tanpa meminta ulang seluruh kronologi.'},
 {title:'Gangguan pelanggan ISP',goal:'Bisa membedakan akses fiber/radio, discovery PPPoE, autentikasi, dan layanan setelah login.',resources:[network('mtcna-pppoe-tunnel'),noc('akses-isp')],lab:'Buat pohon keputusan empat gejala pelanggan dan satu kasus beberapa pelanggan mati pada segmen sama.',pass:'Pilih bukti serta tim eskalasi yang tepat; jangan menyamakan semua gangguan dengan password salah.'},
 {title:'Upstream dan layanan internet',goal:'Bisa mengenali transit, peering, CDN, DNS, dan gejala routing dari sudut pandang NOC.',resources:[noc('upstream-dns-routing'),network('ipv6-alamat-prefix'),network('ospf-pengenalan'),network('failover-dua-isp')],lab:'Bandingkan dua tujuan, dua titik uji bila tersedia, serta A/AAAA. Simpan hasil DNS, traceroute, dan uji layanan.',pass:'Jelaskan batas kesimpulan hop yang tidak merespons dan kapan perlu eskalasi ke routing atau upstream.'},
 {title:'Troubleshooting berdasarkan bukti',goal:'Bisa menyempitkan dugaan tanpa mengganti banyak hal sekaligus.',resources:[network('troubleshooting-runtut'),network('flapping-jaringan'),network('wireshark-dasar'),network('mtu-mss-pmtud'),network('qos-bufferbloat')],lab:'Analisis satu kasus putus-nyambung dan satu kasus hanya sebagian situs gagal; catat bukti yang mendukung atau membantah tiap dugaan.',pass:'Bedakan fakta dan hipotesis serta tetapkan satu pemeriksaan berikutnya yang paling membantu.'},
 {title:'Handover dan pemulihan',goal:'Bisa menyerahkan kasus aktif dan memahami validasi serta rollback perubahan.',resources:[noc('handover-perubahan'),network('mtcna-backup-upgrade')],lab:'Buat handover tiga tiket dan rencana perubahan kecil pada lab, termasuk kondisi awal, pemicu rollback, serta validasi.',pass:'Penerima tahu pemilik, hambatan, tenggat, dan tindakan berikutnya; rencana pemulihan dapat dijalankan.'},
 {title:'Simulasi shift dan portofolio',goal:'Gabungkan keterampilan teknis dan komunikasi dalam empat insiden.',resources:[noc('lab-akhir')],lab:'Kumpulkan topologi, empat tiket, satu eskalasi, satu handover, hasil sebelum/sesudah, dan laporan insiden.',pass:'Minimal empat dari lima aspek tiap kasus terpenuhi; ulangi kasus yang tindakannya melampaui kewenangan atau belum punya pemulihan.'},
];
export const nocResources=[...new Map(nocWeeks.flatMap(w=>w.resources).map(r=>[r.slug,r])).values()];
