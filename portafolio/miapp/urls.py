from django.urls import path
from .views import *

urlpatterns = [
    path('', ProjectListView.as_view(), name='project_list'),
    path('project/<int:pk>/', ProjectDetailView.as_view(), name='project_detail'),
    path('project/create/', ProjectCreateView.as_view(), name='project_create'),
    path('project/<int:pk>/edit/', ProjectUpdateView.as_view(), name='project_update'),
    path('project/<int:pk>/delete/', ProjectDeleteView.as_view(), name='project_delete'),
    path('about/', AboutView.as_view(), name='about'),
    path('contacto/', ContactView.as_view(), name='contacto'),

    ###Categorias####
    path('categorias/', CategoriaListView.as_view(), name='categoria_list'),
    path('categorias/<int:pk>/', CategoriaDetailView.as_view(), name='categoria_detail'),


    ###Certificaciones####
    path('certificaciones/', CertificationListView.as_view(), name='certification_list'),  # Listar
    path('certificacion/nueva/', CertificationCreateView.as_view(), name='certification_create'),  # Crear
    path('certificacion/editar/<int:pk>/', CertificationUpdateView.as_view(), name='certification_update'),  # Actualizar
    path('certificacion/eliminar/<int:pk>/', CertificationDeleteView.as_view(), name='certification_delete'),  # Eliminar
]