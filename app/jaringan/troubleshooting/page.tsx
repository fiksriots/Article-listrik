import type {Metadata} from 'next';
import Link from 'next/link';
import {flappingArticle, troubleshootingGroups, troubleshootingItems} from '@/lib/troubleshooting-course';
import './troubleshooting.css';

export const metadata: Metadata = {
  title: 'Troubleshooting Jaringan — Diagnosis, Flapping, dan Pemulihan | Learn Networking',
  description: 'Pusat materi troubleshooting jaringan: flapping, ping, DNS/DHCP, pemeriksaan MikroTik, OSPF, monitoring, dan pemulihan konfigurasi. Mulai dari gejala dan buktikan hasilnya.',
  alternates: {canonical: 'https://article.fikss.site/jaringan/troubleshooting'},
};

export default function TroubleshootingHome() {
  return <main id="konten" className="net-container troubleshooting-home">
    <Link className="net-back" href="/jaringan">← Learn Networking</Link>
    <header className="troubleshooting-hero">
      <p className="net-eyebrow">TROUBLESHOOTING / DIAGNOSIS DAN PENANGANAN GANGGUAN</p>
      <h1>Kenali gejalanya.<br/>Temukan penyebabnya.</h1>
      <p>Mulai dari pemeriksaan sederhana, kumpulkan bukti, lalu uji satu dugaan pada satu waktu. Menu ini mengumpulkan artikel dan panduan gangguan jaringan agar mudah ditemukan tanpa harus mencari di seluruh kurikulum.</p>
      <div className="net-actions"><Link className="net-primary" href="/jaringan/troubleshooting-runtut">Mulai pemeriksaan berurutan →</Link><a href="#kasus-gangguan">Pilih kasus gangguan ↓</a></div>
      <div className="troubleshooting-facts"><span><strong>{troubleshootingItems.length}</strong> artikel & panduan</span><span><strong>{troubleshootingGroups.length}</strong> kelompok materi</span></div>
    </header>
    <section className="troubleshooting-featured" aria-labelledby="flapping-featured-title">
      <div><span className="net-eyebrow">ARTIKEL FLAPPING</span><h2 id="flapping-featured-title">Koneksi putus-nyambung, tetapi yang berubah apa?</h2><p>{flappingArticle.summary}</p><Link className="net-primary" href={flappingArticle.href}>Baca artikel flapping →</Link></div>
      <figure><img src="/network/flapping-jaringan.svg" width="800" height="420" alt="Ilustrasi perubahan link, adjacency OSPF, dan rute pada waktu yang berbeda"/><figcaption>Ilustrasi pola perubahan yang disederhanakan; bukan log router nyata.</figcaption></figure>
    </section>
    <nav className="troubleshooting-group-nav" aria-label="Kelompok troubleshooting">{troubleshootingGroups.map(group => <a key={group.id} href={`#${group.id}`}>{group.title}</a>)}</nav>
    <aside className="net-track-note"><strong>Cara memakai panduan</strong><p>Gejala → bukti awal → hipotesis → satu pengujian → bandingkan hasil → pemulihan atau eskalasi. Materi pendalaman OSPF boleh dilewati dahulu jika kamu baru mulai. Tanda sudah dibaca tetap dikelola pada halaman materi masing-masing.</p></aside>
    {troubleshootingGroups.map(group => <section key={group.id} id={group.id} className="troubleshooting-group">
      <header><h2>{group.title}</h2><p>{group.description}</p></header>
      <div className="troubleshooting-cards">{group.items.map(item => <article key={item.href}>
        <small>{item.minutes} menit · {item.href.includes('/winbox/') ? 'Praktik Winbox' : item.href.includes('mtcre-') ? 'Pendalaman MTCRE' : item.href.includes('mtcna-') ? 'Panduan MTCNA' : 'Learn Networking'}</small>
        <h3><Link href={item.href}>{item.title}</Link></h3><p>{item.summary}</p><Link className="troubleshooting-open" href={item.href}>Buka pembahasan →</Link>
      </article>)}</div>
    </section>)}
    <aside className="net-crosslink"><h2>Perkuat dasar bila pemeriksaan terasa sulit.</h2><p>Ulangi IP, subnet, gateway, DNS, dan aliran paket sebelum mengubah konfigurasi. Gunakan Praktik Winbox untuk mengikuti menu satu per satu, atau MTCNA/MTCRE untuk pendalaman.</p><Link href="/jaringan#kurikulum">Kurikulum jaringan →</Link><Link href="/jaringan/winbox">Praktik Winbox →</Link><Link href="/jaringan/mtcna">MTCNA →</Link><Link href="/jaringan/mtcre">MTCRE →</Link></aside>
  </main>;
}
