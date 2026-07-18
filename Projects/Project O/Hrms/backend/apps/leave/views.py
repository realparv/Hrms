from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from apps.employees.models import Employee

class LeaveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['SUPER_ADMIN', 'ADMIN']:
            return LeaveRequest.objects.all()
        
        # Ensure employee can only see their own leave requests
        try:
            employee = Employee.objects.get(user=user)
            return LeaveRequest.objects.filter(employee=employee)
        except Employee.DoesNotExist:
            return LeaveRequest.objects.none()

    def perform_create(self, serializer):
        try:
            employee = Employee.objects.get(user=self.request.user)
            serializer.save(employee=employee)
        except Employee.DoesNotExist:
            pass # Or handle error appropriately

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if request.user.role not in ['SUPER_ADMIN', 'ADMIN']:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
            
        leave_request = self.get_object()
        leave_request.status = 'APPROVED'
        leave_request.approved_by = request.user
        leave_request.save()
        
        return Response(self.get_serializer(leave_request).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if request.user.role not in ['SUPER_ADMIN', 'ADMIN']:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
            
        leave_request = self.get_object()
        leave_request.status = 'REJECTED'
        leave_request.approved_by = request.user
        leave_request.admin_remarks = request.data.get('remarks', '')
        leave_request.save()
        
        return Response(self.get_serializer(leave_request).data)
