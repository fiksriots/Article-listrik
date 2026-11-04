import json
from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory

with TemporaryDirectory() as work:
    root=Path(work);source=root/'input.csv'
    source.write_text('layanan,hasil\na,ok\nb,timeout\n',encoding='utf-8')
    db=root/'belum-dibuat'/'laporan.sqlite';output=root/'belum-dibuat'/'hasil.json'
    command=[sys.executable,'-m','praktik_layanan.cli','build-report',
             '--input',str(source),'--db',str(db),'--output',str(output),'--dry-run']
    result=subprocess.run(command,capture_output=True,text=True,timeout=5,check=True)
    data=json.loads(result.stdout)
    print('Exit code:',result.returncode)
    print('Mode dry-run:',data['dry_run'])
    print('Total rencana:',data['ringkasan']['total'])
    print('Folder keluaran dibuat:',output.parent.exists())
