import Link from 'next/link';
export default function NotFound() {
  return <main id="konten" className="max-w-2xl mx-auto px-5 py-20 space-y-5">
    <p className="font-bold text-teal-700">404 · Materi tidak ditemukan</p>
    <h1 className="text-3xl font-extrabold">Mari kembali ke jalur belajar.</h1>
    <p className="muted">Alamat ini belum tersedia atau salah ketik. Semua 24 pelajaran dapat kamu temukan di katalog modul.</p>
    <Link className="btn" href="/modul">Buka katalog modul →</Link>
  </main>;
}
