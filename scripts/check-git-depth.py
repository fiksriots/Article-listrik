"""Execute the published local examples, without remotes or real credentials."""
import json, pathlib, subprocess, tempfile, xml.etree.ElementTree as ET
D=json.loads(pathlib.Path('lib/git-lessons.json').read_text()); lesson=lambda slug:next(l for l in D if l['slug']==slug)
def run(code,cwd):
 r=subprocess.run(['bash','-c',code],cwd=cwd,text=True,capture_output=True)
 assert r.returncode==0,(r.stdout,r.stderr)
 return r.stdout
with tempfile.TemporaryDirectory(prefix='git-depth-') as path:
 root=pathlib.Path(path)
 l=lesson('lf-crlf-gitattributes');run(l['blocks'][1]['code'],root);repo=root/'lab-akhir-baris'
 assert 'i/lf' in run('git ls-files --eol -- catatan.md',repo)
 assert run('git show HEAD:catatan.md',repo)=='Satu\nDua\n'
 assert run('git diff HEAD~1 HEAD --ignore-space-at-eol -- catatan.md',repo)==''
 assert 'eol: lf' in run('git check-attr eol -- catatan.md',repo)
 print('PASS CRLF normalization: LF index, unchanged text, shared per-file rule')
 l=lesson('blame-show-riwayat');run(l['blocks'][0]['code'],root);repo=root/'lab-telusur'
 head=run('git rev-parse --short=8 HEAD',repo).strip();assert head in run('git blame -L 2,2 -- aturan.txt',repo)
 assert 'Batas: 10' in run('git show HEAD~1:aturan.txt',repo)
 assert (repo/'aturan.txt').read_text()=='Nama: Lab\nBatas: 20\n'
 print('PASS blame/show: expected commit and old snapshot, working file unchanged')
 l=lesson('keamanan-repository');run(l['blocks'][0]['code'],root);repo=root/'lab-rahasia-dummy'
 assert (repo/'.env').exists();assert run('git ls-files -- .env',repo)==''
 assert 'CONTOH_BUKAN_TOKEN_AKTIF' in run('git show HEAD~1:.env',repo)
 assert run('git remote',repo)==''
 print('PASS secret dummy: ignored/untracked latest file still exists in old history, no remote')
 l=lesson('git-worktree');run(l['blocks'][0]['code'],root);repo=root/'lab-worktree'
 assert run('git branch --show-current',repo).strip()=='fitur'
 assert 'Draf fitur belum selesai' in run('git diff -- catatan.txt',repo)
 assert not (root/'lab-worktree-hotfix').exists()
 assert 'hotfix' in run('git branch --list hotfix',repo)
 assert 'Tambah perbaikan mendesak' in run('git log --oneline hotfix',repo)
 print('PASS worktree: hotfix committed, feature edits retained, clean worktree removed, branch retained')
 l=lesson('git-lfs-aset-besar');run(l['blocks'][1]['code'],root);repo=root/'lab-lfs'
 pointer=run('git show HEAD:aset-lab.txt',repo)
 assert pointer.startswith('version https://git-lfs.github.com/spec/v1\n') and 'oid sha256:' in pointer
 assert (repo/'aset-lab.txt').read_text().startswith('Ini aset dummy kecil')
 assert 'aset-lab.txt' in run('git lfs ls-files',repo)
 assert run('git remote',repo)==''
 print('PASS real Git LFS: Git pointer and original worktree asset, no upload')
assert len(D)==48 and len({l['slug'] for l in D})==48
assert [l['stage'] for l in D]==sorted(l['stage'] for l in D)
for l in D:ET.parse(pathlib.Path('public/git',l['slug']+'.svg'))
print('PASS 48 ordered lessons and valid SVG illustrations')
