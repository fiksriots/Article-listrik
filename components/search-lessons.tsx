'use client';
import {useDeferredValue,useEffect,useState} from 'react';
import Link from 'next/link';
import type {SearchLesson} from '@/lib/search-types';
type Track={id:string;title:string;lessons:SearchLesson[]};
const normalize=(text:string)=>text.toLocaleLowerCase('id').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
export default function SearchLessons({tracks}:{tracks:Track[]}){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('all');
 useEffect(()=>{
  const restore=()=>{
   const params=new URLSearchParams(window.location.search);
   let saved:{q?:unknown;learn?:unknown}={};
   if(!params.has('q')&&!params.has('learn'))try{saved=JSON.parse(sessionStorage.getItem('fiks-search-v1')||'{}')||{};}catch{}
   const q=params.get('q')??saved.q,learn=params.get('learn')??saved.learn;
   setQuery(typeof q==='string'?q.slice(0,200):'');
   setCategory(typeof learn==='string'&&tracks.some(track=>track.id===learn)?learn:'all');
  };
  restore();window.addEventListener('popstate',restore);
  return()=>window.removeEventListener('popstate',restore);
 },[tracks]);
 function change(q:string,learn:string){
  q=q.slice(0,200);setQuery(q);setCategory(learn);
  const url=new URL(window.location.href);
  url.searchParams.set('q',q);
  if(learn==='all')url.searchParams.delete('learn');else url.searchParams.set('learn',learn);
  window.history.replaceState(window.history.state,'',url.pathname+url.search+url.hash);
  try{sessionStorage.setItem('fiks-search-v1',JSON.stringify({q,learn}));}catch{}
 }
 const deferred=useDeferredValue(query);
 const words=normalize(deferred).trim().split(/\s+/).filter(Boolean);
 const results=tracks.filter(track=>category==='all'||track.id===category).flatMap(track=>track.lessons.filter(lesson=>words.every(word=>normalize(lesson.title+' '+lesson.slug+' '+lesson.summary+' '+lesson.group+' '+track.title).includes(word))).map(lesson=>({...lesson,track:track.title})));
 return <section className="lesson-search" aria-label="Pencarian materi"><div className="search-controls"><label htmlFor="lesson-query">Topik yang ingin dipelajari<input id="lesson-query" type="search" value={query} onChange={event=>change(event.target.value,category)} placeholder="Contoh: grounding, VLAN, MQTT" autoComplete="off" maxLength={200}/></label><label htmlFor="lesson-category">Jalur belajar<select id="lesson-category" value={category} onChange={event=>change(query,event.target.value)}><option value="all">Semua Learn</option>{tracks.map(track=><option key={track.id} value={track.id}>{track.title}</option>)}</select></label></div><div className="search-suggestions"><span>Coba:</span>{['grounding','VLAN','MQTT','Git'].map(word=><button key={word} type="button" onClick={()=>change(word,'all')}>{word}</button>)}{query&&<button type="button" onClick={()=>change('',category)}>Hapus pencarian</button>}</div><p role="status" className="search-count">{results.length} materi ditemukan{deferred.trim()?' untuk “'+deferred.trim()+'”':''}.</p>{results.length?<ul className="search-results">{results.map(lesson=><li key={lesson.href}><Link href={lesson.href}><span>{lesson.track}</span><h2>{lesson.title}</h2><p className="search-summary">{lesson.summary}</p><p className="search-meta">{lesson.group} · {lesson.minutes?`±${lesson.minutes} menit baca`:'Panduan/lab · waktu praktik bervariasi'}</p><span className="search-open">Buka materi →</span></Link></li>)}</ul>:<div className="search-empty"><h2>Materi belum ditemukan.</h2><p>Coba kata yang lebih singkat atau pilih Semua Learn.</p></div>}</section>;
}
