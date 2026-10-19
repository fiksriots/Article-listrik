"""Validate tutorial coverage and reject malformed or misrouted MQTT telemetry."""
import ast
import json
import math
import xml.etree.ElementTree as ET
from pathlib import Path

root = Path(__file__).resolve().parents[1]
lessons = json.loads((root / 'lib/iot-connected-lessons.json').read_text())
order = [slug for group in json.loads((root / 'lib/iot-learning-order.json').read_text()) for slug in group['slugs']]
assert [lesson['slug'] for lesson in lessons] == ['mqtt-broker-lokal', 'esp32-mqtt', 'mqtt-firebase', 'firebase-dashboard']
assert order.index('mqtt-topic') < order.index('mqtt-broker-lokal') < order.index('esp32-mqtt') < order.index('mqtt-firebase') < order.index('firebase-dashboard')
for lesson in lessons:
    assert lesson['practice'] and lesson['lab']['result'] and lesson['lab']['troubleshoot']
    ET.parse(root / 'public/iot' / (lesson['slug'] + '.svg'))
    for block in lesson['lab']['blocks']:
        if block['language'] == 'json':
            json.loads(block['code'])
        if block['language'] == 'python':
            compile(block['code'], block['label'], 'exec')
bridge = next(b['code'] for l in lessons for b in l['lab']['blocks'] if b['language'] == 'python')
# Execute the actual tutorial validator without installing cloud dependencies.
parsed = ast.parse(bridge)
function = next(node for node in parsed.body if isinstance(node, ast.FunctionDef) and node.name == 'parse_telemetry')
context = {'json': json, 'math': math}
exec(compile(ast.Module(body=[function], type_ignores=[]), '<tutorial-validator>', 'exec'), context)
validate = context['parse_telemetry']
valid = {'deviceId': 'esp32-01', 'temperature': 29.4, 'unit': 'C', 'simulated': True}
assert validate(json.dumps(valid).encode()) == valid
assert validate(json.dumps({**valid, 'injectedPath': '/other'}).encode()) == valid
for temperature in [-40, 125, 0]:
    assert validate(json.dumps({**valid, 'temperature': temperature}).encode())['temperature'] == temperature
invalid = [b'not-json', b'\xff', b'[]', b'null', b'{}', b'x' * 513]
invalid += [json.dumps({**valid, 'temperature': value}).encode() for value in [True, '29.4', None, -41, 126, float('nan'), float('inf')]]
invalid += [json.dumps({**valid, 'deviceId': '../other'}).encode(), json.dumps({**valid, 'unit': 'F'}).encode(), json.dumps({**valid, 'simulated': 'true'}).encode()]
for payload in invalid:
    try:
        validate(payload)
    except (ValueError, UnicodeError, OverflowError, RecursionError):
        pass
    else:
        raise AssertionError(f'Invalid payload accepted: {payload!r}')
print(f'PASS: four ordered labs, diagrams, JSON/Python syntax, valid boundary temperatures, and {len(invalid)} rejected payloads.')
