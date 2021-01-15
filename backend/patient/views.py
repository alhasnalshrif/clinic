from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)

from .models import Patient, ChildTeethChart, AdultTeethChart
from .serializers import PatientSerializer, ChildTeethChartSerializer, AdultTeethChartSerializer
# from django.contrib.auth.models import User
from users.models import User


class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    queryset = Patient.objects.select_related(
        'doctor',
    )
    permission_classes = (permissions.AllowAny, )

    def create(self, request, *args, **kwargs):
        patient_data = request.data

        new_car = Patient.objects.create(doctor=User.objects.get(username=patient_data["doctor"]),
                                         name=patient_data["name"],
                                         phone=patient_data["phone"],

                                         bloodgroup=patient_data["bloodgroup"],
                                         sex=patient_data["sex"],
                                         age=patient_data["age"])

        new_car.save()

        serializer = PatientSerializer(new_car)

        return Response(serializer.data)


class ChildTeethChartViewSet(viewsets.ModelViewSet):
    serializer_class = ChildTeethChartSerializer
    queryset = ChildTeethChart.objects.all()
    permission_classes = (permissions.AllowAny,)


class AdultTeethChartViewSet(viewsets.ModelViewSet):
    serializer_class = AdultTeethChartSerializer
    queryset = AdultTeethChart.objects.all()
    permission_classes = (permissions.AllowAny,)
