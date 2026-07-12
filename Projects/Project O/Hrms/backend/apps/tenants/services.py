from .models import Client, Domain

class TenantService:
    @staticmethod
    def create_tenant(name, schema_name, domain_url, plan_type='STARTER', max_employees=50):
        """
        Creates a new tenant and provisions their dedicated PostgreSQL schema.
        Also creates the routing domain for django-tenants.
        """
        # Create the tenant (this automatically triggers schema creation in Postgres)
        tenant = Client(
            schema_name=schema_name,
            name=name,
            plan_type=plan_type,
            max_employees=max_employees,
            is_active=True
        )
        tenant.save()
        
        # Route the domain to this tenant
        domain = Domain()
        domain.domain = domain_url
        domain.tenant = tenant
        domain.is_primary = True
        domain.save()
        
        return tenant
        
    @staticmethod
    def suspend_tenant(schema_name):
        Client.objects.filter(schema_name=schema_name).update(is_active=False)
        
    @staticmethod
    def get_tenant_by_schema(schema_name):
        return Client.objects.filter(schema_name=schema_name).first()
