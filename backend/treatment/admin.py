from django.contrib import admin

# Register your models here.
from .models import Treatment, AdultTeethChart, ChildTeethChart

admin.site.register(Treatment)
admin.site.register(AdultTeethChart)
admin.site.register(ChildTeethChart)
