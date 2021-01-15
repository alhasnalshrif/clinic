from django.db import models
from django.core.validators import RegexValidator
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser

USER_GROUPS = (
    ('ADMIN', 'Admin'),
    ('MANAGER', 'Manager'),
)


class User(AbstractUser):

    group = models.CharField(max_length=30, choices=USER_GROUPS)

    REQUIRED_FIELDS = ['group']

    def __str__(self):
        return str(self.username)

        