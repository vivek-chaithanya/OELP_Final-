from __future__ import annotations

import csv
import io
import secrets
from datetime import date, datetime, timedelta

import razorpay
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.contenttypes.models import ContentType
from django.db.models import Count
from django.http import HttpResponse
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.models_app.token import UserAuthToken
from apps.models_app.user import CustomUser

from .auth import TokenAuthentication
from .permissions import IsOwnerOrReadOnly
from .serializers import (
    AssetSerializer,
    CropSerializer,
    CropVarietySerializer,
    DeviceSerializer,
    EnterprisePlanSerializer,
    EnterpriseUserPlanSerializer,
    FarmSerializer,
    FeatureSerializer,
    FeatureTypeSerializer,
    FieldIrrigationMethodSerializer,
    FieldSerializer,
    LoginSerializer,
    MainPlanSerializer,
    MainUserPlanSerializer,
    NotificationSerializer,
    SignUpSerializer,
    SoilReportSerializer,
    SoilTextureSerializer,
    SupportRequestSerializer,
    TokenSerializer,
    TopUpPlanSerializer,
    TopUpUserPlanSerializer,
    IrrigationMethodSerializer,
)

from apps.models_app.assets import Asset
from apps.models_app.crop_variety import Crop, CropVariety
from apps.models_app.farm import Farm
from apps.models_app.field import Field, Device, CropLifecycleDates, FieldIrrigationMethod
from apps.models_app.feature import Feature, FeatureType
from apps.models_app.plan import MainPlan, TopUpPlan, EnterprisePlan
from apps.models_app.user_plan import MainUserPlan, TopUpUserPlan, EnterpriseUserPlan
from apps.models_app.notifications import Notification, SupportRequest
from apps.models_app.irrigation import IrrigationMethods


class SignUpView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token_value = secrets.token_urlsafe(48)
        UserAuthToken.objects.update_or_create(user=user, defaults={"access_token": token_value})
        return Response({"user": UserSerializer(user).data, "token": token_value}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(request, email=serializer.validated_data["email"], password=serializer.validated_data["password"])
        if not user:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        token_value = secrets.token_urlsafe(48)
        UserAuthToken.objects.update_or_create(user=user, defaults={"access_token": token_value})
        return Response({"token": token_value})


class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({"detail": "Logged out"})


class MeView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def put(self, request):
        user = request.user
        allowed_fields = {"email", "username", "phone_number", "avatar"}
        for key, value in request.data.items():
            if key in allowed_fields:
                setattr(user, key, value)
        user.save()
        return Response(UserSerializer(user).data)


class ChangePasswordView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        if not current_password or not new_password:
            return Response({"detail": "current_password and new_password are required"}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        if not user.check_password(current_password):
            return Response({"detail": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
        from django.contrib.auth import password_validation

        password_validation.validate_password(new_password, user)
        user.set_password(new_password)
        user.save(update_fields=["password"])
        return Response({"detail": "Password changed successfully"})


class SuggestPasswordView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    def get(self, request):
        pw = secrets.token_urlsafe(12)
        return Response({"password": pw})


class DashboardView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        user = request.user
        active_fields = Field.objects.filter(user=user, is_active=True).count()
        active_crops = Field.objects.filter(user=user, crop__isnull=False).select_related("crop").count()
        plans = MainUserPlan.objects.filter(user=user, is_active=True).select_related("plan")
        current_plan = plans.first()
        notifications_count = Notification.objects.filter(receiver=user, is_read=False).count()
        recent_activity = Asset.objects.filter().order_by("-uploaded_at")[:5]
        return Response(
            {
                "active_fields": active_fields,
                "active_crops": active_crops,
                "current_plan": MainUserPlanSerializer(current_plan).data if current_plan else None,
                "unread_notifications": notifications_count,
                "recent_activity": AssetSerializer(recent_activity, many=True).data,
            }
        )


class MenuView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        # Basic role/plan gate example
        base_items = [
            {"key": "dashboard", "label": "Dashboard"},
            {"key": "crops", "label": "Crops"},
            {"key": "fields", "label": "Fields"},
            {"key": "subscriptions", "label": "Subscriptions"},
            {"key": "practices", "label": "Practices"},
            {"key": "reports", "label": "Reports"},
            {"key": "settings", "label": "Settings"},
        ]
        return Response(base_items)


class CropViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    filterset_fields = ["name"]
    search_fields = ["name"]
    ordering_fields = ["name"]


class CropVarietyViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = CropVariety.objects.select_related("crop").all()
    serializer_class = CropVarietySerializer
    filterset_fields = ["crop", "name", "is_primary"]
    search_fields = ["name", "crop__name"]
    ordering_fields = ["name"]


class FarmViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    serializer_class = FarmSerializer
    filterset_fields = ["name"]
    search_fields = ["name"]
    ordering_fields = ["name"]

    def get_queryset(self):
        return Farm.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FieldViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    serializer_class = FieldSerializer
    filterset_fields = ["farm", "crop", "is_active"]
    search_fields = ["name", "location_name"]
    ordering_fields = ["created_at", "updated_at", "name"]

    def get_queryset(self):
        return Field.objects.filter(user=self.request.user).select_related("farm", "crop", "crop_variety")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get"])
    def lifecycle(self, request, pk=None):
        field = self.get_object()
        data = CropLifecycleDates.objects.filter(field=field).values("sowing_date", "harvesting_date").first()
        return Response(data or {})


class SoilReportViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = SoilReport.objects.select_related("field", "soil_type").all()
    serializer_class = SoilReportSerializer
    filterset_fields = ["field", "soil_type"]


class IrrigationMethodViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = IrrigationMethods.objects.all()
    serializer_class = IrrigationMethodSerializer
    search_fields = ["name"]


class AssetViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user)

    @action(detail=False, methods=["get"])
    def unread_count(self, request):
        cnt = self.get_queryset().filter(is_read=False).count()
        return Response({"count": cnt})

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.is_read = True
        notif.save(update_fields=["is_read"])
        return Response({"detail": "Marked as read"})


class SupportRequestViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    serializer_class = SupportRequestSerializer

    def get_queryset(self):
        return SupportRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PracticeViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    authentication_classes = [TokenAuthentication]
    # Placeholder for practices list
    def list(self, request, *args, **kwargs):
        # Could be tied to crop lifecycle tracking
        return Response([])


class FeatureViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = Feature.objects.select_related("feature_type").all()
    serializer_class = FeatureSerializer


class FeatureTypeViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = FeatureType.objects.all()
    serializer_class = FeatureTypeSerializer


class MainPlanViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = MainPlan.objects.all()
    serializer_class = MainPlanSerializer


class TopUpPlanViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = TopUpPlan.objects.select_related("parent_main_plan").all()
    serializer_class = TopUpPlanSerializer


class EnterprisePlanViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = EnterprisePlan.objects.all()
    serializer_class = EnterprisePlanSerializer


class MainUserPlanViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = MainUserPlan.objects.select_related("user", "plan").all()
    serializer_class = MainUserPlanSerializer


class TopUpUserPlanViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = TopUpUserPlan.objects.select_related("user", "plan").all()
    serializer_class = TopUpUserPlanSerializer


class EnterpriseUserPlanViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = EnterpriseUserPlan.objects.select_related("user", "plan").all()
    serializer_class = EnterpriseUserPlanSerializer


class RazorpayCreateOrderView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        amount = int(float(request.data.get("amount", 0)) * 100)
        currency = request.data.get("currency", "INR")
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        order = client.order.create({"amount": amount, "currency": currency})
        return Response(order)


class RazorpayWebhookView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    def post(self, request):
        # TODO: verify signature, update transactions, handle refunds/status
        return Response({"status": "ok"})


class ExportCSVView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(["Field", "Crop", "Hectares"])
        for fld in Field.objects.filter(user=request.user):
            hectares = (fld.area or {}).get("hectares")
            writer.writerow([fld.name, getattr(fld.crop, "name", "-"), hectares])
        buffer.seek(0)
        response = HttpResponse(buffer.getvalue(), content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename=report.csv"
        return response


class ExportPDFView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        # Minimal PDF export placeholder
        from reportlab.pdfgen import canvas

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(100, 800, "OELP Report")
        y = 760
        for fld in Field.objects.filter(user=request.user)[:30]:
            p.drawString(100, y, f"Field: {fld.name}")
            y -= 20
        p.showPage()
        p.save()
        buffer.seek(0)
        response = HttpResponse(buffer.getvalue(), content_type="application/pdf")
        response["Content-Disposition"] = "attachment; filename=report.pdf"
        return response


# Import at end to avoid circular reference
from .serializers import UserSerializer  # noqa: E402

