import {programmingTracks} from './programming-tracks';
import {gitTracks} from './git-tracks';
export interface LearningCategory {name:string;description:string;path:string;lessonCount?:number}
export interface LearningGroup {id:string;title:string;description:string;categories:LearningCategory[]}
const baseGroups = [
  {
    title: 'Learn Networking',
    description: 'Pilih jalur sesuai pengetahuan dan tujuan belajarmu.',
    categories: [
      { name: 'Dasar Jaringan', description: 'Perangkat, kabel, IP, gateway, DNS, dan fondasi jaringan.', path: '/jaringan#network-stage-0' },
      { name: 'Praktik Winbox', description: 'Kenali menu Winbox 4 dan praktik konfigurasi MikroTik.', path: '/jaringan/winbox' },
      { name: 'MTCNA', description: 'Dasar administrasi MikroTik, konfigurasi, dan latihan lab.', path: '/jaringan/mtcna' },
      { name: 'Pendalaman Jaringan', description: 'Subnetting, IPv6, switching, monitoring, dan keamanan.', path: '/jaringan#network-stage-11' },
      { name: 'MTCRE', description: 'Routing lanjutan, failover, policy routing, OSPF, dan tunnel.', path: '/jaringan/mtcre/kurikulum' },
      { name: 'Simulator Jaringan', description: 'Latihan interaktif subnetting, next hop, OSPF, dan failover.', path: '/jaringan/simulator' },
    ],
  },
  {
    title: 'Learn Electric',
    description: 'Pelajari listrik dan elektronika dari konsep hingga praktik.',
    categories: [
      { name: 'Listrik & Elektronika', description: 'Alur belajar dasar listrik, AC/DC, komponen, motor, dan PLC.', path: '/modul' },
      { name: 'Simulator Listrik', description: 'Coba konsep dan rangkaian melalui simulasi interaktif.', path: '/simulator' },
    ],
  },
  {
    title: 'Learn IoT',
    description: 'Mulai mengenal perangkat, sensor, dan sistem yang saling terhubung.',
    categories: [
      { name: 'Dasar IoT', description: 'Mikrokontroler, sensor, komunikasi, MQTT, dan integrasi cloud.', path: '/iot' },
      { name: 'Praktik Arduino', description: 'Pemrograman Arduino, input-output, dan rangkaian sensor.', path: '/iot/arduino' },
    ],
  },
  {
    title: 'Learn Git',
    description: 'Kelola versi proyek dan mulai berkolaborasi.',
    categories: [
      { name: 'Dasar Git', description: 'Repository, commit, branch, merge, dan alur kerja Git.', path: '/git/dasar' },
      { name: 'GitHub', description: 'Kelola repository dan kolaborasi proyek melalui GitHub.', path: '/git/github' },
      { name: 'GitLab', description: 'Kenali pengelolaan proyek dan alur kolaborasi GitLab.', path: '/git/gitlab' },
    ],
  },
];
export const learningDirectory:LearningGroup[] = [
 ...baseGroups.map((group,index)=>({...group,id:['networking','electric','iot','git'][index],categories:group.title==='Learn Git'?gitTracks.map(t=>({name:t.title,description:t.summary,path:t.href,lessonCount:t.lessons.length})):group.categories})),
 {id:'programming',title:'Learn Programming',description:'Belajar Python bertahap dari dasar sampai database dan API.',categories:programmingTracks.map(t=>({name:t.title,description:t.summary,path:t.href,lessonCount:t.lessons.length}))},
];
