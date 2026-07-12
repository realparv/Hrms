import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
SECRET_KEY = 'django-insecure-dummy-key-for-now'
DEBUG = True
ALLOWED_HOSTS = ['*']

# Application definition for django-tenants
SHARED_APPS = [
    # 'django_tenants',  # mandatory, should always be before any django app
    # 'apps.tenants',    # your tenant app
    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'core',
]

TENANT_APPS = [
    # The following Django contrib apps must be in TENANT_APPS
    # 'django.contrib.contenttypes',
    
    # Custom apps that hold tenant-specific data
    'apps.tenants',
    'apps.authentication',
    'apps.employees',
    # 'apps.attendance',
    # 'apps.payroll',
]

INSTALLED_APPS = list(SHARED_APPS) + [app for app in TENANT_APPS if app not in SHARED_APPS]

# --- MULTI-TENANT CONFIG DISABLED TEMPORARILY FOR SQLITE ---
# TENANT_MODEL = "tenants.Client"
# TENANT_DOMAIN_MODEL = "tenants.Domain"

MIDDLEWARE = [
    # 'apps.tenants.middleware.CustomTenantMiddleware', # Custom JWT/Header tenant resolver
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
PUBLIC_SCHEMA_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database configured to use PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'hrms_db',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# DATABASE_ROUTERS = (
#     'django_tenants.routers.TenantSyncRouter',
# )

AUTH_USER_MODEL = 'authentication.User'
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
