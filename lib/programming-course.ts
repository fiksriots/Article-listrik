import data from './programming-lessons.json';
import extended from './programming-extended-lessons.json';
import order from './programming-order.json';

export const programmingStages = order.map(group => group.title);
type ProgrammingBlock = {label:string; code:string; output:string; explanation:string; language?:string; filename?:string; inputs?:string[]};
type ProgrammingLesson = Omit<(typeof data)[number], 'blocks'> & {blocks:ProgrammingBlock[]};
const allLessons:ProgrammingLesson[] = [...data, ...extended];
// One order drives the catalogue, previous/next links, search and progress.
// Existing lesson slugs remain stable so completed marks are retained.
export const programmingLessons = order.flatMap((group, stage) => group.slugs.map(slug => {
  const lesson = allLessons.find(item => item.slug === slug);
  if (!lesson) throw new Error('Unknown programming lesson: '+slug);
  return {...lesson, stage};
}));
// Send catalogue metadata, rather than full lesson text, to client components.
export const programmingCatalog = programmingLessons.map(({slug,title,summary,stage,minutes}) => ({slug,title,summary,stage,minutes}));
