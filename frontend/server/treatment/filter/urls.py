from django.urls import path
from rest_framework.routers import DefaultRouter
from treatment.views import TreatmentViewSetFilter


router = DefaultRouter()
router.register(r'', TreatmentViewSetFilter, basename='TreatmentViewSet')
urlpatterns = router.urls


# urlpatterns = [

#     path('<pk>/', TreatmentAPI.as_view()),

# ]
