const media:{[slug:string]:{file:string; alt:string; caption:string; width:number; height:number; demo?:string}} = {
  'web-formulir':{file:'formulir-valid.png',alt:'Formulir tiket berisi judul Link BTS-LAB putus dan email pelajar@example.com. Pesan menyatakan input lolos pemeriksaan browser tetapi belum dikirim ke server.',caption:'Tangkapan layar dari contoh formulir yang dijalankan di browser. Isian fiktif ini lolos validasi lokal; demo belum membuat tiket pada server.',width:960,height:550,demo:'/programming/lab/web/web-formulir.html'},
  'web-kasus-tugas':{file:'daftar-tugas.png',alt:'Daftar tiga tugas belajar. Pahami variabel dan tipe data sudah dicentang; latihan perulangan for dan uji input kosong belum selesai.',caption:'Tangkapan layar setelah tiga tugas ditambahkan, satu ditandai selesai, lalu halaman dimuat ulang. Status tetap tersedia melalui localStorage pada origin browser yang sama.',width:960,height:602,demo:'/programming/lab/web/web-kasus-tugas.html'},
  'lanjut-browser-form':{file:'api-laporan-lokal.png',alt:'Formulir lab laporan layanan dalam mode API lokal. Daftar memuat BTS-LAB Araya dengan hasil ok dan BTS-LAB Keputih dengan hasil timeout.',caption:'Tangkapan layar aplikasi lab yang benar-benar dijalankan. Dua observasi fiktif dikirim melalui formulir dan ditampilkan kembali dari API lokal. Data bukan hasil pemeriksaan BTS nyata.',width:850,height:790},
  'lanjut-browser-api':{file:'api-laporan-lokal.png',alt:'Lab laporan layanan menampilkan dua observasi dari API lokal: BTS-LAB Araya ok dan BTS-LAB Keputih timeout.',caption:'Tangkapan layar setelah POST /api/observasi menghasilkan HTTP 201 dan daftar dimuat kembali melalui GET. Pengujian pada artikel juga mencakup respons gagal; gambar ini memperlihatkan jalur berhasil.',width:850,height:790},
};

export default function LessonMedia({slug}:{slug:string}) {
  const item = media[slug];
  if (!item) return null;
  const src = '/programming/screenshots/'+item.file;
  return <section className="programming-lesson-media">
    <h2>Hasil praktik di browser</h2>
    <figure><a href={src} target="_blank" rel="noopener noreferrer" aria-label="Buka tangkapan layar ukuran penuh"><img src={src} alt={item.alt} width={item.width} height={item.height} loading="lazy"/></a>
      <figcaption>{item.caption} <a href={src} target="_blank" rel="noopener noreferrer">Lihat ukuran penuh ↗</a></figcaption>
    </figure>
    {item.demo && <p><a href={item.demo} target="_blank" rel="noopener noreferrer">Buka contoh dan coba sendiri ↗</a></p>}
  </section>;
}
