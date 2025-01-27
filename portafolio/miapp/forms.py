from django import forms
from .models import Project

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = '__all__'
        widgets = {
            'categorias': forms.CheckboxSelectMultiple(),  # Opcional: Para un diseño más amigable
        }