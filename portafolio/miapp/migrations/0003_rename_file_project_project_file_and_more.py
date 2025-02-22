# Generated by Django 5.1.4 on 2025-01-08 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('miapp', '0002_certification'),
    ]

    operations = [
        migrations.RenameField(
            model_name='project',
            old_name='file',
            new_name='project_file',
        ),
        migrations.RemoveField(
            model_name='project',
            name='image',
        ),
        migrations.RemoveField(
            model_name='project',
            name='video_url',
        ),
        migrations.AddField(
            model_name='project',
            name='project_image',
            field=models.ImageField(blank=True, null=True, upload_to='projects/'),
        ),
        migrations.AddField(
            model_name='project',
            name='technology',
            field=models.CharField(choices=[('EXCEL', 'Excel'), ('POWERBI', 'Power BI'), ('PYTHON', 'Python'), ('SQL', 'SQL'), ('R', 'R'), ('ML', 'Machine Learning'), ('OTHER', 'Otros')], default='EXCEL', max_length=50),
        ),
    ]
