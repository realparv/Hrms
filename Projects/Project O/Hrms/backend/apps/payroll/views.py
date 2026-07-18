from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import date
from django.db import transaction

from .models import SalaryStructure, Payslip
from .serializers import SalaryStructureSerializer, PayslipSerializer
from apps.employees.models import Employee

class SalaryStructureViewSet(viewsets.ModelViewSet):
    serializer_class = SalaryStructureSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = SalaryStructure.objects.all()

        if user.role != 'SUPER_ADMIN':
            if user.organization_id:
                qs = qs.filter(employee__user__organization=user.organization)
            else:
                return qs.none()

        if user.role == 'EMPLOYEE':
            # Employees can only see their own salary structure
            return qs.filter(employee__user=user)
            
        return qs


class PayslipViewSet(viewsets.ModelViewSet):
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Payslip.objects.all()

        if user.role != 'SUPER_ADMIN':
            if user.organization_id:
                qs = qs.filter(employee__user__organization=user.organization)
            else:
                return qs.none()

        if user.role == 'EMPLOYEE':
            # Employees can only see their own payslips
            return qs.filter(employee__user=user)
            
        # Admin filtering
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        
        if month:
            qs = qs.filter(month=month)
        if year:
            qs = qs.filter(year=year)
            
        return qs

    @action(detail=False, methods=['post'])
    def generate_payslips(self, request):
        user = request.user
        if user.role not in ['SUPER_ADMIN', 'ADMIN']:
            return Response({'error': 'Unauthorized to generate payslips'}, status=status.HTTP_403_FORBIDDEN)

        month = request.data.get('month')
        year = request.data.get('year')

        if not month or not year:
            return Response({'error': 'Month and year are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            month = int(month)
            year = int(year)
        except ValueError:
            return Response({'error': 'Month and year must be integers'}, status=status.HTTP_400_BAD_REQUEST)

        # Get all active employees for this admin's organization
        employees_qs = Employee.objects.filter(is_active=True, salary_structure__isnull=False)
        
        if user.role != 'SUPER_ADMIN':
            if not user.organization_id:
                return Response({'error': 'Admin organization not found'}, status=status.HTTP_400_BAD_REQUEST)
            employees_qs = employees_qs.filter(user__organization=user.organization)

        employees = employees_qs.select_related('salary_structure')
        generated_count = 0

        with transaction.atomic():
            for employee in employees:
                structure = employee.salary_structure
                
                # Check if payslip already exists
                payslip, created = Payslip.objects.get_or_create(
                    employee=employee,
                    month=month,
                    year=year,
                    defaults={
                        'base_salary': structure.base_salary,
                        'hra': structure.hra,
                        'da': structure.da,
                        'special_allowances': structure.special_allowances,
                        'pf_deduction': structure.pf_deduction,
                        'tax_deduction': structure.tax_deduction,
                        'status': 'PROCESSED'
                    }
                )
                
                if created:
                    generated_count += 1
                else:
                    # Update if it exists and is still pending
                    if payslip.status == 'PENDING':
                        payslip.base_salary = structure.base_salary
                        payslip.hra = structure.hra
                        payslip.da = structure.da
                        payslip.special_allowances = structure.special_allowances
                        payslip.pf_deduction = structure.pf_deduction
                        payslip.tax_deduction = structure.tax_deduction
                        payslip.status = 'PROCESSED'
                        payslip.save()
                        generated_count += 1

        return Response({
            'message': f'Successfully generated or updated {generated_count} payslips for {month}/{year}',
            'count': generated_count
        })

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        user = request.user
        if user.role not in ['SUPER_ADMIN', 'ADMIN']:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
            
        payslip = self.get_object()
        payslip.status = 'PAID'
        payslip.payment_date = timezone.now().date()
        payslip.save()
        
        return Response(self.get_serializer(payslip).data)
