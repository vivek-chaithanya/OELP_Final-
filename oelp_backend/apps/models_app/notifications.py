from __future__ import annotations

from django.db import models

from .user import CustomUser


class Notification(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name="sent_notifications")
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:  # pragma: no cover
        return f"Notification to {self.receiver}"


class SupportCategory(models.TextChoices):
    CROP = "crop", "Crop"
    TRANSACTION = "transaction", "Transaction"
    ANALYSIS = "analysis", "Analysis"
    SOFTWARE_ISSUE = "software_issue", "Software Issue"


class SupportRequest(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    category = models.CharField(max_length=32, choices=SupportCategory.choices)
    description = models.TextField()
    assigned_role = models.CharField(max_length=50, default="support")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:  # pragma: no cover
        return f"SupportRequest({self.user})"

