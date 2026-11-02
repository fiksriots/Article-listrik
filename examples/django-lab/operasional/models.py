from django.conf import settings
from django.db import models


class Perangkat(models.Model):
    kode = models.CharField(max_length=30, unique=True)
    nama = models.CharField(max_length=100)
    lokasi = models.CharField(max_length=100)
    aktif = models.BooleanField(default=True)

    class Meta:
        ordering = ['kode']

    def __str__(self):
        return f'{self.kode} - {self.nama}'


class Tiket(models.Model):
    class Status(models.TextChoices):
        TERBUKA = 'terbuka', 'Terbuka'
        SELESAI = 'selesai', 'Selesai'

    pemilik = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    judul = models.CharField(max_length=120)
    deskripsi = models.TextField(max_length=2000)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.TERBUKA)
    dibuat = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-dibuat', '-pk']

    def __str__(self):
        return self.judul
