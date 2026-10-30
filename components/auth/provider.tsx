'use client';
import {createContext,useContext,useEffect,useState,useCallback,type ReactNode} from 'react';
import {SessionProvider,useSession} from 'next-auth/react';
import {acknowledge,announce,finishGuestImport,getOwner,guestImportDone,mergeRemote,migrateLegacy,readMap,setOwner,writeMap,SYNC_EVENT,type RemoteRow,type ProgressMap} from '@/lib/auth/progress-store';
const ProgressContext=createContext({status:'Progres tersimpan di browser ini.',sync:()=>{}});
export const useProgressSync=()=>useContext(ProgressContext);
function ProgressSync({children}:{children:ReactNode}) {
  const {data:session,status:authStatus}=useSession();
  const id=session?.user?.id || null;
  const needsRelogin=session?.progressNeedsRelogin===true;
  const legacyKey=JSON.stringify(session?.legacyProgressIds||[]);
  const [status,setStatus]=useState('Progres tersimpan di browser ini.');
  const [request,setRequest]=useState(0);
  const sync=useCallback(()=>setRequest(n=>n+1),[]);
  useEffect(()=>{
    if(authStatus==='loading')return;
    try{migrateLegacy();setOwner(id);}catch{setStatus('Penyimpanan browser diblokir. Izinkan penyimpanan situs untuk menyimpan progres.');return;}
    if(!id){setStatus('Tanpa akun · progres tersimpan di browser ini.');return;}
    if(needsRelogin){setStatus('Masuk ulang dengan Google untuk mengaktifkan sinkronisasi antarperangkat. Progres lama tetap tersimpan.');return;}
    const legacyIds=JSON.parse(legacyKey) as string[];
    let canceled=false,running=false,rerun=false;
    const controller=new AbortController();
    const active=()=>!canceled&&getOwner()===id;
    async function call(init?:RequestInit){
      const signal=AbortSignal.any([controller.signal,AbortSignal.timeout(15000)]);
      const response=await fetch('/api/progress',{...init,signal,cache:'no-store'});
      if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.error||'sync_failed');}
      return response.json();
    }
    const run=async()=>{
      if(!active())return;if(running){rerun=true;return;}running=true;
      try{
        if(!navigator.onLine){setStatus('Offline · progres disimpan sementara di browser.');return;}
        setStatus('Menyinkronkan progres…');
        const {rows}=await call();if(!active())return;
        if(!Array.isArray(rows))throw new Error('invalid_response');
        const importing=!guestImportDone(id!);const guest=importing?readMap(null):undefined;
        const local=readMap(id);
        const legacySnapshots=legacyIds.map(oldId=>({id:oldId,map:readMap(oldId)}));
        for(const snapshot of legacySnapshots)for(const [key,value] of Object.entries(snapshot.map)){
          if(value.dirty&&!local[key]?.dirty)local[key]=value;
        }
        const merged=mergeRemote(local,rows as RemoteRow[],guest);writeMap(id,merged);announce();
        const entries=Object.entries(merged).filter(([,v])=>v.dirty);
        for(let offset=0;offset<entries.length;offset+=400){
          if(!active())return;
          const pending=Object.fromEntries(entries.slice(offset,offset+400)) as ProgressMap;
          const upload=Object.entries(pending).map(([key,value])=>{const [academy,lesson_slug]=key.split('/');return {academy,lesson_slug,completed:value.completed};});
          await call({method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({rows:upload})});
          if(!active())return;writeMap(id,acknowledge(readMap(id),pending));
        }
        for(const snapshot of legacySnapshots)writeMap(snapshot.id,acknowledge(readMap(snapshot.id),snapshot.map));
        if(importing&&guest)finishGuestImport(id!,guest);announce();setStatus('✓ Progres akun sudah tersinkron.');
      }catch(error){if(active())setStatus(error instanceof Error&&error.message==='not_configured'?'Penyimpanan akun sedang disiapkan · progres tetap di browser.':'Belum tersinkron · progres tetap di browser. Coba lagi saat koneksi tersedia.');}
      finally{running=false;if(rerun&&active()){rerun=false;void run();}}
    };
    const refresh=()=>void run();const visible=()=>{if(document.visibilityState==='visible')refresh();};
    const changed=()=>refresh();
    window.addEventListener(SYNC_EVENT,changed);window.addEventListener('online',refresh);window.addEventListener('storage',refresh);document.addEventListener('visibilitychange',visible);
    const timer=window.setInterval(refresh,60000);void run();
    return()=>{canceled=true;controller.abort();window.clearInterval(timer);window.removeEventListener(SYNC_EVENT,changed);window.removeEventListener('online',refresh);window.removeEventListener('storage',refresh);document.removeEventListener('visibilitychange',visible);};
  },[id,authStatus,request,needsRelogin,legacyKey]);
  return <ProgressContext.Provider value={{status,sync}}>{children}</ProgressContext.Provider>;
}
export function LearningAccountProvider({children}:{children:ReactNode}) {
  return <SessionProvider refetchOnWindowFocus><ProgressSync>{children}</ProgressSync></SessionProvider>;
}
export function ProgressStatus(){const {status}=useProgressSync();return <p className="learning-sync-note">{status} <a href="/akun">Akun belajar →</a></p>;}
