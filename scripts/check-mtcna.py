"""Check curriculum coverage, lab contracts and generated page/catalog integration."""
import json,pathlib,ipaddress,xml.etree.ElementTree as ET
r=pathlib.Path(__file__).resolve().parents[1]
groups=json.loads((r/'lib/mtcna-curriculum.json').read_text());guides=json.loads((r/'lib/mtcna-guides.json').read_text())
items=[i for g in groups for i in g['items']];slugs={g['slug'] for g in guides}
assert [g['number'] for g in groups]==list(range(1,9))
assert [len(g['items']) for g in groups]==[9,6,4,3,3,3,2,5]
assert len(items)==35 and len({i['id'] for i in items})==35
assert len(guides)==22 and len(slugs)==22
lessons={l['slug'] for l in json.loads((r/'lib/network-lessons.json').read_text())}
labs={l['slug'] for l in json.loads((r/'lib/mtcre-labs.json').read_text())}
topics={l['slug'] for l in json.loads((r/'lib/mtcre-topics.json').read_text())}
def resolve(href):
 path=href.split('#')[0];slug=path.rsplit('/',1)[-1]
 if '/mtcna/panduan/' in path:return slug in slugs
 if '/mtcre/lab/' in path:return slug in labs
 if '/mtcre/materi/' in path:return slug in topics
 if '/simulator/' in path:return (r/'app'/path.lstrip('/')/'page.tsx').exists()
 return slug in lessons
for i in items:
 assert resolve(i['theory']),i
 if i['lab']:assert resolve(i['lab']),i
 if 'LAB' in i['title']:assert i['lab'],i
for g in guides:
 assert 1<=g['module']<=8 and len(g['explain'])>=3 and len(g['steps'])>=3 and len(g['tests'])>=3
 assert all(len(p)>100 for p in g['explain']),g['slug']
 assert g['faults'] and g['restore'] and g['prereq'] and g['source'].startswith('https://manual.mikrotik.com/docs/')
 assert any(i['theory'].endswith('/'+g['slug']) for i in items),g['slug']
 ET.parse(r/'public/network'/f'mtcna-{g["slug"]}.svg')
 for row in g['addresses']:
  assert len(row)==4
  if '/' in row[2]:ipaddress.ip_interface(row[2])
 for e in g['edges']:assert e[0] in g['nodes'] and e[1] in g['nodes']
by={g['slug']:g for g in guides}
code=lambda slug:'\n'.join(s['code'] for s in by[slug]['steps'])
wan=code('internet-dhcp')
assert 'allow-remote-requests=no' in wan and 'MTCNA-FWD-DROP' in wan and 'src-port=67 dst-port=68' in wan
assert 'ether1 add-default-route=yes' in wan and 'address-pool=lan-pool' in wan
assert 'max-limit=2M/5M' in code('simple-queue')
assert 'pcq-classifier=src-address' in code('pcq') and 'pcq-classifier=dst-address' in code('pcq')
assert 'authenticate=yes' in code('bandwidth-monitor') and 'duration=10s' in code('bandwidth-monitor')
assert 'security.authentication-types=wpa2-psk' in code('wireless-link') and 'wpa2-pre-shared-key=' in code('wireless-link')
assert 'nv2-security=enabled' in code('wireless-protocols')
assert 'interface=wlan1' not in '\n'.join(s['code'] for s in by['bridge-remote']['steps'] if '/interface/bridge/port/' in s['code'])
assert 'menghapus' in by['netinstall']['steps'][0]['title']
assert by['netinstall']['kind']=='hardware' and by['lisensi']['kind']=='theory'
base=r/'.next/server/app'
landing=base/'jaringan/mtcna.html'
if landing.exists() and (base/'jaringan/mtcna/panduan/akses-pertama.html').exists():
 text=landing.read_text()
 for i in items:assert i['theory'] in text and (not i['lab'] or i['lab'].replace('&','&amp;') in text)
 for g in guides:
  path=base/'jaringan/mtcna/panduan'/f'{g["slug"]}.html';assert path.exists(),path
  page=path.read_text();assert '/network/mtcna-'+g['slug']+'.svg' in page and 'id="praktik"' in page
 feed=json.loads((base/'api/articles.body').read_text())['items']
 assert len({x['id'] for x in feed})==len(feed)
 for g in guides:assert any(x['id']=='mtcna-guide-'+g['slug'] for x in feed)
print('PASS: 8 modules / 35 unique curriculum points / 22 guides and diagrams; links, lab prerequisites, IP addresses, security and rendered catalogue integration')
