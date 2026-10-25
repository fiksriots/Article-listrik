import {winboxPhases} from '@/lib/winbox-phases';
import type {Metadata} from 'next';
import Link from 'next/link';
import WinboxOutline from '@/components/network/winbox-outline';
import {winboxItems} from '@/lib/winbox-course';
import '../mtcna/mtcna.css';
import './winbox.css';

export const metadata: Metadata = {
  title: `Praktik Winbox — ${winboxItems.length} Submateri MikroTik dari Nol | Learn Jaringan`,
  description: `Belajar Winbox 4 melalui ${winboxItems.length} submateri: Interfaces, VLAN, firewall, PCQ, failover dua ISP, WireGuard, keamanan, dan proyek kantor kecil.`,
  alternates: {canonical: 'https://article.fikss.site/jaringan/winbox'},
};

export default function WinboxHome() {
  return <main id="konten" className="net-container mtcna-curriculum">
    <Link className="net-back" href="/jaringan">← Learn Jaringan</Link>
    <header className="mtcna-intro">
      <span className="net-eyebrow">PRAKTIK WINBOX / KURIKULUM BELAJAR</span>
      <h1>Kenali menunya.<br/>Coba konfigurasinya.</h1>
      <p>Belajar mengelola MikroTik lewat Winbox 4, mulai dari membaca port sampai menghubungkan laptop ke internet. Ikuti penjelasan sederhana, screenshot asli, diagram konsep, dan latihan pada router lab.</p>
      <div className="mtcna-facts"><span><strong>{winboxItems.length}</strong> submateri</span><span><strong>{winboxPhases.length}</strong> tahap belajar</span><span><strong>v7</strong> RouterOS</span></div>
      <div className="net-actions"><Link className="net-primary" href="/jaringan/winbox/persiapan">Mulai praktik Winbox →</Link><a href="#submateri-winbox">Lihat urutan belajar ↓</a></div>
    </header>
    <section className="mtcna-roadmap"><section>
      <span className="net-eyebrow">SEBELUM MULAI</span>
      <h2>Siapkan fondasi dan router latihan.</h2>
      <p>Pahami IP, subnet, gateway, DNS, dan routing dasar. Latihan internet utama menggunakan router dengan konfigurasi bawaan yang sesuai, modem aktif, serta laptop. Kondisi awal dan backup dijelaskan pada submateri pertama.</p>
      <div className="mtcna-prerequisites"><Link href="/jaringan/ip-mac">IP dan MAC</Link><Link href="/jaringan/subnet-mask">Subnet dan prefix</Link><Link href="/jaringan/gateway-dns">Gateway dan DNS</Link><Link href="/jaringan/routing-statis">Routing dasar</Link><Link href="/jaringan/mikrotik-winbox">Pengantar MikroTik</Link></div>
    </section></section>
    <aside className="net-track-note"><strong>Cara mengikuti jalur ini</strong><p>Delapan tahap belajar dimulai dari pengenalan menu dan satu LAN, kemudian berlanjut ke VLAN, PCQ, failover, VPN, keamanan, serta proyek kantor kecil. Selesaikan fondasi sebelum lab lanjutan; setiap skenario memiliki pemetaan port dan checkpoint sendiri. Setiap submateri memiliki tujuan, penjelasan kolom, latihan, hasil yang diuji, dan cara pemulihan. Gambar berlabel screenshot asli menampilkan Winbox 4; diagram konsep menjelaskan aliran data. Sebagian screenshot masih berupa penunjuk menu.</p></aside>
    <WinboxOutline items={winboxItems}/>
    <aside className="net-crosslink"><h2>Perdalam konsep setelah mencoba.</h2><p>Praktik Winbox menghubungkan penggunaan menu dengan konfigurasi dan pengujian bertahap. Lanjutkan ke kurikulum MTCNA untuk memperluas penguasaan RouterOS, lalu MTCRE untuk routing lanjutan.</p><Link href="/jaringan/mtcna">Buka MTCNA →</Link><Link href="/jaringan/mtcre">Buka MTCRE →</Link><Link href="/jaringan">Kembali ke Learn Jaringan →</Link></aside>
  </main>;
}
