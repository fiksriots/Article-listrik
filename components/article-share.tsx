"use client";
import {useState} from 'react';
type Props={title:string;summary:string;path:string};
export default function ArticleShare({title,summary,path}:Props){
 const [status,setStatus]=useState('');
 const url='https://fikss.site'+path;
 const intro=`Sedang belajar ${title.replace(/[?.!]$/, '')}?\n${summary}\n\nBaca selengkapnya di sini 👇`;
 const text=intro+'\n'+url;
 async function copy(value:string,label:string){try{await navigator.clipboard.writeText(value);setStatus(label+' berhasil disalin.')}catch{setStatus('Tidak dapat menyalin otomatis. Coba tombol Bagikan atau WhatsApp.')}}
 async function share(){try{if(navigator.share){await navigator.share({title,text:intro,url});setStatus('')}else{await copy(text,'Pengantar dan tautan')}}catch(error){if(!(error instanceof DOMException&&error.name==='AbortError'))setStatus('Belum dapat membagikan. Gunakan WhatsApp atau salin tautan.')}}
 return <section className="article-share" aria-label={'Bagikan artikel '+title}>
 <strong>Bagikan artikel ini</strong>
 <div className="article-share-actions">
 <a href={'https://wa.me/?text='+encodeURIComponent(text)} target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.5L3 21l1.6-4.8a8.5 8.5 0 1 1 15.9-4.4Z"/><path d="M8.4 7.6c-.8.6-.9 1.6-.4 2.7 1.2 2.6 3.1 4.5 5.7 5.3 1.2.4 2.1-.1 2.5-1l-2.4-1.4-1 1c-1.5-.6-2.7-1.8-3.3-3.2l.9-1-1.3-2.4Z"/></svg></a>
 <a href={'https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(url)} target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10v7M11.5 17v-7m0 3c0-4 5-4 5 0v4"/><circle cx="7.5" cy="7.2" r=".7"/></svg></a>
 <button type="button" onClick={()=>copy(url,'Tautan')} title="Salin tautan" aria-label="Salin tautan"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 13 4-4m-6 6-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 2 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 1)"/></svg></button>
 <button type="button" onClick={share} title="Bagikan…" aria-label="Bagikan…"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4"/></svg></button>
 </div>
 <p className="article-share-status" role="status" aria-live="polite">{status}</p>
 </section>
}
