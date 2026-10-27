// Browser-only data, isolated by account. Legacy guest data is migrated once.
export type Academy = 'listrik' | 'jaringan' | 'iot' | 'git';
export type Entry = {completed:boolean; dirty:boolean; revision:string};
export type ProgressMap = Record<string,Entry>;
const PREFIX='fiks-learning-v2:';
export const PROGRESS_EVENT='fiks-learning-change';
export const SYNC_EVENT='fiks-sync-request';
let owner:string|null=null;
const events=['learning-progress','network-progress','iot-progress','git-progress',PROGRESS_EVENT];
export function announce(){for(const name of events)window.dispatchEvent(new Event(name));}
export function getOwner(){return owner;}
export function setOwner(id:string|null){owner=id;announce();}
export function progressKey(academy:Academy,slug:string){return `${academy}/${slug}`;}
export function readMap(id:string|null=owner):ProgressMap{try{const raw=JSON.parse(localStorage.getItem(PREFIX+(id||'guest'))||'{}');if(!raw||Array.isArray(raw)||typeof raw!=='object')return {};return Object.fromEntries(Object.entries(raw).filter((entry):entry is [string,Entry]=>{const [k,v]=entry;return /^(listrik|jaringan|iot|git)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(k)&&v!==null&&typeof v==='object'&&typeof (v as Entry).completed==='boolean'&&typeof (v as Entry).revision==='string'&&typeof (v as Entry).dirty==='boolean';}));}catch{return {};}}
export function writeMap(id:string|null,map:ProgressMap){localStorage.setItem(PREFIX+(id||'guest'),JSON.stringify(map));}
function revision(){return `${Date.now()}-${Math.random().toString(36).slice(2)}`;}
function migrateGitLegacy(){if(localStorage.getItem(PREFIX+'git-migrated'))return;const map=readMap(null);try{const values=JSON.parse(localStorage.getItem('fiks-git-read-v1')||'[]');if(Array.isArray(values))for(const slug of values)if(typeof slug==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)&&!map[progressKey('git',slug)])map[progressKey('git',slug)]={completed:true,dirty:true,revision:revision()};}catch{}writeMap(null,map);localStorage.setItem(PREFIX+'git-migrated','1');}
export function migrateLegacy(){migrateGitLegacy();if(localStorage.getItem(PREFIX+'legacy-migrated'))return;const map=readMap(null);for(let n=0;n<localStorage.length;n++){const key=localStorage.key(n);if(key?.startsWith('lesson-')&&localStorage.getItem(key)==='done'){const slug=key.slice(7);if(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))map[progressKey('listrik',slug)]={completed:true,dirty:true,revision:revision()};}}
 for(const [academy,key] of [['jaringan','fiks-network-progress-v1'],['iot','fiks-iot-progress-v1']] as const){try{const values=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(values))for(const slug of values)if(typeof slug==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))map[progressKey(academy,slug)]={completed:true,dirty:true,revision:revision()};}catch{/* Keep other valid legacy progress. */}}
 writeMap(null,map);localStorage.setItem(PREFIX+'legacy-migrated','1');}
export function readDone(academy:Academy,slug:string){return readMap()[progressKey(academy,slug)]?.completed===true;}
export function completedSlugs(academy:Academy){return Object.entries(readMap()).filter(([k,v])=>k.startsWith(academy+'/')&&v.completed).map(([k])=>k.slice(academy.length+1));}
export function saveDone(academy:Academy,slug:string,completed:boolean){try{const map=readMap();map[progressKey(academy,slug)]={completed,dirty:true,revision:revision()};writeMap(owner,map);announce();window.dispatchEvent(new Event(SYNC_EVENT));return true;}catch{return false;}}
export type RemoteRow={academy:Academy;lesson_slug:string;completed:boolean};
// Dirty local edits survive a pull; clean entries follow the account's remote state.
export function mergeRemote(local:ProgressMap,rows:RemoteRow[],guest?:ProgressMap){const map:ProgressMap={};for(const row of rows){map[progressKey(row.academy,row.lesson_slug)]={completed:row.completed,dirty:false,revision:'remote'};}for(const [k,v] of Object.entries(local))if(v.dirty)map[k]=v;if(guest)for(const [k,v] of Object.entries(guest))if(v.completed&&!map[k])map[k]={...v,dirty:true};return map;}
// A later click must never be acknowledged by an earlier in-flight request.
export function acknowledge(current:ProgressMap,sent:ProgressMap){const map={...current};for(const [key,value] of Object.entries(sent))if(map[key]?.revision===value.revision)map[key]={...map[key],dirty:false};return map;}
export function guestImportDone(id:string){return localStorage.getItem(PREFIX+'imported:'+id)==='1'&&(localStorage.getItem(PREFIX+'git-imported:'+id)==='1'||!Object.keys(readMap(null)).some(key=>key.startsWith('git/')));}
export function finishGuestImport(id:string,snapshot:ProgressMap){localStorage.setItem(PREFIX+'git-imported:'+id,'1');localStorage.setItem(PREFIX+'imported:'+id,'1');const current=readMap(null);for(const [key,entry] of Object.entries(snapshot))if(current[key]?.revision===entry.revision)delete current[key];writeMap(null,current);}
