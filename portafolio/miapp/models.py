from django.db import models


class Categoria(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    img_1 = models.FileField(upload_to='categorias/', null=True, blank=True)  # Permite imágenes y PDFs
    
    def __str__(self):
        return self.nombre


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    project_image = models.ImageField(upload_to='projects/', blank=True, null=True)
    project_file = models.FileField(upload_to='projects/files/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    img_1 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_2 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_3 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_4 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_5 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_6 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_7 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_8 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_9 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_10 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_11 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_12 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_13 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_14 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_15 = models.FileField(upload_to='projects/', blank=True, null=True)
    img_16 = models.FileField(upload_to='projects/', blank=True, null=True)

    categorias = models.ManyToManyField(Categoria, related_name='projects')
     # Campos de video
    video_file = models.FileField(upload_to='projects/videos/', blank=True, null=True)  # Para subir videos
    video_url = models.URLField(max_length=200, blank=True, null=True)  # Para vincular videos externos

    def __str__(self):
        return self.title


class Certification(models.Model):
    name = models.CharField(max_length=255)  # Nombre del certificado
    institution = models.CharField(max_length=255)  # Institución que otorga el certificado
    year = models.IntegerField()  # Año de emisión del certificado
    certificate_file = models.FileField(upload_to='certificates/')  # Archivo del certificado

    def __str__(self):
        return self.name