from rest_framework.routers import DefaultRouter
from patient.views import PatientViewSet

router = DefaultRouter()
router.register(r'', PatientViewSet, basename='patient')
urlpatterns = router.urls
