import Link from 'next/link';
import Catalog from '@/components/programming/academy';
import {programmingTracks} from '@/lib/programming-tracks';
const track = programmingTracks.find(item => item.id === 'basis-data')!;
export const metadata = {
  title:'Basis Data: SQL dan SQLite dengan Python | Learn Programming',
  description:'Belajar basis data dari awal: tabel, kunci, ERD, normalisasi, SQL, JOIN, transaksi, indeks, SQLite dengan Python, backup, serta dua studi kasus. Latihan dan tes pemahaman.',
  alternates:{canonical:'https://article.fikss.site/programming/basis-data'},
};
export default function Page() {
  return <main id="konten" className="iot-home">
    <section className="iot-hero"><div><p className="net-eyebrow">LEARN PROGRAMMING / BASIS DATA</p><h1>Simpan dengan rapi.<br/><em>Temukan maknanya.</em></h1><p>Kenali tabel dan hubungan data, tulis kueri SQL, lalu hubungkan SQLite dengan Python. Mulai dari kebutuhan sederhana sampai perubahan data yang harus berhasil bersama.</p><div className="iot-actions"><Link className="net-primary" href="/programming/db-pengantar">Mulai basis data →</Link><a href="#kurikulum">Lihat materi ↓</a></div><p className="iot-meta">{track.lessons.length} materi · {track.stages.length} tahap · 72 soal · Dua studi kasus</p></div><figure className="iot-hero-image"><img src="/programming/db-gambaran.svg" alt="Program mengirim kueri SQL ke SQLite yang mengelola tabel pelanggan dan tiket." width="860" height="480"/><figcaption>SQL menyatakan operasi; SQLite mengelola database yang digunakan program.</figcaption></figure></section>
    <aside className="net-track-note"><strong>Mulai dari konsep, lanjutkan ke praktik</strong><p>OOP bukan prasyarat. Untuk bab Python, pahami fungsi, import, dan exception. <Link href="/programming/terstruktur#kurikulum">Pelajari dasar Python →</Link> Contoh SQL memakai dialek SQLite dan database latihan kosong per artikel.</p></aside>
    <section id="kurikulum"><header className="iot-section-title"><p className="net-eyebrow">BELAJAR BERTAHAP</p><h2>Dari rancangan ke data yang dapat dipakai.</h2><p>Pelajari konsep sebelum menulis skema, kemudian kueri, integritas, transaksi, dan integrasi Python. Katalog serta progres di halaman ini khusus jalur Basis Data.</p></header><Catalog items={track.catalog} stages={track.stages} label={track.title} homeHref={track.href} placeholder="SQL, JOIN, transaksi, Python…"/></section>
    <section className="programming-case-studies"><header className="iot-section-title"><h2>Satukan konsep dalam studi kasus.</h2></header><div className="net-cards"><Link className="net-lesson-card" href="/programming/db-kasus-perpustakaan"><div className="net-card-body"><h3>Peminjaman buku</h3><p>Jaga relasi anggota dan buku, cegah pinjaman aktif ganda, lalu catat pengembalian.</p><span className="net-read-label">Pelajari →</span></div></Link><Link className="net-lesson-card" href="/programming/db-kasus-tiket"><div className="net-card-body"><h3>Tiket gangguan jaringan</h3><p>Gabungkan petugas, status, dan riwayat perubahan melalui transaksi database.</p><span className="net-read-label">Pelajari →</span></div></Link></div></section>
    <p><Link className="net-back" href="/programming">← Kembali ke Learn Programming</Link></p>
  </main>;
}
