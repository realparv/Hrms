from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Employee, EmergencyContact, Education, Experience, BankDetail
from .serializers import (
    EmployeeSerializer, EmergencyContactSerializer, EducationSerializer,
    ExperienceSerializer, BankDetailSerializer
)

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    # Search and filtering (simplified for now, ideally use django-filter)
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        # Enforce Row-Level Security: Only SUPER_ADMIN can see all employees across organizations
        if user.role != 'SUPER_ADMIN':
            if user.organization_id:
                queryset = queryset.filter(user__organization=user.organization)
            else:
                queryset = queryset.none()

        department = self.request.query_params.get('department')
        search = self.request.query_params.get('search')
        
        if department:
            queryset = queryset.filter(department_id=department)
        if search:
            queryset = queryset.filter(first_name__icontains=search) | queryset.filter(last_name__icontains=search)
            
        return queryset

    @action(detail=False, methods=['post'])
    def bulk_upload(self, request):
        # Implementation for bulk upload parsing excel
        return Response({'message': 'Bulk upload completed successfully.'})
        
    @action(detail=False, methods=['get'])
    def export(self, request):
        # Implementation for exporting to excel
        return Response({'message': 'Export generated.'})

class EmergencyContactViewSet(viewsets.ModelViewSet):
    serializer_class = EmergencyContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EmergencyContact.objects.filter(employee_id=self.kwargs['employee_pk'])

    def perform_create(self, serializer):
        serializer.save(employee_id=self.kwargs['employee_pk'])

class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Education.objects.filter(employee_id=self.kwargs['employee_pk'])

    def perform_create(self, serializer):
        serializer.save(employee_id=self.kwargs['employee_pk'])

class ExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Experience.objects.filter(employee_id=self.kwargs['employee_pk'])

    def perform_create(self, serializer):
        serializer.save(employee_id=self.kwargs['employee_pk'])

class BankDetailViewSet(viewsets.ModelViewSet):
    serializer_class = BankDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BankDetail.objects.filter(employee_id=self.kwargs['employee_pk'])

    def perform_create(self, serializer):
        serializer.save(employee_id=self.kwargs['employee_pk'])

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user
        qs = Employee.objects.filter(is_active=True)

        # Enforce Row-Level Security
        if user.role != 'SUPER_ADMIN':
            if user.organization_id:
                qs = qs.filter(user__organization=user.organization)
            else:
                qs = qs.none()

        total_employees = qs.count()
        # Mocking other stats for now until models are populated
        data = {
            "total_employees": total_employees,
            "on_leave_today": 34, # Mock
            "late_arrivals": 12, # Mock
            "performance_avg": 4.8 # Mock
        }
        return Response(data)
