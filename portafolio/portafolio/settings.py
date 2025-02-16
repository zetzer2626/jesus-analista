"""
Django settings for portafolio project.
"""

from pathlib import Path
from dotenv import load_dotenv
import os
import dj_database_url
from urllib.parse import urlparse

# Cargar variables de entorno
load_dotenv()

# BASE_DIR
BASE_DIR = Path(__file__).resolve().parent.parent

# SECRET_KEY (cargado desde variables de entorno)
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-ur1s#$3bs%e%_6g^rej3m*hw)whwg_u^-mt=v085$d2g5xaunh')

# DEBUG (por defecto en False para producción)
DEBUG = os.getenv("DEBUG", "False") == "True"

# Hosts permitidos
ALLOWED_HOSTS = ['localhost', 'primer-portafolio-production.up.railway.app']

CSRF_TRUSTED_ORIGINS = [
    'https://primer-portafolio-production.up.railway.app',
]

# Aplicaciones instaladas
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'miapp',
    'whitenoise.runserver_nostatic',
    'cloudinary',
    'cloudinary_storage',
]

# Middlewares
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', 
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URL de raíz
ROOT_URLCONF = 'portafolio.urls'

# Configuración de plantillas
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

# WSGI
WSGI_APPLICATION = 'portafolio.wsgi.application'

# Configuración de la base de datos con Railway
database_url = os.getenv('DATABASE_URL')
url = urlparse(database_url)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': url.path[1:],  # Nombre de la base de datos
        'USER': url.username,  # Usuario
        'PASSWORD': url.password,  # Contraseña
        'HOST': url.hostname,  # Host
        'PORT': url.port,  # Puerto
        'OPTIONS': {
            'sslmode': 'require',  # Configuración SSL
        }
    }
}

# Validaciones de contraseñas
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Configuración de internacionalización
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Configuración de archivos estáticos con WhiteNoise
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'miapp/static')]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Configuración de Cloudinary para almacenamiento de medios
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
MEDIA_URL = '/media/'

# Configuración para Railway
WHITENOISE_USE_FINDERS = True

# Primary Key por defecto
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
