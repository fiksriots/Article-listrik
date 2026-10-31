import Link from 'next/link';
import Catalog from '@/components/programming/academy';
import {programmingTracks} from '@/lib/programming-tracks';

const track = programmingTracks.find(item => item.id === 'oop')!;
export const metadata = {
  title:'Pemrograman Berorientasi Objek dengan Python | Learn Programming',
  description:'Belajar OOP bertahap: class, object, self, enkapsulasi, inheritance, polymorphism, abstraksi, komposisi, dataclass, pengujian, dan dua studi kasus. Contoh Python serta tes pemahaman.',
  alternates:{canonical:'https://article.fikss.site/programming/oop'},
};

export default function Page() {
  return <main id="konten" className="iot-home">
    <section className="iot-hero"><div><p className="net-eyebrow">LEARN PROGRAMMING / OOP PYTHON</p><h1>Kenali objeknya.<br/><em>Susun perilakunya.</em></h1><p>Satukan data dan tindakan yang berkaitan. Pelajari class dengan contoh sehari-hari, lalu bangun program kecil yang mudah diperiksa dan dikembangkan.</p><div className="iot-actions"><Link className="net-primary" href="/programming/oop-pengantar">Mulai belajar OOP →</Link><a href="#kurikulum">Lihat materi ↓</a></div><p className="iot-meta">{track.lessons.length} materi · {track.stages.length} tahap · 60 soal · Dua studi kasus</p></div><figure className="iot-hero-image"><img src="/programming/oop-objek.svg" alt="Class Lampu membuat dua instance dengan nama dan status masing-masing." width="860" height="480"/><figcaption>Satu class dapat membuat banyak objek dengan data yang terpisah.</figcaption></figure></section>
    <aside className="net-track-note"><strong>Bekal sebelum mulai</strong><p>Pahami variabel, fungsi, list, dictionary, import, dan try/except. <Link href="/programming/terstruktur#kurikulum">Pelajari dasar Python →</Link> Struktur Data boleh dipelajari terpisah; tidak wajib diselesaikan sebelum OOP.</p></aside>
    <section id="kurikulum"><header className="iot-section-title"><p className="net-eyebrow">DARI KONSEP KE PRAKTIK</p><h2>Satu langkah, satu konsep.</h2><p>Mulai dari objek sederhana, pahami hubungan antarkelas, lalu uji perilakunya. Daftar dan progres di sini khusus jalur OOP.</p></header><Catalog items={track.catalog} stages={track.stages} label={track.title} homeHref={track.href} placeholder="Class, inheritance, komposisi…"/></section>
    <section className="programming-case-studies"><header className="iot-section-title"><h2>Terapkan dalam dua studi kasus.</h2></header><div className="net-cards"><Link className="net-lesson-card" href="/programming/oop-kasus-inventaris"><div className="net-card-body"><h3>Inventaris barang</h3><p>Jaga aturan stok, tolak pengeluaran berlebih, dan hitung nilai persediaan.</p><span className="net-read-label">Pelajari →</span></div></Link><Link className="net-lesson-card" href="/programming/oop-kasus-monitoring"><div className="net-card-body"><h3>Pemantauan perangkat simulasi</h3><p>Gabungkan objek pembaca dan monitor untuk menilai data suhu latihan.</p><span className="net-read-label">Pelajari →</span></div></Link></div></section>
    <p><Link className="net-back" href="/programming">← Kembali ke Learn Programming</Link></p>
  </main>;
}
