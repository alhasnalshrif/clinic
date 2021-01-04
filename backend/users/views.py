from django.shortcuts import render

from rest_framework import viewsets

from .models import Profile
from .serializers import ProfileSerializer

from rest_framework import permissions


class ProfileSerializer(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = (permissions.AllowAny, )
