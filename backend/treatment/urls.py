
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ChildTeethChartViewSet, AdultTeethChartViewSet, TreatmentViewSet

router = DefaultRouter()
router.register(r'a', ChildTeethChartViewSet, basename='AdultTeethChart')
urlpatterns = router.urls

router = DefaultRouter()
router.register(r'b', AdultTeethChartViewSet, basename='AdultTeethChart')
urlpatterns = router.urls

router = DefaultRouter()
router.register(r't', TreatmentViewSet, basename='TreatmentViewSet')
urlpatterns = router.urls
