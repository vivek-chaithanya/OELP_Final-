from __future__ import annotations

from django.apps import apps
from django.db.models.signals import post_migrate, post_save
from django.dispatch import receiver
from django.db import connection
from django.contrib.contenttypes.models import ContentType


@receiver(post_migrate)
def seed_core_data(sender, **kwargs):
    if sender and sender.name != "apps.models_app":
        return
    existing_tables = set(connection.introspection.table_names())

    # Seed roles
    if "models_app_role" in existing_tables:
        Role = apps.get_model("models_app", "Role")
        roles = [
            ("SuperAdmin", "Manages the entire platform, including user roles and system settings."),
            ("Admin", "Oversees platform operations and user management with limited system-level access."),
            ("Agronomist", "Provides expert advice on crop management and agricultural practices."),
            ("Support", "Handles user queries and technical support."),
            ("Analyst", "Analyzes data to generate insights and reports."),
            ("Business", "Manages subscriptions, billing, and business-related operations."),
            ("Developer", "Maintains and develops platform features and integrations."),
            ("End-App-User", "Standard user interacting with platform features like crops and fields."),
        ]
        for name, desc in roles:
            Role.objects.get_or_create(name=name, defaults={"description": desc})

    # Seed irrigation methods
    if "models_app_irrigationmethods" in existing_tables:
        IrrigationMethods = apps.get_model("models_app", "IrrigationMethods")
        for nm in ["Drip", "Sprinkler", "Flood", "Furrow", "Pivot"]:
            IrrigationMethods.objects.get_or_create(name=nm)

    # Seed soil textures
    if "models_app_soiltexture" in existing_tables:
        SoilTexture = apps.get_model("models_app", "SoilTexture")
        textures = [
            ("Sandy", "https://example.com/icons/sandy.png"),
            ("Loam", "https://example.com/icons/loam.png"),
            ("Clay", "https://example.com/icons/clay.png"),
            ("Silt", "https://example.com/icons/silt.png"),
        ]
        for name, icon in textures:
            SoilTexture.objects.get_or_create(name=name, defaults={"icon": icon})

    # Seed features/types (up to 3 feature types and 5 features)
    if "models_app_featuretype" in existing_tables and "models_app_feature" in existing_tables:
        FeatureType = apps.get_model("models_app", "FeatureType")
        Feature = apps.get_model("models_app", "Feature")
        type_map = {}
        for t in [
            ("Core", "Core application features"),
            ("Analytics", "Reporting and analysis"),
            ("Integrations", "External integrations"),
        ]:
            ft, _ = FeatureType.objects.get_or_create(name=t[0], defaults={"description": t[1]})
            type_map[t[0]] = ft
        for name, tname in [
            ("Fields", "Core"),
            ("Crops", "Core"),
            ("Reports", "Analytics"),
            ("Soil Analysis", "Analytics"),
            ("API Access", "Integrations"),
        ]:
            Feature.objects.get_or_create(name=name, defaults={"feature_type": type_map[tname]})

    # Seed unified plans and link features (max 2 per plan)
    if "models_app_plan" in existing_tables and "models_app_planfeature" in existing_tables:
        Plan = apps.get_model("models_app", "Plan")
        PlanFeature = apps.get_model("models_app", "PlanFeature")
        Feature = apps.get_model("models_app", "Feature")
        plans = [
            ("Free", "main", 0, 36500),
            ("Pro", "main", 29, 30),
            ("Enterprise", "enterprise", 129, 30),
        ]
        for name, ptype, price, duration in plans:
            plan, _ = Plan.objects.get_or_create(
                name=name,
                defaults={"type": ptype, "price": price, "duration": duration},
            )
            # Attach up to 2 features
            feats = list(Feature.objects.all()[:2])
            for f in feats:
                PlanFeature.objects.get_or_create(plan=plan, feature=f, defaults={"max_count": 1000, "duration_days": duration})


# Basic activity logging for Field and SoilReport changes
@receiver(post_save)
def log_user_activity(sender, instance, created, **kwargs):
    try:
        models_module = sender.__module__
    except Exception:
        return
    if not models_module.startswith("apps.models_app"):
        return
    # Only track selected models for now
    track_models = {"Field", "SoilReport", "Crop", "CropVariety"}
    model_name = sender.__name__
    if model_name not in track_models:
        return
    user = getattr(instance, "user", None) or getattr(getattr(instance, "farm", None), "user", None)
    if not user:
        return
    try:
        Activity = apps.get_model("models_app", "UserActivity")
        ct = ContentType.objects.get_for_model(sender)
        action = "create" if created else "update"
        Activity.objects.create(user=user, action=action, content_type=ct, object_id=instance.pk, description=f"{model_name} {action}")
    except Exception:
        pass

