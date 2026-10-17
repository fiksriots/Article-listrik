import pathlib,json,re,ipaddress
r=pathlib.Path(__file__).resolve().parents[1];groups=json.loads((r/'lib/mtcre-curriculum.json').read_text());topics=json.loads((r/'lib/mtcre-topics.json').read_text());labs=json.loads((r/'lib/mtcre-labs.json').read_text());lesson_slugs={x['slug'] for x in json.loads((r/'lib/network-lessons.json').read_text())};lab_slugs={x['slug'] for x in labs};topic_slugs={x['slug'] for x in topics}
assert [len(g['items']) for g in groups]==[4,10,16,5,10]
items=[i for g in groups for i in g['items']];assert len(items)==45 and len({i['id'] for i in items})==45
assert len(topics)==14 and len(labs)==36
for i in items:
 slug=i['theory'].rsplit('/',1)[1]
 assert slug in (topic_slugs if '/materi/' in i['theory'] else lesson_slugs),i
 assert set(i['labs'])<=lab_slugs
 if 'LAB' in i['title']:assert i['labs'],i
for t in topics:
 assert len(t['paragraphs'])>=3 and len(t['practice'])>=5 and t['check'] and t['answer']
 assert set(t['labs'])<=lab_slugs and t['source'].startswith('https://')
 assert len(t['table'])>=3
pptp=next(l for l in labs if l['slug']=='vpn-pptp');assert any('legacy' in (s['title']+' '+s['text']).lower() for s in pptp['steps'])
l2tp=next(l for l in labs if l['slug']=='vpn-l2tp');s='\n'.join(x['code'] for x in l2tp['steps']);assert 'use-ipsec=required' in s and 'type=ptp' in s and 'interfaces=vpn-branch' in s
sstp=next(l for l in labs if l['slug']=='vpn-sstp');s='\n'.join(x['code'] for x in sstp['steps']);assert 'verify-server-certificate=yes' in s and 'verify-server-address-from-certificate=yes' in s and 'verify-server-certificate=no' not in s
vlan=next(l for l in labs if l['slug']=='vlan-kantor');commands={s['device']:s['code'] for s in vlan['steps'] if s['device'] in ['SW1','SW2']}
for sw in commands.values():assert sw.index('/interface/bridge/vlan/add')<sw.index('vlan-filtering=yes')
# Physical links in virtual-link baseline: area0, area1, area2 and endpoint IDs must agree.
v=next(l for l in labs if l['slug']=='ospf-virtual-link');codes={s['device']:s['code'] for s in v['steps'] if s['title'].startswith('2.')}
for left,lp,right,rp in [('R1','ether1','R2','ether1'),('R2','ether2','R3','ether1'),('R3','ether2','R4','ether1')]:
 def area(code,iface):return re.search('interfaces='+iface+r' area=(\w+) type=ptp',code)[1]
 assert area(codes[left],lp)==area(codes[right],rp)
full='\n'.join(s['code'] for s in v['steps']);assert 'vlink-neighbor-id=10.3.3.3' in full and 'vlink-neighbor-id=10.2.2.2' in full
# Rendered integration is checked only after build completes.
base=r/'.next/server/app';landing=base/'jaringan/mtcre/kurikulum.html'
if landing.exists():
 content=landing.read_text()
 for i in items:
  assert i['theory'] in content
  for slug in i['labs']:assert '/jaringan/mtcre/lab/'+slug in content
 for t in topics:
  f=base/'jaringan/mtcre/materi'/f'{t["slug"]}.html';assert f.exists(),f
  text=f.read_text();assert 'Cek pemahaman' in text and '/network/lab-' in text
 feed=json.loads((base/'api/articles.body').read_text())['items'];assert len({i['id'] for i in feed})==len(feed)
 for t in topics:assert any(i['id']=='mtcre-topic-'+t['slug'] for i in feed)
print('PASS: exact 45 curriculum points, 14 topics, 36 labs, all mappings, protected SSTP/L2TP settings, VLAN activation order and OSPF peer consistency')
