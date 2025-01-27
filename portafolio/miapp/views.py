from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Project,Certification,Categoria
from .forms import ProjectForm
from django.views.generic import TemplateView
from django.db.models import Q

class CategoriaListView(ListView):
    model = Categoria
    template_name = 'categorias/categoria_list.html'
    context_object_name = 'categorias'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Añadir el conteo de proyectos a cada categoría
        for categoria in context['categorias']:
            categoria.project_count = categoria.projects.count()  # Usando el 'related_name'
        return context

class CategoriaDetailView(DetailView):
    model = Categoria
    template_name = 'categorias/categoria_detail.html'
    context_object_name = 'categoria'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Cambiado project_set por projects
        context['proyectos'] = self.object.projects.all()  # Usamos projects en lugar de project_set
        return context

class ProjectListView(ListView):
    model = Project
    template_name = 'projects/project_list.html'
    context_object_name = 'projects'
    paginate_by = 10

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtrar por categoría
        categoria_id = self.request.GET.get('categoria_id')
        if categoria_id:
            queryset = queryset.filter(categorias__id=categoria_id)

        # Filtrar por palabras clave en el título o descripción
        keyword = self.request.GET.get('keyword')
        if keyword:
            queryset = queryset.filter(
                Q(title__icontains=keyword) | Q(description__icontains=keyword)
            )
            
        # Ordenar por criterio (por defecto, por fecha de creación)
        order = self.request.GET.get('order', 'created_at')
        return queryset.order_by(order)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Agregar las categorías al contexto
        context['categories'] = Categoria.objects.all()

        # Agregar valores actuales de los filtros para mantener el estado en el formulario
        context['current_filters'] = {
            'categoria_id': self.request.GET.get('categoria_id', ''),
            'keyword': self.request.GET.get('keyword', ''),
            'start_date': self.request.GET.get('start_date', ''),
            'end_date': self.request.GET.get('end_date', ''),
            'is_published': self.request.GET.get('is_published', ''),
            'order': self.request.GET.get('order', 'created_at'),
        }

        return context

class ProjectDetailView(DetailView):
    model = Project
    template_name = 'projects/project_detail.html'
    context_object_name = 'project'
    
    def get_queryset(self):
        return super().get_queryset().prefetch_related('categorias')

class ProjectCreateView(CreateView):
    model = Project
    form_class = ProjectForm
    template_name = 'projects/project_create.html'
    success_url = reverse_lazy('project_list')

class ProjectUpdateView(UpdateView):
    model = Project
    form_class = ProjectForm
    template_name = 'projects/project_edit.html'
    success_url = reverse_lazy('project_list')

class ProjectDeleteView(DeleteView):
    model = Project
    template_name = 'projects/project_confirm_delete.html'
    success_url = reverse_lazy('project_list')


class AboutView(TemplateView):
    template_name = 'projects/about.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Obtener todas las certificaciones de la base de datos
        context['certifications'] = Certification.objects.all()
        return context
    
class ContactView(TemplateView):
    template_name = 'projects/contact.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['email'] = 'jnavarrete2626@gmail.com'  # Aquí puedes usar el correo que desees
        return context

##########################-----CERTIFICACIONES--------------#######################
class CertificationListView(ListView):
    model = Certification
    template_name = 'certificacion/certification_list.html'
    context_object_name = 'certifications'


class CertificationCreateView(CreateView):
    model = Certification
    template_name = 'certificacion/certification_create.html'
    fields = ['name', 'institution', 'year', 'certificate_file']
    success_url = reverse_lazy('certification_list')  # Redirige al listado después de crear

class CertificationUpdateView(UpdateView):
    model = Certification
    template_name = 'certificacion/certification_edit.html'
    fields = ['name', 'institution', 'year', 'certificate_file']
    success_url = reverse_lazy('certification_list')  # Redirige al listado después de actualizar


class CertificationDeleteView(DeleteView):
    model = Certification
    template_name = 'certificacion/certification_confirm_delete.html'
    success_url = reverse_lazy('certification_list')  # Redirige al listado después de eliminar

