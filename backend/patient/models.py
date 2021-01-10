from django.db import models
# from django.contrib.auth.models import User
from users.models import User

USER_GENDER = (('MALE', 'MALE'), ('FEMALE', 'FEMALE'))


class Patient(models.Model):
    doctor = models.ForeignKey(
        User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    bloodgroup = models.CharField(max_length=10, blank=True, null=True)
    sex = models.CharField(max_length=10, choices=USER_GENDER, default='MALE')
    age = models.IntegerField(blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return str(self.name)

    def __unicode__(self):
        return self.doctor.username
