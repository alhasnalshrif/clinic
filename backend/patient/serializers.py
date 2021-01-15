from rest_framework import serializers

from users.models import User

from .models import Patient, ChildTeethChart, AdultTeethChart

from users.models import User


class PatientSerializer(serializers.ModelSerializer):
    doctor = serializers.CharField()

    class Meta:
        model = Patient
        fields = "__all__"
        # extra_fields = ('doctor',)
        # depth = 1


class ChildTeethChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChildTeethChart
        fields = "__all__"


class AdultTeethChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdultTeethChart
        fields = "__all__"
