"""Audit built HTML links, fragments, and local image files. Optional external HTTP checks."""
import argparse, concurrent.futures, json, re
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import Request, urlopen
from urllib.error import HTTPError

class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.links=[];self.images=[];self.ids=set();self.headings=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.add(a['id'])
  if tag=='h2':self.headings+=1
  if tag=='a' and a.get('href'):self.links.append(a['href'])
  if tag=='img' and a.get('src'):self.images.append(a['src'])

parser=argparse.ArgumentParser();parser.add_argument('--build',default='.next/server/app');parser.add_argument('--external',action='store_true');args=parser.parse_args()
root=Path(args.build);pages={};files={};origin='https://article.fikss.site'
for file in root.rglob('*.html'):
 rel=file.relative_to(root).as_posix()[:-5];route='/' if rel=='index' else '/'+rel
 pages[route]=Page(file.read_text());files[route]=str(file)
issues=[];external={};images=set();checked=0
for route,page in pages.items():
 for kind,values in [('link',page.links),('image',page.images)]:
  for value in values:
   if value.startswith(('mailto:','tel:','data:','blob:')):continue
   u=urlsplit(urljoin(origin+route,value));path=unquote(u.path).rstrip('/') or '/'
   if u.netloc not in ['article.fikss.site','listrik.fikss.site']:
    if u.scheme in ['https','http'] and kind=='link' and not u.netloc.endswith(('wa.me','linkedin.com','facebook.com','twitter.com','x.com','t.me')):external.setdefault(u._replace(fragment='').geturl(),set()).add(route)
    continue
   checked+=1
   if kind=='image':
    images.add(path)
    if not (Path('public')/path.lstrip('/')).is_file():issues.append({'page':route,'kind':'missing-image','target':value})
   elif path in pages:
    fragment=unquote(u.fragment)
    if fragment and fragment not in pages[path].ids and not (re.fullmatch(r'bagian-\d+',fragment) and int(fragment[7:])<=pages[path].headings):issues.append({'page':route,'kind':'missing-anchor','target':value})
   elif not (Path('public')/path.lstrip('/')).is_file() and not (Path('app')/path.lstrip('/')/'page.tsx').is_file() and not path.startswith(('/api/','/bagikan/')):
    issues.append({'page':route,'kind':'missing-route','target':value})
for image in images:
 file=Path('public')/image.lstrip('/')
 if not file.exists():continue
 try:
  if file.suffix.lower()=='.svg':
   from xml.etree import ElementTree
   ElementTree.parse(file)
  else:
   from PIL import Image
   with Image.open(file) as bitmap:bitmap.verify()
 except Exception as error:issues.append({'kind':'invalid-image','target':image,'reason':str(error)[:120]})
print(json.dumps({'pages':len(pages),'internal_references':checked,'unique_images':len(images),'external_sources':len(external),'issues':issues},ensure_ascii=False),flush=True)
Path('/tmp/site-link-audit.json').write_text(json.dumps({'issues':issues,'external':{k:sorted(v) for k,v in external.items()}},ensure_ascii=False))
if args.external:
 def check(item):
  url,refs=item
  try:
   with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; FiksLinkCheck/1.0)'}),timeout=18) as response:
    response.read(512);return {'url':url,'status':response.status,'final':response.url,'pages':sorted(refs)}
  except HTTPError as e:return {'url':url,'status':e.code,'pages':sorted(refs)}
  except Exception as e:return {'url':url,'status':'unverified','reason':str(e)[:140],'pages':sorted(refs)}
 results=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
  for result in pool.map(check,external.items()):
   results.append(result)
   if result['status'] not in range(200,400):print(json.dumps(result,ensure_ascii=False),flush=True)
 Path('/tmp/site-external-audit.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
 print(json.dumps({'external_checked':len(results),'ok':sum(isinstance(x['status'],int) and 200<=x['status']<400 for x in results),'unverified_or_error':sum(not isinstance(x['status'],int) or x['status']>=400 for x in results)}),flush=True)
if issues:raise SystemExit(1)
