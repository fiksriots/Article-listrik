"""Validate published GitLab examples locally; no GitLab account or runner is used."""
import json,pathlib,subprocess,tempfile,yaml,xml.etree.ElementTree as ET
D=json.loads(pathlib.Path('lib/git-lessons.json').read_text());L=[x for x in D if x['slug'].startswith('gitlab-')]
assert len(D)==48 and len(L)==10
get=lambda s:next(x for x in L if x['slug']==s)
def run(code,cwd,env=None):
 r=subprocess.run(['bash','-c',code],cwd=cwd,text=True,capture_output=True,env=env)
 assert r.returncode==0,(r.stdout,r.stderr)
 return r.stdout
pipelines={}
for slug in ['gitlab-pipeline-runner','gitlab-artifact-variable','gitlab-pages']:
 code=next(b['code'] for b in get(slug)['blocks'] if b['language']=='yaml')
 config=yaml.safe_load(code);pipelines[slug]=config
 assert config['default']['image']=='alpine:3.22'
 assert len(config['workflow']['rules'])==2
 assert config['workflow']['rules'][0]['if']=='$CI_PIPELINE_SOURCE == "merge_request_event"'
 assert config['workflow']['rules'][1]['if']=='$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
 for key,val in config.items():
  if key in ['default','workflow','stages','variables']:continue
  assert val['stage'] in config['stages']
  assert all(isinstance(x,str) for x in val['script']),key
 print('PASS YAML structure and script types:',slug)
with tempfile.TemporaryDirectory(prefix='gitlab-course-') as folder:
 root=pathlib.Path(folder)
 site=next(b['code'] for b in get('gitlab-akses-push')['blocks'] if b['language']=='html')
 (root/'index.html').write_text(site)
 import os
 env=dict(os.environ,CI_COMMIT_SHORT_SHA='abc1234',LABEL_SITUS='Lab GitLab')
 cfg=pipelines['gitlab-pages']
 run('\n'.join(cfg['cek-html']['script']),root,env)
 run('\n'.join(cfg['kemas-situs']['script']),root,env)
 run('\n'.join(cfg['terbitkan-pages']['script']),root,env)
 assert (root/'public/index.html').read_text()==site
 assert (root/'public/versi.txt').read_text()=='commit=abc1234\n'
 assert cfg['terbitkan-pages']['pages']['publish']=='public'
 assert cfg['terbitkan-pages']['rules']==[{'if':'$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'}]
 (root/'index.html').write_text(site.replace('Belajar GitLab Bersama','Judul salah'))
 failed=subprocess.run(['bash','-c','\n'.join(cfg['cek-html']['script'])],cwd=root,env=env,capture_output=True)
 assert failed.returncode!=0
 print('PASS local CI scripts: valid HTML, artifact copy, commit marker, Pages folder, failed marker check')
 # Evaluate the exact simple rules used in these examples for three scenarios.
 def allowed(source,branch,default):return source=='merge_request_event' or bool(branch and branch==default)
 assert allowed('merge_request_event','', 'main')
 assert allowed('push','main','main')
 assert not allowed('push','fitur','main')
 assert not allowed('push','','main') # tag has no CI_COMMIT_BRANCH
 print('PASS documented rule scenarios: MR/default allowed, feature push/tag excluded; deploy default only')
 output=run(get('gitlab-multi-remote')['blocks'][0]['code'],root)
 work=root/'lab-dua-remote/kerja'
 head=run('git rev-parse HEAD',work).strip()
 for remote in ['origin','gitlab']:
  ref=run(f'git ls-remote {remote} refs/heads/main',work).split()[0];assert ref==head
 assert (work/'catatan.txt').read_text()=='Versi satu\nVersi dua\n'
 print('PASS real Git: two local remotes converge on same final commit without external writes')
for l in L:
 assert l['stage']==7 and l['practice'] and l['check'] and l['answer']
 assert l['source'].startswith('https://docs.gitlab.com/')
 ET.parse(pathlib.Path('public/git',l['slug']+'.svg'))
assert [x['stage'] for x in D]==sorted(x['stage'] for x in D)
print('PASS 10 ordered GitLab lessons, official references, exercises and SVGs')
