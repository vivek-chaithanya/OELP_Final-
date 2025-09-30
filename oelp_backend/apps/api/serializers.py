from __future__ import annotations

from django.contrib.auth import password_validation
from rest_framework import serializers

from apps.models_app.assets import Asset
from apps.models_app.crop_variety import Crop, CropVariety
from apps.models_app.farm import Farm
from apps.models_app.field import Field, Device, CropLifecycleDates, FieldIrrigationMethod
from apps.models_app.feature import Feature, FeatureType
from apps.models_app.feature_plan import MainPlanFeature, TopUpPlanFeature, EnterprisePlanFeature
from apps.models_app.irrigation import IrrigationMethods
from apps.models_app.notifications import Notification, SupportRequest
from apps.models_app.plan import MainPlan, TopUpPlan, EnterprisePlan
from apps.models_app.soil_report import SoilTexture, SoilReport
from apps.models_app.token import UserAuthToken
from apps.models_app.user import CustomUser
from apps.models_app.user_plan import (
    MainUserPlan,
    TopUpUserPlan,
    EnterpriseUserPlan,
    MainPlanFeatureUsage,
    TopUpPlanFeatureUsage,
    EnterprisePlanFeatureUsage,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "username", "phone_number", "avatar", "date_joined")


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ("email", "username", "phone_number", "password")

    def validate_password(self, value: str) -> str:
        password_validation.validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = CustomUser.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAuthToken
        fields = ("access_token", "last_login")


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = ("id", "name", "icon_url")


class CropVarietySerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source="crop.name", read_only=True)

    class Meta:
        model = CropVariety
        fields = ("id", "crop", "name", "is_primary", "crop_name")


class FarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = ("id", "name", "user")


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ("id", "name", "serial_number")


class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = (
            "id",
            "name",
            "farm",
            "device",
            "crop",
            "crop_variety",
            "user",
            "boundary",
            "location_name",
            "area",
            "image",
            "is_active",
            "is_locked",
            "created_at",
            "updated_at",
        )


class CropLifecycleDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropLifecycleDates
        fields = ("id", "field", "sowing_date", "harvesting_date")


class FieldIrrigationMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldIrrigationMethod
        fields = ("id", "field", "irrigation_method")


class SoilTextureSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilTexture
        fields = ("id", "name", "icon")


class SoilReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilReport
        fields = (
            "id",
            "field",
            "ph",
            "ec",
            "nitrogen",
            "phosphorous",
            "potassium",
            "boron",
            "copper",
            "iron",
            "zinc",
            "manganese",
            "soil_type",
            "report_link",
        )


class IrrigationMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = IrrigationMethods
        fields = ("id", "name")


class FeatureTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureType
        fields = ("id", "name", "description", "created_at", "updated_at")


class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ("id", "name", "feature_type", "created_at", "updated_at")


class MainPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainPlan
        fields = ("id", "name", "price", "duration")


class TopUpPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopUpPlan
        fields = ("id", "name", "price", "parent_main_plan", "duration")


class EnterprisePlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnterprisePlan
        fields = ("id", "name", "price", "duration")


class MainUserPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainUserPlan
        fields = ("id", "user", "plan", "start_date", "end_date", "expire_at", "is_active")


class TopUpUserPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopUpUserPlan
        fields = ("id", "user", "plan", "purchase_date", "expire_at", "is_active")


class EnterpriseUserPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnterpriseUserPlan
        fields = ("id", "user", "plan", "start_date", "end_date", "expire_at", "is_active")


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "sender", "receiver", "message", "is_read", "created_at")


class SupportRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportRequest
        fields = ("id", "user", "category", "description", "assigned_role", "created_at", "updated_at")


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ("id", "file", "content_type", "object_id", "uploaded_at")

