from __future__ import annotations

from django.apps import apps
from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def create_free_plan(sender, **kwargs):
    if sender and sender.name != "apps.models_app":
        return
    MainPlan = apps.get_model("models_app", "MainPlan")
    if not MainPlan.objects.filter(name="free").exists():
        MainPlan.objects.create(name="free", price=0, duration=36500)

