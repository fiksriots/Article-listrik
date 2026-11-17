'use client';
import {useEffect, useRef, useState, useDeferredValue} from 'react';
import Link from 'next/link';

type Item = {title:string;href:string;summary:string;track:string};
const normalize = (text:string) => text.toLocaleLowerCase('id').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
export default function QuickSearch() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open,setOpen] = useState(false);
  const [query,setQuery] = useState('');
  const [items,setItems] = useState<Item[]|null>(null);
  const [failed,setFailed] = useState(false);
  const [attempt,setAttempt] = useState(0);
  const deferred = useDeferredValue(query);
  const words = normalize(deferred).trim().split(/\s+/).filter(Boolean);
  const results = words.length && items ? items.filter(item => words.every(word => normalize(item.title+' '+item.summary+' '+item.track).includes(word))).slice(0,8) : [];

  useEffect(() => {
    function shortcut(event:KeyboardEvent) {
      if ((event.ctrlKey||event.metaKey) && event.key.toLowerCase()==='k') {
        event.preventDefault();setOpen(value=>!value);
      }
    }
    document.addEventListener('keydown',shortcut);
    return()=>document.removeEventListener('keydown',shortcut);
  },[]);
  useEffect(()=>{
    if(!open) return;
    dialog.current?.showModal();input.current?.focus();
    const previous=document.body.style.overflow;document.body.style.overflow='hidden';
    return()=>{dialog.current?.close();document.body.style.overflow=previous;trigger.current?.focus();};
  },[open]);
  useEffect(()=>{
    if(!open||items) return;
    const controller=new AbortController();setFailed(false);
    fetch('/api/search',{signal:controller.signal}).then(response=>{
      if(!response.ok) throw Error('Catalogue indisponible');
      return response.json() as Promise<Item[]>;
    }).then(setItems).catch(error=>{if(error.name!=='AbortError')setFailed(true);});
    return()=>controller.abort();
  },[open,items,attempt]);
  function close(){setOpen(false);}
  return <>
    <button ref={trigger} type="button" className="site-search-button" onClick={()=>setOpen(true)} aria-haspopup="dialog" aria-label="Buka pencarian cepat">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span>Cari materi</span><kbd>⌘ / Ctrl K</kbd>
    </button>
    <dialog ref={dialog} className="site-search-dialog" aria-labelledby="quick-search-title" onCancel={close} onClose={close} onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();close();}}} onClick={event=>{if(event.target===event.currentTarget)close();}}>
      <header><div><p className="site-kicker">SELURUH AKADEMI</p><h2 id="quick-search-title">Apa yang ingin kamu pahami?</h2></div><button type="button" className="site-icon-button" onClick={close} aria-label="Tutup pencarian">✕</button></header>
      <label className="site-search-field">Topik, perangkat, atau konsep<input ref={input} type="search" value={query} maxLength={120} onChange={event=>setQuery(event.target.value)} placeholder="Coba: VLAN, Python, atau wireless…"/></label>
      {!words.length && <div className="site-search-popular"><p>Mulai dari topik populer</p>{['Python','VLAN','Ubiquiti','MQTT','Git'].map(word=><button key={word} type="button" onClick={()=>setQuery(word)}>{word}</button>)}</div>}
      <div className="site-search-feedback" role="status">{failed?'Katalog belum berhasil dimuat.':!items?'Menyiapkan katalog…':words.length?(results.length?results.length+' hasil teratas':'Belum ada hasil. Coba istilah yang lebih singkat.'):''}</div>
      {failed && <button type="button" className="site-retry" onClick={()=>setAttempt(value=>value+1)}>Coba lagi</button>}
      <ul className="site-search-matches">{results.map(item=><li key={item.href}><Link href={item.href} prefetch={false} onClick={close}><span>{item.track}</span><strong>{item.title}</strong><p>{item.summary}</p></Link></li>)}</ul>
      <footer><span>Tab untuk memilih · Esc untuk menutup</span><Link href={'/cari?q='+encodeURIComponent(query)} onClick={close}>Pencarian lengkap →</Link></footer>
    </dialog>
  </>;
}
