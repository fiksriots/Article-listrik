const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),ts=require('typescript');
const source=fs.readFileSync('lib/subnet.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const mod={exports:{}};vm.runInNewContext(js,{exports:mod.exports,module:mod});
const {parseIPv4,formatIPv4,calculateSubnet:s,sameSubnet,splitSubnet}=mod.exports;
const fixtures=[
 ['192.168.10.150',25,'192.168.10.128','192.168.10.255','255.255.255.128','192.168.10.129','192.168.10.254',126],
 ['192.168.20.70',26,'192.168.20.64','192.168.20.127','255.255.255.192','192.168.20.65','192.168.20.126',62],
 ['10.10.10.6',30,'10.10.10.4','10.10.10.7','255.255.255.252','10.10.10.5','10.10.10.6',2],
 ['192.168.1.1',23,'192.168.0.0','192.168.1.255','255.255.254.0','192.168.0.1','192.168.1.254',510],
 ['255.255.255.255',1,'128.0.0.0','255.255.255.255','128.0.0.0','128.0.0.1','255.255.255.254',2147483646],
 ['0.0.0.0',0,'0.0.0.0','255.255.255.255','0.0.0.0','0.0.0.1','255.255.255.254',4294967294],
 ['10.10.10.1',31,'10.10.10.0',null,'255.255.255.254','10.10.10.0','10.10.10.1',2],
 ['255.255.255.255',32,'255.255.255.255',null,'255.255.255.255','255.255.255.255','255.255.255.255',1],
];
for(const [ip,p,n,b,m,f,l,h] of fixtures){const r=s(ip,p);assert.ok(r);assert.equal(formatIPv4(r.network),n);assert.equal(r.broadcast===null?null:formatIPv4(r.broadcast),b);assert.equal(formatIPv4(r.mask),m);assert.equal(formatIPv4(r.firstHost),f);assert.equal(formatIPv4(r.lastHost),l);assert.equal(r.hostCount,h);}
for(const ip of ['','1.2.3','1.2.3.4.5','256.1.1.1','-1.2.3.4','1e2.2.3.4','1.2.3.4/24','01.2.3.4','1..2.3','1.2.3.4a'])assert.equal(parseIPv4(ip),null,ip);
for(const p of [-1,33,24.5,NaN])assert.equal(s('1.2.3.4',p),null);
assert.equal(sameSubnet('192.168.10.20','192.168.10.150',24),true);
assert.equal(sameSubnet('192.168.10.20','192.168.10.150',25),false);
assert.equal(sameSubnet('bad','1.2.3.4',24),null);
assert.equal(s('192.168.10.0',24).role,'Alamat network');assert.equal(s('192.168.10.255',24).role,'Alamat broadcast');
const split=splitSubnet('192.168.10.150',24,26);assert.equal(split.count,4);assert.equal(Array.from(split.rows,r=>formatIPv4(r.network)).join(','),'192.168.10.0,192.168.10.64,192.168.10.128,192.168.10.192');assert.ok(split.rows.every(r=>r.hostCount===62));
assert.equal(splitSubnet('0.0.0.0',0,32).count,4294967296);assert.equal(splitSubnet('0.0.0.0',0,32).rows.length,8);assert.equal(splitSubnet('1.2.3.4',24,23),null);
console.log('PASS: IPv4 boundaries, invalid input, /0, /31, /32, host roles, same-subnet decisions, FLSM and bounded rendering');
