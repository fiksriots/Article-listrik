"""Create a deterministic source archive without runtime files or dependencies."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'examples/advanced-programming-lab'
TARGET=ROOT/'public/programming/lab/advanced/advanced-programming-lab.zip'
EXCLUDE={'.venv','__pycache__','node_modules','.mypy_cache','test-results','playwright-report','hasil-latihan'}
def source_files():
    return sorted(p for p in SOURCE.rglob('*') if p.is_file() and not EXCLUDE.intersection(p.relative_to(SOURCE).parts) and p.suffix!='.pyc')
if __name__=='__main__':
    TARGET.parent.mkdir(parents=True,exist_ok=True)
    with ZipFile(TARGET,'w',compression=ZIP_DEFLATED) as archive:
        for p in source_files():
            info=ZipInfo('advanced-programming-lab/'+p.relative_to(SOURCE).as_posix(),date_time=(2026,11,4,0,0,0))
            info.compress_type=ZIP_DEFLATED;info.external_attr=0o644<<16
            archive.writestr(info,p.read_bytes())
    print(f'Packaged {len(source_files())} advanced source files')
