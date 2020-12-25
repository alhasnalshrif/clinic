from django.db import models
from patient.models import Patient
from django.contrib.auth.models import User

# Create your models here.


class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='app_doctor')
    token = models.IntegerField()
    date = models.DateField(blank=True, null=True)
    time = models.TimeField(null=True, blank=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return str(self.patient.username)

    class Meta:
        ordering = ('date',)
