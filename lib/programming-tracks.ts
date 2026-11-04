import {programmingLessons} from './programming-course';
import order from './programming-order.json';

const definitions = [
  {id:'terstruktur', title:'Pemrograman Terstruktur', href:'/programming/terstruktur', summary:'Belajar Python dari nol: alur, percabangan, perulangan, fungsi, pengolahan data dasar, file, dan proyek.', groups:order.filter(group => group.title !== 'Struktur Data' && !group.title.startsWith('OOP ·') && !group.title.startsWith('Basis Data ·') && !group.title.startsWith('Backend/API ·') && !group.title.startsWith('Web ·') && !group.title.startsWith('Django ·') && !group.title.startsWith('Data Analysis ·') && !group.title.startsWith('Data Science ·') && !group.title.startsWith('Pemrograman Jaringan ·') && !group.title.startsWith('Pengujian & Debugging ·') && !group.title.startsWith('Proyek & Otomasi ·') && !group.title.startsWith('Rekayasa & Deployment ·'))},
  {id:'struktur-data', title:'Struktur Data', href:'/programming/struktur-data', summary:'Pelajari cara mengatur data: stack, queue, linked list, tree, graph, heap, pencarian, dan pengurutan.', groups:order.filter(group => group.title === 'Struktur Data')},
  {id:'oop', title:'Pemrograman Berorientasi Objek', href:'/programming/oop', summary:'Belajar OOP dengan Python: class, object, enkapsulasi, inheritance, polymorphism, komposisi, serta studi kasus.', groups:order.filter(group => group.title.startsWith('OOP ·'))},
  {id:'basis-data', title:'Basis Data', href:'/programming/basis-data', summary:'Pahami tabel, relasi, SQL, transaksi, indeks, SQLite dan PostgreSQL, relasi ORM, migrasi Alembic, JSONB, pencarian teks, serta RLS melalui latihan dan studi kasus.', groups:order.filter(group => group.title.startsWith('Basis Data ·'))},
  {id:'backend-api', title:'Backend/API', href:'/programming/backend-api', summary:'Hubungkan client dan database melalui HTTP, JSON, REST, FastAPI, CRUD, autentikasi, transaksi, error, JWT, idempotensi, webhook, deployment, serta pengujian Python.', groups:order.filter(group => group.title.startsWith('Backend/API ·'))},
  {id:'pemrograman-jaringan', title:'Pemrograman Jaringan', href:'/programming/pemrograman-jaringan', summary:'Bangun komunikasi jaringan dengan Python: endpoint, bytes, socket TCP/UDP, framing, HTTP, TLS, konkurensi, serta dua proyek loopback.', groups:order.filter(group => group.title.startsWith('Pemrograman Jaringan ·'))},
  {id:'web', title:'Pemrograman Web', href:'/programming/web', summary:'Bangun halaman dengan HTML, CSS, dan JavaScript: layout responsif, DOM, formulir, API, aksesibilitas, publikasi, serta dua studi kasus.', groups:order.filter(group => group.title.startsWith('Web ·'))},
  {id:'django', title:'Django', href:'/programming/django', summary:'Bangun website Python dengan Django: URL, view, template, ORM, migrasi, admin, CRUD, login, permission, pengujian, dan dua studi kasus.', groups:order.filter(group => group.title.startsWith('Django ·'))},
  {id:'data-analysis', title:'Data Analysis', href:'/programming/data-analysis', summary:'Olah data dengan Python, NumPy, dan pandas: kualitas data, agregasi, join, grafik, waktu, laporan, serta studi kasus penjualan dan monitoring jaringan.', groups:order.filter(group => group.title.startsWith('Data Analysis ·'))},
  {id:'data-science', title:'Data Science', href:'/programming/data-science', summary:'Pahami statistik, sampling, data leakage, pipeline, regresi, klasifikasi, evaluasi, clustering, serta studi kasus prediksi pada data sintetis.', groups:order.filter(group => group.title.startsWith('Data Science ·'))},
  {id:'pengujian-debugging', title:'Pengujian & Debugging', href:'/programming/pengujian-debugging', summary:'Uji perilaku dengan pytest, fixture, parametrize, mock, integrasi SQLite, traceback, debugger, serta logging terstruktur.', groups:order.filter(group=>group.title.startsWith('Pengujian & Debugging ·'))},
  {id:'proyek-otomasi', title:'Proyek & Otomasi Python', href:'/programming/proyek-otomasi', summary:'Kelola lingkungan dan paket Python, pahami Linux serta proses, lalu otomatisasikan CSV, laporan, jadwal, dan client API lokal.', groups:order.filter(group=>group.title.startsWith('Proyek & Otomasi ·'))},
  {id:'rekayasa-deployment', title:'Rekayasa & Deployment', href:'/programming/rekayasa-deployment', summary:'Susun kebutuhan, modul, dokumentasi dan review; pelajari Docker, CI, rilis, rollback, serta proyek akhir CSV, SQLite, API dan dashboard.', groups:order.filter(group=>group.title.startsWith('Rekayasa & Deployment ·'))},
];

// Keep article URLs and programming/<slug> progress keys stable.
// Only the catalogue, stage numbers and navigation are scoped to each path.
export const programmingTracks = definitions.map(track => {
  const lessons = track.groups.flatMap((group, stage) => group.slugs.map(slug => {
    const lesson = programmingLessons.find(item => item.slug === slug);
    if (!lesson) throw new Error('Unknown programming lesson: '+slug);
    return {...lesson, stage};
  }));
  return {...track, lessons, stages:track.groups.map(group => group.title), catalog:lessons.map(({slug,title,summary,stage,minutes}) => ({slug,title,summary,stage,minutes}))};
});

export function getProgrammingLessonTrack(slug:string) {
  return programmingTracks.find(track => track.lessons.some(lesson => lesson.slug === slug));
}
