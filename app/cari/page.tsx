import type {Metadata} from 'next';
import SearchLessons from '@/components/search-lessons';
import {learningTracks} from '@/lib/learning-progress-catalog';
import {trackLessons} from '@/lib/learning-progress-types';
export const metadata:Metadata={title:'Cari materi | Ruang Belajar Fikri',description:'Cari materi listrik, jaringan, IoT, dan Git dalam satu tempat.',alternates:{canonical:'https://article.fikss.site/cari'}};
export default function Page(){return <main id="konten" className="search-main"><header><p className="hub-eyebrow">JELAJAHI RUANG BELAJAR</p><h1>Temukan yang ingin<br/><em>kamu pahami.</em></h1><p>Cari topik atau perangkat, lalu pilih materi yang sesuai.</p></header><SearchLessons tracks={learningTracks.map(track=>({id:track.id,title:track.title,lessons:trackLessons(track)}))}/></main>}
