'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';

type Heading={id:string;title:string};
type Picture={src:string;alt:string};
export default function LessonReader({catalog,next}:{catalog:string;next?:{href:string;title:string}}){
 const root=useRef<HTMLDivElement>(null), dialog=useRef<HTMLDialogElement>(null);
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
 function close(){dialog.current?.close();setPicture(null);}
 return <div className="reader-tools" ref={root}>
  <nav className="reader-navigation" aria-label="Bantuan membaca"><Link href={catalog}>☰ Daftar materi</Link><Link href="/cari">Cari materi</Link>{next&&<Link href={next.href} title={next.title}>Berikutnya →</Link>}</nav>
  {headings.length>0&&<details className="reader-toc"><summary>Di artikel ini · {headings.length} bagian</summary><nav aria-label="Daftar isi artikel">{headings.map(heading=><a href={'#'+heading.id} key={heading.id} onClick={event=>{const details=event.currentTarget.closest('details');if(details)details.open=false;}}>{heading.title}</a>)}</nav></details>}
  <dialog className="reader-dialog" ref={dialog} onCancel={()=>setPicture(null)} onClose={()=>setPicture(null)} onClick={event=>{if(event.target===event.currentTarget)close();}} aria-label="Gambar diperbesar">
   {picture&&<><div className="reader-dialog-header"><p>{picture.alt}</p><button type="button" onClick={close} autoFocus>Tutup ✕</button></div><div className="reader-image-scroll"><img src={picture.src} alt={picture.alt}/></div><p className="reader-image-hint">Geser untuk melihat detail gambar. Tekan Esc atau Tutup untuk kembali.</p></>}
  </dialog>
 </div>;
}
