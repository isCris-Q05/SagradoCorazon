# Generated by Django 5.1.3 on 2024-12-05 04:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('citas', '0002_registrotratamiento'),
    ]

    operations = [
        migrations.AddField(
            model_name='cita',
            name='estado',
            field=models.CharField(choices=[('pendiente', 'Pendiente'), ('finalizada', 'Finalizada'), ('no_asistio', 'No asistió')], default='pendiente', max_length=15),
        ),
    ]
