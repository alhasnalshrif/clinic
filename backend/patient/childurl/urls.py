from django.urls import path
from rest_framework.routers import DefaultRouter
from patient.views import ChildTeethChartViewSet

router = DefaultRouter()
router.register(r'', ChildTeethChartViewSet, basename='ChildTeethChart')
urlpatterns = router.urls