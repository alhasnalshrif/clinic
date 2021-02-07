
from django.urls import path
from rest_framework.routers import DefaultRouter
from users.views import UsersViewSets


router = DefaultRouter()
router.register(r'', UsersViewSets, basename='UsersViewSets')
urlpatterns = router.urls
