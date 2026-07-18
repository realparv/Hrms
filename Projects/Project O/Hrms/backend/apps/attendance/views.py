from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Attendance
from .serializers import AttendanceSerializer
from apps.employees.models import Employee

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['SUPER_ADMIN', 'ADMIN']:
            return Attendance.objects.all()
        
        # Ensure employee can only see their own attendance
        try:
            employee = Employee.objects.get(user=user)
            return Attendance.objects.filter(employee=employee)
        except Employee.DoesNotExist:
            return Attendance.objects.none()

    @action(detail=False, methods=['post'])
    def clock_in(self, request):
        try:
            employee = Employee.objects.get(user=request.user)
        except Employee.DoesNotExist:
            return Response({"error": "Employee profile not found."}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.now().date()
        attendance, created = Attendance.objects.get_or_create(
            employee=employee,
            date=today,
            defaults={
                'clock_in': timezone.now(),
                'ip_address': request.META.get('REMOTE_ADDR')
            }
        )
        
        if not created:
            if attendance.clock_in:
                return Response({"error": "Already clocked in today."}, status=status.HTTP_400_BAD_REQUEST)
            
            attendance.clock_in = timezone.now()
            attendance.save()

        serializer = self.get_serializer(attendance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def clock_out(self, request):
        try:
            employee = Employee.objects.get(user=request.user)
        except Employee.DoesNotExist:
            return Response({"error": "Employee profile not found."}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.now().date()
        try:
            attendance = Attendance.objects.get(employee=employee, date=today)
        except Attendance.DoesNotExist:
            return Response({"error": "No clock-in record found for today."}, status=status.HTTP_400_BAD_REQUEST)

        if attendance.clock_out:
            return Response({"error": "Already clocked out today."}, status=status.HTTP_400_BAD_REQUEST)

        attendance.clock_out = timezone.now()
        attendance.save()

        serializer = self.get_serializer(attendance)
        return Response(serializer.data, status=status.HTTP_200_OK)
