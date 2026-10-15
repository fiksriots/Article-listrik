export type PcId='a1'|'a2'|'b1'|'b2';
export type RouterId='r1'|'r2';
export type LabNode=PcId|RouterId|'swA'|'swB';
export const pcs:Record<PcId,{label:string;ip:string;lan:'A'|'B'}>={a1:{label:'PC A1',ip:'192.168.10.10',lan:'A'},a2:{label:'PC A2',ip:'192.168.10.11',lan:'A'},b1:{label:'PC B1',ip:'192.168.20.10',lan:'B'},b2:{label:'PC B2',ip:'192.168.20.11',lan:'B'}};
export const routers={r1:{label:'R1',lan:'192.168.10.1',transit:'10.10.10.1',remote:'192.168.20.0/24'},r2:{label:'R2',lan:'192.168.20.1',transit:'10.10.10.2',remote:'192.168.10.0/24'}};
export type RouteConfig={enabled:boolean;nextHop:string};
export type RoutingConfig={gateways:Record<PcId,string>;routes:Record<RouterId,RouteConfig>};
export type RoutingStep={from:LabNode;to:LabNode;phase:'Permintaan'|'Balasan';source:string;destination:string;nextHop?:string;message:string;failed?:boolean};
export function defaultRoutingConfig():RoutingConfig{return {gateways:{a1:'192.168.10.1',a2:'192.168.10.1',b1:'192.168.20.1',b2:'192.168.20.1'},routes:{r1:{enabled:true,nextHop:'10.10.10.2'},r2:{enabled:true,nextHop:'10.10.10.1'}}};}
/** Fixed lab: all links up, connected routes installed, no NAT, firewall permits ICMP. */
export function simulateRouting(source:PcId,destination:PcId,config:RoutingConfig){
 const steps:RoutingStep[]=[];
 if(source===destination)return {steps,success:false,requestReached:false,reason:'Pilih dua komputer yang berbeda.'};
 function leg(from:PcId,to:PcId,phase:RoutingStep['phase']):boolean{
  const a=pcs[from],b=pcs[to],sw:LabNode=a.lan==='A'?'swA':'swB';
  const add=(start:LabNode,end:LabNode,message:string,nextHop?:string,failed=false)=>steps.push({from:start,to:end,phase,source:a.ip,destination:b.ip,message,nextHop,failed});
  if(a.lan===b.lan){add(from,sw,`${a.label} melihat ${b.ip} masih dalam /24 lokal. Kirim langsung melalui switch; default gateway tidak dipakai.`,b.ip);add(sw,to,`Switch mengantar frame lokal ke ${b.label}; paket diterima.`,b.ip);return true;}
  const router:RouterId=a.lan==='A'?'r1':'r2',neighbor:RouterId=router==='r1'?'r2':'r1';
  const r=routers[router],n=routers[neighbor],gateway=config.gateways[from];
  if(gateway!==r.lan){add(from,from,!gateway?`${a.label} tidak mempunyai default gateway untuk tujuan di luar subnet.`:`Gateway ${gateway} tidak sesuai pada lab ini. ${a.label} perlu gateway router lokal ${r.lan}, bukan router jauh atau PC tetangga.`,gateway||undefined,true);return false;}
  add(from,sw,`${a.label} melihat ${b.ip} di luar subnet. Next hop pertama adalah gateway lokal ${gateway}; IP tujuan tetap ${b.ip}.`,gateway);
  add(sw,router,`Switch mengantar frame ke ${r.label}. Default gateway PC selesai menjalankan peran sebagai next hop pertama.`,gateway);
  const route=config.routes[router];
  if(!route.enabled){add(router,router,`${r.label} tidak mempunyai rute ke ${r.remote}. Tidak ada default route pada topologi latihan ini.`,undefined,true);return false;}
  if(route.nextHop!==n.transit){add(router,router,route.nextHop===r.transit?`${r.label} menunjuk alamat transit miliknya sendiri (${r.transit}) sebagai next hop. Pilih alamat router tetangga ${n.transit}.`:`Next hop ${route.nextHop||'(kosong)'} tidak dapat dipakai pada link transit lab. Tetangga ${r.label} adalah ${n.transit}.`,route.nextHop||undefined,true);return false;}
  add(router,neighbor,`${r.label} memilih static route ${r.remote} via ${n.transit}. Paket melewati link 10.10.10.0/30 menuju ${n.label}; IP tujuan tetap ${b.ip}.`,n.transit);
  const targetSwitch:LabNode=b.lan==='A'?'swA':'swB';
  add(neighbor,targetSwitch,`${n.label} mempunyai connected route ke LAN ${b.lan}. Tidak perlu static route tambahan untuk LAN yang terhubung langsung.`,b.ip);
  add(targetSwitch,to,`Switch LAN ${b.lan} mengantar paket ke ${b.label} (${b.ip}).`,b.ip);
  return true;
 }
 const requestReached=leg(source,destination,'Permintaan');
 if(!requestReached)return {steps,success:false,requestReached:false,reason:'Permintaan terhenti sebelum mencapai tujuan.'};
 const replied=leg(destination,source,'Balasan');
 return {steps,success:replied,requestReached:true,reason:replied?'Berhasil: permintaan sampai dan balasan kembali ke komputer asal.':'Permintaan sampai, tetapi jalur balasan terhenti. Ping belum berhasil.'};
}
