/** IPv4 arithmetic uses exact non-negative numbers to avoid signed 32-bit overflow. */
export function parseIPv4(value:string):number|null {
 const parts=value.trim().split('.');
 if(parts.length!==4||parts.some(p=>! /^(0|[1-9]\d{0,2})$/.test(p)||Number(p)>255))return null;
 return parts.reduce((n,p)=>n*256+Number(p),0);
}
export function formatIPv4(value:number):string {
 return [24,16,8,0].map(shift=>Math.floor(value/2**shift)%256).join('.');
}
export function calculateSubnet(ip:string,prefix:number){
 const value=parseIPv4(ip);
 if(value===null||!Number.isInteger(prefix)||prefix<0||prefix>32)return null;
 const total=2**(32-prefix),network=Math.floor(value/total)*total,last=network+total-1;
 const hostCount=prefix>=31?total:total-2;
 const firstHost=prefix>=31?network:network+1;
 const lastHost=prefix>=31?last:last-1;
 return {value,prefix,total,network,last,hostCount,firstHost,lastHost,mask:2**32-total,
  broadcast:prefix>=31?null:last,
  role:prefix===32?'Alamat tunggal (/32)':prefix===31?'Endpoint point-to-point (/31)':value===network?'Alamat network':value===last?'Alamat broadcast':'Alamat host'};
}
export function sameSubnet(a:string,b:string,prefix:number):boolean|null {
 const left=calculateSubnet(a,prefix),right=calculateSubnet(b,prefix);
 return left&&right?left.network===right.network:null;
}
export function splitSubnet(ip:string,parentPrefix:number,childPrefix:number,limit=8){
 const parent=calculateSubnet(ip,parentPrefix);
 if(!parent||!Number.isInteger(childPrefix)||childPrefix<parentPrefix||childPrefix>32||!Number.isInteger(limit)||limit<1||limit>64)return null;
 const count=2**(childPrefix-parentPrefix),size=2**(32-childPrefix);
 return {count,rows:Array.from({length:Math.min(count,limit)},(_,i)=>calculateSubnet(formatIPv4(parent.network+i*size),childPrefix)!)};
}
