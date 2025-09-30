from __future__ import annotations

from django.db import models
from django.utils import timezone

from .plan import MainPlan, TopUpPlan, EnterprisePlan
from .user import CustomUser
from .feature import Feature


class MainUserPlan(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    plan = models.ForeignKey(MainPlan, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    expire_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TopUpUserPlan(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    plan = models.ForeignKey(TopUpPlan, on_delete=models.CASCADE)
    purchase_date = models.DateTimeField(auto_now_add=True)
    expire_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class EnterpriseUserPlan(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    plan = models.ForeignKey(EnterprisePlan, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    expire_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class MainPlanFeatureUsage(models.Model):
    user_plan = models.ForeignKey(MainUserPlan, on_delete=models.CASCADE)
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE)
    max_count = models.IntegerField()
    used_count = models.IntegerField(default=0)
    duration_days = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TopUpPlanFeatureUsage(models.Model):
    user_plan = models.ForeignKey(TopUpUserPlan, on_delete=models.CASCADE)
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE)
    max_count = models.IntegerField()
    used_count = models.IntegerField(default=0)
    duration_days = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class EnterprisePlanFeatureUsage(models.Model):
    user_plan = models.ForeignKey(EnterpriseUserPlan, on_delete=models.CASCADE)
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE)
    max_count = models.IntegerField()
    used_count = models.IntegerField(default=0)
    duration_days = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

