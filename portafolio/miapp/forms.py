from django import forms
from django.core.exceptions import ValidationError
from .models import Project, Certification, Categoria
import os


class ProjectForm(forms.ModelForm):
    """
    Formulario para crear y editar proyectos
    """
    
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'categorias', 'project_image', 'project_file',
            'img_1', 'img_2', 'img_3', 'img_4', 'img_5', 
            'img_6', 'img_7', 'img_8', 'img_9', 'img_10',
            'video_file', 'video_url', 'github_url'
        ]
        
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Título del proyecto',
                'maxlength': 200
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Describe tu proyecto, las tecnologías utilizadas, desafíos superados...',
                'rows': 5
            }),
            'categorias': forms.CheckboxSelectMultiple(attrs={
                'class': 'form-check-input'
            }),
            'project_image': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'project_file': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': '.pdf,.doc,.docx,.zip,.rar,.exe,.apk'
            }),
            'img_1': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'img_2': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'img_3': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'img_4': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'img_5': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'img_6': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'img_7': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'img_8': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'img_9': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'img_10': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'video_file': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'video/*'
            }),
            'video_url': forms.URLInput(attrs={
                'class': 'form-control',
                'placeholder': 'https://youtube.com/watch?v=...'
            }),
            'github_url': forms.URLInput(attrs={
                'class': 'form-control',
                'placeholder': 'https://github.com/usuario/repositorio'
            })
        }
        
        labels = {
            'title': 'Título del Proyecto',
            'description': 'Descripción',
            'categorias': 'Categorías',
            'project_image': 'Imagen Principal',
            'project_file': 'Archivo del Proyecto',
            'img_1': 'Imagen 1',
            'img_2': 'Imagen 2',
            'img_3': 'Imagen 3',
            'img_4': 'Imagen 4',
            'img_5': 'Imagen 5',
            'img_6': 'Imagen 6',
            'img_7': 'Imagen 7',
            'img_8': 'Imagen 8',
            'img_9': 'Imagen 9',
            'img_10': 'Imagen 10',
            'video_file': 'Archivo de Video',
            'video_url': 'URL de Video',
            'github_url': 'URL de GitHub'
        }
        
        help_texts = {
            'title': 'Máximo 200 caracteres',
            'description': 'Describe las tecnologías utilizadas, desafíos superados y características principales',
            'categorias': 'Selecciona las categorías que mejor describan tu proyecto',
            'project_image': 'Imagen principal que representará tu proyecto (JPG, PNG, GIF - Max 10MB)',
            'project_file': 'Archivo descargable del proyecto (PDF, DOC, ZIP, APK, etc. - Max 50MB)',
            'video_file': 'Video del proyecto (MP4, AVI, MOV - Max 100MB)',
            'video_url': 'URL de video en YouTube, Vimeo u otra plataforma',
            'github_url': 'Enlace al repositorio del proyecto en GitHub'
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Hacer campos requeridos
        self.fields['title'].required = True
        self.fields['description'].required = True
        
        # Personalizar queryset de categorías
        self.fields['categorias'].queryset = Categoria.objects.all().order_by('nombre')
        
        # Añadir clases CSS adicionales
        for field_name, field in self.fields.items():
            if field_name == 'categorias':
                continue
            field.widget.attrs.update({'class': field.widget.attrs.get('class', '') + ' form-control'})

    def clean_title(self):
        """Validar título del proyecto"""
        title = self.cleaned_data.get('title')
        if title:
            # Verificar que no sea solo espacios
            if not title.strip():
                raise ValidationError("El título no puede estar vacío.")
            
            # Verificar longitud mínima
            if len(title.strip()) < 3:
                raise ValidationError("El título debe tener al menos 3 caracteres.")
                
            # Verificar que no exista otro proyecto con el mismo título (excepto el actual)
            existing_project = Project.objects.filter(title__iexact=title.strip())
            if self.instance.pk:
                existing_project = existing_project.exclude(pk=self.instance.pk)
            
            if existing_project.exists():
                raise ValidationError("Ya existe un proyecto con este título.")
                
        return title.strip() if title else title

    def clean_description(self):
        """Validar descripción del proyecto"""
        description = self.cleaned_data.get('description')
        if description:
            if len(description.strip()) < 10:
                raise ValidationError("La descripción debe tener al menos 10 caracteres.")
            if len(description) > 2000:
                raise ValidationError("La descripción no puede exceder 2000 caracteres.")
        return description

    def clean_video_url(self):
        """Validar URL de video"""
        video_url = self.cleaned_data.get('video_url')
        if video_url:
            # Verificar que sea una URL válida de video
            valid_domains = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com']
            if not any(domain in video_url.lower() for domain in valid_domains):
                raise ValidationError("Por favor, ingresa una URL válida de YouTube, Vimeo o Dailymotion.")
        return video_url

    def clean_github_url(self):
        """Validar URL de GitHub"""
        github_url = self.cleaned_data.get('github_url')
        if github_url:
            if 'github.com' not in github_url.lower():
                raise ValidationError("Por favor, ingresa una URL válida de GitHub.")
        return github_url

    def clean_project_image(self):
        """Validar imagen principal del proyecto"""
        image = self.cleaned_data.get('project_image')
        if image:
            # Validar tamaño (10MB)
            if image.size > 10 * 1024 * 1024:
                raise ValidationError("La imagen no puede ser mayor a 10MB.")
            
            # Validar tipo de archivo
            valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            ext = os.path.splitext(image.name)[1].lower()
            if ext not in valid_extensions:
                raise ValidationError("Solo se permiten archivos JPG, PNG, GIF y WebP.")
        return image

    def clean_project_file(self):
        """Validar archivo del proyecto"""
        file = self.cleaned_data.get('project_file')
        if file:
            # Validar tamaño (50MB)
            if file.size > 50 * 1024 * 1024:
                raise ValidationError("El archivo no puede ser mayor a 50MB.")
        return file

    def clean_video_file(self):
        """Validar archivo de video"""
        video = self.cleaned_data.get('video_file')
        if video:
            # Validar tamaño (100MB)
            if video.size > 100 * 1024 * 1024:
                raise ValidationError("El video no puede ser mayor a 100MB.")
            
            # Validar tipo de archivo
            valid_extensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
            ext = os.path.splitext(video.name)[1].lower()
            if ext not in valid_extensions:
                raise ValidationError("Solo se permiten archivos de video MP4, AVI, MOV, WMV, FLV y WebM.")
        return video

    def clean(self):
        """Validaciones generales del formulario"""
        cleaned_data = super().clean()
        
        # Verificar que al menos una categoría esté seleccionada
        categorias = cleaned_data.get('categorias')
        if not categorias or categorias.count() == 0:
            raise ValidationError("Debes seleccionar al menos una categoría.")
        
        # Validar que no se suban video_file y video_url al mismo tiempo
        video_file = cleaned_data.get('video_file')
        video_url = cleaned_data.get('video_url')
        
        if video_file and video_url:
            raise ValidationError("No puedes subir un archivo de video y una URL de video al mismo tiempo. Elige una opción.")
        
        # Validar imágenes de galería
        image_fields = ['img_1', 'img_2', 'img_3', 'img_4', 'img_5', 
                       'img_6', 'img_7', 'img_8', 'img_9', 'img_10']
        
        for field_name in image_fields:
            image = cleaned_data.get(field_name)
            if image:
                # Validar tamaño (5MB por imagen)
                if image.size > 5 * 1024 * 1024:
                    raise ValidationError(f"La {field_name} no puede ser mayor a 5MB.")
                
                # Validar tipo de archivo
                valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
                ext = os.path.splitext(image.name)[1].lower()
                if ext not in valid_extensions:
                    raise ValidationError(f"La {field_name} debe ser JPG, PNG, GIF o WebP.")
        
        return cleaned_data


class CertificationForm(forms.ModelForm):
    """
    Formulario para crear y editar certificaciones
    """
    
    class Meta:
        model = Certification
        fields = ['name', 'institution', 'year', 'certificate_file']
        
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Nombre de la certificación',
                'maxlength': 255
            }),
            'institution': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Institución que otorga la certificación',
                'maxlength': 255
            }),
            'year': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': '2024',
                'min': 1990,
                'max': 2030
            }),
            'certificate_file': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': '.pdf,.png,.jpg,.jpeg'
            })
        }
        
        labels = {
            'name': 'Nombre de la Certificación',
            'institution': 'Institución',
            'year': 'Año',
            'certificate_file': 'Archivo del Certificado'
        }
        
        help_texts = {
            'name': 'Nombre oficial de la certificación (máximo 255 caracteres)',
            'institution': 'Organización que otorga la certificación (máximo 255 caracteres)',
            'year': 'Año en que obtuviste la certificación (1990-2030)',
            'certificate_file': 'Archivo del certificado en PDF, PNG o JPG (máximo 10MB)'
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Hacer todos los campos requeridos
        for field in self.fields.values():
            field.required = True
        
        # Establecer año actual como valor por defecto
        from datetime import datetime
        current_year = datetime.now().year
        self.fields['year'].initial = current_year

    def clean_name(self):
        """Validar nombre de la certificación"""
        name = self.cleaned_data.get('name')
        if name:
            if not name.strip():
                raise ValidationError("El nombre de la certificación no puede estar vacío.")
            
            if len(name.strip()) < 3:
                raise ValidationError("El nombre debe tener al menos 3 caracteres.")
            
            # Verificar que no exista otra certificación con el mismo nombre para el mismo año
            year = self.cleaned_data.get('year') or self.initial.get('year')
            if year:
                existing_cert = Certification.objects.filter(
                    name__iexact=name.strip(),
                    year=year
                )
                if self.instance.pk:
                    existing_cert = existing_cert.exclude(pk=self.instance.pk)
                
                if existing_cert.exists():
                    raise ValidationError("Ya tienes una certificación con este nombre para el mismo año.")
                    
        return name.strip() if name else name

    def clean_institution(self):
        """Validar institución"""
        institution = self.cleaned_data.get('institution')
        if institution:
            if not institution.strip():
                raise ValidationError("La institución no puede estar vacía.")
            
            if len(institution.strip()) < 2:
                raise ValidationError("El nombre de la institución debe tener al menos 2 caracteres.")
                
        return institution.strip() if institution else institution

    def clean_year(self):
        """Validar año de la certificación"""
        from datetime import datetime
        
        year = self.cleaned_data.get('year')
        current_year = datetime.now().year
        
        if year:
            if year < 1990:
                raise ValidationError("El año no puede ser anterior a 1990.")
            
            if year > current_year + 1:
                raise ValidationError(f"El año no puede ser posterior a {current_year + 1}.")
                
        return year

    def clean_certificate_file(self):
        """Validar archivo del certificado"""
        file = self.cleaned_data.get('certificate_file')
        if file:
            # Validar tamaño (10MB)
            if file.size > 10 * 1024 * 1024:
                raise ValidationError("El archivo no puede ser mayor a 10MB.")
            
            # Validar tipo de archivo
            valid_extensions = ['.pdf', '.png', '.jpg', '.jpeg']
            ext = os.path.splitext(file.name)[1].lower()
            if ext not in valid_extensions:
                raise ValidationError("Solo se permiten archivos PDF, PNG y JPG.")
                
        return file


class CategoriaForm(forms.ModelForm):
    """
    Formulario para crear y editar categorías (si necesitas administrarlas)
    """
    
    class Meta:
        model = Categoria
        fields = ['nombre', 'descripcion', 'img_1']
        
        widgets = {
            'nombre': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Nombre de la categoría',
                'maxlength': 255
            }),
            'descripcion': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Descripción de la categoría',
                'rows': 4
            }),
            'img_1': forms.ClearableFileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            })
        }
        
        labels = {
            'nombre': 'Nombre de la Categoría',
            'descripcion': 'Descripción',
            'img_1': 'Imagen de la Categoría'
        }
        
        help_texts = {
            'nombre': 'Nombre único para la categoría (máximo 255 caracteres)',
            'descripcion': 'Descripción detallada de la categoría',
            'img_1': 'Imagen representativa de la categoría (JPG, PNG, GIF - Max 5MB)'
        }

    def clean_nombre(self):
        """Validar nombre de la categoría"""
        nombre = self.cleaned_data.get('nombre')
        if nombre:
            if not nombre.strip():
                raise ValidationError("El nombre de la categoría no puede estar vacío.")
            
            if len(nombre.strip()) < 2:
                raise ValidationError("El nombre debe tener al menos 2 caracteres.")
            
            # Verificar que no exista otra categoría con el mismo nombre
            existing_categoria = Categoria.objects.filter(nombre__iexact=nombre.strip())
            if self.instance.pk:
                existing_categoria = existing_categoria.exclude(pk=self.instance.pk)
            
            if existing_categoria.exists():
                raise ValidationError("Ya existe una categoría con este nombre.")
                
        return nombre.strip() if nombre else nombre

    def clean_img_1(self):
        """Validar imagen de la categoría"""
        image = self.cleaned_data.get('img_1')
        if image:
            # Validar tamaño (5MB)
            if image.size > 5 * 1024 * 1024:
                raise ValidationError("La imagen no puede ser mayor a 5MB.")
            
            # Validar tipo de archivo
            valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            ext = os.path.splitext(image.name)[1].lower()
            if ext not in valid_extensions:
                raise ValidationError("Solo se permiten archivos JPG, PNG, GIF y WebP.")
        return image


class ContactForm(forms.Form):
    """
    Formulario de contacto (opcional, para la página de contacto)
    """
    
    name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Tu nombre completo'
        }),
        label='Nombre Completo'
    )
    
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'tu@email.com'
        }),
        label='Email'
    )
    
    subject = forms.ChoiceField(
        choices=[
            ('', 'Selecciona un tema'),
            ('proyecto', 'Proyecto nuevo'),
            ('colaboracion', 'Colaboración'),
            ('consulta', 'Consulta técnica'),
            ('trabajo', 'Oportunidad laboral'),
            ('otro', 'Otro')
        ],
        widget=forms.Select(attrs={
            'class': 'form-control'
        }),
        label='Asunto'
    )
    
    message = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Cuéntame sobre tu proyecto o consulta...',
            'rows': 5
        }),
        label='Mensaje'
    )
    
    phone = forms.CharField(
        max_length=20,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': '+56 9 1234 5678'
        }),
        label='Teléfono (opcional)'
    )

    def clean_name(self):
        name = self.cleaned_data.get('name')
        if name and len(name.strip()) < 2:
            raise ValidationError("El nombre debe tener al menos 2 caracteres.")
        return name.strip() if name else name

    def clean_message(self):
        message = self.cleaned_data.get('message')
        if message and len(message.strip()) < 10:
            raise ValidationError("El mensaje debe tener al menos 10 caracteres.")
        return message