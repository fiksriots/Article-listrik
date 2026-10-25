import data from './git-lessons.json';
export const gitStages=['Fondasi dan persiapan','Mencatat perubahan','Branch dan penggabungan','Terhubung ke GitHub','Kolaborasi','Memperbaiki kesalahan','Pendalaman dan proyek akhir','GitLab: project, kolaborasi, dan CI/CD'];
export const gitLessons=data;
// Keep full article text out of the client-side catalogue bundle.
export const gitCatalog=data.map(({slug,title,summary,stage,minutes})=>({slug,title,summary,stage,minutes}));

export const gitlabLessons=gitLessons.filter(lesson=>lesson.slug.startsWith('gitlab-'));
