'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {PROGRESS_EVENT, completedSlugs, saveDone} from '@/lib/auth/progress-store';
import {ProgressStatus} from '@/components/auth/provider';

type Item = {slug:string; title:string; summary:string; stage:number; minutes:number};

function useCompleted() {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    const refresh = () => setDone(completedSlugs('programming'));
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return done;
}

export function Complete({slug}:{slug:string}) {
  const done = useCompleted();
  const [message, setMessage] = useState('');
  const active = done.includes(slug);
  return <section className="net-complete">
    <h2>Sudah memahami dan mencoba?</h2>
    <button aria-pressed={active} onClick={() => {
      const saved = saveDone('programming', slug, !active);
      setMessage(saved ? (active ? 'Tanda selesai dibatalkan.' : 'Materi ditandai selesai.') : 'Progres belum tersimpan. Browser membatasi penyimpanan.');
    }}>{active ? '✓ Materi selesai · batalkan' : 'Tandai materi selesai'}</button>
    <p role="status">{message}</p><ProgressStatus/>
  </section>;
}

export default function Catalog({items, stages, current, label="Learn Programming", homeHref="/programming", placeholder="Variabel, percabangan, fungsi…"}:{items:Item[]; stages:string[]; current?:string; label?:string; homeHref?:string; placeholder?:string}) {
  const done = useCompleted();
  const [query, setQuery] = useState('');
  const count = items.filter(item => done.includes(item.slug)).length;
  const next = items.find(item => !done.includes(item.slug));
  const filtered = items.filter(item => (item.title+' '+item.summary).toLowerCase().includes(query.trim().toLowerCase()));
  return <div className={current ? 'net-sidebar-content' : 'net-catalog'}>
    <div className="net-progress"><strong>{count} dari {items.length} materi selesai</strong><progress value={count} max={items.length} aria-label={'Progres '+label}/><ProgressStatus/></div>
    {!current && <Link className="net-resume" href={next ? '/programming/'+next.slug : homeHref+'#kurikulum'}>{next ? 'Lanjutkan: '+next.title : 'Semua materi selesai · ulangi kurikulum'} →</Link>}
    <label className="net-search">Cari materi {label}<input type="search" value={query} placeholder={placeholder} onChange={event => setQuery(event.target.value)}/></label>
    {!filtered.length && <p role="status">Materi tidak ditemukan. Coba kata lain.</p>}
    {stages.map((stage, index) => {
      const lessons = filtered.filter(item => item.stage === index);
      if (!lessons.length) return null;
      return <section className="net-stage" key={stage}><h2><span>{String(index+1).padStart(2,'0')}</span> {stage}</h2><div className={current ? 'net-sidebar-links' : 'net-cards'}>{lessons.map(item => <Link key={item.slug} href={'/programming/'+item.slug} aria-current={current === item.slug ? 'page' : undefined} className={'net-lesson-card '+(current === item.slug ? 'is-current ' : '')+(done.includes(item.slug) ? 'is-read' : '')}><div className="net-card-body"><small>Materi {items.indexOf(item)+1} · ±{item.minutes} menit</small><h3>{item.title}</h3>{!current && <p>{item.summary}</p>}<span className="net-read-label">{done.includes(item.slug) ? '✓ Selesai' : 'Pelajari →'}</span></div></Link>)}</div></section>;
    })}
  </div>;
}
