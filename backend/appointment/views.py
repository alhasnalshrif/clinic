from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)

from .models import Appointment
from .serializers import AppointmentSerializer
# from django.contrib.auth.models import User
from patient.models import Patient
from users.models import User


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.select_related(
        'doctor',
        'patient',
    )
    permission_classes = (permissions.AllowAny, )

    def create(self, request, *args, **kwargs):
        patient_data = request.data

        new_appointment = Appointment.objects.create(doctor=User.objects.get(username=patient_data["doctor"]),
                                                     patient=Patient.objects.get(
                                                         name=patient_data["patient"]),
                                                     token=patient_data["token"],
                                                     date=patient_data["date"],
                                                     time=patient_data["time"],
                                                     reason=patient_data["reason"],
                                                     )

        new_appointment.save()

        serializer = AppointmentSerializer(new_appointment)

        return Response(serializer.data)
