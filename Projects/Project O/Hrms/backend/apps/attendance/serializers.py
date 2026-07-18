from rest_framework import serializers
from .models import Attendance
from apps.employees.serializers import EmployeeSerializer

class AttendanceSerializer(serializers.ModelSerializer):
    employee_details = EmployeeSerializer(source='employee', read_only=True)
    
    class Meta:
        model = Attendance
        fields = '__all__'
        read_only_fields = ('employee', 'date', 'ip_address')
