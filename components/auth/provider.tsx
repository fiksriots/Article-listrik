'use client';
import {createContext,useContext,useEffect,useState,useCallback,type ReactNode} from 'react';
import type {Session} from '@supabase/supabase-js';
import {getSupabase} from '@/lib/auth/supabase';
import {acknowledge,announce,finishGuestImport,getOwner,guestImportDone,mergeRemote,migrateLegacy,readMap,setOwner,writeMap,SYNC_EVENT,type RemoteRow,type ProgressMap} from '@/lib/auth/progress-store';
type State={session:Session|null;loading:boolean;status:string;sync:()=>void;configured:boolean};
const Context=createContext<State>({session:null,loading:true,status:'Memuat akun…',sync:()=>{},configured:false});
export const useLearningAccount=()=>useContext(Context);
export function LearningAccountProvider({children}:{children:ReactNode}){
 const [session,setSession]=useState<Session|null>(null);const [loading,setLoading]=useState(true);const [status,setStatus]=useState('Progres tersimpan di browser ini.');const [configured,setConfigured]=useState(false);const [request,setRequest]=useState(0);
 const sync=useCallback(()=>setRequest(n=>n+1),[]);
 useEffect(()=>{try{migrateLegacy();announce();}catch{setStatus('Penyimpanan browser tidak tersedia.');}let sb;try{sb=getSupabase();}catch{setConfigured(false);setLoading(false);setStatus('Layanan akun belum dapat dimuat.');return;}setConfigured(!!sb);if(!sb){setLoading(false);return;}let alive=true;let observed=false;
 const apply=(next:Session|null)=>{if(!alive)return;setSession(next);setLoading(false);try{setOwner(next?.user.id||null);setStatus(next?'Menyiapkan sinkronisasi…':'Tanpa akun · progres tersimpan di browser ini.');}catch{setStatus('Penyimpanan browser diblokir. Izinkan penyimpanan situs untuk menggunakan progres akun.');}};
 const sessionTimer=window.setTimeout(()=>{if(alive&&!observed){setLoading(false);setStatus('Pemeriksaan sesi belum selesai. Periksa koneksi atau muat ulang halaman.');}},12000);
 const {data}=sb.auth.onAuthStateChange((_event,next)=>{observed=true;window.clearTimeout(sessionTimer);apply(next);});
 sb.auth.getSession().then(({data,error})=>{if(!observed)apply(error?null:data.session);}).catch(()=>{if(!observed)apply(null);});
 return()=>{alive=false;window.clearTimeout(sessionTimer);data.subscription.unsubscribe();};},[]);
 useEffect(()=>{if(!session)return;const sb=getSupabase();if(!sb)return;const id=session.user.id;let canceled=false;let running=false;let rerun=false;
 const run=async()=>{if(canceled||getOwner()!==id)return;if(running){rerun=true;return;}running=true;
 try{if(!navigator.onLine){setStatus('Offline · perubahan disimpan di browser dan dikirim setelah terhubung.');return;}setStatus('Menyinkronkan progres…');const {data,error}=await sb.from('education_learning_progress').select('academy,lesson_slug,completed').eq('user_id',id);if(error)throw error;if(canceled||getOwner()!==id)return;
 const importing=!guestImportDone(id);const guest=importing?readMap(null):undefined;const merged=mergeRemote(readMap(id),(data||[]) as RemoteRow[],guest);writeMap(id,merged);announce();
 const pending=Object.fromEntries(Object.entries(merged).filter(([,v])=>v.dirty)) as ProgressMap;
 if(Object.keys(pending).length){const rows=Object.entries(pending).map(([key,v])=>{const [academy,lesson_slug]=key.split('/');return {user_id:id,academy,lesson_slug,completed:v.completed};});const {error}=await sb.from('education_learning_progress').upsert(rows,{onConflict:'user_id,academy,lesson_slug'});if(error)throw error;if(canceled||getOwner()!==id)return;writeMap(id,acknowledge(readMap(id),pending));}
 if(importing&&guest)finishGuestImport(id,guest);announce();setStatus('✓ Progres akun sudah tersinkron.');
 }catch{if(!canceled)setStatus('Belum tersinkron · progres tetap di browser. Coba sinkronkan ulang.');}finally{running=false;if(rerun&&!canceled){rerun=false;void run();}}};
 const refresh=()=>void run();const visible=()=>{if(document.visibilityState==='visible')refresh();};
 window.addEventListener(SYNC_EVENT,refresh);window.addEventListener('online',refresh);window.addEventListener('storage',refresh);document.addEventListener('visibilitychange',visible);const timer=window.setInterval(refresh,60000);void run();
 return()=>{canceled=true;window.removeEventListener(SYNC_EVENT,refresh);window.removeEventListener('online',refresh);window.removeEventListener('storage',refresh);document.removeEventListener('visibilitychange',visible);window.clearInterval(timer);};},[session?.user.id,request]);
 return <Context.Provider value={{session,loading,status,sync,configured}}>{children}</Context.Provider>;
}
export function ProgressStatus(){const {session,status}=useLearningAccount();return <p className="learning-sync-note">{session?status:<>Progres tersimpan di browser ini. <a href="/akun">Masuk untuk sinkronisasi antarperangkat →</a></>}</p>}
