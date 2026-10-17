'use client';

import {useEffect, useRef, type ReactNode} from 'react';

export default function ArticleSidebar({article, children}:{article:string;children:ReactNode}) {
 const disclosure=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{
  const mobile=window.matchMedia('(max-width: 700px)');
  const applyDefault=()=>{if(disclosure.current)disclosure.current.open=!mobile.matches;};
  applyDefault();
  mobile.addEventListener('change',applyDefault);
  return()=>mobile.removeEventListener('change',applyDefault);
 },[article]);
 return <aside className="net-sidebar"><details ref={disclosure}><summary>Daftar materi jaringan</summary>{children}</details></aside>;
}
