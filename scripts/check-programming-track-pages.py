"""Run after next build: ensure actual article navigation stays inside its path."""
import json
import re
from pathlib import Path
from html import unescape

root = Path(__file__).resolve().parents[1]
order = json.loads((root / 'lib/programming-order.json').read_text())
tracks = [
    ('oop', [slug for group in order if group['title'].startswith('OOP ·') for slug in group['slugs']]),
    ('terstruktur', [slug for group in order if group['title'] != 'Struktur Data' and not group['title'].startswith('OOP ·') for slug in group['slugs']]),
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
assert 'programming-track-oop' in chooser
assert '<div class="net-catalog"' not in chooser
print('PASS: all 77 rendered sidebars and previous/next links stay in the right path; selector has three paths')
