from rest_framework import serializers
from .models import LeaveRequest
from apps.employees.serializers import EmployeeSerializer

class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_details = EmployeeSerializer(source='employee', read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = '__all__'
        read_only_fields = ('employee', 'status', 'approved_by')
