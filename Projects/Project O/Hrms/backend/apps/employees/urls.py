from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmployeeViewSet, EmergencyContactViewSet, EducationViewSet,
    ExperienceViewSet, BankDetailViewSet
)

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')

# For nested routing without drf-nested-routers, we explicitly define paths:
emergency_contact_list = EmergencyContactViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
emergency_contact_detail = EmergencyContactViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

education_list = EducationViewSet.as_view({'get': 'list', 'post': 'create'})
education_detail = EducationViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})

experience_list = ExperienceViewSet.as_view({'get': 'list', 'post': 'create'})
experience_detail = ExperienceViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})

bank_detail_list = BankDetailViewSet.as_view({'get': 'list', 'post': 'create'})
bank_detail_detail = BankDetailViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})

urlpatterns = [
    path('', include(router.urls)),
    
    # Nested routes for Employee sub-resources
    path('employees/<uuid:employee_pk>/emergency-contacts/', emergency_contact_list, name='employee-emergency-contact-list'),
    path('employees/<uuid:employee_pk>/emergency-contacts/<uuid:pk>/', emergency_contact_detail, name='employee-emergency-contact-detail'),
    
    path('employees/<uuid:employee_pk>/education/', education_list, name='employee-education-list'),
    path('employees/<uuid:employee_pk>/education/<uuid:pk>/', education_detail, name='employee-education-detail'),
    
    path('employees/<uuid:employee_pk>/experience/', experience_list, name='employee-experience-list'),
    path('employees/<uuid:employee_pk>/experience/<uuid:pk>/', experience_detail, name='employee-experience-detail'),
    
    path('employees/<uuid:employee_pk>/bank-details/', bank_detail_list, name='employee-bank-detail-list'),
    path('employees/<uuid:employee_pk>/bank-details/<uuid:pk>/', bank_detail_detail, name='employee-bank-detail-detail'),
]
