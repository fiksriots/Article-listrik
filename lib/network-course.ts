export const networkStages = ['Mulai dari nol', 'Kabel dan instalasi', 'Media dan rancangan', 'Alamat dan identitas', 'Cara data berjalan', 'Membangun jaringan', 'Praktik dan pemeriksaan', 'Siap menangani kasus', 'MTCNA · Fondasi RouterOS', 'MTCNA · Koneksi dan keamanan', 'MTCNA · Layanan dan praktik', 'Lanjutan · Alamat dan layanan', 'Lanjutan · Jalur dan ketahanan', 'Lanjutan · Analisis dan pengelolaan', 'Lanjutan · Integrasi dan keamanan'];
export type NetworkLesson = {slug:string;title:string;summary:string;analogy:string;explain:string;example:string;practice:string[];warning:string;check:string;answer:string;nodes:string[];stage:number;minutes:number;source?:string;mtcna?:number};
import data from './network-lessons.json';
export const networkLessons: NetworkLesson[] = data;
