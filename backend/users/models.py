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

        
# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)

#     phone_regex = RegexValidator(
#         regex=r"^\+?1?\d{9,15}$",
#         message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.",
#     )
#     phone_number = models.CharField(
#         validators=[phone_regex], max_length=17, blank=True
#     )  # validators should be a list
#     img = models.ImageField(upload_to="profile/")

#     def __str__(self):
#         return str(self.user)


# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)
