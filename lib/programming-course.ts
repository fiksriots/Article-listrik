import data from './programming-lessons.json';
import extended from './programming-extended-lessons.json';
import structures from './programming-data-structure-lessons.json';
import oop from './programming-oop-lessons.json';
import databases from './programming-database-lessons.json';
import api from './programming-api-lessons.json';
import web from './programming-web-lessons.json';
import django from './programming-django-lessons.json';
import supplements from './programming-supplement-lessons.json';
import order from './programming-order.json';

export const programmingStages = order.map(group => group.title);
type ProgrammingBlock = {label:string; code:string; output:string; explanation:string; language?:string; filename?:string; inputs?:string[]; measurement?:boolean; requiresPostgres?:boolean};
type ProgrammingLesson = Omit<(typeof data)[number], 'blocks'> & {blocks:ProgrammingBlock[]};
const allLessons:ProgrammingLesson[] = [...data, ...extended, ...structures, ...oop, ...databases, ...api, ...web, ...django, ...supplements];
// One order drives the catalogue, previous/next links, search and progress.
// Existing lesson slugs remain stable so completed marks are retained.
export const programmingLessons = order.flatMap((group, stage) => group.slugs.map(slug => {
  const lesson = allLessons.find(item => item.slug === slug);
  if (!lesson) throw new Error('Unknown programming lesson: '+slug);
  return {...lesson, stage};
}));
// Send catalogue metadata, rather than full lesson text, to client components.
export const programmingCatalog = programmingLessons.map(({slug,title,summary,stage,minutes}) => ({slug,title,summary,stage,minutes}));
const structureSlugs = new Set(order.filter(group => group.title === 'Struktur Data').flatMap(group => group.slugs));
export const dataStructureCatalog = programmingCatalog.filter(lesson => structureSlugs.has(lesson.slug));
