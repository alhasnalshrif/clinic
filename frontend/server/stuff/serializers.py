from rest_framework import serializers

from users.models import User

from .models import Stuff


from users.models import User



class StuffSerializer(serializers.ModelSerializer):
    doctor = serializers.CharField()

    class Meta:
        model = Stuff
        fields = "__all__"
 
