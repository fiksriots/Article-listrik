import {programmingLessons} from './programming-course';
import order from './programming-order.json';

const definitions = [
  {id:'terstruktur', title:'Pemrograman Terstruktur', href:'/programming/terstruktur', summary:'Belajar Python dari nol: alur, percabangan, perulangan, fungsi, pengolahan data dasar, file, dan proyek.', groups:order.filter(group => group.title !== 'Struktur Data')},
  {id:'struktur-data', title:'Struktur Data', href:'/programming/struktur-data', summary:'Pelajari cara mengatur data: stack, queue, linked list, tree, graph, heap, pencarian, dan pengurutan.', groups:order.filter(group => group.title === 'Struktur Data')},
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
