from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.authentication.urls')),
    path('api/', include('apps.employees.urls')),
    path('api/saas/', include('apps.tenants.urls')),
]
