from rest_framework import serializers


from .models import Bill
from users.models import User

class BillSerializer(serializers.ModelSerializer):
    # doctor = serializers.CharField()
    appointment = serializers.CharField()

    class Meta:
        model = Bill
        fields = "__all__"
