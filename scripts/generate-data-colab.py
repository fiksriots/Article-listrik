"""Build self-contained Colab notebooks from the article examples."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LAB = ROOT / 'examples/data-lab'
TARGET = ROOT / 'examples/colab'


def cell(kind, source):
    result = {'cell_type': kind, 'metadata': {}, 'source': source.splitlines(keepends=True)}
    if kind == 'code':
        result.update(execution_count=None, outputs=[])
    return result


def generate():
    TARGET.mkdir(exist_ok=True)
    support = {p.relative_to(LAB).as_posix(): p.read_text() for p in sorted((LAB / 'datasets').glob('*.csv'))}
    support['da04_kualitas.py'] = (LAB / 'da04_kualitas.py').read_text()
    setup = ('from pathlib import Path\nimport sys\n'
             '# Dataset fiktif dan helper disertakan; tidak perlu mengunduh ZIP.\n'
             f'berkas_latihan = {support!r}\n'
             'for nama, isi in berkas_latihan.items():\n'
             '    tujuan = Path.cwd() / nama\n'
             '    tujuan.parent.mkdir(parents=True, exist_ok=True)\n'
             '    tujuan.write_text(isi, encoding="utf-8")\n'
             'if str(Path.cwd()) not in sys.path:\n'
             '    sys.path.insert(0, str(Path.cwd()))\n'
             'print("Dataset dan helper siap.")\n')
    for track in ['data-analysis', 'data-science']:
        lessons = json.loads((ROOT / f'lib/programming-{track}-lessons.json').read_text())
        for lesson in lessons:
            cells = [cell('markdown', f'# {lesson["title"]}\n\n{lesson["summary"]}\n\n'
                          f'[Baca artikel lengkap](https://article.fikss.site/programming/{lesson["slug"]})\n\n'
                          '## Cara memakai\n1. Masuk ke akun Google jika diminta.\n'
                          '2. Pilih **File → Save a copy in Drive / Simpan salinan di Drive** untuk menyimpan perubahan.\n'
                          '3. Jalankan sel dari atas ke bawah dengan tombol ▶ atau Shift+Enter. CPU sudah cukup.\n'
                          '4. Ubah kode contoh, jalankan ulang, lalu kerjakan latihan.\n\n'
                          'Data seluruhnya fiktif/sintetis. File sesi bersifat sementara; unduh hasil yang ingin disimpan. '
                          'Jika sesi direset, jalankan ulang semua sel. Versi paket Colab dapat membuat hasil numerik sedikit berbeda dari artikel.\n'),
                     cell('markdown', '## 1. Siapkan pustaka\nSel ini memasang paket yang belum tersedia. Jika Colab meminta restart sesi setelah pemasangan, restart lalu jalankan lagi dari atas.\n'),
                     cell('code', '%pip install -q "numpy>=1.26" "pandas>=2.2" "matplotlib>=3.8" "scikit-learn>=1.4" "scipy>=1.15" "openpyxl>=3.1.5"\n'),
                     cell('markdown', '## 2. Siapkan data latihan\nSel ini membuat dua CSV contoh dan helper pembersihan data pada folder sesi.\n'),
                     cell('code', setup)]
            for block in lesson['blocks']:
                cells += [cell('markdown', f'## 3. Contoh: {block["label"]}\nKode berikut sama dengan contoh di artikel. Baris `__file__` menyesuaikan lokasi CSV untuk notebook.\n'),
                          cell('code', f'__file__ = str(Path.cwd() / {block["filename"]!r})\n' + block['code']),
                          cell('markdown', '### Acuan keluaran\n```text\n' + block['output'] + '\n```\n')]
            cells += [cell('markdown', '## 4. Lihat grafik dan hasil\nGrafik yang dibuat contoh ditampilkan di bawah. File CSV/PNG tersedia di panel Files Colab untuk diunduh.\n'),
                      cell('code', 'from IPython.display import display, Image\n'
                           'folder_hasil = Path("hasil-latihan")\n'
                           'if folder_hasil.exists():\n'
                           '    for hasil in sorted(folder_hasil.iterdir()):\n'
                           '        if hasil.is_file():\n'
                           '            print(hasil)\n'
                           '            if hasil.suffix.lower() == ".png":\n'
                           '                display(Image(filename=str(hasil)))\n'),
                      cell('markdown', '## 5. Coba sendiri\n' + '\n'.join(f'{i+1}. {task}' for i, task in enumerate(lesson['practice']))),
                      cell('code', '# Tulis percobaan dan jawabanmu di sini.\n'),
                      cell('markdown', f'## Cek pemahaman\n{lesson["check"]}\n\n'
                           f'Kembali ke artikel untuk tes pemahaman dan pembahasan.\n\n**Perhatikan:** {lesson["warning"]}\n')]
            notebook = {'cells': cells, 'metadata': {'colab': {'name': lesson['slug'] + '.ipynb'},
                        'kernelspec': {'display_name': 'Python 3', 'name': 'python3'},
                        'language_info': {'name': 'python'}}, 'nbformat': 4, 'nbformat_minor': 5}
            for i, item in enumerate(cells):
                item['id'] = f'cell-{i:02d}'
            (TARGET / (lesson['slug'] + '.ipynb')).write_text(json.dumps(notebook, ensure_ascii=False, indent=1) + '\n')
    print('Generated 40 self-contained Colab notebooks')


if __name__ == '__main__':
    generate()
