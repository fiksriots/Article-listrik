import 'server-only';
import {programmingLessons,programmingStages} from './programming-course';
import {lessons,stages} from './course';
import {networkLessons} from './network-course';
import {iotGroups,iotLessons} from './iot-course';
import {gitTracks} from './git-tracks';
import {mtcnaGuides} from './mtcna-course';
import {mtcreLabs} from './mtcre-labs';
import {mtcreTopics} from './mtcre-curriculum';
import {winboxItems,winboxProgressSlug} from './winbox-course';
import {troubleshootingItems} from './troubleshooting-course';
import type {LearningTrack} from './learning-progress-types';
const electric=(slug:string)=>({slug,title:lessons.find(l=>l.slug===slug)!.title,href:'/materi/'+slug});
const network=(items:typeof networkLessons)=>items.map(l=>({slug:l.slug,title:l.title,href:'/jaringan/'+l.slug}));
// Serialize metadata only; article text, illustrations and code stay on the server.
export const learningTracks:LearningTrack[]=[
 {id:'listrik',title:'Learn Electric',href:'/listrik',groups:stages.map(s=>({id:s.id,title:s.name,href:'/modul#tahap-'+s.id,lessons:s.slugs.map(electric)}))},
 {id:'jaringan',title:'Learn Networking',href:'/jaringan',groups:[
  {id:'dasar',title:'Dasar Jaringan',href:'/jaringan',lessons:network(networkLessons.filter(l=>!l.mtcna&&!l.mtcre&&l.stage<11))},
  {id:'mtcna',title:'MTCNA',href:'/jaringan/mtcna',lessons:[...network(networkLessons.filter(l=>!!l.mtcna)),...mtcnaGuides.map(l=>({slug:'mtcna-guide-'+l.slug,title:l.title,href:'/jaringan/mtcna/panduan/'+l.slug}))]},
  {id:'pendalaman',title:'Pendalaman Jaringan',href:'/jaringan',lessons:network(networkLessons.filter(l=>!l.mtcna&&!l.mtcre&&l.stage>=11))},
  {id:'mtcre',title:'MTCRE',href:'/jaringan/mtcre',lessons:[...network(networkLessons.filter(l=>!!l.mtcre)),...mtcreTopics.map(l=>({slug:'mtcre-topic-'+l.slug,title:l.title,href:'/jaringan/mtcre/materi/'+l.slug})),...mtcreLabs.map(l=>({slug:'mtcre-lab-'+l.slug,title:'Lab · '+l.title,href:'/jaringan/mtcre/lab/'+l.slug}))]},
  {id:'winbox',title:'Praktik Winbox',href:'/jaringan/winbox',lessons:winboxItems.map(l=>({slug:winboxProgressSlug(l.slug),title:l.title,href:'/jaringan/winbox/'+l.slug}))},
  {id:'troubleshooting',title:'Troubleshooting',href:'/jaringan/troubleshooting',lessons:troubleshootingItems.map(l=>({slug:l.href.includes('/winbox/')?winboxProgressSlug(l.href.split('/').pop()!):l.href.split('/').pop()!,title:l.title,href:l.href}))},
 ]},
 {id:'iot',title:'Learn IoT',href:'/iot',groups:iotGroups.map(g=>({id:g.id,title:g.title,href:'/iot',lessons:g.slugs.map(slug=>({slug,title:iotLessons.find(l=>l.slug===slug)!.title,href:'/iot/'+slug}))}))},
 {id:'git',title:'Learn Git',href:'/git',groups:gitTracks.map(t=>({id:t.id,title:t.title,href:t.href,lessons:t.lessons.map(l=>({slug:l.slug,title:l.title,href:'/git/'+l.slug}))}))},
 {id:'programming',title:'Learn Programming',href:'/programming',groups:programmingStages.map((title,index)=>({id:'python-'+index,title,href:'/programming#kurikulum',lessons:programmingLessons.filter(l=>l.stage===index).map(l=>({slug:l.slug,title:l.title,href:'/programming/'+l.slug}))}))},
];
