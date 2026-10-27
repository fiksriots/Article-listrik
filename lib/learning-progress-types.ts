import type {Academy,ProgressMap} from './auth/progress-store';
export type ProgressLesson={slug:string;title:string;href:string};
export type ProgressGroup={id:string;title:string;href:string;lessons:ProgressLesson[]};
export type LearningTrack={id:Academy;title:string;href:string;groups:ProgressGroup[]};
// Overlapping paths (such as Troubleshooting) count a lesson only once per Learn.
export function trackLessons(track:LearningTrack){return [...new Map(track.groups.flatMap(g=>g.lessons).map(l=>[l.slug,l])).values()];}
export function progressSummary(academy:Academy,lessons:ProgressLesson[],map:ProgressMap){
 const unique=[...new Map(lessons.map(l=>[l.slug,l])).values()];
 const done=unique.filter(l=>map[academy+'/'+l.slug]?.completed===true).length;
 return {done,total:unique.length,percent:unique.length?Math.round(done/unique.length*100):0,next:unique.find(l=>map[academy+'/'+l.slug]?.completed!==true)};
}
