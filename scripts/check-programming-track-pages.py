"""Run after next build: ensure actual article navigation stays inside its path."""
import json
import re
from pathlib import Path
from html import unescape

root = Path(__file__).resolve().parents[1]
order = json.loads((root / 'lib/programming-order.json').read_text())
tracks = [
    ('pengujian-debugging',[s for g in order if g['title'].startswith('Pengujian & Debugging ·') for s in g['slugs']]),
    ('proyek-otomasi',[s for g in order if g['title'].startswith('Proyek & Otomasi ·') for s in g['slugs']]),
    ('rekayasa-deployment',[s for g in order if g['title'].startswith('Rekayasa & Deployment ·') for s in g['slugs']]),
    ('pemrograman-jaringan', [s for g in order if g['title'].startswith('Pemrograman Jaringan ·') for s in g['slugs']]),
    ('data-analysis', [s for g in order if g['title'].startswith('Data Analysis ·') for s in g['slugs']]),
    ('data-science', [s for g in order if g['title'].startswith('Data Science ·') for s in g['slugs']]),
    ('django', [slug for group in order if group['title'].startswith('Django ·') for slug in group['slugs']]),
    ('web', [slug for group in order if group['title'].startswith('Web ·') for slug in group['slugs']]),
    ('backend-api', [slug for group in order if group['title'].startswith('Backend/API ·') for slug in group['slugs']]),
    ('basis-data', [slug for group in order if group['title'].startswith('Basis Data ·') for slug in group['slugs']]),
    ('oop', [slug for group in order if group['title'].startswith('OOP ·') for slug in group['slugs']]),
    ('terstruktur', [slug for group in order if group['title'] != 'Struktur Data' and not group['title'].startswith('OOP ·') and not group['title'].startswith('Basis Data ·') and not group['title'].startswith('Backend/API ·') and not group['title'].startswith('Web ·') and not group['title'].startswith('Django ·') and not group['title'].startswith('Data Analysis ·') and not group['title'].startswith('Data Science ·') and not group['title'].startswith('Pemrograman Jaringan ·') and not group['title'].startswith('Pengujian & Debugging ·') and not group['title'].startswith('Proyek & Otomasi ·') and not group['title'].startswith('Rekayasa & Deployment ·') for slug in group['slugs']]),
    ('struktur-data', [slug for group in order if group['title'] == 'Struktur Data' for slug in group['slugs']]),
]
for track, slugs in tracks:
    expected = {'/programming/' + slug for slug in slugs}
    for index, slug in enumerate(slugs):
        html = (root / '.next/server/app/programming' / (slug + '.html')).read_text()
        sidebar = re.search(r'<aside class="net-sidebar">(.*?)</aside>', html, re.S).group(1)
        article_links = {unescape(href) for href in re.findall(r'href="([^"]+)"', sidebar) if href.startswith('/programming/')}
        assert article_links == expected, (track, slug, article_links ^ expected)
        nav = re.search(r'<nav class="net-lesson-nav".*?</nav>', html, re.S).group(0)
        links = [unescape(href) for href in re.findall(r'href="([^"]+)"', nav)]
        previous = '/programming/' + slugs[index-1] if index else '/programming/' + track
        following = '/programming/' + slugs[index+1] if index+1 < len(slugs) else '/programming/' + track + '#kurikulum'
        assert links == [previous, following], (slug, links)
    assert (root / '.next/server/app/programming' / (track + '.html')).exists()
chooser = (root / '.next/server/app/programming.html').read_text()
assert 'programming-track-terstruktur' in chooser and 'programming-track-struktur-data' in chooser
assert 'programming-track-oop' in chooser and 'programming-track-basis-data' in chooser
assert '<div class="net-catalog"' not in chooser
print('PASS: all 283 rendered sidebars and previous/next links stay in the right path; selector has thirteen paths')
