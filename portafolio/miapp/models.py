from django.db import models
from cloudinary.models import CloudinaryField

class Categoria(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    img_1 = CloudinaryField('image', null=True, blank=True)  # Imagen almacenada en Cloudinary
    
    def __str__(self):
        return self.nombre


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    project_image = CloudinaryField('image', blank=True, null=True)  # Imagen principal del proyecto
    project_file = CloudinaryField('raw', blank=True, null=True)  # Archivos generales
    created_at = models.DateTimeField(auto_now_add=True)

    # Imágenes del proyecto (almacenadas en Cloudinary)
    img_1 = CloudinaryField('image', blank=True, null=True)
    img_2 = CloudinaryField('image', blank=True, null=True)
    img_3 = CloudinaryField('image', blank=True, null=True)
    img_4 = CloudinaryField('image', blank=True, null=True)
    img_5 = CloudinaryField('image', blank=True, null=True)
    img_6 = CloudinaryField('image', blank=True, null=True)
    img_7 = CloudinaryField('image', blank=True, null=True)
    img_8 = CloudinaryField('image', blank=True, null=True)
    img_9 = CloudinaryField('image', blank=True, null=True)
    img_10 = CloudinaryField('image', blank=True, null=True)

    categorias = models.ManyToManyField(Categoria, related_name='projects')

    # Campos de video
    video_file = CloudinaryField('video', blank=True, null=True)  # Videos subidos a Cloudinary
    video_url = models.URLField(max_length=500, blank=True, null=True)  # URL de videos externos
    github_url = models.URLField(max_length=500, blank=True, null=True)  # URL de Github

    def __str__(self):
        return self.title


class Certification(models.Model):
    name = models.CharField(max_length=255)  # Nombre del certificado
    institution = models.CharField(max_length=255)  # Institución que otorga el certificado
    year = models.IntegerField()  # Año de emisión del certificado
    certificate_file = CloudinaryField('raw')  # Archivo del certificado (PDF, DOC, etc.)

    def __str__(self):
        return self.name
