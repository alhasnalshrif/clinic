from rest_framework import serializers



from .models import Appointment
# from patient.models import Patient


# class PatientSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Patient
#         fields = ('name',)




class AppointmentSerializer(serializers.ModelSerializer):
    # doctor = UserSerializer()
    # patient = PatientSerializer()
    doctor = serializers.CharField()
    patient = serializers.CharField()

    class Meta:
        model = Appointment
        fields = "__all__"
        # depth = 1
