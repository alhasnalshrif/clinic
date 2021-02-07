from django.db import models
# from django.contrib.auth.models import User
from users.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save

USER_GENDER = (('MALE', 'MALE'), ('FEMALE', 'FEMALE'))

TEETH_TYPE = (
    ('None', 'None'),
    ('Decayed', 'Decayed'),
    ('Missing', 'Missing'),
    ('Filled', 'Filled')
)


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


class AdultTeethChart(models.Model):
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE)

    UR_1 = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')

    UR_2 = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UR_3 = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UR_4 = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UR_5 = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UR_6 = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UR_7 = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UR_8 = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UL_9 = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UL_10 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    UL_11 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    UL_12 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    UL_13 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    UL_14 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    UL_15 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    UL_16 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LL_17 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LL_18 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LL_19 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LL_20 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LL_21 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LL_22 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LL_23 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LL_24 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LR_25 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LR_26 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LR_27 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LR_28 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LR_29 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LR_30 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LR_31 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')
    LR_32 = models.CharField(max_length=50, blank=True,
                             null=True, choices=TEETH_TYPE, default='None')

    def __str__(self):
        return str(self.patient)


class ChildTeethChart(models.Model):
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE)

    UR_A = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UR_B = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UR_C = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UR_D = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UR_E = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UL_F = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UL_G = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UL_H = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UL_I = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    UL_J = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    LL_K = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    LL_L = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    LL_M = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    LL_N = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    LL_O = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    LR_P = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    LR_Q = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    LR_R = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    LR_S = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')
    LR_T = models.CharField(max_length=50, blank=True,
                            null=True, choices=TEETH_TYPE, default='None')

    def __str__(self):
        return str(self.patient)


@receiver(post_save, sender=Patient)
def create_or_update_user_adultTeeth(sender, instance, created, **kwargs):
    if created:
        AdultTeethChart.objects.create(patient=instance)


@receiver(post_save, sender=Patient)
def create_or_update_user_childTeeth(sender, instance, created, **kwargs):
    if created:
        ChildTeethChart.objects.create(patient=instance)
