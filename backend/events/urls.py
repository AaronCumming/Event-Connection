"""
urls.py
Aaron Cumming
2025-10-09

Events Urls
"""

from rest_framework import routers
from .views import EventViewSet, RSVPViewSet


# DRF has custom routing defined to handle the viewsets.
router = routers.DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'rsvps', RSVPViewSet, basename='rsvp')

urlpatterns = router.urls