import fs from 'node:fs';
import assert from 'node:assert/strict';
const lessons=JSON.parse(fs.readFileSync('lib/network-lessons.json','utf8'));
const slugs=new Set(lessons.map(x=>x.slug));
assert.equal(slugs.size,lessons.length,'Duplicate network slug');
const legacy=['apa-itu-jaringan','lan-wan-internet','perangkat-jaringan','kabel-fiber-poe','ip-mac','subnet-mask','gateway-dns','dhcp-ip-statis','osi-tcp-ip','switch-arp','tcp-udp-port','nat-ip-publik','wifi-sinyal-channel','vlan-access-trunk','routing-statis','firewall-dasar','mikrotik-winbox','lab-jaringan-rumah','monitoring-ping','troubleshooting-runtut','bandwidth-latency','vpn-akses-remote','failover-dua-isp','proyek-kantor'];
legacy.forEach(s=>assert.ok(slugs.has(s),`Legacy route missing: ${s}`));
lessons.forEach((l,i)=>{assert.match(l.slug,/^[a-z0-9-]+$/);assert.ok(Number.isInteger(l.stage)&&l.stage>=0&&l.stage<20);assert.ok(i===0||l.stage>=lessons[i-1].stage,'Stages must follow the learning sequence');for(const k of ['title','summary','analogy','explain','example','warning','check','answer'])assert.ok(typeof l[k]==='string'&&l[k].trim(),`${l.slug}: missing ${k}`);assert.ok(l.explain.split('\n\n').length>=3,`${l.slug}: explanation needs distinct paragraphs`);assert.ok(l.practice.length>=3);assert.equal(l.nodes.length,3);assert.ok(fs.existsSync(`public/network/${l.slug}.svg`),`Missing SVG: ${l.slug}`);if(l.mtcna){assert.ok(l.source?.startsWith('https://'));assert.ok(l.practice.length>=5);}});
assert.deepEqual([...new Set(lessons.filter(l=>l.mtcna).map(l=>l.mtcna))].sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9]);
console.log(`PASS: ${lessons.length} network lessons, ${lessons.filter(l=>l.mtcna).length} MTCNA preparation modules, all 9 outline groups, legacy routes and SVG assets`);

for(const [before,after] of [['ip-mac','subnet-mask'],['subnet-mask','routing-statis'],['routing-statis','nat-ip-publik'],['mtcna-routeros-cli','mtcre-keputusan-routing'],['mtcre-ospf-identitas','mtcre-ospf-cost']])assert.ok(lessons.findIndex(l=>l.slug===before)<lessons.findIndex(l=>l.slug===after),`${before} must precede ${after}`);
