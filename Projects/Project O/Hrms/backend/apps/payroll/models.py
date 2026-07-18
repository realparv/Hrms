from django.db import models
from core.base_models import BaseModel
from apps.employees.models import Employee

class SalaryStructure(BaseModel):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='salary_structure')
    base_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    hra = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    da = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    special_allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    pf_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    @property
    def gross_salary(self):
        return self.base_salary + self.hra + self.da + self.special_allowances

    @property
    def total_deductions(self):
        return self.pf_deduction + self.tax_deduction

    @property
    def net_salary(self):
        return self.gross_salary - self.total_deductions

    def __str__(self):
        return f"Salary Structure for {self.employee.first_name} {self.employee.last_name}"


class Payslip(BaseModel):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PROCESSED', 'Processed'),
        ('PAID', 'Paid'),
    )

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payslips')
    month = models.IntegerField()  # 1-12
    year = models.IntegerField()
    
    # Snapshotted values for this specific payslip
    base_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    hra = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    da = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    special_allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    pf_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('employee', 'month', 'year')

    @property
    def gross_salary(self):
        return self.base_salary + self.hra + self.da + self.special_allowances

    @property
    def total_deductions(self):
        return self.pf_deduction + self.tax_deduction

    @property
    def net_salary(self):
        return self.gross_salary - self.total_deductions

    def __str__(self):
        return f"Payslip for {self.employee.first_name} {self.employee.last_name} - {self.month}/{self.year}"
