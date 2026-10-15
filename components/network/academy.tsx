'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { networkStages } from '@/lib/network-course';
import { readNetworkProgress, NETWORK_PROGRESS_KEY } from './progress-store';
type Item = {slug:string;title:string;summary:string;stage:number;minutes:number};
export default function Academy({items, current}:{items:Item[];current?:string}) {
 const [query,setQuery]=useState(''); const [done,setDone]=useState<string[]>([]); const [stage,setStage]=useState(-1);
 useEffect(()=>{const refresh=()=>setDone(readNetworkProgress().filter(slug=>items.some(l=>l.slug===slug)));refresh();window.addEventListener('network-progress',refresh);window.addEventListener('storage',refresh);return()=>{window.removeEventListener('network-progress',refresh);window.removeEventListener('storage',refresh);};},[items]);
 const search=query.trim().toLocaleLowerCase('id');
 const filtered=items.filter(l=>(stage<0||stage===l.stage)&&`${l.title} ${l.summary}`.toLocaleLowerCase('id').includes(search));
 const next=items.find(l=>!done.includes(l.slug))||items[0];
 return <div className={current?'net-sidebar-content':'net-catalog'}>
  <div className="net-progress"><div><strong>{done.length} dari {items.length}</strong><span> materi sudah dibaca</span></div><progress value={done.length} max={items.length} aria-label="Progres belajar jaringan"/><small>Progres tersimpan di browser ini.</small></div>
  {!current&&<Link className="net-resume" href={'/jaringan/'+next.slug}>{done.length? 'Lanjutkan belajar':'Mulai materi pertama'}: {next.title} →</Link>}
  <label className="net-search">Cari materi<input type="search" placeholder="IP, VLAN, MikroTik…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
  {!current&&<div className="net-filters" aria-label="Tahap pembelajaran">{['Semua tahap',...networkStages].map((s,i)=><button key={s} aria-pressed={stage===i-1} onClick={()=>setStage(i-1)}>{s}</button>)}</div>}
  {filtered.length===0?<p role="status">Tidak ada materi yang cocok. Coba kata lain atau pilih semua tahap.</p>:null}
  {networkStages.map((name,i)=>{const group=filtered.filter(l=>l.stage===i);return group.length?<section key={name} id={current?undefined:`network-stage-${i}`} className="net-stage"><h2><span>0{i+1}</span> {name}</h2><div className={current?'net-sidebar-links':'net-cards'}>{group.map(l=><Link key={l.slug} href={'/jaringan/'+l.slug} className={['net-lesson-card',current===l.slug?'is-current':'',done.includes(l.slug)?'is-read':''].join(' ')} aria-current={current===l.slug?'page':undefined}>
   {!current&&<img src={'/network/'+l.slug+'.svg'} alt={'Ilustrasi: '+l.title} width="800" height="340" loading="lazy"/>}<div className="net-card-body"><small>Materi {items.findIndex(x=>x.slug===l.slug)+1} · {l.minutes} menit</small><h3>{l.title}</h3>{!current&&<p>{l.summary}</p>}{done.includes(l.slug)?<span className="net-read-label">✓ Sudah dibaca</span>:!current?<span className="net-card-link">Pelajari materi →</span>:null}</div></Link>)}</div></section>:null;})}
 </div>;
}
export function CompleteLesson({slug}:{slug:string}) {
 const [done,setDone]=useState(false); const [message,setMessage]=useState('');
 useEffect(()=>{const refresh=()=>setDone(readNetworkProgress().includes(slug));refresh();window.addEventListener('storage',refresh);return()=>window.removeEventListener('storage',refresh);},[slug]);
 function toggle(){try {const previous=readNetworkProgress();const value=done?previous.filter(x=>x!==slug):[...new Set([...previous,slug])];localStorage.setItem(NETWORK_PROGRESS_KEY,JSON.stringify(value));setDone(!done);setMessage(done?'Tanda selesai dihapus.':'Materi ditandai sudah dibaca.');window.dispatchEvent(new Event('network-progress'));}catch{setMessage('Browser tidak mengizinkan penyimpanan progres. Materi tetap dapat dibaca.');}}
 return <section className="net-complete"><div><h2>Satu langkah lebih paham.</h2><p>Tandai setelah membaca dan mencoba latihannya.</p></div><button onClick={toggle} aria-pressed={done}>{done?'✓ Sudah dibaca · batalkan':'Tandai sudah dibaca'}</button><p role="status">{message}</p></section>;
}
