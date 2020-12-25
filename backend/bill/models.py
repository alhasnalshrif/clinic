from django.db import models
from django.contrib.auth.models import User
from treatment.models import Treatment
from patient.models import Patient


class Bill(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='bill_doctor')
    treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE)

    amount_paid = models.IntegerField()
    current_balance_before = models.IntegerField()
    new_balance_after = models.IntegerField()
    date = models.DateField(auto_now=True)

    def __str__(self):
        return str(self.patient)
