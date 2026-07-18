from django.db import models
from core.base_models import BaseModel

class Attendance(BaseModel):
    STATUS_CHOICES = (
        ('PRESENT', 'Present'),
        ('ABSENT', 'Absent'),
        ('HALF_DAY', 'Half Day'),
        ('LATE', 'Late'),
    )
    
    employee = models.ForeignKey('employees.Employee', on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    clock_in = models.DateTimeField(null=True, blank=True)
    clock_out = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PRESENT')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('employee', 'date')
        ordering = ['-date', '-clock_in']

    def __str__(self):
        return f"{self.employee.employee_id} - {self.date} - {self.status}"
