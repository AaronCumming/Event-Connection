"""
views.py
Aaron Cumming
2025-10-09

Views.py
"""

from django.shortcuts import render
from rest_framework import viewsets
from .models import Record
from .serializers import RecordSerializer


# ViewSet for Record — handles list, create, retrieve, update, delete
class RecordViewSet(viewsets.ModelViewSet):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
