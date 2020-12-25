from rest_framework import serializers

from django.contrib.auth.models import User

# from .models import UserProfile, Patient, Treatment
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"
