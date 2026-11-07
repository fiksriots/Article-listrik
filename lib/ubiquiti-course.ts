import data from './ubiquiti-lessons.json';
export type UbiquitiSection={title:string;body:string;code?:string;codeLabel?:string;language?:string;table?:{caption:string;headers:string[];rows:string[][]}};
export type UbiquitiLesson={slug:string;title:string;summary:string;minutes:number;intro:string;goals:string[];analogy:string;sections:UbiquitiSection[];practice:string[];practiceReview:string;check:string;answer:string;sources:{title:string;url:string}[];diagram:string;diagramAlt:string;related:{title:string;href:string}[]};
export const ubiquitiLessons:UbiquitiLesson[]=data;
export const ubiquitiResources=ubiquitiLessons.map(l=>({slug:l.slug,title:l.title,href:'/jaringan/ubiquiti/'+l.slug}));
