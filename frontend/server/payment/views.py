from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)

from .models import Bill
from .serializers import BillSerializer
from users.models import User
# from appointment.models import Appointment


class BilltViewSet(viewsets.ModelViewSet):
    serializer_class = BillSerializer
    queryset = Bill.objects.select_related(
        # 'doctor',
        'appointment',
    )
    permission_classes = (permissions.AllowAny, )
