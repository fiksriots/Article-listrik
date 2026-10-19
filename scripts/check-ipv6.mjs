import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseIPv6,expandedIPv6,compressedIPv6,inspectIPv6,compareIPv6,divideIPv6} from '../lib/ipv6-math.ts';
for(const bad of ['',':',':::','2001::db8::1','1:2:3:4:5:6:7','1:2:3:4:5:6:7:8:9','1:2:3:4:5:6:7:fffff','gggg::1','1:2:3:4:5:6:7:8::','fe80::1%eth0','::ffff:192.0.2.1','::1/128'])assert.throws(()=>parseIPv6(bad),bad);
assert.equal(compressedIPv6(parseIPv6('2001:0DB8:0000:0000:0001:0000:0000:0020')),'2001:db8::1:0:0:20');
assert.equal(compressedIPv6(parseIPv6('1:2:3:0:4:5:6:7')),'1:2:3:0:4:5:6:7');
for(const a of ['::','::1','ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff','2001:db8::'])assert.equal(parseIPv6(compressedIPv6(parseIPv6(a))),parseIPv6(a));
for(const p of ['',-1,129,1.2,'1e2','64x'])assert.throws(()=>inspectIPv6('::1',p));
assert.equal(inspectIPv6('::1',0).count,(BigInt(1)<<BigInt(128)).toString());assert.equal(inspectIPv6('2001:db8::25',128).last,'2001:db8::25');
assert.deepEqual(compareIPv6('2001:db8:1:1::1',56,'2001:db8:1:2::2',64),{aSeesLocal:true,bSeesLocal:false,sameAddress:false});
const plan=divideIPv6('2001:db8:1234:ab31::',60,64,'15');assert.equal(plan.parent,'2001:db8:1234:ab30::');assert.equal(plan.count,'16');assert.equal(plan.selected,'2001:db8:1234:ab3f::');assert.equal(plan.normalized,true);assert.throws(()=>divideIPv6('::',64,56,'0'));assert.throws(()=>divideIPv6('::',60,64,'16'));assert.equal(divideIPv6('::',0,128,((BigInt(1)<<BigInt(128))-BigInt(1)).toString()).selected,'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff');
const fixtures=JSON.parse(fs.readFileSync(process.argv[2]));
for(const f of fixtures){const r=inspectIPv6(f.address,f.prefix);assert.equal(r.compressed,f.compressed);assert.equal(r.expanded,f.expanded);assert.equal(r.network,f.network);assert.equal(r.last,f.last);assert.equal(r.count,f.count);}
console.log('PASS:',fixtures.length,'Python ipaddress cross-checks; invalid input, compression, asymmetric prefixes, subdivision and 128-bit boundaries');
