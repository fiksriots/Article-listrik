"""Check lesson coverage, downloadable source fidelity, and Django behavior."""
import ast
import json
import os
from pathlib import Path
import secrets
import subprocess
import sys
import tempfile
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
lessons = json.loads((ROOT / 'lib/programming-django-lessons.json').read_text())
lessons += [l for l in json.loads((ROOT / 'lib/programming-supplement-lessons.json').read_text()) if l['slug'].startswith('django-')]
quizzes = json.loads((ROOT / 'lib/programming-quizzes.json').read_text())
order = json.loads((ROOT / 'lib/programming-order.json').read_text())
assert len(lessons) == 16
slugs = [s for g in order if g['title'].startswith('Django ·') for s in g['slugs']]
assert set(slugs) == {l['slug'] for l in lessons}
assert len(slugs) == len(set(slugs))
for lesson in lessons:
    assert len(lesson['explain']) >= 3 and len(lesson['steps']) >= 3 and len(lesson['practice']) >= 2
    assert lesson['warning'] and lesson['check'] and lesson['answer']
    assert lesson['source'].startswith('https://docs.djangoproject.com/en/5.2/')
    assert len(quizzes[lesson['slug']]) == 4
    for q in quizzes[lesson['slug']]:
        assert len(q['options']) == len(set(q['options'])) == 3
        assert 0 <= q['answer'] < 3 and q['explanation']
    for b in lesson['blocks']:
        if b['language'] == 'python':
            ast.parse(b['code'])
        file = ROOT / 'examples/django-lab' / b['filename']
        if file.is_file():
            assert file.read_text() == b['code'], (lesson['slug'], b['filename'])

with tempfile.TemporaryDirectory(prefix='django-course-') as temp:
    with ZipFile(ROOT / 'public/programming/lab/django/django-lab.zip') as z:
        names = z.namelist()
        assert len(names) == len(set(names)) == 29
        for n in names:
            p = Path(n)
            assert n.startswith('django-lab/') and '..' not in p.parts and not p.is_absolute()
            assert not any(part in {'.venv', '__pycache__', 'staticfiles', '.env'} for part in p.parts)
            assert p.suffix not in {'.sqlite3', '.pyc'}
            assert z.read(n) == (ROOT / 'examples' / n).read_bytes(), n
        z.extractall(temp)
    project = Path(temp) / 'django-lab'
    def run(*args, env=None):
        result = subprocess.run([sys.executable, 'manage.py', *args], cwd=project, env=env, capture_output=True, text=True)
        assert result.returncode == 0, result.stdout + result.stderr
        return result.stdout + result.stderr
    run('check')
    run('makemigrations', '--check', '--dry-run')
    run('migrate', '--noinput')
    out = run('test', 'operasional', '--verbosity', '1')
    assert 'Ran 32 tests' in out and 'OK' in out
    env = dict(os.environ, DJANGO_SECRET_KEY=secrets.token_urlsafe(64), DJANGO_ALLOWED_HOSTS='latihan.example.org', DJANGO_DB_PATH=str(project / 'staging.sqlite3'))
    run('shell', '--settings=config.production', '-c', 'from django.conf import settings; assert not settings.DEBUG; assert settings.SESSION_COOKIE_SECURE; assert settings.CSRF_COOKIE_SECURE; assert settings.ALLOWED_HOSTS == ["latihan.example.org"]', env=env)
print('PASS: 16 Django lessons / 64 questions, exact source-only ZIP, migrations, production settings and 32 behavioral tests from extracted download')
