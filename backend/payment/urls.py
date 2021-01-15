from rest_framework.routers import DefaultRouter
from .views import BilltViewSet

router = DefaultRouter()
router.register(r'', BilltViewSet, basename='bill')
urlpatterns = router.urls
