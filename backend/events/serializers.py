from rest_framework import serializers
from .models import Record


# Serializer for the Record model
class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = "__all__"