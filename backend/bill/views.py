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
from treatment.models import Treatment


class BilltViewSet(viewsets.ModelViewSet):
    serializer_class = BillSerializer
    queryset = Bill.objects.select_related(
        'doctor',
        'treatment',
    )
    permission_classes = (permissions.AllowAny, )

    # def create(self, request, *args, **kwargs):
    #     bill_data = request.data

    #     new_appointment = Bill.objects.create(
    #         doctor=User.objects.get(username=bill_data["doctor"]),
    #         treatment=Treatment.bill_data.get(
    #             name=bill_data["patient"]),

    #         amount_paid=bill_data["token"],
    #         current_balance_before=bill_data["date"],
    #         new_balance_after=bill_data["time"],
    #         date=bill_data["reason"],
    #     )

    #     new_appointment.save()

    #     serializer = BillSerializer(new_appointment)

    #     return Response(serializer.data)
