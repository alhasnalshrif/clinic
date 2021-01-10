# Generated by Django 3.1.5 on 2021-01-09 23:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointment', '0003_auto_20210110_0151'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appointment',
            name='amount_paid',
        ),
        migrations.RemoveField(
            model_name='appointment',
            name='current_balance_before',
        ),
        migrations.RemoveField(
            model_name='appointment',
            name='new_balance_after',
        ),
        migrations.AlterField(
            model_name='appointment',
            name='date',
            field=models.DateField(blank=True, null=True),
        ),
    ]