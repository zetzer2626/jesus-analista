from django.db import models


class Categoria(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    img_1 = models.ImageField(upload_to='categorias/', null=True, blank=True)
    
    def __str__(self):
        return self.nombre


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    project_image = models.ImageField(upload_to='projects/', blank=True, null=True)
    project_file = models.FileField(upload_to='projects/files/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    img_1 = models.ImageField(upload_to='projects/', blank=True, null=True)
    img_2 = models.ImageField(upload_to='projects/', blank=True, null=True)
    img_3 = models.ImageField(upload_to='projects/', blank=True, null=True)
    img_4 = models.ImageField(upload_to='projects/', blank=True, null=True)
    img_5 = models.ImageField(upload_to='projects/', blank=True, null=True)
    img_6 = models.ImageField(upload_to='projects/', blank=True, null=True)
    img_7 = models.ImageField(upload_to='projects/', blank=True, null=True)
    img_8 = models.ImageField(upload_to='projects/', blank=True, null=True)
    img_9 = models.ImageField(upload_to='projects/', blank=True, null=True)
    img_10 = models.ImageField(upload_to='projects/', blank=True, null=True)
    categorias = models.ManyToManyField(Categoria, related_name='projects')
     # Campos de video
    video_file = models.FileField(upload_to='projects/videos/', blank=True, null=True)  # Para subir videos
    video_url = models.URLField(max_length=500, blank=True, null=True)  # Para vincular videos externos
    github_url = models.URLField(max_length=500, blank=True, null=True)  # Para vincular Github externos

    def __str__(self):
        return self.title


class Certification(models.Model):
    name = models.CharField(max_length=255)  # Nombre del certificado
    institution = models.CharField(max_length=255)  # Institución que otorga el certificado
    year = models.IntegerField()  # Año de emisión del certificado
    certificate_file = models.FileField(upload_to='certificates/')  # Archivo del certificado

    def __str__(self):
        return self.name