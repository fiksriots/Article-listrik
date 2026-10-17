'use client';
import {useEffect,useRef,useState} from 'react';
export default function CodeBlock({code,label='Terminal',language}:{code:string;label?:string;language?:string}){
 const [state,setState]=useState<'idle'|'copied'|'error'>('idle');
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 async function copy(){
  let copied=false;
  try{await navigator.clipboard.writeText(code);copied=true;}catch{
   const active=document.activeElement;const textarea=document.createElement('textarea');textarea.value=code;textarea.setAttribute('readonly','');textarea.style.cssText='position:fixed;left:-9999px;top:0;';document.body.appendChild(textarea);
   try{textarea.select();copied=document.execCommand('copy');}catch{/* Show manual-copy guidance below. */}finally{textarea.remove();if(active instanceof HTMLElement)active.focus({preventScroll:true});}
  }
  setState(copied?'copied':'error');if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setState('idle'),3500);
 }
 return <div className="code-window" role="group" aria-label={label}><div className="code-window-header"><div className="code-window-caption"><span className="code-window-dots" aria-hidden="true"><i/><i/><i/></span><span>{label}</span>{language&&<small>{language}</small>}</div><button type="button" className="code-window-copy" onClick={copy} aria-label={'Salin '+label} title="Salin seluruh isi kode"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>{state==='copied'?'Tersalin ✓':'Copy'}</button></div><pre className="code-window-body" tabIndex={0} aria-label={'Isi '+label}><code className={language?'language-'+language:undefined}>{code}</code></pre><p className={state==='error'?'code-window-error':'sr-only'} role="status">{state==='error'?'Belum berhasil menyalin. Pilih teks kode dan salin secara manual.':state==='copied'?'Kode berhasil disalin.':''}</p></div>;
}
