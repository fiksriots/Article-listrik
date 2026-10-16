export type Router = 'R1'|'R2'|'R3'|'R4';
export type OspfLink = {id:string;a:Router;b:Router;cost:number;up:boolean};
export const initialLinks:OspfLink[]=[{id:'r1-r2',a:'R1',b:'R2',cost:10,up:true},{id:'r2-r4',a:'R2',b:'R4',cost:10,up:true},{id:'r1-r3',a:'R1',b:'R3',cost:20,up:true},{id:'r3-r4',a:'R3',b:'R4',cost:20,up:true}];
export type Path = {routers:Router[];links:string[];transitCost:number;total:number};
// Enumerate simple paths in this four-router teaching topology. Symmetric costs.
export function calculatePaths(links:OspfLink[],source:Router='R1',destination:Router='R4',lanCost=10):Path[]{
 if(!Number.isInteger(lanCost)||lanCost<1||lanCost>65535||links.some(l=>!Number.isInteger(l.cost)||l.cost<1||l.cost>65535))throw new Error('Cost harus bilangan bulat 1–65535.');
 const found:Path[]=[];
 function walk(current:Router,routers:Router[],edges:string[],cost:number){
  if(current===destination){found.push({routers,links:edges,transitCost:cost,total:cost+lanCost});return;}
  for(const l of links){if(!l.up)continue;const next=l.a===current?l.b:l.b===current?l.a:null;if(next&&!routers.includes(next))walk(next,[...routers,next],[...edges,l.id],cost+l.cost);}
 }
 walk(source,[source],[],0);return found.sort((a,b)=>a.total-b.total||a.routers.join().localeCompare(b.routers.join()));
}
export function bestPaths(paths:Path[]){return paths.filter(p=>p.total===paths[0]?.total);}
