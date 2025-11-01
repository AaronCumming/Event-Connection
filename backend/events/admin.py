from django.contrib import admin

# Register your models here.
from .models import Event, RSVP


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "event_time", "created_by")
    list_filter = ("status", "event_time")
    readonly_fields = ("time_submitted", "last_submitted")

@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    list_display = ("user", "event", "status", "created_at")
    list_filter = ("status",)