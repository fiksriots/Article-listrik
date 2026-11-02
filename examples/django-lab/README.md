# Lab Django · inventaris dan tiket

Materi: https://article.fikss.site/programming/django
Acuan: Python 3.12 dan Django 5.2 LTS. Gunakan patch terbaru seri 5.2.
Aplikasi latihan lokal, terpisah dari akun dan progres situs belajar.

## Mulai dari folder ini

```sh
python -m venv .venv
```

macOS/Linux: `source .venv/bin/activate`.
Windows PowerShell: `.venv\Scripts\Activate.ps1`.
Jika aktivasi dibatasi, pakai `.venv\Scripts\python.exe` sebagai pengganti `python`; tidak perlu mengubah kebijakan sistem.

```sh
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py check
python manage.py test
python manage.py runserver 127.0.0.1:8000
```

Buka http://127.0.0.1:8000/ ; Ctrl+C untuk menghentikan server.
Buat password sendiri melalui prompt; tidak ada akun bawaan.

## Dua studi kasus

- Inventaris: `/perangkat/` mempunyai pencarian, pagination, tambah, ubah, serta hapus dengan konfirmasi. Superuser dapat mencoba semua tindakan. Untuk uji izin, buat user biasa pada `/admin/` dan berikan permission `view/add/change/delete perangkat` melalui group. User biasa login melalui `/akun/login/`. `is_staff` hanya diperlukan untuk masuk admin, bukan halaman inventaris biasa.
- Tiket: `/tiket/` hanya menampilkan tiket pemilik akun yang sedang masuk. Coba dua user pada dua profil browser: akses ID tiket pengguna lain menghasilkan 404. Superuser melalui Django Admin dapat mengelola data lintas pengguna; jangan bagikan akun ini.

Logout memakai POST dan CSRF. GET halaman hapus hanya mengonfirmasi; POST menghapus data latihan.

## Struktur

- `config/`: settings, URL utama, WSGI.
- `operasional/`: model, ModelForm, view, URL, admin, migration, dan 32 pengujian.
- `templates/`: HTML server-side; autoescape tetap aktif.
- `static/`: CSS melalui template tag static.

Blok di artikel adalah kutipan file proyek ini. Baca nama file dan petunjuk; jangan menempel semua blok ke satu file Python.

## Migrasi

SQLite db.sqlite3 dibuat oleh migrate dan tidak disertakan unduhan. Migration awal disertakan. Setelah mengubah model:

```sh
python manage.py makemigrations operasional
python manage.py migrate
python manage.py showmigrations operasional
```

Jangan menghapus database/migration untuk memperbaiki data penting. Backup sebelum perubahan skema. TestCase menggunakan database uji sementara; jangan arahkan test ke database produksi.

## Batas produksi

config.settings HANYA lokal: DEBUG aktif dan secret publik latihan.
config.production membaca DJANGO_SECRET_KEY, DJANGO_ALLOWED_HOSTS, serta DJANGO_DB_PATH dari environment hosting. Jangan menaruh secret asli dalam Git. DB_PATH harus absolut pada volume persisten yang disiapkan operator. Contoh memakai SQLite untuk satu instance kecil; pertimbangkan PostgreSQL dan driver sesuai dokumentasi untuk kebutuhan konkurensi lebih besar.

Siapkan hosting Python WSGI/ASGI, storage persisten, backup/restore, HTTPS, penyajian staticfiles, pembatasan percobaan login di aplikasi/proxy, log tanpa rahasia, pemantauan, serta prosedur migrasi/rollback. Hardening login publik lengkap belum disediakan oleh lab.

Setelah environment produksi disiapkan:

```sh
python manage.py check --deploy --settings=config.production
python manage.py collectstatic --noinput --settings=config.production
```

Migration produksi adalah langkah rilis terencana dengan backup; bukan dijalankan per request. Gunakan server WSGI/ASGI produksi, bukan runserver. Jangan percaya header proxy sebelum proxy tepercaya dikonfigurasi sesuai hosting. HSTS subdomain/preload sengaja tidak diaktifkan; seluruh domain harus siap lebih dahulu.

Dokumentasi: https://docs.djangoproject.com/en/5.2/

## Pendalaman

Pada database latihan lokal, `python manage.py seed_perangkat --latihan` menambah dua perangkat DEMO bila belum ada. Perintah ulang tidak menduplikasi atau menimpa data lama. Perintah menolak DEBUG=False dan tidak membuat akun. Selalu periksa target database; DEBUG=True sendiri tidak membuktikan isinya aman untuk latihan.

`operasional/test_pendalaman.py` membandingkan N+1 dengan select_related, memeriksa prefetch_related, dan memastikan optimasi tidak menghilangkan filter pemilik.
