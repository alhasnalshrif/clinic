from rest_framework import serializers


from .models import Treatment
# from users.models import User


class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = "__all__"

