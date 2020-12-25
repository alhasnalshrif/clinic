# Generated by Django 3.1.2 on 2020-12-01 19:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bill', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bill',
            old_name='amount',
            new_name='amount_paid',
        ),
        migrations.AddField(
            model_name='bill',
            name='current_balance_before',
            field=models.IntegerField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='bill',
            name='new_balance_after',
            field=models.IntegerField(default=''),
            preserve_default=False,
        ),
    ]
