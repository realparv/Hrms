from django.http import Http404
from django_tenants.middleware.main import TenantMainMiddleware
from .models import Domain

class CustomTenantMiddleware(TenantMainMiddleware):
    """
    Extends the default django-tenants middleware to support JWT-based tenant resolution
    or custom headers, useful for APIs where subdomain resolution might not be sufficient.
    """
    
    def get_tenant(self, model, hostname, request):
        # 1. Check for custom HTTP header (e.g., X-Tenant-ID)
        tenant_name = request.META.get('HTTP_X_TENANT_ID')
        
        if tenant_name:
            try:
                # Resolve by custom header
                return model.objects.get(schema_name=tenant_name)
            except model.DoesNotExist:
                raise Http404(f"Tenant {tenant_name} not found.")

        # 2. Fallback to standard Subdomain/Hostname resolution
        return super().get_tenant(model, hostname, request)
