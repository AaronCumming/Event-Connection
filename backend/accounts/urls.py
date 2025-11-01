"""
urls.py
Aaron Cumming
2025-10-09

Events Urls
"""

from rest_framework import routers
from .views import UserViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = router.urls
