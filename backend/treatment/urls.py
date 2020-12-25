from .views import (
    TreatmentListView,
    TreatmentDetailView,
    TreatmentCreateView,
    TreatmentUpdateView,
    TreatmentDeleteView
)
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ChildTeethChartViewSet, AdultTeethChartViewSet

router = DefaultRouter()
router.register(r'a/', ChildTeethChartViewSet, basename='AdultTeethChart')
urlpatterns = router.urls

router = DefaultRouter()
router.register(r'b/', AdultTeethChartViewSet, basename='AdultTeethChart')
urlpatterns = router.urls


urlpatterns = [
    path('c/', TreatmentListView.as_view()),
    path('c/create/', TreatmentCreateView.as_view()),
    path('c/<pk>/', TreatmentDetailView.as_view()),
    path('c/<pk>/update/', TreatmentUpdateView.as_view()),
    path('c/<pk>/delete/', TreatmentDeleteView.as_view())
]
