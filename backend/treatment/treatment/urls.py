from django.urls import path
from rest_framework.routers import DefaultRouter
from treatment.views import TreatmentViewSet

router = DefaultRouter()
router.register(r'', TreatmentViewSet, basename='TreatmentViewSet')
urlpatterns = router.urls
