'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useSession} from 'next-auth/react';
import {PROGRESS_EVENT,readMap,type ProgressMap} from '@/lib/auth/progress-store';
import {progressSummary,trackLessons,type LearningTrack} from '@/lib/learning-progress-types';
import {useProgressSync} from '@/components/auth/provider';
export default function HomeProgress({tracks}:{tracks:LearningTrack[]}){
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
 const summaries=ready?tracks.map(track=>({track,...progressSummary(track.id,trackLessons(track),snapshot.map)})):[];
 const done=summaries.reduce((total,item)=>total+item.done,0),total=summaries.reduce((total,item)=>total+item.total,0);
 const resume=summaries.find(item=>item.done>0&&item.next);
 return <section className="home-progress" aria-labelledby="home-progress-title"><header><div><p className="hub-eyebrow">LANGKAH BELAJARMU</p><h2 id="home-progress-title">Mulai lagi dari sini.</h2></div><Link href="/akun">Detail progres →</Link></header><p className="home-sync" role="status">{syncStatus}</p>{!ready?<p role="status">Memuat progres…</p>:<><p className="home-progress-total"><strong>{done} dari {total}</strong> materi selesai di seluruh Learn.</p>{resume?.next?<Link className="home-resume" href={resume.next.href}>Lanjut {resume.track.title}: {resume.next.title} →</Link>:<p className="home-progress-prompt">{done===total?'Semua materi selesai. Buka progres per Learn untuk mengulang.':'Pilih jalur belajar di bawah untuk mulai.'}</p>}<details className="home-progress-details"><summary>Lihat progres per Learn</summary><div className="home-progress-grid">{summaries.map(summary=>{
  const {track}=summary;
  return <article key={track.id}><div className="home-progress-label"><h3>{track.title}</h3><strong>{summary.percent}%</strong></div><progress aria-label={'Progres '+track.title} max={summary.total||1} value={summary.done}/><p>{summary.done} dari {summary.total} materi selesai</p><Link href={summary.next?.href??track.href}>{summary.next?(summary.done?'Lanjutkan: ':'Mulai: ')+summary.next.title:'Semua selesai · ulangi materi'} →</Link></article>;
 })}</div><p className="home-progress-note">Dihitung dari materi yang ditandai selesai. {session?'Progres akun diperbarui setelah sinkronisasi berhasil.':'Tanpa akun, progres tersimpan di browser ini. Masuk dengan Google untuk sinkronisasi antarperangkat.'}</p></details></>}</section>;
}
