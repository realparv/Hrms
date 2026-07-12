import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
from .models import UserSession, OTPCode
import random
import string

class AuthService:
    @staticmethod
    def generate_tokens(user, request=None, device_info=""):
        """
        Generates JWT Access and Refresh tokens.
        Stores the refresh token in UserSession for tracking.
        """
        access_payload = {
            'user_id': str(user.id),
            'email': user.email,
            'type': 'access',
            'exp': datetime.utcnow() + timedelta(minutes=15),
            'iat': datetime.utcnow()
        }
        
        refresh_payload = {
            'user_id': str(user.id),
            'type': 'refresh',
            'exp': datetime.utcnow() + timedelta(days=7),
            'iat': datetime.utcnow()
        }
        
        # Replace with robust settings/keys
        access_token = jwt.encode(access_payload, getattr(settings, 'SECRET_KEY', 'secret'), algorithm='HS256')
        refresh_token = jwt.encode(refresh_payload, getattr(settings, 'SECRET_KEY', 'secret'), algorithm='HS256')
        
        # Track session
        ip_address = request.META.get('REMOTE_ADDR') if request else None
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:512] if request else ''
        
        UserSession.objects.create(
            user=user,
            refresh_token=refresh_token,
            ip_address=ip_address,
            user_agent=user_agent,
            device_type=device_info,
            expires_at=timezone.now() + timedelta(days=7)
        )
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }
        
    @staticmethod
    def revoke_session(refresh_token):
        UserSession.objects.filter(refresh_token=refresh_token).update(is_active=False)
        
    @staticmethod
    def revoke_all_sessions(user):
        UserSession.objects.filter(user=user, is_active=True).update(is_active=False)

    @staticmethod
    def generate_otp(user, otp_type):
        code = ''.join(random.choices(string.digits, k=6))
        OTPCode.objects.filter(user=user, type=otp_type, is_used=False).update(is_used=True)
        otp = OTPCode.objects.create(
            user=user,
            code=code,
            type=otp_type,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        return otp.code

    @staticmethod
    def verify_otp(user, otp_type, code):
        otp = OTPCode.objects.filter(
            user=user, 
            type=otp_type, 
            code=code, 
            is_used=False,
            expires_at__gt=timezone.now()
        ).first()
        
        if otp:
            otp.is_used = True
            otp.save()
            return True
        return False
