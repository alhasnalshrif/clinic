from django.db import models
# from django.contrib.auth.models import User
from treatment.models import Treatment

from users.models import User


class Bill(models.Model):
    doctor = models.ForeignKey(
        User, on_delete=models.CASCADE)
    treatment = models.OneToOneField(Treatment, on_delete=models.CASCADE)

    amount_paid = models.IntegerField()
    current_balance_before = models.IntegerField()
    new_balance_after = models.IntegerField()
    date_paid = models.DateField(auto_now=True)

    def __str__(self):
        return str(self.treatment)
