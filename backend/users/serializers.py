# from .models import Profile, User
from .models import User


# from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers
# from django.contrib.auth import get_user_model
# User = get_user_model()


# class UserCreateSerializer(UserCreateSerializer):
#     class Meta(UserCreateSerializer.Meta):
#         model = User
#         fields = "__all__"


# class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Profile
#         fields = "__all__"


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = "__all__"
        fields = ('id', 'username', 'group', 'is_superuser',
                  'date_joined', 'last_login')
