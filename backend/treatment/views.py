from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import viewsets
from patient.models import Patient
from .models import Treatment
from .serializers import TreatmentSerializer

from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView
)
from rest_framework.decorators import APIView


class TreatmentViewSet(viewsets.ModelViewSet):
    serializer_class = TreatmentSerializer
    queryset = Treatment.objects.all()
    permission_classes = (permissions.AllowAny,)

    def retrieve(self, request, *args, **kwargs):
        params = kwargs

        cars = Treatment.objects.filter(patient=params['pk'])
        serializer = TreatmentSerializer(cars, many=True)
        return Response(serializer.data)


class TreatmentViewSetFilter(viewsets.ModelViewSet):
    serializer_class = TreatmentSerializer
    queryset = Treatment.objects.all()
    permission_classes = (permissions.AllowAny,)

    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        print(params['pk'])
        params_list = params['pk'].split('-')
        cars = Treatment.objects.filter(
            toothPosition=params_list[0], patient=params_list[1])
        serializer = TreatmentSerializer(cars, many=True)
        return Response(serializer.data)

