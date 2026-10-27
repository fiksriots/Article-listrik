'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useSession} from 'next-auth/react';
import {PROGRESS_EVENT,readMap,type ProgressMap} from '@/lib/auth/progress-store';
import {progressSummary,trackLessons,type LearningTrack} from '@/lib/learning-progress-types';
import {useProgressSync} from './provider';
function Meter({label,done,total,percent}:{label:string;done:number;total:number;percent:number}){
 return <div className="achievement-meter"><div><span>{done} dari {total} materi selesai</span><strong>{percent}%</strong></div><progress value={done} max={total||1} aria-label={'Progres '+label}/></div>;
}
export default function LearningProgress({tracks}:{tracks:LearningTrack[]}){
 const {data:session,status}=useSession();const owner=session?.user?.id??null;
 const {status:syncStatus}=useProgressSync();
 const [snapshot,setSnapshot]=useState<{owner:string|null;map:ProgressMap}|null>(null);
 useEffect(()=>{
  if(status==='loading'){setSnapshot(null);return;}
  const refresh=()=>setSnapshot({owner,map:readMap(owner)});
  refresh();window.addEventListener(PROGRESS_EVENT,refresh);window.addEventListener('storage',refresh);
  return()=>{window.removeEventListener(PROGRESS_EVENT,refresh);window.removeEventListener('storage',refresh);};
 },[owner,status]);
 const ready=status!=='loading'&&snapshot!==null&&snapshot.owner===owner;
 return <section className="achievements" aria-labelledby="achievement-title">
  <header><p className="account-eyebrow">LANGKAH YANG SUDAH DITEMPUH</p><h2 id="achievement-title">Progres belajarmu</h2><p>{session?'Progres akun dipulihkan otomatis setelah sinkronisasi berhasil.':'Tanpa akun, progres berikut tersimpan di browser ini.'}</p><p className="achievement-sync" role="status">{syncStatus}</p></header>
  {!ready?<p role="status">Memuat progres…</p>:<div className="achievement-grid">{tracks.map(track=>{
   const summary=progressSummary(track.id,trackLessons(track),snapshot.map);
   return <article className="achievement-card" key={track.id}>
    <div className="achievement-title"><h3>{track.title}</h3><span>{summary.done===summary.total?'Selesai':summary.done?'Sedang belajar':'Belum dimulai'}</span></div>
    <Meter label={track.title} {...summary}/>
    <Link className="achievement-resume" href={summary.next?.href??track.href}>{summary.next?(summary.done?'Lanjut belajar':'Mulai belajar')+': '+summary.next.title:'Ulangi materi'} <span aria-hidden="true">→</span></Link>
    <details className="achievement-details"><summary>Lihat progres subkategori <span aria-hidden="true">⌄</span></summary><div>{track.groups.map(group=>{
     const groupSummary=progressSummary(track.id,group.lessons,snapshot.map);
     return <section className="achievement-group" key={group.id}><h4><Link href={group.href}>{group.title}</Link></h4><Meter label={group.title} {...groupSummary}/><Link className="achievement-next" href={groupSummary.next?.href??group.href}>{groupSummary.next?'Pelajari: '+groupSummary.next.title:'Semua materi selesai · baca ulang'} →</Link></section>;
    })}</div></details>
   </article>;
  })}</div>}
  <p className="account-footnote">Dihitung dari materi yang ditandai selesai, bukan nilai ujian. Materi yang muncul di beberapa subkategori hanya dihitung sekali dalam total Learn.</p>
 </section>;
}
