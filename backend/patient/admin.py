from django.contrib import admin




from .models import Patient, AdultTeethChart, ChildTeethChart

admin.site.register(Patient)
admin.site.register(AdultTeethChart)
admin.site.register(ChildTeethChart)