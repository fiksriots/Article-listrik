import data from './iot-lessons.json';
export const iotStages=['Memahami IoT','Mengenal perangkat','Praktik lokal','Menghubungkan data','Sistem yang andal','Proyek dan evaluasi','Arduino A · Dasar dan program','Arduino B · Input/output dan sensor','Arduino C · Motor dan I2C','Arduino D · Koneksi internet'];
export type IoTLesson={slug:string;title:string;summary:string;stage:number;minutes:number;analogy:string;explain:string[];example:string;practice:string[];warning:string;check:string;answer:string;nodes:string[];table?:{headers:string[];rows:string[][]};sources?:{title:string;url:string}[];arduino?:{section:string;parts:string[];wiring:string[][];blocks:{label:string;language:string;code:string}[];result:string;troubleshoot:string[]}};
export const iotLessons:IoTLesson[]=data;
