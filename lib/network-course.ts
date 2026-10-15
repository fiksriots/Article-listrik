export const networkStages = ['Mulai dari nol', 'Alamat dan identitas', 'Cara data berjalan', 'Membangun jaringan', 'Praktik dan pemeriksaan', 'Siap menangani kasus'];
export type NetworkLesson = {slug:string;title:string;summary:string;analogy:string;explain:string;example:string;practice:string[];warning:string;check:string;answer:string;nodes:string[];stage:number;minutes:number};
import data from './network-lessons.json';
export const networkLessons: NetworkLesson[] = data;
