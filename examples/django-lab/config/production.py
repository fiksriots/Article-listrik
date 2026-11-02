"""Contoh konfigurasi; membutuhkan hosting Python dan storage persisten."""
import os
from pathlib import Path
from django.core.exceptions import ImproperlyConfigured
from .settings import *  # noqa: F403

DEBUG = False
SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
if len(SECRET_KEY) < 50 or SECRET_KEY.startswith('django-insecure-'):
    raise ImproperlyConfigured('Gunakan secret acak produksi minimal 50 karakter.')
ALLOWED_HOSTS = [h.strip() for h in os.environ['DJANGO_ALLOWED_HOSTS'].split(',') if h.strip()]
if not ALLOWED_HOSTS or '*' in ALLOWED_HOSTS:
    raise ImproperlyConfigured('Tentukan host produksi secara eksplisit.')
db_path = Path(os.environ['DJANGO_DB_PATH'])
if not db_path.is_absolute():
    raise ImproperlyConfigured('DJANGO_DB_PATH harus absolut dan berada pada volume persisten.')
DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': db_path}}
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
# Jangan percaya header proxy sebelum proxy tepercaya dikonfigurasi oleh operator.
