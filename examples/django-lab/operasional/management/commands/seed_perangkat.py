from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from operasional.models import Perangkat


class Command(BaseCommand):
    help = 'Membuat dua perangkat DEMO pada database latihan lokal; tidak menimpa data.'

    def add_arguments(self, parser):
        parser.add_argument('--latihan', action='store_true', help='Konfirmasi target database latihan.')

    def handle(self, *args, **options):
        if not settings.DEBUG or not options['latihan']:
            raise CommandError('Hanya DEBUG lokal dengan --latihan pada database latihan.')
        dibuat = 0
        with transaction.atomic():
            for kode, nama in [('DEMO-001', 'Router latihan'), ('DEMO-002', 'Switch latihan')]:
                _, baru = Perangkat.objects.get_or_create(
                    kode=kode, defaults={'nama': nama, 'lokasi': 'Lab', 'aktif': True})
                dibuat += int(baru)
        self.stdout.write(f'Dibuat: {dibuat}; data lama tidak ditimpa.')
