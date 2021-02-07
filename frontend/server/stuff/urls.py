from rest_framework.routers import DefaultRouter
from .views import StuffViewSet

router = DefaultRouter()
router.register(r'', StuffViewSet, basename='Stuff')
urlpatterns = router.urls
