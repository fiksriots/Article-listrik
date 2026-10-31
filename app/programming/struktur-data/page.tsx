import Link from 'next/link';
import Catalog from '@/components/programming/academy';
import {programmingTracks} from '@/lib/programming-tracks';
const track = programmingTracks.find(item => item.id === 'struktur-data')!;

export const metadata = {
  title:'Struktur Data dengan Python | Learn Programming',
  description:'Belajar struktur data dari nol: set, dictionary, stack, queue, linked list, tree, graph, rekursi, BST, heap, hashing, serta studi kasus. Contoh Python dan tes pemahaman.',
  alternates:{canonical:'https://article.fikss.site/programming/struktur-data'},
};

export default function Page() {
  const items = track.catalog;
  return <main id="konten" className="iot-home">
    <section className="iot-hero"><div><p className="net-eyebrow">LEARN PROGRAMMING / STRUKTUR DATA</p><h1>Data tertata.<br/><em>Logika lebih jelas.</em></h1><p>Pelajari cara memilih tempat penyimpanan dan hubungan data: dari kumpulan unik hingga antrean, hierarki, dan graph.</p><div className="iot-actions"><Link className="net-primary" href="/programming/struktur-data-dasar">Mulai struktur data →</Link><a href="#kurikulum">Lihat materi ↓</a></div><p className="iot-meta">{items.length} materi · Contoh Python · Ilustrasi · Latihan dan tes</p></div><figure className="iot-hero-image"><img src="/programming/struktur-pilihan.svg" alt="List untuk urutan, set untuk keunikan, dictionary untuk key-value, dan deque untuk antrean." width="860" height="480"/><figcaption>Pilih struktur berdasarkan operasi yang dibutuhkan, lalu periksa perilakunya dengan contoh kecil.</figcaption></figure></section>
    <aside className="net-track-note"><strong>Bekal sebelum mulai</strong><p>Pahami variabel, percabangan, perulangan, list, dictionary dasar, fungsi, dan import. Belum sampai di sana? <Link href="/programming/terstruktur#kurikulum">Ikuti kurikulum Python dari awal →</Link></p></aside>
    <aside className="net-track-note"><strong>Studi kasus Struktur Data</strong><p><Link href="/programming/struktur-kasus-kurung">Pemeriksa pasangan tanda kurung dengan stack →</Link></p><p><Link href="/programming/struktur-kasus-prioritas">Penjadwal tugas berdasarkan prioritas →</Link></p></aside>
    <aside className="net-track-note"><strong>Studi kasus lanjutan</strong><p><Link href="/programming/struktur-kasus-kontak">Pencarian kontak berdasarkan awalan →</Link></p><p><Link href="/programming/struktur-kasus-rute">Pencarian rute termurah dengan Dijkstra →</Link></p></aside>
    <section id="kurikulum"><header className="iot-section-title"><p className="net-eyebrow">BELAJAR BERTAHAP</p><h2>Dari kebutuhan sederhana ke hubungan data.</h2><p>Ikuti urutan berikut. Materi memakai dictionary untuk memperkenalkan node tanpa mengharuskanmu mempelajari kelas terlebih dahulu. Daftar dan progres di halaman ini khusus untuk jalur Struktur Data.</p></header><Catalog items={items} stages={track.stages} label={track.title} homeHref={track.href} placeholder="Stack, tree, graph, heap…"/></section>
    <p><Link className="net-back" href="/programming">← Kembali ke Learn Programming</Link></p>
  </main>;
}
