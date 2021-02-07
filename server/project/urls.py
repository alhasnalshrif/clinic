from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    path('auth/', include('djoser.urls.authtoken')),

    path('treatments/', include('treatment.urls')),
    path('treatmentsid/', include('treatment.filter.urls')),
    path('childteeth/', include('patient.childurl.urls')),
    path('adultteeth/', include('patient.adultteeth.urls')),

    path('patient/', include('patient.urls')),
    path('appointments/', include('appointment.urls')),

    path('users/', include('users.users.urls')),
    path('stuff/', include('stuff.urls')),
    path('payment/', include('payment.urls')),

]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns

urlpatterns += [re_path(r"^.*",
                        TemplateView.as_view(template_name="index.html"))]
