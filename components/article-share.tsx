"use client";
import {useState} from 'react';
type Props={title:string;summary:string;path:string;compact?:boolean};
export default function ArticleShare({title,summary,path,compact=false}:Props){
 const [status,setStatus]=useState('');
 const url='https://article.fikss.site'+path;
 const intro=`Sedang belajar ${title.replace(/[?.!]$/, '')}?\n${summary}\n\nBaca selengkapnya di sini 👇`;
 const text=intro+'\n'+url;
 async function copy(value:string,label:string){try{await navigator.clipboard.writeText(value);setStatus(label+' berhasil disalin.')}catch{setStatus('Tidak dapat menyalin otomatis. Salin dari kotak pengantar di bawah.')}}
 async function share(){try{if(navigator.share){await navigator.share({title,text:intro,url});setStatus('')}else{await copy(text,'Pengantar dan tautan')}}catch(error){if(!(error instanceof DOMException&&error.name==='AbortError'))setStatus('Belum dapat membagikan. Gunakan WhatsApp atau salin pengantar.')}}
 return <section className="article-share" aria-label={'Bagikan artikel '+title}>
 <strong>{compact?'Bagikan materi ini':'Bermanfaat? Bagikan ke temanmu.'}</strong>
 <div className="article-share-actions">
 <a href={'https://wa.me/?text='+encodeURIComponent(text)} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
 <a href={'https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(url)} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
 <button type="button" onClick={()=>copy(url,'Tautan')}>Salin tautan</button>
 <button type="button" onClick={share}>Bagikan…</button>
 </div>
 <details><summary>Lihat pengantar sesuai artikel</summary><p>Salin pengantar ini untuk posting LinkedIn atau aplikasi lainnya.</p><textarea aria-label="Pengantar artikel dan tautan" value={text} readOnly rows={6}/><button type="button" onClick={()=>copy(text,'Pengantar dan tautan')}>Salin pengantar + tautan</button></details>
 <p className="article-share-status" role="status" aria-live="polite">{status}</p>
 </section>
}
