from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views.decorators.http import require_POST
from django.views.generic import CreateView, DeleteView, ListView, UpdateView
from .forms import PerangkatForm, TiketForm
from .models import Perangkat, Tiket


def home(request):
    return HttpResponse('Halo, Django! Buka /tiket/ atau /perangkat/ untuk latihan.')


class PerangkatList(LoginRequiredMixin, PermissionRequiredMixin, ListView):
    model = Perangkat
    permission_required = 'operasional.view_perangkat'
    template_name = 'operasional/perangkat_list.html'
    paginate_by = 20

    def get_queryset(self):
        query = self.request.GET.get('q', '').strip()[:100]
        return super().get_queryset().filter(nama__icontains=query)


class PerangkatCreate(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Perangkat
    form_class = PerangkatForm
    permission_required = 'operasional.add_perangkat'
    template_name = 'operasional/form.html'
    success_url = reverse_lazy('perangkat-list')


class PerangkatUpdate(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Perangkat
    form_class = PerangkatForm
    permission_required = 'operasional.change_perangkat'
    template_name = 'operasional/form.html'
    success_url = reverse_lazy('perangkat-list')


class PerangkatDelete(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Perangkat
    permission_required = 'operasional.delete_perangkat'
    template_name = 'operasional/konfirmasi_hapus.html'
    success_url = reverse_lazy('perangkat-list')


class TiketMilikSaya(LoginRequiredMixin):
    model = Tiket

    def get_queryset(self):
        return super().get_queryset().filter(pemilik=self.request.user)


class TiketList(TiketMilikSaya, ListView):
    template_name = 'operasional/tiket_list.html'
    paginate_by = 20


class TiketCreate(LoginRequiredMixin, CreateView):
    model = Tiket
    form_class = TiketForm
    template_name = 'operasional/form.html'
    success_url = reverse_lazy('tiket-list')

    def form_valid(self, form):
        form.instance.pemilik = self.request.user
        return super().form_valid(form)


class TiketUpdate(TiketMilikSaya, UpdateView):
    form_class = TiketForm
    template_name = 'operasional/form.html'
    success_url = reverse_lazy('tiket-list')


@login_required
@require_POST
def selesaikan_tiket(request, pk):
    with transaction.atomic():
        tiket = get_object_or_404(Tiket, pk=pk, pemilik=request.user)
        Tiket.objects.filter(pk=tiket.pk, status=Tiket.Status.TERBUKA).update(status=Tiket.Status.SELESAI)
    return redirect('tiket-list')
