'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import type {IoTCatalogLesson,IoTGroup} from '@/lib/iot-course';
import {completedSlugs,saveDone} from '@/lib/auth/progress-store';
import {ProgressStatus} from '@/components/auth/provider';
function read(){return completedSlugs('iot');}
export function Complete({slug}:{slug:string}){const [done,setDone]=useState(false);const [message,setMessage]=useState('');useEffect(()=>{const refresh=()=>setDone(read().includes(slug));refresh();window.addEventListener('iot-progress',refresh);window.addEventListener('storage',refresh);return()=>{window.removeEventListener('iot-progress',refresh);window.removeEventListener('storage',refresh);};},[slug]);return <section className="net-complete"><h2>Sudah memahami dan mencoba?</h2><button aria-pressed={done} onClick={()=>{const next=!done;if(saveDone('iot',slug,next)){setDone(next);setMessage(next?'Materi ditandai sudah dibaca.':'Tanda selesai dibatalkan.');}else setMessage('Browser tidak mengizinkan penyimpanan progres.');}}>{done?'✓ Sudah dibaca · batalkan':'Tandai sudah dibaca'}</button><p role="status">{message}</p><ProgressStatus/></section>}
export default function Catalog({current,lessons,groups}:{current?:string;lessons:IoTCatalogLesson[];groups:IoTGroup[]}){
 const [query,setQuery]=useState('');
 const [stage,setStage]=useState(-1);
 const [done,setDone]=useState<string[]>([]);
 useEffect(()=>{const refresh=()=>setDone(read());refresh();window.addEventListener('iot-progress',refresh);window.addEventListener('storage',refresh);return()=>{window.removeEventListener('iot-progress',refresh);window.removeEventListener('storage',refresh);};},[]);
 useEffect(()=>{
  if(current)return;
  const reveal=()=>{
   const hash=window.location.hash;
   if(!hash.startsWith('#kelompok-'))return;
   setStage(-1);
   const timer=window.setTimeout(()=>document.getElementById(hash.slice(1))?.scrollIntoView(),0);
   return timer;
  };
  const onHash=()=>{reveal();};
  window.addEventListener('hashchange',onHash);
  return()=>window.removeEventListener('hashchange',onHash);
 },[current]);
 const doneSet=new Set(done);
 const filtered=lessons.filter(l=>(stage<0||stage===l.stage)&&l.searchTerms.toLowerCase().includes(query.trim().toLowerCase()));
 const completedCount=lessons.filter(l=>doneSet.has(l.slug)).length;
 const selected=lessons.filter(l=>stage<0||l.stage===stage);
 const next=selected.find(l=>!doneSet.has(l.slug));
 return <div className={current?'net-sidebar-content':'net-catalog'}>
  <div className="net-progress"><strong>{completedCount} dari {lessons.length} materi sudah dibaca</strong><progress value={completedCount} max={lessons.length} aria-label="Progres belajar IoT"/><ProgressStatus/></div>
  {!current&&(next?<Link className="net-resume" href={'/iot/'+next.slug}>{completedCount?'Lanjutkan belajar':'Mulai belajar'}{stage>=0?' di kelompok ini':''}: {next.title} →</Link>:<p className="net-resume" role="status">✓ Semua materi{stage>=0?' dalam kelompok ini':''} sudah ditandai dibaca. Buka kembali materi untuk mengulang latihan.</p>)}
  <label className="net-search">Cari materi<input type="search" placeholder="millis, sensor, TLS, Firebase, Modbus…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
  {!current&&<label className="iot-group-select">Pilih kelompok belajar<select value={stage} onChange={e=>setStage(Number(e.target.value))}><option value={-1}>Semua kelompok · urutan lengkap</option>{groups.map((group,n)=><option key={group.id} value={n}>{String(n+1).padStart(2,'0')} · {group.title}</option>)}</select></label>}
  {!filtered.length&&<p role="status">Materi tidak ditemukan. Coba kata lain atau pilih semua kelompok.</p>}
  {groups.map((group,n)=>{
   const items=filtered.filter(l=>l.stage===n);if(!items.length)return null;
   const first=lessons.find(l=>l.slug===group.slugs[0]);
   const complete=group.slugs.filter(slug=>doneSet.has(slug)).length;
   return <section className="net-stage" key={group.id} id={current?undefined:'kelompok-'+group.id}>
    <h2><span>{String(n+1).padStart(2,'0')}</span> {group.title}</h2>
    {!current&&<div className="iot-group-intro"><p className="iot-group-kind">{group.kind} · {complete}/{group.slugs.length} dibaca</p><p><strong>Sebelum mulai:</strong> {group.before}</p><p><strong>Setelah kelompok ini:</strong> {group.goal}</p>{first&&<Link href={'/iot/'+first.slug}>Mulai kelompok: {first.title} →</Link>}</div>}
    <div className={current?'net-sidebar-links':'net-cards'}>{items.map(l=><Link className={'net-lesson-card '+(current===l.slug?'is-current ':'')+(doneSet.has(l.slug)?'is-read':'')} href={'/iot/'+l.slug} key={l.slug} aria-current={current===l.slug?'page':undefined}>
     {!current&&<img src={'/iot/'+l.slug+'.svg'} alt={'Skema '+l.title} width="820" height="420" loading="lazy"/>}
     <div className="net-card-body"><small>Materi {lessons.indexOf(l)+1} · {group.slugs.indexOf(l.slug)+1}/{group.slugs.length} dalam kelompok · {l.minutes} menit</small><h3>{l.title}</h3>{!current&&<p>{l.summary}</p>}<span className="net-read-label">{doneSet.has(l.slug)?'✓ Sudah dibaca':current?'':'Pelajari materi →'}</span></div>
    </Link>)}</div>
   </section>;
  })}
 </div>;
}
export function TemperatureLab(){const [temp,setTemp]=useState(26);const [on,setOn]=useState(false);const [online,setOnline]=useState(true);return <section id="simulator" className="iot-lab"><div><p className="net-eyebrow">LAB KONSEP · TANPA PERANGKAT</p><h2>Coba menjadi sensor suhu.</h2><p>Geser suhu. Indikator ON pada ≥30 °C, OFF pada ≤28 °C. Di antaranya, status sebelumnya dipertahankan.</p><label htmlFor="temperature">Suhu simulasi: <strong>{temp} °C</strong></label><input id="temperature" type="range" min="18" max="40" value={temp} onChange={e=>{const v=Number(e.target.value);setTemp(v);if(v>=30)setOn(true);else if(v<=28)setOn(false);}}/><button aria-pressed={!online} onClick={()=>setOnline(!online)}>{online?'Simulasikan internet putus':'Sambungkan internet kembali'}</button></div><div className="iot-lab-status" aria-live="polite"><span>HASIL ATURAN LOKAL</span><strong>{on?'◉ ON':'○ OFF'}</strong><p>Indikator pendingin simulasi</p><hr/><p>{online?'● Jaringan terhubung':'○ Jaringan terputus'}</p><p>{online?'Data dapat dikirim ke dashboard.':'Aturan lokal tetap berjalan dalam simulasi ini; pengiriman ke dashboard terhenti.'}</p></div><p className="iot-lab-note">Simulasi logika di browser, bukan pembacaan sensor, koneksi jaringan nyata, atau panduan pengawatan beban.</p></section>}
