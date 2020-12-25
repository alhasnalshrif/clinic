from rest_framework import serializers

from django.contrib.auth.models import User

# from .models import UserProfile, Patient, Treatment
from .models import Bill


class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = "__all__"
