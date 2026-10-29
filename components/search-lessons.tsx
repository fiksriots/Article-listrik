'use client';
import {useDeferredValue,useState} from 'react';
import Link from 'next/link';
import type {ProgressLesson} from '@/lib/learning-progress-types';
type Track={id:string;title:string;lessons:ProgressLesson[]};
const normalize=(text:string)=>text.toLocaleLowerCase('id').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
export default function SearchLessons({tracks}:{tracks:Track[]}){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('all');
 const deferred=useDeferredValue(query);
 const words=normalize(deferred).trim().split(/\s+/).filter(Boolean);
 const results=tracks.filter(track=>category==='all'||track.id===category).flatMap(track=>track.lessons.filter(lesson=>words.every(word=>normalize(lesson.title+' '+lesson.slug+' '+track.title).includes(word))).map(lesson=>({...lesson,track:track.title})));
 return <section className="lesson-search" aria-label="Pencarian materi"><div className="search-controls"><label htmlFor="lesson-query">Topik yang ingin dipelajari<input id="lesson-query" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Contoh: grounding, VLAN, MQTT" autoComplete="off"/></label><label htmlFor="lesson-category">Jalur belajar<select id="lesson-category" value={category} onChange={event=>setCategory(event.target.value)}><option value="all">Semua Learn</option>{tracks.map(track=><option key={track.id} value={track.id}>{track.title}</option>)}</select></label></div><div className="search-suggestions"><span>Coba:</span>{['grounding','VLAN','MQTT','Git'].map(word=><button key={word} type="button" onClick={()=>{setQuery(word);setCategory('all');}}>{word}</button>)}{query&&<button type="button" onClick={()=>setQuery('')}>Hapus pencarian</button>}</div><p role="status" className="search-count">{results.length} materi ditemukan{deferred.trim()?' untuk “'+deferred.trim()+'”':''}.</p>{results.length?<ul className="search-results">{results.map(lesson=><li key={lesson.href}><Link href={lesson.href}><span>{lesson.track}</span><h2>{lesson.title}</h2><span className="search-open">Buka materi →</span></Link></li>)}</ul>:<div className="search-empty"><h2>Materi belum ditemukan.</h2><p>Coba kata yang lebih singkat atau pilih Semua Learn.</p></div>}</section>;
}
