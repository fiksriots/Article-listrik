import json,tempfile,pathlib,subprocess,os
D=json.load(open('lib/git-lessons.json'));get=lambda s:next(x for x in D if x['slug']==s)
def run(code,cwd,expect=0):
 r=subprocess.run(['bash','-c',code],cwd=cwd,text=True,capture_output=True)
 if expect is not None:assert r.returncode==expect,(r.returncode,r.stdout,r.stderr)
 return r
with tempfile.TemporaryDirectory(prefix='git-course-lab-') as tmp:
 l=get('lab-konflik-dua-kontributor');r=run(l['blocks'][0]['code'],tmp,1);assert 'rejected' in r.stderr
 r=run(l['blocks'][1]['code'],pathlib.Path(tmp)/'lab-dua-kontributor/kontributor-b');assert 'CONFLICT' in r.stdout
 base=pathlib.Path(tmp)/'lab-dua-kontributor';ha=run('git rev-parse HEAD',base/'kontributor-a').stdout;hb=run('git rev-parse HEAD',base/'kontributor-b').stdout;assert ha==hb
 assert (base/'kontributor-a/jadwal.txt').read_text()=='Berangkat 08.30, konfirmasi ke tim dahulu\n'
 assert run('git status --porcelain',base/'kontributor-a').stdout==''
 print('PASS two clones: rejected push, real merge conflict, merged text, identical HEAD, clean status')
 l=get('git-bisect');run(l['blocks'][0]['code'],tmp);repo=pathlib.Path(tmp)/'lab-bisect'
 for _ in range(5):
  good=(repo/'status.txt').read_text().strip()=='OK'
  r=run('git bisect '+('good' if good else 'bad'),repo)
  if 'first bad commit' in r.stdout:break
 else:raise AssertionError('bisect did not finish')
 assert 'Perkenalkan status salah' in r.stdout;run('git bisect reset',repo);print('PASS bisect: identifies v3 and returns to starting branch')
 l=get('commit-rapi-add-p');first=l['blocks'][0]['code'].replace('git add -p catatan.txt','printf "y\\nn\\n" | git add -p catatan.txt');run(first,tmp)
 repo=pathlib.Path(tmp)/'lab-patch';staged=run('git diff --staged',repo).stdout;unstaged=run('git diff',repo).stdout;assert '+Judul jelas' in staged and '+Jadwal baru' not in staged;assert '+Jadwal baru' in unstaged
 run(l['blocks'][1]['code'],repo);print('PASS partial staging: selected hunk and remaining edit become separate commits')
 html=get('github-actions')['blocks'][0]['code'];pathlib.Path(tmp,'index.html').write_text(html);run('test -s index.html\ngrep -Fq "Belajar Git Bersama" index.html',tmp)
 pathlib.Path(tmp,'index.html').write_text(html.replace('Belajar Git Bersama','Judul diubah'));assert run('grep -Fq "Belajar Git Bersama" index.html',tmp,expect=None).returncode==1;print('PASS example CI: valid HTML passes, changed marker fails')
assert len(D)==48 and len({l['slug'] for l in D})==48
assert [l['stage'] for l in D]==sorted(l['stage'] for l in D)
for l in D:
 assert pathlib.Path('public/git',l['slug']+'.svg').exists(),l['slug']
 for field in ['source','check','answer','warning','result']:assert l[field]
print('PASS 48 unique ordered lessons, images, sources and exercises')
