import {programmingLessons} from './programming-course';
import order from './programming-order.json';

const definitions = [
  {id:'terstruktur', title:'Pemrograman Terstruktur', href:'/programming/terstruktur', summary:'Belajar Python dari nol: alur, percabangan, perulangan, fungsi, pengolahan data dasar, file, dan proyek.', groups:order.filter(group => group.title !== 'Struktur Data' && !group.title.startsWith('OOP ·') && !group.title.startsWith('Basis Data ·') && !group.title.startsWith('Backend/API ·') && !group.title.startsWith('Web ·') && !group.title.startsWith('Django ·'))},
  {id:'struktur-data', title:'Struktur Data', href:'/programming/struktur-data', summary:'Pelajari cara mengatur data: stack, queue, linked list, tree, graph, heap, pencarian, dan pengurutan.', groups:order.filter(group => group.title === 'Struktur Data')},
  {id:'oop', title:'Pemrograman Berorientasi Objek', href:'/programming/oop', summary:'Belajar OOP dengan Python: class, object, enkapsulasi, inheritance, polymorphism, komposisi, serta studi kasus.', groups:order.filter(group => group.title.startsWith('OOP ·'))},
  {id:'basis-data', title:'Basis Data', href:'/programming/basis-data', summary:'Pahami tabel, relasi, SQL, transaksi, indeks, SQLite dan PostgreSQL, relasi ORM, migrasi Alembic, JSONB, pencarian teks, serta RLS melalui latihan dan studi kasus.', groups:order.filter(group => group.title.startsWith('Basis Data ·'))},
  {id:'backend-api', title:'Backend/API', href:'/programming/backend-api', summary:'Hubungkan client dan database melalui HTTP, JSON, REST, FastAPI, CRUD, autentikasi, transaksi, error, JWT, idempotensi, webhook, deployment, serta pengujian Python.', groups:order.filter(group => group.title.startsWith('Backend/API ·'))},
  {id:'web', title:'Pemrograman Web', href:'/programming/web', summary:'Bangun halaman dengan HTML, CSS, dan JavaScript: layout responsif, DOM, formulir, API, aksesibilitas, publikasi, serta dua studi kasus.', groups:order.filter(group => group.title.startsWith('Web ·'))},
  {id:'django', title:'Django', href:'/programming/django', summary:'Bangun website Python dengan Django: URL, view, template, ORM, migrasi, admin, CRUD, login, permission, pengujian, dan dua studi kasus.', groups:order.filter(group => group.title.startsWith('Django ·'))},
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
