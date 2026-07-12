from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import User, UserSession
from .serializers import (
    LoginSerializer, RegisterSerializer, UserSerializer, 
    SessionSerializer, RequestOTPSerializer, VerifyOTPSerializer, ResetPasswordSerializer
)
from .services import AuthService

class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Check if MFA is enabled
        if user.mfa_enabled:
            # Send OTP or require TOTP
            AuthService.generate_otp(user, 'MFA_LOGIN')
            return Response({'message': 'MFA required. OTP sent.'}, status=status.HTTP_202_ACCEPTED)

        # Generate tokens
        device_info = serializer.validated_data.get('device_info', '')
        tokens = AuthService.generate_tokens(user, request, device_info)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens
        })

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            AuthService.revoke_session(refresh_token)
            return Response({'message': 'Logged out successfully.'})
        return Response({'error': 'Refresh token required.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def request_otp(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.get(email=serializer.validated_data['email'])
            otp = AuthService.generate_otp(user, serializer.validated_data['type'])
            # Here we would send email with OTP
            return Response({'message': 'OTP sent.'})
        except User.DoesNotExist:
            return Response({'message': 'If the email is registered, an OTP will be sent.'})

    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.get(email=serializer.validated_data['email'])
            if AuthService.verify_otp(user, 'PASSWORD_RESET', serializer.validated_data['code']):
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                AuthService.revoke_all_sessions(user)
                return Response({'message': 'Password reset successful.'})
            return Response({'error': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Invalid request.'}, status=status.HTTP_400_BAD_REQUEST)

class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SessionSerializer

    def get_queryset(self):
        return UserSession.objects.filter(user=self.request.user, is_active=True).order_by('-last_activity')

    @action(detail=False, methods=['post'])
    def logout_all_devices(self, request):
        AuthService.revoke_all_sessions(request.user)
        return Response({'message': 'Logged out from all devices.'})
