export default function ColabPractice({slug}: {slug: string}) {
  const url = `https://colab.research.google.com/github/fiksriots/Article-listrik/blob/main/examples/colab/${slug}.ipynb`;
  return <aside className="net-track-note" aria-label="Praktik di Google Colab">
    <strong>Praktik langsung di browser</strong>
    <p>Buka notebook sesuai materi, lengkap dengan kode, dataset latihan, dan latihan mandiri. Tidak perlu memasang Anaconda.</p>
    <p><a className="net-primary" href={url} target="_blank" rel="noopener noreferrer">Praktik di Google Colab ↗</a></p>
    <ol>
      <li>Masuk ke akun Google jika diminta, lalu simpan salinan notebook di Drive agar perubahanmu tersimpan.</li>
      <li>Jalankan sel dari atas ke bawah dengan tombol ▶. Sel awal menyiapkan pustaka dan dataset.</li>
      <li>Ubah contoh kode dan kerjakan latihan. Unduh file hasil dari panel Files sebelum sesi berakhir.</li>
    </ol>
    <p>Data fiktif/sintetis sudah disertakan. CPU cukup untuk latihan ini. Jika sesi direset, jalankan ulang sel persiapan; angka keluaran bisa sedikit berbeda karena versi pustaka.</p>
  </aside>;
}
