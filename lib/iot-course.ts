import data from './iot-lessons.json';
export const iotStages=['Memahami IoT','Mengenal perangkat','Praktik lokal','Menghubungkan data','Sistem yang andal','Proyek dan evaluasi'];
export type IoTLesson={slug:string;title:string;summary:string;stage:number;minutes:number;analogy:string;explain:string[];example:string;practice:string[];warning:string;check:string;answer:string;nodes:string[];table?:{headers:string[];rows:string[][]};sources?:{title:string;url:string}[]};
export const iotLessons:IoTLesson[]=data;
