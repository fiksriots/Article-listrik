'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';

type Heading={id:string;title:string};
type Picture={src:string;alt:string};
export default function LessonReader({catalog,next}:{catalog:string;next?:{href:string;title:string}}){
 const root=useRef<HTMLDivElement>(null), dialog=useRef<HTMLDialogElement>(null);
 const progress=useRef<HTMLProgressElement>(null);
 const [large,setLarge]=useState(false);
 const [focus,setFocus]=useState(false);
 const [headings,setHeadings]=useState<Heading[]>([]);
 const [picture,setPicture]=useState<Picture|null>(null);
 const trigger=useRef<HTMLButtonElement|null>(null);
 useEffect(()=>{
  const article=root.current?.closest('main')?.querySelector('article');
  if(!article)return;
  const changed:HTMLElement[]=[];
  const items=Array.from(article.querySelectorAll<HTMLElement>('h2')).map((heading,i)=>{
   if(!heading.id){heading.id='bagian-'+(i+1);changed.push(heading);}
   return {id:heading.id,title:heading.textContent||'Bagian '+(i+1)};
  });
  setHeadings(items);
  const buttons=Array.from(article.querySelectorAll<HTMLImageElement>('img')).filter(img=>!img.closest('a,button')).map(img=>{
   const button=document.createElement('button');
   button.type='button';button.className='reader-zoom';button.textContent='Perbesar gambar ↗';
   button.setAttribute('aria-label','Perbesar: '+(img.alt||'gambar materi'));
   button.onclick=()=>{trigger.current=button;setPicture({src:img.currentSrc||img.src,alt:img.alt||'Gambar materi'});};
   img.insertAdjacentElement('afterend',button);return button;
  });
  return()=>{buttons.forEach(button=>button.remove());changed.forEach(heading=>heading.removeAttribute('id'));};
 },[]);
 useEffect(()=>{
  if(!picture)return;
  dialog.current?.showModal();
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{document.body.style.overflow=previous;trigger.current?.focus();};
 },[picture]);
 useEffect(()=>{
  try{setLarge(localStorage.getItem('article-reader-size-v1')==='large');}catch{}
 },[]);
 useEffect(()=>{
  const article=root.current?.closest('main')?.querySelector('article');
  if(!article)return;
  article.setAttribute('data-reading-size',large?'large':'normal');
  return()=>article.removeAttribute('data-reading-size');
 },[large]);
 useEffect(()=>{
  const layout=root.current?.closest('.net-lesson-layout,.lesson-layout');
  layout?.classList.toggle('reader-focus',focus);
  return()=>layout?.classList.remove('reader-focus');
 },[focus]);
 useEffect(()=>{
  const article=root.current?.closest('main')?.querySelector('article');
  if(!article)return;
  let frame=0;
  const update=()=>{
   frame=0;const rect=article.getBoundingClientRect();
   const distance=Math.max(1,rect.height-window.innerHeight);
   if(progress.current)progress.current.value=Math.min(100,Math.max(0,-rect.top/distance*100));
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const observer=new ResizeObserver(schedule);observer.observe(article);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();
  return()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);observer.disconnect();cancelAnimationFrame(frame);};
 },[]);
 function close(){dialog.current?.close();setPicture(null);}
 return <div className="reader-tools" ref={root}>
  <progress ref={progress} className="reader-page-progress" max={100} value={0} aria-label="Posisi membaca artikel"/><nav className="reader-navigation" aria-label="Bantuan membaca"><Link href={catalog}>☰ Daftar materi</Link><Link href="/cari">Cari materi</Link>{next&&<Link href={next.href} title={next.title}>Berikutnya →</Link>}</nav>
  <div className="reader-preferences"><span>Nyaman membaca</span><div><button type="button" aria-pressed={large} onClick={()=>{const value=!large;setLarge(value);try{localStorage.setItem('article-reader-size-v1',value?'large':'normal');}catch{}}}>Aa <span>{large?'Teks normal':'Perbesar teks'}</span></button><button type="button" aria-pressed={focus} onClick={()=>setFocus(value=>!value)}>{focus?'Keluar fokus':'Mode fokus'}</button></div></div>
  {headings.length>0&&<details className="reader-toc"><summary>Di artikel ini · {headings.length} bagian</summary><nav aria-label="Daftar isi artikel">{headings.map(heading=><a href={'#'+heading.id} key={heading.id} onClick={event=>{const details=event.currentTarget.closest('details');if(details)details.open=false;}}>{heading.title}</a>)}</nav></details>}
  <dialog className="reader-dialog" ref={dialog} onCancel={()=>setPicture(null)} onClose={()=>setPicture(null)} onClick={event=>{if(event.target===event.currentTarget)close();}} aria-label="Gambar diperbesar">
   {picture&&<><div className="reader-dialog-header"><p>{picture.alt}</p><button type="button" onClick={close} autoFocus>Tutup ✕</button></div><div className="reader-image-scroll"><img src={picture.src} alt={picture.alt}/></div><p className="reader-image-hint">Geser untuk melihat detail gambar. Tekan Esc atau Tutup untuk kembali.</p></>}
  </dialog>
 </div>;
}
