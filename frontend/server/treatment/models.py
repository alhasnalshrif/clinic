from django.db import models
# from django.contrib.auth.models import User
from patient.models import Patient
# Create your models here.
from users.models import User



class Treatment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    token = models.IntegerField()
    description = models.CharField(max_length=100, blank=True, null=True)
    toothPosition = models.CharField(max_length=50, blank=True, null=True)
    dental_test = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return str(self.title)


