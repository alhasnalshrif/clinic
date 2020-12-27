from rest_framework.response import Response

from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, CreateAPIView

from patient.models import Patient


from .models import Treatment, ChildTeethChart, AdultTeethChart
from .serializers import TreatmentSerializer, ChildTeethChartSerializer, AdultTeethChartSerializer


class TreatmentViewSet(viewsets.ModelViewSet):
    serializer_class = TreatmentSerializer
    queryset = Treatment.objects.all()
    permission_classes = (permissions.AllowAny,)

   # for recive two or more filter
    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        print(params['pk'])
        params_list = params['pk'].split('-')
        cars = Treatment.objects.filter(
            toothPosition=params_list[0], patient=params_list[1])
        serializer = TreatmentSerializer(cars, many=True)
        return Response(serializer.data)


class ChildTeethChartViewSet(viewsets.ModelViewSet):
    serializer_class = ChildTeethChartSerializer
    queryset = ChildTeethChart.objects.all()
    permission_classes = (permissions.AllowAny,)


class AdultTeethChartViewSet(viewsets.ModelViewSet):
    serializer_class = AdultTeethChartSerializer
    queryset = AdultTeethChart.objects.all()
    permission_classes = (permissions.AllowAny,)
