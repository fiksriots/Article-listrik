import Link from 'next/link';
import Catalog from '@/components/programming/academy';
import {programmingTracks} from '@/lib/programming-tracks';

const track = programmingTracks.find(item => item.id === 'terstruktur')!;
export const metadata = {
  title:'Pemrograman Terstruktur dengan Python | Learn Programming',
  description:'Belajar Python dari nol dengan alur bertahap: variabel, percabangan, perulangan, fungsi, file, debugging, dan proyek sederhana.',
  alternates:{canonical:'https://article.fikss.site/programming/terstruktur'},
};

export default function Page() {
  return <main id="konten" className="iot-home">
    <section className="iot-hero"><div><p className="net-eyebrow">LEARN PROGRAMMING / PEMROGRAMAN TERSTRUKTUR</p><h1>Susun langkahnya.<br/><em>Bangun programnya.</em></h1><p>Mulai dari instruksi sederhana, pahami cara program memilih dan mengulang, lalu pisahkan pekerjaan menjadi fungsi yang mudah diperiksa.</p><div className="iot-actions"><Link className="net-primary" href={'/programming/'+track.lessons[0].slug}>Mulai dari nol →</Link><a href="#kurikulum">Lihat materi ↓</a></div><p className="iot-meta">{track.lessons.length} materi · {track.stages.length} tahap · Contoh Python, latihan, dan tes</p></div><figure className="iot-hero-image"><img src="/programming/percabangan.svg" alt="Diagram percabangan menentukan kelulusan berdasarkan nilai minimal 75." width="860" height="480"/><figcaption>Ikuti alur dari masukan, keputusan, hingga keluaran program.</figcaption></figure></section>
    <aside className="net-track-note"><strong>Jalur Pemrograman Terstruktur</strong><p>Daftar dan progres di halaman ini khusus untuk jalur ini. <Link href="/programming/struktur-data">Buka jalur Struktur Data →</Link></p><p><Link href="/programming">← Pilih jalur Learn Programming</Link></p></aside>
    <section id="kurikulum"><header className="iot-section-title"><p className="net-eyebrow">BELAJAR BERTAHAP</p><h2>Dari program pertama sampai studi kasus.</h2><p>Pelajari fondasi secara berurutan. Contoh, latihan, dan tes membantu memeriksa pemahaman pada setiap materi.</p></header><Catalog items={track.catalog} stages={track.stages} label={track.title} homeHref={track.href}/></section>
    <section className="programming-case-studies"><header className="iot-section-title"><h2>Terapkan melalui studi kasus.</h2></header><div className="net-cards"><Link className="net-lesson-card" href="/programming/studi-kasus-nilai-siswa"><div className="net-card-body"><h3>Pengolah nilai siswa</h3><p>Validasi nilai, hitung rata-rata, dan tentukan status kelulusan.</p><span className="net-read-label">Pelajari →</span></div></Link><Link className="net-lesson-card" href="/programming/studi-kasus-pencatat-pengeluaran"><div className="net-card-body"><h3>Pencatat pengeluaran</h3><p>Bangun menu, simpan transaksi ke JSON, dan baca kembali riwayat.</p><span className="net-read-label">Pelajari →</span></div></Link></div></section>
  </main>;
}
