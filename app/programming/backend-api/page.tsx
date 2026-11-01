import Link from 'next/link';
import Catalog from '@/components/programming/academy';
import {programmingTracks} from '@/lib/programming-tracks';
const track = programmingTracks.find(item => item.id === 'backend-api')!;
export const metadata = {
  title:'Backend/API dengan Python dan FastAPI | Learn Programming',
  description:'Pelajari HTTP, JSON, kontrak REST, FastAPI, validasi, pengujian, dan proyek tiket dengan SQLite atau PostgreSQL. Contoh Python dan tes pemahaman.',
  alternates:{canonical:'https://article.fikss.site/programming/backend-api'},
};
export default function Page() {
  return <main id="konten" className="iot-home">
    <section className="iot-hero"><div><p className="net-eyebrow">LEARN PROGRAMMING / BACKEND &amp; API</p><h1>Hubungkan aplikasi.<br/><em>Jaga aturan datanya.</em></h1><p>Pahami percakapan HTTP, rancang kontrak endpoint, lalu bangun API Python yang memvalidasi masukan dan menyimpan perubahan melalui transaksi.</p><div className="iot-actions"><Link className="net-primary" href="/programming/api-http-json">Mulai Backend/API →</Link><a href="#kurikulum">Lihat materi ↓</a></div><p className="iot-meta">{track.lessons.length} materi · {track.stages.length} tahap · 24 soal · Proyek tiket</p></div><figure className="iot-hero-image"><img src="/programming/server-api-alur.svg" alt="Client terhubung ke API, service, repository, dan database melalui kontrak yang jelas." width="860" height="480"/><figcaption>Request yang valid diproses sesuai aturan, lalu perubahan disahkan pada database.</figcaption></figure></section>
    <aside className="net-track-note"><strong>Bekal sebelum praktik</strong><p>Pahami fungsi, type hint, exception, virtual environment, dan class dasar. Untuk proyek akhir, pelajari <Link href="/programming/db-sqlalchemy">SQLAlchemy →</Link> serta <Link href="/programming/oop-repository-service">repository dan service →</Link>. Server contoh dijalankan lokal oleh pembaca; situs ini menyajikan materi.</p></aside>
    <section id="kurikulum"><header className="iot-section-title"><p className="net-eyebrow">DARI KONTRAK KE PENGUJIAN</p><h2>Satu endpoint, satu tujuan yang jelas.</h2><p>Mulai dari HTTP dan JSON, lanjutkan implementasi serta validasi, lalu uji API dan kerjakan proyek. Katalog serta progres di sini khusus Backend/API.</p></header><Catalog items={track.catalog} stages={track.stages} label={track.title} homeHref={track.href} placeholder="HTTP, REST, FastAPI, pengujian…"/></section>
    <aside className="net-track-note"><strong>Proyek gabungan</strong><p><Link href="/programming/api-proyek-tiket">Pengelola tiket gangguan dengan API dan database server →</Link></p><p>Demo cepat menggunakan SQLite; factory server menerima URL PostgreSQL dari konfigurasi. Jalankan pada database latihan terpisah.</p></aside>
    <p><Link className="net-back" href="/programming">← Kembali ke Learn Programming</Link></p>
  </main>;
}
