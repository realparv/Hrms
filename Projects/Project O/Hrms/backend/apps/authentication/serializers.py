from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserSession

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_active', 'role', 'organization', 'mfa_enabled')
        read_only_fields = ('id', 'is_active')

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    device_info = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")
        if user.locked_until:
            from django.utils import timezone
            if user.locked_until > timezone.now():
                raise serializers.ValidationError("Account is temporarily locked. Try again later.")
        
        data['user'] = user
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    organization_id = serializers.UUIDField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'organization_id')
        
    def create(self, validated_data):
        org_id = validated_data.pop('organization_id', None)
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role='EMPLOYEE',
            organization_id=org_id
        )
        return user

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSession
        fields = ('id', 'device_type', 'ip_address', 'location', 'last_activity', 'is_active', 'created_at')

class RequestOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    type = serializers.ChoiceField(choices=['EMAIL_VERIFICATION', 'PASSWORD_RESET', 'MFA_LOGIN'])

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    type = serializers.ChoiceField(choices=['EMAIL_VERIFICATION', 'PASSWORD_RESET', 'MFA_LOGIN'])

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)
