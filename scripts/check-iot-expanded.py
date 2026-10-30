"""Check expanded curriculum and exercise tutorial logic without hardware/cloud access."""
import ast
import contextlib
import io
import json
import math
import re
import subprocess
import time
import xml.etree.ElementTree as ET
from pathlib import Path
root = Path(__file__).resolve().parents[1]
extra = json.loads((root/'lib/iot-extended-lessons.json').read_text())
base = json.loads((root/'lib/iot-lessons.json').read_text()) + json.loads((root/'lib/iot-connected-lessons.json').read_text())
groups = json.loads((root/'lib/iot-learning-order.json').read_text())
wireless = json.loads((root/'lib/iot-wireless-lessons.json').read_text())
all_slugs = [l['slug'] for l in base+extra+wireless+json.loads((root/'lib/iot-platformio-lessons.json').read_text())]
ordered = [s for g in groups for s in g['slugs']]
assert len(extra) == 28 and len(groups) == 15
assert len(ordered) == len(set(ordered)) == len(all_slugs) == 84
assert set(ordered) == set(all_slugs)
assert len({g['id'] for g in groups}) == len(groups)
for g in groups:
    assert g['before'] and g['goal'] and g['kind'] and g['slugs']
for lesson in extra:
    assert len(lesson['explain']) >= 4 and len(lesson['practice']) >= 4, lesson['slug']
    assert all(lesson[k] for k in ['analogy','warning','check','answer'])
    assert len(lesson['nodes']) == 5
    ET.parse(root/'public/iot'/f"{lesson['slug']}.svg")
    for block in lesson.get('lab',{}).get('blocks',[]):
        if block['language'] == 'python': compile(block['code'],block['label'],'exec')
        if block['language'] == 'json': json.loads(block['code'])
        if block['language'] == 'javascript':
            subprocess.run(['node','--input-type=module','--check'],input=block['code'],text=True,check=True,capture_output=True)
# Local-only examples are executed as published, not duplicated test implementations.
for slug,expected in [('kalibrasi-sensor','26.0'),('filter-validasi-sensor','INVALID'),('watchdog-pemulihan','detik 8'),('mqtt-idempotensi','1'),('rs485-modbus','2301'),('notifikasi-alarm-iot','DATA_LAMA'),('kendali-dua-arah','DITOLAK')]:
    code=next(b['code'] for l in extra if l['slug']==slug for b in l['lab']['blocks'] if b['language']=='python')
    output=io.StringIO()
    with contextlib.redirect_stdout(output): exec(compile(code,slug,'exec'),{})
    assert expected in output.getvalue(),(slug,output.getvalue())
command_code=next(b['code'] for l in extra if l['slug']=='kendali-dua-arah' for b in l['lab']['blocks'] if b['language']=='python')
context={}; exec(compile(ast.Module(body=[n for n in ast.parse(command_code).body if isinstance(n,ast.FunctionDef)],type_ignores=[]),'command','exec'),context)
command={'requestId':'request-1','deviceId':'esp32-01','action':'SET_ON','issuedAt':100000,'expiresAt':120000}
assert context['validate_command'](command,110000)=='SET_ON'
for invalid in [{**command,'deviceId':'other'},{**command,'action':'TOGGLE'},{**command,'issuedAt':True},{**command,'expiresAt':200000}]:
    try: context['validate_command'](invalid,110000)
    except ValueError: pass
    else: raise AssertionError('Invalid command accepted')
# Model only the SDK boundary; test the actual save_event function against duplicates/backlog.
history_code=next(b['code'] for l in extra if l['slug']=='firebase-riwayat-grafik' for b in l['lab']['blocks'] if b['language']=='python')
state={}; ticks=[int(time.time()*1000)]
class Reference:
    def __init__(self,path): self.path=path
    def child(self,key): return Reference(self.path+'/'+key)
    def transaction(self,callback):
        value=callback(state.get(self.path))
        def resolve(obj):
            if obj=={'.sv':'timestamp'}: ticks[0]+=1;return ticks[0]
            if isinstance(obj,dict): return {k:resolve(v) for k,v in obj.items()}
            return obj
        state[self.path]=resolve(value)
        return state[self.path]
class DB:
    @staticmethod
    def reference(path): return Reference(path)
context={'db':DB,'math':math,'re':re,'time':time}
functions=[n for n in ast.parse(history_code).body if isinstance(n,ast.FunctionDef)]
exec(compile(ast.Module(body=functions,type_ignores=[]),'history','exec'),context)
now=int(time.time()*1000)
event={'messageId':'a'*32,'deviceId':'esp32-01','temperature':29.4,'unit':'C','simulated':True,'measuredAt':now-1000}
context['save_event'](event)
first=state['devices/esp32-01/latest'].copy()
context['save_event'](event)
assert state['devices/esp32-01/latest']==first
context['save_event']({**event,'messageId':'b'*32,'measuredAt':now-10000})
assert state['devices/esp32-01/latest']==first
assert len([key for key in state if '/history/' in key])==2
try: context['save_event']({**event,'temperature':30})
except ValueError: pass
else: raise AssertionError('Same ID with different content accepted')
for older,newer in [('pemrograman-variabel','arduino-led'),('timer-millis','esp32-mqtt'),('mqtt-idempotensi','firebase-riwayat-grafik'),('komunikasi-uart','rs485-modbus'),('notifikasi-alarm-iot','proyek-monitor-kipas-dc')]:
    assert ordered.index(older)<ordered.index(newer),(older,newer)
print('PASS: 28 expanded lessons / 15 groups / 84 canonical slugs; diagrams and syntax; local examples; command validation; history duplicates and backlog. Firebase SDK boundary mocked.')
