from rest_framework import serializers
from .models import Event, RSVP

class EventSerializer(serializers.ModelSerializer):
    created_by_email = serializers.ReadOnlyField(source='created_by.email')

    class Meta:
        model = Event
        fields = "__all__"
        read_only_fields = ["created_by", "time_submitted", "last_submitted"]

class RSVPSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    event_name = serializers.ReadOnlyField(source='event.name')

    class Meta:
        model = RSVP
        fields = "__all__"
        read_only_fields = ["user", "created_at"]
