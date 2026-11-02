from django import forms
from .models import Perangkat, Tiket


class PerangkatForm(forms.ModelForm):
    class Meta:
        model = Perangkat
        fields = ['kode', 'nama', 'lokasi', 'aktif']

    def clean_kode(self):
        return self.cleaned_data['kode'].upper()


class TiketForm(forms.ModelForm):
    class Meta:
        model = Tiket
        fields = ['judul', 'deskripsi']  # Pemilik dan status ditentukan server.
