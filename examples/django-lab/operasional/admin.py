from django.contrib import admin
from .models import Perangkat, Tiket


@admin.register(Perangkat)
class PerangkatAdmin(admin.ModelAdmin):
    list_display = ['kode', 'nama', 'lokasi', 'aktif']
    search_fields = ['kode', 'nama', 'lokasi']
    list_filter = ['aktif']


@admin.register(Tiket)
class TiketAdmin(admin.ModelAdmin):
    list_display = ['judul', 'pemilik', 'status', 'dibuat']
    list_filter = ['status']
    search_fields = ['judul']
    readonly_fields = ['dibuat']
