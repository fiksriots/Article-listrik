import data from './programming-lessons.json';

export const programmingStages = ['Mulai dari nol', 'Mengatur alur program', 'Menyusun program yang rapi', 'Praktik mandiri'];
export const programmingLessons = data;
// Send catalogue metadata, rather than full lesson text, to client components.
export const programmingCatalog = data.map(({slug,title,summary,stage,minutes}) => ({slug,title,summary,stage,minutes}));
