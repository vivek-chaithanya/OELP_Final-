from __future__ import annotations

from django.db import models

from .feature import Feature
from .plan import MainPlan, TopUpPlan, EnterprisePlan


class MainPlanFeature(models.Model):
    plan = models.ForeignKey(MainPlan, on_delete=models.CASCADE)
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE)
    max_count = models.IntegerField()
    duration_days = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TopUpPlanFeature(models.Model):
    plan = models.ForeignKey(TopUpPlan, on_delete=models.CASCADE)
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE)
    max_count = models.IntegerField()
    duration_days = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class EnterprisePlanFeature(models.Model):
    plan = models.ForeignKey(EnterprisePlan, on_delete=models.CASCADE)
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE)
    max_count = models.IntegerField()
    duration_days = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

