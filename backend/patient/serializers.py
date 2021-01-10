from rest_framework import serializers

from users.models import User

from .models import Patient

from users.models import User


class PatientSerializer(serializers.ModelSerializer):
    doctor = serializers.CharField()

    class Meta:
        model = Patient
        fields = "__all__"
        # extra_fields = ('doctor',)
        # depth = 1
