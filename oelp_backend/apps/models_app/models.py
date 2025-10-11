from __future__ import annotations

# Aggregate imports so Django loads all models when importing this app's
# models module. This ensures AUTH_USER_MODEL is registered early.

from .user import CustomUser, Role, UserRole  # noqa: F401
from .farm import Farm  # noqa: F401
from .field import Field, Device, CropLifecycleDates, FieldIrrigationMethod, FieldIrrigationPractice  # noqa: F401
from .crop_variety import Crop, CropVariety  # noqa: F401
from .soil_report import SoilTexture, SoilReport  # noqa: F401
from .irrigation import IrrigationMethods  # noqa: F401
from .assets import Asset  # noqa: F401
from .feature import Feature, FeatureType  # noqa: F401
from .plan import Plan  # noqa: F401
from .user_plan import (
    UserPlan,
    PlanFeatureUsage,
    PaymentMethod,
    Transaction,
)  # noqa: F401
from .notifications import Notification, SupportRequest  # noqa: F401
from .token import UserAuthToken  # noqa: F401
