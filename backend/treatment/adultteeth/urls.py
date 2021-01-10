
from django.urls import path
from rest_framework.routers import DefaultRouter
from treatment.views import AdultTeethChartViewSet


router = DefaultRouter()
router.register(r'', AdultTeethChartViewSet, basename='AdultTeethChart')
urlpatterns = router.urls
