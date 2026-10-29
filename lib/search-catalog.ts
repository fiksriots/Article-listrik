import 'server-only';
import {learningTracks} from './learning-progress-catalog';
import {trackLessons} from './learning-progress-types';
import {lessons} from './course';
import {networkLessons} from './network-course';
import {iotLessons} from './iot-course';
import {gitLessons} from './git-course';
import {winboxItems} from './winbox-course';
import {mtcnaGuides} from './mtcna-course';
import {mtcreTopics} from './mtcre-curriculum';
import {mtcreLabs} from './mtcre-labs';
import type {SearchLesson} from './search-types';
// Metadata only: article bodies and lab code are never sent to the search client.
const descriptions=new Map<string,{summary:string;minutes?:number}>([
 ...lessons.map(l=>['/materi/'+l.slug,{summary:l.summary,minutes:l.minutes}] as const),
 ...networkLessons.map(l=>['/jaringan/'+l.slug,{summary:l.summary,minutes:l.minutes}] as const),
 ...iotLessons.map(l=>['/iot/'+l.slug,{summary:l.summary,minutes:l.minutes}] as const),
 ...gitLessons.map(l=>['/git/'+l.slug,{summary:l.summary,minutes:l.minutes}] as const),
 ...winboxItems.map(l=>['/jaringan/winbox/'+l.slug,{summary:l.summary,minutes:l.minutes}] as const),
 ...mtcnaGuides.map(l=>['/jaringan/mtcna/panduan/'+l.slug,{summary:l.summary}] as const),
 ...mtcreTopics.map(l=>['/jaringan/mtcre/materi/'+l.slug,{summary:l.summary}] as const),
 ...mtcreLabs.map(l=>['/jaringan/mtcre/lab/'+l.slug,{summary:l.goal}] as const),
]);
export const searchTracks=learningTracks.map(track=>({id:track.id,title:track.title,lessons:trackLessons(track).map((lesson):SearchLesson=>({
 ...lesson,group:track.groups.find(group=>group.lessons.some(item=>item.href===lesson.href))!.title,
 ...descriptions.get(lesson.href)!,
}))}));
