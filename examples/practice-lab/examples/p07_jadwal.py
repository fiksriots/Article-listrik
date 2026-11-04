from contextlib import closing
from datetime import datetime,timedelta,timezone
import sqlite3
from praktik_layanan.store import siapkan,catat_job
sekarang=datetime(2026,11,4,9,tzinfo=timezone.utc)
berikut=sekarang.replace(hour=8,minute=0,second=0,microsecond=0)
if berikut<=sekarang:berikut+=timedelta(days=1)
print('Jadwal berikut UTC:',berikut.isoformat())
with closing(sqlite3.connect(':memory:')) as conn:
    siapkan(conn)
    print('Catatan pertama:',catat_job(conn,'laporan-2026-11-04',{'total':4}))
    print('Ulangan payload sama:',catat_job(conn,'laporan-2026-11-04',{'total':4}))
# Ini perhitungan jadwal dan ledger, belum menjalankan daemon scheduler.
