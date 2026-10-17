"""Check coverage, canonical reuse, code presence, and diagram integrity."""
import json
import xml.etree.ElementTree as ET
from pathlib import Path
root = Path(__file__).resolve().parents[1]
lessons = json.loads((root / 'lib/iot-lessons.json').read_text())
track = json.loads((root / 'lib/arduino-track.json').read_text())
by_slug = {lesson['slug']: lesson for lesson in lessons}
assert len(by_slug) == len(lessons)
assert [len(group['slugs']) for group in track] == [5, 7, 6, 4]
slugs = [slug for group in track for slug in group['slugs']]
assert len(slugs) == len(set(slugs)) == 22
assert all(slug in by_slug for slug in slugs)
new = [by_slug[slug] for slug in slugs if by_slug[slug].get('arduino')]
assert len(new) == 19
sketches = 0
for group in track:
    for slug in group['slugs']:
        lesson = by_slug[slug]
        assert lesson['analogy'] and lesson['practice'] and lesson['answer']
        ET.parse(root / 'public/iot' / (slug + '.svg'))
        if not lesson.get('arduino'):
            continue
        lab = lesson['arduino']
        assert lab['section'] == group['id']
        assert lesson['stage'] == 6 + 'ABCD'.index(group['id'])
        assert lab['parts'] and lab['wiring'] and lab['result'] and lab['troubleshoot']
        assert all(len(row) == 2 for row in lab['wiring'])
        for block in lab['blocks']:
            assert block['code'] and block['label'] and block['language']
            if block['language'] == 'cpp':
                assert 'void setup()' in block['code'] and 'void loop()' in block['code']
                sketches += 1
            if block['language'] == 'python':
                compile(block['code'], '<receiver-example>', 'exec')
assert sketches == 17
for name in ['arduino-button-wiring', 'arduino-lm35-wiring', 'arduino-i2c-wiring']:
    ET.parse(root / 'public/iot' / (name + '.svg'))
print('PASS: 22 topics (5/7/6/4), 19 Arduino labs, 3 reused foundations, 17 sketches, Python syntax, and valid diagrams.')
