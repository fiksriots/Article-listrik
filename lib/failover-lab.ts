export type WanState={link:boolean;gateway:boolean;upstream:boolean;probe:boolean;nat:boolean};
export type Detection='gateway'|'recursive';
export const healthyWan=():WanState=>({link:true,gateway:true,upstream:true,probe:true,nat:true});
export function evaluateWan(w:WanState,mode:Detection){const gateway=w.link&&w.gateway;const probe=gateway&&w.upstream&&w.probe;return {gateway,probe,eligible:mode==='gateway'?gateway:probe};}
export function evaluateFailover(a:WanState,b:WanState,mode:Detection){const first=evaluateWan(a,mode),second=evaluateWan(b,mode);const selected=first.eligible?'A':second.eligible?'B':null;const wan=selected==='A'?a:selected==='B'?b:null;return {first,second,selected,service:!!wan&&wan.link&&wan.gateway&&wan.upstream&&wan.nat};}
