from __future__ import annotations

from django.apps import apps
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.db import connection


@receiver(post_migrate)
def create_free_plan(sender, **kwargs):
    if sender and sender.name != "apps.models_app":
        return
    # Ensure table exists before querying during CI/first migrations
    if "models_app_mainplan" not in connection.introspection.table_names():
        return
    MainPlan = apps.get_model("models_app", "MainPlan")
    if not MainPlan.objects.filter(name="free").exists():
        MainPlan.objects.create(name="free", price=0, duration=36500)

