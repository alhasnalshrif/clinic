from django.db import models
# from django.contrib.auth.models import User
from users.models import User

USER_GENDER = (('MALE', 'MALE'), ('FEMALE', 'FEMALE'))


class Expenses(models.Model):

    name = models.CharField(max_length=100)
    money = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return str(self.name)


class Stuff(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)
    expenses = models.ForeignKey(
        Expenses, on_delete=models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    sex = models.CharField(max_length=10, choices=USER_GENDER, default='MALE')
    age = models.IntegerField(blank=True, null=True)
    salary = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return str(self.name)

    def __unicode__(self):
        return self.doctor.username
