from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path
from operasional.views import home

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('akun/login/', auth_views.LoginView.as_view(), name='login'),
    path('akun/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('', include('operasional.urls')),
]
