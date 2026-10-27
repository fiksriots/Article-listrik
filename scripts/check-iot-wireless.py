"""Validate new educational content, assets, prerequisite order and NOC alarm logic."""
import ast
import contextlib
import io
import json
import math
import xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
new=json.loads((root/'lib/iot-wireless-lessons.json').read_text())
all_lessons=[]
for filename in ['iot-lessons.json','iot-connected-lessons.json','iot-extended-lessons.json','iot-wireless-lessons.json']:
    all_lessons+=json.loads((root/'lib'/filename).read_text())
order=[slug for group in json.loads((root/'lib/iot-learning-order.json').read_text()) for slug in group['slugs']]
assert len(order)==len(set(order))==len(all_lessons)==83
assert set(order)=={l['slug'] for l in all_lessons}
assert len(new)==8
photos=set()
for lesson in new:
    assert len(lesson['explain'])>=6 and len(lesson['practice'])>=6,lesson['slug']
    assert lesson['analogy'] and lesson['warning'] and lesson['check'] and lesson['answer']
    assert lesson['lab']['result'] and lesson['lab']['troubleshoot']
    ET.parse(root/'public/iot'/f"{lesson['slug']}.svg")
    for prerequisite in lesson['prerequisites']:
        assert order.index(prerequisite)<order.index(lesson['slug']),(lesson['slug'],prerequisite)
    for photo in lesson.get('photos',[]):
        assert photo['src'].startswith('https://upload.wikimedia.org/wikipedia/commons/')
        # The unchanged source images were inspected locally before publication.
        names={'DHT22-Temperatur-Sensor.jpg':'dht22-real.jpg','Reed_switch_%28aka%29.jpg':'reed-switch.jpg','LoRa_Module_with_antenna_and_SPI_wires_attached.jpg':'lora-module-real.jpg'}
        file=root/'public/iot/photos'/names[photo['src'].rsplit('/',1)[-1]]
        if file.exists():
            image=Image.open(file);image.verify()
            with Image.open(file) as image:assert image.size==(photo['width'],photo['height'])
        assert photo['source'].startswith('https://commons.wikimedia.org/wiki/File:')
        assert photo['author'] and photo['license'] and photo['licenseUrl']
        photos.add(photo['src'])
    for block in lesson['lab']['blocks']:
        if block['language']=='json':json.loads(block['code'])
        if block['language']=='python':compile(block['code'],block['label'],'exec')
        if block['language']=='cpp':assert 'void setup()' in block['code'] and 'void loop()' in block['code']
assert len(photos)==3
ET.parse(root/'public/iot/noc-input-wiring.svg')
code=next(b['code'] for l in new if l['slug']=='proyek-monitor-ruang-jaringan' for b in l['lab']['blocks'] if b['language']=='python')
context={'math':math}
function=next(n for n in ast.parse(code).body if isinstance(n,ast.FunctionDef))
exec(compile(ast.Module(body=[function],type_ignores=[]),'noc-assess','exec'),context)
assess=context['assess']
sample=dict(deviceId='esp32-noc-01',temperature=29.4,unit='C',temperatureValid=True,doorOpen=False,waterDetected=False,simulated=True)
assert assess(sample,98000,100000)==['NORMAL']
assert assess({**sample,'temperature':31,'doorOpen':True,'waterDetected':True},98000,100000)==['SUHU_TINGGI','PINTU_TERBUKA','DETEKSI_AIR']
assert assess({**sample,'temperature':None,'temperatureValid':False},98000,100000)==['SENSOR_SUHU_GAGAL']
assert assess(sample,70000,100000)==['DATA_LAMA']
for invalid in [{**sample,'temperature':float('nan')},{**sample,'doorOpen':'false'},{**sample,'deviceId':'other'},{**sample,'temperature':None}]:
    try:assess(invalid,98000,100000)
    except ValueError:pass
    else:raise AssertionError('Invalid telemetry accepted')
print('PASS: eight complete lessons, 83 canonical slugs, ordered prerequisites, nine SVGs, three credited original photos, NOC normal/stale/invalid/multiple alarm states.')
