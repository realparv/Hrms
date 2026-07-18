from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Count, Q
from core.permissions import IsSuperAdmin
from .models import Client, SubscriptionPlan
from .serializers import ClientSerializer, SubscriptionPlanSerializer, OrganizationSignupSerializer

class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Publicly accessible list of available SaaS plans.
    """
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]

class OrganizationViewSet(viewsets.ModelViewSet):
    """
    Handles Organization signup and management.
    """
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    
    def get_permissions(self):
        if self.action in ['signup', 'list']:
            return [AllowAny()]
        if self.action == 'stats':
            return [IsSuperAdmin()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['post'])
    def signup(self, request):
        """
        Public API for SaaS customers to sign up their organization.
        """
        serializer = OrganizationSignupSerializer(data=request.data)
        if serializer.is_valid():
            result = serializer.save()
            return Response({
                'message': 'Organization and Admin created successfully.',
                'organization_id': result['organization'].id,
                'admin_email': result['admin_user'].email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Returns stats about active organizations and their member counts for Super Admin dashboard.
        """
        # Query active organizations and count active members
        orgs = Client.objects.filter(is_active=True).annotate(
            member_count=Count('users', filter=Q(users__is_active=True))
        )
        
        data = [
            {
                "id": org.id,
                "name": org.name,
                "domain": org.domain_url,
                "member_count": org.member_count
            }
            for org in orgs
        ]
        
        return Response(data)
