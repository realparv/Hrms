from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, SessionViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'sessions', SessionViewSet, basename='session')

urlpatterns = [
    path('', include(router.urls)),
]
