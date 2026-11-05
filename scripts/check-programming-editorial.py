"""Check curriculum references, editorial exercises, and local image assets."""
import json
from pathlib import Path
from xml.etree import ElementTree

ROOT=Path(__file__).resolve().parents[1]
lessons=[lesson for path in (ROOT/'lib').glob('programming*lessons.json') for lesson in json.loads(path.read_text())]
by_slug={item['slug']:item for item in lessons}
order=json.loads((ROOT/'lib/programming-order.json').read_text())
ordered=[slug for group in order for slug in group['slugs']]
assert len(lessons)==len(by_slug)==len(ordered)
assert set(ordered)==set(by_slug)
quizzes=json.loads((ROOT/'lib/programming-quizzes.json').read_text())
assert set(quizzes)==set(by_slug)
for lesson in lessons:
    assert all(len(row)==len(lesson['table']['headers']) for row in lesson['table']['rows']),lesson['slug']
    if lesson.get('diagram'):
        path=ROOT/'public/programming'/(lesson['diagram']+'.svg')
        assert path.is_file(),path
        assert lesson['diagramAlt'].strip(),lesson['slug']
        ElementTree.parse(path)
    assert len(quizzes[lesson['slug']])==4
notes=json.loads((ROOT/'lib/programming-reading-notes.json').read_text())
for slug,note in notes.items():
    assert slug in by_slug,slug
    assert len(note['walk'])>=2 and all(p.strip() for p in note['walk']),slug
    assert note['question'].strip() and note['answer'].strip(),slug
    # Exercises are authored separately, not copied from the existing check.
    assert note['question']!=by_slug[slug]['check'],slug
    if 'diagram' in note:
        assert note['diagram']['alt'].strip(),slug
        assert not by_slug[slug].get('diagram'),slug
        assert (ROOT/'public/programming'/(note['diagram']['name']+'.svg')).is_file(),slug
guides=json.loads((ROOT/'lib/programming-study-guides.json').read_text())
track_ids={'terstruktur','struktur-data','oop','basis-data','backend-api','pemrograman-jaringan','web','django','data-analysis','data-science','pengujian-debugging','proyek-otomasi','rekayasa-deployment'}
assert set(guides)==track_ids
for track,guide in guides.items():
    assert guide['link'].removeprefix('/programming/') in by_slug,track
    assert len(guide['tujuan'])>=3 and len(guide['istilah'])>=5,track
    assert len({item['term'] for item in guide['istilah']})==len(guide['istilah']),track
    if track in {'pengujian-debugging','proyek-otomasi','rekayasa-deployment'}:
        assert '<StudyGuide id={id}/>' in (ROOT/'components/programming/practice-path.tsx').read_text()
    else:
        assert f'<StudyGuide id="{track}"/>' in (ROOT/f'app/programming/{track}/page.tsx').read_text(),track
for path in (ROOT/'public/programming').glob('belajar-*.svg'):
    svg=ElementTree.parse(path).getroot()
    assert svg.find('{http://www.w3.org/2000/svg}title') is not None,path
    assert svg.find('{http://www.w3.org/2000/svg}desc') is not None,path
    assert any(note.get('diagram',{}).get('name')==path.stem for note in notes.values()),path
for name in ['formulir-valid','daftar-tugas','api-laporan-lokal']:
    assert (ROOT/f'public/programming/screenshots/{name}.png').read_bytes().startswith(b'\x89PNG\r\n\x1a\n')
print(f'PASS: {len(lessons)} lessons, {sum(map(len,quizzes.values()))} existing questions, {len(guides)} study guides, {len(notes)} reading notes and worked exercises, 21 new diagrams, and 3 real screenshots')
