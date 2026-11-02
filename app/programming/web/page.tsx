import Link from 'next/link';
import Catalog from '@/components/programming/academy';
import {programmingTracks} from '@/lib/programming-tracks';
const track = programmingTracks.find(item => item.id === 'web')!;
export const metadata = {
 title:'Pemrograman Web — HTML, CSS, dan JavaScript | Learn Programming',
 description:'Belajar web dari nol: HTML semantik, CSS, layout responsif, JavaScript, DOM, formulir, Fetch API, aksesibilitas, publikasi, portofolio, dan daftar tugas. Latihan serta tes pemahaman.',
 alternates:{canonical:'https://article.fikss.site/programming/web'},
};
export default function Page(){return <main id="konten" className="iot-home">
 <section className="iot-hero"><div><p className="net-eyebrow">LEARN PROGRAMMING / PEMROGRAMAN WEB</p><h1>Dari halaman pertama.<br/><em>Menjadi interaksi.</em></h1><p>Pahami HTML untuk struktur, CSS untuk tampilan, dan JavaScript untuk perilaku. Bangun halaman responsif, hubungkan data API, lalu kerjakan dua studi kasus.</p><div className="iot-actions"><Link className="net-primary" href="/programming/web-cara-kerja">Mulai Pemrograman Web →</Link><a href="#kurikulum">Lihat materi ↓</a></div><p className="iot-meta">{track.lessons.length} materi · {track.stages.length} tahap · {track.lessons.length * 4} soal · 2 studi kasus</p></div><figure className="iot-hero-image"><img src="/programming/web-fondasi.svg" alt="Browser menggabungkan HTML, CSS, dan JavaScript; data tambahan diminta melalui API." width="860" height="480"/><figcaption>Struktur, tampilan, dan perilaku bekerja bersama di browser.</figcaption></figure></section>
 <aside className="net-track-note"><strong>Bekal dan cara belajar</strong><p>Tidak perlu menguasai Python untuk memulai. Siapkan browser dan editor teks, baca sesuai urutan, lalu ubah contoh sedikit demi sedikit. Contoh HTML dapat dibuka langsung melalui tautan di setiap artikel. Python hanya salah satu pilihan untuk menjalankan server berkas lokal.</p></aside>
 <section id="kurikulum"><header className="iot-section-title"><p className="net-eyebrow">FONDASI → INTERAKSI → PRAKTIK</p><h2>Buat, coba, lalu pahami.</h2><p>Mulai dari dokumen dan layout, lanjutkan JavaScript, DOM, formulir, dan API. Uji aksesibilitas serta kesiapan publikasi sebelum mengerjakan portofolio dan daftar tugas. Setiap materi memiliki latihan dan empat soal pemahaman.</p></header><Catalog items={track.catalog} stages={track.stages} label={track.title} homeHref={track.href} placeholder="HTML, CSS, DOM, formulir, portofolio…"/></section>
 <aside className="net-track-note"><strong>Dua studi kasus</strong><p><Link href="/programming/web-kasus-portofolio">Portofolio responsif satu halaman →</Link></p><p><Link href="/programming/web-kasus-tugas">Daftar tugas dengan localStorage →</Link></p><p>Daftar tugas menyimpan data pada browser ini. Untuk website server-side dengan Python, lanjutkan ke <Link href="/programming/django">Django</Link>. Untuk kontrak API dan data bersama, pelajari <Link href="/programming/backend-api">Backend/API</Link> dan <Link href="/programming/basis-data">Basis Data</Link>.</p></aside>
 <p><Link className="net-back" href="/programming">← Kembali ke Learn Programming</Link></p>
 </main>}
