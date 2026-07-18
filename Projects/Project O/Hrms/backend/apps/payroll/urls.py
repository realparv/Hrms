from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SalaryStructureViewSet, PayslipViewSet

router = DefaultRouter()
router.register(r'salary-structures', SalaryStructureViewSet, basename='salarystructure')
router.register(r'payslips', PayslipViewSet, basename='payslip')

urlpatterns = [
    path('payroll/', include(router.urls)),
]
