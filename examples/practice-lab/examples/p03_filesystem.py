from pathlib import Path
from tempfile import TemporaryDirectory
with TemporaryDirectory() as work:
    folder=Path(work)/'hasil';folder.mkdir()
    file=folder/'laporan.txt';file.write_text('data fiktif\n',encoding='utf-8')
    print('Nama:',file.name)
    print('Isi:',file.read_text(encoding='utf-8').strip())
    print('Dalam folder latihan:',file.resolve().is_relative_to(Path(work).resolve()))
