from django.shortcuts import render

from rest_framework import viewsets

from .models import User
# from .models import Profile, User
# from .serializers import ProfileSerializer, UsersSerializer
from .serializers import UsersSerializer

from rest_framework import permissions


# class ProfileViewSets(viewsets.ModelViewSet):
#     serializer_class = ProfileSerializer
#     queryset = Profile.objects.all()
#     permission_classes = (permissions.AllowAny, )


class UsersViewSets(viewsets.ModelViewSet):
    serializer_class = UsersSerializer
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny, )
