from rest_framework import serializers

from django.contrib.auth.models import User

from .models import Treatment, ChildTeethChart, AdultTeethChart


class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = "__all__"


class ChildTeethChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChildTeethChart
        fields = "__all__"


class AdultTeethChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdultTeethChart
        fields = "__all__"


# class AssignmentSerializer(serializers.ModelSerializer):
#     questions = serializers.SerializerMethodField()
#     teacher = StringSerializer(many=False)

#     class Meta:
#         model = Assignment
#         fields = ('__all__')

#     def get_questions(self, obj):
#         questions = QuestionSerializer(obj.questions.all(), many=True).data
#         return questions

#     def create(self, request):
#         data = request.data
#         print(data)

#         assignment = Assignment()
#         teacher = User.objects.get(username=data['teacher'])
#         # teacher = User.objects.all()
#         assignment.teacher = teacher
#         assignment.title = data['title']
#         assignment.save()

#         order = 1
#         for q in data['questions']:
#             newQ = Question()
#             newQ.question = q['title']
#             newQ.order = order
#             newQ.save()

#             for c in q['choices']:
#                 newC = Choice()
#                 newC.title = c
#                 newC.save()
#                 newQ.choices.add(newC)

#             newQ.answer = Choice.objects.get(title=q['answer'])
#             newQ.assignment = assignment
#             newQ.save()
#             order += 1
#         return assignment
