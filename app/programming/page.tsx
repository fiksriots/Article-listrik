import Link from 'next/link';
import {programmingTracks} from '@/lib/programming-tracks';

export const metadata = {
  title:'Learn Programming — Python, Struktur Data, OOP, dan Basis Data',
  description:'Belajar melalui empat jalur: Pemrograman Terstruktur, Struktur Data, OOP, dan Basis Data dengan SQLite serta Python. Contoh, latihan, dan tes pemahaman.',
  alternates:{canonical:'https://article.fikss.site/programming'},
};

export default function Page() {
  return <main id="konten" className="iot-home programming-paths">
    <header className="programming-paths-heading"><p className="net-eyebrow">AKADEMI 05 / LEARN PROGRAMMING</p><h1>Pilih jalur<br/><em>belajarmu.</em></h1><p>Pilih Pemrograman Terstruktur, Struktur Data, Pemrograman Berorientasi Objek, atau Basis Data. Setiap jalur memiliki urutan materi dan progres tersendiri.</p></header>
    <section id="kurikulum" aria-label="Pilihan jalur Learn Programming" className="programming-track-grid">{programmingTracks.map((track,index) => <Link key={track.id} href={track.href} className={'programming-track-card programming-track-'+track.id}><span className="net-eyebrow">JALUR {String(index+1).padStart(2,'0')}</span><h2>{track.title}</h2><p>{track.summary}</p><ul>{track.id === 'terstruktur' ? <><li>Variabel, input, dan keluaran</li><li>Percabangan, perulangan, dan fungsi</li><li>File, debugging, dan proyek sederhana</li></> : track.id === 'basis-data' ? <><li>Tabel, kunci, relasi, dan normalisasi</li><li>SQL, transaksi, indeks, dan integritas</li><li>SQLite dengan Python dan dua studi kasus</li></> : track.id === 'oop' ? <><li>Class, object, self, dan atribut</li><li>Enkapsulasi, inheritance, dan polymorphism</li><li>Komposisi, pola rancangan, dan proyek</li></> : <><li>Big O, stack, queue, dan linked list</li><li>Tree, graph, hash map, dan heap</li><li>Pencarian, pengurutan, dan studi kasus</li></>}</ul><small>{track.lessons.length} materi · Latihan dan tes pemahaman</small><strong>Buka {track.title} →</strong></Link>)}</section>
    <aside className="net-track-note"><strong>Baru mulai belajar Python?</strong><p>Mulai dari Pemrograman Terstruktur untuk memahami dasar bahasa dan alur program. Setelah menguasai list, dictionary, fungsi, dan import, lanjutkan ke Struktur Data atau OOP sesuai tujuanmu. Struktur Data bukan prasyarat untuk memulai OOP. Konsep Basis Data dapat dipelajari terpisah; bagian integrasi Python membutuhkan dasar fungsi dan exception.</p></aside>
  </main>;
}
