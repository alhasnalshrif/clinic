from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)

from .models import Stuff
from .serializers import StuffSerializer
# from django.contrib.auth.models import User
from users.models import User


class StuffViewSet(viewsets.ModelViewSet):
    serializer_class = StuffSerializer
    queryset = Stuff.objects.select_related(
        'doctor',
    )
    permission_classes = (permissions.AllowAny, )

    def create(self, request, *args, **kwargs):
        stuff_data = request.data

        new_car = Stuff.objects.create(doctor=User.objects.get(username=stuff_data["doctor"]),
                                         name=stuff_data["name"],
                                         phone=stuff_data["phone"],
                                         sex=stuff_data["sex"],
                                         age=stuff_data["age"])

        new_car.save()

        serializer = StuffSerializer(new_car)

        return Response(serializer.data)
