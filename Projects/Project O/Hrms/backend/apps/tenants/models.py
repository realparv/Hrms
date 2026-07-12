from django.db import models
from core.base_models import BaseModel

class SubscriptionPlan(BaseModel):
    """
    SaaS Billing Plans (e.g. Starter, Pro, Enterprise)
    """
    name = models.CharField(max_length=50, unique=True)
    price_per_user = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    max_employees = models.IntegerField(default=50)
    features = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return self.name

class Client(BaseModel):
    """
    Represents an Organization / Company in the SaaS.
    Acts as the row-level tenant boundary.
    """
    name = models.CharField(max_length=100)
    domain_url = models.CharField(max_length=255, unique=True) # e.g. companyA.hrms.com
    
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True, blank=True)
    paid_until = models.DateField(null=True, blank=True)
    on_trial = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name
