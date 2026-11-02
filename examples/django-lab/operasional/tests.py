from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.test import Client, TestCase
from django.urls import reverse
from .forms import PerangkatForm, TiketForm
from .models import Perangkat, Tiket


class AlurLabTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        User = get_user_model()
        cls.ani = User.objects.create_user('ani', password='HanyaUntukTest-123!')
        cls.budi = User.objects.create_user('budi', password='HanyaUntukTest-456!')
        cls.perangkat = Perangkat.objects.create(kode='RTR-01', nama='Router lab', lokasi='Meja A')
        cls.tiket = Tiket.objects.create(pemilik=cls.ani, judul='Link lab putus', deskripsi='Periksa kabel latihan.')

    def grant(self, *names):
        self.ani.user_permissions.add(*Permission.objects.filter(content_type__app_label='operasional', codename__in=names))
        self.client.force_login(self.ani)

    def test_home(self):
        self.assertContains(self.client.get('/'), 'Halo, Django!')

    def test_anonymous_redirect(self):
        r = self.client.get(reverse('tiket-list'))
        self.assertEqual(r.status_code, 302)
        self.assertIn('/akun/login/', r.url)

    def test_wrong_password(self):
        r = self.client.post(reverse('login'), {'username': 'ani', 'password': 'salah'})
        self.assertEqual(r.status_code, 200)
        self.assertNotIn('_auth_user_id', self.client.session)

    def test_login_rejects_external_redirect(self):
        r = self.client.post(reverse('login'), {'username': 'ani', 'password': 'HanyaUntukTest-123!', 'next': 'https://example.com/'})
        self.assertRedirects(r, reverse('tiket-list'))

    def test_inventory_permission(self):
        self.client.force_login(self.ani)
        self.assertEqual(self.client.get(reverse('perangkat-list')).status_code, 403)

    def test_inventory_search(self):
        self.grant('view_perangkat')
        self.assertContains(self.client.get(reverse('perangkat-list'), {'q': 'Router'}), 'RTR-01')
        self.assertNotContains(self.client.get(reverse('perangkat-list'), {'q': 'tidak-ada'}), 'RTR-01')

    def test_add_requires_permission(self):
        self.client.force_login(self.ani)
        r = self.client.post(reverse('perangkat-add'), {'kode': 'SW-01', 'nama': 'Switch', 'lokasi': 'Lab'})
        self.assertEqual(r.status_code, 403)
        self.assertEqual(Perangkat.objects.count(), 1)

    def test_valid_create(self):
        self.grant('add_perangkat', 'view_perangkat')
        r = self.client.post(reverse('perangkat-add'), {'kode': 'sw-01', 'nama': 'Switch', 'lokasi': 'Lab', 'aktif': 'on'})
        self.assertRedirects(r, reverse('perangkat-list'))
        self.assertTrue(Perangkat.objects.filter(kode='SW-01').exists())

    def test_duplicate_code(self):
        f = PerangkatForm(data={'kode': 'rtr-01', 'nama': 'Duplikat', 'lokasi': 'Lab'})
        self.assertFalse(f.is_valid())
        self.assertIn('kode', f.errors)

    def test_whitespace_title(self):
        f = TiketForm(data={'judul': '   ', 'deskripsi': 'Isi'})
        self.assertFalse(f.is_valid())
        self.assertIn('judul', f.errors)

    def test_inventory_update(self):
        self.grant('change_perangkat', 'view_perangkat')
        r = self.client.post(reverse('perangkat-edit', args=[self.perangkat.pk]), {'kode': 'RTR-01', 'nama': 'Router baru', 'lokasi': 'Lab'})
        self.assertRedirects(r, reverse('perangkat-list'))
        self.perangkat.refresh_from_db()
        self.assertEqual(self.perangkat.nama, 'Router baru')

    def test_get_delete_only_confirms(self):
        self.grant('delete_perangkat')
        self.assertContains(self.client.get(reverse('perangkat-delete', args=[self.perangkat.pk])), 'Konfirmasi hapus')
        self.assertTrue(Perangkat.objects.filter(pk=self.perangkat.pk).exists())

    def test_delete_requires_permission(self):
        self.client.force_login(self.ani)
        self.assertEqual(self.client.post(reverse('perangkat-delete', args=[self.perangkat.pk])).status_code, 403)
        self.assertTrue(Perangkat.objects.filter(pk=self.perangkat.pk).exists())

    def test_delete_post(self):
        self.grant('delete_perangkat', 'view_perangkat')
        self.assertRedirects(self.client.post(reverse('perangkat-delete', args=[self.perangkat.pk])), reverse('perangkat-list'))
        self.assertFalse(Perangkat.objects.filter(pk=self.perangkat.pk).exists())

    def test_ticket_list_private(self):
        self.client.force_login(self.budi)
        self.assertNotContains(self.client.get(reverse('tiket-list')), 'Link lab putus')

    def test_other_owner_cannot_edit(self):
        self.client.force_login(self.budi)
        url = reverse('tiket-edit', args=[self.tiket.pk])
        self.assertEqual(self.client.get(url).status_code, 404)
        self.assertEqual(self.client.post(url, {'judul': 'Diubah', 'deskripsi': 'Uji'}).status_code, 404)
        self.tiket.refresh_from_db()
        self.assertEqual(self.tiket.judul, 'Link lab putus')

    def test_server_assigns_owner(self):
        self.client.force_login(self.ani)
        r = self.client.post(reverse('tiket-add'), {'judul': 'Baru', 'deskripsi': 'Uji', 'pemilik': self.budi.pk, 'status': 'selesai'})
        self.assertRedirects(r, reverse('tiket-list'))
        t = Tiket.objects.get(judul='Baru')
        self.assertEqual(t.pemilik_id, self.ani.pk)
        self.assertEqual(t.status, Tiket.Status.TERBUKA)

    def test_owner_edit(self):
        self.client.force_login(self.ani)
        r = self.client.post(reverse('tiket-edit', args=[self.tiket.pk]), {'judul': 'Judul diperbaiki', 'deskripsi': 'Catatan'})
        self.assertRedirects(r, reverse('tiket-list'))
        self.tiket.refresh_from_db()
        self.assertEqual(self.tiket.judul, 'Judul diperbaiki')

    def test_close_post_only(self):
        self.client.force_login(self.ani)
        self.assertEqual(self.client.get(reverse('tiket-close', args=[self.tiket.pk])).status_code, 405)
        self.tiket.refresh_from_db()
        self.assertEqual(self.tiket.status, Tiket.Status.TERBUKA)

    def test_close_owner_only(self):
        self.client.force_login(self.budi)
        self.assertEqual(self.client.post(reverse('tiket-close', args=[self.tiket.pk])).status_code, 404)
        self.tiket.refresh_from_db()
        self.assertEqual(self.tiket.status, Tiket.Status.TERBUKA)

    def test_close_repeated(self):
        self.client.force_login(self.ani)
        url = reverse('tiket-close', args=[self.tiket.pk])
        self.assertRedirects(self.client.post(url), reverse('tiket-list'))
        self.assertRedirects(self.client.post(url), reverse('tiket-list'))
        self.tiket.refresh_from_db()
        self.assertEqual(self.tiket.status, Tiket.Status.SELESAI)

    def test_csrf_enforced(self):
        c = Client(enforce_csrf_checks=True)
        c.force_login(self.ani)
        self.assertEqual(c.post(reverse('tiket-add'), {'judul': 'Tanpa token', 'deskripsi': 'Uji'}).status_code, 403)
        c.get(reverse('tiket-add'))
        token = c.cookies['csrftoken'].value
        r = c.post(reverse('tiket-add'), {'judul': 'Dengan token', 'deskripsi': 'Uji', 'csrfmiddlewaretoken': token})
        self.assertEqual(r.status_code, 302)

    def test_template_escapes(self):
        self.client.force_login(self.ani)
        self.tiket.judul = '<script>alert(1)</script>'
        self.tiket.save()
        r = self.client.get(reverse('tiket-list'))
        self.assertContains(r, '&lt;script&gt;alert(1)&lt;/script&gt;')
        self.assertNotContains(r, '<script>alert(1)</script>')

    def test_logout_post_only(self):
        self.client.force_login(self.ani)
        self.assertEqual(self.client.get(reverse('logout')).status_code, 405)
        self.assertRedirects(self.client.post(reverse('logout')), reverse('home'))
        self.assertNotIn('_auth_user_id', self.client.session)

    def test_pagination(self):
        self.grant('view_perangkat')
        Perangkat.objects.bulk_create([Perangkat(kode=f'SW-{i:03}', nama='Switch', lokasi='Lab') for i in range(25)])
        r = self.client.get(reverse('perangkat-list'))
        self.assertEqual(len(r.context['object_list']), 20)
        self.assertTrue(r.context['is_paginated'])
