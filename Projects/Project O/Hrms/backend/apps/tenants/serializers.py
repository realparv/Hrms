from rest_framework import serializers
from .models import Client, SubscriptionPlan
from apps.authentication.models import User
from django.db import transaction

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class OrganizationSignupSerializer(serializers.Serializer):
    """
    Handles the SaaS signup flow: Creates an Organization and an Admin User.
    """
    # Company Details
    company_name = serializers.CharField(max_length=100)
    domain = serializers.CharField(max_length=255)
    
    # Admin User Details
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_domain(self, value):
        if Client.objects.filter(domain_url=value).exists():
            raise serializers.ValidationError("An organization with this domain already exists.")
        return value

    def create(self, validated_data):
        with transaction.atomic():
            # 1. Get or create a default Starter plan
            starter_plan, _ = SubscriptionPlan.objects.get_or_create(
                name='Starter (Trial)',
                defaults={'price_per_user': 0.00, 'max_employees': 10}
            )
            
            # 2. Create the Organization (Client)
            client = Client.objects.create(
                name=validated_data['company_name'],
                domain_url=validated_data['domain'],
                plan=starter_plan,
                on_trial=True
            )
            
            # 3. Create the Admin User
            user = User.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                role='ADMIN',
                organization=client
            )
            
            return {
                'organization': client,
                'admin_user': user
            }
