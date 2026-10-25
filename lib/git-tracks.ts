import {gitLessons} from './git-course';
export type GitTrackId='dasar'|'github'|'gitlab';
const definitions=[
 {id:'dasar' as const,title:'Dasar Git',href:'/git/dasar',summary:'Pahami Git di komputer: commit, branch, merge, pemulihan, dan lab lokal.',groups:[
  {title:'Fondasi dan persiapan',slugs:['apa-itu-git','git-dan-github','instalasi-git','terminal-dan-identitas']},
  {title:'Mencatat dan membaca perubahan',slugs:['repo-pertama','tiga-area','commit-pertama','status-diff-log','git-vscode','commit-rapi-add-p','gitignore','readme-dokumentasi','lf-crlf-gitattributes','blame-show-riwayat']},
  {title:'Branch dan penggabungan',slugs:['branch','merge','konflik']},
  {title:'Keamanan dan lab kolaborasi lokal',slugs:['keamanan-repository','lab-konflik-dua-kontributor']},
  {title:'Memperbaiki kesalahan',slugs:['restore-revert','stash','reset-reflog']},
  {title:'Pendalaman Git',slugs:['rebase-cherry-pick','git-worktree','git-lfs-aset-besar','tag-dan-troubleshooting','git-bisect']},
 ]},
 {id:'github' as const,title:'GitHub',href:'/git/github',summary:'Kelola repository GitHub, ajukan pull request, lalu gunakan Actions dan deployment.',groups:[
  {title:'Repository, akses, dan sinkronisasi',slugs:['github-remote','autentikasi','push-clone','fetch-pull']},
  {title:'Pull request dan kolaborasi',slugs:['pull-request','github-issues','review-pull-request','fork']},
  {title:'Actions, deployment, dan proyek akhir',slugs:['github-actions','git-vercel','proyek-akhir']},
 ]},
 {id:'gitlab' as const,title:'GitLab',href:'/git/gitlab',summary:'Kenali project GitLab, merge request, pipeline, runner, artifacts, dan Pages.',groups:[
  {title:'Project dan akses repository',slugs:['gitlab-mengenal','gitlab-project-clone','gitlab-akses-push']},
  {title:'Issue, merge request, dan review',slugs:['gitlab-issue-merge-request','gitlab-review-konflik']},
  {title:'Pipeline, artifacts, dan Pages',slugs:['gitlab-pipeline-runner','gitlab-artifact-variable','gitlab-pages']},
  {title:'Dua remote dan proyek akhir',slugs:['gitlab-multi-remote','gitlab-proyek-akhir']},
 ]},
];
export const gitTracks=definitions.map(track=>{
 const lessons=track.groups.flatMap((group,stage)=>group.slugs.map(slug=>{
  const lesson=gitLessons.find(l=>l.slug===slug);
  if(!lesson)throw new Error('Unknown Git track lesson: '+slug);
  return {...lesson,stage};
 }));
 return {...track,lessons,stages:track.groups.map(g=>g.title),catalog:lessons.map(({slug,title,summary,stage,minutes})=>({slug,title,summary,stage,minutes}))};
});
export function getGitTrack(id:GitTrackId){return gitTracks.find(track=>track.id===id)!;}
export function getGitLessonTrack(slug:string){return gitTracks.find(track=>track.lessons.some(lesson=>lesson.slug===slug));}
