import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env files
load_dotenv(BASE_DIR / '.env')
load_dotenv(BASE_DIR.parent / '.env')

SECRET_KEY = os.environ.get('SECRET_KEY')

DEBUG = os.environ.get('DEBUG', 'False').lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = os.environ.get(
    'ALLOWED_HOSTS',
    'localhost,127.0.0.1,promptforgeai1.onrender.com,prompt-forge-ai-eta.vercel.app'
).split(',')


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    
    # Local apps
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'promptforge.urls'

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

WSGI_APPLICATION = 'promptforge.wsgi.application'

# Database Configuration (PostgreSQL with SQLite fallback)
DB_ENGINE = os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3')
DB_NAME = os.environ.get('POSTGRES_DB', os.environ.get('DB_NAME', BASE_DIR / 'db.sqlite3'))

if 'postgresql' in DB_ENGINE or os.environ.get('DATABASE_URL'):
    import urllib.parse
    db_url = os.environ.get('DATABASE_URL')
    if db_url:
        url = urllib.parse.urlparse(db_url)
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': url.path[1:],
                'USER': url.username,
                'PASSWORD': url.password,
                'HOST': url.hostname,
                'PORT': url.port or 5432,
            }
        }
    else:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': os.environ.get('POSTGRES_DB', 'promptforge_db'),
                'USER': os.environ.get('POSTGRES_USER', 'postgres'),
                'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'postgres'),
                'HOST': os.environ.get('POSTGRES_HOST', 'localhost'),
                'PORT': os.environ.get('POSTGRES_PORT', '5432'),
            }
        }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',  # Allow easy demo access, guarded endpoints specify IsAuthenticated
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
}

CORS_ALLOWED_ORIGINS = [
    "https://prompt-forge-ai-eta.vercel.app",
]
CORS_ALLOW_CREDENTIALS = True


# Google Gemini API key
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
GEMINI_API_MODEL = "gemini-3.6-flash"
MAX_RETRIES = 5 
TIMEOUT = 60
ENABLE_STREAMING = True

