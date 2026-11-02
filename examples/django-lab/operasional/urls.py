from django.urls import path
from . import views

urlpatterns = [
    path('perangkat/', views.PerangkatList.as_view(), name='perangkat-list'),
    path('perangkat/tambah/', views.PerangkatCreate.as_view(), name='perangkat-add'),
    path('perangkat/<int:pk>/ubah/', views.PerangkatUpdate.as_view(), name='perangkat-edit'),
    path('perangkat/<int:pk>/hapus/', views.PerangkatDelete.as_view(), name='perangkat-delete'),
    path('tiket/', views.TiketList.as_view(), name='tiket-list'),
    path('tiket/tambah/', views.TiketCreate.as_view(), name='tiket-add'),
    path('tiket/<int:pk>/ubah/', views.TiketUpdate.as_view(), name='tiket-edit'),
    path('tiket/<int:pk>/selesai/', views.selesaikan_tiket, name='tiket-close'),
]
