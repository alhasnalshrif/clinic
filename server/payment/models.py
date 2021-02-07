from django.db import models
# from django.contrib.auth.models import User
from appointment.models import Appointment
from django.dispatch import receiver
from django.db.models.signals import post_save

from users.models import User


class Bill(models.Model):
    # doctor = models.ForeignKey(
    #     User, on_delete=models.CASCADE)
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE)

    amount_paid = models.IntegerField(default=0)
    current_balance_before = models.IntegerField(default=0)
    new_balance_after = models.IntegerField(default=0)
    date_paid = models.DateField(auto_now=True)

    def __str__(self):
        return str(self.appointment)


@receiver(post_save, sender=Appointment)
def create_or_update_user_payment(sender, instance, created, **kwargs):
    if created:
        Bill.objects.create(appointment=instance)
