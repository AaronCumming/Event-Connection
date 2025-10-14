"""
urls.py
Aaron Cumming
2025-10-09

Events Urls
"""

from rest_framework import routers
from events import views


# DRF has custom routing defined to handle the viewsets.
# We take advantage of it here.
router = routers.DefaultRouter()
router.register(r"records", views.RecordViewSet, "records")

# Make sure to spell urlpatterns correctly,
# otherwise Django cannot find your routes.
urlpatterns = router.urls