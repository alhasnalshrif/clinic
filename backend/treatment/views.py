from rest_framework.response import Response
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView
)
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, CreateAPIView


from .models import Treatment, ChildTeethChart, AdultTeethChart
from .serializers import TreatmentSerializer, ChildTeethChartSerializer, AdultTeethChartSerializer


class TreatmentListView(ListAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer
    permission_classes = (permissions.AllowAny, )


class TreatmentDetailView(RetrieveAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer
    permission_classes = (permissions.AllowAny, )


class TreatmentCreateView(CreateAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer
    permission_classes = (permissions.AllowAny, )


class TreatmentUpdateView(UpdateAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer
    permission_classes = (permissions.IsAuthenticated, )


class TreatmentDeleteView(DestroyAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer
    permission_classes = (permissions.IsAuthenticated, )


class ChildTeethChartViewSet(viewsets.ModelViewSet):
    serializer_class = ChildTeethChartSerializer
    queryset = ChildTeethChart.objects.all()
    permission_classes = (permissions.AllowAny,)


class AdultTeethChartViewSet(viewsets.ModelViewSet):
    serializer_class = AdultTeethChartSerializer
    queryset = AdultTeethChart.objects.all()
    permission_classes = (permissions.AllowAny,)
