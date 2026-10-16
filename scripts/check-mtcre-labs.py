import json,re,ipaddress,pathlib,collections
r=pathlib.Path(__file__).resolve().parents[1];labs=json.loads((r/'lib/mtcre-labs.json').read_text());lessons={l['slug'] for l in json.loads((r/'lib/network-lessons.json').read_text())}
assert len(labs)==20 and len({l['slug'] for l in labs})==20
required={'static-tiga-router','failover-gateway','failover-recursive','ecmp-dua-jalur','policy-routing','mangle-ping-traceroute','ttl-client','ttl-isp','ospf-single-3','ospf-single-4','ospf-redundancy-3','ospf-redundancy-4','ospf-multiarea-3','ospf-multiarea-4','ospf-network-type','ospf-stub-nssa','redistribute-e1','redistribute-e2','tunnel-gre','tunnel-eoip'}
assert {l['slug'] for l in labs}==required
for l in labs:
 assert l['pages'] and l['restore'] and l['source'].startswith('https://')
 assert set(l['modules'])<=lessons
 assert len(l['tests'])>=3 and len(l['steps'])>=2 and l['faults']
 assert (r/'public/network'/('lab-'+l['slug']+'.svg')).exists()
 assert all(a in l['nodes'] and b in l['nodes'] for a,b,_ in l['edges'])
 for row in l['addresses']:
  assert len(row)==4
  ipaddress.ip_interface(row[2])
 for s in l['steps']:
  assert 'reset-configuration' not in s['code']
  assert '<xxx>' not in s['code'] and 'YOUR_' not in s['code']
 # For self-contained OSPF labs, parse actual command addresses and ensure link peers match area/type/cost.
 if l['slug'] in ['ospf-single-3','ospf-single-4','ospf-redundancy-3','ospf-redundancy-4','ospf-multiarea-3','ospf-multiarea-4']:
  routers=[s for s in l['steps'] if re.fullmatch('R[1-4]',s['device']) and '/routing/ospf/instance/add' in s['code']]
  peers=collections.defaultdict(list);allips=set()
  for s in routers:
   code=s['code'];addr={iface:ipaddress.ip_interface(ip) for ip,iface in re.findall(r'/ip/address/add address=(\S+) interface=(\S+)',code)}
   for a in addr.values(): assert a.ip not in allips;allips.add(a.ip)
   for iface,area,cost in re.findall(r'interface-template/add interfaces=(\S+) area=(\S+) type=ptp cost=(\d+)',code):peers[str(addr[iface].network)].append((s['device'],area,cost))
  for net,p in peers.items():assert len(p)==2 and p[0][1:]==p[1][1:],(l['slug'],net,p)
  assert len(routers)==int(l['slug'][-1])
# Rendered pages must expose code, reference, illustration, tests and recovery.
if (r/'.next/server/app/jaringan/mtcre/lab').exists():
 landing=(r/'.next/server/app/jaringan/mtcre.html').read_text()
 for l in labs:
  p=r/'.next/server/app/jaringan/mtcre/lab'/f'{l["slug"]}.html'
  assert p.exists(),p
  text=p.read_text();assert 'Buktikan hasilnya' in text and 'Pulihkan dan simpan bukti' in text and '/network/lab-'+l['slug']+'.svg' in text
  assert '/jaringan/mtcre/lab/'+l['slug'] in landing
 feed=json.loads((r/'.next/server/app/api/articles.body').read_text())['items']
 for l in labs:assert any(x['id']=='mtcre-lab-'+l['slug'] for x in feed)
 assert len({x['id'] for x in feed})==len(feed)
print('PASS: 20 lab topics, valid IPs, consistent OSPF peer area/cost, unique router IPs, code safety, topology assets and rendered integration when available')
