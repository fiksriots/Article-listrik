import csv
import json
import os
from pathlib import Path
import tempfile
from .core import ringkas

def baca_csv(path, max_rows=1000):
    if type(max_rows) is not int or not 1 <= max_rows <= 10000:
        raise ValueError('Batas baris tidak sesuai.')
    accepted, rejected = [], []
    with Path(path).open(newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        if reader.fieldnames != ['layanan', 'hasil']:
            raise ValueError('Header CSV wajib layanan,hasil dalam urutan itu.')
        for index, row in enumerate(reader, 2):
            if index-1 > max_rows:
                raise ValueError('Jumlah baris melebihi batas.')
            try:
                if None in row or any(v is None for v in row.values()):
                    raise ValueError('Jumlah kolom tidak sesuai.')
                cleaned = {k: v.strip() for k,v in row.items()}
                ringkas([cleaned])
            except ValueError:
                rejected.append(index)
            else:
                accepted.append(cleaned)
    return accepted, rejected

def tulis_json(path, summary):
    """Ganti satu file keluaran secara atomik pada filesystem yang sama."""
    target = Path(path)
    payload = json.dumps(summary, ensure_ascii=False, allow_nan=False, sort_keys=True, indent=2)+'\n'
    target.parent.mkdir(parents=True, exist_ok=True)
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=target.parent, delete=False) as file:
            temp_path = Path(file.name)
            file.write(payload)
        os.replace(temp_path, target)
    finally:
        if temp_path is not None:
            temp_path.unlink(missing_ok=True)
