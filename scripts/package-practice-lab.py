"""Package sources, not local build outputs or virtual environments."""
from pathlib import Path
from zipfile import ZipFile,ZipInfo,ZIP_DEFLATED
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'examples/practice-lab'
TARGET=ROOT/'public/programming/lab/practice/practice-lab.zip'
def source_files():
    excluded={'.venv','__pycache__','.pytest_cache','build','dist','hasil','.git'}
    return sorted(p for p in SOURCE.rglob('*') if p.is_file() and not any(part in excluded or part.endswith('.egg-info') for part in p.relative_to(SOURCE).parts) and p.suffix!='.pyc' and p.name!='.env')
if __name__=='__main__':
    TARGET.parent.mkdir(parents=True,exist_ok=True)
    with ZipFile(TARGET,'w',compression=ZIP_DEFLATED) as archive:
        for p in source_files():
            info=ZipInfo('practice-lab/'+p.relative_to(SOURCE).as_posix(),date_time=(2026,11,4,0,0,0))
            info.compress_type=ZIP_DEFLATED;info.external_attr=0o644<<16
            archive.writestr(info,p.read_bytes())
    print('Packaged',len(source_files()),'source files')
